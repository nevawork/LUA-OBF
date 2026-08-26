import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const m = r.lua.match(/( {2}D\[i\]=\(sbyte\([\w]+,i\)-pv\+256\)%256\n end)/);
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
      console.log("D[1..70]:", arr.slice(0, 70));
      // After framing (1+58=59), np at 60
      // np = arr[59] (0-indexed)
      // pn at 60, va at 61, nu uvarint at 62, then ns uvarint, then nc uvarint
      let pos = 59; // 0-indexed, so D[60] is at index 59
      const np = arr[pos]; pos++;
      console.log("np =", np, "next pos:", pos+1);
      const pn = arr[pos]; pos++;
      console.log("pn =", pn, "next pos:", pos+1);
      const va = arr[pos]; pos++;
      console.log("va =", va, "next pos:", pos+1);
      // nu is a uvarint
      let nu = 0; let sh = 0;
      while (true) {
        const bt = arr[pos];
        nu = nu + (bt % 128) * Math.pow(2, sh);
        pos++;
        if (bt < 128) break;
        sh += 7;
      }
      console.log("nu =", nu, "next pos:", pos+1);
      // ns is a uvarint
      let ns = 0; sh = 0;
      while (true) {
        const bt = arr[pos];
        ns = ns + (bt % 128) * Math.pow(2, sh);
        pos++;
        if (bt < 128) break;
        sh += 7;
      }
      console.log("ns =", ns, "next pos:", pos+1);
      // nc is a uvarint — show bytes
      console.log("nc uvarint bytes:", arr.slice(pos, pos+5));
    } else {
      console.log("ERR:", String(e.message).split("\n")[0]);
    }
  } finally {
    lua.global.close();
  }
})();
