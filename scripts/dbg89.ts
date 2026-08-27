import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";

(async () => {
  const src = "return 42";
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  const chunk = parse(src);
  resetCounter();
  encryptStrings(chunk, rng);
  flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, 0.12, rng);
  applyMbaPlus(chunk, { rng });
  const root = compileChunk(chunk);
  console.log("root.consts:", root.consts);
  for (let i = 0; i < root.code.length; i++) {
    const ins = root.code[i];
    if (ins[0] === 4) { // LOADK
      const cv = root.consts[ins[1]];
      console.log(`  [${i}] LOADK A=${ins[1]} -> ${JSON.stringify(cv)} (${typeof cv})`);
    }
  }
})();
