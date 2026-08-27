import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Inject dump right after the decode loop (line 51-52)
  const lines = r.lua.split("\n");
  // Find the line "D[i]=(sbyte(...,i)-pv+256)%256"
  const idx = lines.findIndex(l => l.includes("D[i]=(sbyte("));
  console.log("decode line at:", idx + 1, lines[idx].slice(0, 80));
  // The decode loop ends with "end" 2 lines below
  // Insert the dump after that "end"
  const dumpAfter = idx + 2;
  console.log("end at:", dumpAfter + 1, lines[dumpAfter]);
  lines.splice(dumpAfter + 1, 0, "  do DUMP={} for i=1,bn do DUMP[i]=D[i] end error('OK') end");
  const wrapped = lines.join("\n");
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    if (String(e.message).includes("OK")) {
      await lua.doString("DSTR = table.concat(DUMP, ',')");
      const s = lua.global.get("DSTR") as string;
      const arr = s.split(",").map(Number);
      console.log("D[1..5]:", arr.slice(0, 5));
      console.log("D[1] high bit:", (arr[0] & 0x80) !== 0);
    } else {
      console.log("ERR:", String(e.message).split("\n")[0]);
    }
  } finally {
    lua.global.close();
  }
})();
