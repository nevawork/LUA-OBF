import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1

process.env.NEVAHEX_DEBUG = "1";
process.env.NEVAHEX_DEBUG_OPS = "1";

const r = protect({ source: c.code, tier: 'silent' });
console.log("Lua length:", r.lua.length);

// Extract all instruction fetches from the Lua
const lines = r.lua.split('\n');
for (const line of lines) {
  if (line.includes('PC=') && line.includes('phys=')) {
    console.log(line.trim());
  }
}
