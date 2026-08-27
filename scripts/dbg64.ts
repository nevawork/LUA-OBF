import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // The artifact uses _G.PROTOS, etc. — it scopes to file chunk, so 'cl6MKaxm'
  // is a local to the do block, not visible globally.
  // Instead, let me check the blob LITERAL value in JS:
  const m = r.lua.match(/local (\w+)=("(?:[^"\\]|\\.)*")/);
  console.log("Blob var name:", m[1]);
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
  console.log("Bytes from JS parse:", bytes.slice(0, 10));
  
  // Now run the artifact and dump the BLOB via the runtime
  // Find line "D[i]=(sbyte(...)" and inject AFTER it
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l.includes("D[i]=(sbyte("));
  console.log("decode line at:", idx + 1);
  // Insert a dump of cl6MKaxm right after the decode loop
  // Find the matching "end" — line after decode
  const lines2 = r.lua.split("\n");
  const decodeLine = lines2.findIndex(l => l.includes("D[i]=(sbyte("));
  const decodeEnd = decodeLine + 2;
  // Insert AFTER the end, before the next code
  lines2.splice(decodeEnd, 0, `  do local _b=cl6MKaxm G._BF1=string.byte(_b,1) G._BF2=string.byte(_b,2) G._BF3=string.byte(_b,3) end`);
  // The cl6MKaxm is local to the do block. The do block ENDS at line 56 (which is "local function BMOLggiu22...")
  // Actually the do block extends to the matching "end". Let me find the outer do's end.
  // Hmm complex. Let me just dump D and BLOB via setmetatable / rawget
  
  // Actually simpler: just trust the JS parse
  const wrapped = lines2.join("\n");
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  // Need a global G table
  await lua.doString("G = {} _G.G = G");
  try {
    await lua.doString(wrapped);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
  // Use rawget to access _G even if there's no global
  await lua.doString("G._BF1_raw = _G.G and _G.G._BF1");
  console.log("BF1 from runtime:", lua.global.get("_BF1"));
  console.log("BF1 from raw:", lua.global.get("_BF1_raw"));
})();
