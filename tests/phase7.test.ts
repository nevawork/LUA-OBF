// NEVAHEX-VM — Phase 7 anti-tamper tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=10+20 return x`;

describe("Phase 7: Advanced anti-tamper", () => {
  it("produces valid protected output with anti-tamper", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("anti-tamper composes with all phases", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      tier: "silent",
      dualVm: true,
      directThreaded: true,
      luauVm: true,
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      megaSuperops: true,
      superopNesting: 2,
      mbaDatabase: true,
      factorizationKeys: true,
      regObfuscate: true,
      constShuffle: true,
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(1000);
    expect(r.lua.includes("setmetatable(")).toBe(true);
  });

  it("output is deterministic with same seed", () => {
    const a1 = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      tier: "silent",
    }).lua;
    const a2 = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      tier: "silent",
    }).lua;
    expect(a1).toBe(a2);
  });

  it("handles complex source with anti-tamper", () => {
    const complexSrc = `
      local function fib(n)
        if n <= 1 then return n end
        return fib(n - 1) + fib(n - 2)
      end
      local result = fib(10)
      return result
    `;
    const r = protect({
      source: complexSrc,
      seedHex: "12".repeat(32),
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(complexSrc.length);
  });

  it("handles source with tables", () => {
    const tableSrc = `
      local t = {a = 1, b = 2, c = 3}
      local sum = 0
      for k, v in pairs(t) do
        sum = sum + v
      end
      return sum
    `;
    const r = protect({
      source: tableSrc,
      seedHex: "34".repeat(32),
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(tableSrc.length);
  });

  it("handles source with closures", () => {
    const closureSrc = `
      local function make_adder(n)
        return function(x)
          return x + n
        end
      end
      local add5 = make_adder(5)
      return add5(10)
    `;
    const r = protect({
      source: closureSrc,
      seedHex: "56".repeat(32),
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(closureSrc.length);
  });
});
