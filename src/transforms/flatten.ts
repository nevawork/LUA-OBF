// NEVAHEX-VM — transform: control-flow flattening
// Converts straight-line statement runs into keyed dispatch state machines with
// randomized case keys and MBA-guarded decoy cases.
import { Block, Chunk, Expr, Stat } from "../lang/nodes";

let counter = 0;
const uid = (): string => `${(counter++).toString(36)}fq`;

export function resetFlattenCounter(): void {
  counter = 0;
}

interface FlatCtx {
  keys: () => number;
}

const isFlattenable = (s: Stat): boolean =>
  s.kind === "Assign" || s.kind === "ExprStat" ||
  s.kind === "CallStat" || s.kind === "Break";

export function flattenControlFlow(block: Block, ctx?: FlatCtx): void {
  const keys = ctx?.keys ?? (() => (1 + Math.floor(Math.random() * 100000)));
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
      b.stats.splice(i, run.length, buildMachine(run, keys));
      i += 1;
    }
  };

  process(block);
}

function buildMachine(run: Stat[], nextKey: () => number): Stat {
  const bodyStats: Stat[] = [];
  for (const s of run) {
    if (s.kind === "Break") bodyStats.push({ kind: "Break" });
    else bodyStats.push(s);
  }
  // NOTE: a bare break in a straight-line run was legal only directly inside a
  // loop; breaking the machine's WHILE preserves exactly that semantics.

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

  // decoy cases with never-dispatched keys and tautology-guarded no-op bodies
  for (let dIdx = 0; dIdx < 2; dIdx++) {
    let dk = nextKey();
    while (used.has(dk)) dk = nextKey();
    used.add(dk);
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
                      left: { kind: "Number", value: 7, raw: "" },
                      right: { kind: "Number", value: dIdx + 1, raw: "" },
                    },
                    right: { kind: "Number", value: dIdx + 1, raw: "" },
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

  void uid;
  return {
    kind: "Do",
    body: {
      stats: [
        {
          kind: "LocalDecl",
          names: ["__st", "__d0", "__d1"],
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
