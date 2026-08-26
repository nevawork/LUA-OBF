import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { serializeProto, normSeed, encryptBlob, decryptBlob } from "../src/engine/vm/serializer";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { makeOpenCodeParams } from "../src/engine/runtime/opencode";
import * as opMod from "../src/vm/opcodes";

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
  
  // Mirror pipeline exactly
  const seeds: [number, number, number, number] = [
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
  ];
  const pbias = 1 + rng.int(3);
  const logicalCount = Object.keys(opMod.Op).filter((x) => isNaN(Number(x))).length;
  const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
  const renumber = (p: any) => {
    for (const ins of p.code) ins[0] = perm[ins[0]];
    p.protos.forEach(renumber);
  };
  renumber(root);
  const opencode = makeOpenCodeParams(rng);
  console.log("My perm first 10:", perm.slice(0, 10));
  console.log("My opencode:", opencode);
  console.log("My seeds:", seeds);
  
  const JUMPY_LOGICAL = [opMod.Op.JMP, opMod.Op.JF, opMod.Op.JT, opMod.Op.FORPREP, opMod.Op.FORLOOP, opMod.Op.GFORPREP, opMod.Op.GFORLOOP];
  const jumpOps = new Set<number>(JUMPY_LOGICAL.map((op) => perm[op]));
  
  const { plain, flat, keys } = serializeProto(root, undefined, {
    rng,
    jumpOps,
    opencode,
    constKey: normSeed(seeds[3]),
    permMap: perm,
  });
  console.log("My plain[0..5]:", Array.from(plain.slice(0, 5)));
  console.log("My flat len:", flat.length);
  console.log("My flat[0].code len:", flat[0].code.length);
  console.log("My total protos:", flat.length);
  
  // Compare to actual
  const r = protect({ source: src, tier: "off", seedHex });
  console.log("Manifest fingerprint.perm[0..10]:", r.manifest.fingerprint.perm.slice(0, 10));
  console.log("Manifest opencode? -> ", r.manifest.opencode);
})();
