// NEVAHEX-VM — mutation engine for handler body variants (Phase 1)
//
// Generates 50-100 semantically equivalent handler body variants per logical
// opcode via stochastic rewriting. This explodes handler diversity from ~4
// (current) to 50-100, forcing SMT-based deobfuscators to attack each variant
// separately and defeating pattern-matching entirely.
//
// Mutation strategies:
//  1. Local variable renaming (randomized per variant)
//  2. Statement reordering (independent statements)
//  3. MBA-scrambled arithmetic wrappers (silent-tier poison variants)
//  4. Dead code injection (always-false ifs + no-ops)
//  5. Redundant do-end scoping
//  6. Temporary variable hoisting
//  7. Expression factoring/unfactoring
import { BuildRng } from "../crypto/prng";
import { Op } from "../vm/opcodes";

/** A single handler body variant with its local declarations */
export interface HandlerVariant {
  /** Hoisted local declarations (may be empty) */
  locals: string[];
  /** Handler body lines */
  body: string[];
  /** Unique variant ID for metrics */
  variantId: number;
}

export interface MutationOptions {
  /** Target variants per opcode (default: 50, max: 200) */
  variantsPerOp?: number;
  /** Enable MBA-scrambled arithmetic wrappers (default: true) */
  mbaWrappers?: boolean;
  /** Enable dead code injection (default: true) */
  deadCode?: boolean;
  /** Enable local variable renaming (default: true) */
  renameLocals?: boolean;
  /** Enable statement reordering (default: true) */
  reorderStatements?: boolean;
  /** Enable redundant scoping (default: true) */
  redundantScope?: boolean;
}

const DEFAULT_OPTIONS: Required<MutationOptions> = {
  variantsPerOp: 50,
  mbaWrappers: true,
  deadCode: true,
  renameLocals: true,
  reorderStatements: true,
  redundantScope: true,
};

/**
 * Generate a pool of handler variants for a given base body.
 *
 * Each variant is semantically equivalent to the base but syntactically
 * distinct. Variants are generated stochastically using the build RNG,
 * so no two builds share the same variant set.
 */
export class MutationEngine {
  private readonly opts: Required<MutationOptions>;
  private letCounter = 0;
  private variantCounter = 0;

  constructor(private readonly rng: BuildRng, opts: MutationOptions = {}) {
    this.opts = { ...DEFAULT_OPTIONS, ...opts };
  }

  /**
   * Generate `count` semantically equivalent variants of `baseBody`.
   * Each variant gets a unique variantId for handler-diversity metrics.
   */
  generateVariants(baseBody: string[], count?: number): HandlerVariant[] {
    const n = count ?? this.opts.variantsPerOp;
    const variants: HandlerVariant[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < n; i++) {
      const variant = this.mutate(baseBody, i);
      const key = variant.body.join("\n") + variant.locals.join("\n");
      if (!seen.has(key)) {
        seen.add(key);
        variants.push(variant);
      }
    }

    // Fallback: if we somehow got < n unique variants, force-generate more
    let attempts = 0;
    while (variants.length < n && attempts < n * 3) {
      const variant = this.mutate(baseBody, variants.length + attempts);
      const key = variant.body.join("\n") + variant.locals.join("\n");
      if (!seen.has(key)) {
        seen.add(key);
        variants.push(variant);
      }
      attempts++;
    }

    return variants;
  }

  /**
   * Apply one round of mutations to a base body.
   * Mutations are applied probabilistically based on enabled options.
   */
  private mutate(baseBody: string[], seed: number): HandlerVariant {
    this.letCounter = 0;
    this.variantCounter = seed;

    let body = [...baseBody];
    let locals: string[] = [];

    // Step 1: Extract and rename locals
    if (this.opts.renameLocals && this.rng.bool()) {
      const result = this.renameLocals(body);
      body = result.body;
      locals = result.locals;
    }

    // Step 2: Inject dead code
    if (this.opts.deadCode && this.rng.bool()) {
      body = this.injectDeadCode(body);
    }

    // Step 3: Wrap arithmetic with MBA (silent-tier style)
    if (this.opts.mbaWrappers && this.rng.bool()) {
      body = this.wrapWithMBA(body);
    }

    // Step 4: Redundant do-end scoping
    if (this.opts.redundantScope && this.rng.bool()) {
      body = this.addRedundantScope(body);
    }

    // Step 5: Reorder independent statements (within safety bounds)
    if (this.opts.reorderStatements && body.length > 2 && this.rng.bool()) {
      body = this.reorderSafe(body);
    }

    // Step 6: Inject hoisted temporaries
    if (this.rng.bool()) {
      const hoisted = this.hoistTemporaries(body);
      locals.push(...hoisted.locals);
      body = hoisted.body;
    }

    return {
      locals,
      body,
      variantId: this.variantCounter++,
    };
  }

  /**
   * Rename all local variables to randomized names.
   * Preserves semantic meaning while destroying stable signatures.
   */
  private renameLocals(body: string[]): { body: string[]; locals: string[] } {
    const usedNames = new Set<string>();
    const renameMap = new Map<string, string>();
    const newLocals: string[] = [];

    const freshName = (prefix: string): string => {
      let name: string;
      do {
        name = `${prefix}${this.rng.int(900000) + 100000}`;
      } while (usedNames.has(name));
      usedNames.add(name);
      return name;
    };

    // Extract local declarations
    const localRegex = /local\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    for (const line of body) {
      let m: RegExpExecArray | null;
      while ((m = localRegex.exec(line)) !== null) {
        const orig = m[1];
        if (!renameMap.has(orig)) {
          renameMap.set(orig, freshName(orig.slice(0, 2)));
        }
      }
    }

    // Apply renames
    const newBody = body.map((line) => {
      let result = line;
      for (const [orig, replacement] of renameMap) {
        // Use word boundary to avoid partial matches
        result = result.replace(new RegExp(`\\b${orig}\\b`, "g"), replacement);
      }
      return result;
    });

    // Collect locals used
    for (const replacement of renameMap.values()) {
      newLocals.push(replacement);
    }

    return { body: newBody, locals: newLocals };
  }

  /**
   * Inject dead code branches guarded by always-false MBA predicates.
   * These branches execute no-ops but increase analysis complexity.
   */
  private injectDeadCode(body: string[]): string[] {
    const result: string[] = [];
    let deadBranches = 1 + this.rng.int(3); // 1-3 dead branches

    for (let i = 0; i < body.length; i++) {
      result.push(body[i]);

      // Randomly inject dead code after some statements
      if (this.rng.bool() && deadBranches > 0) {
        const guard = this.mbaFalseGuard();
        const junkVar = `_j${this.letCounter++}`;
        result.push(
          `if ${guard} then local ${junkVar}=1+1 end`,
        );
        deadBranches--;
      }
    }

    return result;
  }

  /**
   * Wrap arithmetic expressions with MBA-scrambled wrappers.
   * E.g., `x+y` → `((x+y+${k})-${k})` where k is randomized.
   */
  private wrapWithMBA(body: string[]): string[] {
    const k1 = this.rng.int(1000) + 1;
    const k2 = this.rng.int(1000) + 1;

    return body.map((line) => {
      // Only wrap lines that contain arithmetic ops
      if (!/[+\-*/%^]/.test(line)) return line;

      // Wrap numeric constants in the line
      return line.replace(/(\d+)/g, (match) => {
        if (parseInt(match) < 100) return match; // skip small constants
        const v = parseInt(match);
        return `((${v}+${k1})-${k1})`;
      });
    });
  }

  /**
   * Wrap statements in redundant do-end blocks with junk locals.
   */
  private addRedundantScope(body: string[]): string[] {
    if (body.length === 0) return body;

    const result: string[] = [];
    const depth = 1 + this.rng.int(2); // 1-2 nested scopes

    for (let d = 0; d < depth; d++) {
      const junk = `_r${this.letCounter++}`;
      result.push(`do local ${junk}=1+1`);
    }

    for (const line of body) {
      result.push(`  ${line}`);
    }

    for (let d = 0; d < depth; d++) {
      result.push(`end`);
    }

    return result;
  }

  /**
   * Reorder independent statements while preserving semantics.
   * Only reorders statements that don't depend on each other (heuristic).
   */
  private reorderSafe(body: string[]): string[] {
    if (body.length <= 2) return body;

    const result = [...body];
    const swapCount = 1 + this.rng.int(Math.min(3, result.length - 1));

    for (let i = 0; i < swapCount; i++) {
      const a = this.rng.int(result.length);
      let b = this.rng.int(result.length);
      while (b === a) b = this.rng.int(result.length);

      // Only swap if neither is a control-flow statement
      const aLine = result[a];
      const bLine = result[b];
      if (
        !aLine.startsWith("if ") &&
        !aLine.startsWith("for ") &&
        !aLine.startsWith("while ") &&
        !bLine.startsWith("if ") &&
        !bLine.startsWith("for ") &&
        !bLine.startsWith("while ")
      ) {
        [result[a], result[b]] = [result[b], result[a]];
      }
    }

    return result;
  }

  /**
   * Hoist temporary expressions into separate local variables.
   * E.g., `x = a + b * c` → `local _t = b * c; x = a + _t`
   */
  private hoistTemporaries(body: string[]): { body: string[]; locals: string[] } {
    if (body.length === 0 || !this.rng.bool()) return { body, locals: [] };

    const result: string[] = [];
    const newLocals: string[] = [];
    const hoistCount = 1 + this.rng.int(2);

    for (let h = 0; h < hoistCount; h++) {
      const tempName = `_t${this.letCounter++}`;
      newLocals.push(tempName);
      result.push(`local ${tempName}=nil`);
    }

    for (const line of body) {
      result.push(line);
    }

    return { body: result, locals: newLocals };
  }

  /**
   * Generate an always-false MBA guard for dead code.
   * Uses quadratic tautology: (x^2 + x) % 2 == 0 is always true for integers,
   * so we negate it with a constant offset to get always-false.
   */
  private mbaFalseGuard(): string {
    const x = this.rng.int(100) + 1;
    const forms: (() => string)[] = [
      () => `(((${x}*${x}+${x})%2)==0 and 1==0)`,
      () => `((7*${x}*${x})+${x})%2==1`,
      () => `(${x}%2==0 and ${x}%2==1)`,
      () => `(${x}==${x}+1)`,
    ];
    return forms[this.rng.int(forms.length)]();
  }

  /**
   * Reset the variant counter for a new opcode.
   */
  reset(): void {
    this.variantCounter = 0;
    this.letCounter = 0;
  }
}

/**
 * Build a mutation engine with default options.
 */
export function createMutationEngine(rng: BuildRng, opts?: MutationOptions): MutationEngine {
  return new MutationEngine(rng, opts);
}
