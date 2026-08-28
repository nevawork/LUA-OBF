import { parse } from './src/lang/parser';
import { compileChunk } from './src/engine/vm/compiler';

const source = 'local a = 1 + 2 * 3 return a';
const chunk = parse(source, 'lua51');
const proto = compileChunk(chunk);

console.log('Code:');
for (let i = 0; i < proto.code.length; i++) {
  const [op, a, b, c] = proto.code[i];
  console.log(`  ${i}: op=${op} a=${a} b=${b} c=${c}`);
}
