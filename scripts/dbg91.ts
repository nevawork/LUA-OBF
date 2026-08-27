import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  // Replace the nc>65536 with verbose
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l.includes("if nc>65536 then error("));
  if (idx >= 0) {
    lines[idx] = `if nc>65536 then error("nc="..tostring(nc).." pos="..tostring(QvBwbzd7_l).." pid2="..tostring(SDqipcs3c5).." np="..tostring(ZkM0CLjs)) end`;
  }
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
