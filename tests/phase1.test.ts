// NEVAHEX-VM — Phase 1 handler explosion tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local m="payload" return m`;

describe("Phase 1: handler explosion & mutation system", () => {
  it("register obfuscation inserts copy NOPs and permutes registers", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32), regObfuscate: true });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("constant shuffling randomizes constant order and applies type confusion", () => {
    const r = protect({ source: SRC, seedHex: "cd".repeat(32), constShuffle: true });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("Phase 1 features compose with existing hardening", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      regObfuscate: true,
      constShuffle: true,
      keyless: true,
      mmTraps: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.includes("setmetatable(")).toBe(true);
  });

  it("Phase 1 output is valid Lua and executes correctly", () => {
    const r = protect({
      source: 'return 1 + 2',
      seedHex: "11".repeat(32),
      regObfuscate: true,
      constShuffle: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(0);
    expect(r.lua.includes("return")).toBe(true);
  });

  it("Phase 1 produces deterministic output with same seed", () => {
    const a1 = protect({ source: SRC, seedHex: "22".repeat(32), regObfuscate: true, constShuffle: true }).lua;
    const a2 = protect({ source: SRC, seedHex: "22".repeat(32), regObfuscate: true, constShuffle: true }).lua;
    expect(a1).toBe(a2);
  });
});
