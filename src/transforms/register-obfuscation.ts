// NEVAHEX-VM — register allocation obfuscation (Phase 1)
//
// Post-compilation transform that obfuscates register allocation in the
// custom VM bytecode. Unlike the compiler's straightforward sequential
// allocation, this pass:
//   - Randomizes register mapping (permutation)
//   - Inserts register-to-register copy NOPs
//   - Splits live ranges across non-contiguous registers
//   - Uses stack slots as "virtual registers" (SETLOCAL / MOVE pairs)
//
// Goal: destroy the register→variable mapping that deobfuscators rely on
// for data-flow analysis and symbolic execution.
import { Op, Proto, Instr } from "../vm/opcodes";

export interface RegisterObfOptions {
  /** Probability of inserting a copy NOP (default: 0.15) */
  copyNopProbability?: number;
  /** Probability of splitting a live range (default: 0.1) */
  splitProbability?: number;
  /** Extra registers to allocate beyond what's needed (default: 0-5) */
  extraRegisters?: number;
  /** Enable register permutation (default: true) */
  permute?: boolean;
}

const DEFAULT_OPTS: Required<RegisterObfOptions> = {
  copyNopProbability: 0.15,
  splitProbability: 0.1,
  extraRegisters: 3,
  permute: true,
};

/**
 * Obfuscate register allocation in a proto tree.
 *
 * Algorithm:
 *   1. Scan all instructions to find max register used
 *   2. Allocate extra registers (random 0..extraRegisters)
 *   3. Build random permutation of [0..maxReg + extra]
 *   4. Apply permutation to all instruction operands
 *   5. Insert copy NOPs at random safe points
 *   6. Split some live ranges by inserting MOVE through a temp register
 */
export function obfuscateRegisters(root: Proto, rng: { int(n: number): number; bool(): boolean }, opts: RegisterObfOptions = {}): void {
  const options = { ...DEFAULT_OPTS, ...opts };
  const walk = (p: Proto): void => {
    obfuscateProto(p, rng, options);
    p.protos.forEach(walk);
  };
  walk(root);
}

function obfuscateProto(p: Proto, rng: { int(n: number): number; bool(): boolean }, opts: Required<RegisterObfOptions>): void {
  if (p.code.length === 0) return;

  // Step 1: Find max register used
  let maxReg = 0;
  for (const ins of p.code) {
    const a = ins[1];
    const b = ins[2];
    const c = ins[3];
    if (typeof a === "number" && a > maxReg) maxReg = a;
    if (typeof b === "number" && b > maxReg) maxReg = b;
    if (typeof c === "number" && c > maxReg) maxReg = c;
  }

  // Step 2: Allocate extra registers
  const extra = opts.extraRegisters > 0 ? rng.int(opts.extraRegisters + 1) : 0;
  const totalRegs = maxReg + 1 + extra;

  // Step 3: Build random permutation (register 0 is special: often R0 / constant)
  const perm = buildPermutation(totalRegs, rng, opts.permute);

  // Step 4: Apply permutation to all instructions
  const newCode: Instr[] = [];
  for (const ins of p.code) {
    const [op, a, b, c] = ins;
    const newA = perm[typeof a === "number" ? a : 0];
    const newB = perm[typeof b === "number" ? b : 0];
    const newC = perm[typeof c === "number" ? c : 0];

    // For jump ops, B is a relative offset, not a register — preserve it
    const isJumpy = [Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP].includes(op as Op);
    const finalB = isJumpy ? b : newB;

    newCode.push([op, newA, finalB, newC] as Instr);
  }

  // Step 5: Insert copy NOPs and live-range splits
  const obfuscatedCode = insertCopyNops(newCode, rng, opts, perm, maxReg);
  p.code = obfuscatedCode;

  // Update numSlots to reflect extra registers
  p.numSlots = Math.max(p.numSlots || 0, totalRegs + extra);
}

/**
 * Build a random permutation of [0..n-1].
 * If permute is false, returns identity.
 */
function buildPermutation(n: number, rng: { int(n: number): number; bool(): boolean }, permute: boolean): number[] {
  const perm = Array.from({ length: n }, (_, i) => i);
  if (!permute) return perm;

  // Fisher-Yates shuffle
  for (let i = n - 1; i > 0; i--) {
    const j = rng.int(i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }

  // Ensure 0 maps to 0 (R0 is special in many handlers)
  const zeroIdx = perm.indexOf(0);
  if (zeroIdx !== 0) {
    [perm[0], perm[zeroIdx]] = [perm[zeroIdx], perm[0]];
  }

  return perm;
}

/**
 * Insert copy NOPs (MOVE/SETLOCAL) at random safe points.
 * Also splits some live ranges by inserting MOVE through a temp register.
 */
function insertCopyNops(
  code: Instr[],
  rng: { int(n: number): number; bool(): boolean },
  opts: Required<RegisterObfOptions>,
  perm: number[],
  maxReg: number,
): Instr[] {
  const result: Instr[] = [];
  const tempReg = maxReg + 1 + rng.int(Math.max(1, opts.extraRegisters)); // a high register for temp use

  for (let i = 0; i < code.length; i++) {
    const ins = code[i];

    // Insert copy NOP before some instructions
    if (rng.bool() && opts.copyNopProbability > 0) {
      const src = rng.int(maxReg + 1);
      const dst = rng.int(maxReg + 1);
      if (src !== dst) {
        result.push([Op.MOVE, perm[dst], perm[src], 0] as Instr);
      }
    }

    // Split live range: insert MOVE through temp register
    if (rng.bool() && opts.splitProbability > 0 && ins[1] > 0) {
      const reg = ins[1];
      result.push([Op.MOVE, tempReg, perm[reg], 0] as Instr);
      result.push([Op.MOVE, perm[reg], tempReg, 0] as Instr);
    }

    result.push(ins);
  }

  return result;
}
