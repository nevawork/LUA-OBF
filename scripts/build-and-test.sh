#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
npx tsc
node scripts/e2e.cjs
