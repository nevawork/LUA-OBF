import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { serializeProto, encryptBlob, decryptBlob, normSeed } from "../src/engine/vm/serializer";

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
  
  // Pass the opencode and seed like the pipeline does — get them
  // We need to consume rng to match the pipeline's order
  // Actually let me just do the full protect and use the result
  const r = protect({ source: src, tier: "off", seedHex });
  // Get seeds from artifact
  const saM = r.lua.match(/local sa=\(([^)]+)\)/);
  const sbM = r.lua.match(/sb=\(([^)]+)\)/);
  console.log("sa expr:", saM[1]);
  console.log("sb expr:", sbM[1]);
})();
