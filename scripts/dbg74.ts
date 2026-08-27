import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  for (let i = 135; i < 145; i++) {
    console.log(`${i+1}: ${lines[i].slice(0, 200)}`);
  }
})();
