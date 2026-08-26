// NEVAHEX-VM — proto tree serialization & blob framing.
// Cipher primitives live in src/engine/crypto/cipher.ts; watermark spread in
// src/protection/watermark.ts. This module keeps the wire format and re-exports
// the historical names so existing call sites stay stable.
// Canonical location: src/engine/vm/serializer.ts
import { Proto } from "./opcodes";
import {
  M31, normSeed, makeKeyStream, wmSeeds,
} from "../crypto/cipher";
import { spreadWatermark, unspreadWatermark, crc16 } from "../../protection/watermark";

export type Seeds = [number, number, number, number];

export { M31, normSeed, makeKeyStream, wmSeeds, spreadWatermark, unspreadWatermark, crc16 };

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
}

export function serializeProto(root: Proto, wmRegion?: Buffer, rng?: { int(n: number): number }): SerializedBlob {
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
  for (const p of flat) {
    for (const ins of p.code) {
      if (ins[0] === 18 /* Op.CLOSURE */) {
        ins[1] = idMap.get(p.protos[ins[1] - 1])!;
      }
    }
  }
  const buf: number[] = [];
  // ---- framing v3: no magic header, randomized prologue ----
  // byte0 = 0x80 | prologueLen  (format tag in the high bit, length in low 7)
  // bytes 1..prologueLen = high-entropy filler drawn from the build rng
  // (or a content-derived pattern when no rng is supplied). The old
  // "NVX\x02" magic gave any attacker a free known-plaintext crib at
  // offset 0; the prologue denies them any stable prefix.
  let prologueLen = 16 + (rng ? rng.int(49) : 0);
  if (!rng) {
    // deterministic filler seed derived from content shape (no rng builds)
    let s = (flat.length * 2654435761) % 2147483647;
    if (s === 0) s = 1;
    for (let i = 0; i < prologueLen; i++) {
      s = (s * 48271) % 2147483647;
      buf.push(s & 0xff);
    }
  } else {
    for (let i = 0; i < prologueLen; i++) buf.push(rng.int(256));
  }
  buf.unshift(0x80 | prologueLen);
  putUvarint(buf, flat.length);
  for (const p of flat) writeProto(buf, p);
  if (wmRegion && wmRegion.length > 0) {
    putUvarint(buf, wmRegion.length);
    for (const b of wmRegion) buf.push(b);
  } else {
    putUvarint(buf, 0);
  }
  return { plain: Buffer.from(buf), flat, rootPid: 1 };
}

function writeProto(buf: number[], p: Proto): void {
  buf.push(p.params & 0xff);
  buf.push(p.isVararg ? 1 : 0);
  putUvarint(buf, p.upvals.length);
  for (const uv of p.upvals) {
    buf.push(uv.instack ? 1 : 0);
    putUvarint(buf, uv.idx);
  }
  putUvarint(buf, p.numSlots);
  putUvarint(buf, p.consts.length);
  for (const c of p.consts) {
    if (c === null) buf.push(0);
    else if (c === true) buf.push(1);
    else if (c === false) buf.push(2);
    else if (typeof c === "number") {
      // decimal round-trip (shortest exact repr guarantees double recovery)
      buf.push(5);
      let s: string;
      if (!isFinite(c)) s = Number.isNaN(c) ? "(0/0)" : c > 0 ? "1e999" : "-1e999";
      else s = String(c);
      putUvarint(buf, s.length);
      for (let i = 0; i < s.length; i++) buf.push(s.charCodeAt(i));
    } else {
      buf.push(6);
      const bytes = Buffer.from(c as string, "latin1");
      putUvarint(buf, bytes.length);
      for (const byte of bytes) buf.push(byte);
    }
  }
  putUvarint(buf, p.code.length);
  for (const ins of p.code) {
    buf.push(ins[0] & 0xff);
    putSvarint(buf, ins[1]);
    putSvarint(buf, ins[2]);
    putSvarint(buf, ins[3]);
  }
}

export interface DeserializedBlob {
  flat: Proto[];
  wm: Buffer | null;
}

/** TS mirror of the runtime decoder — used for integrity hashing & extraction. */
export function deserializeBlob(data: Uint8Array): DeserializedBlob {
  const r = new Reader(data);
  // framing v3: high bit = format tag, low 7 bits = prologue length to skip
  const hdr = r.u8();
  if (!(hdr & 0x80)) throw new Error("unsupported blob format (pre-v3)");
  const prologueLen = hdr & 0x7f;
  for (let i = 0; i < prologueLen; i++) r.u8();
  const n = r.uvarint();
  const flat: Proto[] = [];
  for (let i = 0; i < n; i++) flat.push(readProto(r));
  const wln = r.uvarint();
  let wm: Buffer | null = null;
  if (wln > 0) {
    wm = Buffer.alloc(wln);
    for (let i = 0; i < wln; i++) wm[i] = r.u8();
  }
  return { flat, wm };
}

function readProto(r: Reader): Proto {
  const params = r.u8();
  const isVararg = r.u8() === 1;
  const nu = r.uvarint();
  const upvals = [];
  for (let i = 0; i < nu; i++) {
    const instack = r.u8() === 1;
    upvals.push({ instack, idx: r.uvarint() });
  }
  const numSlots = r.uvarint();
  const nc = r.uvarint();
  const consts: unknown[] = [];
  for (let i = 0; i < nc; i++) {
    const tag = r.u8();
    if (tag === 0) consts.push(null);
    else if (tag === 1) consts.push(true);
    else if (tag === 2) consts.push(false);
    else if (tag === 5) {
      const s = r.bytesStr(r.uvarint());
      consts.push(parseFloat(s));
    } else if (tag === 6) {
      consts.push(r.bytesStr(r.uvarint()));
    } else throw new Error(`bad const tag ${tag}`);
  }
  const nk = r.uvarint();
  const code: [number, number, number, number][] = [];
  for (let i = 0; i < nk; i++) {
    code.push([r.u8(), r.svarint(), r.svarint(), r.svarint()]);
  }
  return { params, isVararg, upvals, numSlots, consts: consts as Proto["consts"], code, protos: [] };
}
