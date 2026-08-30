import { protect } from './src/pipeline';
import { fuzzSuite } from './src/testing/fuzz';
import * as emitter from './src/vm/emitter';

const originalEmitRuntime = emitter.emitRuntime;
emitter.emitRuntime = function(opts: any) {
  console.log('emitRuntime received blobSlices:', opts.blobSlices?.length, opts.blobSlices?.map(s => ({p: s.p, a: s.a, h: s.h})));
  return originalEmitRuntime(opts);
};

const cases = fuzzSuite(24);
const c = cases[1];
const r = protect({ source: c.code, tier: 'silent' });
console.log('Done');
