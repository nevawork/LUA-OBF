# NEVAHEX Ultimate Obfuscation Plan — Surpassing Luraph v15

## Executive Summary

NEVAHEX v2.1 (~8K LOC) already implements advanced VM-based obfuscation with:
- Custom VM (55 logical opcodes) with physical permutation
- Rolling-key opcode encoding (opE) + keyed instruction records
- Superoperator fusion (Phase 4, operand-free class)
- Corrected MBA+ algebra (spec item 8)
- Multi-layer control-flow flattening with variable decoys
- Environmental keying (hardened derive-not-compare)
- 9-probe anti-emulation + ciphertext integrity (Phase 5)
- Keyless schedule (W1.2) + metamethod traps (W1.3)
- Range-tree dispatch (O(log n)) + handler variant pools + MBA decoy arms
- Triple-VM boundary seals + watermarking

**Gap Analysis vs State of the Art:**

| Technique | Luraph v15 | IronBrew 2 | LOKI (Academic) | NEVAHEX v2.1 | **Gap** |
|-----------|-----------|------------|-----------------|--------------|---------|
| Handler variants per opcode | ~50 (mutations) | 35-50 | 510 handlers × 3-5 semantics | ~4 | **10-100×** |
| Mega superoperators (60-80 insns) | Yes (implicit) | Yes (120 default) | Recursion bound 3-12 | No (only 2-8) | **Missing** |
| MBA database | Custom | Mutation-based | 843,467 precomputed (depth 9) | Hand-written rules | **1000×** |
| SMT-resistant key encoding | Unknown | No | Factorization + partial point functions | No | **Missing** |
| Program synthesis resistance | Unknown | No | 19% success (vs 67% Tigress) | No | **Missing** |
| Multi-layer VM (deserial + real) | Yes (2 VMs) | Single VM | Direct-threaded (inlined dispatch) | Single VM (layered opt) | **Missing** |
| Register allocation obfuscation | Yes | Yes | Yes (VM-level) | No | **Missing** |
| Constant type shuffling | Yes | Yes | No | No | **Missing** |
| Instruction mutation (reg shuffle) | Yes | Yes | Yes | No | **Missing** |
| Bytecode compression | Unknown | LZW | No | No | **Missing** |
| Anti-LuaHunt (gadget testing) | Implicit | No | No | No | **Missing** |
| Luau bytecode virtualization | Yes | No (5.1 only) | N/A (C++) | Partial | **Partial** |

---

## Threat Model: What We Must Defeat

### 1. LuaHunt (Interpreter Semantics Testing)
- **Technique**: Compiles "LuaGadgets" (minimal Lua ops) to target bytecode format, mutates unknown opcodes, runs in custom interpreter, observes output
- **Speed**: Recovers all opcode semantics in ~90 seconds
- **Defense**: Break the assumptions — no stable opcode→semantics mapping, no observable deterministic outputs, polymorphic handlers

### 2. SMT-Based MBA Deobfuscation (Z3, Bitwuzla, MathSAT5)
- **Technique**: Symbolic execution + SMT solving to simplify MBA expressions
- **Strength**: Linear arithmetic + bit-vectors + quantifier-free strings are key
- **Defense**: Factorization-based encodings (no partial solutions), partial point functions (infinite equivalence classes), 5000+ unique MBAs

### 3. Program Synthesis (Syntia, Xyntia, QSynth)
- **Technique**: Treat handlers as black boxes, learn I/O mappings, synthesize equivalent code
- **Defense**: Maximize handler diversity (5000+ unique), multi-semantic handlers (3-5 core ops per handler), path explosion

### 4. Symbolic Execution + Taint Analysis
- **Technique**: Track symbolic values through handlers, simplify expressions
- **Defense**: Path explosion predicates, opaque predicates with MBA guards, non-linear keystreams

### 5. Dynamic Analysis / Emulation
- **Technique**: Run in instrumented VM, dump decrypted bytecode at dispatch
- **Defense**: Anti-emulation (9 probes), environmental keying, ciphertext integrity, keyless schedule

---

## Phase 1: Handler Explosion & Mutation System (Priority: CRITICAL)

### 1.1 Mutation Engine (IronBrew-style, but stronger)
**Target**: 50-100 variants per logical opcode (vs current ~4)

```typescript
// src/engine/vm/mutation-engine.ts (NEW)
interface MutationSpec {
  logicalOp: Op;
  variants: HandlerVariant[];  // 50-100 per op
  selected: number;             // which variant used at each site
}

interface HandlerVariant {
  body: string[];               // Lua code lines
  locals: string[];             // local declarations (hoisted)
  reads: RegSet;                // registers read
  writes: RegSet;               // registers written
  effects: SideEffect[];        // stack, env, upvalue changes
}
```

**Implementation**:
- Generate variants at build time via stochastic rewriting
- Each variant: different local names, instruction ordering, MBA-scrambled arithmetic, dead code insertion
- Semantic equivalence verified via symbolic execution (offline, during dev)
- Per-instruction-site variant selection (not per-opcode) → maximum diversity

### 1.2 Register Allocation Obfuscation
**Target**: Destroy register→variable mapping

- Randomize register allocation per function prototype
- Insert register-to-register moves (semantic NOPs)
- Use stack slots as "virtual registers" (spill/fill randomly)
- Split live ranges across non-contiguous registers

### 1.3 Constant Pool Shuffling & Type Confusion
**Target**: Break constant indexing assumptions

- Shuffle constant table order per prototype
- Encode constants as different types (number→string→table length→MBA)
- Split constants across multiple tables (per-proto + global)
- Encrypt constant pool with per-proto keys (already partially done)

---

## Phase 2: Mega Superoperators & Deep Fusion (Priority: CRITICAL)

### 2.1 Mega Superoperators (60-80 instructions)
**Current**: Mini only (2-8 instructions, operand-free class)
**Target**: Mega (60-80) + Mini (5-15) + operand-bearing support

```typescript
// Extend src/engine/vm/superops.ts
interface SuperOpSpec {
  id: number;                    // logical fused ID
  members: Instruction[];        // full instructions (with operands)
  operandMap: Map<number, Local>; // operand → local mapping
  entryGuards: OpaquePredicate[]; // entry validation
}

// Generation: scan for sequences without control-flow boundaries
// Fold: replace sequence with single fused opcode + operand locals
// Handler: concatenates all member bodies, hoists locals, adds MBA guards
```

### 2.2 Recursive Superoperator Nesting (LOKI-style)
- Superoperators can contain other superoperators (recursion bound 3-12)
- Creates hierarchical fusion: mega → mini → base
- Explodes static analysis complexity exponentially

### 2.3 Cross-Function Superoperators
- Fuse across closure boundaries where safe
- Requires upvalue analysis to ensure no escape

---

## Phase 3: SMT-Resistant MBA 2.0 (Priority: CRITICAL)

### 3.1 Precomputed MBA Database (LOKI-inspired)
**Current**: Hand-written rewrite rules (~20 patterns)
**Target**: 800K+ precomputed MBAs across 48 equivalence classes

```typescript
// src/transforms/mba-database.ts (NEW)
// Precompute offline, ship as compressed data
// Runtime: select random MBA from equivalence class for target semantics
// Each class: ~17,500 entries, depth up to 9
// Recursive rewriting bound 20-30 at build time
```

### 3.2 Factorization-Based Key Encoding (LOKI)
```lua
-- Instead of: if (key == SECRET) then ...
-- Use: local n = SEMI_PRIME; if (n % key == 0) then ...
-- SMT solvers have NO partial solutions for factorization → exhaustive search
```

### 3.3 Partial Point Functions (LOKI)
- Synthesize arbitrary functions f(k) where f(target)=1, f(other)=arbitrary
- No predefined structure → defeats pattern matching
- Each handler gets 3-5 core semantics selectable via key

### 3.4 MBA Integration Points
- Handler bodies (arithmetic ops)
- Transition values in control-flow flattening
- Opcode encoding (opE rolling key)
- Constant encryption keys
- Integrity check salts
- Anti-emulation thresholds

---

## Phase 4: Multi-Layer VM Architecture (Priority: HIGH)

### 4.1 Deserialization VM (Luraph-style)
**Current**: Single VM with optional `--layered` (Triple-VM contracts only)
**Target**: Two distinct VMs — Deserializer + Real VM

```
Layer 1 (Deserialization VM):
  - Decrypts blob → produces instruction stream for Layer 2
  - Enforces anti-tamper (ciphertext integrity)
  - Environmental keying derivation
  - Keyless schedule reconstruction
  - Outputs: proto tree, constants, watermark

Layer 2 (Real VM):
  - Executes fused superoperators
  - Range-tree dispatch with handler variants
  - Integrity ticks + watermark carriers
  - Anti-emulation probes
```

**Key Insight**: Deserializer output structure = Real VM input structure → symmetry for verification, but Deserializer bytecode ≠ Real VM bytecode

### 4.2 Direct-Threaded Dispatch (LOKI)
**Current**: Range-tree dispatch (centralized if-else chain)
**Target**: Each handler inlines the dispatch to next handler

```lua
-- Instead of: while true do op=decode(); if op==X then ... end end
-- Each handler ends with: op=decode(); if op<=bound then handlerY() else handlerZ() end
-- Dispatch code replicated in every handler → no central loop to find
-- Trade: code size ↑ 30-40%, but analysis difficulty ↑ exponentially
```

### 4.3 VM Exit / Re-entry via Metamethods (Luraph)
- Closure calls return metadata, not nested VM
- `__mod` / `__add` on tables triggers hidden VM dispatch
- Multiple entry points to VM (not single run() function)

---

## Phase 5: Anti-Deobfuscation Hardening (Priority: HIGH)

### 5.1 Anti-LuaHunt (Break Interpreter Semantics Testing)
LuaHunt assumes:
1. Stable opcode→semantics mapping
2. Deterministic observable outputs
3. Gadgets can be compiled to target format

**Countermeasures**:
- **Polymorphic opcode semantics**: Same physical opcode = different semantics based on context (pid, pc, rk, environmental state)
- **Non-deterministic outputs**: Integrity ticks modify constant decryption stream (CVW cross-coupling already does this)
- **Gadget detection**: Anti-emulation probes detect LuaGadget-like execution patterns (small instruction counts, simple ops)
- **Format mutation**: Bytecode format changes per build (field keys, record layout, framing)

### 5.2 Anti-SMT (Factorization + Partial Points)
- Embed factorization checks in handler entry guards
- Use partial point functions for handler selection
- No two builds share MBA structures (infinite equivalence classes)

### 5.3 Anti-Program Synthesis
- 5000+ unique handler bodies (vs LOKI's 510)
- Each handler: 3-5 selectable core semantics
- Path explosion: opaque predicates with 100+ MBA-guarded branches
- Dynamic handler synthesis per build (not fixed set)

### 5.4 Anti-Dynamic-Analysis
- **Timing variance**: Randomize instruction scheduling (already partially done)
- **Memory layout randomization**: Heap spray decoys, fake constant pools
- **Self-modifying code**: Handlers patch their own code at runtime (Lua 5.1: debug.setfenv / metatable tricks)
- **Environmental entropy pool**: Mix os.clock, memory stats, GC counts into keystream

---

## Phase 6: Luau Bytecode Virtualization (Priority: HIGH)

### 6.1 Full Luau VM Support
**Current**: Partial (target="luau" disables some features)
**Target**: Native Luau bytecode virtualization

- Luau instruction set (different from Lua 5.1: OP_GETVARARGS, OP_GETIMPORT, OP_FASTCALL, etc.)
- Luau register model (256 registers, no stack)
- Luau constant types (VUSERDATA, VTHREAD, VPROTO)
- Luau closure/upvalue representation

### 6.2 Cross-Platform Single Artifact
- Single protected file runs on Lua 5.1, LuaJIT, Luau
- VM detects platform at runtime, selects dispatch table
- Shared constant pool format (encrypted)

---

## Phase 7: Advanced Control-Flow & Data-Flow (Priority: MEDIUM)

### 7.1 Path Explosion Opaque Predicates (LOKI)
```lua
-- Generate 100+ MBA-guarded branches per function
-- Each branch: always-true/false but SMT cannot prove
-- Symbolic execution explores 2^100 paths → timeout
```

### 7.2 Data-Flow Obfuscation
- Split variables across multiple registers (SSA-like)
- Encode data dependencies as control dependencies
- Use stack as encrypted communication channel

### 7.3 Control-Flow Graph Flattening 2.0
- Multi-layer state machines (already done)
- Add: irreducible loops, overlapping regions, opaque transitions
- Integrate with superoperators (fused regions = single CFG node)

---

## Phase 8: Build-Time Verification & Testing (Priority: MEDIUM)

### 8.1 Automated Deobfuscation Testing
```typescript
// tests/redteam/*.ts
// Run LuaHunt-style gadget testing against our builds
// Run SMT simplification (Z3) on handler bodies
// Run program synthesis (custom) on handlers
// Assert: >90% handlers resist simplification, synthesis <20% success
```

### 8.2 Formal Verification of MBA
- Verify each MBA rewrite preserves semantics (Z3-backed)
- Property-based testing: random inputs → same output
- Fuzzing: generate random programs, protect, execute, compare

### 8.3 Differential Testing
- Test across Lua 5.1, LuaJIT, Luau
- Test with/without each hardening feature
- Regression suite for all phases

---

## Implementation Roadmap

### Milestone 1: Handler Explosion (Weeks 1-2)
- [ ] Mutation engine with 50 variants/opcode
- [ ] Register allocation obfuscation
- [ ] Constant pool shuffling
- [ ] Integration with pipeline.ts
- [ ] Tests: handler diversity metric > 1000

### Milestone 2: Mega Superoperators (Weeks 2-3)
- [ ] Mega superoperator miner (60-80 insns)
- [ ] Operand-bearing fusion support
- [ ] Recursive nesting (bound 3-12)
- [ ] Handler code generation for fused ops
- [ ] Tests: >50% instructions folded

### Milestone 3: MBA 2.0 Database (Weeks 3-4)
- [ ] Offline MBA generator (843K expressions)
- [ ] Factorization-based key encoding
- [ ] Partial point function synthesizer
- [ ] Integration at all MBA points
- [ ] Tests: Z3 fails to simplify >90% MBAs

### Milestone 4: Dual-VM Architecture (Weeks 4-5)
- [ ] Deserialization VM (microvm-deser.ts)
- [ ] Real VM refactor (handler inlining)
- [ ] Direct-threaded dispatch
- [ ] Cross-VM data contract
- [ ] Tests: LuaHunt fails on test artifacts

### Milestone 5: Anti-Deobfuscation Suite (Weeks 5-6)
- [ ] Anti-LuaHunt measures
- [ ] Path explosion predicates
- [ ] Self-modifying handler code
- [ ] Environmental entropy pool
- [ ] Tests: redteam suite passes

### Milestone 6: Luau Virtualization (Weeks 6-7)
- [ ] Luau opcode set + compiler
- [ ] Luau VM executor
- [ ] Cross-platform artifact format
- [ ] Tests: all 3 targets pass

### Milestone 7: Hardening & Polish (Weeks 7-8)
- [ ] Bytecode compression (LZW)
- [ ] Build-time verification suite
- [ ] Performance optimization
- [ ] Documentation + examples
- [ ] Final redteam evaluation

---

## Validation Criteria (Definition of Done)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Handler variants per opcode | ≥ 50 | `metrics.handlerVariants` |
| Unique MBA expressions per build | ≥ 5,000 | `metrics.uniqueMBAs` |
| Instructions folded into superops | ≥ 50% | `stats.foldedInstructions / stats.totalInstructions` |
| LuaHunt gadget recovery rate | 0% | Redteam test: `luaHuntRecovered == 0` |
| SMT simplification success | < 10% | Redteam test: `z3Simplified / total < 0.1` |
| Program synthesis success | < 20% | Redteam test: `synthSuccess / total < 0.2` |
| Runtime overhead (vs native) | < 5× | Benchmark suite |
| Output size overhead | < 10× | `outputBytes / inputBytes` |
| Cross-target compatibility | 3/3 | Lua 5.1, LuaJIT, Luau |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance regression > 10× | Medium | High | Incremental benchmarks at each milestone; fallback to lighter config |
| Luau compatibility bugs | High | Medium | Dedicated Luau test suite; feature flags per target |
| MBA database size | Low | Medium | Compress with LZW; lazy-load equivalence classes |
| Handler explosion → local budget exceed | Medium | High | Budget checker in emitter (already exists); aggressive hoisting |
| Build time explosion | Medium | Medium | Parallelize variant generation; cache MBA database |

---

## Files to Create / Modify

### New Files
```
src/engine/vm/mutation-engine.ts        # Handler variant generation
src/engine/vm/mba-database.ts           # Precomputed MBA database (compressed)
src/engine/vm/mba-synthesizer.ts        # Factorization + partial point functions
src/engine/vm/microvm-deser.ts          # Deserialization VM
src/engine/vm/superops-mega.ts          # Mega superoperator miner
src/engine/vm/direct-threaded.ts        # Direct-threaded dispatch
src/transforms/register-obfuscation.ts  # Register allocation obfuscation
src/transforms/constant-shuffle.ts      # Constant pool shuffling
src/protection/path-explosion.ts        # Path explosion opaque predicates
src/protection/anti-luahunt.ts          # Anti-LuaHunt measures
src/testing/redteam.ts                  # Automated deobfuscation testing
tests/redteam.test.ts                   # Redteam test suite
```

### Modified Files
```
src/pipeline.ts           # Integrate all new phases
src/engine/vm/superops.ts # Mega + recursive fusion
src/engine/vm/microvm.ts  # Dual-VM opcode sets
src/vm/emitter.ts         # Direct-threaded + dual-VM emit
src/transforms/mba.ts     # MBA 2.0 integration
src/transforms/flatten.ts # Path explosion integration
src/engine/runtime/dispatcher.ts  # Handler variant pools
src/engine/vm/opcodes.ts  # Luau opcode extensions
src/cli.ts                # New flags for new features
```

---

## Configuration Flags (New)

```bash
# Mutation system
--mutations <n>              # variants per opcode (default: 50)
--reg-obfuscate              # register allocation obfuscation
--const-shuffle              # constant pool shuffling

# Superoperators
--mega-superops <n>          # mega superoperators (default: 120)
--mini-superops <n>          # mini superoperators (default: 120)
--superop-nesting <depth>    # recursion bound (default: 5)

# MBA 2.0
--mba-depth <n>              # recursive rewrite bound (default: 20)
--factorization-keys         # enable factorization key encoding
--partial-points             # enable partial point functions

# Dual VM
--dual-vm                    # enable deserializer + real VM
--direct-threaded            # inline dispatch in handlers

# Anti-deobfuscation
--path-explosion <n>         # opaque predicate branches (default: 100)
--anti-luahunt               # enable LuaHunt countermeasures
--self-modifying             # handlers patch themselves

# Luau
--luau-vm                    # native Luau bytecode virtualization
--cross-target               # single artifact for 5.1/JIT/Luau
```

---

## Conclusion

NEVAHEX v2.1 is architecturally sound but lacks the **scale** and **depth** of commercial/academic leaders. This plan closes the gap by:

1. **100× handler diversity** via mutation engine
2. **Mega superoperators** matching IronBrew 2
3. **LOKI-grade MBA** with 800K precomputed expressions + SMT-resistant encodings
4. **Dual-VM architecture** matching Luraph's deserializer + real VM
5. **Direct-threaded dispatch** eliminating central loop
6. **Anti-LuaHunt** breaking the fastest automated deobfuscator
7. **Full Luau virtualization** for Roblox/platform parity

The result: a Lua obfuscator that resists **all known automated attacks** (SMT, symbolic execution, program synthesis, interpreter semantics testing, dynamic analysis) while maintaining <5× runtime overhead and <10× size overhead.

---

## Open Questions for User

1. **Luau priority**: Is full Luau bytecode virtualization required, or is Lua 5.1/LuaJIT the primary target?
2. **Performance budget**: What's the maximum acceptable runtime overhead? (Current: ~2-3×; Plan target: <5×)
3. **Output size budget**: What's the maximum output size multiplier? (Current: ~5-10×; Plan target: <10×)
4. **Build time tolerance**: MBA database generation is offline but large; acceptable build-time increase?
5. **Licensing**: MBA database (843K expressions) — ship as source or compressed binary?
6. **Redteam scope**: Run LuaHunt/Z3/Synthesis against every build, or only CI?