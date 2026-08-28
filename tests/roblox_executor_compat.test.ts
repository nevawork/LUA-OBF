/**
 * Regression test for the Roblox/Luau executor nil-index bug.
 *
 * Bug: the emitter emitted `type(${envGlobal}.unpack)` and
 * `${envGlobal}.string.char` directly. When the artifact runs in a
 * Roblox executor context where `_ENV` is nil or a stripped table,
 * these expressions raise "attempt to index nil with 'unpack'/'char'".
 *
 * Fix: the emitter now routes all env builtin lookups through safe
 * helpers (`egf`/`egft`) that reject non-table inputs, and resolves
 * the env to a local alias with a `_ENV -> _G -> {}` fallback chain.
 */
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";
import * as fs from "fs";
import * as path from "path";

const SMOKE = `local x = 1; EXPECTED = x`;

function gen(target: string, outFile: string): void {
  const res = protect({
    source: SMOKE,
    tier: "off",
    envProfile: target as any,
    antiEmulation: false,
    flatten: false, mbaPlus: false, superops: false,
    mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false,
  });
  fs.writeFileSync(outFile, res.lua);
}

describe("Roblox/Luau executor nil-index safety", () => {
  const artifact = path.join(__dirname, "..", "samples", "sample_roblox_executor.lua");
  gen("roblox_executor", artifact);
  const code = fs.readFileSync(artifact, "utf8");

  it("does not contain direct _ENV.unpack access", () => {
    expect(code).not.toMatch(/type\(_ENV\.unpack\)/);
    expect(code).not.toMatch(/type\(_ENV\.string\)/);
    expect(code).not.toMatch(/type\(_ENV\.table\)/);
  });

  it("does not contain direct _G.unpack/_G.string/_G.table access", () => {
    expect(code).not.toMatch(/type\(_G\.unpack\)/);
    expect(code).not.toMatch(/_G\.string\.char/);
    expect(code).not.toMatch(/_G\.table\.concat/);
  });

  it("emits the safe env-resolver with _ENV -> _G -> {} fallback", () => {
    expect(code).toMatch(/type\(_ENV\)=="table" and _ENV/);
    expect(code).toMatch(/type\(_G\)=="table" and _G/);
  });

  it("emits safe property-access helpers (egf/egft) that reject nil", () => {
    // The helper function body: type(e)~="table" then return end
    expect(code).toMatch(/type\(e\)~="table" then return end/);
    expect(code).toMatch(/rawget\(e,k\)/);
  });

  it("does not pass raw _ENV to the run() bootstrap call", () => {
    // The bootstrap should NOT have a bare _ENV as the env argument.
    // It should use the safe envAlias local. The run function name is
    // randomized per build, so we match the general pattern:
    //   <name>_decode(), <rootPid>, <envArg>, {}, <args>, nil
    // The envArg must be a local name (alphanumeric, starts with letter/_),
    // not the literal _ENV or _G.
    const bootstrapMatch = code.match(/(\w+)_decode\(\),\d+,(\w+),\{\},/);
    expect(bootstrapMatch).not.toBeNull();
    const envArg = bootstrapMatch![2];
    expect(envArg).not.toBe("_ENV");
    expect(envArg).not.toBe("_G");
    // The envArg should be a randomized local (uppercase letter + lowercase/digits)
    // which is what id() generates.
    expect(envArg).toMatch(/^[A-Z][a-zA-Z0-9_]*$/);
  });

  it("the envAlias is initialized with the _ENV -> _G -> {} fallback", () => {
    // The envAlias line has the form: local <name>=(type(_ENV)=="table" and _ENV) or (type(_G)=="table" and _G) or {}
    // Find the line by searching for the _ENV fallback pattern.
    const line = code.split("\n").find(l => l.includes("type(_ENV)==\"table\" and _ENV"));
    expect(line).toBeDefined();
    // Extract the variable name: "local NAME=(type(_ENV)..."
    const m = line!.match(/local (\w+)=\(type\(_ENV\)/);
    expect(m).not.toBeNull();
    const envAlias = m![1];
    // The same line must also have the _G fallback and the {} fallback.
    expect(line!).toMatch(/type\(_G\)=="table" and _G/);
    expect(line!).toMatch(/or \{\}/);
    // The envAlias must be used as the env argument in the bootstrap.
    // The bootstrap pattern is: <runname>(_decode(), N, envAlias, {}, <args>, nil)
    const bootstrap = code.match(new RegExp(`(\\w+)_decode\\(\\),\\d+,${envAlias},\\{\\},`));
    expect(bootstrap).not.toBeNull();
  });
});
