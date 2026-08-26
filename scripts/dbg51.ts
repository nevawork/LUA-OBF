import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Find the decode loop
  const m = r.lua.match(/( for i=1,bn do\n {2} sa=.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*D\[i\])/s);
  if (!m) { console.log("not found"); return; }
  // Inject dump AFTER the decode loop
  const wrapped = r.lua.replace(m[1], m[1] + "\n  do DUMP={} for i=1,bn do DUMP[i]=D[i] end error('OK') end");
  
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
