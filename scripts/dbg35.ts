import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 65; i <= 80; i++) {
    if (i < lines.length) console.log(`${i+1}: |${lines[i]}|`);
  }
})();
