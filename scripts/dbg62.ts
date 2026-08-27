import { makeKeyStream, normSeed } from "../src/engine/crypto/cipher";

(async () => {
  const sa = 2114622308;
  const sb = 954047913;
  const ks = makeKeyStream(normSeed(sa), normSeed(sb));
  const k = ks(100);
  const idx = k.indexOf(248);
  console.log("First 248 at index:", idx);
  console.log("First 20 ks:", Array.from(k.slice(0, 20)));
})();
