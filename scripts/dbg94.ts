import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  console.log("seeds[3] (manifest):", r.manifest.seeds);
  // Without emitSecrets, we can't see seeds. Let me check the obfuscated literal.
  // The literal is `(451849814*4/4)` etc. Let me find ALL field key + seed literals.
  const lines = r.lua.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/local \w+=\([0-9*+ ()-]+\)/.test(lines[i])) {
      // Look for the specific line
      if (lines[i].includes("bEnG0d")) console.log(`${i+1}: ${lines[i]}`);
    }
  }
})();
