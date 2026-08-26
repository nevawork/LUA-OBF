import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 26; i <= 28; i++) {
    if (i < lines.length) console.log(`${i+1}: |${lines[i]}|`);
  }
})();
