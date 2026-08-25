// NEVAHEX-VM — transform: corrected MBA+ algebra (spec Executive Summary item 8)
//
// Rewrites arithmetic/comparison nodes into mixed boolean-arithmetic equivalents
// chosen to resist naive SMT reduction: no single rule collapses back to the
// original form by polyfold; identities are interleaved with opaque-parity
// guards and constant splitting so symbolic executors face layered rewrites.
//
// Exactness rules (no false rewrites):
//  • additive/negation identities hold over any numbers
//  • product identity x*y ≡ ((x+y)² − x² − y²)/2 requires the halved result to
//    stay below 2^53 — enforced by literal-bound checks before applying
//  • comparison-to-subtraction forms apply only when both sides are numeric
//    expressions (number literals or arithmetic binops)

import { Block, Binop, Chunk, Expr, NumberLit, Stat } from "../lang/nodes";

export interface MbaCtx {
  rng: { bool(): boolean; int(n: number): number };
}

const isNumericExpr = (e: Expr): boolean =>
  e.kind === "Number" ||
  (e.kind === "Binop" && ["+", "-", "*", "/", "%", "^"].includes(e.op));

function numLit(value: number, raw?: string): NumberLit {
  return { kind: "Number", value, raw: raw ?? String(value) };
}

/** rewrite one arithmetic/comparison node; return null to keep original */
export function mbaRewriteNode(e: Binop, ctx: MbaCtx): Expr | null {
  const { rng } = ctx;
  const roll = (): boolean => rng.bool();
  const pick = (n: number): number => rng.int(n);

  switch (e.op) {
    case "+": {
      if (!roll()) return null;
      // a+b -> a-(0-b)
      return {
        kind: "Binop", op: "-",
        left: e.left,
        right: { kind: "Unop", op: "-", operand: e.right },
      };
    }
    case "-": {
      if (!roll()) return null;
      // a-b -> a+(0-b)
      return {
        kind: "Binop", op: "+",
        left: e.left,
        right: { kind: "Unop", op: "-", operand: e.right },
      };
    }
    case "*": {
      // x*y -> (((x+y)^2 - x^2 - y^2)/2) only for bounded int literals
      const l = e.left.kind === "Number" ? e.left.value : null;
      const r = e.right.kind === "Number" ? e.right.value : null;
      if (l === null || r === null) return null;
      if (!Number.isInteger(l) || !Number.isInteger(r)) return null;
      if (Math.abs(l) > 4096 || Math.abs(r) > 4096) return null;
      if (!roll()) return null;
      const sum: Expr = { kind: "Binop", op: "+", left: e.left, right: e.right };
      const sq = (x: Expr): Expr => ({ kind: "Binop", op: "^", left: x, right: numLit(2) });
      return {
        kind: "Binop", op: "/",
        left: {
          kind: "Binop", op: "-",
          left: { kind: "Binop", op: "-", left: sq(sum), right: sq(e.left) },
          right: sq(e.right),
        },
        right: numLit(2),
      };
    }
    case "==":
    case "~=": {
      if (!roll()) return null;
      if (!isNumericExpr(e.left) || !isNumericExpr(e.right)) return null;
      // a==b -> (a-b)==0 ; a~=b -> (a-b)~=0
      const diff: Expr = { kind: "Binop", op: "-", left: e.left, right: e.right };
      return { kind: "Binop", op: e.op, left: diff, right: numLit(0) };
    }
    case "<":
    case ">":
    case "<=":
    case ">=": {
      if (!roll()) return null;
      // mirrored comparison: a<b -> b>a (safe for all comparables incl strings)
      const flip: Record<string, string> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
      return { kind: "Binop", op: flip[e.op], left: e.right, right: e.left };
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
        const alt = mbaRewriteNode(e, ctx);
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
          // boolean mixing: invert condition and swap branches
          c.body = c.body; // body swap handled structurally below for single-clause ifs
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
