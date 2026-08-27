import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 755; i <= 765; i++) {
    if (i < lines.length) console.log(`${i+1}: ${lines[i].slice(0, 200)}`);
  }
})();
