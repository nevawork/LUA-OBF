#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

# drop scratch/debug leftovers so they never enter history
rm -f scripts/noop*.cjs scripts/.keep.cjs scripts/.placeholder.cjs \
      scripts/.gitkeep scripts/run-all.cjs scripts/dbg1.cjs scripts/dbg2.cjs \
      scripts/dbg3.cjs scripts/dbg4.cjs scripts/dbg5.cjs scripts/dbg6.cjs \
      scripts/dbg7.cjs

git add -A
git -c user.name="kiloconnect[bot]" -c user.email="240665456+kiloconnect[bot]@users.noreply.github.com" \
  commit -m "feat(spec): MBA+ algebra, dyn-load path, semantic poisoning, triple-layer seals

- transforms/mba.ts: corrected MBA+ algebra rewrites (SMT-resistant),
  constant splitting; wired into pipeline (default on, --no-mba to disable)
- engine/runtime/dynload.ts: optional string.dump+load path (Phase 2
  exception) with rolling-key masked dumps; --dyn-load, disabled for luau
- transforms/opaque.ts: semantic poisoning now references live in-scope
  identifiers (Phase 1 ML-reconstruction defense)
- engine/triple/contracts.ts + emitter/pipeline: Triple-VM boundary layer
  markers and per-layer seals stored in the manifest (Phase 3)
- .gitignore added" \
  && git push origin session/agent_6d4208be-13aa-43a3-a5ad-1d5cc2a855f1

git log --oneline -3
