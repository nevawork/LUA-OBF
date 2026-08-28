import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';
import { writeFileSync } from 'fs';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1

const r = protect({ source: c.code, tier: 'silent' });
writeFileSync('/tmp/kilo/fuzz-arith1-debug.lua', r.lua);
console.log('Written debug Lua, length:', r.lua.length);
