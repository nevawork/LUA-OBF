import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Find the F var declaration — it's a long single line
  const m = r.lua.match(/local (\w+),(\w+),(\w+),(\w+),(\w+),(\w+),(\w+),(\w+),(\w+),(\w+),(\w+),(\w+)/);
  // Just search for the F var
  const lines = r.lua.split("\n");
  for (let i = 8; i < 14; i++) {
    console.log(`${i+1}: ${lines[i].slice(0, 300)}`);
  }
})();
