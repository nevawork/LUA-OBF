import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import * as fs from "fs";

const source = `local x = 1
local function f(n) return n*2 end
local t = {1,2,3}
for i=1,3 do x = x + f(t[i]) end
EXPECTED = x
`;

interface Case { name: string; envProfile: "universal"|"luau"|"luau_executor"|"roblox_executor"; opts: any; ver: "lua51"|"luau"|"roblox_executor"; }
const base = { tier: "off" as const, antiEmulation: false };
const cases: Case[] = [];
const add = (name: string, envProfile: any, opts: any, ver: any) =>
  cases.push({ name, envProfile, opts: { ...base, ...opts }, ver });

add("uni_basic", "universal", {}, "lua51");
add("uni_luraph", "luau", { luraph: true, luauVm: true }, "luau");
add("uni_executorVm", "universal", { executorVm: true }, "lua51");
add("uni_dualVm", "universal", { dualVm: true }, "lua51");
add("uni_tier_silent", "universal", { tier: "silent" }, "lua51");
add("uni_tier_strict", "universal", { tier: "strict" }, "lua51");
add("uni_stage2", "universal", { stage2: true }, "lua51");
add("luau_basic", "luau", { luauVm: true }, "luau");
add("luau_luraph", "luau", { luraph: true, luauVm: true }, "luau");
add("roblox_basic", "roblox_executor", { luauVm: true }, "roblox_executor");
add("roblox_luraph", "roblox_executor", { luraph: true, luauVm: true }, "roblox_executor");
add("luau_exec", "luau_executor", { luauVm: true }, "luau");
add("uni_mmTraps_off", "universal", { mmTraps: false }, "lua51");
add("uni_keyless_off", "universal", { keyless: false }, "lua51");
add("uni_regobf", "universal", { regObfuscate: true }, "lua51");
add("uni_constshuf", "universal", { constShuffle: true }, "lua51");
add("uni_mega", "universal", { megaSuperops: true }, "lua51");
add("uni_flatten_mba", "universal", { flatten: true, mbaPlus: true }, "lua51");

let syntaxFail = 0, genFail = 0;
for (const c of cases) {
  try {
    const res = protect({ source, envProfile: c.envProfile, ...c.opts });
    fs.writeFileSync(`/tmp/kilo/brute_${c.name}.lua`, res.lua);
    try {
      parse(res.lua, c.ver);
      console.log(`[PARSE OK]   ${c.name}`);
    } catch (e) {
      syntaxFail++;
      console.log(`[PARSE FAIL] ${c.name}:`, String(e).split("\n").slice(0,3).join(" | "));
    }
  } catch (e) {
    genFail++;
    console.log(`[GEN FAIL]   ${c.name}:`, String(e).split("\n").slice(0,4).join("\n"));
  }
}
console.log(`\nSUMMARY: syntaxFail=${syntaxFail} genFail=${genFail} total=${cases.length}`);
