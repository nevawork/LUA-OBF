import { protect } from "../src/pipeline";
import { BuildRng, sha256, normSeed } from "../src/gen/prng";

(async () => {
  // Replicate the rng state
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  // Skip the transforms (we know they consume some rng but small amounts)
  // Actually, we can just draw 4 seeds to find the right one
  // But we need the actual sequence
  // The 4 seeds are: normSeed(rng.int(M-1)+1) x 4
  // After all the transforms consume some, but the seeds in pipeline come after compile
  // Let me just check if normSeed(M-1) gives 0
  console.log("normSeed(2147483646):", normSeed(2147483646));
  console.log("normSeed(2147483647):", normSeed(2147483647));
  console.log("normSeed(0):", normSeed(0));
  console.log("normSeed(1):", normSeed(1));
})();
