import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1

// We need to access the fused specs from the pipeline
// Since protect doesn't return them, let's check the emitted Lua for fused opcodes
const r = protect({ source: c.code, tier: 'silent' });

// Count handlers in the dispatch chain
const handlerMatches = r.lua.match(/if op==(\d+) then/g);
console.log('Number of handlers:', handlerMatches ? handlerMatches.length : 0);

// Find the highest opcode in handlers
const opcodes = r.lua.match(/op==(\d+)/g);
if (opcodes) {
  const values = opcodes.map(m => parseInt(m.match(/\d+/)[0]));
  console.log('Max opcode:', Math.max(...values));
  console.log('Min opcode:', Math.min(...values));
  
  // Check if 21904 is in the handlers
  const has21904 = values.includes(21904);
  console.log('Has handler for 21904:', has21904);
}
