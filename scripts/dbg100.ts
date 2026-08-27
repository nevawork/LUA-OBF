import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
  } catch (e) {
    // e.message format: [string "..."]:LINE: MSG
    const msg = String(e.message);
    console.log("Full msg:", msg.split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
