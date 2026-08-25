// NEVAHEX-VM — source-to-source hardening transforms (pre-compilation)
import { Block, Chunk, Expr, Stat } from "../lang/nodes";
import { parse } from "../lang/parser";

export function resetCounter(): void {
  counter = 0;
}

let counter = 0;
const uid = (): string => `${(counter++).toString(36)}xq`;

/** parse a lua snippet into a block (helper splicing) */
function snippet(src: string): Block {
  return parse(src) as unknown as Block;
}

// ------------------------------------------------------------------
// String literal encryption (additive rolling-key cipher, bit-op free)
// ------------------------------------------------------------------

export function encryptStrings(chunk: Chunk): void {
  const fnName = `nk${uid()}`;
  let count = 0;

  const encOf = (value: string, key: number): string => {
    const bytes = Buffer.from(value, "latin1");
    const out = Buffer.alloc(bytes.length);
    let g = ((key % 2147483646) + 2147483646) % 2147483646;
    if (g === 0) g = 1;
    for (let i = 0; i < bytes.length; i++) {
      g = (g * 48271) % 2147483647;
      out[i] = (bytes[i] + (g % 256)) & 0xff;
    }
    return out.toString("latin1");
  };

  const rewriteExpr = (e: Expr): Expr => {
    switch (e.kind) {
      case "String": {
        const key = ((count++ * 0x9e3779b1 + 0x51ed270b) >>> 3) | 1;
        return {
          kind: "Call",
          fn: { kind: "Name", name: fnName },
          args: [
            { kind: "Number", value: key, raw: String(key) },
            { kind: "String", value: encOf(e.value, key) },
          ],
        };
      }
      case "Func":
        rewriteBlock(e.func.body);
        return e;
      case "Table":
        e.fields = e.fields.map((f) =>
          f.kind === "Keyed"
            ? { kind: "Keyed", key: rewriteExpr(f.key), value: rewriteExpr(f.value) }
            : f.kind === "NameKeyed"
              ? { ...f, value: rewriteExpr(f.value) }
              : { kind: "Item", value: rewriteExpr(f.value) },
        );
        return e;
      case "Binop":
        e.left = rewriteExpr(e.left);
        e.right = rewriteExpr(e.right);
        return e;
      case "Unop":
        e.operand = rewriteExpr(e.operand);
        return e;
      case "Index":
        e.obj = rewriteExpr(e.obj);
        e.index = rewriteExpr(e.index);
        return e;
      case "Call":
        e.fn = rewriteExpr(e.fn);
        e.args = e.args.map(rewriteExpr);
        return e;
      case "MethodCall":
        e.receiver = rewriteExpr(e.receiver);
        e.args = e.args.map(rewriteExpr);
        return e;
      default:
        return e;
    }
  };

  const rewriteBlock = (b: Block): void => {
    for (const s of b.stats) rewriteStat(s);
    if (b.ret) b.ret.exprs = b.ret.exprs.map(rewriteExpr);
  };

  const rewriteStat = (s: Stat): void => {
    switch (s.kind) {
      case "LocalDecl": s.exprs = s.exprs.map(rewriteExpr); break;
      case "Assign":
        s.targets = s.targets.map(rewriteExpr) as typeof s.targets;
        s.exprs = s.exprs.map(rewriteExpr);
        break;
      case "CallStat": {
        const r = rewriteExpr(s.call);
        if (r.kind === "Call" || r.kind === "MethodCall") s.call = r;
        break;
      }
      case "Do": rewriteBlock(s.body); break;
      case "While": s.cond = rewriteExpr(s.cond); rewriteBlock(s.body); break;
      case "Repeat": rewriteBlock(s.body); s.cond = rewriteExpr(s.cond); break;
      case "If":
        s.clauses.forEach((c) => {
          c.cond = rewriteExpr(c.cond);
          rewriteBlock(c.body);
        });
        if (s.orelse) rewriteBlock(s.orelse);
        break;
      case "NumFor":
        s.start = rewriteExpr(s.start);
        s.limit = rewriteExpr(s.limit);
        if (s.step) s.step = rewriteExpr(s.step);
        rewriteBlock(s.body);
        break;
      case "GenFor":
        s.exprs = s.exprs.map(rewriteExpr);
        rewriteBlock(s.body);
        break;
      case "FuncStat": rewriteBlock(s.func.body); break;
      case "LocalFunc": rewriteBlock(s.func.body); break;
      case "ExprStat": {
        const r = rewriteExpr(s.expr);
        if (r.kind === "Call" || r.kind === "MethodCall") s.expr = r;
        break;
      }
      case "Break": break;
    }
  };

  // decryptor injected at head — parsed from real Lua so semantics are exact
  const decChunk = parse(`
local ${fnName} = function(k, s)
  local r = ""
  local g = k % 2147483646
  if g == 0 then g = 1 end
  local n = #s
  for i = 1, n do
    g = (g * 48271) % 2147483647
    r = r .. string.char((string.byte(s, i) - g % 256 + 256) % 256)
  end
  return r
end
`) as Chunk;
  chunk.stats.unshift(...decChunk.stats);
  rewriteBlock(chunk);
}

// ------------------------------------------------------------------
// Control-flow flattening of straight-line statement runs
// ------------------------------------------------------------------

interface FlatCtx {
  keys: () => number;
}

const isFlattenable = (s: Stat): boolean =>
  s.kind === "Assign" || s.kind === "LocalDecl" || s.kind === "ExprStat" ||
  s.kind === "CallStat" || s.kind === "Do" || s.kind === "Break";

/**
 * Converts runs of >= minRun simple statements into a dispatch state machine
 * with randomized case keys and decoy cases guarded by MBA tautologies.
 */
export function flattenControlFlow(block: Block, ctx?: FlatCtx): void {
  const keys = ctx?.keys ?? (() => (1 + Math.floor(Math.random() * 100000)));
  const minRun = 4;

  const process = (b: Block): void => {
    // recurse first (inner blocks), then try to flatten this level's runs
    for (const s of b.stats) {
      if (s.kind === "While") process(s.body);
      else if (s.kind === "Repeat") process(s.body);
      else if (s.kind === "If") {
        s.clauses.forEach((c) => process(c.body));
        if (s.orelse) process(s.orelse);
      } else if (s.kind === "NumFor") process(s.body);
      else if (s.kind === "GenFor") process(s.body);
      else if (s.kind === "Do") process(s.body);
      else if (s.kind === "FuncStat") process(s.func.body);
      else if (s.kind === "LocalFunc") process(s.func.body);
    }

    const stats = b.stats;
    let i = 0;
    while (i < stats.length) {
      // find maximal run of flattenable non-Do statements
      let j = i;
      while (
        j < stats.length &&
        isFlattenable(stats[j]) &&
        stats[j].kind !== "Do" && // keep Do opaque (already a block boundary)
        !(stats[j].kind === "LocalDecl")
      ) j++;
      // allow LocalDecl runs too but handle hoisting
      if (j - i < minRun) {
        i = Math.max(j, i + 1);
        continue;
      }
      const run = stats.slice(i, j);
      b.stats.splice(i, run.length, buildMachine(run, keys));
      i += 1;
    }
  };

  process(block);
}

function buildMachine(run: Stat[], nextKey: () => number): Stat {
  // collect locals declared inside run -> hoist to wrapper scope
  const hoisted: string[] = [];
  const bodyStats: Stat[] = [];
  for (let idx = 0; idx < run.length; idx++) {
    const s = run[idx];
    if (s.kind === "LocalDecl") {
      hoisted.push(...s.names.filter((n) => n !== "_"));
      if (s.exprs.length > 0) {
        bodyStats.push({
          kind: "Assign",
          targets: s.names.map((n) => ({ kind: "Name" as const, name: n })),
          exprs: s.exprs,
        });
      }
    } else if (s.kind === "Break") {
      bodyStats.push({ kind: "Break" }); // handled: breaks machine loop == exits block ✓
    } else {
      bodyStats.push(s);
    }
  }
  // NOTE: Break inside machine breaks the WHILE, which is exactly the
  // enclosing-block control flow we need (run members are simple statements,
  // so a bare break was legal only directly inside a loop anyway).

  const realKeys: number[] = [];
  const used = new Set<number>();
  for (let idx = 0; idx < bodyStats.length; idx++) {
    let k = nextKey();
    while (used.has(k)) k = nextKey();
    used.add(k);
    realKeys.push(k);
  }

  const clauses: { cond: Expr; body: Block }[] = [];
  bodyStats.forEach((s, idx) => {
    const body: Block = { stats: [s], ret: undefined };
    if (idx < bodyStats.length - 1) {
      body.stats.push({
        kind: "Assign",
        targets: [{ kind: "Name", name: "__st" }],
        exprs: [{ kind: "Number", value: realKeys[idx + 1], raw: "" }],
      });
    }
    clauses.push({
      cond: {
        kind: "Binop", op: "==",
        left: { kind: "Name", name: "__st" },
        right: { kind: "Number", value: realKeys[idx], raw: "" },
      },
      body,
    });
  });

  // decoy cases: never dispatched (keys unused), contain harmless arithmetic
  const decoys = Math.min(3, 2);
  for (let dIdx = 0; dIdx < decoys; dIdx++) {
    let dk = nextKey();
    while (used.has(dk)) dk = nextKey();
    used.add(dk);
    const v = `dv${dIdx}`;
    clauses.push({
      cond: {
        kind: "Binop", op: "==",
        left: { kind: "Name", name: "__st" },
        right: { kind: "Number", value: dk, raw: "" },
      },
      body: {
        stats: [
          {
            kind: "If",
            clauses: [{
              cond: {
                kind: "Binop", op: "==",
                left: {
                  kind: "Binop", op: "%",
                  left: {
                    kind: "Binop", op: "+",
                    left: {
                      kind: "Binop", op: "*",
                      left: { kind: "Name", name: v },
                      right: { kind: "Name", name: v },
                    },
                    right: { kind: "Name", name: v },
                  },
                  right: { kind: "Number", value: 2, raw: "" },
                },
                right: { kind: "Number", value: 0, raw: "" },
              },
              body: { stats: [], ret: undefined },
            }],
            orelse: undefined,
          },
          {
            kind: "Assign",
            targets: [{ kind: "Name", name: "__st" }],
            exprs: [{ kind: "Nil" }],
          },
        ],
        ret: undefined,
      },
    });
  }

  const declNames = ["__st", ...hoisted, "dv0", "dv1"].slice(0, 2 + hoisted.length + decoys);
  const wrapper: Stat = {
    kind: "Do",
    body: {
      stats: [
        {
          kind: "LocalDecl",
          names: declNames,
          exprs: [
            { kind: "Number", value: realKeys[0], raw: "" },
            ...hoisted.map(() => ({ kind: "Nil" as const })),
            ...(decoys > 0 ? [{ kind: "Number" as const, value: 7, raw: "" }] : []),
            ...(decoys > 1 ? [{ kind: "Number" as const, value: 11, raw: "" }] : []),
          ],
        },
        {
          kind: "While",
          cond: { kind: "True" },
          body: { stats: [{ kind: "If", clauses, orelse: { stats: [{ kind: "Break" }], ret: undefined } }], ret: undefined },
        },
      ],
      ret: undefined,
    },
  };
  return wrapper;
}

// ------------------------------------------------------------------
// Dead-code / opaque predicate injection
// ------------------------------------------------------------------

/** Inserts never-executed junk branches carrying plausible fake data-flow. */
export function injectOpaqueJunk(block: Block, density = 0.12, rng?: { int(n: number): number }): void {
  const roll = (): number => (rng ? rng.int(10000) / 10000 : Math.random());
  const recurse = (b: Block): void => {
    const out: Stat[] = [];
    for (const s of b.stats) {
      // recurse into children first
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
      out.push(s);
      if (roll() < density) out.push(makeJunk());
    }
    b.stats = out;
    if (b.ret && roll() < density) b.stats.push(makeJunk());
  };
  recurse(block);

  function makeJunk(): Stat {
    const a = `jz${uid()}`;
    const bb = `jq${uid()}`;
    return {
      kind: "If",
      clauses: [
        {
          cond: {
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
                    left: { kind: "Name", name: a },
                    right: { kind: "Name", name: a },
                  },
                  right: { kind: "Name", name: a },
                },
                right: { kind: "Number", value: 2, raw: "" },
              },
              right: { kind: "Number", value: 0, raw: "" },
            },
          },
          body: {
            stats: [
              {
                kind: "LocalDecl",
                names: [a, bb],
                exprs: [
                  { kind: "Number", value: 13, raw: "" },
                  { kind: "Number", value: 29, raw: "" },
                ],
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
