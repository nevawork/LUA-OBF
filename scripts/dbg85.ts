import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";

(async () => {
  const src = "return 1+1";
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
  
  // The chunk's return is the SUB expression `1 - (- 1)`. So:
  //   LOADK 1 (push 1)
  //   LOADK 1 (push 1)
  //   NEG
  //   SUB
  // 
  // So we should find a NEG instruction in the chunk's code (or in a child proto?)
  // Actually, the chunk's return is in the CHUNK's code, not the child. Let me check.
  console.log("root.code (chunk):");
  for (let i = 0; i < root.code.length; i++) {
    console.log(`  [${i}]`, root.code[i]);
  }
  console.log("root.consts:", root.consts);
})();
