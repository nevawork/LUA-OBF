#!/usr/bin/env bash
# NEVAHEX-VM — full verification pass (run after any change)
set -e
cd "$(dirname "$0")/.."

echo "== 1/5 typecheck =="
npx tsc

echo "== 2/5 e2e differential suite (wasmoon) =="
node scripts/e2e.cjs

echo "== 3/5 unit + fuzz suites (vitest) =="
npx vitest run

echo "== 4/5 determinism & isomorphism =="
node -e "
const {protect} = require('./dist/pipeline.js');
const a = protect({source:'return 1', tier:'silent', seedHex:'ab'.repeat(32)});
const b = protect({source:'return 1', tier:'silent', seedHex:'ab'.repeat(32)});
const c = protect({source:'return 1', tier:'silent', seedHex:'cd'.repeat(32)});
if (a.lua !== b.lua) { console.error('FAIL determinism'); process.exit(1); }
if (a.lua === c.lua) { console.error('FAIL isomorphism'); process.exit(1); }
const sim = require('./dist/testing/metrics.js').layoutSimilarity(a.manifest.fingerprint, b.manifest.fingerprint);
console.log('same-seed layout similarity:', sim.toFixed(4), '(expect 1.0)');
console.log('OK');
"

echo "== 5/5 cleanup junk files =="
rm -f scripts/noop*.cjs scripts/.keep.cjs scripts/.placeholder.cjs scripts/.gitkeep scripts/run-all.cjs scripts/dbg*.cjs
echo "done"
