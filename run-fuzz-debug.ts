import { createEngine, LuaFactory } from 'wasmoon';
import { readFileSync } from 'fs';

const luaCode = readFileSync('/tmp/kilo/fuzz-debug.lua', 'utf-8');

async function run() {
  const factory = new LuaFactory();
  const engine = await factory.createEngine();
  try {
    await engine.doString(luaCode);
    console.log('Success!');
    const result = engine.global.getTable('EXPECTED');
    console.log('Result:', JSON.stringify(result));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

run();
