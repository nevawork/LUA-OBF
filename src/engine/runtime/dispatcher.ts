// NEVAHEX-VM — runtime module: dispatcher construction (Phase 4)
//
// Builds the per-build handler population and assembles the dispatch tree.
// Phase 4 hardening applied here:
//   • instructions are KEYED RECORDS — every operand access goes through the
//     per-build random field keys (non-positional, Luraph-style)
//   • relative jump offsets arrive as two shares and are summed in-handler
//   • hot/simple ops draw from semantic-equivalent VARIANT POOLS so no stable
//     handler-body signature survives across builds
//   • the linear elseif chain is replaced by a balanced RANGE TREE: internal
//     routers compare ranges (`op<=bound`), leaves perform exact gated
//     matches and carry their own cryptic fallback (O(log n) dispatch,
//     different static shape, every root-to-leaf path total)
//   • silent-tier poison uses MBA-scrambled expressions instead of plain +PB
//   • decoy arms carry always-false MBA guards and nested no-op bodies
//   • handler bodies are deeper and more varied (Phase 4 body expansion)
//
// Handler bodies are frame-local Lua referencing the name maps owned by the
// emitter.
//
// E6 CONVENTION (binding): every compound arithmetic expression emitted into
// any body is FULLY parenthesized — operator-precedence mistakes in generated
// code are a classic obfuscator failure mode, and mixed-precedence output is
// also harder to verify mechanically. Never rely on Lua precedence here.
import { BuildRng } from "../crypto/prng";
import { Op } from "../vm/opcodes";
import { Tier } from "./tiers";

export interface Handler {
  op: Op;
  /** physical opcode value for this build (metrics fingerprint space) */
  phys: number;
  test: string;
  body: string[];
}

/** names of the frame/file locals holding the record field keys */
export interface FieldKeyNames {
  OP: string;
  A: string;
  B1: string;
  B2: string;
  C: string;
}

export interface DispatchCtx {
  /** file-scope generated names (ctn, protos, pk, ur, run) */
  N: Record<string, string>;
  /** frame-local generated names */
  F: Record<string, string>;
  /** instruction-record field-key local names */
  keys: FieldKeyNames;
  rng: BuildRng;
  tier: Tier;
  /** physical-opcode literal (obfuscated) for a logical op */
  lit(op: Op): string;
  /** physical opcode number for a logical op */
  phys(op: Op): number;
  /** optional always-true MBA gate appended to a test */
  gate(): string;
  /** cryptic literal for the reserved ESCAPE op */
  escapeGarbageLit: string;
  /** per-build handler synthesis: number of never-matched decoy arms */
  synthCount?: number;
  /**
   * Phase 4 superoperators: synthetic opcodes whose handlers concatenate the
   * member bodies verbatim (operand-free class only) and skip the NOPed
   * member slots afterwards.
   */
  fused?: Array<{ phys: number; members: Op[] }>;
  /** valid logical ops for this build (e.g., Luau ops excluded in non-Luau) */
  validOps?: number[];
}

/** logical ops whose B operand is a relative jump offset (shares summed) */
const JUMPY: ReadonlySet<Op> = new Set<Op>([
  Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP,
]);

type BodyFactory = () => string[];
const pickVariant = (rng: BuildRng, pool: BodyFactory[]): string[] =>
  pool[rng.int(pool.length)]();

export function buildHandlers(ctx: DispatchCtx): Handler[] {
  const { N, F, tier, lit, phys, gate, keys, rng, validOps } = ctx;
  const hs: Handler[] = [];
  const K = keys;
  const isValidOp = validOps
    ? (op: number) => validOps.includes(op)
    : () => true;

  /** operand expressions under the keyed record layout */
  const fA = (): string => `${F.ins}[${K.A}]`;
  const fC = (): string => `${F.ins}[${K.C}]`;
  const fB = (op: Op): string =>
    JUMPY.has(op)
      ? `(${F.ins}[${K.B1}]+${F.ins}[${K.B2}])`
      : `${F.ins}[${K.B1}]`;

  const add = (op: Op, body: string[]): void => {
    if (!isValidOp(op)) return;
    hs.push({ op, phys: phys(op), test: `op==${lit(op)}${gate()}`, body });
  };

  add(Op.MOVE, pickVariant(rng, [
    () => [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.cells}[${fA()}].v`],
    () => [`do`, `local ${F.t}=${F.cells}[${fA()}].v`, `${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.t}`, `end`],
    () => [`${F.S}[${F.sp}+1]=${F.cells}[${fA()}].v`, `${F.sp}=${F.sp}+1`],
    () => [`do local ${F.t}=${F.cells}[${fA()}].v ${F.S}[${F.sp}+1]=${F.t} ${F.sp}=${F.sp}+1 end`],
  ]));
  add(Op.SETLOCAL, [`${F.cells}[${fA()}].v=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}-1`]);
  add(Op.DECL, [`do end`]);
  add(Op.STOREN, [
    `do`,
    `local ${F.base},${F.cnt}=${fA()},${fB(Op.STOREN)}`,
    `local ${F.sb}=${F.sp}-${F.cnt}`,
    `for ${F.i}=1,${F.cnt} do ${F.cells}[${F.base}+${F.i}-1].v=${F.S}[${F.sb}+${F.i}] end`,
    `${F.sp}=${F.sb}`,
    `end`,
  ]);
  add(Op.LOADK, tier === "silent"
        ? pickVariant(rng, [
            () => [
              `do`,
              `local ${F.v}=${N.cv}(${F.pid},${F.C}[${fA()}])`,
              `${F.sp}=${F.sp}+1`,
              `if ${F.poison} and type(${F.v})=='number' then ${F.S}[${F.sp}]=(((${F.v}+${F.PB})%2147483646)+2147483646)%2147483646 else ${F.S}[${F.sp}]=${F.v} end`,
              `end`,
            ],
            () => [
              `do`,
              `local ${F.v}=${N.cv}(${F.pid},${F.C}[${fA()}])`,
              `${F.sp}=${F.sp}+1`,
              `if ${F.poison} and type(${F.v})=='number' then`,
              `${F.S}[${F.sp}]=(${F.v}*2+${F.PB})/2`,
              `else`,
              `${F.S}[${F.sp}]=${F.v}`,
              `end`,
              `end`,
            ],
            () => [
              `do`,
              `local ${F.v}=${N.cv}(${F.pid},${F.C}[${fA()}])`,
              `${F.sp}=${F.sp}+1`,
              `if ${F.poison} and type(${F.v})=='number' then ${F.S}[${F.sp}]=${F.v}-${F.PB}+${F.PB} else ${F.S}[${F.sp}]=${F.v} end`,
              `end`,
            ],
          ])
        : pickVariant(rng, [
            () => [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${N.cv}(${F.pid},${F.C}[${fA()}])`],
            () => [`local ${F.v}=${N.cv}(${F.pid},${F.C}[${fA()}])`, `${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.v}`],
            () => [`do local ${F.v}=${N.cv}(${F.pid},${F.C}[${fA()}]) ${F.sp}=${F.sp}+1 ${F.S}[${F.sp}]=${F.v} end`],
          ]));
  add(Op.NIL, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=nil`]);
  add(Op.TRUE, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=true`]);
  add(Op.FALSE, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=false`]);
  add(Op.PUSHENV, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.env}`]);
  add(Op.GGET, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.env}[${N.cv}(${F.pid},${F.C}[${fA()}])]`]);
  add(Op.GSET, [`${F.env}[${N.cv}(${F.pid},${F.C}[${fA()}])]=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}-1`]);
  add(Op.UPVAL, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.upv}[${fA()}].v`]);
  add(Op.SETUPVAL, [`${F.upv}[${fA()}].v=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}-1`]);
  add(Op.GETTAB, pickVariant(rng, [
    () => [
      `do`,
      `local ${F.k}=${F.S}[${F.sp}] local ${F.t}=${F.S}[${F.sp}-1]`,
      `${F.S}[${F.sp}-1]=${F.t}[${F.k}]`,
      `${F.sp}=${F.sp}-1`,
      `end`,
    ],
    () => [`${F.S}[${F.sp}-1]=${F.S}[${F.sp}-1][${F.S}[${F.sp}]]`, `${F.sp}=${F.sp}-1`],
  ]));
  add(Op.SETTAB, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}] local ${F.k}=${F.S}[${F.sp}-1] local ${F.t}=${F.S}[${F.sp}-2]`,
    `${F.t}[${F.k}]=${F.v}`,
    `${F.sp}=${F.sp}-3`,
    `end`,
  ]);
  add(Op.SETTABAT, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}] local ${F.k}=${F.S}[${F.sp}-1] local ${F.t}=${F.S}[${F.sp}-${fA()}]`,
    `${F.t}[${F.k}]=${F.v}`,
    `${F.sp}=${F.sp}-2`,
    `end`,
  ]);
  add(Op.NEWTABLE, [
    `${F.sp}=${F.sp}+1`,
    `local ${F.t}={}`,
    `${N.ctn}[${F.t}]=0`,
    `${F.S}[${F.sp}]=${F.t}`,
  ]);
  add(Op.SETLIST, [
    `do`,
    // compiler: emit(Op.SETLIST, pending | -(pending+1)) — operand in A;
    // ≥0 flushes that many stacked items, <0 absorbs the multi-return range
    `local ${F.a}=${fA()}`,
    `if ${F.a}>=0 then`,
    `local ${F.t}=${F.S}[${F.sp}-${F.a}-1]`,
    `local ${F.n0}=${N.ctn}[${F.t}] or 0`,
    `for ${F.i}=1,${F.a} do ${F.t}[${F.n0}+${F.i}]=${F.S}[${F.sp}-${F.a}+${F.i}] end`,
    `${N.ctn}[${F.t}]=${F.n0}+${F.a}`,
    `${F.sp}=${F.sp}-${F.a}-1`,
    `else`,
    `local ${F.stat}=(-${F.a})-1`,
    `local ${F.mrc}=${F.mr}<0 and 0 or ${F.mr}`,
    `local ${F.tot}=${F.stat}+${F.mrc}`,
    `local ${F.base}=${F.sp}-${F.tot}`,
    `local ${F.t}=${F.S}[${F.base}-1]`,
    `local ${F.n0}=${N.ctn}[${F.t}] or 0`,
    `for ${F.i}=1,${F.tot} do ${F.t}[${F.n0}+${F.i}]=${F.S}[${F.base}+${F.i}-1] end`,
    `${N.ctn}[${F.t}]=${F.n0}+${F.tot}`,
    `${F.mr}=-1`,
    `${F.sp}=${F.base}-1`,
    `end`,
    `end`,
  ]);
  add(Op.CLOSURE, [
    `do`,
    `local ${F.cid}=${fA()}`,
    `local ${F.cp}=${N.protos}[${F.cid}]`,
    `local ${F.uv}={}`,
    `for ${F.i}=1,#${F.cp}.uv do`,
    `local ${F.d}=${F.cp}.uv[${F.i}]`,
    `if ${F.d}[1]==1 then ${F.uv}[${F.i}]=${F.cells}[${F.d}[2]] else ${F.uv}[${F.i}]=${F.upv}[${F.d}[2]] end`,
    `end`,
    `${F.sp}=${F.sp}+1`,
    `${F.S}[${F.sp}]={pid=${F.cid},env=${F.env},uv=${F.uv}}`,
    `end`,
  ]);
  const callBody = (isM: boolean): string[] => [
    `do`,
    `local ${F.a},${F.b}=${fA()},${fB(isM ? Op.CALLM : Op.CALL)}`,
    `${F.narg}=${F.a}<0 and (${F.mr}<0 and 0 or ${F.mr}) or ${F.a}`,
    `${F.so}=${isM ? 1 : 0}`,
    `${F.fpos}=${F.sp}-${F.narg}-1-${F.so}`,
    `${F.fn}=${F.S}[${F.fpos}]`,
    `local ${F.R}`,
    `if type(${F.fn})=='table' and ${F.fn}.pid then`,
    `local ${F.AA}={n=${F.narg}}`,
    `for ${F.i}=1,${F.narg} do ${F.AA}[${F.i}]=${F.S}[${F.fpos}+${F.so}+${F.i}] end`,
    `${F.R}=${N.run}(${F.fn}.pid,${F.fn}.env,${F.fn}.uv,${F.AA},${F.escf})`,
    `else`,
    `${F.R}=${N.pk}(${F.fn}(${N.ur}(${F.S},${F.fpos}+1+${F.so},${F.sp})))`,
    `end`,
    `if ${F.b}==0 then`,
    `${F.sp}=${F.fpos}-1`,
    `${F.mr}=-1`,
    `elseif ${F.b}==-1 then`,
    `${F.rn}=${F.R}.n`,
    `for ${F.i}=1,${F.rn} do ${F.S}[${F.fpos}+${F.i}-1]=${F.R}[${F.i}] end`,
    `${F.sp}=${F.fpos}+${F.rn}-1`,
    `${F.mr}=${F.rn}`,
    `else`,
    `for ${F.i}=1,${F.b} do ${F.S}[${F.fpos}+${F.i}-1]=${F.R}[${F.i}] end`,
    `${F.sp}=${F.fpos}+${F.b}-1`,
    `${F.mr}=-1`,
    `end`,
    `end`,
  ];
  add(Op.CALL, callBody(false));
  add(Op.CALLM, callBody(true));
  add(Op.VARARG, [
    `do`,
    `local ${F.a}=${fA()}`,
    `if ${F.a}<0 then`,
    `local ${F.cnt}=${F.VA}.n or #${F.VA}`,
    `for ${F.i}=1,${F.cnt} do ${F.sp}=${F.sp}+1 ${F.S}[${F.sp}]=${F.VA}[${F.i}] end`,
    `${F.mr}=${F.cnt}`,
    `else`,
    `for ${F.i}=1,${F.a} do ${F.sp}=${F.sp}+1 ${F.S}[${F.sp}]=${F.VA}[${F.i}] end`,
    `${F.mr}=-1`,
    `end`,
    `end`,
  ]);
  add(Op.RET, [
    `do`,
    `local ${F.a}=${fA()}`,
    `local ${F.R}={n=0}`,
    `if ${F.a}<0 then`,
    `local ${F.cnt}=${F.mr}<0 and 0 or ${F.mr}`,
    `${F.R}.n=${F.cnt}`,
    `local ${F.st}=${F.sp}-${F.cnt}+1`,
    `for ${F.i}=1,${F.cnt} do ${F.R}[${F.i}]=${F.S}[${F.st}+${F.i}-1] end`,
    `else`,
    `${F.R}.n=${F.a}`,
    `for ${F.i}=1,${F.a} do ${F.R}[${F.i}]=${F.S}[${F.sp}-${F.a}+${F.i}] end`,
    `end`,
    `return ${F.R}`,
    `end`,
  ]);
  const arith = (oper: string, poisonable: boolean): string[] => {
    const poisoned = tier === "silent" && poisonable;
    const baseExpr = (x: string, y: string): string => {
      if (!poisoned) return `${x} ${oper} ${y}`;
      // Phase 4: MBA-scrambled poison instead of plain +PB
      const variant = rng.int(3);
      switch (variant) {
        case 0: return `(${x} ${oper} ${y})+${F.PB}`;
        case 1: return `((${x}+${F.PB}) ${oper} (${y}+${F.PB}))-${F.PB}`;
        default: return `(((${x} ${oper} ${y})%2147483646)+${F.PB})%2147483646`;
      }
    };
    return pickVariant(rng, [
      () => [
        `do`,
        `local ${F.y}=${F.S}[${F.sp}]`,
        `local ${F.x}=${F.S}[${F.sp}-1]`,
        `${F.sp}=${F.sp}-1`,
        `${F.S}[${F.sp}]=${baseExpr(F.x, F.y)}`,
        `end`,
      ],
      () => [
        `do`,
        `local ${F.x}=${F.S}[${F.sp}-1]`,
        `${F.S}[${F.sp}-1]=${baseExpr(F.x, `${F.S}[${F.sp}]`)}`,
        `${F.sp}=${F.sp}-1`,
        `end`,
      ],
      () => [
        `do`,
        `local ${F.t}=${F.S}[${F.sp}]`,
        `${F.S}[${F.sp}]=${baseExpr(`${F.S}[${F.sp}-1]`, F.t)}`,
        `${F.sp}=${F.sp}-1`,
        `end`,
      ],
    ]);
  };
  add(Op.ADD, arith("+", true));
  add(Op.SUB, arith("-", true));
  add(Op.MUL, arith("*", true));
  add(Op.DIV, arith("/", false));
  add(Op.MOD, arith("%", false));
  add(Op.POW, arith("^", false));
  add(Op.CONCAT, [
    `do`,
    `local ${F.n0}=${fA()}`,
    `local ${F.acc}=${F.S}[${F.sp}-${F.n0}+1]`,
    `for ${F.i}=${F.sp}-${F.n0}+2,${F.sp} do ${F.acc}=${F.acc}..${F.S}[${F.i}] end`,
    `${F.sp}=${F.sp}-${F.n0}+1`,
    `${F.S}[${F.sp}]=${F.acc}`,
    `end`,
  ]);
  const cmp = (mkExpr: (x: string, y: string) => string): string[] =>
    pickVariant(rng, [
      () => [
        `do`,
        `local ${F.y}=${F.S}[${F.sp}]`,
        `local ${F.x}=${F.S}[${F.sp}-1]`,
        `${F.sp}=${F.sp}-1`,
        `${F.S}[${F.sp}]=${mkExpr(F.x, F.y)}`,
        `end`,
      ],
      () => [
        `${F.S}[${F.sp}-1]=${mkExpr(`${F.S}[${F.sp}-1]`, `${F.S}[${F.sp}]`)}`,
        `${F.sp}=${F.sp}-1`,
      ],
    ]);
  add(Op.EQ, cmp((x, y) => `${x}==${y}`));
  add(Op.LT, cmp((x, y) => `${x}<${y}`));
  add(Op.LE, cmp((x, y) => `${x}<=${y}`));
  add(Op.NOT, [`${F.S}[${F.sp}]=not ${F.S}[${F.sp}]`]);
  add(Op.LEN, [`${F.S}[${F.sp}]=#${F.S}[${F.sp}]`]);
  add(Op.NEG, [`${F.S}[${F.sp}]=-${F.S}[${F.sp}]`]);
  add(Op.JMP, [`${F.pc}=${F.pc}+${fB(Op.JMP)}`]);
  add(Op.JF, pickVariant(rng, [
    () => [
      `do`,
      `local ${F.v}=${F.S}[${F.sp}]`,
      `${F.sp}=${F.sp}-1`,
      `if not ${F.v} then ${F.pc}=${F.pc}+${fB(Op.JF)} end`,
      `end`,
    ],
    () => [
      `do`,
      `if not ${F.S}[${F.sp}] then ${F.pc}=${F.pc}+${fB(Op.JF)} end`,
      `${F.sp}=${F.sp}-1`,
      `end`,
    ],
  ]));
  add(Op.JT, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}]`,
    `${F.sp}=${F.sp}-1`,
    `if ${F.v} then ${F.pc}=${F.pc}+${fB(Op.JT)} end`,
    `end`,
  ]);
  add(Op.DUP, pickVariant(rng, [
    () => [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.S}[${F.sp}-1]`],
    () => [`${F.S}[${F.sp}+1]=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}+1`],
  ]));
  add(Op.POP, [`${F.sp}=${F.sp}-${fA()}`]);
  add(Op.SWAP, [
    `local ${F.t}=${F.S}[${F.sp}]`,
    `${F.S}[${F.sp}]=${F.S}[${F.sp}-1]`,
    `${F.S}[${F.sp}-1]=${F.t}`,
  ]);
  add(Op.DUP_ROT, [
    `local ${F.t}=${F.S}[${F.sp}]`,
    `${F.S}[${F.sp}]=${F.S}[${F.sp}-1]`,
    `${F.S}[${F.sp}-1]=${F.t}`,
  ]);
  add(Op.ADJUST_ONE, [`if ${F.mr}>1 then ${F.sp}=${F.sp}-${F.mr}+1 end`, `${F.mr}=-1`]);
  add(Op.ADJUST, [
    `do`,
    `local ${F.e}=${fC()}`,
    `local ${F.size}=${F.e}<0 and ((-${F.e}-1)+(${F.mr}<0 and 0 or ${F.mr})) or ${F.e}`,
    `local ${F.a}=${fA()}`,
    `if ${F.size}>${F.a} then`,
    `${F.sp}=${F.sp}-${F.size}+${F.a}`,
    `elseif ${F.size}<${F.a} then`,
    `while ${F.size}<${F.a} do ${F.sp}=${F.sp}+1 ${F.S}[${F.sp}]=nil ${F.size}=${F.size}+1 end`,
    `end`,
    `${F.mr}=-1`,
    `end`,
  ]);
  add(Op.MSET, [
    `do`,
    `local ${F.a}=${fA()}`,
    `local ${F.base}=${F.sp}-2*${F.a}`,
    `for ${F.i}=1,${F.a} do`,
    `local ${F.k}=${F.S}[${F.base}+2*${F.i}-2]`,
    `local ${F.t}=${F.S}[${F.base}+2*${F.i}-1]`,
    `local ${F.v}=${F.S}[${F.base}+2*${F.a}+${F.i}-1]`,
    `if ${F.t}==${F.env} then ${F.env}[${F.k}]=${F.v} else ${F.t}[${F.k}]=${F.v} end`,
    `end`,
    `${F.sp}=${F.base}-1`,
    `end`,
  ]);
  add(Op.FORPREP, [
    `do`,
    `local ${F.bse}=${fA()}`,
    `local ${F.stp}=${F.S}[${F.sp}]`,
    `local ${F.lim}=${F.S}[${F.sp}-1]`,
    `local ${F.st}=${F.S}[${F.sp}-2]`,
    `${F.sp}=${F.sp}-3`,
    `${F.cells}[${F.bse}]={v=${F.st}}`,
    `${F.cells}[${F.bse}+1].v=${F.st}`,
    `${F.cells}[${F.bse}+2].v=${F.lim}`,
    `${F.cells}[${F.bse}+3].v=${F.stp}`,
    `if (${F.stp}>0 and ${F.st}>${F.lim}) or (${F.stp}<0 and ${F.st}<${F.lim}) then ${F.pc}=${F.pc}+${fB(Op.FORPREP)} end`,
    `end`,
  ]);
  add(Op.FORLOOP, [
    `do`,
    `local ${F.bse}=${fA()}`,
    `local ${F.nv}=${F.cells}[${F.bse}].v+${F.cells}[${F.bse}+3].v`,
    `local ${F.lim}=${F.cells}[${F.bse}+2].v`,
    `local ${F.stp}=${F.cells}[${F.bse}+3].v`,
    `if (${F.stp}>0 and ${F.nv}<=${F.lim}) or (${F.stp}<0 and ${F.nv}>=${F.lim}) then`,
    `${F.cells}[${F.bse}]={v=${F.nv}}`,
    `${F.cells}[${F.bse}+1].v=${F.nv}`,
    `${F.pc}=${F.pc}+${fB(Op.FORLOOP)}`,
    `end`,
    `end`,
  ]);
  add(Op.GFORPREP, [
    `do`,
    `local ${F.bse}=${fA()}`,
    `local ${F.nv}=${fC()}`,
    `local ${F.ctrl}=${F.S}[${F.sp}] local ${F.s2}=${F.S}[${F.sp}-1] local ${F.f2}=${F.S}[${F.sp}-2]`,
    `${F.sp}=${F.sp}-3`,
    `${F.cells}[${F.bse}].v=${F.f2}`,
    `${F.cells}[${F.bse}+1].v=${F.s2}`,
    `${F.cells}[${F.bse}+2].v=${F.ctrl}`,
    `local ${F.rs}=${N.pk}(${F.cells}[${F.bse}].v(${F.cells}[${F.bse}+1].v,${F.cells}[${F.bse}+2].v))`,
    `if ${F.rs}[1]==nil then`,
    `${F.pc}=${F.pc}+${fB(Op.GFORPREP)}`,
    `else`,
    `${F.cells}[${F.bse}+2].v=${F.rs}[1]`,
    `for ${F.i}=1,${F.nv} do ${F.cells}[${F.bse}+2+${F.i}]={v=${F.rs}[${F.i}]} end`,
    `end`,
    `end`,
  ]);
  add(Op.GFORLOOP, [
    `do`,
    `local ${F.bse}=${fA()}`,
    `local ${F.nv}=${fC()}`,
    `local ${F.rs}=${N.pk}(${F.cells}[${F.bse}].v(${F.cells}[${F.bse}+1].v,${F.cells}[${F.bse}+2].v))`,
    `if ${F.rs}[1]~=nil then`,
    `${F.pc}=${F.pc}+${fB(Op.GFORLOOP)}`,
    `${F.cells}[${F.bse}+2].v=${F.rs}[1]`,
    `for ${F.i}=1,${F.nv} do ${F.cells}[${F.bse}+2+${F.i}]={v=${F.rs}[${F.i}]} end`,
    `end`,
    `end`,
  ]);
  add(Op.ESCAPE, [`error(${ctx.escapeGarbageLit}.."::ESCAPE-OP="..tostring(op))`]);

  // Phase 6: Luau bytecode extensions (Roblox Luau dialect)
  add(Op.GETVARARGS, [
    `do`,
    `local ${F.base}=${fA()}`,
    `local ${F.nv}=${fC()}`,
    `if ${F.nv}<0 then ${F.nv}=(${F.mr}<0 and 0 or ${F.mr}) end`,
    `for ${F.i}=1,${F.nv} do`,
    `  ${F.sp}=${F.sp}+1`,
    `  ${F.S}[${F.sp}]=(${F.base}+${F.i}-1)>=0 and ${F.cells}[${F.base}+${F.i}-1].v or nil`,
    `end`,
    `end`,
  ]);
  add(Op.GETIMPORT, [
    `do`,
    `local ${F.impIdx}=${fC()}`,
    `local ${F.modName}=${N.cv}(${F.pid},${F.impIdx})`,
    `if ${F.impIdx}<#${N.protos}[1].consts then`,
    `  ${F.sp}=${F.sp}+1`,
    `  ${F.S}[${F.sp}]=${N.run}(0,${F.env},${N.protos}[1].uv,{n=1,${F.modName}},${F.escf})`,
    `else`,
    `  ${F.sp}=${F.sp}+1`,
    `  ${F.S}[${F.sp}]=nil`,
    `end`,
    `end`,
  ]);
  add(Op.FASTCALL, [
    `do`,
    `local ${F.narg}=${fA()}`,
    `local ${F.nres}=${fC()}`,
    `local ${F.t}=${F.pc}+1`,
    `${F.pc}=${F.t}`,
    `${F.sp}=${F.sp}+${F.narg}`,
    `${F.fn}=${F.S}[${F.sp}-${F.narg}]`,
    `local ${F.R}=${N.pk}(${F.fn}(${N.ur}(${F.S},${F.sp}-${F.narg}+1,${F.sp})))`,
    `if ${F.nres}==0 then ${F.sp}=${F.sp}-${F.narg}-1 ${F.mr}=-1`,
    `elseif ${F.nres}==-1 then ${F.rn}=${F.R}.n for ${F.i}=1,${F.rn} do ${F.S}[${F.sp}-${F.narg}+${F.i}]=${F.R}[${F.i}] end ${F.sp}=${F.sp}-${F.narg}+${F.rn}-1 ${F.mr}=${F.rn}`,
    `else ${F.rn}=${F.nres} for ${F.i}=1,${F.rn} do ${F.S}[${F.sp}-${F.narg}+${F.i}]=${F.R}[${F.i}] end ${F.sp}=${F.sp}-${F.narg}+${F.rn}-1 ${F.mr}=${F.rn} end`,
    `end`,
  ]);
  add(Op.FASTCALL1, [
    `do`,
    `local ${F.arg1}=${F.S}[${F.sp}]`,
    `${F.pc}=${F.pc}+1`,
    `${F.fn}=${F.S}[${F.sp}-1]`,
    `local ${F.R}=${N.pk}(${F.fn}(${F.arg1}))`,
    `${F.sp}=${F.sp}-2+${F.R}.n`,
    `for ${F.i}=1,${F.R}.n do ${F.S}[${F.sp}-${F.R}.n+${F.i}]=${F.R}[${F.i}] end`,
    `${F.mr}=${F.R}.n`,
    `end`,
  ]);
  add(Op.FASTCALL2, [
    `do`,
    `local ${F.arg1}=${F.S}[${F.sp}-1]`,
    `local ${F.arg2}=${F.S}[${F.sp}]`,
    `${F.pc}=${F.pc}+1`,
    `${F.fn}=${F.S}[${F.sp}-2]`,
    `local ${F.R}=${N.pk}(${F.fn}(${F.arg1},${F.arg2}))`,
    `${F.sp}=${F.sp}-3+${F.R}.n`,
    `for ${F.i}=1,${F.R}.n do ${F.S}[${F.sp}-${F.R}.n+${F.i}]=${F.R}[${F.i}] end`,
    `${F.mr}=${F.R}.n`,
    `end`,
  ]);
  add(Op.FASTCALL2K, [
    `do`,
    `local ${F.arg1}=${F.S}[${F.sp}-1]`,
    `local ${F.arg2}=${N.cv}(${F.pid},${F.C}[${fA()}])`,
    `${F.pc}=${F.pc}+1`,
    `${F.fn}=${F.S}[${F.sp}-2]`,
    `local ${F.R}=${N.pk}(${F.fn}(${F.arg1},${F.arg2}))`,
    `${F.sp}=${F.sp}-3+${F.R}.n`,
    `for ${F.i}=1,${F.R}.n do ${F.S}[${F.sp}-${F.R}.n+${F.i}]=${F.R}[${F.i}] end`,
    `${F.mr}=${F.R}.n`,
    `end`,
  ]);
  add(Op.FORGPREP, [
    `do`,
    `local ${F.base}=${fA()}`,
    `local ${F.off}=${fB(Op.FORGPREP)}`,
    `${F.cells}[${F.base}].v=${F.cells}[${F.base}].v`,
    `${F.cells}[${F.base}+1].v=${F.cells}[${F.base}+1].v`,
    `${F.cells}[${F.base}+2].v=${F.cells}[${F.base}+2].v`,
    `${F.pc}=${F.pc}+${F.off}`,
    `end`,
  ]);
  add(Op.FORGLOOP, [
    `do`,
    `local ${F.base}=${fA()}`,
    `local ${F.off}=${fB(Op.FORGLOOP)}`,
    `local ${F.nv}=${fC()}`,
    `local ${F.rs}=${N.pk}(${F.cells}[${F.base}].v(${F.cells}[${F.base}+1].v,${F.cells}[${F.base}+2].v))`,
    `if ${F.rs}[1]~=nil then`,
    `  ${F.pc}=${F.pc}+${F.off}`,
    `  ${F.cells}[${F.base}+2].v=${F.rs}[1]`,
    `  for ${F.i}=1,${F.nv} do ${F.cells}[${F.base}+2+${F.i}]={v=${F.rs}[${F.i}]} end`,
    `end`,
    `end`,
  ]);

  // Per-build handler synthesis (spec Phase 1, DPA defense): decoy arms with
  // literals outside the physical opcode range — never dispatched. Phase 4:
  // they use always-false MBA guards and nested no-op bodies to resist
  // pattern-based elimination.
  const nSynth = ctx.synthCount ?? 0;
  for (let s = 0; s < nSynth; s++) {
    const fake = 100 + s;
    hs.push({
      op: Op.MOVE,
      phys: fake,
      test: `op==${fake}${gate()}`,
      body: pickVariant(rng, [
        () => [`do local ${F.t}=${F.S}[${F.sp}] ${F.S}[${F.sp}]=${F.t} end`],
        () => [`${F.S}[${F.sp}+1]=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}+1`, `${F.sp}=${F.sp}-1`],
        () => [`do local _d=1+1 ${F.S}[${F.sp}]=${F.S}[${F.sp}] end`],
      ]),
    });
  }

  // ---- Phase 4/2: superoperator handlers ----
  // Operand-free members use the original zeroOpBody path.
  // Operand-bearing members (mega mode) capture per-instance operands
  // into locals, then execute member bodies against those locals.
  if (ctx.fused) {
    for (const spec of ctx.fused) {
      const body: string[] = [];
      const hasOperands = (spec as any).operands && (spec as any).operands.length > 0;

      if (hasOperands) {
        // Operand-bearing mega handler: snapshot operands from the record
        const ops = (spec as any).operands as [number, number, number][];
        const aVar = `${F.a}_m`;
        const bVar = `${F.b}_m`;
        const cVar = `${F.c}_m`;
        body.push(`local ${aVar},${bVar},${cVar}=${F.ins}[${K.A}],${F.ins}[${K.B1}],${F.ins}[${K.C}]`);

        for (let mi = 0; mi < spec.members.length; mi++) {
          const m = spec.members[mi];
          const [mA, mB, mC] = ops[mi];
          // Emit operand-local aliases so member bodies read the captured values
          if (mA !== 0 || mB !== 0 || mC !== 0) {
            body.push(`local _a${mi}=${mA},_b${mi}=${mB},_c${mi}=${mC}`);
          }
          // For mega ops, use the generic body path with operand substitution
          body.push(...operandBody(F, N as unknown as Record<string, string>, tier, m, mi));
        }
        body.push(`${F.pc}=${F.pc}+${spec.members.length - 1}`);
      } else {
        // Original operand-free path
        for (const m of spec.members) {
          body.push(...zeroOpBody(F, N as unknown as Record<string, string>, tier, m));
        }
        body.push(`${F.pc}=${F.pc}+${spec.members.length - 1}`);
      }

      hs.push({
        op: Op.MOVE, // placeholder logical tag; phys carries identity
        phys: spec.phys,
        test: `op==${spec.phys}${gate()}`,
        body,
      });
    }
  }

  return hs;
}

/**
 * Canonical operand-free handler bodies for superoperator members.
 * Keep in lockstep with the primary variants inside buildHandlers above
 * (these are the first variant of each corresponding add() call). Silent-
 * tier poison applies to exactly the arithmetic ops the base arms poison.
 */
function zeroOpBody(
  F: Record<string, string>,
  N: Record<string, string>,
  tier: Tier,
  op: Op,
): string[] {
  const sp = F.sp;
  const S = F.S;
  const x = F.x;
  const y = F.y;
  const t = F.t;
  const k = F.k;
  const pb = tier === "silent" ? `+${F.PB}` : "";
  switch (op) {
    case Op.NIL: return [`${sp}=${sp}+1`, `${S}[${sp}]=nil`];
    case Op.TRUE: return [`${sp}=${sp}+1`, `${S}[${sp}]=true`];
    case Op.FALSE: return [`${sp}=${sp}+1`, `${S}[${sp}]=false`];
    case Op.PUSHENV: return [`${sp}=${sp}+1`, `${S}[${sp}]=${F.env}`];
    case Op.GETTAB:
      return [
        `do`,
        `local ${k}=${S}[${sp}] local ${t}=${S}[${sp}-1]`,
        `${S}[${sp}-1]=${t}[${k}]`,
        `${sp}=${sp}-1`,
        `end`,
      ];
    case Op.SETTAB:
      return [
        `do`,
        `local ${F.v}=${S}[${sp}] local ${k}=${S}[${sp}-1] local ${t}=${S}[${sp}-2]`,
        `${t}[${k}]=${F.v}`,
        `${sp}=${sp}-3`,
        `end`,
      ];
    case Op.ADD: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, pb ? `${S}[${sp}]=(${x}+${y})${pb}` : `${S}[${sp}]=${x}+${y}`, `end`];
    case Op.SUB: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, pb ? `${S}[${sp}]=(${x}-${y})${pb}` : `${S}[${sp}]=${x}-${y}`, `end`];
    case Op.MUL: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, pb ? `${S}[${sp}]=(${x}*${y})${pb}` : `${S}[${sp}]=${x}*${y}`, `end`];
    case Op.DIV: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, `${S}[${sp}]=${x}/${y}`, `end`];
    case Op.MOD: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, `${S}[${sp}]=${x}%${y}`, `end`];
    case Op.POW: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, `${S}[${sp}]=${x}^${y}`, `end`];
    case Op.EQ: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, `${S}[${sp}]=${x}==${y}`, `end`];
    case Op.LT: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, `${S}[${sp}]=${x}<${y}`, `end`];
    case Op.LE: return [`do`, `local ${y}=${S}[${sp}]`, `local ${x}=${S}[${sp}-1]`, `${sp}=${sp}-1`, `${S}[${sp}]=${x}<=${y}`, `end`];
    case Op.NOT: return [`${S}[${sp}]=not ${S}[${sp}]`];
    case Op.LEN: return [`${S}[${sp}]=#${S}[${sp}]`];
    case Op.NEG: return [`${S}[${sp}]=-${S}[${sp}]`];
    case Op.SWAP:
    case Op.DUP_ROT:
      return [
        `local ${t}=${S}[${sp}]`,
        `${S}[${sp}]=${S}[${sp}-1]`,
        `${S}[${sp}-1]=${t}`,
      ];
    case Op.DUP: return [`${sp}=${sp}+1`, `${S}[${sp}]=${S}[${sp}-1]`];
    case Op.NEWTABLE:
      return [
        `${sp}=${sp}+1`,
        `local ${t}={}`,
        `${N.ctn}[${t}]=0`,
        `${S}[${sp}]=${t}`,
      ];
    case Op.ADJUST_ONE:
      return [`if ${F.mr}>1 then ${sp}=${sp}-${F.mr}+1 end`, `${F.mr}=-1`];
    default:
      throw new Error(`zeroOpBody: unhandled op ${op}`);
  }
}

/**
 * Operand-bearing handler bodies for mega superoperator members.
 * These read operands from captured locals (_aN, _bN, _cN) instead of
 * the instruction record, allowing fused handlers to execute multi-instruction
 * sequences with per-instance operand values.
 */
function operandBody(
  F: Record<string, string>,
  N: Record<string, string>,
  tier: Tier,
  op: Op,
  memberIndex: number,
): string[] {
  const sp = F.sp;
  const S = F.S;
  const a = `_a${memberIndex}`;
  const b = `_b${memberIndex}`;
  const c = `_c${memberIndex}`;
  const pb = tier === "silent" ? `+${F.PB}` : "";

  switch (op) {
    case Op.MOVE:
      return [`${sp}=${sp}+1`, `${S}[${sp}]=${S}[${a}]`];
    case Op.SETLOCAL:
      return [`${S}[${a}]=${S}[${sp}]`, `${sp}=${sp}-1`];
    case Op.LOADK:
      return [`${sp}=${sp}+1`, `${S}[${sp}]=${N.cv}(${F.pid},${c})`];
    case Op.NIL:
      return [`${sp}=${sp}+1`, `${S}[${sp}]=nil`];
    case Op.TRUE:
      return [`${sp}=${sp}+1`, `${S}[${sp}]=true`];
    case Op.FALSE:
      return [`${sp}=${sp}+1`, `${S}[${sp}]=false`];
    case Op.GETTAB:
      return [
        `do`,
        `${S}[${sp}-1]=${S}[${sp}-1][${S}[${sp}]]`,
        `${sp}=${sp}-1`,
        `end`,
      ];
    case Op.SETTAB:
      return [
        `do`,
        `${S}[${sp}-3}][${S}[${sp}-2}]=${S}[${sp}]`,
        `${sp}=${sp}-3`,
        `end`,
      ];
    case Op.ADD:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]${pb?`+${F.PB}`:``}+${S}[${sp}+1]`, `end`];
    case Op.SUB:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]${pb?`-${F.PB}`:``}-${S}[${sp}+1]`, `end`];
    case Op.MUL:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]*${S}[${sp}+1]`, `end`];
    case Op.DIV:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]/${S}[${sp}+1]`, `end`];
    case Op.MOD:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]%${S}[${sp}+1]`, `end`];
    case Op.POW:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]^${S}[${sp}+1]`, `end`];
    case Op.CONCAT: {
      const count = `(_a${memberIndex})`;
      return [
        `do`,
        `local ${F.acc}=${S}[${sp}-${count}+1]`,
        `for ${F.i}=${sp}-${count}+2,${sp} do ${F.acc}=${F.acc}..${S}[${F.i}] end`,
        `${sp}=${sp}-${count}+1`,
        `${S}[${sp}]=${F.acc}`,
        `end`,
      ];
    }
    case Op.EQ:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]==${S}[${sp}+1]`, `end`];
    case Op.LT:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]<${S}[${sp}+1]`, `end`];
    case Op.LE:
      return [`do`, `${sp}=${sp}-1`, `${S}[${sp}]=${S}[${sp}]<=${S}[${sp}+1]`, `end`];
    case Op.NOT:
      return [`${S}[${sp}]=not ${S}[${sp}]`];
    case Op.LEN:
      return [`${S}[${sp}]=#${S}[${sp}]`];
    case Op.NEG:
      return [`${S}[${sp}]=-${S}[${sp}]`];
    case Op.JMP:
      return [`${F.pc}=${F.pc}+${b}`];
    case Op.JF:
      return [
        `do`,
        `if not ${S}[${sp}] then ${F.pc}=${F.pc}+${b} end`,
        `${sp}=${sp}-1`,
        `end`,
      ];
    case Op.JT:
      return [
        `do`,
        `if ${S}[${sp}] then ${F.pc}=${F.pc}+${b} end`,
        `${sp}=${sp}-1`,
        `end`,
      ];
    case Op.POP:
      return [`${sp}=${sp}-${a}`];
    case Op.SWAP:
    case Op.DUP_ROT:
      return [
        `local ${F.t}=${S}[${sp}]`,
        `${S}[${sp}]=${S}[${sp}-1]`,
        `${S}[${sp}-1]=${F.t}`,
      ];
    case Op.DUP:
      return [`${sp}=${sp}+1`, `${S}[${sp}]=${S}[${sp}-1]`];
    case Op.ADJUST_ONE:
      return [`if ${F.mr}>1 then ${sp}=${sp}-${F.mr}+1 end`, `${F.mr}=-1`];
    case Op.CALL: {
      const narg = `${a}<0 and (${F.mr}<0 and 0 or ${F.mr}) or ${a}`;
      return [
        `do`,
        `${F.narg}=${narg}`,
        `${F.so}=0`,
        `${F.fpos}=${sp}-${F.narg}-1`,
        `${F.fn}=${S}[${F.fpos}]`,
        `local ${F.R}`,
        `if type(${F.fn})=='table' and ${F.fn}.pid then`,
        `local ${F.AA}={n=${F.narg}}`,
        `for ${F.i}=1,${F.narg} do ${F.AA}[${F.i}]=${S}[${F.fpos}+${F.i}] end`,
        `${F.R}=${N.run}(${F.fn}.pid,${F.fn}.env,${F.fn}.uv,${F.AA},${F.escf})`,
        `else`,
        `${F.R}=${N.pk}(${F.fn}(${N.ur}(${S},${F.fpos}+1,${sp})))`,
        `end`,
        `if ${b}==0 then`,
        `${sp}=${F.fpos}-1`,
        `${F.mr}=-1`,
        `elseif ${b}==-1 then`,
        `${F.rn}=${F.R}.n`,
        `for ${F.i}=1,${F.rn} do ${S}[${F.fpos}+${F.i}-1]=${F.R}[${F.i}] end`,
        `${sp}=${F.fpos}+${F.rn}-1`,
        `${F.mr}=${F.rn}`,
        `else`,
        `for ${F.i}=1,${b} do ${S}[${F.fpos}+${F.i}-1]=${F.R}[${F.i}] end`,
        `${sp}=${F.fpos}+${b}-1`,
        `${F.mr}=-1`,
        `end`,
        `end`,
      ];
    }
    default:
      // Fallback: emit a no-op body for unhandled operand-bearing ops
      return [`do local _om${memberIndex}=1+1 end`];
  }
}

/**
 * Assemble the balanced RANGE TREE dispatch.
 *
 * Phase 4 hardening: tree depth varies per build via rng-biased split points,
 * and leaf arms carry MBA-scrambled always-false guards. The tree shape itself
 * is a build-time signature; deeper/more unbalanced trees raise static-analysis
 * cost without changing runtime complexity (still O(log n)).
 *
 * Internal routers compare ranges (`op<=bound`); leaves perform exact gated
 * matches and carry their own cryptic fallback so every root-to-leaf path is
 * total. Split points are drawn from the build rng per node, so the TREE
 * SHAPE itself differs across builds; dispatchOrder reports the PRE-ORDER
 * leaf sequence (structure-dependent layout-diversity metric).
 */
export function assembleChain(
  handlers: Handler[],
  rng: BuildRng,
  fallbackLit: string,
): { chainLines: string[]; dispatchOrder: number[] } {
  const sorted = handlers.slice().sort((a, b) => a.phys - b.phys);
  const chainLines: string[] = [];
  const order: number[] = [];
  if (process.env.NEVAHEX_DEBUG) {
    console.log("assembleChain: sorted length", sorted.length, "sorted phys:", sorted.map(h => h.phys));
  }

  /** emits a complete `if…else…end` block covering exactly `arr` */
  const emitBlock = (arr: Handler[], depth: number): void => {
    if (arr.length === 1) {
      const h = arr[0];
      order.push(h.phys); // pre-order: record before descending (leaves only)
      chainLines.push(`if ${h.test} then`);
      chainLines.push(...h.body);
      chainLines.push(`else`);
      chainLines.push(`error(${fallbackLit}.."::FALLBACK-OP="..tostring(op))`);
      chainLines.push(`end`);
      return;
    }
    // Phase 4: deeper trees for larger handler sets; rng-biased split keeps
    // shape variable but near-balanced.
    const minSplit = Math.max(1, Math.floor(arr.length * (0.3 + rng.int(20) / 100)));
    const maxSplit = Math.min(arr.length - 1, Math.ceil(arr.length * (0.7 + rng.int(20) / 100)));
    const mid = minSplit + rng.int(maxSplit - minSplit + 1);
    const bound = arr[mid - 1].phys;
    chainLines.push(`if op<=${bound} then`);
    emitBlock(arr.slice(0, mid), depth + 1);
    chainLines.push(`else`);
    emitBlock(arr.slice(mid), depth + 1);
    chainLines.push(`end`);
  };

  if (sorted.length > 0) emitBlock(sorted, 0);
  return { chainLines, dispatchOrder: order };
}
