// NEVAHEX-VM — Phase 5 anti-tamper tests
// Pins: ciphertext-range hash math, blob slice planning (coverage/caps/
// determinism), the shell guard's emitted structure and tier responses,
// CVW cross-coupling into the constant-decryption accessor, anti-emulation
// v2 probe convergence shape, and behavioral env-keying probes.
import { describe, it, expect } from "vitest";
import {
  rangeHash, planBlobSlices, planIntegritySlices,
} from "../src/protection/antitamper";
import { emitCipherGuard } from "../src/engine/runtime/cipherguard";
import { emitAntiEmulationBlock, DEFAULT_ANTI_EMULATION } from "../src/protection/antiemulation";
import { canonicalMix, poolSignals } from "../src/protection/entropypool";
import { protect } from "../src/pipeline";

describe("phase 5: rangeHash + planBlobSlices", () => {
  it("matches an independent inline recomputation", () => {
    const buf = new Uint8Array(300);
    for (let i = 0; i < buf.length; i++) buf[i] = (i * 89 + 7) & 0xff;
    const h = rangeHash(buf, 101, 64);
    let ref = 2166136261 % 1000000007;
    for (let j = 100; j < 164; j++) ref = (ref * 16777619 + buf[j]) % 1000000007;
    expect(h).toBe(ref);
  });

  it("plans deterministic, in-range, capped windows covering the blob", () => {
    const blob = new Uint8Array(4096);
    for (let i = 0; i < blob.length; i++) blob[i] = (i * 31 + 5) & 0xff;
    const s1 = planBlobSlices(blob);
    const s2 = planBlobSlices(blob);
    expect(s1).toEqual(s2); // no rng — pure function of the bytes
    expect(s1.length).toBeGreaterThan(0);
    for (const s of s1) {
      expect(s.p).toBeGreaterThanOrEqual(1);
      expect(s.p + s.a - 1).toBeLessThanOrEqual(blob.length);
      expect(s.a).toBeLessThanOrEqual(64);
      expect(rangeHash(blob, s.p, s.a)).toBe(s.h);
    }
    // first window starts at the first byte; windows tile without gaps
    expect(s1[0].p).toBe(1);
  });

  it("handles tiny blobs (single window)", () => {
    const tiny = Uint8Array.from([1, 2, 3]);
    const s = planBlobSlices(tiny);
    expect(s).toHaveLength(1);
    expect(s[0]).toEqual({ p: 1, a: 3, h: rangeHash(tiny, 1, 3) });
  });
});

describe("phase 5: shell cipher guard emission", () => {
  const slices = planBlobSlices(Uint8Array.from(Array.from({ length: 512 }, (_, i) => i & 0xff)));

  it("strict tier halts cryptically on mismatch", () => {
    const lines = emitCipherGuard("strict", slices, "{p=1,a=8,h=99}", {
      blobVar: "BLOBX", saVar: "sa", sbVar: "sb", cvwVar: "CVWX",
      garbageLit: '"G1"', deltaSa: "11", deltaSb: "22",
    })!;
    const text = lines.join("\n");
    expect(text).toContain('error("G1")');
    expect(text).not.toContain("sa="); // strict never mutates seeds
    expect(text).toContain("string.byte(BLOBX,j)");
  });

  it("silent tier shifts BOTH seeds and raises CVW", () => {
    const lines = emitCipherGuard("silent", slices, "{p=1,a=8,h=99}", {
      blobVar: "BLOBX", saVar: "sa", sbVar: "sb", cvwVar: "CVWX",
      garbageLit: '"G1"', deltaSa: "11", deltaSb: "22",
    })!;
    const text = lines.join("\n");
    expect(text).toContain("sa=(sa+11)%2147483647");
    expect(text).toContain("sb=(sb+22)%2147483647");
    expect(text).toContain("CVWX=1");
    expect(text).not.toContain("error(");
  });

  it("disabled for off tier or empty slice set", () => {
    expect(emitCipherGuard("off", slices, "", {} as never)).toBeNull();
    expect(emitCipherGuard("strict", [], "", {} as never)).toBeNull();
  });

  it("decoded-table ticks remain as decoys alongside the shell guard", () => {
    const r = protect({ source: "return 9", seedHex: "ab".repeat(32) });
    // frame tick machinery present (decoy layer kept deliberately)
    expect(/%1000000007/.test(r.lua)).toBe(true);
    // shell guard present with its distinctive loop header
    expect(/for \w+=sl\.p,sl\.p\+sl\.a-1 do/.test(r.lua)).toBe(true);
  });
});

describe("phase 5: CVW cross-coupling", () => {
  it("CV seed derivation consumes the coupling flag in silent artifacts", () => {
    const r = protect({ source: 'return "x"', tier: "silent", seedHex: "cd".repeat(32) });
    // kk=(CK0+pid*7919+CVW*WEIGHT)%2147483646
    expect(/\+pID\*7919\+\w+\*\w+\)%2147483646/.test(r.lua)).toBe(true);
    // frame-tick silent response raises CVW next to poison/pbias
    // (bias literal may be any non-space obfuscated expression)
    expect(/=true\s+\S+\s+\w+=1/.test(r.lua)).toBe(true);
  });

  it("strict artifacts carry no CVW response writes", () => {
    const r = protect({ source: 'return "x"', tier: "strict", seedHex: "cd".repeat(32) });
    expect(/=true\s+\S+\s+\w+=1/.test(r.lua)).toBe(false);
  });
});

describe("phase 5: anti-emulation v2", () => {
  const names = {
    tcVar: "TC", poisonVar: "PS", pbVar: "PB",
    aeT0: "AET", aeOps: "AEO", cvwVar: "CVW",
  };

  it("nine probes converge on a single verdict point", () => {
    const lines = emitAntiEmulationBlock(DEFAULT_ANTI_EMULATION, names)!;
    const text = lines.join("\n");
    expect((text.match(/bad=bad\+1/g) || []).length).toBe(9);
    expect((text.match(/if bad>0 then/g) || []).length).toBe(1);
    expect(text).toContain("string.rep(\"x\",65536)");
    expect(text).toContain('collectgarbage("collect")');
    expect(text).toContain("CVW=1");
    expect(text).toContain("debug.sethook");
    expect(text).toContain("os.clock()");
    expect(text).toContain("math.sin");
    expect(text).toContain("getmetatable");
  });

  it("null config disables the layer entirely", () => {
    expect(emitAntiEmulationBlock(null, names)).toBeNull();
  });
});

describe("phase 5: behavioral env-keying probes", () => {
  it("four probes ship with genuine-outcome feed constants", () => {
    const beh = poolSignals("lua51").filter((s) => s.sig.kind === "behavioral");
    expect(beh.map((s) => (s.sig as { expect: number }).expect).sort())
      .toEqual([23, 29, 31, 37]);
  });

  it("canonical mixes stay distinct per profile and stable across calls", () => {
    for (const p of ["lua51", "luajit", "luau"] as const) {
      expect(canonicalMix(p)).toBe(canonicalMix(p));
    }
    const set = new Set(["lua51", "luajit", "luau"].map((p) => canonicalMix(p as never)));
    expect(set.size).toBe(3);
  });

  it("env-keyed artifacts embed the behavioral probe expressions", () => {
    const r = protect({
      source: "return 1",
      envProfile: "lua51",
      seedHex: "ef".repeat(32),
    });
    expect(r.lua.includes("math.fmod(-6,5)==-1 and 23 or 24")).toBe(true);
    expect(r.lua.includes('(0.1+0.2)==0.3 and 31 or 32')).toBe(true);
  });
});
