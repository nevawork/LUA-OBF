import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const m = r.lua.match(/( {2}D\[i\]=\(sbyte\([\w]+,i\)-pv\+256\)%256\n end)/);
  if (!m) { console.log("not found"); return; }
  const wrap = m[1] + "\n  do DUMP = {} for i=1,bn do DUMP[i]=D[i] end error('OK') end\n";
  const wrapped = r.lua.replace(m[1], wrap);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    if (String(e.message).includes("OK")) {
      await lua.doString("DSTR = table.concat(DUMP, ',')");
      const s = lua.global.get("DSTR") as string;
      const arr = s.split(",").map(Number);
      console.log("D[1] =", arr[0], "(framing byte, must have bit7 set)");
      console.log("D[1] & 0x7f =", arr[0] & 0x7f, "(prologueLen)");
      const prologueLen = arr[0] & 0x7f;
      const npByte = arr[1 + prologueLen];
      console.log("D[" + (1 + prologueLen) + "] (np uvarint):", npByte);
      // Then first proto starts at 1 + prologueLen + varint_size(np)
      const npVarintSize = npByte >= 128 ? 2 : 1; // assume 1 for now
      const firstPidByte = arr[1 + prologueLen + npVarintSize];
      console.log("D[" + (1 + prologueLen + npVarintSize) + "] (first proto pn):", firstPidByte);
    } else {
      console.log("ERR:", String(e.message).split("\n")[0]);
    }
  } finally {
    lua.global.close();
  }
})();
