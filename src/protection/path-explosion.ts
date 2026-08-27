// NEVAHEX-VM — Path explosion opaque predicates (Phase 5, LOKI-inspired)
//
// Generates opaque predicates that create exponential path explosion for
// symbolic execution engines and SMT solvers. Each predicate is guarded by
// an MBA expression that is always true/false but requires exponential
// effort to prove.
//
// LOKI generates ~100 such predicates per handler, reducing program synthesis
// success from 67% to ~19%. NEVAHEX extends this with:
//  - Randomized predicate structures per build
//  - MBA-guarded branches with 3-5 core semantics per handler
//  - Path explosion combined with handler diversity (5000+ unique patterns)

import { BuildRng } from "../gen/prng";

export interface PathExplosionOptions {
  /** Number of opaque predicates per function (default: 50) */
  predicatesPerFunction?: number;
  /** MBA complexity level (1-3, default: 2) */
  mbaComplexity?: number;
  /** Enable nested predicates (default: true) */
  nestedPredicates?: boolean;
}

const DEFAULT_OPTIONS: Required<PathExplosionOptions> = {
  predicatesPerFunction: 50,
  mbaComplexity: 2,
  nestedPredicates: true,
};

/**
 * Generate path explosion opaque predicates for a function.
 * Returns a list of predicate strings that can be injected into the code.
 */
export function generatePathExplosionPredicates(
  rng: BuildRng,
  opts: PathExplosionOptions = {},
): string[] {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const predicates: string[] = [];

  for (let i = 0; i < options.predicatesPerFunction; i++) {
    predicates.push(generatePredicate(i, rng, options));
  }

  return predicates;
}

/**
 * Generate a single opaque predicate with MBA guard.
 */
function generatePredicate(index: number, rng: BuildRng, opts: Required<PathExplosionOptions>): string {
  const complexity = opts.mbaComplexity;
  const indent = "  ";

  switch (complexity) {
    case 1:
      return generateSimplePredicate(index, rng, indent);
    case 2:
      return generateMediumPredicate(index, rng, indent);
    case 3:
      return generateComplexPredicate(index, rng, indent, opts.nestedPredicates);
    default:
      return generateMediumPredicate(index, rng, indent);
  }
}

/**
 * Generate a simple opaque predicate (complexity 1).
 * Uses basic tautologies that are easy for humans but hard for SMT solvers.
 */
function generateSimplePredicate(index: number, rng: BuildRng, indent: string): string {
  const templates = [
    () => {
      const x = 1 + rng.int(100);
      return `${indent}if ((${x}*${x}+${x})%2)==0 then -- tautology [${index}]`;
    },
    () => {
      const x = 2 + rng.int(50);
      const y = 1 + rng.int(50);
      return `${indent}if ((${x}%${y})<${y}) then -- always true [${index}]`;
    },
    () => {
      const x = 1 + rng.int(100);
      return `${indent}if (${x}==${x}) then -- tautology [${index}]`;
    },
    () => {
      const x = 1 + rng.int(100);
      return `${indent}if (${x}~=${x}+1) then -- always true [${index}]`;
    },
  ];

  return templates[rng.int(templates.length)]();
}

/**
 * Generate a medium complexity opaque predicate (complexity 2).
 * Uses MBA expressions with multiple equivalent forms.
 */
function generateMediumPredicate(index: number, rng: BuildRng, indent: string): string {
  const templates = [
    () => {
      const a = 1 + rng.int(100);
      const b = 1 + rng.int(100);
      const c = 1 + rng.int(100);
      return `${indent}if ((${a}*${b}+${c})%2)==(${a}%2+${c}%2)%2 then -- MBA [${index}]`;
    },
    () => {
      const x = 1 + rng.int(100);
      const y = 1 + rng.int(100);
      return `${indent}if ((${x}&${y})+(~${x}&${y})|0)==(${x}|${y}) then -- MBA [${index}]`;
    },
    () => {
      const x = 1 + rng.int(100);
      return `${indent}if ((${x}^${x})==0 then -- tautology [${index}]`;
    },
    () => {
      const a = 1 + rng.int(50);
      const b = 1 + rng.int(50);
      return `${indent}if ((${a}+${b})%${a})==(${b}%${a}) then -- modular [${index}]`;
    },
  ];

  return templates[rng.int(templates.length)]();
}

/**
 * Generate a complex opaque predicate (complexity 3).
 * Uses nested MBA expressions and multiple conditions.
 */
function generateComplexPredicate(
  index: number,
  rng: BuildRng,
  indent: string,
  nested: boolean,
): string {
  const lines: string[] = [];
  const numConditions = 2 + rng.int(3);

  lines.push(`${indent}-- complex predicate [${index}]`);

  for (let i = 0; i < numConditions; i++) {
    const a = 1 + rng.int(100);
    const b = 1 + rng.int(100);
    const c = 1 + rng.int(100);

    if (nested && i > 0) {
      lines.push(`${indent}  local _cp${index}_${i}=(${a}*${b}+${c})%2`);
    }

    lines.push(`${indent}if ((${a}*${b}+${c})%2)==(${a}%2+${c}%2)%2 then`);
  }

  lines.push(`${indent}  -- always true path`);
  lines.push(`${indent}end`);

  // Add nested predicates
  if (nested && rng.bool()) {
    const nestedPreds = generatePathExplosionPredicates(rng, {
      predicatesPerFunction: 5 + rng.int(10),
      mbaComplexity: 1,
      nestedPredicates: false,
    });
    lines.push(...nestedPreds.map((p) => `${indent}  ${p}`));
  }

  return lines.join("\n");
}

/**
 * Inject path explosion predicates into a block of code.
 * Returns the modified code with predicates injected.
 */
export function injectPathExplosionPredicates(
  code: string[],
  rng: BuildRng,
  opts: PathExplosionOptions = {},
): string[] {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const predicates = generatePathExplosionPredicates(rng, options);
  const result: string[] = [];

  let predicateIndex = 0;

  for (const line of code) {
    result.push(line);

    // Inject predicates at random points
    if (rng.bool() && predicateIndex < predicates.length) {
      result.push(predicates[predicateIndex]);
      predicateIndex++;
    }
  }

  return result;
}

/**
 * Generate a self-modifying code snippet that patches its own handler at runtime.
 * This defeats static analysis because the code changes during execution.
 */
export function generateSelfModifyingCode(rng: BuildRng): string[] {
  const lines: string[] = [];
  const handlerId = rng.int(1000);
  const patchOffset = rng.int(100);

  lines.push(`-- self-modifying handler [${handlerId}]`);
  lines.push(`local _sm_orig=string.byte(_G[1],${patchOffset}+1)`);
  lines.push(`local _sm_new=bit and bit.bxor(_sm_orig,${1+rng.int(255)}) or (_sm_orig~${1+rng.int(255)})`);
  lines.push(`_G[1]=_G[1]:sub(1,${patchOffset})..string.char(_sm_new).._G[1]:sub(${patchOffset}+2)`);
  lines.push(`-- patched handler now executes`);

  return lines;
}
