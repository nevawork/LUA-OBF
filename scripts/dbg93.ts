import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  // Find the ck0N literal
  const m = r.lua.match(/local (\w+)=\(([^)]+)\)/g);
  // Just look at the lines around line 13
  const lines = r.lua.split("\n");
  for (let i = 10; i <= 17; i++) {
    if (i < lines.length) console.log(`${i+1}: ${lines[i].slice(0, 200)}`);
  }
})();
