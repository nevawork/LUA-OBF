import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  // Find lines 50-60 to understand the structure
  const lines = r.lua.split("\n");
  for (let i = 45; i <= 60 && i < lines.length; i++) {
    console.log(`${i+1}: ${lines[i].slice(0, 100)}`);
  }
  console.log("---");
  // The decode loop is at line ~52. After it, do block ends.
  // Let me inject AFTER the decode loop end and BEFORE local function
  const decoded = r.lua.replace(/(  D\[i\]=\(sbyte\([\w]+,i\)-pv\+256\)%256\)\n end)/, "$1\n DUMP={}\n for i=1,bn do DUMP[i]=D[i] end");
  console.log("---");
  console.log("Has injection:", decoded !== r.lua);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(decoded);
    await lua.doString("DSTR = table.concat(DUMP, ',')");
    const s = lua.global.get("DSTR") as string;
    const arr = s.split(",").map(Number);
    console.log("D[1..30]:", arr.slice(0, 30));
    console.log("D[1] & 0x7f =", arr[0] & 0x7f, "(prologue length)");
    console.log("D len:", arr.length);
  } catch (e) {
    console.log("ERR:", String(e.message).split(String.fromCharCode(10))[0]);
  } finally {
    lua.global.close();
  }
})();
