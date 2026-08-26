import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  // Trace what nc ends up being
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l.includes("if nc>"));
  if (idx >= 0) {
    lines[idx] = `if nc>65536 then error("nc="..tostring(nc).." pos="..tostring(QvBwbzd7_l).." pid2="..tostring(SDqipcs3c5)) end`;
  }
  // Also replace the wln>0
  const wIdx = lines.findIndex(l => l.includes("local wln="));
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
