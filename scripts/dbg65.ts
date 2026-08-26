import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";
import { decryptBlob, normSeed } from "../src/engine/vm/serializer";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Run only the blob part of the artifact (everything up to the function definitions)
  // Find the line with "local function ${N.run}"
  const lines = r.lua.split("\n");
  // Find the second "local function" (the run() function)
  // The first local function is the cv accessor
  // The second is the run() function
  const fnIdx = lines.findIndex((l, i) => i > 50 && l.startsWith("local function") && l.includes("("));
  console.log("run() at line:", fnIdx + 1, lines[fnIdx]);
  
  // Take everything up to and including the wln read (the watermark tail)
  // Find line "local wln="
  const wlnIdx = lines.findIndex(l => l.includes("local wln="));
  console.log("wln at line:", wlnIdx + 1);
  
  // Take everything up to the line after the watermark tail loop
  // Find "end" right after the wln loop
  let wmEndIdx = wlnIdx;
  for (let i = wlnIdx; i < lines.length; i++) {
    if (lines[i] === " end") { wmEndIdx = i; break; }
  }
  console.log("wm end at line:", wmEndIdx + 1);
  
  // Now build a stripped artifact that only does the L1 part
  // Replace the run() with nothing
  const stripped = lines.slice(0, wmEndIdx + 1).join("\n");
  // Add dump at the end
  const final = stripped + `\nDUMP = {} for i=1,bn do DUMP[i]=D[i] end\n_G.SA_FINAL=sa _G.SB_FINAL=sb`;
  
  // Need to ensure these vars are global-accessible (they're local to the do block)
  // Let me also save them as globals inside the do block
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(final);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
  
  await lua.doString("if DUMP then DSTR = table.concat(DUMP, ',') _G.DSTR = DSTR end");
  const dstr = lua.global.get("DSTR") as string;
  if (dstr) {
    const arr = dstr.split(",").map(Number);
    console.log("D[1..10]:", arr.slice(0, 10));
  }
  
  // Get sa/sb via rawget since they may be in a do block
  // Let me re-run with different approach
})();
