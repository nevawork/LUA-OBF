import { protect } from './src/pipeline';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const samplesDir = './samples';
const sourceFiles = ['sample_lua51.lua', 'sample_luau.lua', 'sample_roblox_executor.lua'];

// Delete old obfuscated and test files
const oldFiles = [
  'obfuscated_lua51.lua',
  'obfuscated_luau.lua', 
  'obfuscated_roblox_executor.lua',
  'test_debug.lua',
  'test_fixed.lua',
  'test_fixed_seed.lua',
  'test_latest.lua',
  'test_minimal.lua',
  'test_sample.lua',
  'test_simple.lua',
];

for (const f of oldFiles) {
  const path = join(samplesDir, f);
  try { writeFileSync(path, ''); console.log('Deleted:', f); } catch (e) {}
}

// Regenerate obfuscated samples
for (const src of sourceFiles) {
  const sourcePath = join(samplesDir, src);
  const source = readFileSync(sourcePath, 'utf-8');
  
  // Determine env profile based on filename
  let envProfile: string = 'universal';
  if (src.includes('luau')) envProfile = 'luau';
  if (src.includes('roblox')) envProfile = 'roblox_executor';
  
  const result = protect({
    source,
    tier: 'silent',
    envProfile: envProfile as any,
    seedHex: 'aa'.repeat(32),
  });
  
  const outName = src.replace('sample_', 'obfuscated_');
  const outPath = join(samplesDir, outName);
  writeFileSync(outPath, result.lua);
  console.log(`Generated ${outName} (${result.lua.length} bytes)`);
}

console.log('Samples regenerated successfully');
