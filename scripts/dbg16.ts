import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 50; i <= 56 && i < lines.length; i++) {
    console.log(`${i+1}: |${lines[i]}|`);
  }
  // Find the line with D[i]=...
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("D[i]=(sbyte")) {
      console.log(`Found at line ${i+1}: ${lines[i]}`);
      console.log(`Line +1: ${lines[i+1]}`);
    }
  }
})();
