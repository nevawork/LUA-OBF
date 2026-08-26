import { protect } from "../src/pipeline";
import { deserializeBlob, normSeed, decryptBlob, M31, makeKeyStream } from "../src/engine/vm/serializer";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { makeOpenCodeParams, initialRk } from "../src/engine/runtime/opencode";
import { Op } from "../src/vm/opcodes";
import { verifyGeneratedDispatch } from "../src/testing/dispatch-check";

(async () => {
  // Replicate the pipeline up to the check
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
  
  const seeds: [number, number, number, number] = [
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
  ];
  const pbias = 1 + rng.int(3);
  const logicalCount = Object.keys(Op).filter((x) => isNaN(Number(x))).length;
  const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
  const renumber = (p: any) => {
    for (const ins of p.code) ins[0] = perm[ins[0]];
    p.protos.forEach(renumber);
  };
  renumber(root);
  const opencode = makeOpenCodeParams(rng);
  
  const JUMPY_LOGICAL = [Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP];
  const jumpOps = new Set<number>(JUMPY_LOGICAL.map((op) => perm[op]));
  
  // Get emitted code via the actual protect call
  const r = protect({ source: src, tier: "off", seedHex });
  
  // Manually re-derive the opEToPhys for the usedPhysicalOps
  const { decryptBlob: dec } = await import("../src/engine/vm/serializer.js");
  // We need the perm. Look at manifest
  console.log("perm[0..5]:", r.manifest.fingerprint.perm.slice(0, 5));
  
  // Print chain excerpt
  const lines = r.lua.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^ {2}if .*==.*then *$/.test(lines[i])) {
      console.log(`${i+1}: ${lines[i].slice(0, 120)}`);
    }
    if (i > 260) break;
  }
})();
