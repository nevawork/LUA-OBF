# Plan: Roblox Executor-Specific VM

## Goal
Create a Roblox executor-compatible obfuscation system that works in Delta, Synapse X, Krnl, and Xenon executors.

## Critical Research Findings

### Why Current VM Doesn't Work
1. **Roblox does NOT support bytecode loading** - `loadstring` only accepts SOURCE strings, NOT precompiled bytecode
2. **string.dump is broken** in Roblox - returns a dummy 12-byte string
3. **Executors re-enable loadstring** by injecting a custom compiler, but it still only accepts source

### How Luraph and Other Obfuscators Work in Roblox
1. **Source transformation** - NOT bytecode VM
2. Obfuscate the Lua SOURCE code
3. Use `loadstring` to compile the obfuscated source
4. The "VM" is implemented as pure Lua functions that interpret data structures

## Architecture Decision

### Option A: Source-Only Obfuscation (Recommended)
- Obfuscate source code using transformations
- Use `loadstring` to compile
- Works in all executors
- Limited obfuscation strength

### Option B: Pure-Lua Bytecode VM
- Implement a Lua interpreter in pure Lua
- Encode program as data structures
- Interpret the program at runtime
- Stronger obfuscation, more complex

## Implementation Steps

### Phase 1: Source Obfuscation Engine
1. Create `src/engine/obfuscator/source-obfuscator.ts`
2. Implement transformations:
   - Identifier renaming
   - String encryption
   - Control flow flattening
   - Dead code injection
   - Constant encoding

### Phase 2: Pure-Lua VM (if needed)
1. Create `src/engine/vm/pure-lua-vm.ts`
2. Implement bytecode interpreter in pure Lua
3. Encode program as encrypted data tables
4. VM interprets the data at runtime

### Phase 3: Integration
1. Add `--target roblox_executor` CLI option
2. Wire obfuscation engine in pipeline
3. Add tests

## Key Files to Create/Modify

### New Files
- `src/engine/obfuscator/source-obfuscator.ts` - Source code obfuscation
- `src/engine/obfuscator/identifier-renamer.ts` - Variable renaming
- `src/engine/obfuscator/string-encoder.ts` - String encryption
- `src/engine/obfuscator/control-flow.ts` - Control flow flattening
- `src/engine/obfuscator/dead-code.ts` - Dead code injection

### Modify
- `src/pipeline.ts` - Route to source obfuscator for roblox_executor target
- `src/cli.ts` - Add --target roblox_executor

## Validation
1. Test in Delta executor
2. Verify "Result: 756" output
3. Compare with Luraph obfuscation strength
