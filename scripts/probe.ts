import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";
import * as fs from "fs";

const cases: Array<[string, string]> = [
  ["lit", `EXPECTED = 42`],
  ["arith", `local x=2 local y=3 EXPECTED=x+y*4`],
  ["table1", `local t={1,2,3} EXPECTED=t[2]`],
  ["func", `local function f(n) return n*2 end EXPECTED=f(5)`],
  ["loop", `local s=0 for i=1,5 do s=s+i end EXPECTED=s`],
  ["vararg", `local function sum(...) local s=0 for _,v in ipairs({...}) do s=s+v end return s end EXPECTED=sum(1,2,3)`],
  ["method", `local M={} function M:g(n) return n+1 end EXPECTED=M:g(4)`],
];

async function main() {
  const factory = new LuaFactory();
  for (const [name, source] of cases) {
    const res = protect({ source, tier: "off", envProfile: "universal", antiEmulation: false, flatten: false, mbaPlus: false, superops: false, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false });
    const eng = await factory.createEngine();
    try {
      await eng.doString(res.lua);
      const out = await eng.doString("return EXPECTED");
      console.log(`[${name}] OK ->`, JSON.stringify(out));
    } catch (err) {
      console.log(`[${name}] ERR ->`, String(err).split("\n")[0]);
    }
    eng.global.close?.();
  }
}
main();
