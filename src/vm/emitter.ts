// NEVAHEX-VM — runtime emitter (artifact assembly).
// Modules consumed from engine/runtime/: identifiers, tiers, integrity,
// carriers, dispatcher. Protection layers wired here: anti-tamper (integrity
// ticks), watermark carriers, optional anti-emulation, environmental keying,
// bounded-resource budgets.
import { BuildRng } from "../gen/prng";
import { Op } from "./opcodes";
import { Seeds, normSeed, wmSeeds } from "./serializer";
import { IdAllocator } from "../engine/runtime/identifiers";
import { Tier, tierViolationLines } from "../engine/runtime/tiers";
import { emitIntegrityCheck, IntegrityNames } from "../engine/runtime/integrity";
import { emitCarrierTouch } from "../engine/runtime/carriers";
import { buildHandlers, assembleChain } from "../engine/runtime/dispatcher";
import { AntiEmulationConfig, emitAntiEmulationBlock } from "../protection/antiemulation";
import { EnvProfile, emitEnvKeyingBlock } from "../protection/envkeying";
import { ResourceBudget, DEFAULT_BUDGET } from "../protection/resources";

export type { Tier };

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
  /** environment keying profile (default universal = disabled) */
  envProfile?: EnvProfile;
  /** anti-emulation timing layer config (null = disabled) */
  antiEmulation?: AntiEmulationConfig | null;
  /** bounded-resource budget */
  budget?: ResourceBudget;
  /**
   * baked-down cipher seed literals embedded in the file (environment keying).
   * When present they replace seeds[0]/[1] as the embedded sa/sb registers;
   * the runtime adds its fingerprint constant back to recover the effective
   * opts.seeds[0]/[1] that encrypted the blob.
   */
  cipherLiterals?: [number, number] | null;
}

export interface EmitResult {
  lua: string;
  /** physical-op sequence of the emitted dispatch chain (diversity metric) */
  dispatchOrder: number[];
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
  const ids = new IdAllocator(["run", "self"], rng);
  const id = (): string => ids.alloc();

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

  // ---------- handlers (engine/runtime/dispatcher) ----------
  const handlers = buildHandlers({
    N: N as unknown as Record<string, string>,
    F: F as unknown as Record<string, string>,
    rng,
    tier,
    lit,
    phys: (op: Op): number => P[op],
    gate,
    escapeGarbageLit: JSON.stringify(garbage(rng)),
  });
  const { chainLines, dispatchOrder } = assembleChain(
    handlers,
    rng,
    JSON.stringify(garbage(rng)),
  );

  // ---------- seeds / constants ----------
  const s0 = normSeed(opts.cipherLiterals ? opts.cipherLiterals[0] : opts.seeds[0]);
  const s1 = normSeed(opts.cipherLiterals ? opts.cipherLiterals[1] : opts.seeds[1]);

  const icvLits = opts.integrity.map((s) => obf(s[3], rng)).join(",");
  const slicesLits = opts.integrity
    .map((s, ix) => `{i=${ix + 1},p=${obf(s[0], rng)},a=${obf(s[1], rng)},b=${obf(s[2], rng)}}`)
    .join(",");
  const pbiasLit = obf(normSeed(opts.pbias), rng);

  // integrity tick names → dispatcher frame locals
  const IN: IntegrityNames = {
    icv: N.icv, slices: N.slices, nic: N.nic, six: F.six,
    protos: N.protos, sl: F.sl, seg: F.seg, h: F.h, j: F.j, q: F.q, v: F.v,
  };

  // ---------- integrity + watermark tick (engine/runtime modules) ----------
  const tick: string[] = [];
  if (tier !== "off") {
    const response = tierViolationLines(tier, JSON.stringify(garbage(rng)), {
      poisonVar: F.poison, pbVar: F.PB, biasLit: pbiasLit,
    });
    tick.push(...emitIntegrityCheck(IN, response));
  }
  tick.push(...emitCarrierTouch({ wmVar: N.wm, wmiVar: N.wmi, sixVar: F.six, sinkVar: F.wmv }));
  // anti-emulation timing layer (os.clock required; caller disables for luau)
  const ae = emitAntiEmulationBlock(opts.antiEmulation ?? null, {
    tcVar: F.tc, poisonVar: F.poison, pbVar: F.PB,
  });
  if (ae) {
    tick.push(`if os and os.clock then`);
    tick.push(...ae.map((l) => l));
    tick.push(`end`);
  }

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
  // bounded-resource guard: refuse absurd blobs outright
  const budget = opts.budget ?? DEFAULT_BUDGET;
  L.push(` if bn>${budget.maxDecodeBytes} then error(${JSON.stringify(garbage(rng))}) end`);
  L.push(` local sa=${obf(s0, rng)} sb=${obf(s1, rng)} MM=${M31}`);
  // environmental keying (hardened derive-not-compare): mix fingerprint constant
  const envLines = emitEnvKeyingBlock(opts.envProfile ?? "universal", "sa", "sb");
  if (envLines) for (const el of envLines) L.push(` ${el}`);
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
  L.push(` if ${N.np}>${budget.maxProtos} then error(${JSON.stringify(garbage(rng))}) end`);
  L.push(` for ${N.pid2}=1,${N.np} do`);
  L.push(`  local pr={}`);
  L.push(`  pr.pn=${N.u8}()`);
  L.push(`  pr.va=${N.u8}()==1`);
  L.push(`  local nu=${N.uvar}()`);
  L.push(`  pr.uv={}`);
  L.push(`  for i=1,nu do pr.uv[i]={${N.u8}()==1 and 1 or 0,${N.uvar}()} end`);
  L.push(`  pr.ns=${N.uvar}()`);
  L.push(`  local nc=${N.uvar}()`);
  L.push(`  if nc>${budget.maxConsts} then error(${JSON.stringify(garbage(rng))}) end`);
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
  L.push(`  if nk>${budget.maxCode} then error(${JSON.stringify(garbage(rng))}) end`);
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

  return { lua: L.join("\n"), dispatchOrder };
}
