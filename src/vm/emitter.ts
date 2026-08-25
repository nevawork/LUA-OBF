// NEVAHEX-VM — runtime emitter: generates the per-build Lua VM interpreter.
// Per-build hardening: shuffled physical opcodes, reordered dispatch chain,
// randomized identifiers, MBA-gated comparisons, woven integrity checks,
// tiered tamper response (strict halt / silent poisoning), watermark carriers.
import { BuildRng } from "../gen/prng";
import { Op } from "./opcodes";
import { Seeds, normSeed, wmSeeds } from "./serializer";

export type Tier = "off" | "strict" | "silent";

export interface EmitOptions {
  seeds: Seeds;
  tier: Tier;
  rng: BuildRng;
  /** encrypted blob (includes trailing watermark section) */
  blob: Buffer;
  /** integrity slices over decoded code: [pid, from, to, expectedHash] */
  integrity: [number, number, number, number][];
  /** deterministic poison bias applied in silent tier */
  pbias: number;
  rootPid: number;
  /** logical→physical opcode mapping (owned by the pipeline) */
  perm: number[];
}

export interface EmitResult {
  lua: string;
}

const M31 = 2147483647;

function luaEscape(bytes: Buffer): string {
  let out = '"';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b >= 40 && b <= 126 && b !== 92) out += String.fromCharCode(b);
    else out += "\\" + b.toString(10).padStart(3, "0");
  }
  return out + '"';
}

function garbage(rng: BuildRng): string {
  const chars = "!@#$%^&*~?<>|{}[]AXQZ";
  let s = "";
  for (let i = 0; i < 28; i++) s += chars[rng.int(chars.length)];
  return s;
}

/** constant behind trivially-equal arithmetic */
function obf(n: number, rng: BuildRng): string {
  switch (rng.int(4)) {
    case 0: {
      const j = rng.int(89) + 11;
      return `(${n}+${j}-${j})`;
    }
    case 1: return `(${n}*4/4)`;
    case 2: return `((${n}+256)-256)`;
    default: return `(${n}-0)`;
  }
}

export function emitRuntime(opts: EmitOptions): EmitResult {
  const rng = opts.rng;
  const tier = opts.tier;

  // ---------- identifiers ----------
  const used = new Set<string>(["run", "self"]);
  const id = (): string => {
    for (;;) {
      const n = rng.ident(6 + rng.int(6));
      if (!used.has(n)) {
        used.add(n);
        return n;
      }
    }
  };

  const N = {
    ctn: id(), pk: id(), ur: id(), envroot: id(), blob: id(), protos: id(),
    ch: id(), pos: id(), u8: id(), uvar: id(), svar: id(), np: id(),
    run: id(), pid2: id(), icv: id(), slices: id(), nic: id(), wm: id(), wmi: id(),
  };
  const F = {
    P0: id(), K: id(), C: id(), S: id(), cells: id(), sp: id(), mr: id(),
    pc: id(), VA: id(), i: id(), tc: id(), six: id(), poison: id(), PB: id(),
    ins: id(), op: id(), t: id(), k: id(), v: id(), x: id(), y: id(),
    acc: id(), base: id(), cnt: id(), sb: id(), a: id(), b: id(), e: id(),
    size: id(), narg: id(), so: id(), fpos: id(), fn: id(), R: id(), rn: id(),
    AA: id(), uv: id(), cid: id(), cp: id(), d: id(), stp: id(), lim: id(),
    st: id(), nv: id(), bse: id(), ctrl: id(), s2: id(), f2: id(), rs: id(),
    stat: id(), mrc: id(), tot: id(), n0: id(), sl: id(), seg: id(), h: id(),
    j: id(), q: id(), wmv: id(), escf: id(), env: id(), upv: id(), pid: id(),
    args: id(), A: id(),
  };

  // ---------- physical opcode mapping (provided by pipeline) ----------
  const P: number[] = opts.perm;
  const lit = (op: Op): string => obf(P[op], rng);

  let gateCounter = 0;
  const gate = (): string => {
    gateCounter++;
    if (!rng.bool()) return "";
    const ctr = gateCounter % 2 === 0 ? F.tc : F.wmv;
    switch (rng.int(3)) {
      // all forms verified tautologies over integers: x²≡x (mod 2)
      case 0: return ` and ((${ctr}*${ctr}+${ctr})%2)==0`;
      case 1: return ` and (((${ctr}*${ctr})-${ctr})%2)==0`;
      default: return ` and ((7*${ctr}*${ctr})+${ctr})%2==0`;
    }
  };

  // ---------- handlers ----------
  type H = { test: string; body: string[] };
  const hs: H[] = [];
  const add = (op: Op, body: string[]): void => {
    hs.push({ test: `op==${lit(op)}${gate()}`, body });
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
  add(Op.ESCAPE, [`error(${JSON.stringify(garbage(rng))})`]);

  // dispatch chain in randomized order
  const ordered = rng.shuffle(hs.slice());
  const chainLines: string[] = [];
  ordered.forEach((h, idx) => {
    chainLines.push(`${idx === 0 ? "if" : "elseif"} ${h.test} then`);
    chainLines.push(...h.body);
  });
  chainLines.push(`else`);
  chainLines.push(`error(${JSON.stringify(garbage(rng))})`);
  chainLines.push(`end`);

  // ---------- seeds / constants ----------
  const s0 = normSeed(opts.seeds[0]);
  const s1 = normSeed(opts.seeds[1]);

  const icvLits = opts.integrity.map((s) => obf(s[3], rng)).join(",");
  const slicesLits = opts.integrity
    .map((s, ix) => `{i=${ix + 1},p=${obf(s[0], rng)},a=${obf(s[1], rng)},b=${obf(s[2], rng)}}`)
    .join(",");
  const pbiasLit = obf(normSeed(opts.pbias), rng);

  // ---------- integrity + watermark tick ----------
  const tick: string[] = [];
  if (tier !== "off") {
    tick.push(
      `if ${N.nic}>0 then`,
      `local ${F.sl}=${N.slices}[${F.six}]`,
      `${F.six}=${F.six}%${N.nic}+1`,
      `if ${F.sl} then`,
      `local ${F.seg}=${N.protos}[${F.sl}.p] and ${N.protos}[${F.sl}.p].k`,
      `if ${F.seg} then`,
      `local ${F.h}=(2166136261%1000000007)`,
      `for ${F.j}=${F.sl}.a,${F.sl}.b do`,
      `local ${F.q}=${F.seg}[${F.j}]`,
      `if ${F.q} then ${F.h}=(${F.h}*16777619+${F.q}[1]*31+${F.q}[2]*7+${F.q}[3]*3+${F.q}[4])%1000000007 end`,
      `end`,
      `if ${F.h}~=${N.icv}[${F.sl}.i] then`,
      tier === "strict"
        ? `error(${JSON.stringify(garbage(rng))})`
        : `${F.poison}=true ${F.PB}=${pbiasLit}`,
      `end`,
      `end`,
      `end`,
      `end`,
    );
  }
  tick.push(`${F.wmv}=(${N.wm}[(${F.six}*7)%${N.wmi}+1]==nil) and 1 or 0`);

  const countdown =
    tier === "off"
      ? []
      : [`${F.tc}=${F.tc}-1`, `if ${F.tc}<=0 then`, ...tick.map((l) => l), `${F.tc}=64`, `end`];

  // ---------- assemble ----------
  const L: string[] = [];
  L.push(`-- NEVAHEX-VM v2.1 "The Abyss". Protected artifact. Do not edit.`);
  L.push(`local ${N.ctn}=setmetatable({},{__mode="k"})`);
  L.push(`local function ${N.pk}(...) local n=select('#',...) return {n=n,...} end`);
  L.push(`local function ${N.ur}(t,i,j) if i>j then return end return t[i],${N.ur}(t,i+1,j) end`);
  L.push(`local ${N.envroot}=_G or _ENV`);
  L.push(`local ${N.blob}=${luaEscape(opts.blob)}`);
  L.push(`local ${N.protos}={}`);
  L.push(`local ${N.wm}={}`);
  L.push(`local ${N.ch}=string.char`);
  L.push(`do`);
  L.push(` local ${N.pos}=1`);
  L.push(` local D={} local bn=#${N.blob}`);
  L.push(` local sa=${obf(s0, rng)} sb=${obf(s1, rng)} MM=${M31}`);
  L.push(` for i=1,bn do`);
  L.push(`  sa=(sa*48271)%MM sb=(sb*69621)%MM`);
  L.push(`  D[i]=(string.byte(${N.blob},i)-((math.floor(sa/65536)+math.floor(sb/65536))%256)+512)%256`);
  L.push(` end`);
  if (process.env.NEVAHEX_DEBUG) {
    L.push(` GD=D GB=bn GS=sa GS2=sb`);
  }
  L.push(` local function ${N.u8}() local bt=D[${N.pos}] ${N.pos}=${N.pos}+1 return bt end`);
  L.push(` local function ${N.uvar}()`);
  L.push(`  local sh,r=0,0`);
  L.push(`  while true do`);
  L.push(`   local bt=${N.u8}()`);
  L.push(`   r=r+(bt%128)*(2^sh)`);
  L.push(`   if bt<128 then return r end`);
  L.push(`   sh=sh+7`);
  L.push(`  end`);
  L.push(` end`);
  L.push(` local function ${N.svar}()`);
  L.push(`  local u=${N.uvar}()`);
  L.push(`  if u%2==1 then return -(u+1)/2 end`);
  L.push(`  return u/2`);
  L.push(` end`);
  // skip header: marker(3) + version(1)
  L.push(` local _mh1,_mh2,_mh3,_mv=${N.u8}(),${N.u8}(),${N.u8}(),${N.u8}()`);
  L.push(` local ${N.np}=${N.uvar}()`);
  L.push(` for ${N.pid2}=1,${N.np} do`);
  L.push(`  local pr={}`);
  L.push(`  pr.pn=${N.u8}()`);
  L.push(`  pr.va=${N.u8}()==1`);
  L.push(`  local nu=${N.uvar}()`);
  L.push(`  pr.uv={}`);
  L.push(`  for i=1,nu do pr.uv[i]={${N.u8}()==1 and 1 or 0,${N.uvar}()} end`);
  L.push(`  pr.ns=${N.uvar}()`);
  L.push(`  local nc=${N.uvar}()`);
  L.push(`  pr.c={}`);
  L.push(`  for i=1,nc do`);
  L.push(`   local tag=${N.u8}()`);
  L.push(`   if tag==1 then pr.c[i]=true`);
  L.push(`   elseif tag==2 then pr.c[i]=false`);
  L.push(`   elseif tag==5 or tag==6 then`);
  L.push(`    local ln=${N.uvar}()`);
  L.push(`    local sv=""`);
  L.push(`    for j=1,ln do ${N.pos}=${N.pos}+1 sv=sv..${N.ch}(D[${N.pos}-1]) end`);
  L.push(`    if tag==5 then pr.c[i]=tonumber(sv) else pr.c[i]=sv end`);
  L.push(`   else pr.c[i]=nil end`);
  L.push(`  end`);
  L.push(`  local nk=${N.uvar}()`);
  L.push(`  pr.k={}`);
  L.push(`  for i=1,nk do`);
  L.push(`   pr.k[i]={${N.u8}(),${N.svar}(),${N.svar}(),${N.svar}()}`);
  L.push(`  end`);
  L.push(`  ${N.protos}[${N.pid2}]=pr`);
  L.push(` end`);
  // watermark tail section
  L.push(` local wln=${N.uvar}()`);
  const [wsa, wsb] = wmSeeds(opts.seeds[2]);
  L.push(` local wa=${obf(normSeed(wsa), rng)} wb=${obf(normSeed(wsb), rng)} MM2=${M31}`);
  L.push(` for i=1,wln do`);
  L.push(`  wa=(wa*48271)%MM2 wb=(wb*69621)%MM2`);
  L.push(`  ${N.wm}[i]=(D[${N.pos}]-((math.floor(wa/65536)+math.floor(wb/65536))%256)+512)%256`);
  L.push(`  ${N.pos}=${N.pos}+1`);
  L.push(` end`);
  L.push(`end`);
  L.push(`${N.wmi}=#${N.wm}`);
  L.push(`if ${N.wmi}<1 then ${N.wmi}=1 ${N.wm}[1]=0 end`);
  if (tier !== "off") {
    L.push(`local ${N.icv}={${icvLits}}`);
    L.push(`local ${N.slices}={${slicesLits}}`);
    L.push(`${N.nic}=#${N.slices}`);
  } else {
    L.push(`local ${N.nic}=0`);
    L.push(`local ${N.icv}={} local ${N.slices}={}`);
  }
  L.push(`local function ${N.run}(${F.pid},${F.env},${F.upv},${F.args},${F.escf})`);
  L.push(` local ${F.P0}=${N.protos}[${F.pid}]`);
  L.push(` local ${F.K}=${F.P0}.k`);
  L.push(` local ${F.C}=${F.P0}.c`);
  L.push(` local ${F.S}={}`);
  L.push(` local ${F.cells}={}`);
  L.push(` for ${F.i}=1,${F.P0}.ns do ${F.cells}[${F.i}]={} end`);
  L.push(` local ${F.sp},${F.mr},${F.pc}=0,-1,1`);
  L.push(` local ${F.VA}=${F.args}`);
  L.push(` for ${F.i}=1,${F.P0}.pn do ${F.cells}[${F.i}].v=${F.args}[${F.i}] end`);
  L.push(` local ${F.tc},${F.six}=37,1`);
  L.push(` local ${F.poison},${F.PB},${F.wmv}=false,nil,0`);
  L.push(` local ${F.rn},${F.narg},${F.so},${F.fpos},${F.fn}`);
  L.push(` local ${F.ins},${F.op}`);
  L.push(` while true do`);
  for (const cl of countdown) L.push(`  ${cl}`);
  L.push(`  ${F.ins}=${F.K}[${F.pc}]`);
  L.push(`  ${F.op}=${F.ins}[1]`);
  L.push(`  ${F.pc}=${F.pc}+1`);
  for (const cl of chainLines) L.push(`  ${cl}`);
  L.push(` end`);
  L.push(`end`);
  L.push(`do`);
  L.push(` local ${F.A}=${N.pk}(...)`);
  L.push(` ${N.run}(${opts.rootPid},${N.envroot},{},${F.A},nil)`);
  L.push(`end`);

  return { lua: L.join("\n") };
}
