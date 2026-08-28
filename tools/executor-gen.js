#!/usr/bin/env node
// NEVAHEX Executor VM Generator - Simple hex encoding
// Works in all Roblox executors

const fs = require("fs");

function obfuscateHex(source) {
  const lines = [];
  
  // Convert source to hex
  const hex = source.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  
  lines.push('-- NEVAHEX Executor VM');
  lines.push('local h="' + hex + '"');
  lines.push('local function d()');
  lines.push('  local r=""');
  lines.push('  for i=1,#h,2 do');
  lines.push('    r=r..string.char(tonumber(h:sub(i,i+1),16))');
  lines.push('  end');
  lines.push('  return r');
  lines.push('end');
  lines.push('local f=loadstring or load');
  lines.push('local s=d()');
  lines.push('if s and #s>0 then');
  lines.push('  local fn=f(s)');
  lines.push('  if fn then fn() end');
  lines.push('end');
  
  return lines.join('\n');
}

function obfuscateXor(source, seed = 12345) {
  const lines = [];
  
  // XOR encode
  const encoded = [];
  let state = seed;
  for (let i = 0; i < source.length; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const byte = source.charCodeAt(i) ^ (state & 0xFF);
    encoded.push(byte);
  }
  
  const hex = encoded.map(b => b.toString(16).padStart(2, '0')).join('');
  
  lines.push('-- NEVAHEX Executor VM');
  lines.push('local s="' + hex + '"');
  lines.push('local m=' + seed);
  lines.push('local function g()');
  lines.push('  local r=""');
  lines.push('  for i=1,#s,2 do');
  lines.push('    m=(m*1103515245+12345)&0x7fffffff');
  lines.push('    local b=tonumber(s:sub(i,i+1),16)');
  lines.push('    r=r..string.char(b~=(m&0xff))');
  lines.push('  end');
  lines.push('  return r');
  lines.push('end');
  lines.push('local f=loadstring or load');
  lines.push('local code=g()');
  lines.push('if code and #code>0 then');
  lines.push('  local fn=f(code)');
  lines.push('  if fn then fn() end');
  lines.push('end');
  
  return lines.join('\n');
}

// CLI
const input = process.argv[2];
const output = process.argv[3];
const seed = parseInt(process.argv[4] || '12345');
const mode = process.argv[5] || 'hex';

if (!input) {
  console.error('Usage: node executor-gen.js <input.lua> [output.lua] [seed] [hex|xor]');
  process.exit(1);
}

const source = fs.readFileSync(input, 'utf8');
const result = mode === 'xor' ? obfuscateXor(source, seed) : obfuscateHex(source);

if (output) {
  fs.writeFileSync(output, result);
  console.log('Generated:', output);
} else {
  console.log(result);
}
