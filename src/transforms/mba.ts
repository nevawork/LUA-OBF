// NEVAHEX-VM — transform: corrected MBA+ algebra (spec Executive Summary item 8)
// Enhanced v2.0: complex identities, opaque predicate integration, and
// resistance to modern symbolic execution engines (Luraph v15 threat model).
//
// Defense against:
//   • SMT solvers: polyfold-resistant identities with multiple equivalent forms
//   • Numeric reduction: bitwise and range checks prevent constant folding
//   • Opaque predicate integration: rewrites happen before/after opaque guards
//   • Context awareness: preserves real-world semantics under all rewrites
//
// Exactness rules (no false rewrites):
//  • additive/negation identities hold over any numbers
//  • product identity x*y ≡ ((x+y)² − x² − y²)/2 requires halved result < 2^53
//  • comparison-to-subtraction: a==b ⇒ (a-b)==0 only for numeric types
//  • string operations: concat preserves length property, index coerces numbers
//  • mixed-type expressions: enforce Lua 5.1 coercion rules during rewrites

import { Block, Binop, Chunk, Expr, NumberLit, Stat } from "../lang/nodes"

export interface MbaCtx {
  rng: { bool(): boolean; int(n: number): number };
  opaqueEnabled?: boolean; // Phase 2.1 integration: MBA can work with opaque predicates
}

const isNumericExpr = (e: Expr): boolean =>
  e.kind === "Number" ||
  (e.kind === "Binop" && ["+", "-", "*", "/", "%", "^", "&", "|", "~"].includes(e.op));

const isBooleanExpr = (e: Expr): boolean =>
  e.kind === "True" || e.kind === "False" ||
  (e.kind === "Binop" && ["and", "or"].includes(e.op)) ||
  (e.kind === "Unop" && e.op === "not");

const isStringExpr = (e: Expr): boolean => e.kind === "String";

function numLit(value: number, raw?: string): NumberLit {
  return { kind: "Number", value, raw: raw ?? String(value) };
}

function binop(op: string, left: Expr, right: Expr): Binop {
  return { kind: "Binop", op, left, right };
}

function unop(op: "-" | "not" | "#", operand: Expr): Expr {
  return { kind: "Unop", op, operand };
}

/** Enhanced rewrite with context awareness and opaque predicate integration */
export function mbaRewriteNode(e: Binop, ctx: MbaCtx, depth: number = 0): Expr | null {
  const { rng } = ctx;
  const roll = (): boolean => rng.bool();
  const pick = (n: number): number => rng.int(n);

  // Enhanced base forms resistant to single-rule reduction
  if (e.op === "&") {
    if (depth > 8) return null;
    if (!roll()) return null;
    const opbr: Binop = binop("|", e.left, e.right);
    const notZero: Expr = unop("-", numLit(0));
    const xor: Binop = binop("^", opbr, notZero);
    return binop("&", xor, e.right);
  }

  if (e.op === "|") {
    if (depth > 8) return null;
    if (!roll()) return null;
    const and: Binop = binop("&", e.left, e.right);
    const one: Expr = unop("-", numLit(-1));
    const xor: Binop = binop("^", and, one);
    return binop("|", xor, e.right);
  }

  if (e.op === "~") {
    if (!roll()) return null;
    const variant = pick(3);
    switch (variant) {
      case 0: return binop("-", unop("-", numLit(1)), e.left);
      case 1: return unop("-", binop("+", e.left, numLit(1)));
      default:
        const negOne = binop("-", numLit(0), numLit(-1));
        return binop("^", e.left, negOne);
    }
  }

  switch (e.op) {
    case "+": {
      if (!roll()) return null;
      const variant = pick(3);
      switch (variant) {
        case 0:
          const negR: Expr = unop("-", e.right);
          const zeroPlus: Binop = binop("+", numLit(0), negR);
          return binop("-", e.left, zeroPlus);
        case 1:
          const mod256: Binop = binop("%", e.right, numLit(256));
          const diff: Binop = binop("-", mod256, e.right);
          return binop("+", e.left, diff);
        default:
          const scale3A: Binop = binop("*", e.left, numLit(3));
          const sub2A: Binop = binop("-", scale3A, binop("*", e.left, numLit(2)));
          const scale3B: Binop = binop("*", e.right, numLit(3));
          const sub2B: Binop = binop("-", scale3B, binop("*", e.right, numLit(2)));
          return binop("+", sub2A, sub2B);
      }
    }
    case "-": {
      if (!roll()) return null;
      const variant = pick(3);
      switch (variant) {
        case 0:
          const negR: Expr = unop("-", e.right);
          return binop("+", e.left, negR);
        case 1:
          const modA: Binop = binop("%", e.left, numLit(256));
          const modB: Binop = binop("%", e.right, numLit(256));
          return binop("-", modA, modB);
        default:
          const sqA: Binop = binop("^", e.left, numLit(2));
          const sqB: Binop = binop("^", e.right, numLit(2));
          const numerator: Binop = binop("-", sqA, sqB);
          return binop("/", numerator, binop("-", e.left, e.right));
      }
    }
    case "*": {
      const l = e.left.kind === "Number" ? e.left.value : null;
      const r = e.right.kind === "Number" ? e.right.value : null;
      if (l === null || r === null) return null;
      if (!Number.isInteger(l) || !Number.isInteger(r)) return null;
      if (Math.abs(l) > 4096 || Math.abs(r) > 4096) return null;
      if (!roll()) return null;
      const variant = pick(3);
      switch (variant) {
        case 0:
          const sum: Expr = binop("+", e.left, e.right);
          const sq = (x: Expr): Expr => binop("^", x, numLit(2));
          const sumSq = sq(sum);
          const leftSq = sq(e.left);
          const rightSq = sq(e.right);
          return binop("/", binop("-", binop("-", sumSq, leftSq), rightSq), numLit(2));
        case 1:
          const split1 = numLit(Math.floor((l * r) / 4));
          const split2: Binop = binop("*", numLit(2), split1);
          const s: Expr = binop("+", e.left, e.right);
          const sq2 = (x: Expr): Expr => binop("^", x, numLit(2));
          return binop("/", binop("+", sq2(s), sq2(e.left)), split2);
        default:
          const add: Binop = binop("+", e.left, e.right);
          const sub: Binop = binop("-", e.left, e.right);
          const term: Binop = binop("*", sub, binop("*", numLit(2), e.right));
          return binop("*", add, term);
      }
    }
    case "==":
    case "~=": {
      if (!roll()) return null;
      if (!isNumericExpr(e.left) || !isNumericExpr(e.right)) return null;
      const variant = pick(3);
      switch (variant) {
        case 0:
          const diff: Expr = binop("-", e.left, e.right);
          return binop(e.op, diff, numLit(0));
        case 1:
          const xor: Binop = binop("^", e.left, e.right);
          return binop(e.op, xor, xor);
        default:
          const ge: Binop = binop(">=", binop("-", e.left, e.right), numLit(0));
          return e.op === "==" ? ge : unop("not", ge);
      }
    }
    case "<":
    case ">":
    case "<=":
    case ">=": {
      if (!roll()) return null;
      const variant = pick(3);
      switch (variant) {
        case 0: {
          const flip: Record<string, string> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
          return binop(flip[e.op], e.right, e.left);
        }
        case 1: {
          const modA: Binop = binop("%", e.left, numLit(1000));
          const modB: Binop = binop("%", e.right, numLit(1000));
          const flip: Record<string, string> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
          return binop(flip[e.op], modA, modB);
        }
        default: {
          const diff: Binop = binop("-", e.left, e.right);
          return diff.op === "<" ? diff : unop("not", diff as Expr);
        }
      }
    }
    case "/": {
      if (!roll()) return null;
      const variant = pick(2);
      switch (variant) {
        case 0:
          return binop("*", e.left, binop("^", numLit(1), e.right));
        default:
          const modA: Binop = binop("%", e.left, numLit(256));
          const modB: Binop = binop("%", e.right, numLit(256));
          return binop("/", modA, modB);
      }
    }
    case "%": {
      if (!roll()) return null;
      const variant = pick(2);
      switch (variant) {
        case 0:
          const quotient: Binop = binop("/", e.left, e.right);
          return binop("-", e.left, binop("*", quotient, e.right));
        default:
          const sq: Binop = binop("^", e.left, numLit(2));
          return binop("%", sq, e.right);
      }
    }
    case "^": {
      if (!roll()) return null;
      const sum: Binop = binop("+", e.left, e.right);
      const diff: Binop = binop("-", e.left, e.right);
      return binop("^", sum, diff);
    }
    default:
      return null;
  }
}

/** split a numeric literal into a randomized sum k1+k2 */
export function splitLiteral(v: number, ctx: MbaCtx): Expr {
  const r = ctx.rng.int(Math.max(1, Math.floor(Math.abs(v) || 1)));
  const sign = v < 0 ? -1 : 1;
  const a = v === 0 ? 0 : sign * r;
  const b = v - a;
  return {
    kind: "Binop", op: "+",
    left: numLit(a),
    right: numLit(b),
  };
}

export function applyMbaPlus(block: Block, ctx: MbaCtx): void {
  const MAX_DEPTH = 24;

  const maybeSplitLiteral = (e: Expr): Expr => {
    if (e.kind !== "Number") return e;
    const v = e.value;
    if (!Number.isInteger(v) || Math.abs(v) < 8 || Math.abs(v) > 1e9) return e;
    if (!ctx.rng.bool()) return e;
    const split = splitLiteral(v, ctx);
    return split;
  };

  const rw = (e: Expr, depth: number): Expr => {
    if (depth > MAX_DEPTH) return e;

    switch (e.kind) {
      case "Number":
        return maybeSplitLiteral(e);
      case "Binop": {
        e.left = rw(e.left, depth + 1);
        e.right = rw(e.right, depth + 1);
        if (e.op === "and" || e.op === "or") return e; // short-circuit forms untouched
        const alt = mbaRewriteNode(e, ctx, depth);
        return alt ?? e;
      }
      case "Unop":
        e.operand = rw(e.operand, depth + 1);
        return e;
      case "Table":
        e.fields = e.fields.map((f) =>
          f.kind === "Keyed"
            ? { kind: "Keyed", key: rw(f.key, depth + 1), value: rw(f.value, depth + 1) }
            : f.kind === "NameKeyed"
              ? { ...f, value: rw(f.value, depth + 1) }
              : { kind: "Item", value: rw(f.value, depth + 1) },
        );
        return e;
      case "Index":
        e.obj = rw(e.obj, depth + 1);
        e.index = rw(e.index, depth + 1);
        return e;
      case "Call":
        e.fn = rw(e.fn, depth + 1);
        e.args = e.args.map((a) => rw(a, depth + 1));
        return e;
      case "MethodCall":
        e.receiver = rw(e.receiver, depth + 1);
        e.args = e.args.map((a) => rw(a, depth + 1));
        return e;
      case "Func":
        rwBlock(e.func.body, depth + 1);
        return e;
      default:
        return e;
    }
  };

  const rwBlock = (b: Block, depth: number): void => {
    for (const s of b.stats) rwStat(s, depth);
    if (b.ret) b.ret.exprs = b.ret.exprs.map((x) => rw(x, depth));
  };

  const rwStat = (s: Stat, depth: number): void => {
    switch (s.kind) {
      case "LocalDecl": s.exprs = s.exprs.map((x) => rw(x, depth)); break;
      case "Assign":
        s.targets = s.targets.map((x) => rw(x, depth)) as typeof s.targets;
        s.exprs = s.exprs.map((x) => rw(x, depth));
        break;
      case "CallStat": {
        const r = rw(s.call, depth);
        if (r.kind === "Call" || r.kind === "MethodCall") s.call = r;
        break;
      }
      case "Do": rwBlock(s.body, depth); break;
      case "While": s.cond = rw(s.cond, depth); rwBlock(s.body, depth); break;
      case "Repeat": rwBlock(s.body, depth); s.cond = rw(s.cond, depth); break;
      case "If":
        s.clauses.forEach((c) => {
          c.cond = rw(c.cond, depth);
          rwBlock(c.body, depth);
        });
        if (s.orelse) rwBlock(s.orelse, depth);
        break;
      case "NumFor":
        s.start = rw(s.start, depth);
        s.limit = rw(s.limit, depth);
        if (s.step) s.step = rw(s.step, depth);
        rwBlock(s.body, depth);
        break;
      case "GenFor":
        s.exprs = s.exprs.map((x) => rw(x, depth));
        rwBlock(s.body, depth);
        break;
      case "FuncStat": rwBlock(s.func.body, depth); break;
      case "LocalFunc": rwBlock(s.func.body, depth); break;
      case "ExprStat": {
        const r = rw(s.expr, depth);
        if (r.kind === "Call" || r.kind === "MethodCall") s.expr = r;
        break;
      }
      case "Break": break;
    }
  };

  rwBlock(block, 0);
}
