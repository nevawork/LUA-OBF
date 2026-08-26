import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  // Try the simplest case: no transforms
  // Actually we can't disable transforms easily; let's just print the artifact
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const lines = r.lua.split("\n");
  // Inject after line 60 (after framing byte check) to dump what came out
  // Actually let me dump ALL the blob's first 200 bytes via DUMP and skip the rest
  const inj = `
do return {stop="after_decode"} end
`;
  // Find the line after "end" of decode loop
  const wrapped = r.lua.replace(
    /(  D\[i\]=\(sbyte\([\w]+,i\)-pv\+256\)%256\)\n end\n)/,
    `$1
 do
  DUMP = {}
  for i=1,bn do DUMP[i]=D[i] end
  error("INJECTED-OK")
 end
`
  );
  console.log("Wrapped:", wrapped !== r.lua);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    console.log("ERR:", String(e.message).split(String.fromCharCode(10))[0]);
    await lua.doString("DSTR = table.concat(DUMP, ',')");
    const s = lua.global.get("DSTR") as string;
    const arr = s.split(",").map(Number);
    console.log("D[1..50]:", arr.slice(0, 50));
    console.log("D[1] high bit:", (arr[0] & 0x80) !== 0);
    console.log("D[1] & 0x7f =", arr[0] & 0x7f, "(expected 16-64)");
    console.log("D[2] =", arr[1], "(should be a uvarint for np, 1 for simple program)");
  } finally {
    lua.global.close();
  }
})();
