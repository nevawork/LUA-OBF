import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Replace nc>65536 with a custom error
  const wrap = r.lua.replace(
    "if nc>65536 then error(",
    `if nc>65536 then local e = "nc="..tostring(nc).." pos="..tostring(QvBwbzd7_l).." pid2="..tostring(SDqipcs3c5).." np="..tostring(ZkM0CLjs) error(e ..`
  );
  // That's broken; simpler:
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l.includes("if nc>65536 then error("));
  if (idx < 0) { console.log("not found"); return; }
  lines[idx] = `if nc>65536 then error("nc="..tostring(nc).." pos="..tostring(QvBwbzd7_l).." pid2="..tostring(SDqipcs3c5).." np="..tostring(ZkM0CLjs)) end`;
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
