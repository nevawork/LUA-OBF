import { protect } from "../src/pipeline";
import { decryptBlob, normSeed, makeKeyStream } from "../src/engine/vm/serializer";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  const m = r.lua.match(/local (\w+)=("(?:[^"\\]|\\.)*")/);
  const lit = m[2].slice(1, -1);
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
  // Use the same sa, sb as artifact
  const sa = 2114622308;
  const sb = 954047913;
  const ks = makeKeyStream(normSeed(sa), normSeed(sb));
  const k = ks(5);
  console.log("JS ks first 5:", Array.from(k));
  
  // Decrypt
  const dec = decryptBlob(Buffer.from(bytes), [normSeed(sa), normSeed(sb), 1, 1]);
  console.log("JS dec first 5:", Array.from(dec.slice(0, 5)));
})();
