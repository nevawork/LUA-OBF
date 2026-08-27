import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  // Find the F definitions
  for (let i = 12; i < 22; i++) {
    console.log(`${i+1}: ${lines[i].slice(0, 200)}`);
  }
})();
