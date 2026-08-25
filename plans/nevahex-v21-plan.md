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

1. **[FIXED, UNVERIFIED]** MBA gate tautology bug: `(7x²)%2==0` is false for odd x
   and the tamper counter starts at 37 → every gated handler was dead at startup.
   Replaced with `(7x²+x)%2==0`, a true tautology (∀ integers, x²≡x mod 2).
2. Build + run `scripts/e2e.cjs` (17 semantic fixtures, tier variants,
   determinism, per-build isomorphism) until green.

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

| Spec requirement | Plan |
|---|---|
| Anti-emulation/sandbox (Phase 1 adversary class) | `antiemulation.ts`: batched `os.clock` deltas vs executed-op count; slowdown ⇒ tamper path. Off for Luau target (`--target luau`). |
| Environmental keying, hardened (colluding attacker) | `envkeying.ts`: derive blob subkey from runtime fingerprint (`_VERSION` + selected global fingerprints). Wrong env ⇒ wrong keys ⇒ cryptic failure — derive-not-compare avoids original's weakness. Optional flag. |
| Bounded resources (graceful degradation) | `resources.ts`: decode budget caps, max integrity slices per tick, embedded iteration guards. |
| Phase 21 verification & fuzz harness | `tests/fuzz.test.ts`: random-program generator → protect → differential run vs reference Lua; byte-flip mutation tests must trip tiers; extraction round-trip incl. wrong-key CRC failure; determinism/isomorphism. |
| Handler-diversity metric (replaces unverifiable ML claim) | `nevahex metrics a.lua b.lua`: dispatch-order + handler-body similarity across builds. |
| Luau compat (typeof / __namecall / task lib) | Passthrough guarantees documented: method names encrypted at rest only, resolved correctly at runtime; globals never rewritten. Target flag gates os-dependent layers. |
| Addendum 0.1 bounded adversary cost | Documented as design goal with measurable proxies (handler diversity, mutation coverage) in ARCHITECTURE.md. |

## 5. Exit Criteria

- [ ] e2e suite green (17+ cases)
- [ ] vitest unit suite green (lexer/parser/compiler/cipher/watermark)
- [ ] fuzz harness: ≥200 generated programs pass differential testing
- [ ] tamper mutation: byte-flip ⇒ strict errors / silent poisons, off unaffected
- [ ] extraction round-trip passes; wrong-key extraction fails CRC
- [ ] determinism + per-build isomorphism tests pass
- [ ] restructure complete; all committed with docs/ARCHITECTURE.md
