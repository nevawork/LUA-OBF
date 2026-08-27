import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  // Find the blob literal: "local <name>=\"<bytes>\""
  const m = r.lua.match(/local \w+="((?:[^"\\]|\\.)*)"/);
  if (!m) { console.log("no match"); return; }
  const lit = m[1];
  // Convert to bytes
  const bytes: number[] = [];
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === '\\') {
      let d = '';
      i++;
      while (d.length < 3 && i < lit.length && /[0-9]/.test(lit[i])) { d += lit[i]; i++; }
      bytes.push(parseInt(d, 10) & 0xff);
    } else {
      bytes.push(lit.charCodeAt(i) & 0xff);
      i++;
    }
  }
  console.log("first 10 artifact bytes:", bytes.slice(0, 10));
  console.log("decoded first 5 by Lua:");
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  await lua.doString(`
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
`);
  // Replicate the artifact's seed: (733567036+32-32) and (1704268465-0)
  // Find the seed values
  const saMatch = r.lua.match(/local sa=\(([^)]+)\)/);
  const sbMatch = r.lua.match(/sb=\(([^)]+)\)/);
  console.log("sa expr:", saMatch && saMatch[1]);
  console.log("sb expr:", sbMatch && sbMatch[1]);
  // Direct numeric values
  const saVal = 733567036;
  const sbVal = 1704268465;
  lua.global.set("blob_test", String.fromCharCode(...bytes.slice(0, 30)));
  lua.global.set("sa_test", saVal);
  lua.global.set("sb_test", sbVal);
  await lua.doString("RES = cipher_run(blob_test, sa_test, sb_test)");
  // Get result
  const res = lua.global.get("RES");
  console.log("Lua RES[0..5]:", res);
})();
