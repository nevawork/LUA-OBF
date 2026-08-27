import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { serializeProto, normSeed } from "../src/engine/vm/serializer";
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
  
  const JUMPY_LOGICAL = [opMod.Op.JMP, opMod.Op.JF, opMod.Op.JT, opMod.Op.FORPREP, opMod.Op.FORLOOP, opMod.Op.GFORPREP, opMod.Op.GFORLOOP];
  const jumpOps = new Set<number>(JUMPY_LOGICAL.map((op) => perm[op]));
  
  const { plain, flat, keys } = serializeProto(root, undefined, {
    rng,
    jumpOps,
    opencode,
    constKey: normSeed(seeds[3]),
    permMap: perm,
  });
  // Print the full plain
  console.log("My plain[60..80]:", Array.from(plain.slice(60, 80)));
  // The first proto starts after framing (1+58=59) + np varint
  // np=2 → 1 byte, so proto 1 starts at plain[60]
  // For proto 1: pn (1) + va (1) + nu uvarint (1 if 0) + ns uvarint + nc uvarint + ... + field keys
  // So plain[60] = pn, plain[61] = va, plain[62] = nu (1 byte if 0)
  console.log("plain[60] (pn):", plain[60]);
  console.log("plain[61] (va):", plain[61]);
  console.log("plain[62] (nu):", plain[62]);
  // Then for each upval: 1 byte (instack) + uvarint (idx) = 2 bytes
  // ns uvarint
  console.log("plain[63] (ns uvarint):", plain[63]);
  // nc uvarint
  console.log("plain[64] (nc uvarint):", plain[64]);
  // field keys (5 uvarints)
  console.log("plain[65..]:", Array.from(plain.slice(65, 75)));
})();
