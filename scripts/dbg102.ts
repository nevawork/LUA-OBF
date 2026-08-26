import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1", tier: "off", seedHex: "11".repeat(32) });
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
    console.log("OK");
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
