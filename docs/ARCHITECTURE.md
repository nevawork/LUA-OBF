# NEVAHEX-VM v2.1 "The Abyss" — Architecture

Multi-module engine. No monolithic files. Each protection system is its own module.

## Layout ↔ Spec Map

```
src/
├── cli.ts                        CLI: protect / extract / verify / metrics
│                                 flags: --tier --seed --watermark --manifest
│                                        --target lua51|luajit|luau|universal
│                                        --env-keying --anti-emu
├── pipeline.ts                   orchestrator (Phase wiring only)
├── extract.ts                    watermark recovery protocol (holder-side)
├── lang/
│   ├── lexer.ts                  Lua 5.1 tokenizer
│   ├── parser.ts                 recursive-descent parser
│   └── nodes.ts                  AST types + walkers
├── engine/                       THE ENGINE CORE (canonical implementations)
│   ├── vm/
│   │   ├── opcodes.ts            logical ISA (51 ops)
│   │   ├── compiler.ts           AST→bytecode, closure conversion (boxed cells)
│   │   └── serializer.ts         blob framing: header, protos, watermark tail
│   ├── crypto/
│   │   ├── prng.ts               CSPRNG nonce, ChaCha20, xoshiro BuildRng (Add. 0.3)
│   │   └── cipher.ts             Lehmer-pair stream cipher contract (bit-op free)
│   └── runtime/
│       ├── identifiers.ts        per-build identifier scrambler
│       ├── dispatcher.ts         handler table + randomized chain assembly
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
    ├── opaque.ts                 semantic poisoning (fake data-flow over live vars)
    ├── luau.ts                   task/_G escape, typeof/__namecall guarantees
    ├── mba.ts                    corrected MBA+ algebra (SMT-resistant rewrites)
    └── index.ts                  registry (+ determinism counter resets)

engine/triple/contracts.ts        Triple-VM boundary contracts + layer seals
engine/runtime/dynload.ts         optional string.dump+load path (Phase 2 exception)
testing/dispatch-check.ts         build-time dispatch self-verification

scripts/e2e.cjs                   differential suite vs wasmoon (Lua 5.4 WASM)
scripts/verify.sh                 one-shot: tsc + e2e + vitest + determinism + cleanup
tests/unit.test.ts                Phase 21 unit suite
tests/fuzz.test.ts                Phase 21 fuzz harness + mutation-trip test
plans/nevahex-v21-plan.md         execution plan & exit criteria
```

Legacy paths (`src/vm/opcodes`, `src/vm/compiler`, `src/vm/serializer`,
`src/gen/prng`) re-export shims → canonical engine modules, kept for import
stability during migration.

Legacy paths (`src/vm/opcodes`, `src/gen/prng`) re-export shims → canonical
engine modules, kept for import stability during migration.

## Invariants

- **No loadstring/load at runtime** — output is literal closures over a custom ISA.
- **Cipher v3 (bit-op free)** — four-stream Lehmer core with output-feedback
  and cross-mixing; only two seed registers ship per artifact, the second
  pair is derived at load; every intermediate stays < 2^53 so JS/Lua agree
  bit-for-bit (`engine/crypto/cipher.ts` ↔ emitter decode loops, pinned by
  `tests/cipher-v3.test.ts` wasmoon parity).
- **No known-plaintext framing** — blob v3 replaces the `"NVX"` magic with a
  randomized prologue (length byte = `0x80|len`); plaintext never starts
  with attacker-known bytes.
- **Manifests ship zero key material** — nonce/seeds appear only when built
  with `--emit-secrets` (holder mode); public manifests carry an HMAC-SHA256
  authenticity tag over canonical fields instead.
- **Deterministic builds** — every decision draws from BuildRng seeded by the
  CSPRNG nonce; transform counters reset per build. String-encryption keys,
  flattening state names and anti-emulation calibration locals are all drawn
  from that stream (no fixed identifiers like `__st`, no `__ae_*` globals).
- **Per-build isomorphism** — opcode permutation, dispatch order, identifiers,
  garbage strings, poison bias all derive from the same rng stream.
- **Env keying is derivation, not comparison** — wrong environment ⇒ wrong
  keystream ⇒ cryptic decode failure; nothing to branch-patch.
- **Bounded resources** — decoder refuses oversized blobs/protos/consts/code;
  integrity slices capped at 32/tick rotation.
- **No raw opcodes at rest (Phase 2)** — instructions are stored rolling-key
  encoded (`opE=(perm+rk)%65536`, per-frame chain init/step via embedded
  constants); decoded records use five per-build random field keys
  (`engine/runtime/opencode.ts`, wire v3.2 in serializer).
- **Split jump offsets** — relative jumps ship as two random shares summed at
  dispatch; only jump-class ops split (compiler patch site `[at][2]`).
- **Range-tree dispatch** — balanced binary routers (`op<=bound`) over exact
  gated leaves; per-node rng-biased splits make tree SHAPE build-specific;
  every leaf carries its own cryptic fallback.
- **Handler polymorphism** — hot/simple ops draw semantic-equivalent bodies
  from per-build variant pools (MOVE/LOADK/arith/GETTAB/EQ-LT-LE/JF/DUP…);
  decoy arms share leaf syntax and route inside the tree.

## Verification Commands

```sh
bash scripts/verify.sh               # one-shot: tsc + e2e + vitest + determinism + cleanup
npx tsx src/cli.ts protect fixtures/x.lua --target luajit --env-keying --anti-emu \
    --tier TIER_PARANOID_SILENT --watermark "license" --seed $(head -c32 /dev/urandom | xxd -p)
npx tsx src/cli.ts extract out.lua --manifest out.lua.manifest.json
npx tsx src/cli.ts metrics --a m1.json --b m2.json   # layout similarity vs 0.15 target
```
