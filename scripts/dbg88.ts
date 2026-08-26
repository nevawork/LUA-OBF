import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  // Simplest possible test
  const r = protect({ source: "return 42", tier: "off", seedHex: "11".repeat(32) });
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
    const got = lua.global.get("EXPECTED") ?? "no EXPECTED";
    console.log("GOT:", got);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
