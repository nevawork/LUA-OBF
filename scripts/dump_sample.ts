import { protect } from "../src/pipeline";
import * as fs from "fs";

const r = protect({ source: "return 1+1", tier: "silent", seedHex: "aa".repeat(32) });
fs.writeFileSync("/workspace/18efcb22-51a3-4d12-b136-27ba2f47792c/sessions/agent_20ceebac-168c-4d05-a07d-85432d910ae3/sample.lua", r.lua);
console.log("lines:", r.lua.split("\n").length, "bytes:", r.lua.length);
console.log("--- line 1 (banner) ---");
console.log(r.lua.split("\n")[0]);
console.log("--- line 2 (blank) ---");
console.log("(blank)");
console.log("--- line 3 (IIFE), first 400 chars ---");
console.log(r.lua.split("\n")[2].slice(0, 400));
console.log("...");
console.log("--- line 3, last 400 chars ---");
console.log(r.lua.split("\n")[2].slice(-400));
