import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';
import { writeFileSync } from 'fs';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1
const r = protect({ source: c.code, tier: 'silent' });

// Get the encrypted blob from the pipeline output
// The protect function returns lua code, but we need to extract the blob
// For now, let's just check if the blob in the output matches what we expect

writeFileSync('/tmp/kilo/fuzz-arith1-full.lua', r.lua);
console.log('Written full obfuscated file');
