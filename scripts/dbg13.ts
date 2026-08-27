import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 70; i <= 75 && i < lines.length; i++) {
    console.log(`${i+1}: ${lines[i].slice(0, 120)}`);
  }
})();
