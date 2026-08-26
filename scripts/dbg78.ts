import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  console.log("Perm:", r.manifest.fingerprint.perm);
  // Check what logical 48 maps to
  for (let i = 0; i < r.manifest.fingerprint.perm.length; i++) {
    if (r.manifest.fingerprint.perm[i] === 48) {
      console.log("physical 48 = logical", i);
    }
  }
})();
