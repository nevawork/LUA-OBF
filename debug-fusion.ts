import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1
console.log("Test code:", c.code);

// Enable debug
process.env.NEVAHEX_DEBUG = "1";
process.env.NEVAHEX_DEBUG_OPS = "1";

const r = protect({ source: c.code, tier: 'silent' });
console.log("Obfuscated length:", r.lua.length);
