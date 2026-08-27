import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Inject after the for loop body ends (right after the ${N.protos}[${N.pid2}]=pr line)
  const m = r.lua.match(/( {2}\$\{N\.protos\}\[\$\{N\.pid2\}\]=pr\n end)/);
  if (!m) { console.log("not found"); return; }
  const wrap = m[1] + "\n do error('AFTER_PROTOS pos='..QvBwbzd7_l) end\n";
  const wrapped = r.lua.replace(m[1], wrap);
  
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
