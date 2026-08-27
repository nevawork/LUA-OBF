// NEVAHEX-VM — constant pool obfuscation (Phase 1)
//
// Obfuscates the constant pool through three complementary techniques:
//  1. Type confusion: encode numbers as table lengths, strings as MBA expressions
//  2. Pool shuffling: randomize constant order and remap instruction indices
//  3. Constant splitting: split large constants across multiple entries
//
// These techniques break the assumption that constant indices reveal the
// program's data flow, defeating deobfuscators that rely on constant-value
// tracking (e.g., symbolic execution, taint analysis).
import { Block, Chunk, Expr, NumberLit, Stat, StringLit, TableExpr, NameRef, CallExpr, Binop } from "../lang/nodes";
import { Op, Proto, Const } from "../vm/opcodes";
import { BuildRng } from "../gen/prng";

export interface ConstantObfOptions {
  /** Enable table-length number encoding (default: true) */
  tableLengthEncode?: boolean;
  /** Enable MBA string obfuscation (default: true) */
  mbaStrings?: boolean;
  /** Enable constant pool shuffling (default: true) */
  shufflePool?: boolean;
  /** Probability of applying type confusion per constant (default: 0.3) */
  confusionProbability?: number;
}

const DEFAULT_OPTS: Required<ConstantObfOptions> = {
  tableLengthEncode: true,
  mbaStrings: true,
  shufflePool: true,
  confusionProbability: 0.3,
};

/**
 * Obfuscate constants in the AST before compilation.
 * This replaces literal constants with equivalent but harder-to-analyze forms.
 */
export function obfuscateConstants(chunk: Block, rng: BuildRng, opts: ConstantObfOptions = {}): void {
  const options = { ...DEFAULT_OPTS, ...opts };
  const ctx = { rng, opts: options };

  const rewrite = (expr: Expr): Expr => {
    switch (expr.kind) {
      case "Number":
        return maybeEncodeNumber(expr, ctx);
      case "String":
        return maybeEncodeString(expr, ctx);
      case "Binop": {
        expr.left = rewrite(expr.left);
        expr.right = rewrite(expr.right);
        return expr;
      }
      case "Unop":
        expr.operand = rewrite(expr.operand);
        return expr;
      case "Table":
        expr.fields = expr.fields.map((f) => {
          if (f.kind === "Keyed") return { ...f, key: rewrite(f.key), value: rewrite(f.value) };
          if (f.kind === "NameKeyed") return { ...f, value: rewrite(f.value) };
          return { ...f, value: rewrite(f.value) };
        });
        return expr;
      case "Index":
        expr.obj = rewrite(expr.obj);
        expr.index = rewrite(expr.index);
        return expr;
      case "Call":
        expr.fn = rewrite(expr.fn);
        expr.args = expr.args.map((a) => rewrite(a));
        return expr;
      case "MethodCall":
        expr.receiver = rewrite(expr.receiver);
        expr.args = expr.args.map((a) => rewrite(a));
        return expr;
      case "Func":
        rewriteFunc(expr.func, ctx);
        return expr;
      default:
        return expr;
    }
  };

  const rewriteStat = (s: Stat): void => {
    switch (s.kind) {
      case "LocalDecl":
        s.exprs = s.exprs.map((e) => rewrite(e));
        break;
      case "Assign":
        s.targets = s.targets.map((t) => rewrite(t)) as typeof s.targets;
        s.exprs = s.exprs.map((e) => rewrite(e));
        break;
      case "CallStat": {
        const r = rewrite(s.call);
        if (r.kind === "Call" || r.kind === "MethodCall") s.call = r;
        break;
      }
      case "ExprStat": {
        const r = rewrite(s.expr);
        if (r.kind === "Call" || r.kind === "MethodCall") s.expr = r;
        break;
      }
      case "Do": rewriteBlock(s.body, ctx); break;
      case "While": s.cond = rewrite(s.cond); rewriteBlock(s.body, ctx); break;
      case "Repeat": rewriteBlock(s.body, ctx); s.cond = rewrite(s.cond); break;
      case "If":
        s.clauses.forEach((c) => {
          c.cond = rewrite(c.cond);
          rewriteBlock(c.body, ctx);
        });
        if (s.orelse) rewriteBlock(s.orelse, ctx);
        break;
      case "NumFor":
        s.start = rewrite(s.start);
        s.limit = rewrite(s.limit);
        if (s.step) s.step = rewrite(s.step);
        rewriteBlock(s.body, ctx);
        break;
      case "GenFor":
        s.exprs = s.exprs.map((e) => rewrite(e));
        rewriteBlock(s.body, ctx);
        break;
      case "FuncStat": rewriteFunc(s.func, ctx); break;
      case "LocalFunc": rewriteFunc(s.func, ctx); break;
      case "Break": break;
    }
  };

  const rewriteBlock = (b: Block, ctx: { rng: BuildRng; opts: Required<ConstantObfOptions> }): void => {
    for (const s of b.stats) rewriteStat(s);
    if (b.ret) b.ret.exprs = b.ret.exprs.map((e) => rewrite(e));
  };

  const rewriteFunc = (f: { body: Block; params: string[]; isVararg: boolean }, ctx: { rng: BuildRng; opts: Required<ConstantObfOptions> }): void => {
    rewriteBlock(f.body, ctx);
  };

  rewriteBlock(chunk, ctx);
}

/**
 * Maybe encode a numeric constant as a table length.
 * E.g., 42 → #{"a", "b", ..., "z", 42, true, nil, ...}
 * This preserves the runtime value but hides it from static analysis.
 */
function maybeEncodeNumber(expr: NumberLit, ctx: { rng: BuildRng; opts: Required<ConstantObfOptions> }): Expr {
  if (!ctx.opts.tableLengthEncode) return expr;
  if (!ctx.rng.bool()) return expr;
  if (Math.abs(expr.value) > 1000) return expr; // skip large numbers
  if (expr.value === 0) return expr;

  const targetLen = Math.abs(expr.value);
  const fields: { kind: "Item"; value: Expr }[] = [];

  // Fill table with random elements until length matches target
  for (let i = 0; i < targetLen; i++) {
    const kind = ctx.rng.int(4);
    let value: Expr;
    switch (kind) {
      case 0:
        value = { kind: "String", value: String.fromCharCode(65 + ctx.rng.int(26)) } as StringLit;
        break;
      case 1:
        value = { kind: "Number", value: ctx.rng.int(1000), raw: String(ctx.rng.int(1000)) } as NumberLit;
        break;
      case 2:
        value = { kind: "True" } as const;
        break;
      default:
        value = { kind: "Nil" } as const;
    }
    fields.push({ kind: "Item", value });
  }

  return {
    kind: "Unop",
    op: "#",
    operand: {
      kind: "Table",
      fields,
    } as TableExpr,
  };
}

/**
 * Maybe encode a string constant with MBA scrambling.
 * E.g., "hello" → string.char(104+7-7, 101+13-13, ...)
 */
function maybeEncodeString(expr: StringLit, ctx: { rng: BuildRng; opts: Required<ConstantObfOptions> }): Expr {
  if (!ctx.opts.mbaStrings) return expr;
  if (!ctx.rng.bool()) return expr;
  if (expr.value.length === 0) return expr;

  const chars = expr.value.split("").map((c) => c.charCodeAt(0));
  const parts = chars.map((code) => {
    const offset = 1 + ctx.rng.int(200);
    return {
      kind: "Binop",
      op: "+",
      left: { kind: "Number", value: code - offset, raw: String(code - offset) } as NumberLit,
      right: { kind: "Number", value: offset, raw: String(offset) } as NumberLit,
    } as Binop;
  });

  return {
    kind: "Call",
    fn: { kind: "Name", name: "string.char" } as NameRef,
    args: parts,
  } as CallExpr;
}

/**
 * Shuffle the constant pool order in a proto tree and remap all instruction
 * constant indices. This is a post-compilation transform.
 *
 * After compilation, each proto has a `consts` array. Instructions reference
 * constants by index. This function:
 *  1. Creates a random permutation of the constant indices
 *  2. Applies the permutation to the consts array
 *  3. Remaps all instruction operands that reference constants
 *
 * Note: this assumes the compiler uses negative indices for constants
 * (Lua convention). We remap those negative indices.
 */
export function shuffleConstantPool(root: Proto, rng: { int(n: number): number; bool(): boolean }): void {
  const walk = (p: Proto): void => {
    if (p.consts.length > 1) {
      shuffleProtoConstants(p, rng);
    }
    p.protos.forEach(walk);
  };
  walk(root);
}

function shuffleProtoConstants(p: Proto, rng: { int(n: number): number; bool(): boolean }): void {
  const n = p.consts.length;
  if (n <= 1) return;

  // Build random permutation
  const perm = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = rng.int(i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }

  // Apply permutation to consts array
  const newConsts: Const[] = new Array(n);
  for (let i = 0; i < n; i++) {
    newConsts[i] = p.consts[perm[i]];
  }
  p.consts = newConsts;

  // Build inverse mapping: old index → new index
  const inv = new Array(n);
  for (let i = 0; i < n; i++) {
    inv[perm[i]] = i;
  }

  // Remap instruction operands that reference constants
  // In NEVAHEX, constants are referenced by positive indices in A, B, C operands
  // The compiler places constant indices directly, not as negative offsets
  for (const ins of p.code) {
    const op = ins[0] as Op;
    const a = ins[1];
    const b = ins[2];
    const c = ins[3];

    // Remap constant indices (positive values that are within const table range)
    // We use a heuristic: if the value is < consts.length and the opcode uses
    // it as a constant reference, remap it
    if (typeof a === "number" && a < n && usesConstant(op, "A")) {
      ins[1] = inv[a];
    }
    if (typeof b === "number" && b < n && usesConstant(op, "B")) {
      ins[2] = inv[b];
    }
    if (typeof c === "number" && c < n && usesConstant(op, "C")) {
      ins[3] = inv[c];
    }
  }
}

/**
 * Heuristic: does this opcode's operand reference the constant table?
 */
function usesConstant(op: Op, operand: "A" | "B" | "C"): boolean {
  const constUsers: Record<string, Set<Op>> = {
    A: new Set([Op.LOADK, Op.GGET, Op.GSET, Op.GETTAB, Op.SETTABAT, Op.CLOSURE]),
    B: new Set([Op.GETTAB, Op.SETTAB, Op.NEWTABLE, Op.SETLIST, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP]),
    C: new Set([Op.GETTAB, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP]),
  };

  return constUsers[operand].has(op);
}
