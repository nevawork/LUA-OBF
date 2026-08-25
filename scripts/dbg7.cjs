// debug: exhaustive step trace of Lua decoder vs Node decoder
const { protect } = require("../dist/pipeline.js");
const { decryptBlob, deserializeBlob } = require("../dist/vm/serializer.js");
const { LuaFactory } = require("wasmoon");
const fs = require("fs");

async function main() {
  const src = fs.readFileSync("/tmp/kilo/smoke1.lua", "utf8");
  const r = protect({ source: src, tier: "silent", seed: "a".repeat(64), watermark: "license-1234" });
  fs.writeFileSync("/tmp/kilo/smoke1.out.lua", r.lua);
  fs.writeFileSync("/tmp/kilo/smoke1.manifest.json", JSON.stringify(r.manifest, null, 2));

  const litMatch = r.lua.match(/local (\w+)="([^\n]{50,})"/);
  const lit = litMatch[2];
  const bytes = [];
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === "\\") { bytes.push(parseInt(lit.substr(i + 1, 3), 10)); i += 4; }
    else { bytes.push(lit.charCodeAt(i)); i++; }
  }
  const plain = decryptBlob(Buffer.from(bytes), r.manifest.seeds);
  console.log("node decode:", (() => { try { return deserializeBlob(plain).flat.length + " protos"; } catch (e) { return "FAIL " + e.message; } })());

  // instrument: wrap u8 to log positions for first N calls
  let code = r.lua.replace(
    /(local function \w+\(\) local bt=D\[\w+\] \w+=\w+\+1 return bt end)/,
    "$1\n local __n=0\n local __u8=$1;\n"
  );
  // simpler approach: redefine Qnr8ruwiw1 (u8) after its definition with logging
  const u8name = (r.lua.match(/local function (\w+)\(\) local bt=D\[\w+\] \w+=\w+\+1 return bt end/) || [])[1];
  const posName = (r.lua.match(/local (\w+)=1\n local D=/) || [])[1];
  console.log("u8 fn:", u8NameSafe(u8name));
  if (!u8name || !posName) { console.log("instrumentation failed"); return; }

  code = r.lua.replace(
    new RegExp("(local D=\\{\\} local bn=#\\w+)"),
    `$1\n local TRACE={}`
  );
  code = code.replace(
    new RegExp(`local function ${u8name}\\(\\) local bt=D\\[${posName}\\] ${posName}=${posName}\\+1 return bt end`),
    `local function ${u8name}() local bt=D[${posName}] ${posName}=${posName}+1 TRACE[#TRACE+1]=${posName}..':'..bt return bt end`
  );

  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try { await lua.doString(code); console.log("clean"); } catch (e) { console.log("err:", String(e).split("\n")[0]); }
  const dump = await lua.doString('return table.concat(TRACE, "\\n")');
  const lines = (dump || "").split("\n").slice(0, 60);
  console.log("LUA u8 trace (first 60):");
  console.log(lines.join("\n"));
}
function u8NameSafe(x) { return x ? x.slice(0, 4) + "…" : String(x); }
main();
