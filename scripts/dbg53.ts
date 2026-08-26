import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Find end of guard and inject sa dump
  const lines = r.lua.split("\n");
  const idx = lines.findIndex(l => l === " end" || l === "  end");
  // The first "end" after the guard code
  const guardEnd = lines.findIndex((l, i) => i > 25 && l === "end" && lines[i+1]?.includes("local sbyte"));
  console.log("guardEnd at:", guardEnd + 1);
  if (guardEnd >= 0) {
    lines.splice(guardEnd + 1, 0, " SA_AFTER_GUARD=sa SB_AFTER_GUARD=sb");
  }
  // Also add D dump at decode end
  const decodeLine = lines.findIndex(l => l.includes("D[i]=(sbyte("));
  const decodeEnd = decodeLine + 2;
  lines.splice(decodeEnd, 0, " DUMP={} for i=1,bn do DUMP[i]=D[i] end");
  const wrapped = lines.join("\n");
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
    await lua.doString("DSTR = table.concat(DUMP, ',')");
    const arr = (lua.global.get("DSTR") as string).split(",").map(Number);
    console.log("D[1..5]:", arr.slice(0, 5));
    console.log("D[1] high bit:", (arr[0] & 0x80) !== 0);
    console.log("sa after guard:", lua.global.get("SA_AFTER_GUARD"));
    console.log("sb after guard:", lua.global.get("SB_AFTER_GUARD"));
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
