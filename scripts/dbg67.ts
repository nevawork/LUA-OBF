import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";
import { decryptBlob, normSeed } from "../src/engine/vm/serializer";

(async () => {
  // Use simpler source to match the working case
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
})();
