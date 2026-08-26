import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  // Find the chain (look for "if <varname>===")
  for (let i = 130; i < lines.length; i++) {
    if (/^ {2}if .*==/.test(lines[i])) {
      console.log(`${i+1}: ${lines[i].slice(0, 100)}`);
    }
    if (i > 200) break;
  }
})();
