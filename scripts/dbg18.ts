import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { serializeProto, encryptBlob, decryptBlob, normSeed, makeKeyStream } from "../src/engine/vm/serializer";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";

(async () => {
  const src = "return 1+1";
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  // Replicate the pipeline including opencode and perm
  const chunk = parse(src);
  resetCounter();
  encryptStrings(chunk, rng);
  flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, 0.12, rng);
  applyMbaPlus(chunk, { rng });
  const root = compileChunk(chunk);
  
  // Now the opencode is generated NEXT in the pipeline
  const { makeOpenCodeParams } = await import("../src/engine/runtime/opencode");
  const opencode = makeOpenCodeParams(rng);
  
  // And the perm
  const logicalCount = Object.keys((await import("../src/vm/opcodes")).Op).filter(x => isNaN(Number(x))).length;
  const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
  
  // And the jumpOps
  const Op = (await import("../src/vm/opcodes")).Op;
  const JUMPY_LOGICAL = [Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP];
  const jumpOps = new Set<number>(JUMPY_LOGICAL.map((op) => perm[op]));
  
  // Renumber code
  for (const ins of root.code) {
    if (ins[0] < 1000) ins[0] = perm[ins[0]];
  }
  for (const sub of root.protos) {
    for (const ins of sub.code) {
      if (ins[0] < 1000) ins[0] = perm[ins[0]];
    }
  }
  
  // Get the seeds (next in pipeline)
  const seeds: [number, number, number, number] = [
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
  ];
  
  // Serialize
  const { plain, flat, keys } = serializeProto(root, undefined, {
    rng,
    jumpOps,
    opencode,
    constKey: normSeed(seeds[3]),
    permMap: perm,
  });
  console.log("flat len:", flat.length);
  console.log("flat[0].code len:", flat[0].code.length);
  console.log("plain[0..5]:", Array.from(plain.slice(0, 5)));
  console.log("plain len:", plain.length);
  
  // Now compare to what we decrypt from the actual artifact
  const r = protect({ source: src, tier: "off", seedHex });
  // Get artifact blob
  const m = r.lua.match(/local \w+="((?:[^"\\]|\\.)*)"/);
  if (!m) return;
  const lit = m[1];
  const bytes: number[] = [];
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === '\\') {
      let d = '';
      i++;
      while (d.length < 3 && i < lit.length && /[0-9]/.test(lit[i])) { d += lit[i]; i++; }
      bytes.push(parseInt(d, 10) & 0xff);
    } else {
      bytes.push(lit.charCodeAt(i) & 0xff);
      i++;
    }
  }
  const dec = decryptBlob(Buffer.from(bytes), [normSeed(733567036), normSeed(1704268465), 1, 1]);
  console.log("decrypted[0..5]:", Array.from(dec.slice(0, 5)));
  console.log("decrypted len:", dec.length);
  
  console.log("Match:", Buffer.compare(plain, dec));
})();
