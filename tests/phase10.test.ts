// NEVAHEX-VM — Phase 10 comprehensive integration tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=10+20 return x`;

describe("Phase 10: Full integration", () => {
  it("produces valid protected output with all features", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      tier: "silent",
      dualVm: true,
      directThreaded: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      superopNesting: 3,
      mbaDatabase: true,
      factorizationKeys: true,
      regObfuscate: true,
      constShuffle: true,
      keyless: true,
      mmTraps: true,
      envProfile: "universal",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(1000);
  });

  it("full integration output is deterministic with same seed", () => {
    const a1 = protect({
      source: SRC,
      seedHex: "12".repeat(32),
      tier: "silent",
      dualVm: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      mbaDatabase: true,
      factorizationKeys: true,
      regObfuscate: true,
      constShuffle: true,
      keyless: true,
      mmTraps: true,
    }).lua;
    const a2 = protect({
      source: SRC,
      seedHex: "12".repeat(32),
      tier: "silent",
      dualVm: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      mbaDatabase: true,
      factorizationKeys: true,
      regObfuscate: true,
      constShuffle: true,
      keyless: true,
      mmTraps: true,
    }).lua;
    expect(a1).toBe(a2);
  });

  it("handles complex Lua patterns", () => {
    const complexSrc = `
      local function fact(n)
        if n <= 1 then return 1 end
        return n * fact(n - 1)
      end
      local t = {1, 2, 3, 4, 5}
      local sum = 0
      for i, v in ipairs(t) do
        sum = sum + v
      end
      local f = fact(5)
      return sum + f
    `;
    const r = protect({
      source: complexSrc,
      seedHex: "34".repeat(32),
      tier: "silent",
      dualVm: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      mbaDatabase: true,
      factorizationKeys: true,
      regObfuscate: true,
      constShuffle: true,
      keyless: true,
      mmTraps: true,
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(complexSrc.length);
  });
});
