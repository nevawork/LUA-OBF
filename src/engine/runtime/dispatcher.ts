// NEVAHEX-VM — runtime module: dispatcher construction
// Builds the per-build handler table (one arm per logical opcode, MBA-gated
// tests over physical opcode literals) and assembles the randomized dispatch
// chain. Handler bodies are frame-local Lua referencing the name maps owned by
// the emitter.
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

export interface DispatchCtx {
  /** file-scope generated names (ctn, protos, pk, ur, run) */
  N: Record<string, string>;
  /** frame-local generated names */
  F: Record<string, string>;
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
}

export function buildHandlers(ctx: DispatchCtx): Handler[] {
  const { N, F, tier, lit, phys, gate } = ctx;
  const hs: Handler[] = [];
  const add = (op: Op, body: string[]): void => {
    hs.push({ op, phys: phys(op), test: `op==${lit(op)}${gate()}`, body });
  };

  add(Op.MOVE, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.cells}[${F.ins}[2]].v`]);
  add(Op.SETLOCAL, [`${F.cells}[${F.ins}[2]].v=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}-1`]);
  add(Op.DECL, [`do end`]);
  add(Op.STOREN, [
    `do`,
    `local ${F.base},${F.cnt}=${F.ins}[2],${F.ins}[3]`,
    `local ${F.sb}=${F.sp}-${F.cnt}`,
    `for ${F.i}=1,${F.cnt} do ${F.cells}[${F.base}+${F.i}-1].v=${F.S}[${F.sb}+${F.i}] end`,
    `${F.sp}=${F.sb}`,
    `end`,
  ]);
  add(Op.LOADK, tier === "silent"
    ? [
        `do`,
        `local ${F.v}=${F.C}[${F.ins}[2]]`,
        `${F.sp}=${F.sp}+1`,
        `if ${F.poison} and type(${F.v})=='number' then ${F.S}[${F.sp}]=${F.v}+${F.PB} else ${F.S}[${F.sp}]=${F.v} end`,
        `end`,
      ]
    : [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.C}[${F.ins}[2]]`]);
  add(Op.NIL, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=nil`]);
  add(Op.TRUE, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=true`]);
  add(Op.FALSE, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=false`]);
  add(Op.PUSHENV, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.env}`]);
  add(Op.GGET, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.env}[${F.C}[${F.ins}[2]]]`]);
  add(Op.GSET, [`${F.env}[${F.C}[${F.ins}[2]]]=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}-1`]);
  add(Op.UPVAL, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.upv}[${F.ins}[2]].v`]);
  add(Op.SETUPVAL, [`${F.upv}[${F.ins}[2]].v=${F.S}[${F.sp}]`, `${F.sp}=${F.sp}-1`]);
  add(Op.GETTAB, [
    `do`,
    `local ${F.k}=${F.S}[${F.sp}] local ${F.t}=${F.S}[${F.sp}-1]`,
    `${F.S}[${F.sp}-1]=${F.t}[${F.k}]`,
    `${F.sp}=${F.sp}-1`,
    `end`,
  ]);
  add(Op.SETTAB, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}] local ${F.k}=${F.S}[${F.sp}-1] local ${F.t}=${F.S}[${F.sp}-2]`,
    `${F.t}[${F.k}]=${F.v}`,
    `${F.sp}=${F.sp}-3`,
    `end`,
  ]);
  add(Op.SETTABAT, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}] local ${F.k}=${F.S}[${F.sp}-1] local ${F.t}=${F.S}[${F.sp}-${F.ins}[2]]`,
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
    `local ${F.a}=${F.ins}[2]`,
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
    `local ${F.cid}=${F.ins}[2]`,
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
    `local ${F.a},${F.b}=${F.ins}[2],${F.ins}[3]`,
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
    `local ${F.a}=${F.ins}[2]`,
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
    `local ${F.a}=${F.ins}[2]`,
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
  const arith = (oper: string, poisonable: boolean): string[] => [
    `do`,
    `local ${F.y}=${F.S}[${F.sp}]`,
    `local ${F.x}=${F.S}[${F.sp}-1]`,
    `${F.sp}=${F.sp}-1`,
    tier === "silent" && poisonable
      ? `${F.S}[${F.sp}]=(${F.x} ${oper} ${F.y})+${F.PB}`
      : `${F.S}[${F.sp}]=${F.x} ${oper} ${F.y}`,
    `end`,
  ];
  add(Op.ADD, arith("+", true));
  add(Op.SUB, arith("-", true));
  add(Op.MUL, arith("*", true));
  add(Op.DIV, arith("/", false));
  add(Op.MOD, arith("%", false));
  add(Op.POW, arith("^", false));
  add(Op.CONCAT, [
    `do`,
    `local ${F.n0}=${F.ins}[2]`,
    `local ${F.acc}=${F.S}[${F.sp}-${F.n0}+1]`,
    `for ${F.i}=${F.sp}-${F.n0}+2,${F.sp} do ${F.acc}=${F.acc}..${F.S}[${F.i}] end`,
    `${F.sp}=${F.sp}-${F.n0}+1`,
    `${F.S}[${F.sp}]=${F.acc}`,
    `end`,
  ]);
  const cmp = (expr: string): string[] => [
    `do`,
    `local ${F.y}=${F.S}[${F.sp}]`,
    `local ${F.x}=${F.S}[${F.sp}-1]`,
    `${F.sp}=${F.sp}-1`,
    `${F.S}[${F.sp}]=${expr}`,
    `end`,
  ];
  add(Op.EQ, cmp(`${F.x}==${F.y}`));
  add(Op.LT, cmp(`${F.x}<${F.y}`));
  add(Op.LE, cmp(`${F.x}<=${F.y}`));
  add(Op.NOT, [`${F.S}[${F.sp}]=not ${F.S}[${F.sp}]`]);
  add(Op.LEN, [`${F.S}[${F.sp}]=#${F.S}[${F.sp}]`]);
  add(Op.NEG, [`${F.S}[${F.sp}]=-${F.S}[${F.sp}]`]);
  add(Op.JMP, [`${F.pc}=${F.pc}+${F.ins}[3]`]);
  add(Op.JF, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}]`,
    `${F.sp}=${F.sp}-1`,
    `if not ${F.v} then ${F.pc}=${F.pc}+${F.ins}[3] end`,
    `end`,
  ]);
  add(Op.JT, [
    `do`,
    `local ${F.v}=${F.S}[${F.sp}]`,
    `${F.sp}=${F.sp}-1`,
    `if ${F.v} then ${F.pc}=${F.pc}+${F.ins}[3] end`,
    `end`,
  ]);
  add(Op.DUP, [`${F.sp}=${F.sp}+1`, `${F.S}[${F.sp}]=${F.S}[${F.sp}-1]`]);
  add(Op.POP, [`${F.sp}=${F.sp}-${F.ins}[2]`]);
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
    `local ${F.e}=${F.ins}[3]`,
    `local ${F.size}=${F.e}<0 and ((-${F.e}-1)+(${F.mr}<0 and 0 or ${F.mr})) or ${F.e}`,
    `local ${F.a}=${F.ins}[2]`,
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
    `local ${F.a}=${F.ins}[2]`,
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
    `local ${F.bse}=${F.ins}[2]`,
    `local ${F.stp}=${F.S}[${F.sp}]`,
    `local ${F.lim}=${F.S}[${F.sp}-1]`,
    `local ${F.st}=${F.S}[${F.sp}-2]`,
    `${F.sp}=${F.sp}-3`,
    `${F.cells}[${F.bse}]={v=${F.st}}`,
    `${F.cells}[${F.bse}+1].v=${F.st}`,
    `${F.cells}[${F.bse}+2].v=${F.lim}`,
    `${F.cells}[${F.bse}+3].v=${F.stp}`,
    `if (${F.stp}>0 and ${F.st}>${F.lim}) or (${F.stp}<0 and ${F.st}<${F.lim}) then ${F.pc}=${F.pc}+${F.ins}[3] end`,
    `end`,
  ]);
  add(Op.FORLOOP, [
    `do`,
    `local ${F.bse}=${F.ins}[2]`,
    `local ${F.nv}=${F.cells}[${F.bse}].v+${F.cells}[${F.bse}+3].v`,
    `local ${F.lim}=${F.cells}[${F.bse}+2].v`,
    `local ${F.stp}=${F.cells}[${F.bse}+3].v`,
    `if (${F.stp}>0 and ${F.nv}<=${F.lim}) or (${F.stp}<0 and ${F.nv}>=${F.lim}) then`,
    `${F.cells}[${F.bse}]={v=${F.nv}}`,
    `${F.cells}[${F.bse}+1].v=${F.nv}`,
    `${F.pc}=${F.pc}+${F.ins}[3]`,
    `end`,
    `end`,
  ]);
  add(Op.GFORPREP, [
    `do`,
    `local ${F.bse}=${F.ins}[2]`,
    `local ${F.nv}=${F.ins}[4]`,
    `local ${F.ctrl}=${F.S}[${F.sp}] local ${F.s2}=${F.S}[${F.sp}-1] local ${F.f2}=${F.S}[${F.sp}-2]`,
    `${F.sp}=${F.sp}-3`,
    `${F.cells}[${F.bse}].v=${F.f2}`,
    `${F.cells}[${F.bse}+1].v=${F.s2}`,
    `${F.cells}[${F.bse}+2].v=${F.ctrl}`,
    `local ${F.rs}=${N.pk}(${F.cells}[${F.bse}].v(${F.cells}[${F.bse}+1].v,${F.cells}[${F.bse}+2].v))`,
    `if ${F.rs}[1]==nil then`,
    `${F.pc}=${F.pc}+${F.ins}[3]`,
    `else`,
    `${F.cells}[${F.bse}+2].v=${F.rs}[1]`,
    `for ${F.i}=1,${F.nv} do ${F.cells}[${F.bse}+2+${F.i}]={v=${F.rs}[${F.i}]} end`,
    `end`,
    `end`,
  ]);
  add(Op.GFORLOOP, [
    `do`,
    `local ${F.bse}=${F.ins}[2]`,
    `local ${F.nv}=${F.ins}[4]`,
    `local ${F.rs}=${N.pk}(${F.cells}[${F.bse}].v(${F.cells}[${F.bse}+1].v,${F.cells}[${F.bse}+2].v))`,
    `if ${F.rs}[1]~=nil then`,
    `${F.pc}=${F.pc}+${F.ins}[3]`,
    `${F.cells}[${F.bse}+2].v=${F.rs}[1]`,
    `for ${F.i}=1,${F.nv} do ${F.cells}[${F.bse}+2+${F.i}]={v=${F.rs}[${F.i}]} end`,
    `end`,
    `end`,
  ]);
  add(Op.ESCAPE, [`error(${ctx.escapeGarbageLit})`]);

  return hs;
}

/** shuffle handler order and emit the if/elseif chain + fallback */
export function assembleChain(
  handlers: Handler[],
  rng: BuildRng,
  fallbackLit: string,
): { chainLines: string[]; dispatchOrder: number[] } {
  const ordered = rng.shuffle(handlers.slice());
  const chainLines: string[] = [];
  ordered.forEach((h, idx) => {
    chainLines.push(`${idx === 0 ? "if" : "elseif"} ${h.test} then`);
    chainLines.push(...h.body);
  });
  chainLines.push(`else`);
  chainLines.push(`error(${fallbackLit})`);
  chainLines.push(`end`);
  return { chainLines, dispatchOrder: ordered.map((h) => h.phys) };
}
