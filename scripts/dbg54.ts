import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Find the line with "for j=sl.p" — that's the start of the guard
  const lines = r.lua.split("\n");
  // The guard is `do ... end` between line 35 and 47
  // We want to add a check: if any hh~=sl.h, set SA_SHIFTED=1
  // Find line 41 (if hh~=sl.h then)
  const ifLine = lines.findIndex((l, i) => i > 30 && l.includes("if hh~=sl.h then"));
  console.log("if hh~=sl.h at line:", ifLine + 1);
  // Insert a flag after the if-block
  // The guard's if block:
  //   if hh~=sl.h then
  //    sa=...
  //    sb=...
  //    gLtjPD=1
  //   end
  // We can set a global at the END of the guard
  // Find the matching end (need to track nesting)
  let depth = 0;
  let guardEnd = -1;
  for (let i = ifLine; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes(" if ")) depth++;
    if (l.trim() === "end" || l.trim() === "end)") depth--;
    if (depth === 0 && l.trim() === "end") { guardEnd = i; break; }
  }
  console.log("guard inner end at:", guardEnd + 1);
  
  // Add flag set inside the if
  lines[ifLine] = "  if hh~=sl.h then GUARD_HIT=1";
  // Add the original logic right after
  lines.splice(ifLine + 1, 0, ...lines.slice(ifLine + 1, ifLine + 4).map(l => "   " + l));
  // Add GUARD_HIT at the outer end
  lines[guardEnd] = "  end GUARD_SA=sa GUARD_SB=sb";
  // Now for the for loop's end:
  // The for loop is at line 37, for _bs=1,#BS do
  // It ends with "end" at line 46
  // Let me find it
  for (let i = ifLine; i < lines.length; i++) {
    if (lines[i].trim() === "end" && i > guardEnd) {
      lines[i] = "  end AFTER_FOR_SA=sa AFTER_FOR_SB=sb";
      break;
    }
  }
  
  const wrapped = lines.join("\n");
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
    console.log("GUARD_HIT:", lua.global.get("GUARD_HIT"));
    console.log("GUARD_SA:", lua.global.get("GUARD_SA"));
    console.log("GUARD_SB:", lua.global.get("GUARD_SB"));
    console.log("AFTER_FOR_SA:", lua.global.get("AFTER_FOR_SA"));
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  } finally {
    lua.global.close();
  }
})();
