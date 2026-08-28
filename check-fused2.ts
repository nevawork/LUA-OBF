import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1

// We need to instrument the pipeline to count fused specs
// Since we can't easily modify the pipeline, let's check the emitted Lua more carefully

const r = protect({ source: c.code, tier: 'silent' });

// Count all opcodes mentioned in the dispatch chain
const allOpRefs = r.lua.match(/op==(\d+)/g) || [];
console.log('Total opcode references:', allOpRefs.length);

// Count unique opcodes
const uniqueOpcodes = new Set(allOpRefs.map(m => parseInt(m.match(/\d+/)[0])));
console.log('Unique opcodes:', uniqueOpcodes.size);

// Check for fused opcodes (>= 1000)
const fusedOpcodes = [...uniqueOpcodes].filter(op => op >= 1000);
console.log('Fused opcodes:', fusedOpcodes.length);
console.log('Fused opcode values:', fusedOpcodes);

// Check the source code for the input
console.log('Source code length:', c.code.length);
