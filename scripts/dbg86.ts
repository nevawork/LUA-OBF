import { parse } from "../src/lang/parser";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";

(async () => {
  const src = "return 1+1";
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  const chunk = parse(src);
  console.log("After parse, stats:", chunk.stats.length, "ret:", chunk.ret);
  resetCounter();
  encryptStrings(chunk, rng);
  console.log("After encryptStrings, stats:", chunk.stats.length);
  flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  console.log("After flatten, stats:", chunk.stats.length);
  injectOpaqueJunk(chunk, 0.12, rng);
  console.log("After opaque, stats:", chunk.stats.length);
  applyMbaPlus(chunk, { rng });
  console.log("After mba, stats:", chunk.stats.length);
  
  // Print the chunk
  console.log("Final chunk:");
  console.log(JSON.stringify(chunk, null, 2));
})();
