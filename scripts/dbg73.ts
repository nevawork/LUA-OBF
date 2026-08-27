import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Check for the F table emission — should be in run() function
  // Look for the F = { line
  const m = r.lua.match(/local (F\d+)\s*=\s*\{/);
  if (m) console.log("F table at line 1:", m[1]);
  // Find F emission in run()
  const lines = r.lua.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("F = {") || lines[i].match(/local \w+=\{[^}]*P0/)) {
      console.log(`${i+1}: ${lines[i].slice(0, 200)}`);
    }
  }
})();
