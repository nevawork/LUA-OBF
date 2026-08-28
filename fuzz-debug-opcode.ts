import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const cases = fuzzSuite(24);
const c = cases[0]; // fuzz-table-0
const r = protect({ source: c.code, tier: 'silent' });

// Patch the obfuscated Lua to print opcodes before dispatch
const patched = r.lua.replace(
  'error(',
  'print("FALLBACK-OP:", op, "at PC:", WtVKyLBqvX) error('
);

const tmpFile = '/tmp/kilo/fuzz-debug-opcode.lua';
writeFileSync(tmpFile, patched);

try {
  const result = execSync('lua5.1 ' + tmpFile + ' 2>&1', { encoding: 'utf8', timeout: 5000 });
  console.log('PASS');
} catch (e) {
  const msg = (e as Error).message || e.toString();
  const lines = msg.split('\n');
  console.log('FAIL:', lines[0]);
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    console.log(lines[i]);
  }
}
