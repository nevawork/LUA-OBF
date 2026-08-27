import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  for (const src of ["return 1", "return 1+1", "return 2+3", "return 42"]) {
    const r = protect({ source: src, tier: "off", seedHex: "11".repeat(32) });
    const factory = new LuaFactory();
    const lua = await factory.createEngine();
    try {
      await lua.doString(r.lua);
      console.log(`OK: ${src}`);
    } catch (e) {
      console.log(`FAIL: ${src} -> ${String(e.message).split("\n")[0]}`);
    } finally {
      lua.global.close();
    }
  }
})();
