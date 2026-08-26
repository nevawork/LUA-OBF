// NEVAHEX-VM — APEX W1.2 keyless share schedule tests
// Pins: prologue share-slot embedding (exact big-endian offsets), the
// additive-fold identity end-to-end in TS, keyless artifact structure
// (no recoverable register literals), red-team S2 flipping to HELD, and
// determinism under the new draw order.
import { describe, it, expect } from "vitest";
import { serializeProto } from "../src/engine/vm/serializer";
import { Proto } from "../src/engine/vm/opcodes";
import { protect } from "../src/pipeline";
import { runRedteam } from "../src/testing/redteam";

const M = 2147483647;
const M1 = M - 1;
const norm = (v: number): number => {
  const r = ((v % M1) + M1) % M1;
  return r === 0 ? 1 : r;
};

function bareProto(): Proto {
  return { params: 0, isVararg: false, consts: [], code: [], protos: [], upvals: [], numSlots: 0 };
}

describe("apex W1.2: prologue share slots", () => {
  it("embeds both uint32 components big-endian at offsets 3..6 / 7..10", () => {
    const { plain } = serializeProto(bareProto(), undefined, {
      prologueShares: [0x11223344, 0x55667788],
    });
    const pLen = plain[0] & 0x7f;
    expect(pLen).toBeGreaterThanOrEqual(12);
    // hdr byte at [0]; filler begins at [1]... plaintext index f ↔ file [f+1]
    // filler offset 3 ⇒ file [4]; we reserved offsets 3..6 / 7..10 (filler)
    const base = 1;
    expect([plain[base + 3], plain[base + 4], plain[base + 5], plain[base + 6]])
      .toEqual([0x11, 0x22, 0x33, 0x44]);
    expect([plain[base + 7], plain[base + 8], plain[base + 9], plain[base + 10]])
      .toEqual([0x55, 0x66, 0x77, 0x88]);
  });

  it("fold identity reproduces the seeds exactly (pipeline algebra)", () => {
    for (let trial = 0; trial < 200; trial++) {
      const s0 = norm(1 + ((trial * 7919) % M1));
      const s1 = norm(1 + ((trial * 104729) % M1));
      const B = norm((trial * 2654435761) % M1);
      const E = norm((trial * 40503) % M1);
      const G1 = norm(M1 - trial * 13);
      const G2 = norm(trial * 31 + 7);
      const X1 = norm(G1 - s0 + B);
      const X2 = norm(G2 - s1 + E);
      const fold0 = (((B + G1 - X1) % M1) + M1) % M1;
      const fold1 = (((E + G2 - X2) % M1) + M1) % M1;
      expect(fold0).toBe(s0);
      expect(fold1).toBe(s1);
    }
  });
});

describe("apex W1.2: keyless artifacts", () => {
  const SRC = 'local m="payload" return m';

  it("ships NO recoverable register-literal pattern", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32), keyless: true });
    const legacy = /local \w+=\([^()]+\)\s+\w+=\([^()]+\)\s+MM=2147483647/;
    expect(legacy.test(r.lua)).toBe(false);
    // reassembly reads decrypted prologue bytes + decoy pool entries
    expect(/D\[5\]\*16777216\+D\[6\]\*65536\+D\[7\]\*256\+D\[8\]/.test(r.lua)).toBe(true);
    expect(/D\[9\]\*16777216\+D\[10\]\*65536\+D\[11\]\*256\+D\[12\]/.test(r.lua)).toBe(true);
    expect(/local \w+=\{\d+(,\d+){11}\}/.test(r.lua)).toBe(true); // 12-entry pool
  });

  it("default builds keep the legacy literal form (flag-gated)", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32) });
    expect(/local \w+=\(/.test(r.lua)).toBe(true);
  });

  it("red-team S2 flips to genuinely-held on keyless builds", () => {
    const rt = runRedteam(
      protect({ source: SRC, seedHex: "cd".repeat(32), keyless: true }).lua,
    );
    const s2 = rt.stages.find((s) => s.name === "seed-literal-recovery")!;
    expect(s2.stopped).toBe(true);
    expect(s2.advisory).toBeUndefined(); // a real hold, not an advisory
    expect(rt.ok).toBe(true);
    expect(rt.layersDefeated).toBe(0);
  });

  it("determinism holds with keyless enabled", () => {
    const a1 = protect({ source: SRC, seedHex: "11".repeat(32), keyless: true }).lua;
    const a2 = protect({ source: SRC, seedHex: "11".repeat(32), keyless: true }).lua;
    expect(a1).toBe(a2);
  });

  it("composes with mm-traps and tiers", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      keyless: true,
      mmTraps: true,
      tier: "silent",
      antiEmulation: true,
    });
    expect(r.lua.includes("setmetatable(")).toBe(true);
    expect(/D\[5\]\*16777216/.test(r.lua)).toBe(true);
  });
});
