import { makeKeyStream, normSeed } from "../src/engine/crypto/cipher";

(async () => {
  const sa = 2114622308;
  const sb = 954047913;
  const ks = makeKeyStream(normSeed(sa), normSeed(sb));
  const k = ks(10);
  console.log("JS ks first 10:", Array.from(k));
})();
