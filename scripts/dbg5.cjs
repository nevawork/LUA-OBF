// debug: full D[] array comparison Lua vs Node
const { protect } = require("../dist/pipeline.js");
const { decryptBlob } = require("../dist/vm/serializer.js");
const { LuaFactory } = require("wasmoon");
const fs = require("fs");

async function main() {
  const src = fs.readFileSync("/tmp/kilo/smoke1.lua", "utf8");
  const r = protect({ source: src, tier: "silent", seed: "a".repeat(64), watermark: "license-1234" });

  const litMatch = r.lua.match(/local (\w+)="([^\n]{50,})"/);
  const lit = litMatch[2];
  const bytes = [];
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === "\\") { bytes.push(parseInt(lit.substr(i + 1, 3), 10)); i += 4; }
    else { bytes.push(lit.charCodeAt(i)); i++; }
  }
  const plain = decryptBlob(Buffer.from(bytes), r.manifest.seeds);

  // inject a probe that serializes D after the fill loop
  let code = r.lua.replace(
    " local function " + (r.lua.match(/local function (\w+)\(\) local bt=D\[/) || [])[1],
    " local __savedD = table.concat({table.unpack or unpack or function() end}, ',')"
  );
  // simpler: append global export right after the decode block by replacing its closing 'end'
  code = code.replace(/( for i=1,bn do\n[^\n]*\n[^\n]*\n[^\n]*\n end)/,
    "$1\n G_D = D; G_BN = bn");
  fs.writeFileSync("/tmp/kilo/probe2.lua", code);

  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(code);
    console.log("script ran clean");
  } catch (e) {
    console.log("lua err:", String(e).split("\n")[0]);
  }
  const GD = lua.global.getTable("G_D");
  if (GD) {
    const arr = Array.from(GD);
    let mismatches = [];
    for (let k = 0; k < arr.length && k < plain.length; k++) {
      if ((arr[k] | 0) !== plain[k]) mismatches.push(k + 1);
    }
    console.log("lua D len:", arr.length, "node plain len:", plain.length);
    console.log("first mismatches:", mismatches.slice(0, 12));
    console.log("sample @mismatch:", mismatches[0] ? { idx: mismatches[0], lua: arr[mismatches[0] - 1], node: plain[mismatches[0] - 1] } : "none");
  } else {
    console.log("G_D not set");
  }
}
main();
