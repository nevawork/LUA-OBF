// NEVAHEX-VM — Phase 4 dual-VM architecture tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

const SRC = `local x=10+20 return x`;

describe("Phase 4: dual-VM architecture & direct-threaded dispatch", () => {
  it("dual-vm flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "ab".repeat(32),
      dualVm: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("direct-threaded flag produces valid protected output", () => {
    const r = protect({
      source: SRC,
      seedHex: "cd".repeat(32),
      directThreaded: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("dual-vm composes with direct-threaded", () => {
    const r = protect({
      source: SRC,
      seedHex: "ef".repeat(32),
      dualVm: true,
      directThreaded: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("dual-vm composes with Phase 1, 2, 3 features", () => {
    const r = protect({
      source: SRC,
      seedHex: "11".repeat(32),
      dualVm: true,
      directThreaded: true,
      regObfuscate: true,
      constShuffle: true,
      megaSuperops: true,
      superopNesting: 2,
      mbaDatabase: true,
      factorizationKeys: true,
      keyless: true,
      mmTraps: true,
      tier: "silent",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.includes("setmetatable(")).toBe(true);
    expect(r.lua.length).toBeGreaterThan(500);
  });

  it("Phase 4 output is deterministic with same seed", () => {
    const a1 = protect({ source: SRC, seedHex: "22".repeat(32), dualVm: true, directThreaded: true }).lua;
    const a2 = protect({ source: SRC, seedHex: "22".repeat(32), dualVm: true, directThreaded: true }).lua;
    expect(a1).toBe(a2);
  });

  it("dual-vm without direct-threaded still works", () => {
    const r = protect({
      source: SRC,
      seedHex: "33".repeat(32),
      dualVm: true,
      directThreaded: false,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });

  it("direct-threaded without dual-vm still works", () => {
    const r = protect({
      source: SRC,
      seedHex: "44".repeat(32),
      dualVm: false,
      directThreaded: true,
      tier: "off",
    });
    expect(r.lua).toBeTruthy();
    expect(r.lua.length).toBeGreaterThan(SRC.length);
  });
});
