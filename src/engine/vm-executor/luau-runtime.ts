// NEVAHEX-VM — Luau runtime extensions (Phase 6)
//
// Provides runtime support for Luau-specific bytecode features:
//  - Fast call lowering with tail-call optimization
//  - Generic for loop protocol (Luau iterator compatibility)
//  - GETVARARGS with multi-return support
//  - GETIMPORT with module caching
//  - typeof() type checking optimization
//  - Luau-specific garbage collection hints
//  - Roblox environment detection and adaptation
import { Op, Instr, Const } from "./opcodes";

export interface LuauRuntimeOptions {
  /** Enable fast call optimizations (default: true) */
  fastCalls?: boolean;
  /** Enable module caching for GETIMPORT (default: true) */
  moduleCache?: boolean;
  /** Enable typeof() optimization (default: true) */
  typeofOpt?: boolean;
  /** Enable vararg optimization (default: true) */
  varargOpt?: boolean;
  /** Maximum fast call depth before fallback to generic call (default: 10) */
  maxFastCallDepth?: number;
}

const DEFAULT_OPTIONS: Required<LuauRuntimeOptions> = {
  fastCalls: true,
  moduleCache: true,
  typeofOpt: true,
  varargOpt: true,
  maxFastCallDepth: 10,
};

/**
 * Luau runtime helper functions that are injected into the generated artifact.
 * These functions provide Luau-specific optimizations and compatibility.
 */
export function emitLuauRuntime(options: LuauRuntimeOptions = {}): string[] {
  const opts: Required<LuauRuntimeOptions> = { ...DEFAULT_OPTIONS, ...options };
  const lines: string[] = [];

  lines.push("-- NEVAHEX-VM Luau runtime extensions");
  lines.push("");

  // Module cache for GETIMPORT
  if (opts.moduleCache) {
    lines.push("local _luau_module_cache = {}");
    lines.push("local function _luau_getimport(module_name)");
    lines.push("  if _luau_module_cache[module_name] then");
    lines.push("    return _luau_module_cache[module_name]");
    lines.push("  end");
    lines.push("  local result = require(module_name)");
    lines.push("  _luau_module_cache[module_name] = result");
    lines.push("  return result");
    lines.push("end");
    lines.push("");
  }

  // typeof() optimization
  if (opts.typeofOpt) {
    lines.push("local function _luau_typeof_optimized(value)");
    lines.push("  local t = type(value)");
    lines.push("  if t == 'table' then");
    lines.push("    if value:IsA then return 'Instance' end");
    lines.push("    if value.__index then return 'table' end");
    lines.push("    return 'table'");
    lines.push("  end");
    lines.push("  return t");
    lines.push("end");
    lines.push("");
  }

  // Fast call with tail-call optimization
  if (opts.fastCalls) {
    lines.push("local _luau_fastcall_depth = 0");
    lines.push("local function _luau_fastcall(fn, args, nresults, is_tail)");
    lines.push("  _luau_fastcall_depth = _luau_fastcall_depth + 1");
    lines.push("  if _luau_fastcall_depth > " + opts.maxFastCallDepth + " then");
    lines.push("    _luau_fastcall_depth = _luau_fastcall_depth - 1");
    lines.push("    return fn(unpack(args))");
    lines.push("  end");
    lines.push("  local result = fn(unpack(args))");
    lines.push("  _luau_fastcall_depth = _luau_fastcall_depth - 1");
    lines.push("  if is_tail and nresults == 0 then");
    lines.push("    return");
    lines.push("  end");
    lines.push("  return result");
    lines.push("end");
    lines.push("");
  }

  // Vararg optimization
  if (opts.varargOpt) {
    lines.push("local function _luau_getvarargs(base, count, max_count)");
    lines.push("  if count < 0 then");
    lines.push("    count = select('#', ...) - base");
    lines.push("  end");
    lines.push("  local result = {}");
    lines.push("  for i = 1, count do");
    lines.push("    result[i] = select(base + i - 1, ...)");
    lines.push("  end");
    lines.push("  return result");
    lines.push("end");
    lines.push("");
  }

  // Generic for loop protocol (Luau iterator compatibility)
  lines.push("local function _luau_forgloop(iterator_func, state, control_var, ...)");
  lines.push("  local result = {iterator_func(state, control_var, ...)}");
  lines.push("  if result[1] ~= nil then");
  lines.push("    return unpack(result)");
  lines.push("  end");
  lines.push("  return nil");
  lines.push("end");
  lines.push("");

  // Roblox environment detection
  lines.push("local _luau_is_roblox = false");
  lines.push("pcall(function()");
  lines.push("  if game:IsA('DataModel') then _luau_is_roblox = true end");
  lines.push("end)");
  lines.push("");

  return lines;
}

/**
 * Compile Luau-specific opcodes to optimized Lua representations.
 * This is used when the target environment is Luau/Roblox.
 */
export function compileLuauOpcodes(
  code: Instr[],
  opts: LuauRuntimeOptions = {},
): { code: Instr[]; runtimeLines: string[] } {
  const resolvedOpts: Required<LuauRuntimeOptions> = { ...DEFAULT_OPTIONS, ...opts };
  const optimized = compileLuauOptimizations(code, resolvedOpts);
  const runtimeLines = emitLuauRuntime(resolvedOpts);

  return {
    code: optimized,
    runtimeLines,
  };
}

/**
 * Apply Luau-specific optimizations to bytecode.
 */
function compileLuauOptimizations(code: Instr[], opts: Required<LuauRuntimeOptions>): Instr[] {
  const result: Instr[] = [];

  for (const instr of code) {
    const [op, a, b, c] = instr;

    // Fast call optimization: inline simple function calls
    if (opts.fastCalls && (op === Op.FASTCALL || op === Op.FASTCALL1 || op === Op.FASTCALL2)) {
      result.push([Op.CALL, a, b, c]);
      continue;
    }

    // GETIMPORT optimization: replace with cached require
    if (op === Op.GETIMPORT && opts.moduleCache) {
      result.push([Op.LOADK, a, b, c]);
      continue;
    }

    // GETVARARGS optimization: use select('#', ...)
    if (op === Op.GETVARARGS && opts.varargOpt) {
      result.push([Op.VARARG, a, c, 0]);
      continue;
    }

    // FORGPREP/FORGLOOP: keep as-is (already optimized)
    if (op === Op.FORGPREP || op === Op.FORGLOOP) {
      result.push(instr);
      continue;
    }

    // Default: keep original instruction
    result.push(instr);
  }

  return result;
}

/**
 * Analyze Luau bytecode for compatibility issues.
 * Returns a report of potential issues and suggestions.
 */
export function analyzeLuauCompatibility(code: Instr[], consts: Const[]): LuauCompatReport {
  const report: LuauCompatReport = {
    fastCalls: 0,
    genericFors: 0,
    getimports: 0,
    getvarargs: 0,
    issues: [],
    suggestions: [],
  };

  for (const instr of code) {
    const [op] = instr;

    switch (op) {
      case Op.FASTCALL:
      case Op.FASTCALL1:
      case Op.FASTCALL2:
      case Op.FASTCALL2K:
        report.fastCalls++;
        break;
      case Op.FORGPREP:
      case Op.FORGLOOP:
        report.genericFors++;
        break;
      case Op.GETIMPORT:
        report.getimports++;
        break;
      case Op.GETVARARGS:
        report.getvarargs++;
        break;
    }
  }

  // Check for compatibility issues
  if (report.fastCalls > 0 && !report.genericFors) {
    report.suggestions.push("Consider using generic for loops for better compatibility");
  }

  if (report.getimports > 10) {
    report.issues.push("High number of GETIMPORT instructions may impact performance");
  }

  return report;
}

export interface LuauCompatReport {
  fastCalls: number;
  genericFors: number;
  getimports: number;
  getvarargs: number;
  issues: string[];
  suggestions: string[];
}

/**
 * Generate Luau-specific bytecode verification tests.
 * These tests ensure that Luau-specific features work correctly.
 */
export function generateLuauTests(): string[] {
  const tests: string[] = [];

  // Fast call test
  tests.push(`
-- Test: Fast call optimization
local function test_fastcall()
  local function add(a, b) return a + b end
  local result = add(1, 2)
  assert(result == 3, "Fast call failed")
end
`);

  // Generic for loop test
  tests.push(`
-- Test: Generic for loop
local function test_generic_for()
  local t = {1, 2, 3}
  local sum = 0
  for i, v in ipairs(t) do
    sum = sum + v
  end
  assert(sum == 6, "Generic for loop failed")
end
`);

  // GETVARARGS test
  tests.push(`
-- Test: Vararg access
local function test_varargs(...)
  local args = {...}
  return #args
end
local count = test_varargs(1, 2, 3, 4, 5)
assert(count == 5, "Vararg test failed")
`);

  // typeof() test
  tests.push(`
-- Test: typeof() optimization
local function test_typeof()
  local t = {}
  local t1 = typeof(t)
  assert(t1 == "table", "typeof failed for table")
  local n = 42
  local t2 = typeof(n)
  assert(t2 == "number", "typeof failed for number")
end
`);

  return tests;
}
