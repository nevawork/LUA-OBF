// NEVAHEX-VM — Phase 8 metamethod traps tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=10+20 return x`;

describe("Phase 8: Metamethod traps", () => {
  it("produces valid protected output with mm-traps", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      mmTraps: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("mm-traps composes with all phases", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      mmTraps: true,
      tier: "silent",
      dualVm: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      mbaDatabase: true,
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(500);
  });

  it("mm-traps output is deterministic with same seed", () => {
    const a1 = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      mmTraps: true,
    }).lua;
    const a2 = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      mmTraps: true,
    }).lua;
    expect(a1).toBe(a2);
  });
});
