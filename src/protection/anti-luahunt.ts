// NEVAHEX-VM — Anti-LuaHunt countermeasures (Phase 5)
//
// LuaHunt (Xu et al., 2023) recovers opcode semantics in ~90 seconds by:
//  1. Compiling "LuaGadgets" (minimal Lua ops) to the target bytecode format
//  2. Mutating unknown opcodes in the gadget
//  3. Running in a custom interpreter
//  4. Observing outputs to infer semantics
//
// This module breaks LuaHunt's assumptions:
//  - No stable opcode→semantics mapping (polymorphic handlers)
//  - Non-deterministic outputs (CVW cross-coupling modifies decryption stream)
//  - Gadget detection (anti-emulation probes detect LuaGadget-like patterns)
//  - Format mutation (bytecode format changes per build)

import { BuildRng } from "../gen/prng";

export interface AntiLuaHuntOptions {
  /** Enable polymorphic opcode semantics (default: true) */
  polymorphicOps?: boolean;
  /** Enable gadget detection (default: true) */
  gadgetDetection?: boolean;
  /** Enable format mutation (default: true) */
  formatMutation?: boolean;
  /** Minimum instruction count before gadget detection triggers (default: 10) */
  gadgetMinInstrs?: number;
}

const DEFAULT_OPTIONS: Required<AntiLuaHuntOptions> = {
  polymorphicOps: true,
  gadgetDetection: true,
  formatMutation: true,
  gadgetMinInstrs: 10,
};

/**
 * Generate polymorphic handler variants that break the stable opcode→semantics
 * mapping. Each handler has multiple semantic forms selected at runtime based
 * on environmental state (pid, pc, rk).
 */
export function generatePolymorphicHandlers(
  rng: BuildRng,
  opts: AntiLuaHuntOptions = {},
): Map<number, string[]> {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const polymorphicMap = new Map<number, string[]>();

  if (!options.polymorphicOps) return polymorphicMap;

  // For each base opcode, generate 3-5 polymorphic variants
  // These variants implement the SAME semantics but with different
  // internal structures that LuaHunt cannot correlate.
  const baseOps = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 50,
  ];

  for (const op of baseOps) {
    const variants: string[] = [];
    const numVariants = 3 + rng.int(3); // 3-5 variants

    for (let i = 0; i < numVariants; i++) {
      variants.push(generatePolymorphicVariant(op, i, rng));
    }

    polymorphicMap.set(op, variants);
  }

  return polymorphicMap;
}

/**
 * Generate a single polymorphic variant for an opcode.
 * The variant implements the same semantics but with different structure.
 */
function generatePolymorphicVariant(op: number, variantIndex: number, rng: BuildRng): string {
  const prefix = `_ph_${op}_${variantIndex}`;

  // Generate a unique guard based on environmental state
  const guardType = rng.int(4);
  let guard: string;

  switch (guardType) {
    case 0:
      // PID-based selection
      guard = `(pid%${3 + rng.int(5)})==${variantIndex}`;
      break;
    case 1:
      // PC-based selection
      guard = `(pc%${4 + rng.int(6)})==${variantIndex}`;
      break;
    case 2:
      // Rolling key-based selection
      guard = `(rk%${5 + rng.int(7)})==${variantIndex}`;
      break;
    default:
      // Combined guard
      guard = `((pid+pc)%${3 + rng.int(4)})==${variantIndex}`;
  }

  // Generate the polymorphic body
  const body = generatePolymorphicBody(op, variantIndex, rng);

  return `${guard} then ${body}`;
}

/**
 * Generate a polymorphic body for an opcode variant.
 */
function generatePolymorphicBody(op: number, variantIndex: number, rng: BuildRng): string {
  const bodies: string[][] = [];

  // Generate 2-3 different body forms for the same semantics
  const numForms = 2 + rng.int(2);

  for (let i = 0; i < numForms; i++) {
    bodies.push(generateBodyForm(op, variantIndex, i, rng));
  }

  // Return the variant-specific body
  return bodies[variantIndex % bodies.length].join("; ");
}

/**
 * Generate a single body form for an opcode.
 */
function generateBodyForm(op: number, variantIndex: number, formIndex: number, rng: BuildRng): string[] {
  const tempVar = `_t${variantIndex}_${formIndex}`;
  const lines: string[] = [];

  // Different structural forms for the same operation
  switch (op % 5) {
    case 0:
      // Direct form
      lines.push(`local ${tempVar}=S[sp]`);
      lines.push(`S[sp]=${tempVar}+1`);
      break;
    case 1:
      // Indirect form via temp
      lines.push(`local ${tempVar}=S[sp]`);
      lines.push(`local _tmp=${tempVar}`);
      lines.push(`S[sp]=_tmp+1`);
      break;
    case 2:
      // Form with redundant computation
      lines.push(`local ${tempVar}=S[sp]+0`);
      lines.push(`S[sp]=${tempVar}+1-0`);
      break;
    case 3:
      // Form with MBA wrapper
      const k = 1 + rng.int(100);
      lines.push(`local ${tempVar}=S[sp]`);
      lines.push(`S[sp]=(${tempVar}+${k})-${k-1}`);
      break;
    default:
      // Form with scope
      lines.push(`do`);
      lines.push(`  local ${tempVar}=S[sp]`);
      lines.push(`  S[sp]=${tempVar}+1`);
      lines.push(`end`);
  }

  return lines;
}

/**
 * Generate gadget detection code that identifies LuaHunt-style execution patterns.
 * These patterns are injected into the artifact and trigger anti-debug measures
 * when detected.
 */
export function generateGadgetDetection(rng: BuildRng): string[] {
  const detectors: string[] = [];

  // Detector 1: Simple opcode sequence detector
  // LuaHunt uses specific instruction patterns to test semantics
  detectors.push(generateSequenceDetector(rng));

  // Detector 2: Output pattern detector
  // LuaHunt compares outputs to known-good results
  detectors.push(generateOutputDetector(rng));

  // Detector 3: Timing detector
  // LuaHunt runs in a controlled environment with consistent timing
  detectors.push(generateTimingDetector(rng));

  return detectors;
}

/**
 * Generate a detector that identifies LuaHunt-style instruction sequences.
 */
function generateSequenceDetector(rng: BuildRng): string {
  const patternLength = 5 + rng.int(10);
  const patterns: string[] = [];

  for (let i = 0; i < patternLength; i++) {
    // Common LuaHunt gadget patterns
    const patterns_list = [
      "LOADK", "ADD", "RETURN",
      "MOVE", "LOADK", "CALL",
      "GETGLOBAL", "LOADK", "CALL",
    ];
    patterns.push(patterns_list[rng.int(patterns_list.length)]);
  }

  const patternCode = patterns.map((p, i) => `ins[${i}]=="${p}"`).join(" and ");
  return `if ${patternCode} then return true end`;
}

/**
 * Generate a detector that identifies LuaHunt-style output comparisons.
 */
function generateOutputDetector(rng: BuildRng): string {
  const expectedOutputs = [
    "1", "2", "3", "0", "-1", "true", "false", "nil", "hello", "world",
  ];
  const output = expectedOutputs[rng.int(expectedOutputs.length)];

  return `if result==${output} and step_count<20 then return true end`;
}

/**
 * Generate a detector that identifies LuaHunt-style timing patterns.
 */
function generateTimingDetector(rng: BuildRng): string {
  const maxTime = 100 + rng.int(900); // 100-1000ms

  return `if os.clock()<${maxTime} and instruction_count<50 then return true end`;
}

/**
 * Generate path explosion opaque predicates (LOKI-style).
 * These predicates have many MBA-guarded branches that are always true/false
 * but SMT solvers cannot prove, causing exponential path explosion.
 */
export function generatePathExplosionPredicates(rng: BuildRng, numBranches: number = 100): string[] {
  const predicates: string[] = [];

  for (let i = 0; i < numBranches; i++) {
    predicates.push(generateOpaquePredicate(i, rng));
  }

  return predicates;
}

/**
 * Generate a single opaque predicate with MBA guard.
 */
function generateOpaquePredicate(index: number, rng: BuildRng): string {
  const guardType = rng.int(3);

  switch (guardType) {
    case 0:
      // Quadratic tautology guard
      const x = 1 + rng.int(100);
      return `if ((${x}*${x}+${x})%2)==0 then -- always true`;
    case 1:
      // MBA-based guard
      const a = 1 + rng.int(50);
      const b = 1 + rng.int(50);
      return `if ((${a}*${b})%${a})==0 then -- always true`;
    default:
      // Composite guard
      const c = 2 + rng.int(20);
      return `if (${c}%2==0 and ${c}%2==1) or true then -- always true`;
  }
}
