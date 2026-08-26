// NEVAHEX-VM — A1 acceptance gate (APEX W1.1, R10 differential fuzz)
//
// The critical test: serializeProto(output) === execProgram(DECODE_PROGRAM,
// output) on every fuzzed blob. The diff is property-tested ×300 with a
// deterministic mulberry32 stream so failures are reproducible. If this
// test passes, the stage-2 inner-VM program is bit-equivalent to the
// TS mirror (deserializeBlob), which is the same semantic guarantee the
// Lua-side interpreter will give at runtime.
import { describe, it, expect } from "vitest";
import { serializeProto, deserializeBlob, normSeed } from "../src/engine/vm/serializer";
import { execProgram } from "../src/engine/vm/microvm-exec";
import { DECODE_PROGRAM } from "../src/engine/vm/microvm-program";
import { OpenCodeParams } from "../src/engine/runtime/opencode";
import { Proto } from "../src/engine/vm/opcodes";

const M = 2147483647;

/** deterministic 32-bit RNG (mulberry32) for reproducible fuzz */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** random integer in [lo, hi] inclusive */
function ri(r: () => number, lo: number, hi: number): number {
  return lo + Math.floor(r() * (hi - lo + 1));
}

function buildRandomProto(r: () => number, depth: number): Proto {
  const params = ri(r, 0, 255);
  const isVararg = r() < 0.3;
  const numSlots = ri(r, 0, 16);
  const upvals: { instack: boolean; idx: number }[] = [];
  for (let i = 0, n = ri(r, 0, 4); i < n; i++) {
    upvals.push({ instack: r() < 0.5, idx: ri(r, 0, 64) });
  }
  const consts: unknown[] = [];
  for (let i = 0, n = ri(r, 0, 5); i < n; i++) {
    const k = r();
    if (k < 0.15) consts.push(null);
    else if (k < 0.35) consts.push(true);
    else if (k < 0.5) consts.push(false);
    else if (k < 0.6) consts.push(NaN);
    else if (k < 0.65) consts.push(Number.POSITIVE_INFINITY);
    else if (k < 0.7) consts.push(Number.NEGATIVE_INFINITY);
    else if (k < 0.85) {
      const m = ri(r, 0, 5);
      const v =
        m === 0 ? 0 :
        m === 1 ? ri(r, -100, 100) :
        m === 2 ? r() * 1000 - 500 :
        m === 3 ? ri(r, -1000, 1000) / 1000 :
                  ri(r, -1e9, 1e9) / 1e6;
      consts.push(v);
    } else {
      const len = ri(r, 0, 12);
      let s = "";
      for (let j = 0; j < len; j++) s += String.fromCharCode(ri(r, 32, 126));
      consts.push(s);
    }
  }
  const code: [number, number, number, number][] = [];
  for (let i = 0, n = ri(r, 0, 10); i < n; i++) {
    code.push([
      ri(r, 0, 50),
      ri(r, 0, 255),
      ri(r, -100, 100),
      ri(r, -100, 100),
    ]);
  }
  const protos: Proto[] = [];
  if (depth > 0) {
    for (let i = 0, n = ri(r, 0, 2); i < n; i++) {
      protos.push(buildRandomProto(r, depth - 1));
    }
  }
  return { params, isVararg, upvals, numSlots, consts, code, protos };
}

function makeOC(r: () => number): OpenCodeParams {
  return {
    rk0: normSeed(1 + Math.floor(r() * (M - 1))),
    astep: (1000003 + ri(r, 0, 699_997)) | 1,
    ainc: (65521 + ri(r, 0, 200_000)) | 1,
  };
}

function deepEqFlat(a: Proto, b: Proto, path = ""): void {
  expect(a.params, path + "params").toBe(b.params);
  expect(a.isVararg, path + "isVararg").toBe(b.isVararg);
  expect(a.numSlots, path + "numSlots").toBe(b.numSlots);
  expect(a.upvals.length, path + "upvals.length").toBe(b.upvals.length);
  for (let i = 0; i < a.upvals.length; i++) {
    expect(a.upvals[i].instack, `${path}upvals[${i}].instack`).toBe(b.upvals[i].instack);
    expect(a.upvals[i].idx, `${path}upvals[${i}].idx`).toBe(b.upvals[i].idx);
  }
  expect(a.consts.length, path + "consts.length").toBe(b.consts.length);
  for (let i = 0; i < a.consts.length; i++) {
    const av = a.consts[i];
    const bv = b.consts[i];
    if (typeof av === "number" && Number.isNaN(av)) {
      expect(Number.isNaN(bv), `${path}consts[${i}]`).toBe(true);
    } else {
      expect(bv, `${path}consts[${i}]`).toBe(av);
    }
  }
  expect(a.code.length, path + "code.length").toBe(b.code.length);
  for (let i = 0; i < a.code.length; i++) {
    for (let j = 0; j < 4; j++) {
      expect(a.code[i][j], `${path}code[${i}][${j}]`).toBe(b.code[i][j]);
    }
  }
  // serializer flattens, so protos[] is always [] on both sides
  expect(a.protos.length, path + "protos.length").toBe(0);
  expect(b.protos.length, path + "b.protos.length").toBe(0);
}

function wmEqual(a: number[] | null, b: Buffer | null): void {
  if (a === null && b === null) return;
  const av = a === null ? null : Uint8Array.from(a);
  const bv = b === null ? null : new Uint8Array(b);
  if (av === null || bv === null) throw new Error("wm null mismatch");
  expect(av.length).toBe(bv.length);
  for (let i = 0; i < av.length; i++) expect(av[i], `wm[${i}]`).toBe(bv[i]);
}

describe("A1 differential fuzz: execProgram ≡ deserializeBlob", () => {
  it("×300 random Proto trees, with opencode+constKey", () => {
    const r = mulberry32(0xA1FEED);
    for (let trial = 0; trial < 300; trial++) {
      const oc = makeOC(r);
      const JUMPY_LOGICAL = new Set<number>([
        36, 37, 38, 46, 47, 48, 49,
      ]);
      const JUMPY = new Set<number>(
        JUMPY_LOGICAL.map((op) => (r() % 51)), // perm will be applied later
      );
      const src = buildRandomProto(r, 0);
      const constKey = normSeed(1 + Math.floor(r() * (M - 1)));
      const ctx = {
        rng,
        jumpOps: JUMPY,
        opencode: oc,
        constKey,
      };
      const { plain } = serializeProto(root, undefined, ctx);
      const opts = {
        budgets: { maxProtos: 16, maxConsts: 64, maxCode: 256 },
        fieldKeys: { OP: 31, A: 32, B1: 33, B2: 34, C: 35 },
        opencode: oc,
        wmSeeds: [1234567, 7654321],
      };
      const exec = execProgram(DECODE_PROGRAM, plain, { ...opts, programSeed: 0 });
      const ref = deserializeBlob(plain, { opencode: oc });
      try {
        expect(exec.flat.length, `trial ${trial}: flat.length`).toBe(ref.flat.length);
        for (let i = 0; i < exec.flat.length; i++) {
          deepEqFlat(exec.flat[i], ref.flat[i], `t${trial}/p${i}/`);
        }
        wmEqual(exec.wm, ref.wm);
      } catch (e) {
        throw new Error(
          `trial ${trial}: ${(e as Error).message}\n  exec.flat.length=${exec.flat.length} ref.flat.length=${ref.flat.length} plain[0]=${plain[0]}`,
        );
      }
    }
  });

  it("non-finite constants (NaN/±Inf) round-trip", () => {
    const r = mulberry32(0xDEAD_BEEF);
    const oc = makeOC(r);
    const src = 'local x = 0/0 local y = 1/0 local z = -1/0 return x,y,z';
    const root = compileChunk(parse(src));
    const oc2 = makeOC(mulberry32(0xDEAD_BEEF));
    const ctx = {
      rng: { int: (n: number) => Math.floor(mulberry32(0xDEAD_BEEF)() * n) },
      jumpOps: new Set<number>(),
      opencode: oc2,
      constKey: normSeed(7),
    };
    const { plain } = serializeProto(root, undefined, ctx);
    const opts = {
      budgets: { maxProtos: 16, maxConsts: 64, maxCode: 256 },
      fieldKeys: { OP: 31, A: 32, B1: 33, B2: 34, C: 35 },
      opencode: oc2,
      wmSeeds: [11, 22],
    };
    const exec = execProgram(DECODE_PROGRAM, plain, { ...opts, programSeed: 0 });
    const ref = deserializeBlob(plain, { opencode: oc2 });
    expect(exec.flat.length).toBe(ref.flat.length);
    expect(Number.isNaN(exec.flat[0].consts[0])).toBe(true);
    expect(exec.flat[0].consts[1]).toBe(Number.POSITIVE_INFINITY);
    expect(exec.flat[0].consts[2]).toBe(Number.NEGATIVE_INFINITY);
    expect(Number.isNaN(ref.flat[0].consts[0])).toBe(true);
    expect(ref.flat[0].consts[1]).toBe(Number.POSITIVE_INFINITY);
    expect(ref.flat[0].consts[2]).toBe(Number.NEGATIVE_INFINITY);
  });
});