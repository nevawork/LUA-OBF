import { serializeProto, encryptBlob, decryptBlob, normSeed, makeKeyStream } from "../src/engine/vm/serializer";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { protect } from "../src/pipeline";

(async () => {
  // What does the pipeline do?
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  
  // The sa/sb embedded in the artifact are the BAKE-DOWN (env-keyed) seeds
  // For universal profile, they're the effective seeds.
  // Get them by inspecting the artifact
  const saM = r.lua.match(/local sa=\(([^)]+)\)/);
  const sbM = r.lua.match(/sb=\(([^)]+)\)/);
  console.log("sa expr:", saM && saM[1]);
  console.log("sb expr:", sbM && sbM[1]);
  // Resolve: 733567036+32-32 = 733567036, 1704268465-0 = 1704268465
  
  // Now use the JS to compute the keystream starting from those seeds
  // (same as Lua), and compare the artifact's first 5 encrypted bytes
  // to the JS-encrypted first 5 of the plaintext.
  const ks = makeKeyStream(normSeed(733567036), normSeed(1704268465));
  const k = ks(10);
  console.log("JS ks 10:", Array.from(k));
  
  // Get the artifact's blob first 10 bytes
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
  console.log("Artifact blob 10:", bytes.slice(0, 10));
  
  // Encrypt the same plaintext with same keys
  const root = compileChunk(parse("return 1+1"));
  const { plain } = serializeProto(root);
  const enc = encryptBlob(plain, [normSeed(733567036), normSeed(1704268465), normSeed(1), normSeed(1)]);
  console.log("JS-encrypted first 10:", Array.from(enc.slice(0, 10)));
  console.log("MATCH:", JSON.stringify(bytes.slice(0, 10)) === JSON.stringify(Array.from(enc.slice(0, 10))));
})();
