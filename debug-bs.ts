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
console.log('BS string:', bsStr);
console.log('Length:', bsStr.length);
