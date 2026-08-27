import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 200; i <= 210; i++) {
    if (i < lines.length) console.log(`${i+1}: |${lines[i]}|`);
  }
})();
