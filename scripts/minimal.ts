import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";
import * as fs from "fs";

const source = `local function fib(n)
  if n < 2 then return n end
  return fib(n - 1) + fib(n - 2)
end
local M = {}
function M.new(v) return setmetatable({ v = v }, M) end
function M.add(self, n) self.v = self.v + n return self end
function M.get(self) return self.v end
local t = {}
for i = 1, 10 do t[i] = fib(i) end
local function sum(...)
  local s = 0
  for _, v in ipairs({ ... }) do s = s + v end
  return s
end
local o = M.new(5):add(3):add(2)
EXPECTED = { fib(12), t[10], sum(1, 2, 3), o:get() }
`;

async function run(name: string, opts: any) {
  const res = protect({ source, tier: "off", envProfile: "universal", ...opts });
  fs.writeFileSync(`/tmp/kilo/min_${name}.lua`, res.lua);
  const factory = new LuaFactory();
  try {
    const e = await factory.createEngine();
    await e.doString(res.lua);
    const out = await e.global.get("EXPECTED");
    console.log(`[${name}] RUN OK ->`, JSON.stringify(out));
    e.global.close?.();
  } catch (err) {
    console.log(`[${name}] RUN ERR ->`, String(err).split("\n").slice(0, 5).join(" | "));
  }
}

async function main() {
  await run("none", { antiEmulation: false, flatten: false, mbaPlus: false, superops: false, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false, dynLoad: false, layered: false, luauVm: false });
  await run("flatten", { antiEmulation: false, flatten: true, mbaPlus: false, superops: false, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false });
  await run("mba", { antiEmulation: false, flatten: false, mbaPlus: true, superops: false, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false });
  await run("superops", { antiEmulation: false, flatten: false, mbaPlus: false, superops: true, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false });
  await run("full", { antiEmulation: false, flatten: true, mbaPlus: true, superops: true, mmTraps: true, keyless: true, regObfuscate: true, constShuffle: true });
}
main();
