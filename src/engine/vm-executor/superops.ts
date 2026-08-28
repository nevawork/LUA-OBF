// NEVAHEX-VM — superoperator fusion pass (Phase 4, IronBrew2-style)
//
// Mines straight-line windows made ONLY of operand-free opcodes and fuses
// each window into a single synthetic opcode. Fused handlers concatenate the
// member bodies verbatim (safe: the member set below shares no locals outside
// `do…end` scopes and reads no instruction operands) and end with a pc-skip
// over the NOPed member slots.
//
// Why operand-free only (for now): bodies that read A/B/C would need
// per-instance operand literals baked into specialized handler text — a
// larger specialization layer that lands after runtime differential testing.
// The machinery (ids, tree integration, skip semantics, dispatch checks) is
// identical for both classes.
//
// Window validity rules:
//   • every member ∈ ZERO_OPERAND_OPS (no A/B/C reads)
//   • no member is a control transfer ⇒ no terminal/jump compensation needed
//   • no interior jump TARGETS inside (start, end] — targets are computed as
//     `idx + 1 + code[idx][2]` for every jump-class instruction
//   • length ∈ [2, maxWindow]
//
// Rewrite: slot[start] ← fused id (logical space ≥ 1000), slots (start,end]
// ← [Op.DECL, 0, 0, 0] semantic NOPs. Positions are preserved so ALL existing
// jump offsets stay valid; falling through the NOPs is harmless even if some
// exotic path entered mid-window.
import { Op, Proto } from "./opcodes";

/** logical ids for fused superops start here (base ISA is 0..50) */
export const FUSED_ID_BASE = 1000;

/**
 * Opcodes whose handlers consume NO instruction operands — their bodies are
 * pure stack/cell manipulations and compose by plain concatenation.
 */
export const ZERO_OPERAND_OPS: ReadonlySet<Op> = new Set<Op>([
  Op.NIL, Op.TRUE, Op.FALSE, Op.PUSHENV,
  Op.GETTAB, Op.SETTAB,
  Op.ADD, Op.SUB, Op.MUL, Op.DIV, Op.MOD, Op.POW,
  Op.EQ, Op.LT, Op.LE,
  Op.NOT, Op.LEN, Op.NEG,
  Op.SWAP, Op.DUP_ROT, Op.DUP,
  Op.NEWTABLE, Op.ADJUST_ONE,
]);

/** jump-class ops used to compute the per-proto target set */
const JUMP_CLASS: ReadonlySet<Op> = new Set<Op>([
  Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP,
]);

export interface FuseOptions {
  /** maximum members per fused opcode (default 8) */
  maxWindow?: number;
  /** maximum number of fused opcodes per BUILD (default 160) */
  maxFused?: number;
}

export interface FusedSpec {
  /** logical fused id (≥ FUSED_ID_BASE) */
  id: number;
  /** member logical ops in execution order (operand-free class) */
  members: Op[];
}

/** landing-slot indices for every control transfer in the proto */
export function computeTargets(code: [number, number, number, number][]): Set<number> {
  const t = new Set<number>();
  for (let i = 0; i < code.length; i++) {
    if (JUMP_CLASS.has(code[i][0] as Op)) {
      t.add(i + 1 + code[i][2]);
    }
  }
  return t;
}

/**
 * Mine and apply fusion across the whole proto tree (in place).
 * Returns the specs in creation order. Deterministic given the code arrays;
 * fused PHYSICAL values are assigned later by the pipeline rng.
 */
export function fuseSuperOps(
  root: Proto,
  rng: { int(n: number): number },
  opts?: FuseOptions,
): FusedSpec[] {
  const maxWindow = Math.max(2, opts?.maxWindow ?? 8);
  const maxFused = Math.max(0, opts?.maxFused ?? 160);
  const specs: FusedSpec[] = [];

  const walk = (p: Proto): void => {
    fuseProto(p);
    p.protos.forEach(walk);
  };
  walk(root);
  return specs;

  function fuseProto(p: Proto): void {
    if (specs.length >= maxFused) return;
    const code = p.code;
    const targets = computeTargets(code);
    let nextId = FUSED_ID_BASE + specs.length;

    let i = 0;
    while (i < code.length && specs.length < maxFused) {
      // extend a window starting at i
      let j = i; // inclusive end
      while (
        j + 1 < code.length &&
        j - i + 1 < maxWindow &&
        !targets.has(j + 1) && // interior slots must not be entry points
        ZERO_OPERAND_OPS.has(code[j + 1][0] as Op)
      ) {
        j++;
      }
      // also require the START to be in the zero-operand class
      if (
        j > i &&
        j - i + 1 >= 2 &&
        ZERO_OPERAND_OPS.has(code[i][0] as Op) &&
        !targets.has(i + 1) // second slot must not be an entry either
      ) {
        const members: Op[] = [];
        for (let k = i; k <= j; k++) members.push(code[k][0] as Op);
        const id = nextId++;
        // rewrite: fused head + DECL NOPs (operands zeroed)
        code[i][0] = id;
        for (let k = i + 1; k <= j; k++) {
          code[k][0] = Op.DECL;
          code[k][1] = 0;
          code[k][2] = 0;
          code[k][3] = 0;
        }
        specs.push({ id, members });
        i = j + 1; // continue scanning after the window
      } else {
        i++;
      }
    }
  }
}
