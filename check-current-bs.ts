import { readFileSync } from 'fs';

const lua = readFileSync('/tmp/kilo/fuzz-debug.lua', 'utf8');

// Find BS table
const bsStart = lua.indexOf('local BS={');
let depth = 0;
let bsEnd = 0;
for (let i = bsStart; i < lua.length; i++) {
  if (lua[i] === '{') depth++;
  else if (lua[i] === '}') {
    depth--;
    if (depth === 0) {
      bsEnd = i + 1;
      break;
    }
  }
}
const bsStr = lua.substring(bsStart, bsEnd);
console.log('BS string length:', bsStr.length);

// Extract slices using regex
const slices = [];
const sliceRegex = /p=\(([^)]+)\),a=\(([^)]+)\),h=\(([^)]+)\)/g;
let match;
while ((match = sliceRegex.exec(bsStr)) !== null) {
  try {
    const p = eval(match[1]);
    const a = eval(match[2]);
    const h = eval(match[3]);
    slices.push({ p, a, h });
  } catch (e) {
    console.log('Failed to parse slice:', match[0]);
  }
}

console.log('Slices found:', slices.length);
for (const sl of slices) {
  console.log(`  p=${sl.p}, a=${sl.a}, h=${sl.h}`);
}
