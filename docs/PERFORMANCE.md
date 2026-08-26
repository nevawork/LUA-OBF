# NEVAHEX-VM — Performance & Size Budget

Methodology and overhead targets for protected artifacts. Numbers are filled
in by `scripts/verify.sh` runs (see "Measuring"); until the first green run
on the current engine, the table carries **pending** placeholders.

## Measuring

```bash
node scripts/e2e.cjs            # includes wall-clock per-fixture output
node -e '
  const { protect } = require("./dist/pipeline.js");
  const src = require("fs").readFileSync("fixtures/fib.lua", "utf8");
  const t0 = Date.now();
  const r = protect({ source: src, seedHex: "ab".repeat(32) });
  console.log("protect ms:", Date.now() - t0, "out bytes:", Buffer.byteLength(r.lua));
'
```

Runtime overhead = (protected artifact wall-time) / (source wall-time), same
Lua VM, ≥5 runs, median. Fixtures: `fixtures/fib.lua` (call-heavy),
`fixtures/smoke.lua` (mixed), `tests` fuzz cases (loop/table/string).

## Overhead budget

| Profile                     | Target vs source | Notes |
|-----------------------------|------------------|-------|
| default (`tier silent`)     | ≤ 3×             | range-tree dispatch + keyed records |
| `--superops`                | ≤ 2.5×           | fused windows remove dispatch rounds |
| `--anti-emu`                | ≤ 3.2×           | adds 3 probes / tick cadence |
| strict tier                 | ≈ silent         | same tick cost |
| decode phase (load)         | ≤ 8 KiB/ms       | cipher v3 core is ~6 ops/byte; LZW (deferred) will trade this down |

Build-side: protect() on the fib fixture should stay < 500 ms at 1k
instructions (dominated by AST transforms).

## Phase-6 engineering notes (shipped)

- **Argument spreading**: `ur()` uses native `unpack`/`table.unpack` for
  ranges wider than 16; recursive fallback otherwise (identical semantics,
  no deep-call cost on large spans).
- **Constant decryption**: batched `parts[j]=…` + single `table.concat`
  replaces the quadratic `sv = sv .. ch()` chain — long string constants are
  now O(n) in the accessor.
- **Blob decode loop**: `string.byte` hoisted to a block local — one global
  lookup per build instead of one per byte (~6-op inner loop preserved).
- Already landed in earlier phases: binary-search dispatch tree (O(log n)
  comparisons vs the historical linear chain's average ~25).

## Pending baseline table

| Fixture   | Source ms | Protected ms | Ratio | Output bytes |
|-----------|-----------|--------------|-------|--------------|
| fib.lua   | pending   | pending      | —     | pending      |
| smoke.lua | pending   | pending      | —     | pending      |

Fill these from the first `verify.sh` run; investigate any ratio above budget
before flipping deferred features (LZW, native ChaCha20) on.
