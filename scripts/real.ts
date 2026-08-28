import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import * as fs from "fs";

const source = fs.readFileSync("fixtures/smoke.lua", "utf8");

// Default CLI-equivalent: all transforms ON, tier silent
async function main() {
  const opts: any = {
    source,
    tier: "silent",
    envProfile: "universal",
    antiEmulation: false, // non-luau default true; but to match sample.lua might be false
    flatten: true, mbaPlus: true, superops: true, megaSuperops: false,
    mmTraps: true, keyless: true, regObfuscate: true, constShuffle: true,
    dynLoad: false, layered: false, luauVm: false, luraph: false,
    antiLuahunt: false, pathExplosion: false, selfModifying: false,
    luauAntiDeobfuscation: false, luauOptimize: false, emitSecrets: false,
  };
  for (const ep of ["universal", "luau", "roblox_executor"] as const) {
    try {
      const res = protect({ ...opts, envProfile: ep, luauVm: ep !== "universal" });
      fs.writeFileSync(`/tmp/kilo/real_${ep}.lua`, res.lua);
      try {
        parse(res.lua, ep === "universal" ? "lua51" : ep);
        console.log(`[PARSE OK] ${ep} (len ${res.lua.length})`);
      } catch (e) {
        console.log(`[PARSE FAIL] ${ep}:`, String(e).split("\n").slice(0, 4).join(" | "));
      }
    } catch (e) {
      console.log(`[GEN FAIL] ${ep}:`, String(e).split("\n").slice(0, 5).join("\n"));
    }
  }
}
main();
