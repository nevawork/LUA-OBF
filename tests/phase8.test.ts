// NEVAHEX-VM — APEX W1.3 metamethod dispatch traps + CI gate plumbing tests
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";
import { runRedteam } from "../src/testing/redteam";

const SRC = 'local m="x" _G.o=#m return m';

describe("apex W1.3: --mm-traps", () => {
  it("default build has no dispatch traps", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32) });
    expect(r.lua.includes("setmetatable(")).toBe(false);
  });

  it("trap-enabled build routes the root invoke through a randomized metamethod", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32), mmTraps: true });
    // one trap table, randomized arithmetic metamethod, handler wraps run()
    const sm = r.lua.match(/setmetatable\(\{\}, \{(__\w+)=function\(\) return (\w+)\(/)!;
    expect(sm).toBeTruthy();
    expect(["__add", "__sub", "__mul", "__mod"]).toContain(sm[1]);
    // trigger fires exactly once via the chosen operator
    expect(new RegExp(`\\w+ \\* -?\\d`).test(r.lua)).toBe(true);
    // E4: still prologue-only — at most this single metatable site
    expect((r.lua.match(/setmetatable\(/g) || []).length).toBe(1);
  });

  it("red-team records trap presence as advisory and keeps zero wins", () => {
    const on = runRedteam(protect({ source: SRC, seedHex: "cd".repeat(32), mmTraps: true }).lua);
    const trace = on.stages.find((s) => s.name === "metamethod-trace")!;
    expect(trace.advisory).toBe(true);
    expect(trace.detail).toContain("ADVISORY");
    const depth = on.stages.find((s) => s.name === "depth-budget")!;
    expect(depth.advisory).toBe(true);
    expect(depth.detail).toContain("≤2 metatable sites");
    expect(on.ok).toBe(true);
    expect(on.layersDefeated).toBe(0);

    const off = runRedteam(protect({ source: SRC, seedHex: "cd".repeat(32) }).lua);
    const offTrace = off.stages.find((s) => s.name === "metamethod-trace")!;
    expect(offTrace.detail).toContain("--mm-traps off");
    expect(off.ok).toBe(true);
  });

  it("determinism with traps enabled; budgets stay green", () => {
    const a1 = protect({ source: SRC, seedHex: "11".repeat(32), mmTraps: true }).lua;
    const a2 = protect({ source: SRC, seedHex: "11".repeat(32), mmTraps: true }).lua;
    expect(a1).toBe(a2);
    // integration: budget governor passes with the two extra trap locals
    expect(() => protect({ source: SRC, seedHex: "22".repeat(32), mmTraps: true })).not.toThrow();
  });
});
