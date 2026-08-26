// NEVAHEX-VM — runtime emitter (artifact assembly).
// Modules consumed from engine/runtime/: identifiers, tiers, integrity,
// carriers, dispatcher. Protection layers wired here: anti-tamper (integrity
// ticks), watermark carriers, optional anti-emulation, environmental keying,
// bounded-resource budgets.
//
// E6 CONVENTION (binding): every compound arithmetic expression emitted into
// the artifact is FULLY parenthesized. Never rely on Lua operator precedence
// in generated text — precedence bugs are a classic generator failure mode.
// E1/E2: the assembled artifact is budget-checked (locals/upvalues) before
// emitRuntime returns; breaches throw with a named report.
import { BuildRng } from "../gen/prng";
import { Op } from "./opcodes";
import { Seeds, normSeed, wmSeeds, InstrFieldKeys } from "./serializer";
import { IdAllocator } from "../engine/runtime/identifiers";
import { Tier, tierViolationLines } from "../engine/runtime/tiers";
import { emitIntegrityCheck, IntegrityNames } from "../engine/runtime/integrity";
import { emitCarrierTouch } from "../engine/runtime/carriers";
import {
  buildHandlers, assembleChain, FieldKeyNames,
} from "../engine/runtime/dispatcher";
import { OpenCodeParams } from "../engine/runtime/opencode";
import { emitCipherGuard } from "../engine/runtime/cipherguard";
import { BlobSlice } from "../protection/antitamper";
import { checkBudgets, DECODE_BLOCK_LOCALS } from "../engine/runtime/localbudget";
import { AntiEmulationConfig, emitAntiEmulationBlock } from "../protection/antiemulation";
import { EnvProfile, emitEnvKeyingBlock } from "../protection/envkeying";
import { ResourceBudget, DEFAULT_BUDGET } from "../protection/resources";
import { emitDynLoadPrelude } from "../engine/runtime/dynload";
import { emitEntropyPoolBlock } from "../protection/entropypool";

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
  /** optional string.dump+load path (Phase 2 exception; disabled for luau) */
  dynLoad?: boolean;
  /** Environmental Entropy Pool mixing (Phase 3.1); active when envProfile set */
  entropyPool?: boolean;
  /** enforce Triple-VM closure boundaries in the artifact (Phase 3 contracts) */
  layered?: boolean;
  /**
   * baked-down cipher seed literals embedded in the file (environment keying).
   * When present they replace seeds[0]/[1] as the embedded sa/sb registers;
   * the runtime adds its fingerprint constant back to recover the effective
   * opts.seeds[0]/[1] that encrypted the blob.
   */
  cipherLiterals?: [number, number] | null;
  /** per-build instruction-record field keys (wire v3.2) */
  fieldKeys: InstrFieldKeys;
  /** rolling-key opcode encoding params (Phase 2); required */
  opencode: OpenCodeParams;
  /** Phase 4 superoperators (opt-in): fused specs with assigned phys values */
  fused?: Array<{ phys: number; members: Op[] }>;
  /** Phase 5 ciphertext-integrity windows over the ENCRYPTED blob */
  blobSlices?: BlobSlice[];
  /** APEX W1.3: root invocation hidden behind a randomized metamethod trap */
  mmTraps?: boolean;
  /**
   * APEX W1.2 keyless schedule payload: decoy number pool (12 entries, four
   * meaningful) + the four rng-shuffled indices. When present the seed
   * registers are reassembled from decrypted prologue bytes + pool entries;
   * no seed literal ships.
   */
  keylessPool?: { nums: number[]; i1: number; i2: number; i3: number; i4: number };
  /**
   * APEX W1.1 stage-2 was an inner-VM path; superseded by the v3 (Hex3)
   * backend. The option is retained as a deprecated flag for build-line
   * stability: passing it is now a silent no-op.
   */
  stage2?: boolean;
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

// (emitStage2Runtime removed: the stage-2 inlining of the inner deserializer
// VM is an unfinished, unused code path. The Hex3 (v3) backend supersedes
// the stage-2 approach entirely — the goal of "interpret the interpreter"
// is achieved with a smaller artifact footprint and a far stronger threat
// model by running the deserializer in a register-based VM with opaque
// predicates and a non-linear keystream. See engine/hex3/* for the v3 work.)

export function emitRuntime(opts: EmitOptions): EmitResult {
  const rng = opts.rng;
  const tier = opts.tier;
  const ids = new IdAllocator(["run", "self"], rng);
  const id = (): string => ids.alloc();

  const N = {
    ctn: id(), pk: id(), ur: id(), envroot: id(), blob: id(), protos: id(),
    ch: id(), pos: id(), u8: id(), uvar: id(), svar: id(), np: id(),
    run: id(), pid2: id(), icv: id(), slices: id(), nic: id(), wm: id(), wmi: id(),
    l1: id(), hdr: id(), cv: id(), uup: id(), sch: id(), tcn: id(),
  };
  // anti-emulation calibration state: file-scope locals (per-build names),
  // NOT globals — the old __ae_t0/__ae_ops names were a static signature.
  const aeT0 = id();
  const aeOps = id();
  // Phase 2: instruction-record field-key locals + rolling-key constants
  const keyNames: FieldKeyNames = { OP: id(), A: id(), B1: id(), B2: id(), C: id() };
  const rk0N = id();
  const astepN = id();
  const aincN = id();
  const rkN = id();
  // Phase 3: constant-pool mask root (normalized seeds[3]) + accessor name
  const ck0N = id();
  // Phase 5: cross-coupling flag — raised by silent-tier violations, shifts
  // every subsequent constant-decryption stream
  const cvwN = id();
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
  // The dispatch chain emits `op` in every leaf test and every range
  // router. We pin F.op to the literal name "op" so the chain and the
  // frame-local read from the same identifier (a unique randomized
  // name would force a textual rename at assemble time and risk
  // matching unrelated identifiers like "op" in handler bodies).
  F.op = "op";

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
    keys: keyNames,
    rng,
    tier,
    lit,
    phys: (op: Op): number => P[op],
    gate,
    escapeGarbageLit: JSON.stringify(garbage(rng)),
    synthCount: 2 + rng.int(4),
    fused: opts.fused,
  });
  const { chainLines, dispatchOrder } = assembleChain(
    handlers,
    rng,
    JSON.stringify(garbage(rng)),
  );

  if (process.env.NEVAHEX_DEBUG) {
    // diagnostic build: fallback reveals op/pc instead of garbage
    const elseIdx = chainLines.lastIndexOf("else");
    if (elseIdx >= 0) {
      chainLines[elseIdx + 1] =
        `error("FB op="..tostring(op).." pc="..tostring(pc - 1).." ns="..tostring(P0 ~= nil and P0.ns or -1))`;
      void elseIdx;
    }
  }

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
    protos: N.protos, keys: keyNames,
    sl: F.sl, seg: F.seg, h: F.h, j: F.j, q: F.q, v: F.v,
  };

  // ---------- integrity + watermark tick (engine/runtime modules) ----------
  const tick: string[] = [];
  if (tier !== "off") {
    const response = tierViolationLines(tier, JSON.stringify(garbage(rng)), {
      poisonVar: F.poison, pbVar: F.PB, biasLit: pbiasLit, cvwVar: cvwN,
    });
    tick.push(...emitIntegrityCheck(IN, response));
  }
  tick.push(...emitCarrierTouch({ wmVar: N.wm, wmiVar: N.wmi, sixVar: F.six, sinkVar: F.wmv }));
  // anti-emulation timing layer (os.clock required; caller disables for luau)
  const ae = emitAntiEmulationBlock(opts.antiEmulation ?? null, {
    tcVar: F.tc, poisonVar: F.poison, pbVar: F.PB, aeT0, aeOps, cvwVar: cvwN,
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
  // Phase 6: argument spreading — native unpack for wide ranges, recursive
  // fallback otherwise (identical semantics, no deep-call cost on big spans)
  L.push(`local ${N.uup}=unpack or (table and table.unpack)`);
  L.push(`local function ${N.ur}(t,i,j)`);
  L.push(` if i>j then return end`);
  L.push(` if ${N.uup} and j-i>15 then return ${N.uup}(t,i,j) end`);
  L.push(` return t[i],${N.ur}(t,i+1,j)`);
  L.push(`end`);
  L.push(`local ${N.envroot}=_G or _ENV`);
  // anti-emulation calibration state lives in file-scope locals (upvalues of
  // the frame closures below), never in named globals
  if (opts.antiEmulation) {
    L.push(`local ${aeT0},${aeOps}`);
  }
  // Phase 2: instruction-record field keys + rolling-key opcode constants —
  // file-scope locals captured by both the decoder closure and run() frames
  L.push(
    `local ${keyNames.OP}=${obf(opts.fieldKeys.OP, rng)} ${keyNames.A}=${obf(opts.fieldKeys.A, rng)} ` +
      `${keyNames.B1}=${obf(opts.fieldKeys.B1, rng)} ${keyNames.B2}=${obf(opts.fieldKeys.B2, rng)} ` +
      `${keyNames.C}=${obf(opts.fieldKeys.C, rng)}`,
  );
  L.push(
    `local ${rk0N}=${obf(opts.opencode.rk0, rng)} ${astepN}=${obf(opts.opencode.astep, rng)} ` +
      `${aincN}=${obf(opts.opencode.ainc, rng)}`,
  );
  // Phase 3: constant-pool mask root — normalized seeds[3]; per-proto streams
  // derive as (CK0+pid*7919), mirroring serializer constSeed()
  L.push(`local ${ck0N}=${obf(normSeed(opts.seeds[3]), rng)}`);
  // Phase 5 cross-coupling state + weight (shared root with the shell guard's
  // sb delta so one per-build secret governs both corruption channels)
  L.push(`local ${cvwN}=0`);
  const cvwWeight = obf(normSeed(opts.pbias * 15485863 + 11), rng);
  // Phase 6: hoisted string primitives (one global lookup per BUILD, not per
  // byte) — used by the CV accessor and the blob decode loop
  L.push(`local ${N.sch}=string.char local ${N.tcn}=table.concat`);
  // decrypt-on-access constant accessor: wire/decoded tables hold masked
  // payloads; plaintext exists only after first use (then cached in e.v)
  L.push(`local function ${N.cv}(pID,e)`);
  L.push(` if type(e)~='table' then return e end`);
  L.push(` local v=e.v if v~=nil then return v end`);
  L.push(` local kk=(${ck0N}+pID*7919+${cvwN}*${cvwWeight})%2147483646 if kk<1 then kk=kk+2147483646 end`);
  L.push(` _G.LAST_KK=kk _G.LAST_PID=pID _G.LAST_N=e.n _G.LAST_T=e.t`);
  // Phase 6: batch materialization — parts[] + table.concat avoids the
  // quadratic `sv = sv .. ch()` chain on long constants
  L.push(` local parts={} local g=kk`);
  L.push(` for j=1,e.n do g=(g*48271)%2147483647 parts[j]=${N.sch}((e.b[j]-(g%256)+256)%256) end`);
  L.push(` local sv=${N.tcn}(parts)`);
  L.push(` if e.t==5 then v=tonumber(sv) else v=sv end`);
  L.push(` _G.LAST_V=v`);
  L.push(` e.v=v return v`);
  L.push(`end`);

  // optional dynamic-load path (Phase 2 exception; opt-in, disabled for luau)
  if (opts.dynLoad && opts.envProfile !== "luau") {
    const dyn = emitDynLoadPrelude(true, opts.envProfile ?? "universal", { fn: ids.alloc() });
    if (dyn) for (const dl of dyn.lines) L.push(dl);
  }

  L.push(`--[L1_SHELL] outer shell: blob decryption + environment derivation + budgets`);
  // Phase 3 enforced boundaries: when layered, decode internals live inside a
  // sealed L1 closure exposing only an opaque handle {P, WM, WMI}.
  const layered = opts.layered === true;
  if (layered) {
    L.push(`local ${N.l1}=(function()`);
    L.push(`local ${N.blob}=${luaEscape(opts.blob)}`);
    L.push(`local ${N.protos}={}`);
    L.push(`local ${N.wm}={}`);
    L.push(`do`);
  } else {
    L.push(`local ${N.blob}=${luaEscape(opts.blob)}`);
    L.push(`local ${N.protos}={}`);
    L.push(`local ${N.wm}={}`);
    L.push(`do`);
  }
  L.push(` local ${N.pos}=1`);
  L.push(` local D={} local bn=#${N.blob}`);
  // bounded-resource guard: refuse absurd blobs outright
  const runtimeBudget = opts.budget ?? DEFAULT_BUDGET;
  L.push(` if bn>${runtimeBudget.maxDecodeBytes} then error(${JSON.stringify(garbage(rng))}) end`);
  // W1.2 keyless: registers reassemble from decrypted prologue bytes + decoy
  // pool entries (modulus M31-1 everywhere, mirroring pipeline norm()).
  // Legacy builds keep the obfuscated register literals.
  const gpN = id();
  if (opts.keylessPool) {
    L.push(` local MM=${M31}`);
    const kp = opts.keylessPool;
    L.push(` local ${gpN}={${kp.nums.join(",")}}`);
    L.push(
      ` local sa=(D[5]*16777216+D[6]*65536+D[7]*256+D[8]+${gpN}[${kp.i1}]-${gpN}[${kp.i2}])%2147483646` +
        ` if sa<1 then sa=sa+2147483646 end`,
    );
    L.push(
      ` local sb=(D[9]*16777216+D[10]*65536+D[11]*256+D[12]+${gpN}[${kp.i3}]-${gpN}[${kp.i4}])%2147483646` +
        ` if sb<1 then sb=sb+2147483646 end`,
    );
  } else {
    L.push(` local sa=${obf(s0, rng)} sb=${obf(s1, rng)} MM=${M31}`);
  }
  // ---- Phase 5: ciphertext integrity guard (pre-decode) ----
  // Verified BEFORE any keystream work: strict halts outright; silent shifts
  // the seed registers themselves (decoding proceeds into structured garbage)
  // and raises the CVW coupling flag so constants decrypt to garbage too.
  if (tier !== "off" && opts.blobSlices && opts.blobSlices.length > 0) {
    const tableLit = opts.blobSlices
      .map((s) => `{p=${obf(s.p, rng)},a=${obf(s.a, rng)},h=${obf(s.h, rng)}}`)
      .join(",");
    const guardLines = emitCipherGuard(tier, opts.blobSlices, tableLit, {
      blobVar: N.blob,
      saVar: "sa",
      sbVar: "sb",
      cvwVar: cvwN,
      garbageLit: JSON.stringify(garbage(rng)),
      deltaSa: obf(normSeed(opts.pbias * 104729 + 29), rng),
      deltaSb: obf(normSeed(opts.pbias * 15485863 + 11), rng),
    });
    if (guardLines) for (const gl of guardLines) L.push(` ${gl}`);
  }
  // environmental keying (hardened derive-not-compare): mix fingerprint constant
  const envLines = emitEnvKeyingBlock(opts.envProfile ?? "universal", "sa", "sb");
  if (envLines) for (const el of envLines) L.push(` ${el}`);
  // Environmental Entropy Pool (Phase 3.1): stable-signal fingerprint mixing
  if (opts.entropyPool !== false && (opts.envProfile ?? "universal") !== "universal") {
    const pool = emitEntropyPoolBlock(opts.envProfile ?? "universal", "sa", "sb");
    if (pool) for (const pl of pool) L.push(` ${pl}`);
  }
  // cipher v3: derive the hidden second pair from the shipped registers AFTER
  // environmental mixing, then run the 4-stream cross-mixed feedback core.
  // Line-for-line mirror of engine/crypto/cipher.ts step() (doubles < 2^53).
  // Phase 6: sbyte hoist — one global lookup instead of one per byte.
  L.push(` local sbyte=string.byte`);
  L.push(` local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0`);
  L.push(` for i=1,bn do`);
  L.push(`  sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM`);
  L.push(`  sb=(sb+pv)%MM sc=(sc+sa)%MM`);
  L.push(`  pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256`);
  L.push(`  D[i]=(sbyte(${N.blob},i)-pv+256)%256`);
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
  // framing v3: high bit = format tag, low 7 bits = randomized prologue length
  L.push(` local ${N.hdr}=${N.u8}()`);
  L.push(` if ${N.hdr}<128 then error(${JSON.stringify(garbage(rng))}) end`);
  L.push(` for i=1,${N.hdr}-128 do ${N.u8}() end`);
  L.push(` local ${N.np}=${N.uvar}()`);
  L.push(` if ${N.np}>${runtimeBudget.maxProtos} then error(${JSON.stringify(garbage(rng))}) end`);
  L.push(` for ${N.pid2}=1,${N.np} do`);
  L.push(`  local pr={}`);
  L.push(`  pr.pn=${N.u8}()`);
  L.push(`  pr.va=${N.u8}()==1`);
  L.push(`  local nu=${N.uvar}()`);
  L.push(`  pr.uv={}`);
  L.push(`  for i=1,nu do pr.uv[i]={${N.u8}()==1 and 1 or 0,${N.uvar}()} end`);
  L.push(`  pr.ns=${N.uvar}()`);
  // The serializer writes 5 redundant field-key uvarints after ns (per
  // proto) for future per-proto divergence. The runtime captures the
  // keys at file scope (${keyNames.OP}..${keyNames.C}) and uses those
  // names when assembling the instruction record; the on-wire copies
  // are intentionally skipped here.
  L.push(`  ${N.uvar}() ${N.uvar}() ${N.uvar}() ${N.uvar}() ${N.uvar}()`);
  L.push(`  local nc=${N.uvar}()`);
  L.push(`  if nc>${runtimeBudget.maxConsts} then error(${JSON.stringify(garbage(rng))}) end`);
  L.push(`  pr.c={}`);
  L.push(`  for i=1,nc do`);
  // Phase 3: payloads arrive MASKED — store opaque {t,n,b} records; the CV
  // accessor decrypts on first access (plaintext never rests in pr.c)
  L.push(`   local tag=${N.u8}()`);
  L.push(`   if tag==1 then pr.c[i]=true`);
  L.push(`   elseif tag==2 then pr.c[i]=false`);
  // E3: dedicated non-finite tags — computed at runtime, no payload bytes
  L.push(`   elseif tag==7 then pr.c[i]=(0/0)`);
  L.push(`   elseif tag==8 then pr.c[i]=math.huge`);
  L.push(`   elseif tag==9 then pr.c[i]=-math.huge`);
  L.push(`   elseif tag==5 or tag==6 then`);
  L.push(`    local ln=${N.uvar}()`);
  L.push(`    local bb={}`);
  L.push(`    for j=1,ln do ${N.pos}=${N.pos}+1 bb[j]=D[${N.pos}-1] end`);
  L.push(`    pr.c[i]={t=tag,n=ln,b=bb}`);
  L.push(`   else pr.c[i]=nil end`);
  L.push(`  end`);
  L.push(`  local nk=${N.uvar}()`);
  L.push(`  if nk>${runtimeBudget.maxCode} then error(${JSON.stringify(garbage(rng))}) end`);
  L.push(`  pr.k={}`);
  // per-proto rolling-key mirror for operand de-whitening (same chain the
  // fetch loop uses for opE — independent simulation, identical sequence)
  L.push(`  local lrk=(${rk0N}+${N.pid2}*${astepN})%65536`);
  L.push(`  for i=1,nk do`);
  L.push(`   local mm=math.floor(lrk/3)%256`);
  L.push(`   local oe=${N.uvar}()`);
  L.push(`   local aw=${N.svar}()-mm`);
  L.push(`   local b1w=${N.svar}()-mm`);
  L.push(`   local b2w=${N.svar}()+mm`);
  L.push(`   local cw=${N.svar}()-mm`);
  L.push(`   lrk=(lrk+${aincN})%65536`);
  L.push(`   pr.k[i]={[${keyNames.OP}]=oe,[${keyNames.A}]=aw,[${keyNames.B1}]=b1w,[${keyNames.B2}]=b2w,[${keyNames.C}]=cw}`);
  L.push(`  end`);
  L.push(`  ${N.protos}[${N.pid2}]=pr`);
  L.push(` end`);
  // watermark tail section (same cipher v3 core, wm seed registers)
  L.push(` local wln=${N.uvar}()`);
  const [wsa, wsb] = wmSeeds(opts.seeds[2]);
  L.push(` local wa=${obf(normSeed(wsa), rng)} wb=${obf(normSeed(wsb), rng)} MM2=${M31}`);
  L.push(` local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0`);
  L.push(` for i=1,wln do`);
  L.push(`  wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2`);
  L.push(`  wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2`);
  L.push(`  pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256`);
  L.push(`  ${N.wm}[i]=(D[${N.pos}]-pv2+256)%256`);
  L.push(`  ${N.pos}=${N.pos}+1`);
  L.push(` end`);
  if (layered) {
    // WMI fixups stay inside L1; then seal the handle
    L.push(`${N.wmi}=#${N.wm}`);
    L.push(`if ${N.wmi}<1 then ${N.wmi}=1 ${N.wm}[1]=0 end`);
    L.push(`return {P=${N.protos},WM=${N.wm},WMI=${N.wmi}}`);
    L.push(`end)()`);
  } else {
    L.push(`end`);
    L.push(`${N.wmi}=#${N.wm}`);
    L.push(`if ${N.wmi}<1 then ${N.wmi}=1 ${N.wm}[1]=0 end`);
  }
  L.push(`--[L3_CONSTS] const plane: proto constant pools + watermark carriers`);
  if (tier !== "off") {
    L.push(`local ${N.icv}={${icvLits}}`);
    L.push(`local ${N.slices}={${slicesLits}}`);
    L.push(`${N.nic}=#${N.slices}`);
  } else {
    L.push(`local ${N.nic}=0`);
    L.push(`local ${N.icv}={} local ${N.slices}={}`);
  }
  L.push(`--[L2_VM] core VM: dispatcher + integrity ticks + tier policy`);
  const runStartLine = L.length; // E1/E2: budget regions measured from here
  if (layered) {
    L.push(`local function ${N.run}(l1,${F.pid},${F.env},${F.upv},${F.args},${F.escf})`);
    L.push(` local ${N.protos},${N.wm},${N.wmi}=l1.P,l1.WM,l1.WMI`);
  } else {
    L.push(`local function ${N.run}(${F.pid},${F.env},${F.upv},${F.args},${F.escf})`);
  }
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
  // Phase 2: per-frame rolling key — mirrors serializer's initialRk(pid)
  L.push(` local ${rkN}=(${rk0N}+${F.pid}*${astepN})%65536`);
  L.push(` local ${F.rn},${F.narg},${F.so},${F.fpos},${F.fn}`);
  L.push(` local ${F.ins},${F.op}`);
  L.push(` while true do`);
  for (const cl of countdown) L.push(`  ${cl}`);
  if (process.env.NEVAHEX_DEBUG) {
    L.push(`  do local _i=${F.K}[${F.pc}] print("DBG pc",${F.pc},"opE",_i and _i[${keyNames.OP}]) end`);
  }
  L.push(`  ${F.ins}=${F.K}[${F.pc}]`);
  // decode op under the rolling key, then advance it (build side simulates
  // the identical chain — engine/runtime/opencode.ts)
  L.push(`  ${F.op}=(((${F.ins}[${keyNames.OP}]-${rkN})+65536)%65536)`);
  L.push(`  ${rkN}=(${rkN}+${aincN})%65536`);
  L.push(`  ${F.pc}=${F.pc}+1`);
  for (const cl of chainLines) L.push(`  ${cl}`);
  L.push(` end`);
  L.push(`end`);
  const runEndLine = L.length; // E1/E2: run() body slice ends here
  L.push(`do`);
  L.push(` local ${F.A}=${N.pk}(...)`);
  // W1.3: one-shot metamethod trap — the root invoke hides behind a
  // per-build random arithmetic metamethod on a table we own. Net call depth
  // ≤ +1 (single handler, prologue-only) per the E4 budget; plain tables
  // only, so Roblox's protected string metatable is irrelevant. The handler
  // returns run()'s result table; the trigger operand is discarded.
  if (opts.mmTraps) {
    const mmOps = ["__add", "__sub", "__mul", "__mod"] as const;
    const op = mmOps[rng.int(mmOps.length)];
    const trig = [0, -7, 3][rng.int(3)];
    const mt = id();
    const rs = id();
    const args =
      `(${layered ? N.l1 + "," : ""}${opts.rootPid},${N.envroot},{},${F.A},nil)`;
    L.push(` local ${mt}=setmetatable({}, {${op}=function() return ${N.run}${args} end})`);
    L.push(` local ${rs}=${mt} * ${trig}`);
    void rs;
  } else {
    if (layered) {
      L.push(` ${N.run}(${N.l1},${opts.rootPid},${N.envroot},{},${F.A},nil)`);
    } else {
      L.push(` ${N.run}(${opts.rootPid},${N.envroot},{},${F.A},nil)`);
    }
  }
  L.push(`end`);

  // ---- E1/E2: local & upvalue budgets — fail the BUILD, not the load ----
  const fileScopeNames = [
    ...Object.values(N),
    aeT0, aeOps,
    keyNames.OP, keyNames.A, keyNames.B1, keyNames.B2, keyNames.C,
    rk0N, astepN, aincN, ck0N, cvwN,
  ];
  const budget = checkBudgets(
    L.join("\n"),
    L.slice(runStartLine, runEndLine).join("\n"),
    fileScopeNames.filter((n) => !DECODE_BLOCK_LOCALS.has(n)),
  );
  if (!budget.ok) {
    throw new Error(
      `NEVAHEX internal: emitted-code budget exceeded\n  ` +
        budget.problems.join("\n  "),
    );
  }

  return { lua: L.join("\n"), dispatchOrder };
}
