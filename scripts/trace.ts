import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";
import * as fs from "fs";

const source = `local x = 1
local function f(n) return n*2 end
local t = {1,2,3}
for i=1,3 do x = x + f(t[i]) end
EXPECTED = x
`;

async function main() {
  const res = protect({ source, tier: "off", envProfile: "universal", antiEmulation: false, flatten: false, mbaPlus: false, superops: false, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false });
  fs.writeFileSync(`/tmp/kilo/tr_none.lua`, res.lua);
  const factory = new LuaFactory();
  try {
    const e = await factory.createEngine();
    await e.doString(res.lua);
    console.log("RUN OK", JSON.stringify(await e.doString("return EXPECTED")));
  } catch (err) {
    let trace = "";
    try { trace = await e.doString("return tostring(_G.__VM_TRACE)"); } catch (e2) { trace = "READERR:" + e2; }
    console.log("RUN ERR ->", String(err).split("\n").slice(0, 3).join(" | "));
    console.log("TRACE:\n" + (trace || "(none)"));
  }
}
main();
