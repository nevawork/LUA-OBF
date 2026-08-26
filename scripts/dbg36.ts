import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  // Replace the op<= with a value dump
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l.includes("if op<=16 then"));
  if (idx < 0) { console.log("not found"); return; }
  lines[idx] = `error("op="..tostring(op).." ins="..tostring(ins).." pc="..tostring(pc-1).." K1="..tostring(P0.k[1]))`;
  // Also dump k[1]
  const wrapped = lines.join("\n");
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
