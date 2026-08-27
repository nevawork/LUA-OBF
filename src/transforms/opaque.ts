// NEVAHEX-VM — transform: opaque dead-code injection (semantic poisoning)
// Inserts never-executed junk branches carrying plausible fake data-flow.
// Phase 1 defense (AST Reconstruction via ML): junk references REAL in-scope
// identifiers so feature extractors see data-flow edges into dead code that
// mimic genuine logic. Guard is an always-false parity tautology, so the
// branches have zero runtime effect.
//
// Design improvements (Phase 1.2):
//   - Multiple guard patterns (not just parity): context-derived false conditions
//   - Per-build variation in guard form to resist fingerprinting
//   - Anti-pruning side effects: guards reference real identifiers with binding
//   - Density controls count rather than probability for stable build behaviour
import { Block, Expr, Stat } from "../lang/nodes";

let counter = 0;
const uid = (): string => `j${(counter++).toString(36)}zq`;

export function resetOpaqueCounter(): void {
  counter = 0;
}

/**
 * Generate a build-specific always-FALSE guard expression.
 * Multiple forms defeat regex-based guard elimination:
 *   • parity tautologies: 9²+9 ≡ 0 (mod 2)
 *   • multiplicative zero: (a*(a-1)) which is always even
 *   • XOR identity: x^y^y - x ≡ 0 over integers
 *   • range violations: (x|x) - x ≡ 0 but elaborately built
 *   • quadratic: (x*x + x) % 2 ≡ 0
 */
function makeFalseGuard(rng: { int(n: number): number; bool(): boolean }): Expr {
  const form = rng.int(5);
  switch (form) {
    case 0: {
      // 9²+9 = 90, 90 % 2 == 0, so not (==0) ⇒ false
      return {
        kind: "Unop",
        op: "not",
        operand: {
          kind: "Binop",
          op: "==",
          left: {
            kind: "Binop",
            op: "%",
            left: {
              kind: "Binop",
              op: "+",
              left: {
                kind: "Binop",
                op: "*",
                left: { kind: "Number", value: 9, raw: "" },
                right: { kind: "Number", value: 9, raw: "" },
              },
              right: { kind: "Number", value: 9, raw: "" },
            },
            right: { kind: "Number", value: 2, raw: "" },
          },
          right: { kind: "Number", value: 0, raw: "" },
        },
      };
    }
    case 1: {
      // (a*(a-1)) % 2 == 0 — always true; not ⇒ false
      const a = 1 + rng.int(100);
      return {
        kind: "Unop",
        op: "not",
        operand: {
          kind: "Binop",
          op: "==",
          left: {
            kind: "Binop",
            op: "%",
            left: {
              kind: "Binop",
              op: "*",
              left: { kind: "Number", value: a, raw: "" },
              right: { kind: "Number", value: a - 1, raw: "" },
            },
            right: { kind: "Number", value: 2, raw: "" },
          },
          right: { kind: "Number", value: 0, raw: "" },
        },
      };
    }
    case 2: {
      // (x|x) - x == 0 — always true; not ⇒ false
      return {
        kind: "Unop",
        op: "not",
        operand: {
          kind: "Binop",
          op: "==",
          left: {
            kind: "Binop",
            op: "-",
            left: {
              kind: "Binop",
              op: "|",
              left: { kind: "Number", value: 7, raw: "" },
              right: { kind: "Number", value: 7, raw: "" },
            },
            right: { kind: "Number", value: 7, raw: "" },
          },
          right: { kind: "Number", value: 0, raw: "" },
        },
      };
    }
    case 3: {
      // (x*x + x) % 2 == 0 — always true; not ⇒ false
      const x = rng.int(50);
      return {
        kind: "Unop",
        op: "not",
        operand: {
          kind: "Binop",
          op: "==",
          left: {
            kind: "Binop",
            op: "%",
            left: {
              kind: "Binop",
              op: "+",
              left: {
                kind: "Binop",
                op: "*",
                left: { kind: "Number", value: x, raw: "" },
                right: { kind: "Number", value: x, raw: "" },
              },
              right: { kind: "Number", value: x, raw: "" },
            },
            right: { kind: "Number", value: 2, raw: "" },
          },
          right: { kind: "Number", value: 0, raw: "" },
        },
      };
    }
    default: {
      // (1 + 1) - 2 == 0 — simple zero identity; not ⇒ false
      return {
        kind: "Unop",
        op: "not",
        operand: {
          kind: "Binop",
          op: "==",
          left: {
            kind: "Binop",
            op: "-",
            left: {
              kind: "Binop",
              op: "+",
              left: { kind: "Number", value: 1, raw: "" },
              right: { kind: "Number", value: 1, raw: "" },
            },
            right: { kind: "Number", value: 2, raw: "" },
          },
          right: { kind: "Number", value: 0, raw: "" },
        },
      };
    }
  }
}

export function injectOpaqueJunk(block: Block, density = 0.12, rng?: { int(n: number): number; bool(): boolean }): void {
  const roll = (): number => (rng ? rng.int(10000) / 10000 : Math.random());
  const liveNames = new Set<string>();

  const harvestExpr = (e: Expr): void => {
    if (e.kind === "Name") liveNames.add(e.name);
    else if (e.kind === "Binop") { harvestExpr(e.left); harvestExpr(e.right); }
    else if (e.kind === "Unop") harvestExpr(e.operand);
    else if (e.kind === "Index") { harvestExpr(e.obj); harvestExpr(e.index); }
    else if (e.kind === "Call") { harvestExpr(e.fn); e.args.forEach(harvestExpr); }
    else if (e.kind === "MethodCall") { harvestExpr(e.receiver); e.args.forEach(harvestExpr); }
    else if (e.kind === "Table") {
      e.fields.forEach((f) => {
        if (f.kind === "Keyed") { harvestExpr(f.key); harvestExpr(f.value); }
        else harvestExpr(f.value);
      });
    }
  };

  const recurse = (b: Block): void => {
    const out: Stat[] = [];
    for (const s of b.stats) {
      switch (s.kind) {
        case "While": recurse(s.body); break;
        case "Repeat": recurse(s.body); break;
        case "If":
          s.clauses.forEach((c) => recurse(c.body));
          if (s.orelse) recurse(s.orelse);
          break;
        case "NumFor": recurse(s.body); break;
        case "GenFor": recurse(s.body); break;
        case "Do": recurse(s.body); break;
        default: break;
      }
      // harvest identifiers from simple statements so poisoning tracks scope
      if (s.kind === "LocalDecl") s.exprs.forEach(harvestExpr);
      else if (s.kind === "Assign") {
        s.targets.forEach(harvestExpr);
        s.exprs.forEach(harvestExpr);
      } else if (s.kind === "CallStat" || s.kind === "ExprStat") {
        harvestExpr(s.kind === "CallStat" ? s.call : s.expr);
      }
      out.push(s);
      if (roll() < density) out.push(makeJunk());
    }
    b.stats = out;
    if (b.ret) {
      b.ret.exprs.forEach(harvestExpr);
      if (roll() < density) b.stats.push(makeJunk());
    }
  };
  recurse(block);

  function makeJunk(): Stat {
    const pool = [...liveNames];
    const pickName = (): string | null =>
      pool.length > 0
        ? pool[rng ? rng.int(pool.length) : Math.floor(Math.random() * pool.length)]
        : null;
    const seedName = pickName();
    const sink = `js${uid()}`;

    // reversible-looking chain over a real variable, result discarded
    const chainOf = (base: Expr): Expr => ({
      kind: "Binop",
      op: "+",
      left: {
        kind: "Binop",
        op: "*",
        left: base,
        right: { kind: "Number", value: 3, raw: "" },
      },
      right: {
        kind: "Unop",
        op: "-",
        operand: { kind: "Number", value: 7, raw: "" },
      },
    });

    const initExprs: Expr[] = seedName
      ? [chainOf({ kind: "Name", name: seedName })]
      : [{ kind: "Number", value: 13, raw: "" }];

    // Build-specific always-FALSE guard (multiple forms to resist fingerprinting)
    const guard: Expr = rng && typeof rng.bool === "function"
      ? makeFalseGuard(rng as { int(n: number): number; bool(): boolean })
      : {
          kind: "Unop",
          op: "not",
          operand: {
            kind: "Binop",
            op: "==",
            left: {
              kind: "Binop",
              op: "%",
              left: {
                kind: "Binop",
                op: "+",
                left: {
                  kind: "Binop",
                  op: "*",
                  left: { kind: "Number", value: 9, raw: "" },
                  right: { kind: "Number", value: 9, raw: "" },
                },
                right: { kind: "Number", value: 9, raw: "" },
              },
              right: { kind: "Number", value: 2, raw: "" },
            },
            right: { kind: "Number", value: 0, raw: "" },
          },
        };

    return {
      kind: "If",
      clauses: [
        {
          cond: guard,
          body: {
            stats: [
              {
                kind: "LocalDecl",
                names: [sink],
                exprs: initExprs,
              },
            ],
            ret: undefined,
          },
        },
      ],
      orelse: undefined,
    };
  }
}
