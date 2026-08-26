import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 138; i <= 145; i++) {
    if (i < lines.length) console.log(`${i+1}: |${lines[i]}|`);
  }
})();
