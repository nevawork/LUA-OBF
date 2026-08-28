import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";

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

async function main() {
  const factory = new LuaFactory();
  const cases: Array<[string, any]> = [
    ["lua51", { envProfile: "universal" }],
    ["luajit", { envProfile: "universal" }],
    ["luau", { envProfile: "luau" }],
    ["roblox_executor", { envProfile: "roblox_executor" }],
  ];
  for (const [name, opt] of cases) {
    try {
      const res = protect({
        source,
        tier: "off",
        envProfile: opt.envProfile,
        antiEmulation: false,
        flatten: true, mbaPlus: true, superops: true,
        mmTraps: true, keyless: true, regObfuscate: true, constShuffle: true,
        dynLoad: false, layered: false, luauVm: name === "luau" || name === "roblox_executor",
        luraph: false, antiLuahunt: false, pathExplosion: false, selfModifying: false,
        luauAntiDeobfuscation: false, luauOptimize: false, emitSecrets: false,
      });
      const fs = require("fs");
      fs.writeFileSync(`/tmp/kilo/gen_${name}.lua`, res.lua);
      console.log(`\n===== ${name} (len ${res.lua.length}) =====`);
      try {
        const engine = await factory.createEngine();
        await engine.doString(res.lua);
        console.log("[wasmoon lua54] SYNTAX+LOAD OK");
        engine.global.close?.();
      } catch (e) {
        console.log("[wasmoon lua54] ERROR:", String(e).split("\n").slice(0, 6).join(" | "));
      }
    } catch (e) {
      console.log(`\n===== ${name} GENERATE ERROR:`, String(e).split("\n").slice(0, 10).join("\n"));
    }
  }
}
main();
