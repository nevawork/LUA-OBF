// debug: compare blob byte length Node vs Lua
const { protect } = require("../dist/pipeline.js");
const { LuaFactory } = require("wasmoon");
const fs = require("fs");

function unescapeLit(lit) {
  let out = 0;
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === "\\") {
      out++;
      i += 4;
    } else {
      out++;
      i++;
    }
  }
  return out;
}

async function main() {
  const r = protect({ source: "return 42", tier: "off", seed: "ab".repeat(32) });
  const m = r.lua.match(/local (\w+)="([^\n]{100,})"/);
  const varName = m[1];
  console.log("node blob bytes:", r.stats.blobBytes);
  console.log("literal escaped chars:", m[2].length, "-> approx bytes:", unescapeLit(m[2]));

  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  await lua.doString(r.lua.replace(/^/, ""));
  // can't easily read the local; re-run with a probe appended before decode:
  fs.writeFileSync("/tmp/kilo/probe.lua", r.lua);
  await lua.global.close();
}
main();
