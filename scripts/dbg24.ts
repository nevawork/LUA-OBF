import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Insert error after protos loop ends (look for " end" after the protos loop)
  // Find the line that has "...\n end" (end of the for SDqipcs3c5=1,ZkM0CLjs do ... end)
  // That line should have "protos[i] = pr" right before it
  const lines = r.lua.split("\n");
  for (let i = 60; i <= 80; i++) {
    if (i < lines.length) {
      console.log(`${i+1}: |${lines[i]}|`);
    }
  }
})();
