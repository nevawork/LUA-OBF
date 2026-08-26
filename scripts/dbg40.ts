import { protect } from "../src/pipeline";
// Disable the check
const orig = require("../src/testing/dispatch-check");
orig.verifyGeneratedDispatch = () => ({ ok: true, problems: [] });

(async () => {
  try {
    const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
    const lines = r.lua.split("\n");
    // Find chain entries
    let count = 0;
    for (let i = 130; i < lines.length && count < 40; i++) {
      if (/^ {2}if .*==/.test(lines[i])) {
        console.log(`${i+1}: ${lines[i].slice(0, 120)}`);
        count++;
      }
    }
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
})();
