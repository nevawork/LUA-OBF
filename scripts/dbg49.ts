import { protect } from "../src/pipeline";
import { planBlobSlices, rangeHash } from "../src/protection/antitamper";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // The artifact should have the same blob slices as the encryption
  // The planBlobSlices is called inside protect. We can't easily re-run it.
  // Instead, let me check the encrypted blob bytes vs the planBlobSlices output.
  
  // Get the blob bytes from artifact
  const m = r.lua.match(/local (\w+)=("(?:[^"\\]|\\.)*")/);
  if (!m) return;
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
  const blob = Buffer.from(bytes);
  console.log("blob length:", blob.length);
  
  // Compute planBlobSlices
  const slices = planBlobSlices(blob);
  console.log("slices count:", slices.length);
  console.log("first slice:", slices[0]);
  
  // Check the artifact's BS table
  const bsMatch = r.lua.match(/local BS=\{(\{[^{}]+\}(?:,\{[^{}]+\})*)\}/);
  if (bsMatch) {
    console.log("ARTIFACT BS table excerpt:", bsMatch[1].slice(0, 200));
  }
})();
