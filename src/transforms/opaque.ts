// NEVAHEX-VM — transform: opaque dead-code injection (semantic poisoning)
// Inserts never-executed junk branches carrying plausible fake data-flow.
import { Block, Stat } from "../lang/nodes";

let counter = 0;
const uid = (): string => `j${(counter++).toString(36)}zq`;

export function resetOpaqueCounter(): void {
  counter = 0;
}

export function injectOpaqueJunk(block: Block, density = 0.12, rng?: { int(n: number): number }): void {
  const roll = (): number => (rng ? rng.int(10000) / 10000 : Math.random());

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
      out.push(s);
      if (roll() < density) out.push(makeJunk());
    }
    b.stats = out;
    if (b.ret && roll() < density) b.stats.push(makeJunk());
  };
  recurse(block);

  // guard: x²+x always even ⇒ not(x²+x ≡ 1 mod 2) is always false
  function makeJunk(): Stat {
    const a = `jv${uid()}`;
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
                names: [a],
                exprs: [{ kind: "Number", value: 13, raw: "" }],
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
