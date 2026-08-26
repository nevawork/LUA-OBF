import { protect } from "../src/pipeline";
import { verifyGeneratedDispatch } from "../src/testing/dispatch-check";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Now manually call the check
  const { flat } = await import("../src/engine/vm/serializer.js").then(m => {
    const decrypt = m.decryptBlob(Buffer.from([]), [1,1,1,1]);
    return { flat: [] };
  });
  console.log("OK build");
})();
