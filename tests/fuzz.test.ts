// NEVAHEX-VM — Phase 21 fuzz harness: differential testing of protected output
// Generates random-but-verifiable programs, protects them, executes in wasmoon
// (Lua 5.4 WASM), and compares EXPECTED against generator-computed values.
// Run: npx vitest run tests/fuzz.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { protect } from "../src/pipeline";
import { fuzzSuite } from "../src/testing/fuzz";

const CASES = fuzzSuite(24);

let LuaFactory: typeof import("wasmoon").LuaFactory;

beforeAll(async () => {
  ({ LuaFactory } = await import("wasmoon"));
});

describe("fuzz differential suite", () => {
  for (const c of CASES) {
    it(c.name, async () => {
      const r = protect({ source: c.code, tier: "silent" });
      const lua = await new LuaFactory().createEngine();
      try {
        await lua.doString(r.lua);
        const got = lua.global.getTable("EXPECTED");
        expect(got).toEqual(c.expected);
      } finally {
        lua.global.close();
      }
    }, 15000);
  }

  it("mutation trips strict tier", async () => {
    const c = CASES[0];
    const r = protect({ source: c.code, tier: "strict" });
    // corrupt one byte deep in the blob literal (past header/protos start)
    const idx = r.lua.indexOf("\\0") >= 0 ? r.lua.indexOf("\\0") : Math.floor(r.lua.length / 2);
    const corrupted = r.lua.slice(0, idx) + "\\001" + r.lua.slice(idx + 4);
    const lua = await new LuaFactory().createEngine();
    let failed = false;
    try {
      await lua.doString(corrupted);
    } catch {
      failed = true; // strict tier must halt cryptically or decode must fail
    }
    lua.global.close();
    expect(failed).toBe(true);
  }, 15000);
});
