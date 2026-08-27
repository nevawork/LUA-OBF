import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Find the sa/sb declaration
  const saM = r.lua.match(/local sa=\(([^)]+)\) sb/);
  const sbM = r.lua.match(/sb=\(([^)]+)\) MM=/);
  console.log("sa:", saM && saM[1]);
  console.log("sb:", sbM && sbM[1]);
  
  // First 10 bytes of blob
  const m = r.lua.match(/local (\w+)=("(?:[^"\\]|\\.)*")/);
  if (!m) return;
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
  console.log("First 10 bytes:", bytes.slice(0, 10));
  
  // The expected first byte is 0x80|prologueLen where prologueLen=16..64
  // So first byte should be 0x90..0xBF
  // But error says it's <128. So the cipher is producing wrong values.
})();
