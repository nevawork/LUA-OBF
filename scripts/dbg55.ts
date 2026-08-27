import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Simpler: replace the "if hh~=sl.h then" with a trace
  const wrapped = r.lua.replace(
    "if hh~=sl.h then",
    "if hh~=sl.h then GUARD_BAD=GUARD_BAD and GUARD_BAD or hh"
  );
  // Also add a global var init at the start
  const final = "GUARD_BAD=0\n" + wrapped;
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(final);
    console.log("GUARD_BAD:", lua.global.get("GUARD_BAD"));
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
