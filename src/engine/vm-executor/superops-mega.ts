// NEVAHEX-VM — mega superoperator fusion pass (Phase 2)
//
// Extends the base superoperator pass with three advanced techniques:
//
//  1. Mega superoperators: fold 60–80 instruction windows into a single
//     synthetic opcode. This is the IronBrew2 "mega" tier; it obscures
//     large code regions and dramatically reduces the number of visible
//     dispatch events.
//
//  2. Operand-bearing fusion: unlike the base pass (operand-free class only),
//     this pass can fuse instructions that read A/B/C operands. The fused
//     handler captures the per-instance operands into local variables at
//     entry, then executes all member bodies against those locals.
//
//  3. Recursive superoperator nesting: after creating mega superoperators,
//     the pass re-scans the shortened code for additional mini windows
//     (2–15 instructions). Because mega fusion inserts fused heads at new
//     positions, the recursive pass discovers fresh mini opportunities that
//     did not exist in the original linear code.
//
// Together these create a hierarchical fusion lattice:
//   mega[60–80] → mini[2–15] → base[1]
// that exponentially increases static-analysis complexity.
import { Op, Proto, Instr } from "./opcodes";
import { FUSED_ID_BASE, FusedSpec, computeTargets, ZERO_OPERAND_OPS } from "./superops";

/** jump-class ops used to compute the per-proto target set */
const JUMP_CLASS: ReadonlySet<Op> = new Set<Op>([
  Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP,
]);

/**
 * Operand-bearing ops: instructions whose handlers read A/B/C from the
 * instruction record. These can still be fused, but the fused handler must
 * capture operand values before executing member bodies.
 */
const OPERAND_BEARING_OPS: ReadonlySet<Op> = new Set<Op>([
  Op.MOVE, Op.SETLOCAL, Op.STOREN, Op.LOADK,
  Op.GGET, Op.GSET, Op.UPVAL, Op.SETUPVAL,
  Op.GETTAB, Op.SETTAB, Op.SETTABAT, Op.NEWTABLE, Op.SETLIST,
  Op.CLOSURE, Op.CALL, Op.CALLM, Op.VARARG, Op.RET,
  Op.CONCAT, Op.EQ, Op.LT, Op.LE,
  Op.ADJUST, Op.ADJUST_ONE, Op.MSET,
  Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP,
  Op.JMP, Op.JF, Op.JT,
  Op.POP, Op.SWAP, Op.DUP_ROT,
]);

export interface MegaFuseOptions {
  /** mega window size range [min, max] (default: [60, 80]) */
  megaWindow?: [number, number];
  /** mini window size range after recursive pass (default: [2, 15]) */
  miniWindow?: [number, number];
  /** recursion bound: how many mega→mini→mega passes (default: 3) */
  recursionBound?: number;
  /** maximum number of fused opcodes per BUILD (default: 200) */
  maxFused?: number;
}

export interface MegaFusedSpec {
  /** logical fused id (≥ FUSED_ID_BASE, unique across all specs) */
  id: number;
  /** member logical ops in execution order */
  members: Op[];
  /** per-member operand snapshots: [A, B, C] for each instruction */
  operands: Instr[];
  /** whether this is a mega (true) or mini (false) superoperator */
  isMega: boolean;
}

/**
 * Mine and apply mega + recursive superoperator fusion across the proto tree.
 *
 * Algorithm:
 *   1. First pass: mine MEGA windows (60–80 insns, operand-bearing allowed)
 *   2. Second pass: recursively mine MINI windows (2–15 insns) in the
 *      shortened code, up to `recursionBound` times
 *
 * Returns specs in creation order. Fused PHYSICAL values are assigned later
 * by the pipeline rng.
 */
export function fuseMegaSuperOps(
  root: Proto,
  rng: { int(n: number): number },
  opts?: MegaFuseOptions,
): MegaFusedSpec[] {
  const megaMin = opts?.megaWindow?.[0] ?? 60;
  const megaMax = opts?.megaWindow?.[1] ?? 80;
  const miniMin = opts?.miniWindow?.[0] ?? 2;
  const miniMax = opts?.miniWindow?.[1] ?? 15;
  const recursionBound = opts?.recursionBound ?? 3;
  const maxFused = opts?.maxFused ?? 200;

  const allSpecs: MegaFusedSpec[] = [];
  let currentRoot = root;

  // Pass 0: mega fusion on the original code
  let specs = mineFusionWindows(currentRoot, rng, megaMin, megaMax, maxFused, allSpecs.length, true);
  allSpecs.push(...specs);

  // Pass 1..N: recursive mini fusion on shortened code
  for (let pass = 1; pass < recursionBound && allSpecs.length < maxFused; pass++) {
    const miniSpecs = mineFusionWindows(currentRoot, rng, miniMin, miniMax, maxFused - allSpecs.length, allSpecs.length, false);
    if (miniSpecs.length === 0) break;
    allSpecs.push(...miniSpecs);
  }

  return allSpecs;
}

/**
 * Mine fusion windows of a given size range in the current code.
 * Applies fusions in place and returns the specs.
 */
function mineFusionWindows(
  root: Proto,
  rng: { int(n: number): number },
  minLen: number,
  maxLen: number,
  budget: number,
  idOffset: number,
  isMega: boolean,
): MegaFusedSpec[] {
  const specs: MegaFusedSpec[] = [];
  if (budget <= 0) return specs;

  const walk = (p: Proto): void => {
    if (specs.length >= budget) return;
    fuseInProto(p, rng, minLen, maxLen, budget - specs.length, idOffset + specs.length, isMega, specs);
    p.protos.forEach((sub) => walk(sub));
  };
  walk(root);
  return specs;
}

/**
 * Apply fusion mining to a single proto's code array.
 */
function fuseInProto(
  p: Proto,
  rng: { int(n: number): number },
  minLen: number,
  maxLen: number,
  budget: number,
  idOffset: number,
  isMega: boolean,
  out: MegaFusedSpec[],
): void {
  if (p.code.length === 0 || out.length >= budget) return;
  const code = p.code;
  const targets = computeTargets(code);
  let nextId = FUSED_ID_BASE + idOffset;

  // For mega passes, we allow operand-bearing ops; for mini passes after
  // the first mega, we stick to operand-free ops for safety.
  const allowedOps = isMega
    ? new Set<Op>([...ZERO_OPERAND_OPS, ...OPERAND_BEARING_OPS])
    : ZERO_OPERAND_OPS;

  let i = 0;
  while (i < code.length && out.length < budget) {
    // extend a window starting at i
    let j = i;
    while (
      j + 1 < code.length &&
      j - i + 1 < maxLen &&
      !targets.has(j + 1) &&
      allowedOps.has(code[j + 1][0] as Op)
    ) {
      j++;
    }

    const windowLen = j - i + 1;
    if (
      windowLen >= minLen &&
      allowedOps.has(code[i][0] as Op) &&
      !targets.has(i + 1)
    ) {
      const members: Op[] = [];
      const operands: Instr[] = [];
      for (let k = i; k <= j; k++) {
        members.push(code[k][0] as Op);
        operands.push([...code[k]] as Instr);
      }
      const id = nextId++;

      // Capture operands into locals at the fused head if operand-bearing
      if (isMega && operands.some((ins) => ins[0] !== Op.DECL)) {
        // Insert operand-capture preamble before the fused head
        const captures: Instr[] = [];
        for (let k = i; k <= j; k++) {
          const [op, a, b, c] = code[k];
          if (ZERO_OPERAND_OPS.has(op)) {
            captures.push([Op.DECL, 0, 0, 0]);
          } else {
            // Snapshot operands into DECL-shaped placeholders
            captures.push([Op.DECL, a, b, c]);
          }
        }
        // Replace window with capture preamble + fused head + NOPs
        for (let k = i; k <= j; k++) {
          code[k] = captures[k - i];
        }
        code[i][0] = id;
      } else {
        // Operand-free: simple fused head + NOPs
        code[i][0] = id;
        for (let k = i + 1; k <= j; k++) {
          code[k][0] = Op.DECL;
          code[k][1] = 0;
          code[k][2] = 0;
          code[k][3] = 0;
        }
      }

      out.push({ id, members, operands, isMega });
      i = j + 1;
    } else {
      i++;
    }
  }
}

/**
 * Return the set of operands captured for a mega fused spec.
 * Each entry is [A, B, C] for the corresponding member instruction.
 */
export function getMegaOperandMap(spec: MegaFusedSpec): Map<number, Instr> {
  const map = new Map<number, Instr>();
  for (let i = 0; i < spec.members.length; i++) {
    map.set(i, spec.operands[i]);
  }
  return map;
}
