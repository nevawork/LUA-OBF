import { LuaFactory } from "wasmoon";
import * as fs from "fs";

async function testEnv(envLabel: string, setup: (lua: string) => string) {
  const artifact = fs.readFileSync("samples/sample_roblox_executor.lua", "utf8");
  const code = setup(artifact);
  const factory = new LuaFactory();
  const eng = await factory.createEngine();
  try {
    // The artifact is: return (function(...) ... end)(arg)
    // doString runs it, which calls the IIFE, which runs the VM.
    // We capture errors to see if the unpack/env access crashes.
    await eng.doString(code);
    // Check if EXPECTED was set (smoke fixture sets it)
    const expected = await eng.doString("return EXPECTED").catch(() => undefined);
    console.log(`[${envLabel}] OK ->`, JSON.stringify(expected)?.slice(0, 80));
  } catch (err: any) {
    const msg = String(err).split("\n").slice(0, 3).join(" | ");
    console.log(`[${envLabel}] ERR ->`, msg);
  }
}

async function main() {
  // Test 1: Normal environment
  await testEnv("normal", (a) => a);

  // Test 2: Strip _ENV before loading
  await testEnv("nil_env", (a) => `_ENV = nil\n${a}`);

  // Test 3: Stripped _ENV (minimal stub)
  await testEnv("stripped_env", (a) => `_ENV = {string=string, table=table, unpack=unpack}\n${a}`);

  // Test 4: Only _G available (Roblox executor style)
  await testEnv("only_G", (a) => `_ENV = nil; rawset(_G, "string", string); rawset(_G, "table", table)\n${a}`);
}
main();
