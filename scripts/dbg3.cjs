// debug: dump Lua-side decoded bytes to find divergence
const { protect } = require("../dist/pipeline.js");
const { decryptBlob } = require("../dist/vm/serializer.js");
const { LuaFactory } = require("wasmoon");
const fs = require("fs");

async function main() {
  const r = protect({ source: "local s='hi' return s", tier: "off", seed: "cd".repeat(32) });
  const man = r.manifest;
  // TS reference
  const litMatch = r.lua.match(/local (\w+)="([^\n]{50,})"/);
  const lit = litMatch[2];
  const bytes = [];
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === "\\") { bytes.push(parseInt(lit.substr(i + 1, 3), 10)); i += 4; }
    else { bytes.push(lit.charCodeAt(i)); i++; }
  }
  const plainTS = decryptBlob(Buffer.from(bytes), man.seeds);
  console.log("TS plain[0..15]:", Array.from(plainTS.subarray(0, 16)));

  // inject probe into Lua decode
  let code = r.lua.replace(
    /(\n end\n local function \w+\(\) local bt=D\[)/,
    "\n end\n print('LUA D[0..7]:', D[1],D[2],D[3],D[4],D[5],D[6],D[7],D[8], 'bn=', bn)\n local function __probe__() local bt=D["
  );
  fs.writeFileSync("/tmp/kilo/probe.lua", code);
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(code);
  } catch (e) {
    console.log("(expected failure continuing)", String(e).split("\n")[0]);
  }
}
main();
