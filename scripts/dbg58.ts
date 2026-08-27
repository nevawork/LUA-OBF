import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  const m = r.lua.match(/local (\w+)=("(?:[^"\\]|\\.)*")/);
  const lit = m[2].slice(1, -1);
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
  lua.global.set("blob_test", String.fromCharCode(...bytes.slice(0, 30)));
  lua.global.set("sa_test", 2114622308);
  lua.global.set("sb_test", 954047913);
  await lua.doString("RES = cipher_run(blob_test, sa_test, sb_test)");
  for (let k = 1; k <= 5; k++) {
    lua.global.set("k", k);
    await lua.doString(`_G['r'..k] = RES[k]`);
  }
  console.log("Lua dec first 5:", lua.global.get("r1"), lua.global.get("r2"), lua.global.get("r3"), lua.global.get("r4"), lua.global.get("r5"));
})();
