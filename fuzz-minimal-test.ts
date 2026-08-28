import { protect } from './src/pipeline';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const source = 'return 42';
const r = protect({ 
  source, 
  tier: 'silent', 
  superops: false, 
  megaSuperops: false,
  regObfuscate: false,
  constShuffle: false,
  mbaPlus: false,
  mbaDatabase: false,
  factorizationKeys: false,
  antiLuahunt: false,
  pathExplosion: false,
  selfModifying: false,
  luauVm: false,
  mmTraps: false,
  keyless: false,
  dualVm: false,
  directThreaded: false,
  emitSecrets: false,
  flatten: false,
  junkDensity: 0,
  watermark: undefined,
});

const tmpFile = '/tmp/fuzz-minimal.lua';
writeFileSync(tmpFile, r.lua);

try {
  const result = execSync('lua5.1 ' + tmpFile + ' 2>&1', { encoding: 'utf8', timeout: 5000 });
  console.log('PASS: minimal obfuscation');
} catch (e) {
  const msg = (e as Error).message || e.toString();
  console.log('FAIL: minimal obfuscation -> ' + msg.split('\n')[0]);
}
