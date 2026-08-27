// NEVAHEX-VM — Phase 9 keyless artifacts tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=10+20 return x`;

describe("Phase 9: Keyless artifacts", () => {
  it("produces valid protected output with keyless", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      keyless: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("keyless composes with all phases", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      keyless: true,
      tier: "silent",
      dualVm: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      mbaDatabase: true,
      mmTraps: true,
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(500);
  });

  it("keyless output is deterministic with same seed", () => {
    const a1 = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      keyless: true,
    }).lua;
    const a2 = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      keyless: true,
    }).lua;
    expect(a1).toBe(a2);
  });
});
