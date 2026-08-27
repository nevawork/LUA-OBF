// NEVAHEX-VM — Phase 2 mega superoperator tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=1 return x`;

describe("Phase 2: mega superoperators & deep fusion", () => {
  it("mega-superops flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      megaSuperops: true,
      superopNesting: 2,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("mega-superops composes with superops flag", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      megaSuperops: true,
      superops: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("mega-superops with keyless and mm-traps", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      megaSuperops: true,
      superopNesting: 3,
      keyless: true,
      mmTraps: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.includes("setmetatable(")).toBe(true);
  });

  it("mega-superops output is deterministic with same seed", () => {
    const a1 = protect({ source: SRC, seedHex: "11".repeat(32), megaSuperops: true, superopNesting: 2 }).lua;
    const a2 = protect({ source: SRC, seedHex: "11".repeat(32), megaSuperops: true, superopNesting: 2 }).lua;
    expect(a1).toBe(a2);
  });

  it("mega-superops without nesting still produces output", () => {
    const r = protect({
      source: SRC,
      seedHex: "22".repeat(32),
      megaSuperops: true,
      superopNesting: 0,
      mbaPlus: false,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });
});
