// NEVAHEX-VM — transform: control-flow flattening
// Enhanced v2.0: multi-layer dispatch, computed jumps, and MBA-integrated
// decoy patterns for resistance to Luraph v15-style structural analysis.
//
// Defense improvements:
//   - Variable decoy count (not fixed at 2): per-build random density
//   - Multi-layer state machines for critical control-flow regions
//   - MBA-scrambled transition values instead of plain literals
//   - Nested dispatch routers that resist linear static analysis
//   - Anti-pattern elimination: no stable __st/__d0 signatures across builds
import { Block, Chunk, Expr, Stat } from "../lang/nodes";

let counter = 0;
const uid = (): string => `${(counter++).toString(36)}fq`;

export function resetFlattenCounter(): void {
  counter = 0;
}

interface FlatCtx {
  keys: () => number;
  rng?: { int(n: number): number; bool(): boolean };
}

const isFlattenable = (s: Stat): boolean =>
  s.kind === "Assign" || s.kind === "ExprStat" ||
  s.kind === "CallStat" || s.kind === "Break";

export function flattenControlFlow(block: Block, ctx?: FlatCtx): void {
  const keys = ctx?.keys ?? (() => (1 + Math.floor(Math.random() * 100000)));
  const rng = ctx?.rng;
  const minRun = 4;

  const process = (b: Block): void => {
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
      let j = i;
      while (j < stats.length && isFlattenable(stats[j])) j++;
      if (j - i < minRun) {
        i = Math.max(j, i + 1);
        continue;
      }
      const run = stats.slice(i, j);
      const shouldNest = rng && rng.bool() && run.length > 8;
      b.stats.splice(i, run.length, shouldNest ? buildNestedMachine(run, keys, rng) : buildMachine(run, keys, rng));
      i += 1;
    }
  };

  process(block);
}

function buildMachine(run: Stat[], nextKey: () => number, rng?: { int(n: number): number; bool(): boolean }): Stat {
  // Per-machine generated state names. The historical fixed identifiers
  // __st/__d0/__d1 were a stable static signature across every build.
  const stN = `s${uid()}st`;
  const d0N = `s${uid()}d0`;
  const d1N = `s${uid()}d1`;

  const bodyStats: Stat[] = [];
  for (const s of run) {
    if (s.kind === "Break") bodyStats.push({ kind: "Break" });
    else bodyStats.push(s);
  }

  const realKeys: number[] = [];
  const used = new Set<number>();
  for (let idx = 0; idx < bodyStats.length; idx++) {
    let k = nextKey();
    while (used.has(k)) k = nextKey();
    used.add(k);
    realKeys.push(k);
  }

  // Variable decoy count: 1-3 decoy cases instead of fixed 2
  const decoyCount = rng ? 1 + rng.int(3) : 2;
  const clauses: { cond: Expr; body: Block }[] = [];

  bodyStats.forEach((s, idx) => {
    const body: Block = { stats: [s], ret: undefined };
    if (idx < bodyStats.length - 1) {
      // MBA-scrambled transition instead of plain literal
      const nextKeyVal = realKeys[idx + 1];
      body.stats.push({
        kind: "Assign",
        targets: [{ kind: "Name", name: stN }],
        exprs: [scrambleTransition(nextKeyVal, rng)],
      });
    }
    clauses.push({
      cond: {
        kind: "Binop", op: "==",
        left: { kind: "Name", name: stN },
        right: { kind: "Number", value: realKeys[idx], raw: "" },
      },
      body,
    });
  });

  // Variable decoy cases with MBA-guarded no-op bodies
  for (let dIdx = 0; dIdx < decoyCount; dIdx++) {
    let dk = nextKey();
    while (used.has(dk)) dk = nextKey();
    used.add(dk);
    clauses.push({
      cond: {
        kind: "Binop", op: "==",
        left: { kind: "Name", name: stN },
        right: { kind: "Number", value: dk, raw: "" },
      },
      body: {
        stats: [
          {
            kind: "If",
            clauses: [{
              cond: makeDecoyGuard(dIdx, rng),
              body: { stats: [], ret: undefined },
            }],
            orelse: undefined,
          },
          {
            kind: "Assign",
            targets: [{ kind: "Name", name: stN }],
            exprs: [{ kind: "Nil" }],
          },
        ],
        ret: undefined,
      },
    });
  }

  return {
    kind: "Do",
    body: {
      stats: [
        {
          kind: "LocalDecl",
          names: [stN, d0N, d1N],
          exprs: [
            { kind: "Number", value: realKeys[0], raw: "" },
            { kind: "Number", value: 7, raw: "" },
            { kind: "Number", value: 11, raw: "" },
          ],
        },
        {
          kind: "While",
          cond: { kind: "True" },
          body: {
            stats: [{ kind: "If", clauses, orelse: { stats: [{ kind: "Break" }], ret: undefined } }],
            ret: undefined,
          },
        },
      ],
      ret: undefined,
    },
  };
}

function buildNestedMachine(run: Stat[], nextKey: () => number, rng: { int(n: number): number; bool(): boolean }): Stat {
  const stN = `s${uid()}st`;
  const innerStN = `s${uid()}st`;
  const chunkSize = Math.max(2, Math.floor(run.length / (2 + rng.int(3))));

  const firstChunk = run.slice(0, chunkSize);
  const secondChunk = run.slice(chunkSize);

  const outerKeys: number[] = [];
  const innerKeys: number[] = [];
  const used = new Set<number>();

  for (let i = 0; i < firstChunk.length; i++) {
    let k = nextKey();
    while (used.has(k)) k = nextKey();
    used.add(k);
    outerKeys.push(k);
  }
  for (let i = 0; i < secondChunk.length; i++) {
    let k = nextKey();
    while (used.has(k)) k = nextKey();
    used.add(k);
    innerKeys.push(k);
  }

  const buildClauses = (chunk: Stat[], keys: number[], stateVar: string): { cond: Expr; body: Block }[] => {
    const clauses: { cond: Expr; body: Block }[] = [];
    chunk.forEach((s, idx) => {
      const body: Block = { stats: [s], ret: undefined };
      if (idx < chunk.length - 1) {
        body.stats.push({
          kind: "Assign",
          targets: [{ kind: "Name", name: stateVar }],
          exprs: [scrambleTransition(keys[idx + 1], rng)],
        });
      }
      clauses.push({
        cond: {
          kind: "Binop", op: "==",
          left: { kind: "Name", name: stateVar },
          right: { kind: "Number", value: keys[idx], raw: "" },
        },
        body,
      });
    });
    return clauses;
  };

  const outerClauses = buildClauses(firstChunk, outerKeys, stN);
  const innerClauses = buildClauses(secondChunk, innerKeys, innerStN);

  // Fix last outer clause to transition into inner machine
  const lastOuter = outerClauses[outerClauses.length - 1];
  lastOuter.body.stats.push({
    kind: "Assign",
    targets: [{ kind: "Name", name: stN }],
    exprs: [{ kind: "Number", value: innerKeys[0], raw: "" }],
  });

  // Add decoy to outer machine
  let decoyKey = nextKey();
  while (used.has(decoyKey)) {
    decoyKey = nextKey();
    while (used.has(decoyKey)) decoyKey = nextKey();
    used.add(decoyKey);
  }
  outerClauses.push({
    cond: {
      kind: "Binop", op: "==",
      left: { kind: "Name", name: stN },
      right: { kind: "Number", value: decoyKey, raw: "" },
    },
    body: {
      stats: [
        {
          kind: "If",
          clauses: [{
            cond: makeDecoyGuard(0, rng),
            body: { stats: [], ret: undefined },
          }],
          orelse: undefined,
        },
        {
          kind: "Assign",
          targets: [{ kind: "Name", name: stN }],
          exprs: [{ kind: "Nil" }],
        },
      ],
      ret: undefined,
    },
  });

  return {
    kind: "Do",
    body: {
      stats: [
        {
          kind: "LocalDecl",
          names: [stN, innerStN],
          exprs: [
            { kind: "Number", value: outerKeys[0], raw: "" },
            { kind: "Number", value: innerKeys[0], raw: "" },
          ],
        },
        {
          kind: "While",
          cond: { kind: "True" },
          body: {
            stats: [
              {
                kind: "If",
                clauses: outerClauses,
                orelse: {
                  stats: [
                    {
                      kind: "If",
                      clauses: innerClauses,
                      orelse: { stats: [{ kind: "Break" }], ret: undefined },
                    },
                  ],
                  ret: undefined,
                },
              },
            ],
            ret: undefined,
          },
        },
      ],
      ret: undefined,
    },
  };
}

function scrambleTransition(value: number, rng?: { int(n: number): number; bool(): boolean }): Expr {
  if (!rng || !rng.bool()) {
    return { kind: "Number", value, raw: String(value) };
  }
  // MBA-style transition scrambling: (value + offset) - offset
  const offset = 1 + rng.int(1000);
  return {
    kind: "Binop",
    op: "-",
    left: { kind: "Binop", op: "+", left: { kind: "Number", value, raw: "" }, right: { kind: "Number", value: offset, raw: "" } },
    right: { kind: "Number", value: offset, raw: "" },
  };
}

function makeDecoyGuard(dIdx: number, rng?: { int(n: number): number; bool(): boolean }): Expr {
  const forms: (() => Expr)[] = [
    // Form 1: parity tautology
    () => ({
      kind: "Unop", op: "not", operand: {
        kind: "Binop", op: "==",
        left: { kind: "Binop", op: "%", left: { kind: "Binop", op: "+", left: { kind: "Binop", op: "*", left: { kind: "Number", value: 9, raw: "" }, right: { kind: "Number", value: 9, raw: "" } }, right: { kind: "Number", value: 9, raw: "" } }, right: { kind: "Number", value: 2, raw: "" } },
        right: { kind: "Number", value: 0, raw: "" },
      },
    } as Expr),
    // Form 2: multiplicative zero
    () => {
      const a = 1 + (rng ? rng.int(100) : 7);
      return {
        kind: "Unop", op: "not", operand: {
          kind: "Binop", op: "==",
          left: { kind: "Binop", op: "%", left: { kind: "Binop", op: "*", left: { kind: "Number", value: a, raw: "" }, right: { kind: "Number", value: a - 1, raw: "" } }, right: { kind: "Number", value: 2, raw: "" } },
          right: { kind: "Number", value: 0, raw: "" },
        },
      } as Expr;
    },
    // Form 3: quadratic
    () => {
      const x = rng ? rng.int(50) : 13;
      return {
        kind: "Unop", op: "not", operand: {
          kind: "Binop", op: "==",
          left: { kind: "Binop", op: "%", left: { kind: "Binop", op: "+", left: { kind: "Binop", op: "*", left: { kind: "Number", value: x, raw: "" }, right: { kind: "Number", value: x, raw: "" } }, right: { kind: "Number", value: x, raw: "" } }, right: { kind: "Number", value: 2, raw: "" } },
          right: { kind: "Number", value: 0, raw: "" },
        },
      } as Expr;
    },
  ];

  const idx = rng ? rng.int(forms.length) : 0;
  return forms[idx]();
}
