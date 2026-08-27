import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { serializeProto, encryptBlob, decryptBlob, normSeed } from "../src/engine/vm/serializer";

(async () => {
  // Replicate the pipeline build
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
  
  // Now serialize with no opencode (since we're just checking the plaintext)
  const { plain } = serializeProto(root, undefined, { rng });
  console.log("plain[0..5]:", Array.from(plain.slice(0, 5)));
  
  // Also build the same with the actual protect to compare
  const r = protect({ source: src, tier: "off", seedHex });
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
  console.log("Artifact blob[0..5]:", bytes.slice(0, 5));
})();
