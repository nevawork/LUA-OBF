import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  // Find bEnG0d and see what it contains
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("bEnG0d")) {
      console.log(`Line ${i+1}:`, lines[i]);
    }
  }
  // Also look at all lines around line 14
  for (let i = 10; i < 25; i++) {
    console.log(`${i+1}: ${lines[i].slice(0, 200)}`);
  }
})();
