import { parse } from './src/lang/parser';
import { compileChunk } from './src/engine/vm/compiler';

const source = 'EXPECTED={((((10) * 20) * 20 - 17) * 6) * 14 - 5}';
const chunk = parse(source, 'lua51');
const proto = compileChunk(chunk);

console.log("Code length:", proto.code.length);
for (let i = 0; i < proto.code.length; i++) {
  const [op, a, b, c] = proto.code[i];
  console.log(`  ${i}: op=${op} a=${a} b=${b} c=${c}`);
}
