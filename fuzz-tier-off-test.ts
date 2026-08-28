import { protect } from './src/pipeline';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const source = 'return 42';
const r = protect({ source, tier: 'off' });
const tmpFile = '/tmp/fuzz-tier-off.lua';
writeFileSync(tmpFile, r.lua);

try {
  const result = execSync('lua5.1 ' + tmpFile + ' 2>&1', { encoding: 'utf8', timeout: 5000 });
  console.log('PASS: tier=off');
} catch (e) {
  const msg = (e as Error).message || e.toString();
  console.log('FAIL: tier=off -> ' + msg.split('\n')[0]);
}
