import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Find lines with D[i]=(sbyte...
  const m = r.lua.match(/( {2}D\[i\]=\(sbyte\([\w]+,i\)-pv\+256\)%256\n end)/);
  if (!m) { console.log("not found"); return; }
  const wrap = m[1] + "\n  do DUMP = {} for i=1,bn do DUMP[i]=D[i] end error('OK') end\n";
  const wrapped = r.lua.replace(m[1], wrap);
  console.log("Wrapped:", wrapped !== r.lua);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    const msg = String(e.message).split("\n")[0];
    console.log("ERR:", msg);
    if (msg.includes("OK")) {
      await lua.doString("DSTR = table.concat(DUMP, ',')");
      const s = lua.global.get("DSTR") as string;
      const arr = s.split(",").map(Number);
      console.log("D[1..30]:", arr.slice(0, 30));
      console.log("D[1] high bit:", (arr[0] & 0x80) !== 0);
      console.log("D[1] & 0x7f =", arr[0] & 0x7f, "(expected 16-64)");
      console.log("D[2] =", arr[1], "(should be a uvarint for np)");
    }
  } finally {
    lua.global.close();
  }
})();
