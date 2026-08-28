import { parse } from "../src/lang/parser";
import * as fs from "fs";

const files: Array<[string, "lua51" | "luau" | "roblox_executor"]> = [
  ["/tmp/kilo/gen_lua51.lua", "lua51"],
  ["/tmp/kilo/gen_luajit.lua", "lua51"],
  ["/tmp/kilo/gen_luau.lua", "luau"],
  ["/tmp/kilo/gen_roblox_executor.lua", "roblox_executor"],
];
for (const [f, ver] of files) {
  const code = fs.readFileSync(f, "utf8");
  try {
    parse(code, ver);
    console.log(`[PARSE ${ver}] ${f.split("/").pop()}: SYNTAX OK`);
  } catch (e) {
    console.log(`[PARSE ${ver}] ${f.split("/").pop()}: SYNTAX ERROR ->`, String(e).split("\n").slice(0, 5).join(" | "));
  }
}
