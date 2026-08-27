// NEVAHEX-VM — Phase 2 dispatch-hardening tests
// Pins: rolling-key opcode codec round-trip + build/runtime parity,
// wire v3.2 keyed records + split-jump re-summing, range-tree shape,
// and end-to-end determinism under the new draw order.
import { describe, it, expect } from "vitest";
import {
  OPMOD, makeOpenCodeParams, initialRk, stepRk, encodeOp, decodeOp,
} from "../src/engine/runtime/opencode";
import {
  serializeProto, deserializeBlob, encryptBlob, decryptBlob, normSeed,
} from "../src/vm/serializer";
import { compileChunk } from "../src/vm/compiler";
import { parse } from "../src/lang/parser";
import { BuildRng, sha256 } from "../src/engine/crypto/prng";
import { assembleChain, Handler } from "../src/engine/runtime/dispatcher";
import { Op } from "../src/engine/vm/opcodes";
import { protect } from "../src/pipeline";

const rngFrom = (label: string): BuildRng =>
  new BuildRng(sha256(Buffer.from(label, "utf8")));

describe("phase 2: opencode rolling-key codec", () => {
  it("params are deterministic per rng stream and steps are odd", () => {
    const a = makeOpenCodeParams(rngFrom("p2a"));
    const a2 = makeOpenCodeParams(rngFrom("p2a"));
    const b = makeOpenCodeParams(rngFrom("p2b"));
    expect(a).toEqual(a2);
    expect(a.astep % 2).toBe(1);
    expect(a.astep2 % 2).toBe(1);
    expect(a.ainc % 2).toBe(1);
    expect(JSON.stringify(b)).not.toBe(JSON.stringify(a)); // streams differ
  });

  it("encode/decode round-trips across the full ring", () => {
    const p = makeOpenCodeParams(rngFrom("rt"));
    let rk = initialRk(p, 7);
    for (let v = 0; v < 64; v++) {
      for (let t = 0; t < 8; t++) {
        const e = encodeOp(v, rk);
        expect(e).toBeGreaterThanOrEqual(0);
        expect(e).toBeLessThan(OPMOD);
        expect(decodeOp(e, rk)).toBe(v);
        rk = stepRk(p, rk);
      }
    }
  });

  it("initialRk matches the manual formula", () => {
    const p = makeOpenCodeParams(rngFrom("init"));
    for (const pid of [1, 2, 51, 4096]) {
      expect(initialRk(p, pid)).toBe(((p.rk0 + pid * p.astep + pid * pid * p.astep2) % OPMOD + OPMOD) % OPMOD);
    }
  });

  it("stepRk matches the non-linear manual formula", () => {
    const p = makeOpenCodeParams(rngFrom("step"));
    for (let rk = 0; rk < 65536; rk += 1234) {
      expect(stepRk(p, rk)).toBe((rk + p.ainc + (rk >> 3)) % OPMOD);
    }
  });
});

describe("phase 2: wire v3.2 serialization", () => {
  const SRC = [
    "local s = 0",
    "for i = 1, 10 do",
    "  if i % 2 == 0 then s = s + i else s = s - 1 end",
    "end",
    "local t = {a=1}",
    "return s, t.a",
  ].join("\n");

  it("round-trips keyed records, split jumps and encoded ops", () => {
    const root = compileChunk(parse(SRC));
    const snapshot = JSON.stringify(root);
    const rng = rngFrom("wire32");
    const opencode = makeOpenCodeParams(rng);
    // physical == logical in this test (no permutation applied)
    const JUMPY = new Set<number>([
      Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP,
    ]);
    const { plain, keys } = serializeProto(root, undefined, { rng, jumpOps: JUMPY, opencode });
    // compiler input must be untouched by serialization
    expect(JSON.stringify(root)).toBe(snapshot);

    const dec = deserializeBlob(plain, { opencode });
    // five distinct in-range field keys survive the wire
    const ks = [keys.OP, keys.A, keys.B1, keys.B2, keys.C];
    expect(new Set(ks).size).toBe(5);
    expect(dec.keys).toEqual(keys);
    for (const k of ks) {
      expect(k).toBeGreaterThanOrEqual(1000);
      expect(k).toBeLessThan(999984);
    }

    // share re-summing restores every B operand exactly
    expect(dec.flat.length).toBeGreaterThan(0);
    const src = dec.flat[0];
    expect(src.code.length).toBe(root.code.length);
    for (let i = 0; i < src.code.length; i++) {
      expect(src.code[i][1]).toBe(root.code[i][1]); // A untouched
      expect(src.code[i][2]).toBe(root.code[i][2]); // B1+B2 == B
      expect(src.code[i][3]).toBe(root.code[i][3]); // C untouched
    }

    // build/runtime rolling-key parity: decoding each stored opE under the
    // simulated frame chain yields the original physical opcode
    let rk = initialRk(opencode, 1);
    for (let i = 0; i < src.code.length; i++) {
      expect(decodeOp(src.code[i][0], rk)).toBe(root.code[i][0]);
      rk = stepRk(opencode, rk);
    }
  });

  it("cipher round-trip still closes over the v3.2 wire", () => {
    const root = compileChunk(parse("return 'x'"));
    const seeds = [normSeed(9), normSeed(18), normSeed(27), normSeed(36)] as never;
    const { plain } = serializeProto(root, undefined, { rng: rngFrom("ct") });
    const blob = encryptBlob(plain, seeds);
    const back = deserializeBlob(decryptBlob(blob, seeds));
    expect(back.flat.length).toBe(1);
  });
});

describe("phase 2: range-tree dispatch assembly", () => {
  const mk = (phys: number): Handler => ({
    op: Op.MOVE,
    phys,
    test: `op==${phys}`,
    body: [`B_${phys}=1`],
  });

  it("emits a total balanced tree with every handler exactly once", () => {
    const hs = [mk(3), mk(41), mk(17), mk(100), mk(102), mk(58), mk(99)];
    const { chainLines, dispatchOrder } = assembleChain(hs, rngFrom("tree"), '"FB"');
    const text = chainLines.join("\n");
    // every leaf present exactly once (no prefix collisions in this set)
    for (const h of hs) {
      const hits = (text.match(new RegExp(`op==${h.phys}(\\D|$)`, "g")) || []).length;
      expect(hits).toBe(1);
    }
    // routers + leaves keep if/end balance
    expect((text.match(/\bif\b/g) || []).length).toBe((text.match(/\bend\b/g) || []).length);
    // pre-order covers all leaves
    expect(dispatchOrder.slice().sort((x, y) => x - y))
      .toEqual(hs.map((h) => h.phys).sort((x, y) => x - y));
    expect(chainLines[0]).toMatch(/^if op<=\d+ then$/);
  });
});

describe("phase 2: end-to-end artifacts", () => {
  const SRC = "local a = 7 return a * 2";

  it("determinism holds under the phase-2 draw order", () => {
    const r1 = protect({ source: SRC, seedHex: "ab".repeat(32) });
    const r2 = protect({ source: SRC, seedHex: "ab".repeat(32) });
    expect(r1.lua).toBe(r2.lua);
    expect(r1.manifest.auth).toBe(r2.manifest.auth);
  });

  it("artifact carries encoded-mode structure", () => {
    const r = protect({ source: SRC, seedHex: "cd".repeat(32) });
    // rolling-key init/decode/step expressions present
    expect((r.lua.match(/%65536/g) || []).length).toBeGreaterThanOrEqual(3);
    // binary-search routers present
    expect(/if op<=\d+ then/.test(r.lua)).toBe(true);
    // keyed record construction present (decode loop keeps literal pr/k/i)
    expect(/pr\.k\[i\]=\{\[/.test(r.lua)).toBe(true);
  });

  it("different builds diverge (isomorphism intact)", () => {
    const a = protect({ source: SRC, seedHex: "11".repeat(32) }).lua;
    const b = protect({ source: SRC, seedHex: "22".repeat(32) }).lua;
    expect(a).not.toBe(b);
  });
});
