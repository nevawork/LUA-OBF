// NEVAHEX-VM — proto tree serialization & blob framing.
// Cipher primitives live in src/engine/crypto/cipher.ts; watermark spread in
// src/protection/watermark.ts. This module keeps the wire format and re-exports
// the historical names so existing call sites stay stable.
//
// Wire v3.2 (Phase 2 dispatch hardening):
//   • every proto stores five RANDOM FIELD KEYS; decoded instructions become
//     tables keyed by them (Luraph-style non-positional records)
//   • jump offsets are SPLIT into two shares (B1+B2) summed at dispatch
//   • opcode bytes are stored ROLLING-KEY ENCODED (opE); the physical value
//     never rests in the artifact (engine/runtime/opencode.ts)
// The TS reader re-sums shares so internal consumers still see [op,a,b,c]
// tuples, with op == opE exactly as the runtime will see it post-decode.
// Canonical location: src/engine/vm/serializer.ts
import { Proto } from "./opcodes";
import {
  M31, normSeed, makeKeyStream, wmSeeds,
} from "../crypto/cipher";
import {
  OpenCodeParams, initialRk, stepRk, encodeOp,
} from "../runtime/opencode";
import { spreadWatermark, unspreadWatermark, crc16 } from "../../protection/watermark";

export type Seeds = [number, number, number, number];

export { M31, normSeed, makeKeyStream, wmSeeds, spreadWatermark, unspreadWatermark, crc16 };

/** per-build instruction record field keys (shared by all protos in a build) */
export interface InstrFieldKeys {
  OP: number;
  A: number;
  B1: number;
  B2: number;
  C: number;
}

export interface SerializeCtx {
  rng?: { int(n: number): number };
  /** physical opcodes whose B operand is a relative jump offset */
  jumpOps?: Set<number>;
  /** rolling-key opcode encoding params; omitted ⇒ raw opcodes (legacy/tests) */
  opencode?: OpenCodeParams;
  /**
   * normalized seeds[3] ("aux") — root of the per-proto constant-payload mask
   * streams. Defaults to a fixed constant for legacy/tests; production builds
   * always supply it so constant payloads never rest unmasked on the wire.
   */
  constKey?: number;
  /**
   * logical→physical opcode mapping. When supplied, the CLOSURE global-id
   * remap keys off the PHYSICAL value perm[CLOSURE] instead of the logical
   * constant — REQUIRED whenever code arrives already permuted (pipeline
   * path). Legacy/direct callers omit it and remap against logical 18.
   */
  permMap?: number[];
  /**
   * APEX W1.2 keyless schedule: two uint32 share components embedded into
   * the prologue filler (big-endian) at filler offsets 3..6 and 7..10.
   * The loader reassembles the cipher registers from these bytes plus decoy
   * pool entries — no seed literal ships in cleartext form. Requires
   * prologueLen ≥ 12 (guaranteed: minimum is 16).
   */
  prologueShares?: [number, number];
}

export function encryptBlob(plain: Uint8Array, seeds: Seeds): Buffer {
  const keys = makeKeyStream(seeds[0], seeds[1])(plain.length);
  const out = Buffer.alloc(plain.length);
  for (let i = 0; i < plain.length; i++) out[i] = (plain[i] + keys[i]) & 0xff;
  return out;
}

export function decryptBlob(cipher: Uint8Array, seeds: Seeds): Buffer {
  const keys = makeKeyStream(seeds[0], seeds[1])(cipher.length);
  const out = Buffer.alloc(cipher.length);
  for (let i = 0; i < cipher.length; i++) out[i] = (cipher[i] - keys[i] + 256) & 0xff;
  return out;
}

// ---- varints ----

export function putUvarint(buf: number[], v: number): void {
  let x = v >>> 0;
  do {
    let b = x & 0x7f;
    x >>>= 7;
    if (x !== 0) b |= 0x80;
    buf.push(b);
  } while (x !== 0);
}

export function putSvarint(buf: number[], v: number): void {
  putUvarint(buf, v >= 0 ? v * 2 : -v * 2 - 1);
}

class Reader {
  pos = 0;
  constructor(public data: Uint8Array) {}
  u8(): number {
    return this.data[this.pos++];
  }
  uvarint(): number {
    let shift = 0;
    let r = 0;
    for (;;) {
      const b = this.data[this.pos++];
      r += (b & 0x7f) * Math.pow(2, shift);
      if (!(b & 0x80)) return r;
      shift += 7;
    }
  }
  svarint(): number {
    const u = this.uvarint();
    return u % 2 === 1 ? -(u + 1) / 2 : u / 2;
  }
  bytesStr(n: number): string {
    let s = "";
    for (let i = 0; i < n; i++) s += String.fromCharCode(this.data[this.pos++]);
    return s;
  }
}

export interface SerializedBlob {
  plain: Buffer;
  flat: Proto[];
  rootPid: number;
  /** field keys embedded on the wire (needed by the emitter/integrity) */
  keys: InstrFieldKeys;
}

/** deterministic stand-in stream for rng-less (legacy/test) serialization */
function fallbackRng(seedNum: number): { int(n: number): number } {
  let s = (seedNum * 2654435761) % 2147483647;
  if (s === 0) s = 1;
  return {
    int(n: number): number {
      s = (s * 48271) % 2147483647;
      return s % n;
    },
  };
}

function drawKeys(rng: { int(n: number): number }): InstrFieldKeys {
  const used = new Set<number>();
  const draw = (): number => {
    for (;;) {
      const k = 1000 + rng.int(998984);
      if (!used.has(k)) {
        used.add(k);
        return k;
      }
    }
  };
  return { OP: draw(), A: draw(), B1: draw(), B2: draw(), C: draw() };
}

export function serializeProto(root: Proto, wmRegion?: Buffer, ctx?: SerializeCtx): SerializedBlob {
  // flatten tree & remap CLOSURE operands to global 1-based proto ids
  // (compiler emits CLOSURE with the 1-based index into the parent's protos)
  const flat: Proto[] = [];
  const idMap = new Map<Proto, number>();
  const assign = (p: Proto): number => {
    if (idMap.has(p)) return idMap.get(p)!;
    const id = flat.length + 1;
    flat.push(p);
    idMap.set(p, id);
    for (const sub of p.protos) assign(sub);
    return id;
  };
  assign(root);
  // CLOSURE global-id remap. Under the pipeline the tree is ALREADY permuted,
  // so CLOSURE must be recognized by its PHYSICAL value; direct/legacy calls
  // (unpermuted code) match the logical constant. Fused superop ids (≥1000)
  // and NOPed members can never collide: permutation is bijective over 0..50.
  const closurePhys = ctx?.permMap ? ctx.permMap[18 /* Op.CLOSURE */] : 18;
  for (const p of flat) {
    for (const ins of p.code) {
      if (ins[0] === closurePhys) {
        ins[1] = idMap.get(p.protos[ins[1] - 1])!;
      }
    }
  }
  const rng = ctx?.rng ?? fallbackRng(flat.length + 7);
  const keys = drawKeys(rng);
  const jumpOps = ctx?.jumpOps;
  const oc = ctx?.opencode;
  const constKey = ctx?.constKey ?? 2147483642;

  const buf: number[] = [];
  // ---- framing v3: no magic header, randomized prologue ----
  // byte0 = 0x80 | prologueLen  (format tag in the high bit, length in low 7)
  // bytes 1..prologueLen = high-entropy filler drawn from the build rng.
  // The old "NVX\x02" magic gave any attacker a free known-plaintext crib at
  // offset 0; the prologue denies them any stable prefix.
  const prologueLen = 16 + rng.int(49);
  const filler: number[] = [];
  for (let i = 0; i < prologueLen; i++) filler.push(rng.int(256));
  // W1.2: embed the two share components big-endian at filler offsets 3..6
  // and 7..10 (0-based). Plaintext layout after the hdr byte is
  // D[2 .. 1+prologueLen], so the loader reads D[5..8] and D[9..12].
  const shares = ctx?.prologueShares;
  if (shares) {
    for (let pair = 0; pair < 2; pair++) {
      let v = shares[pair] >>> 0;
      for (let b = 3; b >= 0; b--) {
        filler[3 + pair * 4 + b] = v & 0xff;
        v = Math.floor(v / 256);
      }
    }
  }
  for (let i = 0; i < prologueLen; i++) buf.push(filler[i]);
  buf.unshift(0x80 | prologueLen);
  putUvarint(buf, flat.length);
  for (let pid = 0; pid < flat.length; pid++) {
    writeProto(buf, flat[pid], pid + 1, keys, rng, jumpOps, oc, constKey);
  }
  if (wmRegion && wmRegion.length > 0) {
    putUvarint(buf, wmRegion.length);
    for (const b of wmRegion) buf.push(b);
  } else {
    putUvarint(buf, 0);
  }
  return { plain: Buffer.from(buf), flat, rootPid: 1, keys };
}

/**
 * Per-proto constant-payload mask seed. Mirrored EXACTLY by the runtime CV
 * accessor (emitter): kk=(CK0+pid*7919)%2147483646, <1 ⇒ +2147483646, then a
 * 48271-Lehmer stream whose low byte masks each payload byte additively.
 */
function constSeed(constKey: number, pid: number): number {
  return normSeed(constKey + pid * 7919);
}

/** advance the const mask stream and return the mask byte for one payload byte */
function constMaskByte(g: { v: number }): number {
  g.v = (g.v * 48271) % M31;
  return g.v % 256;
}

function writeProto(
  buf: number[],
  p: Proto,
  pid: number,
  keys: InstrFieldKeys,
  rng: { int(n: number): number },
  jumpOps: Set<number> | undefined,
  oc: OpenCodeParams | undefined,
  constKey: number,
): void {
  buf.push(p.params & 0xff);
  buf.push(p.isVararg ? 1 : 0);
  putUvarint(buf, p.upvals.length);
  for (const uv of p.upvals) {
    buf.push(uv.instack ? 1 : 0);
    putUvarint(buf, uv.idx);
  }
  putUvarint(buf, p.numSlots);
  // field keys (redundant per proto by design — future per-proto divergence)
  putUvarint(buf, keys.OP);
  putUvarint(buf, keys.A);
  putUvarint(buf, keys.B1);
  putUvarint(buf, keys.B2);
  putUvarint(buf, keys.C);
  // ---- constants: payloads masked under per-constant per-proto stream (Phase 3) ----
  putUvarint(buf, p.consts.length);
  for (const c of p.consts) {
    const cg = { v: constSeed(constKey, pid) };
    if (c === null) buf.push(0);
    else if (c === true) buf.push(1);
    else if (c === false) buf.push(2);
    else if (typeof c === "number") {
      if (Number.isNaN(c)) buf.push(7);
      else if (c === Number.POSITIVE_INFINITY) buf.push(8);
      else if (c === Number.NEGATIVE_INFINITY) buf.push(9);
      else {
        buf.push(5);
        const s = String(c);
        putUvarint(buf, s.length);
        for (let i = 0; i < s.length; i++) {
          buf.push((s.charCodeAt(i) + constMaskByte(cg)) & 0xff);
        }
      }
    } else {
      buf.push(6);
      const bytes = Buffer.from(c as string, "latin1");
      putUvarint(buf, bytes.length);
      for (const byte of bytes) {
        buf.push((byte + constMaskByte(cg)) & 0xff);
      }
    }
  }
  putUvarint(buf, p.code.length);
  // rolling key starts fresh per frame entry — mirrors runtime run(pid).
  // The SAME chain also whitens operands (Phase 3): each field is shifted by
  // m=⌊rk/3⌋%256; split-jump shares counter-shift so B1+B2 stays invariant.
  let rk = oc ? initialRk(oc, pid) : 0;
  for (const ins of p.code) {
    const opE = oc ? encodeOp(ins[0], rk) : ins[0];
    const m = oc ? Math.floor(rk / 3) % 256 : 0;
    rk = stepRk(oc ?? { rk0: 0, astep: 1, astep2: 1, ainc: 1 }, rk);
    const isJump = jumpOps?.has(ins[0]) === true;
    let b1: number;
    let b2: number;
    if (isJump) {
      b1 = 1 + rng.int(4096);
      b2 = ins[2] - b1;
    } else {
      b1 = ins[2];
      b2 = 0;
    }
    putUvarint(buf, opE);
    putSvarint(buf, ins[1] + m);
    putSvarint(buf, b1 + m);
    putSvarint(buf, b2 - m);
    putSvarint(buf, ins[3] + m);
  }
}

export interface DeserializedBlob {
  flat: Proto[];
  wm: Buffer | null;
  /** field keys recovered from the wire (parallel to the runtime's locals) */
  keys: InstrFieldKeys;
}

export interface DeserializeOpts {
  /**
   * rolling-key params used at build time. When supplied, operand whitening
   * is reversed (mirroring the runtime decode loop); when omitted, tuples
   * carry RAW-MASKED operands — only valid for blobs serialized without
   * opencode (legacy/tests). Constant payloads are NEVER decrypted here:
   * the wire intentionally carries masked bytes (runtime decrypts on access).
   */
  opencode?: OpenCodeParams;
}

/** TS mirror of the runtime decoder — used for integrity hashing & extraction. */
export function deserializeBlob(data: Uint8Array, opts?: DeserializeOpts): DeserializedBlob {
  const r = new Reader(data);
  // framing v3: high bit = format tag, low 7 bits = prologue length to skip
  const hdr = r.u8();
  if (!(hdr & 0x80)) throw new Error("unsupported blob format (pre-v3)");
  const prologueLen = hdr & 0x7f;
  for (let i = 0; i < prologueLen; i++) r.u8();
  const n = r.uvarint();
  const flat: Proto[] = [];
  let keys: InstrFieldKeys | null = null;
  for (let i = 0; i < n; i++) {
    const parsed = readProto(r, i + 1, opts?.opencode);
    flat.push(parsed.proto);
    if (i === 0) keys = parsed.keys;
  }
  const wln = r.uvarint();
  let wm: Buffer | null = null;
  if (wln > 0) {
    wm = Buffer.alloc(wln);
    for (let i = 0; i < wln; i++) wm[i] = r.u8();
  }
  return { flat, wm, keys: keys ?? { OP: 0, A: 0, B1: 0, B2: 0, C: 0 } };
}

function readProto(r: Reader, pid: number, oc: OpenCodeParams | undefined): {
  proto: Proto;
  keys: InstrFieldKeys;
} {
  const params = r.u8();
  const isVararg = r.u8() === 1;
  const nu = r.uvarint();
  const upvals = [];
  for (let i = 0; i < nu; i++) {
    const instack = r.u8() === 1;
    upvals.push({ instack, idx: r.uvarint() });
  }
  const numSlots = r.uvarint();
  const keys: InstrFieldKeys = {
    OP: r.uvarint(),
    A: r.uvarint(),
    B1: r.uvarint(),
    B2: r.uvarint(),
    C: r.uvarint(),
  };
  void keys; // consumers access records via DeserializedBlob.keys
  // NOTE: tag-5/6 payloads stay MASKED here by design — no TS consumer needs
  // plaintext consts; the artifact decrypts on access via its CV accessor.
  const nc = r.uvarint();
  const consts: unknown[] = [];
  for (let i = 0; i < nc; i++) {
    const tag = r.u8();
    if (tag === 0) consts.push(null);
    else if (tag === 1) consts.push(true);
    else if (tag === 2) consts.push(false);
    else if (tag === 7) consts.push(Number.NaN); // E3: dedicated non-finite tags
    else if (tag === 8) consts.push(Number.POSITIVE_INFINITY);
    else if (tag === 9) consts.push(Number.NEGATIVE_INFINITY);
    else if (tag === 5) {
      const s = r.bytesStr(r.uvarint());
      consts.push(parseFloat(s)); // masked bytes ⇒ garbage number, unused
    } else if (tag === 6) {
      consts.push(r.bytesStr(r.uvarint())); // masked string, unused
    } else throw new Error(`bad const tag ${tag}`);
  }
  const nk = r.uvarint();
  const code: [number, number, number, number][] = [];
  let lrk = oc ? initialRk(oc, pid) : 0;
  for (let i = 0; i < nk; i++) {
    const opE = r.uvarint();
    const aw = r.svarint();
    const b1w = r.svarint();
    const b2w = r.svarint();
    const cw = r.svarint();
    const m = oc ? Math.floor(lrk / 3) % 256 : 0;
    lrk = stepRk(oc ?? { rk0: 0, astep: 1, astep2: 1, ainc: 1 }, lrk);
    // reverse whitening: A/C shift back by m; shares counter-shifted so the
    // SUM (b1-m)+(b2+m) restores the original offset exactly
    code.push([opE, aw - m, b1w - m + (b2w + m), cw - m]);
  }
  return {
    proto: { params, isVararg, upvals, numSlots, consts: consts as Proto["consts"], code, protos: [] },
    keys,
  };
}
