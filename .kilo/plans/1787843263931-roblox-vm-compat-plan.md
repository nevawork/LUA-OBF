# Plan: Making Main VM Compatible with Roblox Executors

## Problem Analysis

The main NEVAHEX VM does NOT work in Roblox executors when using `luau_executor` or `roblox_executor` profile due to:

### Root Cause: MBA+ Transform Produces Lua-Incompatible Code

When `mbaPlus` is enabled (default), the MBA transform (`src/transforms/mba.ts`) rewrites expressions using bitwise operations (`&`, `|`, `^`, `~`). However, the parser's lexer does NOT include `|`, `&`, `^`, `~` in the operator list:

```typescript
// src/lang/lexer.ts line 24-27
const OPERATORS = [
  "...", "..", ".", "==", "~=", "<=", ">=", "<", ">", "=", "+", "-", "*", "/",
  "%", "^", "#", "(", ")", "{", "}", "[", "]", ";", ":", ",",
];
```

**Missing operators**: `|`, `&`, `~`

When these operators are emitted in the obfuscated source and then re-parsed, the lexer fails with "unsupported binary operator '|'".

### Why This Only Happens with luau_executor

The `mbaPlus` transform generates code with bitwise operators. With `universal` profile, the same bitwise operators work. The issue appears with `luau_executor` because:

1. Something in the profile-specific code path triggers MBA+ to generate different output
2. Or there's another transformation that only activates for Luau targets

### Secondary Issues

1. **path-explosion.ts** generates `|0` (bitwise OR with zero) which is Lua-incompatible
2. **MBA database** expressions use bitwise operators that may not parse correctly

## What Works Currently

With `luau_executor` profile and these flags disabled:
- `--luau-vm`
- `--no-luau-optimize`
- `--flatten=false`
- `--path-explosion=false`
- `--anti-luahunt=false`
- `--mba=false`

The output generates but is likely functionally broken (MBA+ produces invalid code).

## Proposed Solution

### Option A: Fix the Lexer (Recommended)

Add the missing bitwise operators to the lexer:

```typescript
const OPERATORS = [
  "...", "..", ".", "==", "~=", "<=", ">=", "<", ">", "=", "+", "-", "*", "/",
  "%", "^", "#", "|", "&", "~", "(", ")", "{", "}", "[", "]", ";", ":", ",",
];
```

This allows the parser to correctly tokenize bitwise operations that MBA+ emits.

### Option B: Conditional MBA Disable for Roblox

For `luau_executor` and `roblox_executor` profiles, automatically disable MBA+ since:
1. Bitwise operators in Luau behave differently than Lua 5.1
2. The generated code may not execute correctly even if it parses

### Option C: Emit MBA Using Only Safe Operators

Modify the MBA database and transform to only use operators that work in both Lua and Luau:
- `+`, `-`, `*`, `/`, `%`, `^` (arithmetic)
- `==`, `~=`, `<`, `>`, `<=`, `>=` (comparison)
- Avoid: `|`, `&`, `~` (bitwise) - these have different semantics

## Implementation Plan

### Step 1: Fix the Lexer
- Add `|`, `&`, `~` to `OPERATORS` in `src/lang/lexer.ts`

### Step 2: Add Parser Support for Bitwise Ops
- Update `src/lang/parser.ts` to handle `&`, `|`, `~` in expressions
- Add `Binop` cases for these operators

### Step 3: Verify VM Generates Valid Lua
- Test that the generated output can be re-parsed
- Test that output executes correctly in Lua 5.1

### Step 4: Test in Roblox Environment
- Verify execution in Delta executor
- Check for any remaining runtime issues

## Files to Modify

1. `src/lang/lexer.ts` - Add missing operators
2. `src/lang/parser.ts` - Handle bitwise binary operations
3. Possibly `src/transforms/mba.ts` - Ensure MBA expressions use valid syntax

## Validation

1. Run: `nevahex protect samples/input.lua -o /tmp/test.lua --target luau_executor`
2. Verify: Output can be parsed by Lua parser
3. Verify: Output executes correctly and produces expected output

## Risks

- Adding `&` and `|` operators might conflict with existing syntax (though Lua doesn't use these)
- MBA expressions using bitwise ops might have different semantics in Luau vs Lua 5.1
- Some Roblox executors might not support all bitwise operations

## Open Questions

1. Should bitwise MBA be disabled for Roblox targets entirely?
2. Should we use `bit32` library instead of native bitwise operators?
3. Are there other transformations that produce incompatible code?
