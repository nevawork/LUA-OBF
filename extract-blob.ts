import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';
import { writeFileSync } from 'fs';

const cases = fuzzSuite(24);
const c = cases[1]; // fuzz-arith-1
const r = protect({ source: c.code, tier: 'silent' });

const blobMatch = r.lua.match(/local ([a-zA-Z_][a-zA-Z0-9_]*)=("(?:[^"\\]|\\.)*")/);
if (blobMatch) {
  const varName = blobMatch[1];
  const blobStr = blobMatch[2];
  console.log('Blob variable:', varName);
  console.log('Blob string length:', blobStr.length);
  
  const luaCode = `local ${varName}=${blobStr}
print("Blob length:", #${varName})
for i = 1, 20 do
  io.write(string.format('%02X ', string.byte(${varName}, i)))
end
print()`;
  writeFileSync('/tmp/kilo/extract-blob.lua', luaCode);
  console.log('Written extraction script');
} else {
  console.log('Blob not found');
}
