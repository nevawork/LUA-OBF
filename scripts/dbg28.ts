import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { serializeProto, normSeed, encryptBlob } from "../src/engine/vm/serializer";
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
  console.log("My plain[60..70]:", Array.from(plain.slice(60, 70)));
  // Trace the same: np=2 at 0, pn, va, etc
  // np=2 → 1 byte, value at plain[58] (0-indexed from start of variable data)
  // Wait — plain[0] is framing byte, plain[1..58] is prologue (58 bytes)
  // Then np at plain[59]
  console.log("plain[58] (np):", plain[58]);
  console.log("plain[59] (pn):", plain[59]);
  console.log("plain[60] (va):", plain[60]);
  console.log("plain[61] (nu):", plain[61]);
  console.log("plain[62] (ns):", plain[62]);
  console.log("plain[63] (nc uvarint start):", plain[63]);
})();
