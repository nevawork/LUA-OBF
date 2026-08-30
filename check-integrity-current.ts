import { readFileSync } from 'fs';

const lua = readFileSync('/tmp/kilo/fuzz-debug.lua', 'utf8');

const lines = lua.split('\n');
const blobLine = lines.find(l => l.match(/^\s*local [a-zA-Z_][a-zA-Z0-9_]*="/));
if (!blobLine) {
  console.log('Blob line not found');
  process.exit(1);
}

const varName = blobLine.match(/local ([a-zA-Z_][a-zA-Z0-9_]*)=/)[1];
const firstQuote = blobLine.indexOf('"');
const lastQuote = blobLine.lastIndexOf('"');
const blobStr = blobLine.substring(firstQuote, lastQuote + 1);

const fn = new Function('return ' + blobStr);
const blob = fn();

// Slices from BS table
const slices = [
  { p: 1, a: 48, h: 182857018 },
  { p: 46, a: 48, h: 79862609 },
  { p: 91, a: 48, h: 252869824 },
  { p: 137, a: 48, h: 270662092 },
  { p: 182, a: 48, h: 167691074 },
  { p: 227, a: 48, h: 677270936 },
  { p: 273, a: 48, h: 357659529 },
  { p: 318, a: 46, h: 89326307 },
];

console.log('Blob length:', blob.length);
console.log('Slices:', slices.length);
let mismatches = 0;
for (const sl of slices) {
  let hh = 2166136261 % 1000000007;
  for (let j = sl.p; j < sl.p + sl.a; j++) {
    const byte = blob.charCodeAt(j - 1);
    hh = (hh * 31 + byte) % 1000000007;
  }
  if (hh !== sl.h) {
    console.log(`MISMATCH at p=${sl.p} a=${sl.a}: expected ${sl.h} got ${hh}`);
    mismatches++;
  } else {
    console.log(`MATCH at p=${sl.p} a=${sl.a}: ${hh}`);
  }
}
console.log('Total mismatches:', mismatches);
