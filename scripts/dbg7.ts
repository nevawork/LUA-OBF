import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";

(async () => {
  const r = protect({ source: "return 1+1", tier: "off", seedHex: "11".repeat(32) });
  const m = r.lua.match(/local \w+="((?:[^"\\]|\\.)*)"/);
  if (!m) return;
  const lit = m[1];
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
  lua.global.set("blob_test", String.fromCharCode(...bytes));
  lua.global.set("sa_test", 733567036);
  lua.global.set("sb_test", 1704268465);
  await lua.doString("RES = cipher_run(blob_test, sa_test, sb_test)");
  // Get 5 integers via global var assignments
  for (let k = 0; k < 10; k++) {
    lua.global.set(`k${k}`, k + 1);
  }
  await lua.doString("for k=1,10 do _G['r'..k] = RES[k] end");
  for (let k = 1; k <= 10; k++) {
    const v = lua.global.get(`r${k}`);
    console.log(`RES[${k}]:`, v);
  }
})();
