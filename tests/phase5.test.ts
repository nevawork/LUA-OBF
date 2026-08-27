// NEVAHEX-VM — Phase 5 anti-deobfuscation tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";
import { generatePolymorphicHandlers, generateGadgetDetection } from "../src/protection/anti-luahunt";
import { generatePathExplosionPredicates, generateSelfModifyingCode } from "../src/protection/path-explosion";

const SRC = `local x=10+20 return x`;

describe("Phase 5: anti-deobfuscation hardening", () => {
  it("anti-luahunt flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      antiLuahunt: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("path-explosion flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      pathExplosion: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("self-modifying flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      selfModifying: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("Phase 5 features compose with all previous phases", () => {
    const r = protect({
      source: SRC,
      seedHex: "11".repeat(32),
      antiLuahunt: true,
      pathExplosion: true,
      selfModifying: true,
      regObfuscate: true,
      constShuffle: true,
      megaSuperops: true,
      superopNesting: 2,
      mbaDatabase: true,
      factorizationKeys: true,
      dualVm: true,
      directThreaded: true,
      keyless: true,
      mmTraps: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.includes("setmetatable(")).toBe(true);
    expect(r.lua.length).toBeGreaterThan(500);
  });

  it("Phase 5 output is deterministic with same seed", () => {
    const a1 = protect({ source: SRC, seedHex: "22".repeat(32), antiLuahunt: true, pathExplosion: true, selfModifying: true }).lua;
    const a2 = protect({ source: SRC, seedHex: "22".repeat(32), antiLuahunt: true, pathExplosion: true, selfModifying: true }).lua;
    expect(a1).toBe(a2);
  });

  it("generatePolymorphicHandlers returns variants for base ops", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n), bool: () => Math.random() > 0.5 };
    const handlers = generatePolymorphicHandlers(rng);
    expect(handlers.size).toBeGreaterThan(0);
    for (const [op, variants] of handlers) {
      expect(variants.length).toBeGreaterThanOrEqual(3);
      expect(variants.length).toBeLessThanOrEqual(5);
    }
  });

  it("generateGadgetDetection returns detectors", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const detectors = generateGadgetDetection(rng);
    expect(detectors.length).toBeGreaterThan(0);
  });

  it("generatePathExplosionPredicates returns predicates", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const predicates = generatePathExplosionPredicates(rng, { predicatesPerFunction: 10 });
    expect(predicates.length).toBe(10);
  });

  it("generateSelfModifyingCode returns code snippets", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const snippets = generateSelfModifyingCode(rng);
    expect(snippets.length).toBeGreaterThan(0);
    expect(snippets.join(" ")).toContain("self-modifying");
  });
});
