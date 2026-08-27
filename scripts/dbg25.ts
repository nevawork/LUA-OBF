import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Inject at the nc>65536 check
  const wrap = r.lua.replace(
    "if nc>65536 then error(",
    "if nc>65536 then error('nc='..tostring(nc)..' pos='..tostring(QvBwbzd7_l)..' pid2='..tostring(SDqipcs3c5)..' np='..tostring(ZkM0CLjs))..error(",
  );
  console.log("wrapped:", wrap !== r.lua);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrap);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
