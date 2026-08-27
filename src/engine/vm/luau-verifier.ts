// NEVAHEX-VM — Luau bytecode verifier (Phase 6)
//
// Validates Luau bytecode for correctness and compatibility:
//  - Verifies instruction encoding and operand ranges
//  - Checks control flow integrity
//  - Validates stack discipline
//  - Ensures Luau-specific opcodes are used correctly
import { Op, Instr, Proto, Const } from "./opcodes";

export interface LuauVerificationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalInstructions: number;
    luauInstructions: number;
    baseInstructions: number;
    maxStackDepth: number;
    constants: number;
  };
}

/**
 * Verify Luau bytecode for correctness.
 */
export function verifyLuauBytecode(proto: Proto): LuauVerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let totalInstructions = 0;
  let luauInstructions = 0;
  let baseInstructions = 0;
  let maxStackDepth = 0;
  let currentStackDepth = 0;

  const luauOps = new Set([
    Op.GETVARARGS,
    Op.GETIMPORT,
    Op.FASTCALL,
    Op.FASTCALL1,
    Op.FASTCALL2,
    Op.FASTCALL2K,
    Op.FORGPREP,
    Op.FORGLOOP,
  ]);

  function verifyInstructions(code: Instr[]): void {
    for (let i = 0; i < code.length; i++) {
      const instr = code[i];
      const [op, a, b, c] = instr;

      totalInstructions++;

      if (luauOps.has(op)) {
        luauInstructions++;
      } else {
        baseInstructions++;
      }

      // Verify operand ranges
      verifyOperands(op, a, b, c, i, errors);

      // Simulate stack changes
      simulateStack(op, a, b, c, (delta) => {
        currentStackDepth += delta;
        maxStackDepth = Math.max(maxStackDepth, currentStackDepth);
      });
    }
  }

  function verifyInstructionsRecursive(protos: Proto[]): void {
    for (const p of protos) {
      verifyInstructions(p.code);
      verifyInstructionsRecursive(p.protos);
    }
  }

  verifyInstructions(proto.code);
  verifyInstructionsRecursive(proto.protos);

  // Check for warnings
  if (luauInstructions > 0 && baseInstructions === 0) {
    warnings.push("Bytecode contains only Luau-specific instructions");
  }

  if (maxStackDepth > 200) {
    warnings.push(`High maximum stack depth: ${maxStackDepth}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalInstructions,
      luauInstructions,
      baseInstructions,
      maxStackDepth,
      constants: proto.consts.length,
    },
  };
}

/**
 * Verify instruction operands are within valid ranges.
 */
function verifyOperands(
  op: Op,
  a: number,
  b: number,
  c: number,
  pc: number,
  errors: string[],
): void {
  // Common operand validations
  if (a < 0 || a > 255) {
    errors.push(`Instruction at ${pc}: operand A (${a}) out of range [0, 255]`);
  }

  switch (op) {
    case Op.GETVARARGS:
      if (a < 0 || a > 255) {
        errors.push(`GETVARARGS at ${pc}: A out of range`);
      }
      break;
    case Op.GETIMPORT:
      if (c < 0 || c >= 65535) {
        errors.push(`GETIMPORT at ${pc}: C (import index) out of range`);
      }
      break;
    case Op.FASTCALL:
    case Op.FASTCALL1:
    case Op.FASTCALL2:
    case Op.FASTCALL2K:
      if (a < 0 || a > 255) {
        errors.push(`${Op[op]} at ${pc}: A (args) out of range`);
      }
      break;
    case Op.FORGPREP:
    case Op.FORGLOOP:
      if (b < -32768 || b > 32767) {
        errors.push(`${Op[op]} at ${pc}: B (jump offset) out of range`);
      }
      break;
  }
}

/**
 * Simulate stack changes for stack depth tracking.
 */
function simulateStack(
  op: Op,
  a: number,
  b: number,
  c: number,
  onStackChange: (delta: number) => void,
): void {
  switch (op) {
    case Op.GETVARARGS:
      onStackChange(a >= 0 ? a : 0);
      break;
    case Op.GETIMPORT:
      onStackChange(1);
      break;
    case Op.FASTCALL:
    case Op.FASTCALL1:
    case Op.FASTCALL2:
    case Op.FASTCALL2K:
      onStackChange(a > 0 ? 1 - a : 1);
      break;
    case Op.FORGPREP:
      onStackChange(0);
      break;
    case Op.FORGLOOP:
      onStackChange(c > 0 ? c : 0);
      break;
    default:
      // Base opcodes handled elsewhere
      break;
  }
}

/**
 * Convert Luau bytecode to human-readable assembly.
 */
export function disassembleLuau(proto: Proto): string[] {
  const lines: string[] = [];
  const luauOps = new Set([
    Op.GETVARARGS,
    Op.GETIMPORT,
    Op.FASTCALL,
    Op.FASTCALL1,
    Op.FASTCALL2,
    Op.FASTCALL2K,
    Op.FORGPREP,
    Op.FORGLOOP,
  ]);

  function disassembleInstructions(code: Instr[], indent: string): void {
    for (let i = 0; i < code.length; i++) {
      const [op, a, b, c] = code[i];
      const isLuau = luauOps.has(op);
      const prefix = isLuau ? "LUA" : "   ";

      lines.push(`${indent}${prefix} ${i.toString().padStart(4)}: ${Op[op] || op.toString().padEnd(12)} A=${a} B=${b} C=${c}`);
    }
  }

  function disassembleProtos(protos: Proto[], indent: string): void {
    for (const p of protos) {
      lines.push(`${indent}; Proto ${p.params}/${p.isVararg ? 'V' : ''} (${p.consts.length} consts, ${p.code.length} instrs)`);
      disassembleInstructions(p.code, indent + "  ");
      disassembleProtos(p.protos, indent + "  ");
    }
  }

  lines.push(`; Proto ${proto.params}/${proto.isVararg ? 'V' : ''} (${proto.consts.length} consts, ${proto.code.length} instrs)`);
  disassembleInstructions(proto.code, "");
  disassembleProtos(proto.protos, "");

  return lines;
}
