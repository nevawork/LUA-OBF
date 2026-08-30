import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1

process.env.NEVAHEX_DEBUG = "1";
process.env.NEVAHEX_DEBUG_OPS = "1";

const r = protect({ source: c.code, tier: 'silent' });

// Extract the VM function and run with full tracing
const luaCode = r.lua;

// Modify to trace all instructions
const modified = luaCode.replace(
  'if sE3XEr4<20 then',
  'if true then'
);

const fs = require('fs');
fs.writeFileSync('/tmp/kilo/debug-all.lua', modified);

console.log("Running with full trace...");
const { spawnSync } = require('child_process');
const result = spawnSync('lua5.1', ['/tmp/kilo/debug-all.lua'], { timeout: 10000, encoding: 'utf8', maxBuffer: 1024*1024*10 });
console.log("stdout:", result.stdout);
console.log("stderr:", result.stderr);
console.log("exit code:", result.status);
