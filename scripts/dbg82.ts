import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { makeOpenCodeParams } from "../src/engine/runtime/opencode";
import * as opMod from "../src/vm/opcodes";
import { Op } from "../src/vm/opcodes";

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
  
  // Print the child proto consts
  const child = root.protos[0];
  console.log("Child consts:");
  for (let i = 0; i < child.consts.length; i++) {
    console.log(`  [${i}] =`, child.consts[i], typeof child.consts[i]);
  }
  // Find the LOADK instructions referencing const 1 (where 1 is the number)
  console.log("Child code first 20:");
  for (let i = 0; i < Math.min(20, child.code.length); i++) {
    const ins = child.code[i];
    const op = ins[0];
    if (op === Op.LOADK) {
      console.log(`  [${i}] LOADK A=${ins[1]} -> consts[${ins[1]}]=${child.consts[ins[1]]}`);
    } else {
      console.log(`  [${i}] op=${op} A=${ins[1]} B=${ins[2]} C=${ins[3]}`);
    }
  }
})();
