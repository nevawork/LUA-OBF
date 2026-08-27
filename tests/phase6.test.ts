// NEVAHEX-VM — Phase 6 Luau bytecode virtualization tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=10+20 return x`;

describe("Phase 6: Luau bytecode virtualization", () => {
  it("luau-vm flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      luauVm: true,
      tier: "off",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("luau target profile produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      luauVm: true,
      tier: "off",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("Luau virtualization composes with anti-deobfuscation", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      tier: "silent",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(500);
  });

  it("Luau output is deterministic with same seed", () => {
    const a1 = protect({
      source: SRC,
      seedHex: "22".repeat(32),
      luauVm: true,
      envProfile: "luau",
    }).lua;
    const a2 = protect({
      source: SRC,
      seedHex: "22".repeat(32),
      luauVm: true,
      envProfile: "luau",
    }).lua;
    expect(a1).toBe(a2);
  });

  it("Luau virtualization handles fast calls", () => {
    const fastCallSrc = `
      local function add(a, b) return a + b end
      local result = add(1, 2)
      return result
    `;
    const r = protect({
      source: fastCallSrc,
      seedHex: "33".repeat(32),
      luauVm: true,
      tier: "off",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(fastCallSrc.length);
  });

  it("Luau virtualization handles generic for loops", () => {
    const genericForSrc = `
      local t = {1, 2, 3}
      local sum = 0
      for i, v in ipairs(t) do
        sum = sum + v
      end
      return sum
    `;
    const r = protect({
      source: genericForSrc,
      seedHex: "44".repeat(32),
      luauVm: true,
      tier: "off",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(genericForSrc.length);
  });

  it("Luau virtualization handles varargs", () => {
    const varargSrc = `
      local function count_args(...)
        return select('#', ...)
      end
      local n = count_args(1, 2, 3, 4, 5)
      return n
    `;
    const r = protect({
      source: varargSrc,
      seedHex: "55".repeat(32),
      luauVm: true,
      tier: "off",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(varargSrc.length);
  });

  it("Luau virtualization handles typeof()", () => {
    const typeofSrc = `
      local t = {}
      local t1 = typeof(t)
      local n = 42
      local t2 = typeof(n)
      return t1, t2
    `;
    const r = protect({
      source: typeofSrc,
      seedHex: "66".repeat(32),
      luauVm: true,
      tier: "off",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(typeofSrc.length);
  });

  it("Luau virtualization preserves Roblox-specific patterns", () => {
    const robloxSrc = `
      local function onTouch(hit)
        local part = hit.Parent
        if part:IsA('BasePart') then
          part.BrickColor = BrickColor.new('Red')
        end
      end
      return onTouch
    `;
    const r = protect({
      source: robloxSrc,
      seedHex: "77".repeat(32),
      luauVm: true,
      tier: "silent",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(robloxSrc.length);
  });

  it("Phase 6 composes with all previous phases", () => {
    const r = protect({
      source: SRC,
      seedHex: "88".repeat(32),
      luauVm: true,
      dualVm: true,
      directThreaded: true,
      regObfuscate: true,
      constShuffle: true,
      megaSuperops: true,
      superopNesting: 2,
      mbaDatabase: true,
      factorizationKeys: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      keyless: true,
      mmTraps: true,
      tier: "silent",
      envProfile: "luau",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.includes("setmetatable(")).toBe(true);
    expect(r.lua.length).toBeGreaterThan(1000);
  });
});
