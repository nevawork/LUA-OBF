// debug: full D[] array comparison — Lua dumps CSV, Node compares
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

  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
    console.log("script ran clean");
  } catch (e) {
    console.log("lua err:", String(e).split("\n")[0]);
  }
  const csv = await lua.doString(
    'local t={} for i=1,GD and #GD or 0 do t[i]=GD[i] end return table.concat(t, ",")'
  );
  if (!csv) {
    console.log("no GD (debug build required)");
    return;
  }
  const arr = csv.split(",").map(Number);
  let mismatches = [];
  for (let k = 0; k < arr.length; k++) {
    if ((arr[k] | 0) !== (plain[k] | 0)) mismatches.push(k + 1);
  }
  console.log("lua len:", arr.length, "node len:", plain.length);
  console.log("mismatch count:", mismatches.length, "first:", mismatches.slice(0, 10));
}
main();
