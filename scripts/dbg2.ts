import { LuaFactory } from "wasmoon";
import { serializeProto, encryptBlob, decryptBlob, normSeed, makeKeyStream, M31 } from "../src/engine/vm/serializer";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";

(async () => {
  // Mirror what the pipeline does
  const sa = 733567036;
  const sb = 1704268465;
  const enc = encryptBlob(serializeProto(compileChunk(parse("return 1+1"))).plain, [normSeed(sa), normSeed(sb), 1, 1]);
  const dec = decryptBlob(enc, [normSeed(sa), normSeed(sb), 1, 1]);
  console.log("enc[0..5]:", Array.from(enc.slice(0, 5)));
  console.log("dec[0..5]:", Array.from(dec.slice(0, 5)));
  console.log("dec[0] high bit:", (dec[0] & 0x80) !== 0);
  
  // Now run the LUA cipher loop
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  const LUA_CIPHER = `
function cipher_run(blob_str, sa, sb)
  local MM = 2147483647
  local sbyte = string.byte
  local D = {}
  local bn = #blob_str
  local sc = (sa*31+sb)%MM
  local sd = (sb*17+sa)%MM
  local pv = 0
  for i=1,bn do
    sa = (sa*48271)%MM
    sb = (sb*69621)%MM
    sc = (sc*2994349)%MM
    sd = (sd*4050403)%MM
    sb = (sb+pv)%MM
    sc = (sc+sa)%MM
    pv = (math.floor(sa/65536)*31 + math.floor(sb/2048)*17 + math.floor(sc/1024)*7 + math.floor(sd/256)*3 + pv) % 256
    D[i] = (sbyte(blob_str,i) - pv + 256) % 256
  end
  return D
end
`;
  await lua.doString(LUA_CIPHER);
  // The blob is in the artifact; let me just test the cipher logic
  lua.global.set("blob_test", "hello");
  lua.global.set("sa_test", sa);
  lua.global.set("sb_test", sb);
  await lua.doString("local R = cipher_run(blob_test, sa_test, sb_test)");
  const r = lua.global.getTable("R");
  console.log("LUA cipher h-e-l-l-o:", Array.from({length: 5}, (_, i) => r[i+1]));
  // Compare to JS makeKeyStream
  const ks = makeKeyStream(normSeed(sa), normSeed(sb));
  const k = ks(5);
  console.log("JS ks h-e-l-l-o:", Array.from(k));
})();
