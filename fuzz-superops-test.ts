import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const cases = fuzzSuite(24);
let pass = 0, fail = 0;

for (const c of cases) {
  try {
    const r = protect({ source: c.code, tier: 'silent', superops: false, megaSuperops: false });
    const tmpFile = '/tmp/fuzz-sops-' + c.name + '.lua';
    writeFileSync(tmpFile, r.lua);
    
    const result = execSync('lua5.1 ' + tmpFile + ' 2>&1', { encoding: 'utf8', timeout: 5000 });
    console.log('PASS: ' + c.name);
    pass++;
  } catch (e) {
    const msg = (e as Error).message || e.toString();
    console.log('FAIL: ' + c.name + ' -> ' + msg.split('\n')[0]);
    fail++;
  }
}

console.log('\nResults: ' + pass + ' passed, ' + fail + ' failed');
