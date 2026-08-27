# NEVAHEX-VM v4 "Abyss" → v5 "Void" — Master Plan for Strongest Possible Lua Obfuscation

**Branch**: `session/agent_18261d34-2c37-4d80-8e72-4f0a7e1b0205`  
**Base**: `f5be7c3` (HEAD, 8,549 LOC in `src/`)  
**Goal**: Strongest Lua obfuscation ever — decisively stronger than Luraph v15, IronBrew2, Prometheus, PSU, and all public deobfuscation tools.

---

## 1. Executive Summary

**Current State**: All hardening layers (Phases 1–5) are implemented but **three critical bugs** block the pipeline and 37/95 tests fail. Architecture is solid but has structural gaps vs Luraph v15.

**Goal**: Fix critical bugs → make all hardening default-on → implement **7 new defense layers** to surpass Luraph v15 decisively.

---

## 2. Critical Bugs (Must Fix First — Blockers)

| Bug | File | Root Cause | Fix |
|-----|------|------------|-----|
| **Dispatch self-check rejects fused ops** | `src/testing/dispatch-check.ts:115-121` | Checks `perm.indexOf(op)` for ALL used ops; fused ops (≥500) not in `perm` (0-50) | Skip fused ops in used-ops check (validated via `extraReal`) |
| **CVW regex test fails** | `tests/phase5.test.ts:94` | Silent-tier formula changed to include `cmVar` multiplier; test expects old pattern | Update regex to match adaptive `deltaSa*cmVar` formula |
| **Handler diversity metric fails** | `tests/unit.test.ts:157` | Cosine similarity of reversed vectors ≈0.999 (expected <0.15) | Replace with Kendall tau distance on dispatch order |
| **Local budget exceeded** | `src/engine/runtime/localbudget.ts` | 159 locals > 150 limit (Phase 5 + keyless + mmTraps) | Increase `LOCAL_BUDGET` to 200 |
| **Transforms default OFF** | `src/pipeline.ts:157-161,306,327` | `flatten`, `mbaPlus`, `superops`, `keyless`, `mmTraps`, `antiEmulation` all opt-in | Invert defaults; add `--no-*` flags |

---

## 3. Gap Analysis vs Luraph v15

| Capability | NEVAHEX Current | Luraph v15 | Gap |
|------------|-----------------|------------|-----|
| **VM Architecture** | Single custom VM | Multi-layer VM + LuaJIT bytecode patching | **Major** |
| **String Encryption** | Additive LCG cipher | White-box AES + per-string keys | **Major** |
| **Control Flow** | Single-layer flattening | Multi-layer + opaque predicates + transposition | **Major** |
| **Anti-Debug** | 9 probes | Hardware breakpoints, kernel hooks, hypervisor detection | **Major** |
| **Anti-Disassembly** | Range tree dispatch | Overlapping instructions, invalid opcodes, code/data mixing | **Major** |
| **Constant Protection** | Per-proto stream cipher | White-box crypto + runtime key reconstruction | **Major** |
| **Anti-Tamper** | Slice hashing + CVW | Self-checksumming, code signing, runtime code signing | **Major** |
| **Code Virtualization** | Single VM layer | Multi-level virtualization (VM-in-VM) | **Major** |
| **Junk Code** | 3 variants, opaque guards | Realistic API calls, decoy functions, API mocks | **Medium** |
| **Metamorphic Engine** | None | Build-time code morphing, register renaming | **Major** |
| **Polymorphism** | Per-build RNG | Runtime cipher switching, key diversification | **Medium** |
| **Anti-Decompilation** | Range tree + rolling key | Overlapping instructions, invalid opcodes, code/data mixing | **Major** |
| **Function Outlining** | None | Extract sequences into decoy functions | **Medium** |
| **Loop Transformations** | None | Fission, fusion, unrolling with junk | **Medium** |
| **Dataflow Obfuscation** | None | Array flattening, SSA, encoding tables | **Medium** |
| **Watermarking** | Spread-spectrum + CRC | Robust watermarking + traitor tracing | **Medium** |

---

## 4. Comprehensive 12-Phase Roadmap

### PHASE 0: Foundation Repair (Week 1) — **BLOCKERS**

| Task | File | Change |
|------|------|--------|
| Fix dispatch check for fused ops | `src/testing/dispatch-check.ts:115-121` | Skip fused ops in used-ops check (validated via `extraReal`) |
| Update CVW regex test | `tests/phase5.test.ts:94` | Match adaptive `deltaSa*cmVar` formula |
| Replace diversity metric | `tests/unit.test.ts:157` + `src/testing/metrics.ts` | Replace cosine similarity with Kendall tau distance |
| Increase local budget | `src/engine/runtime/localbudget.ts` | `LOCAL_BUDGET = 200` |
| Make all hardening default-on | `src/pipeline.ts` | Invert boolean flags; add `--no-*` CLI flags |
| Fix keyless + mmTraps budget | `src/vm/emitter.ts` | Optimize locals or increase budget |

**Validation**: `npm test` → 0 failures; `protect({source, tier:'strict'})` works.

---

## PHASE 1: Transform Hardening (Weeks 2-3)

### 1.1 String Encryption v3 — White-Box AES
**Files**: `src/transforms/strings.ts`, `src/vm/emitter.ts` (decoder)
- Replace additive LCG with **white-box AES-128** (fixed key in S-boxes)
- Per-string unique S-boxes derived from build RNG
- Runtime key reconstruction from scattered VM state
- String pooling: all strings in encrypted table, decrypted on first access
- Anti-frequency analysis: decoy strings, variable padding, length hiding

### 1.2 MBA+ Algebra v3 — 100+ Identities
**File**: `src/transforms/mba.ts`
- 100+ identities covering all arithmetic/comparison ops
- Context-aware rewriting (constants vs variables)
- MBA-aware opaque predicates (guards use same MBA forms)
- Circular dependency prevention (detect rewrite cycles)
- Symbolic-execution resistance (no single rewrite collapses)

### 1.3 Control Flow Obfuscation v3
**File**: `src/transforms/flatten.ts`
- **Multi-layer flattening**: 3+ nested state machines for critical functions
- **Predicate switching**: Control flow depends on encrypted runtime predicates
- **Code transposition**: Reorder basic blocks with opaque jump tables
- **Branch obfuscation**: Convert branches to arithmetic via MBA
- **Loop transformations**: Fission, fusion, unrolling with junk iterations
- **Function outlining**: Extract random sequences into fake functions

### 1.4 Opaque Predicates v3
**File**: `src/transforms/opaque.ts`
- 20+ guard forms (parity, multiplicative, XOR, quadratic, modular, bitwise)
- Context-dependent forms (different based on surrounding code)
- Anti-pruning: guards with apparent side effects
- Temporal guards (truth value changes over time)
- Compositional guards (combine multiple into complex ones)

### 1.5 Junk Code v3 — Realistic Decoys
**File**: `src/transforms/opaque.ts`
- Realistic API calls (`os.clock()`, `math.random()`, `table.insert`)
- Decoy functions with realistic signatures and docstrings
- Variable names from curated dictionary (not `jX7z`)
- Misleading comments in multiple languages

---

## PHASE 2: VM Hardening (Weeks 4-5)

### 2.1 Bytecode Virtualization — True VM-in-VM
**Files**: `src/engine/vm/opcodes.ts`, `src/vm/emitter.ts`, `src/engine/vm/compiler.ts`
- **Custom ISA**: Convert Lua bytecode → NEVAHEX ISA (64-bit opcodes)
- **Per-build ISA randomization**: Opcode mapping changes every build
- **Handler randomization**: 3+ implementations per opcode, selected at runtime
- **VM-in-VM**: Nested virtualization layers with different ISAs
- **Self-modifying handlers**: Decrypt/encrypt handler code at runtime

### 2.2 Anti-Disassembly
**File**: `src/vm/emitter.ts` (dispatch loop)
- **Overlapping instructions**: Same bytes decode multiple ways
- **Invalid opcodes**: Emit unreachable but valid-looking instructions
- **Computed jump targets**: Resolve jump targets at runtime
- **Code/data mixing**: Store code in data sections, execute via closures
- **Import hiding**: Dynamic lookup for all stdlib functions

### 2.3 Runtime Integrity Verification
**Files**: `src/engine/runtime/integrity.ts`, `src/vm/emitter.ts`
- **Self-checksumming**: VM verifies own handler code at startup
- **Anti-patching**: Detect handler code modifications
- **Control flow integrity**: Verify call graph at runtime
- **Stack canaries**: Detect stack smashing/ROP
- **Heap metadata protection**: Detect heap corruption

---

## PHASE 3: Anti-Analysis (Weeks 6-7)

### 3.1 Anti-Debugging v5
**File**: `src/protection/antiemulation.ts` + emitter integration
- **Hardware breakpoint detection**: DR0-DR7 register checks
- **Kernel hook detection**: `debug.sethook`, `debug.traceback`, `jit.*`
- **Hypervisor detection**: CPUID timing, TSC skew, VMware/I/O port checks
- **Sandbox detection**: Cuckoo, Any.Run, Joe Sandbox via API behavior
- **Anti-hooking**: Detect `debug.sethook`, `debug.traceback`, `debug.debug`

### 3.2 Environment Fingerprinting v2
**Files**: `src/protection/entropypool.ts`, `src/protection/envkeying.ts`
- **Lua version binding**: Bind behavior to specific Lua/LuaJIT/Luau builds
- **Platform detection**: Windows/Linux/macOS, Roblox, FiveM, Defold
- **Library availability**: Detect installed modules, adapt behavior
- **CPU feature detection**: SSE, AVX for native code paths
- **Entropy sampling**: Use system entropy for key derivation

### 3.3 Timing Attack Resistance
**File**: `src/protection/antiemulation.ts`
- **Cache timing resistance**: Constant-time crypto operations
- **Branch prediction resistance**: Balanced branch patterns
- **Power analysis resistance**: Constant-time crypto primitives
- **Acoustic/EM**: Document theoretical attack surface

---

## PHASE 4: White-Box Cryptography (Weeks 8-9)

### 4.1 String Encryption — White-Box AES
**Files**: `src/transforms/strings.ts`, `src/vm/emitter.ts`
- White-box AES-128 with per-string S-boxes
- Key embedded in encrypted S-boxes + external encodings
- Runtime key reconstruction from scattered VM state

### 4.2 Constant Decryption — Threshold Cryptography
**Files**: `src/engine/runtime/cipherguard.ts`, `src/vm/emitter.ts`
- **Threshold crypto**: Split keys across VM components (shamir secret sharing)
- **Dynamic key derivation**: Keys from execution state + entropy pool
- **Key rotation**: Rotate decryption keys during execution

### 4.3 Watermarking v2 — Robust + Traitor Tracing
**Files**: `src/protection/watermark.ts`, `src/extract.ts`
- **Robust watermarking**: Survives decompilation, recompilation, optimization
- **Fingerprinting**: Embed build-specific identifiers
- **Traitor tracing**: Trace leaked artifacts to source build

---

## PHASE 5: Metamorphic Engine (Weeks 10-11)

### 5.1 Code Morphing
**Files**: `src/transforms/flatten.ts`, `src/transforms/mba.ts`, new `src/transforms/morph.ts`
- **Instruction substitution**: Replace instructions with equivalent sequences
- **Register renaming**: Randomize variable names per build
- **Code factoring**: Extract common subexpressions into fake functions
- **Peephole morphing**: Apply random "optimizations" that preserve semantics

### 5.2 Polymorphism
**Files**: `src/engine/runtime/cipherguard.ts`, `src/engine/runtime/opencode.ts`
- **Multiple encryption variants**: AES, ChaCha20, custom stream cipher
- **Dynamic cipher selection**: Choose cipher at runtime based on entropy
- **Key diversification**: Derive keys from multiple entropy sources

### 5.3 Build Diversity
**Files**: `src/pipeline.ts`, `src/gen/prng.ts`
- **Build-specific algorithms**: Different obfuscation algorithms per build
- **Randomized parameters**: All numeric parameters randomized
- **No build fingerprints**: No two builds share structural patterns

---

## PHASE 6: Advanced Dataflow Obfuscation (Weeks 12-13)

### 6.1 Dataflow Obfuscation
**Files**: New `src/transforms/dataflow.ts`, `src/transforms/flatten.ts`
- **SSA transformation**: Convert to SSA form for analysis resistance
- **Array flattening**: Multi-dimensional arrays → 1D + index math
- **Data structure splitting**: Split tables across multiple locations
- **Encoding tables**: Lookup tables instead of direct computation

### 6.2 Code Layout Obfuscation
**Files**: `src/transforms/flatten.ts`, new `src/transforms/layout.ts`
- **Function splitting**: Split functions into multiple parts
- **Function merging**: Merge unrelated functions
- **Code transposition**: Reorder instructions with control flow fixes
- **Padding injection**: Insert NOPs and junk between real instructions

### 6.3 Compiler Optimization Resistance
**Files**: `src/transforms/mba.ts`, `src/transforms/opaque.ts`
- **Anti-DCE**: All variables have apparent uses
- **Anti-constant-folding**: Expressions look non-constant
- **Anti-inlining**: Functions appear too complex to inline
- **Anti-vectorization**: Break vectorization patterns

---

## PHASE 7: Advanced Anti-Tamper (Weeks 14-15)

### 7.1 Self-Checksumming
**Files**: `src/engine/runtime/integrity.ts`, `src/vm/emitter.ts`
- **Handler checksums**: Verify handler code integrity at startup
- **Per-instruction checksums**: Rolling checksums during execution
- **Control flow integrity**: Verify call graph matches expected graph

### 7.2 Anti-Patching
**Files**: `src/vm/emitter.ts`, `src/protection/antitamper.ts`
- **Code signing**: Sign handler code, verify signatures at runtime
- **Runtime code signing**: Re-sign handlers after self-modification
- **Anti-ROP**: Stack canaries, shadow stacks, CFI

### 7.3 Anti-Rollback
**Files**: `src/engine/runtime/integrity.ts`
- **Version binding**: Bind artifact to specific NEVAHEX version
- **Replay protection**: Nonce-based execution tracking

---

## 5. Test Fixes (Immediate — Unblock CI)

| Test | Fix |
|------|-----|
| `tests/phase5.test.ts:94` | Update regex to match `deltaSa*cmVar` |
| `tests/unit.test.ts:157` | Replace cosine similarity with Kendall tau |
| `tests/phase3.test.ts` | Fix superoperator round-trip |
| `tests/phase4.test.ts` | Fix fused dispatch self-check |
| `tests/phase6.test.ts` | Fix unpack/table.concat/byte primitive |
| `tests/phase7.test.ts` | Fix universal builds / integrity inventory |
| `tests/phase8.test.ts` | Fix mm-traps setmetatable count |
| `tests/unit.test.ts:157` | Replace cosine similarity with Kendall tau |

---

## 6. Acceptance Criteria

| Metric | Target |
|--------|--------|
| `npm test` | **0 failures** (95/95 pass) |
| `protect({source, tier:'strict'})` | Returns valid Lua, no throw |
| Default hardening | All transforms on without flags |
| Build diversity | 100 builds → 100 unique dispatchOrders |
| Runtime overhead | <10x original execution |
| Resistance | LuraphDeobfuscator, LuaHunt, IronBrew2, PSU, Prometheus all fail |

---

## 6. Validation Commands

```bash
# 1. Build must pass
npm run build

# 2. All tests pass
npm test

# 3. End-to-end works
node -e "
const { protect } = require('./dist/pipeline.js');
const r = protect({ source: 'return 1+1', tier: 'strict', keyless: true, superops: true, mmTraps: true, antiEmulation: true });
console.log('OK:', r.lua.length, 'chars');
"

# 3. Build diversity test
node -e "
const { protect } = require('./dist/pipeline.js');
const hashes = new Set();
for (let i=0; i<100; i++) {
  const r = protect({ source: 'local x=1 return x', tier: 'strict' });
  hashes.add(require('crypto').createHash('sha256').update(r.lua).digest('hex').slice(0,16));
}
console.log('Unique builds:', hashes.size, '/ 100');
"
```

---

## 6. Rollback Plan

Each fix is isolated:
- Dispatch check: 6-line change in `dispatch-check.ts`
- Test updates: Single-line regex/metric changes
- Budget: Single constant change in `localbudget.ts`
- Defaults: 6 boolean inversions in `pipeline.ts`
- Phase 1-7: Each phase is additive and independently testable

---

## 7. Questions for Alignment

1. **Budget increase to 200** — acceptable, or optimize local usage?
2. **Kendall tau metric** — acceptable, or prefer Spearman?
3. **Default anti-emulation** — enable for all non-luau targets?
4. **Superops default-on** — acceptable performance overhead?
5. **White-box AES** — acceptable binary size increase (~2KB)?
6. **VM-in-VM** — acceptable 2-3x runtime overhead for max strength?

---

## Next Steps

1. **Immediate**: Fix 5 critical bugs (Phase 0) → unblock CI
2. **Week 2-3**: Phase 1 transform hardening
3. **Week 4-5**: Phase 2 VM hardening  
4. **Week 6-7**: Phase 3 anti-analysis
5. **Week 8-9**: Phase 4 white-box crypto
6. **Week 10-11**: Phase 5 metamorphic engine
7. **Week 12-13**: Phase 6 dataflow obfuscation
8. **Week 14-15**: Phase 7 advanced anti-tamper
9. **Week 16**: Full validation, performance tuning, documentation