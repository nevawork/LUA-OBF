import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1

const r1 = protect({ source: c.code, tier: 'silent', seedHex: 'aa'.repeat(32) });
const r2 = protect({ source: c.code, tier: 'silent', seedHex: 'aa'.repeat(32) });

console.log('Run 1 Lua length:', r1.lua.length);
console.log('Run 2 Lua length:', r2.lua.length);
console.log('Same Lua:', r1.lua === r2.lua);

const match1 = r1.lua.match(/local ([a-zA-Z_][a-zA-Z0-9_]*)=("(?:[^"\\]|\\.)*")/);
const match2 = r2.lua.match(/local ([a-zA-Z_][a-zA-Z0-9_]*)=("(?:[^"\\]|\\.)*")/);

if (match1 && match2) {
  console.log('Run 1 blob length:', match1[2].length);
  console.log('Run 2 blob length:', match2[2].length);
  console.log('Same blob:', match1[2] === match2[2]);
}
