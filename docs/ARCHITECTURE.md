# NEVAHEX-VM v2.1 "The Abyss" — Architecture

Multi-module engine. No monolithic files. Each protection system is its own module.

## Layout ↔ Spec Map

```
src/
├── cli.ts                        CLI: protect / extract / verify
│                                 flags: --tier --seed --watermark --manifest
│                                        --target lua51|luajit|luau|universal
│                                        --env-keying --anti-emu
├── pipeline.ts                   orchestrator (Phase wiring only)
├── extract.ts                    watermark recovery protocol (holder-side)
├── lang/
│   ├── lexer.ts                  Lua 5.1 tokenizer
│   ├── parser.ts                 recursive-descent parser
│   └── nodes.ts                  AST types + walkers
├── engine/                       THE ENGINE CORE
│   ├── vm/
│   │   ├── opcodes.ts            logical ISA (51 ops)
│   │   ├── compiler.ts           AST→bytecode, closure conversion (boxed cells)
│   │   └── serializer.ts         blob framing: header, protos, watermark tail
│   ├── crypto/
│   │   ├── prng.ts               CSPRNG nonce, ChaCha20, xoshiro BuildRng (Add. 0.3)
│   │   └── cipher.ts             Lehmer-pair stream cipher contract (bit-op free)
│   └── runtime/
│       ├── identifiers.ts        per-build identifier scrambler
│       ├── dispatcher.ts         handler construction + chain assembly
│       ├── integrity.ts          integrity tick emission (hash mirror)
│       ├── carriers.ts           watermark carrier consumption
│       ├── tiers.ts              off | strict-halt | silent-poison (Add. 0.2)
│       └── emitter.ts            artifact assembly
├── protection/
│   ├── antitamper.ts             slice planning + FNV-mirror hash
│   ├── watermark.ts              spread/unspread + CRC-16 embed/recover
│   ├── antiemulation.ts          os.clock timing floor (Phase 1: sandbox class)
│   ├── envkeying.ts              hardened derive-not-compare keying per profile
│   └── resources.ts              bounded decode budgets (graceful degradation)
└── transforms/
    ├── strings.ts                rolling-key string encryption
    ├── flatten.ts                keyed state-machine flattening + decoys
    ├── opaque.ts                 opaque dead-code injection
    └── index.ts                  registry (+ determinism counter resets)

scripts/e2e.cjs                   differential suite vs wasmoon (Lua 5.4 WASM)
plans/nevahex-v21-plan.md         execution plan & exit criteria
```

Legacy paths (`src/vm/opcodes`, `src/gen/prng`) re-export shims → canonical
engine modules, kept for import stability during migration.

## Invariants

- **No loadstring/load at runtime** — output is literal closures over a custom ISA.
- **Bit-op free cipher** — identical JS/Lua keystream (doubles stay < 2^53).
- **Deterministic builds** — every decision draws from BuildRng seeded by the
  CSPRNG nonce; transform counters reset per build.
- **Per-build isomorphism** — opcode permutation, dispatch order, identifiers,
  garbage strings, poison bias all derive from the same rng stream.
- **Env keying is derivation, not comparison** — wrong environment ⇒ wrong
  keystream ⇒ cryptic decode failure; nothing to branch-patch.
- **Bounded resources** — decoder refuses oversized blobs/protos/consts/code;
  integrity slices capped at 32/tick rotation.

## Verification Commands

```sh
npx tsc && node scripts/e2e.cjs      # build + 21-case differential suite
npx tsx src/cli.ts protect fixtures/x.lua --target luajit --env-keying --anti-emu \
    --tier silent --watermark "license" --seed $(head -c32 /dev/urandom | xxd -p)
npx tsx src/cli.ts extract out.lua --manifest out.lua.manifest.json
rm -f scripts/noop*.cjs scripts/.keep.cjs scripts/.placeholder.cjs scripts/.gitkeep scripts/run-all.cjs
```
