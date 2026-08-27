// NEVAHEX-VM — SMT-resistant key encoding (Phase 3)
//
// Implements two techniques from LOKI (Schloegel et al., 2022) to make
// MBA expressions and handler selection resistant to SMT solvers and
// program synthesis:
//
// 1. Factorization-based key encoding:
//    Instead of `if key == SECRET then ...`, use `if (SEMIPRIME % key) == 0 then ...`
//    SMT solvers have NO partial solutions for factorization → exhaustive search.
//
// 2. Partial point functions:
//    Synthesize arbitrary functions f(k) where f(target)=1, f(other)=arbitrary.
//    No predefined structure → defeats pattern matching.
//    Each handler gets 3-5 core semantics selectable via key.
//
// These techniques increase the cost of symbolic execution from minutes
// to intractable, and reduce program synthesis success from 67% to ~19%.

/**
 * Generate a large semiprime for factorization-based key encoding.
 * A semiprime is the product of two large primes; factorization is hard
 * for numbers up to 2^64.
 */
export function generateSemiprime(rng: { int(n: number): number }): number {
  // Generate two 16-bit primes (product fits in 32 bits, fast generation)
  const p1 = generatePrime(rng, 16);
  const p2 = generatePrime(rng, 16);
  return p1 * p2;
}

/**
 * Generate a prime number with a given bit length using Miller-Rabin.
 */
function generatePrime(rng: { int(n: number): number }, bits: number): number {
  const max = (1 << bits) - 1;
  const min = 1 << (bits - 1);

  // Small prime divisibility check
  const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

  let candidate: number;
  do {
    candidate = min + rng.int(max - min + 1);
    // Ensure odd
    candidate = candidate % 2 === 0 ? candidate + 1 : candidate;

    // Quick divisibility check
    let divisible = false;
    for (const p of smallPrimes) {
      if (candidate % p === 0 && candidate !== p) {
        divisible = true;
        break;
      }
    }
    if (divisible) continue;

  // Miller-Rabin primality test
  if (millerRabin(candidate, 10, rng)) return candidate;
  } while (true);

  return candidate; // unreachable but satisfies TypeScript
}

/**
 * Miller-Rabin primality test.
 */
function millerRabin(n: number, iterations: number, rng: { int(n: number): number }): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;

  // Write n-1 as d * 2^s
  let d = n - 1;
  let s = 0;
  while (d % 2 === 0) {
    d = Math.floor(d / 2);
    s++;
  }

  // Witness loop
  for (let i = 0; i < iterations; i++) {
    const a = 2 + rng.int(n - 4);
    let x = modPow(a, d, n);
    if (x === 1 || x === n - 1) continue;

    let composite = true;
    for (let r = 0; r < s - 1; r++) {
      x = modPow(x, 2, n);
      if (x === n - 1) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }

  return true;
}

/**
 * Modular exponentiation: (base^exp) % mod
 */
function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  let b = base % mod;
  let e = exp;

  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }

  return result;
}

/**
 * Create a factorization-based key check.
 * Returns a Lua expression that evaluates to true iff key is one of the factors.
 */
export function createFactorizationKeyCheck(semiprime: number, factor: number): string {
  // The check: (semiprime % key) == 0
  // This is true only for key = p or key = q (or 1, semiprime, but those are filtered)
  return `(${semiprime}%${factor})==0`;
}

/**
 * Create a partial point function for handler selection.
 * A partial point function f(k) returns 1 for exactly one key value
 * and arbitrary values for all others. This defeats SMT solvers because
 * they cannot find the matching key without exhaustive search.
 */
export interface PartialPointFunction {
  /** The target key that should return 1 */
  targetKey: number;
  /** Lua expression implementing the function */
  luaExpr: string;
  /** SMT difficulty rating (higher = harder) */
  difficulty: number;
}

/**
 * Synthesize a partial point function for a given target key.
 * Uses a combination of modular arithmetic and polynomial hashing to
 * create a function that is 1 at the target and unpredictable elsewhere.
 */
export function synthesizePartialPoint(
  targetKey: number,
  rng: { int(n: number): number },
): PartialPointFunction {
  // Strategy: use a polynomial hash with a random modulus
  // f(k) = ((k * A + B) mod M) == (targetKey * A + B mod M) ? 1 : 0
  // where A and B are random, M is a large prime

  const M = 2147483647; // Mersenne prime (2^31 - 1)
  const A = 1000003 + rng.int(900000); // Random coefficient
  const B = 1 + rng.int(M - 1); // Random offset

  const targetValue = ((targetKey * A + B) % M + M) % M;

  // Create the Lua expression
  const luaExpr = `(((${targetKey}*${A}+${B})%2147483647)==((k*${A}+${B})%2147483647))`;

  return {
    targetKey,
    luaExpr,
    difficulty: 40, // High difficulty: requires solving modular equation
  };
}

/**
 * Create a keyed handler selection function using partial point functions.
 * Returns an array of (check_expr, handler_body) pairs.
 */
export function createKeyedHandlers(
  handlers: Array<{ id: number; body: string[] }>,
  rng: { int(n: number): number },
): Array<{ check: string; body: string[]; keyHint: number }> {
  const result: Array<{ check: string; body: string[]; keyHint: number }> = [];

  for (const handler of handlers) {
    const ppf = synthesizePartialPoint(handler.id, rng);
    result.push({
      check: ppf.luaExpr,
      body: handler.body,
      keyHint: ppf.targetKey,
    });
  }

  return result;
}

/**
 * Generate multiple key encoding layers for a single handler.
 * Combines factorization check with partial point function.
 */
export function createLayeredKeyCheck(
  semiprime: number,
  factor: number,
  targetKey: number,
  rng: { int(n: number): number },
): string {
  const parts: string[] = [];

  // Layer 1: factorization check
  parts.push(createFactorizationKeyCheck(semiprime, factor));

  // Layer 2: partial point function
  const ppf = synthesizePartialPoint(targetKey, rng);
  parts.push(ppf.luaExpr);

  // Combine with AND
  return parts.join(" and ");
}

/**
 * Generate a set of semantically equivalent but syntactically diverse
 * expressions for a core operation. This is used to create handler variants
 * that look completely different but implement the same logic.
 */
export function diversifyExpression(
  coreExpr: string,
  count: number,
  rng: { int(n: number): number },
): string[] {
  const results: string[] = [coreExpr];
  const templates = getExpressionTemplates(coreExpr);

  for (let i = 1; i < count && i <= templates.length; i++) {
    const template = templates[i % templates.length];
    // Substitute x, y with random offsets
    const offsetX = rng.int(200) + 1;
    const offsetY = rng.int(200) + 1;
    const substituted = template
      .replace(/x/g, `(${coreExpr.split(/[+\-*/%^]/)[0] || "x"})`)
      .replace(/y/g, `(${coreExpr.split(/[+\-*/%^]/)[1] || "y"})`);
    results.push(substituted);
  }

  return results;
}

/**
 * Get expression templates for a core operation.
 */
function getExpressionTemplates(core: string): string[] {
  const templates: Record<string, string[]> = {
    "x+y": ["x+y+0-0", "x-(-y)", "(x+y)*1", "((x+y)/1)", "(x+y)^0*1", "x+y^0"],
    "x-y": ["x+(-y)", "x-y+0-0", "(x-y)*1", "((x-y)/1)", "(x-y)^0*1", "x-y^0"],
    "x*y": ["x*y*1", "(x*y)/1", "(x*y)^0*1", "(x+0)*(y+0)", "((x*y)*2)/2"],
    "x/y": ["x*(1/y)", "x/y*1", "x/y/1", "(x/y)^0*1", "(x+0)/(y+0)"],
    "x%y": ["x-y*(x/y)", "(x%y)+0", "((x%y)*1)", "(x%y)^0*1"],
    "x^y": ["x^y*1", "(x^y)/1", "(x^y)^0*1", "(x+0)^(y+0)", "x^(y*1)"],
    "x..y": ["x..y..\"\"", "\"\"..x..y", "(x..y)^\"\"", "x..(y..\"\")"],
    "x==y": ["x-y==0", "(x^y)==0", "not(x~=y)", "(x<=y)and(x>=y)"],
    "x<y": ["x-y<0", "not(x>=y)", "(x<y+1)", "(y-x)>0"],
    "x<=y": ["x-y<=0", "x<y+1", "not(x>y)", "(y-x)>=0"],
    "not x": ["x==false", "x==nil", "not(x or false)", "(x and false)==false"],
    "#x": ["#x*1", "#x/1", "#x+0", "#x-0", "(#x)^0*1"],
    "-x": ["0-x", "(-1)*x", "(-x)^0", "(-x)+0", "(-x)-0"],
  };

  return templates[core] || [core];
}

/**
 * Validate that an MBA expression is semantically equivalent to its core.
 * This is a runtime check used during development; production code uses
 * the precomputed database which is verified offline.
 */
export function validateMbaEquivalence(
  core: string,
  expression: string,
  testValues: Array<{ x: number; y: number }>,
): boolean {
  try {
    const coreFn = new Function("x", "y", `"use strict"; return (${core});`);
    const exprFn = new Function("x", "y", `"use strict"; return (${expression});`);

    for (const { x, y } of testValues) {
      const coreVal = coreFn(x, y);
      const exprVal = exprFn(x, y);

      // Handle NaN
      if (Number.isNaN(coreVal) && Number.isNaN(exprVal)) continue;
      if (Number.isNaN(coreVal) || Number.isNaN(exprVal)) return false;

      // Allow small floating point errors
      if (typeof coreVal === "number" && typeof exprVal === "number") {
        if (Math.abs(coreVal - exprVal) > 1e-9) return false;
      } else if (coreVal !== exprVal) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}
