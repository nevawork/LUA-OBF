// e2e runner: executes a Lua file in wasmoon (Lua 5.4 WASM)
const { LuaFactory } = require("wasmoon");
const fs = require("fs");

async function main() {
  const file = process.argv[2];
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(fs.readFileSync(file, "utf8"));
    const r = lua.global.getTable("RESULTS");
    console.log("RESULTS:", JSON.stringify(r));
    if (process.argv[3]) {
      const extra = lua.global.getTable(process.argv[3]);
      console.log(`${process.argv[3]}:`, JSON.stringify(extra));
    }
  } catch (e) {
    console.error("LUA ERROR:", String(e && e.message ? e.message : e).split("\n").slice(0, 8).join("\n"));
    process.exitCode = 1;
  } finally {
    lua.global.close();
  }
}
main();
