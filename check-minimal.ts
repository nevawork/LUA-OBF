import { protect } from './src/pipeline';
import { writeFileSync } from 'fs';

const r = protect({ 
  source: 'return 42', 
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

writeFileSync('/tmp/kilo/minimal.lua', r.lua);
console.log('Written minimal.lua, length:', r.lua.length);
