# Plan: Roblox Executor-Specific VM

## Goal
Create a Roblox executor-specific VM by copying and modifying the main VM to support Delta, Synapse X, Krnl, and Xenon executors while maintaining full obfuscation capabilities.

## Current State
- NEVAHEX has a VM architecture that works on standard Lua but not Roblox executors
- `target: luau` already exists but doesn't work in executors
- Anti-emulation and timing checks are already disabled for `luau` target
- Issue may be deeper in the VM execution model

## Implementation Steps

### Phase 1: Create Executor VM Files
1. Copy `src/engine/vm/` to `src/engine/vm-executor/`
2. Copy `src/engine/runtime/` handlers that need modification
3. Update imports to point to new locations

### Phase 2: Disable Problematic Features
1. **Anti-emulation** - Already disabled for luau, confirm
2. **Debug hooks** - Remove `debug.sethook` checks entirely
3. **Timing checks** - Remove `os.clock` timing comparisons
4. **Entropy pool** - Simplify or disable environmental entropy

### Phase 3: Executor-Specific Adaptations
1. **EnvProfile** - Add `roblox_executor` profile
2. **Global detection** - Check for `game`, `workspace`, `getgenv`
3. **Safe metamethods** - Use only universally supported metamethods
4. **Memory model** - Ensure table sizes are executor-safe

### Phase 4: Integration
1. Add `--target roblox_executor` CLI option
2. Wire up new VM in pipeline.ts
3. Add executor-specific tests

### Phase 5: Testing
1. Test in Delta executor
2. Test in Synapse X
3. Test in Krnl
4. Test in Xenon

## Key Files to Modify

### New Files (copy and edit)
- `src/engine/vm-executor/emitter.ts` - Main artifact generator
- `src/engine/vm-executor/microvm-exec.ts` - Reference interpreter
- `src/engine/runtime-executor/dispatcher.ts` - Dispatch handlers

### Existing Files (add conditions)
- `src/cli.ts` - Add `--target roblox_executor`
- `src/pipeline.ts` - Route to executor VM
- `src/protection/envkeying.ts` - Add executor profile

## Risks
1. VM architecture may fundamentally not work in executors due to sandboxing
2. May need to fall back to source-only obfuscation
3. Each executor has unique quirks that may need individual handling

## Validation
- Run obfuscated script in Delta
- Verify "Result: 756" output
- Test with full obfuscation features enabled
