# NEVAHEX-VM v2.1 "The Abyss" — Implementation Plan

Status map: spec phase → module(s) → state.
Target layout is a multi-module engine; no monolithic files.

## 1. Current State (done)

| Spec item | Module | State |
|---|---|---|
| Lua 5.1 grammar front-end | `src/lang/lexer.ts`, `parser.ts`, `nodes.ts` | DONE |
| Custom stack VM ISA + closure conversion | `src/vm/opcodes.ts`, `src/vm/compiler.ts` | DONE |
| Per-build opcode permutation (anti-DPA) | `src/pipeline.ts` | DONE |
| Blob format + transport cipher (bit-op free) | `src/vm/serializer.ts` | DONE |
| Watermark spread/carriers in blob tail | `src/vm/serializer.ts` | DONE |
| Runtime emitter: shuffled dispatch, ident scrambling, MBA gates | `src/vm/emitter.ts` | DONE (monolith — split pending) |
| Tiered anti-tamper (Addendum 0.2: strict halt / silent poison) | inside emitter | DONE (extract to module pending) |
| Integrity slices over decoded code | pipeline + emitter | DONE (extract pending) |
| String encryption / flattening / opaque junk transforms | `src/transforms/index.ts` | DONE (split pending) |
| CSPRNG 256-bit nonce determinism (Addendum 0.3) | `src/gen/prng.ts` | DONE |
| Manifest sidecar + extraction protocol | `src/pipeline.ts`, `src/extract.ts` | DONE |
| CLI: protect / extract / verify | `src/cli.ts` | DONE |

## 2. Immediate Correctness Gate (blocking)

1. **[FIXED]** MBA gate tautology bug: `(7x²)%2==0` false for odd x → `(7x²+x)%2==0`.
2. **[FIXED]** Parser infix `and`/`or`: keyword tokens never matched in the binop
   loop, so `(a or b)` died with "expected ')' near 'or'".
3. **[FIXED]** CLOSURE operand off-by-one: compiler emitted 0-based child ids,
   serializer remap expected 1-based — every function definition resolved wrong.
4. **[FIXED]** Transforms registry: dropped luau exports + re-export scope bug.
5. **[FIXED]** cipher.ts duplicate M31 export.
6. **[ACTIVE — Bug B]** Every instruction hits dispatch fallback at runtime.
   Mitigation shipped: build-time self-check (`testing/dispatch-check.ts`) now
   runs inside protect() and fails the BUILD with an exact diff if literals/
   permutation/gates desync from decoded bytecode; NEVAHEX_DEBUG artifacts emit
   per-instruction op traces and a diagnostic fallback (`FB op=.. pc=..`).
   ⚠️ Arm-extraction regexes previously missed nested-paren literals
   (((n+256)-256)); fixed in dispatch-check + diagnose. Prior coverage audits
   were partially blind to those arms.
7. Run `scripts/e2e.cjs` (17 semantic fixtures, tier variants, determinism,
   per-build isomorphism) until green; CI runs it automatically.

## 3. Engine Restructure (requirement: real multi-file system/engine)

```
src/
├── cli.ts                      CLI entry
├── pipeline.ts                 orchestrator only
├── extract.ts                  watermark recovery
├── lang/                       lexer / parser / ast
├── engine/
│   ├── vm/
│   │   ├── opcodes.ts          logical ISA
│   │   ├── compiler.ts         AST→bytecode
│   │   ├── permutation.ts      per-build opcode synthesis
│   │   └── serializer.ts       blob format + framing
│   ├── crypto/
│   │   ├── prng.ts             nonce, ChaCha20, BuildRng
│   │   └── cipher.ts           LCG-pair stream cipher contract
│   └── runtime/
│       ├── identifiers.ts      scrambler
│       ├── dispatcher.ts       handler bodies + chain assembly
│       ├── integrity.ts        anti-tamper weaving + hash mirror
│       ├── carriers.ts         watermark consumption + decoys
│       ├── tiers.ts            off/strict/silent policies
│       ├── hardening.ts        anti-emulation + env-keying injectors
│       └── emitter.ts          artifact assembly
├── protection/
│   ├── antitamper.ts           slice planning + policy config
│   ├── watermark.ts            spread/unspread/CRC embed+extract API
│   ├── antiemulation.ts        timing checks (os.clock; disabled for Luau)
│   ├── envkeying.ts            hardened fingerprint key derivation
│   └── resources.ts            bounded-resource governor
└── transforms/
    ├── strings.ts              encryption
    ├── flatten.ts              control-flow flattening
    ├── opaque.ts               dead code / MBA
    └── index.ts                registry
tests/                          vitest unit + fuzz harness
docs/ARCHITECTURE.md            file ↔ spec-phase map
```

## 4. Remaining Spec Systems (after restructure)

| Spec requirement | Plan | State |
|---|---|---|
| Anti-emulation/sandbox (Phase 1 adversary class) | `antiemulation.ts`: batched `os.clock` deltas vs executed-op count; slowdown ⇒ tamper path. Off for Luau target (`--target luau`). | DONE (wired, unverified) |
| Environmental keying, hardened (colluding attacker) | `envkeying.ts`: derive blob subkey from runtime fingerprint (`_VERSION` + selected global bits). Wrong env ⇒ wrong keys ⇒ cryptic failure — derive-not-compare. `--env-keying --target <profile>`. | DONE (wired, unverified) |
| Bounded resources (graceful degradation) | `resources.ts`: decode budget caps embedded in decoder. | DONE |
| Phase 21 verification & fuzz harness | `tests/unit.test.ts` + `tests/fuzz.test.ts` (24-case generator, mutation-trips-tier test). Run via vitest. | WRITTEN, needs run |
| Handler-diversity metric (cosine < 0.15 replacement) | `testing/metrics.ts` + `nevahex metrics --a m1 --b m2`; fingerprint stored in manifest. | DONE |
| Tier naming per Addendum 0.2 | `TIER_PARANOID_*` accepted + normalized. | DONE |
| Luau compat: task as `_G["\116\97\115\107"]` | `transforms/luau.ts` `preserveTaskLibrary` wired into pipeline. | DONE |
| Luau compat: typeof / __namecall | passthrough guarantees; ISA never triggers __namecall. Documented in module header. | DONE |
| **Triple-VM hypervisor (Phase 3)** Layers 1–3, entropy pool | **BLOCKED: spec text truncated** at Phase 3.1 both deliveries. Need Phases 3–20 full text. | NOT STARTED |
| Addendum 0.1 bounded adversary cost | documented as design goal w/ measurable proxies in ARCHITECTURE.md. | DOCUMENTED |

## 5. Exit Criteria

- [ ] e2e suite green (17+ cases)
- [ ] vitest unit suite green (lexer/parser/compiler/cipher/watermark)
- [ ] fuzz harness: ≥200 generated programs pass differential testing
- [ ] tamper mutation: byte-flip ⇒ strict errors / silent poisons, off unaffected
- [ ] extraction round-trip passes; wrong-key extraction fails CRC
- [ ] determinism + per-build isomorphism tests pass
- [ ] restructure complete; all committed with docs/ARCHITECTURE.md
