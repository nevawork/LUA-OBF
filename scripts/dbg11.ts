import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  // Insert a dump right after the decode loop and before any other code
  // The decode loop is: for i=1,bn do ... D[i]=... end
  // Let's inject a print right after
  const dumpInject = `
DUMP={}
for i=1,bn do DUMP[i]=D[i] end
`;
  // Find a good place: right after the "end" of the decode loop
  const injected = r.lua.replace(/end\n local function xOceLLJe/, dumpInject + "\nlocal function xOceLLJe");
  console.log("Has injection:", injected !== r.lua);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(injected);
    await lua.doString("DSTR = table.concat(DUMP, ',')");
    const s = lua.global.get("DSTR") as string;
    const arr = s.split(",").map(Number);
    console.log("D[1..30]:", arr.slice(0, 30));
    console.log("D[1] in binary:", arr[0].toString(2), "(should have high bit set)");
    console.log("D[1] & 0x7f =", arr[0] & 0x7f, "(prologue length, 16..64)");
  } catch (e) {
    console.log("ERR:", String(e.message).split(String.fromCharCode(10))[0]);
  } finally {
    lua.global.close();
  }
})();
