import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Prepend global
  const final = "GUARD_BAD=0\n" + r.lua;
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(final);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
    // Even after error, check global
    console.log("GUARD_BAD:", lua.global.get("GUARD_BAD"));
  } finally {
    lua.global.close();
  }
})();
