import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Inject a dump after the loop runs
  const m = r.lua.match(/( for SDqipcs3c5=1,ZkM0CLjs do)/);
  if (!m) { console.log("not found"); return; }
  // Inject after the loop body ends
  const wrap = m[1] + "\n  do POS = QvBwbzd7_l do error('OK') end end\n";
  const wrapped = r.lua.replace(m[1], wrap);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    if (String(e.message).includes("OK")) {
      console.log("Loop OK, position after loop:", lua.global.get("POS"));
      // Now also dump the protos
      await lua.doString("PROTOS_BEFORE = ''");
      // Don't actually need to print protos; we can inspect the post-loop pos
    } else {
      console.log("ERR:", String(e.message).split("\n")[0]);
    }
  } finally {
    lua.global.close();
  }
})();
