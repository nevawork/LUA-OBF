# Plan: Make NEVAHEX-VM Stronger Than Luraph

## Current State Assessment

NEVAHEX-VM v2.1 "The Abyss" already has a sophisticated multi-layer architecture:
- Custom stack VM with per-build opcode permutation
- Rolling-key opcode encoding (Phase 2)
- Triple-VM layer contracts (Phase 3)
- Superoperator fusion (Phase 4)
- Ciphertext-integrity windows (Phase 5)
- Keyless share schedule (APEX W1.2)
- Metamethod entry traps (APEX W1.3)
- Environmental keying (lua51/luajit/luau profiles)
- Anti-emulation timing probes
- Control-flow flattening with MBA gates
- String encryption
- Opaque junk injection
- Watermark carriers
- Anti-tamper integrity slices

**Current test status**: 2/21 E2E tests passing. 19 fail with runtime type errors in wasmoon (Lua 5.4).

## Target Feature Matrix: Beyond Luraph

To surpass Luraph, NEVAHEX needs:

| Layer | Luraph Baseline | NEVAHEX Target |
|-------|----------------|----------------|
| VM obfuscation | Single VM | Multi-tier VM + virtualization |
| Opcode encoding | Static per-build | Rolling-key + split-shares + MBA |
| Control flow | Flattening | Flattening + bogus CF + virtualization |
| String encryption | AES | AES + runtime derivation + watermark |
| Anti-debug | Basic | Timing + GC + allocation probes |
| Anti-tamper | Checksums | Ciphertext-slice HMACs |
| Junk code | Basic | Semantic-preserving + dead code |
| Function calls | Direct | Indirect + encrypted targets |

## Implementation Plan

### Phase 1: Fix Foundation (Unbreak the Artifact)

**Goal**: All 21 E2E tests pass. Artifact executes correctly under wasmoon.

**Tasks**:
1. Diagnose the 19 E2E failures (Lua runtime errors: pow with string, index nil, add string+number, etc.)
2. Fix emitter bugs in handler bodies (operand access, stack management, type coercions)
3. Fix serializer/deserializer round-trip
4. Fix dispatcher chain assembly for edge cases
5. Re-run E2E until 21/21 green

**Files to touch**: `src/vm/emitter.ts`, `src/engine/runtime/dispatcher.ts`, `src/engine/vm/serializer.ts`, `src/vm/serializer.ts`, `src/engine/vm/compiler.ts`

### Phase 2: Hardened Source Transforms

**Goal**: Strengthen input to the VM compiler so deobfuscation starts from a harder AST.

**Tasks**:
1. **Bogus control flow** (`src/transforms/flatten.ts`):
   - Add unreachable `if false then ... end` blocks with MBA-guarded predicates
   - Insert opaque switches that always take the same branch but use runtime-dependent keys
   - Add decoy try/catch-style patterns (Lua 5.1 `pcall` wrappers that rethrow)

2. **String encryption hardening** (`src/transforms/strings.ts`):
   - Multi-layer: per-string AES key + runtime-derived key
   - Decrypt-on-first-use with self-zeroing buffer
   - Split strings into concatenated shards with reordering

3. **Dead code insertion** (new transform):
   - Create `src/transforms/deadcode.ts`
   - Insert semantically inert but syntactically valid code blocks
   - Use MBA-obfuscated constants that cancel out

4. **Function call obfuscation** (`src/transforms/index.ts`):
   - Indirect calls via encrypted function table
   - Trampoline wrappers with fake parameter validation

### Phase 3: Code Virtualization Layer

**Goal**: Add a virtualization layer where critical code regions are compiled to a custom ISA and executed by a per-build interpreter.

**Tasks**:
1. **Custom ISA design**:
   - 16-20 opcodes covering arithmetic, load/store, control flow
   - Per-build opcode permutation (extends existing `perm` array)
   - Operand obfuscation: split operands across multiple bytes

2. **Virtualizer compiler** (new: `src/engine/vm/virtualizer.ts`):
   - Select virtualization candidates (hot functions, sensitive constants)
   - Compile AST → custom ISA
   - Emit interpreter + encoded bytecode

3. **Interpreter emission** (`src/vm/emitter.ts`):
   - Seal interpreter inside Triple-VM L2 layer
   - Use rolling-key decoding for virtualized instructions
   - Anti-tamper: verify virtualized region hashes before dispatch

4. **Pipelining**: Integrate after `compileChunk` in `pipeline.ts`, before `emitRuntime`

### Phase 4: Anti-Tamper & Anti-Debug Hardening

**Goal**: Make runtime manipulation (patching, tracing, stepping) detectable and self-destructive.

**Tasks**:
1. **Extended anti-emulation** (`src/protection/antiemulation.ts`):
   - Add P4: memory-allocation pattern probe (newtable/repeated concat)
   - Add P5: debug-trap detection (`debug` library absence check)
   - Increase default thresholds and add adaptive calibration

2. **Anti-tamper seals** (`src/protection/antitamper.ts`):
   - Chain blob-slice hashes into a Merkle-style tree
   - Verify root hash at startup; failure triggers silent tier corruption
   - Extend to dispatcher handler bodies (hash each handler text)

3. **Anti-debugger** (new: `src/protection/antidebug.ts`):
   - Check for `debug` library presence
   - Detect `sethook` via hook-depth counting
   - Detect debugger attachment via timing irregularities (reuse anti-emu infrastructure)

4. **Self-modifying code** (emitter enhancement):
   - Encrypt handler bodies in-memory; decrypt on dispatch, re-encrypt after
   - Use XOR with rolling key; key changes every N instructions

### Phase 5: Emitter Hardening

**Goal**: Make the runtime itself harder to analyze.

**Tasks**:
1. **Junk code injection in handlers** (`src/engine/runtime/dispatcher.ts`):
   - Each handler gets 2-3 MBA-obfuscated no-op statements
   - Decoy local variables with misleading names

2. **MBA hardening in arithmetic** (`src/transforms/mba.ts`):
   - Extend MBA to cover all arithmetic ops (currently partial)
   - Add degree-3 polynomials for stronger obfuscation

3. **Opaque predicate strengthening**:
   - Add floating-point opaque predicates (avoid integer-only patterns)
   - Use environment-dependent opaque conditions

### Phase 6: Verification & Tuning

**Goal**: Ensure correctness and measure obfuscation strength.

**Tasks**:
1. Run full E2E suite after each phase
2. Run `npx tsc --noEmit` for type safety
3. Run `node scripts/e2e.cjs` and assert 21/21 pass
4. Profile output size and runtime overhead
5. Document new CLI flags in `src/cli.ts` and README

## CLI Flags to Add

```
--bogus-cf          Enable bogus control flow (Phase 2)
--enc-strings       Multi-layer string encryption (Phase 2)
--deadcode          Insert dead code blocks (Phase 2)
--virt-select       Select functions for virtualization (Phase 3)
--virt-ratio        Max ratio of code to virtualize (Phase 3)
--anti-debug        Enable anti-debugger checks (Phase 4)
--self-modify       Enable self-modifying handler bodies (Phase 4)
--mba-degree        MBA polynomial degree 2 or 3 (default 2)
--junk-density      Junk code density 0.0-1.0 (default 0.12)
```

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Virtualization breaks edge cases | Keep virtualized regions small; verify with E2E |
| Performance degradation | Budget checks; tier-aware defaults |
| False positives in anti-debug | Graceful degradation (abstain rather than crash) |
| Build determinism | All randomness from CSPRNG; deterministic counters |

## Success Criteria

1. `node scripts/e2e.cjs` → 21/21 PASS
2. `npx tsc --noEmit` → clean
3. Artifact size < 2x baseline (with `--bogus-cf --deadcode`)
4. No runtime errors in wasmoon for all test cases
5. Dispatch self-check passes for every build
