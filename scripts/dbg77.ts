import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Replace the op assignment with a dump
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l === "  op=(((FlsYEbBDFr_[Pqne8JyF]-gLtjPD)+65536)%65536)");
  console.log("op line at:", idx + 1);
  // Insert BEFORE op line: dump the opE and rk
  lines[idx] = `  _G.LAST_OPE=FlsYEbBDFr_[Pqne8JyF] _G.LAST_RK=gLtjPD _G.LAST_INS=FlsYEbBDFr_\n  op=(((FlsYEbBDFr_[Pqne8JyF]-gLtjPD)+65536)%65536)`;
  // Also dump the dispatch
  const wrapped = lines.join("\n");
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  // Counter
  await lua.doString("OPCOUNT = 0");
  try {
    await lua.doString(wrapped);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
  console.log("LAST_OPE:", lua.global.get("LAST_OPE"));
  console.log("LAST_RK:", lua.global.get("LAST_RK"));
  console.log("LAST_INS:", lua.global.get("LAST_INS"));
})();
