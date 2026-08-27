import { protect } from "../src/pipeline";

(async () => {
  // Patch the check to be permissive
  const mod = require("../src/testing/dispatch-check");
  const orig = mod.verifyGeneratedDispatch;
  mod.verifyGeneratedDispatch = (lua: string, perm: number[], used: any, opts?: any) => {
    const r = orig(lua, perm, used, opts);
    if (!r.ok) {
      console.log("CHECK PROBLEMS:");
      r.problems.forEach((p: string) => console.log("  -", p));
      console.log("---");
      // Print chain excerpt
      const lines = lua.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (/if .*==/.test(lines[i]) && / *then *$/.test(lines[i].trim())) {
          console.log(`${i+1}: ${lines[i].slice(0, 120)}`);
        }
        if (i > 250) break;
      }
    }
    return r;
  };
  
  try {
    protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
})();
