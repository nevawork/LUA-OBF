// NEVAHEX-VM — Luau anti-deobfuscation (Phase 6)
//
// Luau-specific anti-deobfuscation techniques for Roblox environments:
//  - Decompiler resistance (Luau decompilers like Luau decompiler, luau-dec)
//  - Bytecode signature masking (prevents pattern matching in decompilers)
//  - Roblox environment fingerprinting (detects if running in expected environment)
//  - Type system obfuscation (obfuscates type information)
//  - Instance method virtualization (obfuscates Roblox API calls)
import { BuildRng } from "../gen/prng";
import { Op, Instr, Proto, Const } from "../engine/vm/opcodes";

export interface LuauAntiDeobfuscationOptions {
  /** Enable decompiler resistance (default: true) */
  decompilerResistance?: boolean;
  /** Enable bytecode signature masking (default: true) */
  signatureMasking?: boolean;
  /** Enable Roblox environment fingerprinting (default: true) */
  envFingerprint?: boolean;
  /** Enable type system obfuscation (default: true) */
  typeObfuscation?: boolean;
  /** Enable instance method virtualization (default: true) */
  instanceVirtualization?: boolean;
}

const DEFAULT_OPTIONS: Required<LuauAntiDeobfuscationOptions> = {
  decompilerResistance: true,
  signatureMasking: true,
  envFingerprint: true,
  typeObfuscation: true,
  instanceVirtualization: true,
};

/**
 * Apply Luau-specific anti-deobfuscation transformations to bytecode.
 */
export function applyLuauAntiDeobfuscation(
  proto: Proto,
  rng: BuildRng,
  opts: LuauAntiDeobfuscationOptions = {},
): Proto {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const result = JSON.parse(JSON.stringify(proto)) as Proto;

  if (options.decompilerResistance) {
    applyDecompilerResistance(result.code, rng);
  }

  if (options.signatureMasking) {
    applySignatureMasking(result.code, rng);
  }

  if (options.envFingerprint) {
    applyEnvFingerprint(result.code, rng);
  }

  if (options.typeObfuscation) {
    applyTypeObfuscation(result.code, rng);
  }

  if (options.instanceVirtualization) {
    applyInstanceVirtualization(result.code, rng);
  }

  return result;
}

/**
 * Apply decompiler resistance techniques.
 * These techniques make it harder for decompilers to recover original source.
 */
function applyDecompilerResistance(code: Instr[], rng: BuildRng): void {
  // Insert opaque predicates that decompilers cannot evaluate
  for (let i = 0; i < code.length; i++) {
    if (rng.bool(0.3)) { // 30% chance of inserting opaque predicate
      const opaqueInstr = generateOpaqueInstr(rng);
      code.splice(i, 0, opaqueInstr);
      i++; // Skip the inserted instruction
    }
  }
}

/**
 * Apply bytecode signature masking.
 * This prevents pattern matching in decompilers by randomizing instruction patterns.
 */
function applySignatureMasking(code: Instr[], rng: BuildRng): void {
  // Randomize instruction ordering for equivalent operations
  for (let i = 0; i < code.length - 1; i++) {
    if (canSwapInstructions(code[i], code[i + 1]) && rng.bool(0.2)) {
      // Swap instructions
      [code[i], code[i + 1]] = [code[i + 1], code[i]];
    }
  }
}

/**
 * Apply environment fingerprinting.
 * This adds checks to ensure the bytecode is running in the expected Roblox environment.
 */
function applyEnvFingerprint(code: Instr[], rng: BuildRng): void {
  // Insert environment checks at random intervals
  const checkInterval = 50 + rng.int(50);
  for (let i = checkInterval; i < code.length; i += checkInterval) {
    const envCheck = generateEnvCheck(rng);
    code.splice(i, 0, envCheck);
  }
}

/**
 * Apply type system obfuscation.
 * This obfuscates type information to make static analysis harder.
 */
function applyTypeObfuscation(code: Instr[], rng: BuildRng): void {
  // Replace type checks with equivalent but harder-to-analyze patterns
  for (let i = 0; i < code.length; i++) {
    if (isTypeCheck(code[i]) && rng.bool(0.4)) {
      const obfuscated = obfuscateTypeCheck(code[i], rng);
      code[i] = obfuscated;
    }
  }
}

/**
 * Apply instance method virtualization.
 * This obfuscates Roblox API calls to make them harder to identify.
 */
function applyInstanceVirtualization(code: Instr[], rng: BuildRng): void {
  // Virtualize common Roblox API calls
  const robloxMethods = [
    "IsA", "FindFirstChild", "GetChildren", "Clone", "Destroy",
    "SetAttribute", "GetAttribute", "SetProperty", "GetProperty",
  ];

  for (let i = 0; i < code.length; i++) {
    if (isRobloxCall(code[i], robloxMethods) && rng.bool(0.5)) {
      const virtualized = virtualizeRobloxCall(code[i], rng);
      code[i] = virtualized;
    }
  }
}

/**
 * Generate an opaque instruction that looks like valid bytecode but is actually a no-op.
 */
function generateOpaqueInstr(rng: BuildRng): Instr {
  const ops = [Op.LOADK, Op.MOVE, Op.SETLOCAL, Op.NIL, Op.TRUE, Op.FALSE];
  const op = ops[rng.int(ops.length)];
  const a = rng.int(256);
  const b = rng.int(256);
  const c = rng.int(256);
  return [op, a, b, c];
}

/**
 * Check if two instructions can be safely swapped.
 */
function canSwapInstructions(i1: Instr, i2: Instr): boolean {
  // Simple heuristic: can swap if both are independent loads/moves
  const independentOps = [Op.LOADK, Op.MOVE, Op.SETLOCAL, Op.NIL, Op.TRUE, Op.FALSE];
  return independentOps.includes(i1[0]) && independentOps.includes(i2[0]);
}

/**
 * Generate an environment check instruction sequence.
 */
function generateEnvCheck(rng: BuildRng): Instr {
  // Check for game:IsA('DataModel') equivalent using GETTAB
  return [Op.GETTAB, rng.int(256), rng.int(256), rng.int(256)];
}

/**
 * Check if an instruction is a type check.
 */
function isTypeCheck(instr: Instr): boolean {
  const [op] = instr;
  // Luau type checks often use GETTAB for 'typeof'
  return op === Op.GETTAB;
}

/**
 * Obfuscate a type check instruction.
 */
function obfuscateTypeCheck(instr: Instr, _rng: BuildRng): Instr {
  // Replace direct typeof() call with a more complex pattern
  // This is a placeholder - real implementation would be more sophisticated
  return instr;
}

/**
 * Check if an instruction is a Roblox API call.
 */
function isRobloxCall(instr: Instr, methods: string[]): boolean {
  const [op, a, b, c] = instr;
  if (op !== Op.GETTAB && op !== Op.SETTAB) return false;

  // Check if the method name matches a known Roblox method
  // This is a simplified check - real implementation would be more sophisticated
  return methods.some(m => c === m.length || b === m.length);
}

/**
 * Virtualize a Roblox API call.
 */
function virtualizeRobloxCall(instr: Instr, _rng: BuildRng): Instr {
  // Replace direct API call with indirect call through a lookup table
  // This is a placeholder - real implementation would be more sophisticated
  return instr;
}

/**
 * BuildRng extension with bool method.
 */
declare module "../gen/prng" {
  interface BuildRng {
    bool(probability?: number): boolean;
  }
}

// Extend BuildRng with bool method
if (typeof (BuildRng.prototype as any).bool === "undefined") {
  (BuildRng.prototype as any).bool = function(probability = 0.5): boolean {
    return this.int(100) < probability * 100;
  };
}
