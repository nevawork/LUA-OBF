import { protect } from "../src/pipeline";
import { BuildRng, sha256, randomNonce } from "../src/gen/prng";
import { normSeed } from "../src/engine/crypto/cipher";

(async () => {
  // Build seeds manually
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  // Simulate what the pipeline does
  // (skip the transforms by counting them)
  // Actually let me just call protect and look at the actual ck0N value
  
  // Check the seeds
  // The transforms consume some rng but not many. Let me just check
  // what normSeed(opts.seeds[3]) is.
  
  // Better: look at the artifact's ck0N literal directly
  const r = protect({ source: "return 42", tier: "off", seedHex });
  const lines = r.lua.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("bEnG0d")) {
      console.log(`Line ${i+1}:`, lines[i]);
    }
  }
  
  // Now manually reproduce the seeds
  // The seeds are drawn AFTER the transforms. The transforms consume some
  // rng. Let me just draw 4 seeds and check.
  const s3 = normSeed(rng.int(2147483646) + 1);
  console.log("Random s3 from current rng state:", s3);
  // Note: this isn't the actual s3 used by protect (the state has been
  // advanced by many calls in the middle). But just to confirm normSeed
  // doesn't return 0.
})();
