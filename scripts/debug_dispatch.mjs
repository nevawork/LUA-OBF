import fs from 'fs';
const lua = fs.readFileSync('/tmp/built.lua', 'utf8');
console.log('Lua length:', lua.length);

// Test the regex
const LIT = String.raw`\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)`;
const re = new RegExp(
  `(elseif|if) op==(${LIT}|[\\d*+\\-/() ]+?)( and \\S.*)? then`,
  "g",
);
const matches = [...lua.matchAll(re)];
console.log('Matches found:', matches.length);
matches.slice(0, 10).forEach((m, i) => console.log(i, m[0].slice(0, 120)));

// Now run the actual verify function
import { verifyGeneratedDispatch } from '../dist/testing/dispatch-check.js';
const perm = Array.from({length:51}, (_,i)=>i);
try {
  const result = verifyGeneratedDispatch(fs.readFileSync('/tmp/built.lua', 'utf8'), Array.from({length:51}, (_,i)=>i), new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]), { encoded: true });
  console.log('Check result:', result);
} catch (e) {
  console.log('Check error:', e.message);
}