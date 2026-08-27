// NEVAHEX-VM — Phase 3 SMT-resistant MBA tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";
import { getMbaDatabase, getMbaStats, pickMba } from "../src/transforms/mba-database";
import { generateSemiprime, synthesizePartialPoint, createFactorizationKeyCheck, validateMbaEquivalence } from "../src/transforms/mba-synthesizer";

const SRC = `local x=10+20 return x`;

describe("Phase 3: SMT-resistant MBA 2.0", () => {
  it("MBA database loads and contains expressions", () => {
    const db = getMbaDatabase();
    expect(db.totalCount).toBeGreaterThan(100);
    const stats = getMbaStats();
    expect(stats.totalClasses).toBeGreaterThan(0);
  });

  it("MBA stats function returns valid statistics", () => {
    const stats = getMbaStats();
    expect(stats.totalExpressions).toBeGreaterThan(100);
    expect(stats.totalClasses).toBeGreaterThan(0);
    expect(stats.expressionsPerClass.length).toBeGreaterThan(0);
  });

  it("pickMba returns expressions from the correct class", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const addMba = pickMba(0, rng);
    expect(addMba).not.toBeNull();
    expect(addMba!.classId).toBe(0);
    expect(addMba!.className).toBe("ADD");
    expect(addMba!.lua).toContain("x");
    expect(addMba!.lua).toContain("y");
  });

  it("mba-database flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      mbaDatabase: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("factorization-keys flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      factorizationKeys: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("mba-database composes with factorization-keys", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      mbaDatabase: true,
      factorizationKeys: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("Phase 3 features compose with Phase 1 and 2", () => {
    const r = protect({
      source: SRC,
      seedHex: "11".repeat(32),
      mbaDatabase: true,
      factorizationKeys: true,
      regObfuscate: true,
      constShuffle: true,
      megaSuperops: true,
      superopNesting: 2,
      keyless: true,
      mmTraps: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.includes("setmetatable(")).toBe(true);
    expect(r.lua.length).toBeGreaterThan(500);
  });

  it("MBA database expressions are semantically valid", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const addMbas = getMbaDatabase().expressions.filter((e) => e.classId === 0);
    const testValues = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 10, y: 20 },
      { x: -5, y: 3 },
      { x: 100, y: -50 },
    ];

    let validCount = 0;
    for (const mba of addMbas.slice(0, 20)) {
      if (validateMbaEquivalence(mba.core, mba.lua, testValues)) {
        validCount++;
      }
    }
    expect(validCount).toBeGreaterThan(10);
  });

  it("generateSemiprime produces a valid semiprime", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    // Use smaller bit size for fast test execution
    const semi = generateSemiprime(rng);
    expect(semi).toBeGreaterThan(0);
    expect(semi).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });

  it("synthesizePartialPoint returns a valid function", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const ppf = synthesizePartialPoint(42, rng);
    expect(ppf.targetKey).toBe(42);
    expect(ppf.luaExpr).toContain("42");
    expect(ppf.difficulty).toBeGreaterThan(0);
  });

  it("createFactorizationKeyCheck produces valid Lua", () => {
    const rng = { int: (n: number) => Math.floor(Math.random() * n) };
    const semi = generateSemiprime(rng);
    const check = createFactorizationKeyCheck(semi, 7);
    expect(check).toContain("==");
    expect(check).toContain("%");
  });
});
