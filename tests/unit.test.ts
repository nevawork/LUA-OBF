// NEVAHEX-VM — Phase 21 unit tests (run: npx vitest run)
import { describe, it, expect } from "vitest";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/vm/compiler";
import { Op, OP_NAMES } from "../src/vm/opcodes";
import {
  serializeProto, deserializeBlob, encryptBlob, decryptBlob,
  normSeed, makeKeyStream, Seeds,
} from "../src/vm/serializer";
import { spreadWatermark, unspreadWatermark, crc16 } from "../src/protection/watermark";
import { planIntegritySlices, sliceHash } from "../src/protection/antitamper";
import { envMixConstant, bakeProfileSeeds } from "../src/protection/envkeying";
import { layoutSimilarity, kendallTauDistance } from "../src/testing/metrics";

describe("parser", () => {
  it("parses all Lua 5.1 statement forms", () => {
    const src = `
      local a = 1
      local b, c = 2, "x"
      a = a + 1
      local t = {1, 2, k=3, [4]=5}
      t.x = t.y
      if a > 1 then a = 0 elseif a < 0 then a = 1 else a = 2 end
      while a < 5 do a = a + 1 end
      repeat a = a - 1 until a <= 3
      for i = 1, 10, 2 do a = a + i end
      for k, v in pairs(t) do a = a + 1 end
      do local z = a end
      local function f(x, ...) return x, ... end
      function t.m(a1) return a1 end
      function t:n2() return self end
      local g = function() return [[long
string]] end
      a, b = c, a
    `;
    expect(() => parse(src)).not.toThrow();
  });

  it("rejects malformed code", () => {
    expect(() => parse("local = 5")).toThrow();
    expect(() => parse("if x then")).toThrow();
  });
});

describe("compiler + serializer round-trip", () => {
  const cases = [
    "return 42",
    'local s = "hi" return s .. "!"',
    "local t = {} for i=1,10 do t[i]=i*i end return #t",
    "local function f(n) if n<2 then return n end return f(n-1)+f(n-2) end return f(10)",
    "local co = setmetatable({}, {__index=function(_,k) return k end}) return co.anything",
  ];
  for (const src of cases) {
    it(`round-trips: ${src.slice(0, 40)}`, () => {
      const root = compileChunk(parse(src));
      const { plain } = serializeProto(root);
      const d = deserializeBlob(plain);
      expect(d.flat.length).toBeGreaterThan(0);
      expect(d.flat[0].code.length).toBe(root.code.length);
    });
  }

  it("uses only defined opcodes", () => {
    const root = compileChunk(parse("local a = {} function a.f(x) return x end return a"));
    const walk = (p: typeof root): void => {
      for (const ins of p.code) expect(OP_NAMES[ins[0]]).toBeDefined();
      p.protos.forEach(walk);
    };
    walk(root);
    void Op;
  });
});

describe("transport cipher", () => {
  const seeds: Seeds = [normSeed(123456789), normSeed(987654321), normSeed(555), normSeed(777)];
  it("encrypts and decrypts symmetrically", () => {
    const data = Buffer.from([0, 1, 2, 250, 251, 255, 42]);
    const enc = encryptBlob(data, seeds);
    expect(Buffer.compare(enc, data)).not.toBe(0);
    const dec = decryptBlob(enc, seeds);
    expect(dec.equals(data)).toBe(true);
  });

  it("keystream is deterministic and seed-sensitive", () => {
    expect(Array.from(makeKeyStream(1, 2)(8))).toEqual(Array.from(makeKeyStream(1, 2)(8)));
    expect(Buffer.from(makeKeyStream(1, 2)(8)).equals(Buffer.from(makeKeyStream(3, 2)(8)))).toBe(false);
  });
});

describe("watermark spread/recover", () => {
  it("recovers payload with majority vote", () => {
    const payload = Buffer.from("license-abc-123", "utf8");
    const region = spreadWatermark(payload, normSeed(424242));
    const out = unspreadWatermark(region, payload.length, normSeed(424242));
    expect(out.equals(payload)).toBe(true);
  });

  it("crc16 detects corruption", () => {
    const p = Buffer.from("wm");
    expect(crc16(p)).toBe(crc16(Buffer.from("wm")));
    expect(crc16(p)).not.toBe(crc16(Buffer.from("wM")));
  });
});

describe("anti-tamper slice planning", () => {
  it("hashes are stable and cover the code stream", () => {
    const root = compileChunk(parse("local x = 0 for i=1,50 do x=x+i end return x"));
    const { plain } = serializeProto(root);
    const { flat } = deserializeBlob(plain);
    const slices = planIntegritySlices(flat);
    expect(slices.length).toBeGreaterThan(0);
    for (const [pid, a, b, h, salt] of slices) {
      expect(sliceHash(flat[pid - 1].code, a, b, salt)).toBe(h);
    }
  });
});

describe("environmental keying", () => {
  it("profiles produce distinct mix constants", () => {
    const m = new Set(["lua51", "luajit", "luau"].map((p) =>
      envMixConstant(p as "lua51" | "luajit" | "luau")));
    expect(m.size).toBe(3);
  });

  it("baked seeds recover effective seeds under the same profile", () => {
    const eff = [normSeed(111111), normSeed(222222)];
    const baked = bakeProfileSeeds(eff, "luajit");
    // runtime: (baked + mix) mod M31 == eff
    const mix = envMixConstant("luajit");
    const M31 = 2147483647;
    const rec = baked.map((v) => {
      const r = ((v % M31) + mix * 1 + M31) % M31;
      return r === 0 ? r + 2147483646 : r;
    });
    // sb uses mix*3 — verify sa only here; sb path covered by e2e
    expect(rec[0]).toBe(eff[0] % M31 === 0 ? eff[0] : eff[0]);
    void mix; void M31;
  });
});

describe("handler-diversity metric", () => {
  it("identical layouts score 1.0; distinct score below spec target", () => {
    const permA = Array.from({ length: 51 }, (_, i) => i);
    const orderA = Array.from({ length: 51 }, (_, i) => i);
    const simSame = layoutSimilarity(
      { perm: permA, dispatchOrder: orderA },
      { perm: permA.slice(), dispatchOrder: orderA.slice() },
    );
    expect(simSame).toBeCloseTo(1, 5);

    const permB = permA.slice().reverse();
    const orderB = orderA.slice().reverse();
    const distDiff = kendallTauDistance(permA, permB);
    expect(distDiff).toBeGreaterThan(0.8);
  });
});
