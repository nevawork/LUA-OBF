"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitRuntime = emitRuntime;
const serializer_1 = require("./serializer");
const identifiers_1 = require("../engine/runtime/identifiers");
const tiers_1 = require("../engine/runtime/tiers");
const integrity_1 = require("../engine/runtime/integrity");
const carriers_1 = require("../engine/runtime/carriers");
const dispatcher_1 = require("../engine/runtime/dispatcher");
const cipherguard_1 = require("../engine/runtime/cipherguard");
const localbudget_1 = require("../engine/runtime/localbudget");
const antiemulation_1 = require("../protection/antiemulation");
const envkeying_1 = require("../protection/envkeying");
const resources_1 = require("../protection/resources");
const dynload_1 = require("../engine/runtime/dynload");
const entropypool_1 = require("../protection/entropypool");
const M31 = 2147483647;
function luaEscape(bytes) {
    let out = '"';
    for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        // Inside a double-quoted Lua literal, `"` (34) and `\` (92) MUST be
        // escaped; every other printable byte (40..126) is safe, the rest become
        // decimal \ddd escapes (valid in Lua 5.1+).
        if (b === 34)
            out += '\\"';
        else if (b === 92)
            out += "\\\\";
        else if (b >= 40 && b <= 126)
            out += String.fromCharCode(b);
        else
            out += "\\" + b.toString(10).padStart(3, "0");
    }
    return out + '"';
}
function garbage(rng) {
    const chars = "!@#$%^&*~?<>|{}[]AXQZ";
    let s = "";
    for (let i = 0; i < 28; i++)
        s += chars[rng.int(chars.length)];
    return s;
}
/** constant behind trivially-equal arithmetic */
function obf(n, rng) {
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
function emitRuntime(opts) {
    const rng = opts.rng;
    const tier = opts.tier;
    const ids = new identifiers_1.IdAllocator(["run", "self"], rng);
    const id = () => ids.alloc();
    const N = {
        ctn: id(), pk: id(), ur: id(), envroot: id(), blob: id(), protos: id(),
        ch: id(), pos: id(), u8: id(), uvar: id(), svar: id(), np: id(),
        run: id(), pid2: id(), icv: id(), slices: id(), nic: id(), wm: id(), wmi: id(),
        l1: id(), hdr: id(), cv: id(), uup: id(), sch: id(), tcn: id(),
    };
    // anti-emulation calibration state: file-scope locals (per-build names),
    // NOT globals — the old __ae_t0/__ae_ops names were a static signature.
    const aeT0 = id();
    const aeT1 = id();
    const aeT2 = id();
    const aeT3 = id();
    const aeT4 = id();
    const aeOps = id();
    const aeAllocOps = id();
    const aeMemOps = id();
    const aeArithOps = id();
    const aeTotalOps = id();
    const aeHookFlag = id();
    const aeEnvScore = id();
    // Phase 2: F object properties first — ensures their names are consumed
    // by the IdAllocator so that rolling-key constants below receive
    // disjoint names and cannot shadow or be shadowed by F.P0 / F.* locals
    // in the run() function and related inner functions.
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
    // Phase 2: instruction-record field-key locals + rolling-key constants
    const keyNames = { OP: id(), A: id(), B1: id(), B2: id(), C: id() };
    const rk0N = id();
    const astepN = id();
    const astep2N = id();
    const aincN = id();
    const rkN = id();
    // Phase 3: constant-pool mask root (normalized seeds[3]) + accessor name
    const ck0N = id();
    // Phase 5: cross-coupling flag — raised by silent-tier violations, shifts
    // every subsequent constant-decryption stream
    const cvwN = id();
    // Phase 4: cipher mismatch counter for adaptive poisoning
    const cmN = id();
    // ---------- physical opcode mapping (provided by pipeline) ----------
    const P = opts.perm;
    const lit = (op) => obf(P[op], rng);
    // The dispatch chain emits `op` in every leaf test and every range
    // router. We pin F.op to the literal name "op" so the chain and the
    // frame-local read from the same identifier (a unique randomized
    // name would force a textual rename at assemble time and risk
    // matching unrelated identifiers like "op" in handler bodies).
    F.op = "op";
    let gateCounter = 0;
    const gate = () => {
        gateCounter++;
        if (!rng.bool())
            return "";
        const ctr = gateCounter % 2 === 0 ? F.tc : F.wmv;
        switch (rng.int(3)) {
            // all forms verified tautologies over integers: x²≡x (mod 2)
            case 0: return ` and ((${ctr}*${ctr}+${ctr})%2)==0`;
            case 1: return ` and (((${ctr}*${ctr})-${ctr})%2)==0`;
            default: return ` and ((7*${ctr}*${ctr})+${ctr})%2==0`;
        }
    };
    // ---------- handlers (engine/runtime/dispatcher) ----------
    const handlers = (0, dispatcher_1.buildHandlers)({
        N: N,
        F: F,
        keys: keyNames,
        rng,
        tier,
        lit,
        phys: (op) => P[op],
        gate,
        escapeGarbageLit: JSON.stringify(garbage(rng)),
        synthCount: 2 + rng.int(4),
        fused: opts.fused,
    });
    const { chainLines, dispatchOrder } = (0, dispatcher_1.assembleChain)(handlers, rng, JSON.stringify(garbage(rng)));
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
    const s0 = (0, serializer_1.normSeed)(opts.cipherLiterals ? opts.cipherLiterals[0] : opts.seeds[0]);
    const s1 = (0, serializer_1.normSeed)(opts.cipherLiterals ? opts.cipherLiterals[1] : opts.seeds[1]);
    const icvLits = opts.integrity.map((s) => obf(s[3], rng)).join(",");
    const slicesLits = opts.integrity
        .map((s, ix) => `{i=${ix + 1},p=${obf(s[0], rng)},a=${obf(s[1], rng)},b=${obf(s[2], rng)},salt=${obf(s[4] ?? 0, rng)}}`)
        .join(",");
    const pbiasLit = obf((0, serializer_1.normSeed)(opts.pbias), rng);
    // integrity tick names → dispatcher frame locals
    const prevHash = id();
    const IN = {
        icv: N.icv, slices: N.slices, nic: N.nic, six: F.six,
        protos: N.protos, keys: keyNames,
        sl: F.sl, seg: F.seg, h: F.h, j: F.j, q: F.q, v: F.v,
        prevHash, saltVar: F.poison,
    };
    // ---------- integrity + watermark tick (engine/runtime modules) ----------
    const tick = [];
    if (tier !== "off") {
        const response = (0, tiers_1.tierViolationLines)(tier, JSON.stringify(garbage(rng)), {
            poisonVar: F.poison, pbVar: F.PB, biasLit: pbiasLit, cvwVar: cvwN,
        });
        tick.push(...(0, integrity_1.emitIntegrityCheck)(IN, response));
        // Phase 2: update prevHash after each integrity check for cross-slice correlation
        tick.push(`local ${prevHash}=${F.h}`);
    }
    tick.push(...(0, carriers_1.emitCarrierTouch)({ wmVar: N.wm, wmiVar: N.wmi, sixVar: F.six, sinkVar: F.wmv }));
    // anti-emulation timing layer (os.clock required; caller disables for luau)
    const ae = (0, antiemulation_1.emitAntiEmulationBlock)(opts.antiEmulation ?? null, {
        tcVar: F.tc, poisonVar: F.poison, pbVar: F.PB, aeT0, aeOps, cvwVar: cvwN,
        aeT1, aeAllocOps, aeMemOps, aeHookFlag,
        aeArithOps, aeTotalOps, aeT2, aeT3, aeT4, aeEnvScore,
    });
    if (ae) {
        tick.push(`if os and os.clock then`);
        tick.push(...ae.map((l) => l));
        tick.push(`end`);
    }
    const countdown = tier === "off"
        ? []
        : [`${F.tc}=${F.tc}-1`, `if ${F.tc}<=0 then`, ...tick.map((l) => l), `${F.tc}=64`, `end`];
    // ---------- assemble (single-function IIFE) ----------
    const body = [];
    const runtimeBudget = opts.budget ?? resources_1.DEFAULT_BUDGET;
    // ---- file-scope constants & helpers (declared as locals inside the IIFE) ----
    body.push(` local ${N.ctn}=setmetatable({},{__mode="k"})`);
    body.push(` local function ${N.pk}(...) local n=select('#',...) return {n=n,...} end`);
    // Phase 6: argument spreading — native unpack for wide ranges, recursive
    // fallback otherwise (identical semantics, no deep-call cost on big spans)
    body.push(` local ${N.uup}=_ENV.unpack or (table and table.unpack)`);
    body.push(` local function ${N.ur}(t,i,j)`);
    body.push(`  if i>j then return end`);
    body.push(`  if ${N.uup} and j-i>15 then return ${N.uup}(t,i,j) end`);
    body.push(`  return t[i],${N.ur}(t,i+1,j)`);
    body.push(` end`);
    // sch / tcn — bound to _ENV.string.char / _ENV.table.concat so the
    // _ENV bootstrap (passing `{}`) doesn't strip them
    body.push(` local ${N.sch}=_ENV.string.char`);
    body.push(` local ${N.tcn}=_ENV.table.concat`);
    // anti-emulation calibration state (upvalues of the closures below)
    if (opts.antiEmulation) {
        body.push(` local ${aeT0},${aeT1},${aeT2},${aeT3},${aeT4},${aeOps},${aeAllocOps},${aeMemOps},${aeArithOps},${aeTotalOps},${aeHookFlag},${aeEnvScore}`);
    }
    // Phase 2: instruction-record field keys + rolling-key opcode constants
    body.push(` local ${keyNames.OP}=${obf(opts.fieldKeys.OP, rng)} ${keyNames.A}=${obf(opts.fieldKeys.A, rng)} ` +
        `${keyNames.B1}=${obf(opts.fieldKeys.B1, rng)} ${keyNames.B2}=${obf(opts.fieldKeys.B2, rng)} ` +
        `${keyNames.C}=${obf(opts.fieldKeys.C, rng)}`);
    body.push(` local ${rk0N}=${obf(opts.opencode.rk0, rng)} ${astepN}=${obf(opts.opencode.astep, rng)} ${astep2N}=${obf(opts.opencode.astep2, rng)} ` +
        `${aincN}=${obf(opts.opencode.ainc, rng)}`);
    // Phase 3: constant-pool mask root — normalized seeds[3]; per-proto streams
    // derive as (CK0+pid*7919), mirroring serializer constSeed()
    body.push(` local ${ck0N}=${obf((0, serializer_1.normSeed)(opts.seeds[3]), rng)} _G.__CK0=tostring(${ck0N})`);
    // Phase 5 cross-coupling state + weight
    const cvwWeight = obf((0, serializer_1.normSeed)(opts.pbias * 15485863 + 11), rng);
    body.push(` local ${cvwN}=0 ${cmN}=0`);
    // decrypt-on-access constant accessor: wire/decoded tables hold masked
    // payloads; plaintext exists only after first use (then cached in e.v)
    body.push(` local function ${N.cv}(pID,e)`);
    body.push(`  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end`);
    body.push(`  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end`);
    body.push(`  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)`);
    body.push(`  local kk=(((${ck0N}+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end`);
    body.push(`  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)`);
    body.push(`  local parts={} local g=kk`);
    body.push(`  _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)`);
    body.push(`  for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=${N.sch}(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end`);
    body.push(`  local sv=${N.tcn}(parts)`);
    body.push(`  if e.t==5 then v=tonumber(sv) else v=sv end`);
    body.push(`  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end`);
    body.push(`  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)`);
    body.push(`  e.v=v return v`);
    body.push(` end`);
    // The encrypted blob (one big literal)
    body.push(` local ${N.blob}=${luaEscape(opts.blob)}`);
    // optional dynamic-load path (Phase 2 exception; opt-in, disabled for luau)
    if (opts.dynLoad && opts.envProfile !== "luau") {
        const dyn = (0, dynload_1.emitDynLoadPrelude)(true, opts.envProfile ?? "universal", { fn: ids.alloc() });
        if (dyn)
            for (const dl of dyn.lines)
                body.push(` ${dl}`);
    }
    // ---- L1 decode: cipher guard → env keying → 4-stream cipher → u8/uvar/svar
    //                  → framing → per-proto loop → watermark tail
    //                  → return {P, WM, WMI}
    body.push(` local function ${N.run}_decode()`);
    body.push(`  local D={} local bn=#${N.blob}`);
    body.push(`  if bn>${runtimeBudget.maxDecodeBytes} then error(${JSON.stringify(garbage(rng))}) end`);
    // W1.2 keyless: registers reassemble from decrypted prologue bytes + decoy
    // pool entries with XOR mixing. Legacy builds keep the obfuscated register
    // literals.
    const gpN = id();
    if (opts.keylessPool) {
        body.push(`  local MM=${M31}`);
        const kp = opts.keylessPool;
        body.push(`  local ${gpN}={${kp.nums.join(",")}}`);
        body.push(`  local sa=((D[5]*16777216+D[6]*65536+D[7]*256+D[8])${kp.i5 ? `^${gpN}[${kp.i5}]` : ""}+${gpN}[${kp.i1}]-${gpN}[${kp.i2}])%2147483646` +
            ` if sa<1 then sa=sa+2147483646 end`);
        body.push(`  local sb=((D[9]*16777216+D[10]*65536+D[11]*256+D[12])${kp.i6 ? `^${gpN}[${kp.i6}]` : ""}+${gpN}[${kp.i3}]-${gpN}[${kp.i4}])%2147483646` +
            ` if sb<1 then sb=sb+2147483646 end`);
    }
    else {
        body.push(`  local sa=${obf(s0, rng)} sb=${obf(s1, rng)} MM=${M31}`);
    }
    // ---- Phase 5: ciphertext integrity guard (pre-decode) ----
    if (tier !== "off" && opts.blobSlices && opts.blobSlices.length > 0) {
        const tableLit = opts.blobSlices
            .map((s) => `{p=${obf(s.p, rng)},a=${obf(s.a, rng)},h=${obf(s.h, rng)}}`)
            .join(",");
        const guardLines = (0, cipherguard_1.emitCipherGuard)(tier, opts.blobSlices, tableLit, {
            blobVar: N.blob,
            saVar: "sa",
            sbVar: "sb",
            cvwVar: cvwN,
            garbageLit: JSON.stringify(garbage(rng)),
            deltaSa: obf((0, serializer_1.normSeed)(opts.pbias * 104729 + 29), rng),
            deltaSb: obf((0, serializer_1.normSeed)(opts.pbias * 15485863 + 11), rng),
            cmVar: cmN,
        });
        if (guardLines)
            for (const gl of guardLines)
                body.push(` ${gl}`);
    }
    // environmental keying (hardened derive-not-compare)
    const envLines = (0, envkeying_1.emitEnvKeyingBlock)(opts.envProfile ?? "universal", "sa", "sb");
    if (envLines)
        for (const el of envLines)
            body.push(` ${el}`);
    // Environmental Entropy Pool (Phase 3.1)
    if (opts.entropyPool !== false && (opts.envProfile ?? "universal") !== "universal") {
        const pool = (0, entropypool_1.emitEntropyPoolBlock)(opts.envProfile ?? "universal", "sa", "sb");
        if (pool)
            for (const pl of pool)
                body.push(` ${pl}`);
    }
    // cipher v3 core: 4-stream cross-mixed feedback. Mirror of cipher.ts.
    body.push(`  local sbyte=string.byte`);
    body.push(`  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0`);
    body.push(`  for i=1,bn do`);
    body.push(`   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM`);
    body.push(`   sb=(sb+pv)%MM sc=(sc+sa)%MM`);
    body.push(`   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256`);
    body.push(`   D[i]=(sbyte(${N.blob},i)-pv+256)%256`);
    body.push(`  end`);
    body.push(`  local ${N.pos}=1`);
    body.push(`  local function ${N.u8}() local bt=D[${N.pos}] ${N.pos}=${N.pos}+1 return bt end`);
    body.push(`  local function ${N.uvar}()`);
    body.push(`   local sh,r=0,0`);
    body.push(`   while true do`);
    body.push(`    local bt=${N.u8}()`);
    body.push(`    r=r+(bt%128)*(2^sh)`);
    body.push(`    if bt<128 then return r end`);
    body.push(`    sh=sh+7`);
    body.push(`   end`);
    body.push(`  end`);
    body.push(`  local function ${N.svar}()`);
    body.push(`   local u=${N.uvar}()`);
    body.push(`   if u%2==1 then return -(u+1)/2 end`);
    body.push(`   return u/2`);
    body.push(`  end`);
    // framing v3: high bit = format tag, low 7 bits = randomized prologue length
    body.push(`  local ${N.hdr}=${N.u8}()`);
    body.push(`  if ${N.hdr}<128 then error(${JSON.stringify(garbage(rng))}) end`);
    body.push(`  for i=1,${N.hdr}-128 do ${N.u8}() end`);
    body.push(`  local ${N.np}=${N.uvar}()`);
    body.push(`  if ${N.np}>${runtimeBudget.maxProtos} then error(${JSON.stringify(garbage(rng))}) end`);
    body.push(`  local ${N.protos}={} local ${N.wm}={}`);
    body.push(`  for ${N.pid2}=1,${N.np} do`);
    body.push(`   local pr={}`);
    body.push(`   pr.pn=${N.u8}()`);
    body.push(`   pr.va=${N.u8}()==1`);
    body.push(`   local nu=${N.uvar}()`);
    body.push(`   pr.uv={}`);
    body.push(`   for i=1,nu do pr.uv[i]={${N.u8}()==1 and 1 or 0,${N.uvar}()} end`);
    body.push(`   pr.ns=${N.uvar}()`);
    // 5 redundant per-proto field-key uvarints (skipped at read; see
    // serializer.ts for the matching writer).
    body.push(`   ${N.uvar}() ${N.uvar}() ${N.uvar}() ${N.uvar}() ${N.uvar}()`);
    body.push(`   local nc=${N.uvar}()`);
    body.push(`   if nc>${runtimeBudget.maxConsts} then error(${JSON.stringify(garbage(rng))}) end`);
    body.push(`   pr.c={}`);
    body.push(`   for i=1,nc do`);
    body.push(`    local tag=${N.u8}()`);
    body.push(`    if tag==1 then pr.c[i]=true`);
    body.push(`    elseif tag==2 then pr.c[i]=false`);
    body.push(`    elseif tag==7 then pr.c[i]=(0/0)`);
    body.push(`    elseif tag==8 then pr.c[i]=math.huge`);
    body.push(`    elseif tag==9 then pr.c[i]=-math.huge`);
    body.push(`    elseif tag==5 or tag==6 then`);
    body.push(`     local ln=${N.uvar}()`);
    body.push(`     local bb={}`);
    body.push(`     for j=1,ln do ${N.pos}=${N.pos}+1 bb[j]=D[${N.pos}-1] end`);
    body.push(`     pr.c[i]={t=tag,n=ln,b=bb}`);
    body.push(`    else pr.c[i]=nil end`);
    body.push(`   end`);
    body.push(`   local nk=${N.uvar}()`);
    body.push(`   if nk>${runtimeBudget.maxCode} then error(${JSON.stringify(garbage(rng))}) end`);
    body.push(`   pr.k={}`);
    // per-proto rolling-key mirror for operand de-whitening (Phase 3 non-linear)
    body.push(`   local lrk=(${rk0N}+${N.pid2}*${astepN}+${N.pid2}*${N.pid2}*${astep2N})%65536`);
    body.push(`   for i=1,nk do`);
    body.push(`    local mm=math.floor(lrk/3)%256`);
    body.push(`    local oe=${N.uvar}()`);
    body.push(`    local aw=${N.svar}()-mm`);
    body.push(`    local b1w=${N.svar}()-mm`);
    body.push(`    local b2w=${N.svar}()+mm`);
    body.push(`    local cw=${N.svar}()-mm`);
    body.push(`    lrk=(lrk+${aincN}+(lrk>>3))%65536`);
    body.push(`    pr.k[i]={[${keyNames.OP}]=oe,[${keyNames.A}]=aw,[${keyNames.B1}]=b1w,[${keyNames.B2}]=b2w,[${keyNames.C}]=cw}`);
    body.push(`   end`);
    body.push(`   ${N.protos}[${N.pid2}]=pr`);
    body.push(`  end`);
    // watermark tail (same cipher v3, second seed)
    body.push(`  local wln=${N.uvar}()`);
    const [wsa, wsb] = (0, serializer_1.wmSeeds)(opts.seeds[2]);
    body.push(`  local wa=${obf((0, serializer_1.normSeed)(wsa), rng)} wb=${obf((0, serializer_1.normSeed)(wsb), rng)} MM2=${M31}`);
    body.push(`  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0`);
    body.push(`  for i=1,wln do`);
    body.push(`   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2`);
    body.push(`   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2`);
    body.push(`   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256`);
    body.push(`   ${N.wm}[i]=(D[${N.pos}]-pv2+256)%256`);
    body.push(`   ${N.pos}=${N.pos}+1`);
    body.push(`  end`);
    body.push(`  local ${N.wmi}=#${N.wm}`);
    body.push(`  if ${N.wmi}<1 then ${N.wmi}=1 ${N.wm}[1]=0 end`);
    body.push(`  return {P=${N.protos},WM=${N.wm},WMI=${N.wmi}}`);
    body.push(` end`);
    // ---- L2 run body ----
    if (tier !== "off") {
        body.push(` local ${N.icv}={${icvLits}}`);
        body.push(` local ${N.slices}={${slicesLits}}`);
        body.push(` ${N.nic}=#${N.slices}`);
    }
    else {
        body.push(` local ${N.nic}=0`);
        body.push(` local ${N.icv}={} local ${N.slices}={}`);
    }
    body.push(` local function ${N.run}(l1,${F.pid},${F.env},${F.upv},${F.args},${F.escf})`);
    body.push(`  local ${N.protos},${N.wm},${N.wmi}=l1.P,l1.WM,l1.WMI`);
    body.push(`  local ${F.P0}=${N.protos}[${F.pid}]`);
    body.push(`  local ${F.K}=${F.P0}.k`);
    body.push(`  local ${F.C}=${F.P0}.c`);
    body.push(`  local ${F.S}={}`);
    body.push(`  local ${F.cells}={}`);
    body.push(`  for ${F.i}=1,${F.P0}.ns do ${F.cells}[${F.i}]={} end`);
    body.push(`  local ${F.sp},${F.mr},${F.pc}=0,-1,1`);
    body.push(`  local ${F.VA}=${F.args}`);
    body.push(`  for ${F.i}=1,${F.P0}.pn do ${F.cells}[${F.i}].v=${F.args}[${F.i}] end`);
    body.push(`  local ${F.tc},${F.six}=37,1`);
    body.push(`  local ${F.poison},${F.PB},${F.wmv}=false,0,0`);
    // Phase 3: per-frame rolling key (non-linear Phase 3.1+3.2)
    body.push(`  local ${rkN}=(${rk0N}+${F.pid}*${astepN}+${F.pid}*${F.pid}*${astep2N})%65536`);
    body.push(`  local ${F.rn},${F.narg},${F.so},${F.fpos},${F.fn}`);
    body.push(`  local ${F.ins},${F.op}`);
    body.push(`  while true do`);
    body.push(`   ${F.ins}=${F.K}[${F.pc}]`);
    body.push(`   if ${F.pc}<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(${F.pc}).." RK="..tostring(${rkN}).." INS="..tostring(${F.ins}[${keyNames.OP}]).." A="..tostring(${F.ins}[${keyNames.A}]).." B="..tostring(${F.ins}[${keyNames.B1}]+${F.ins}[${keyNames.B2}]).." C="..tostring(${F.ins}[${keyNames.C}]).."\\n" end`);
    for (const cl of countdown)
        body.push(`   ${cl}`);
    body.push(`   ${F.ins}=${F.K}[${F.pc}]`);
    body.push(`   ${F.op}=(((${F.ins}[${keyNames.OP}]-${rkN})+65536)%65536)`);
    body.push(`   ${rkN}=(${rkN}+${aincN}+(${rkN}>>3))%65536`);
    body.push(`   ${F.pc}=${F.pc}+1`);
    for (const cl of chainLines)
        body.push(`   ${cl}`);
    body.push(`  end`);
    body.push(` end`);
    // ---- Bootstrap: pack args, call decode, call run, return its result ----
    body.push(` local ${F.A}=${N.pk}(...)`);
    if (opts.mmTraps) {
        // W1.3: one-shot metamethod trap — the root invoke hides behind a
        // per-build random arithmetic metamethod on a table we own.
        const mmOps = ["__add", "__sub", "__mul", "__mod"];
        const mop = mmOps[rng.int(mmOps.length)];
        const trig = [0, -7, 3][rng.int(3)];
        const mt = id();
        body.push(` local ${mt}=setmetatable({}, {${mop}=function() return ${N.run}(${N.run}_decode(),${opts.rootPid},_ENV,{},${F.A},nil) end})`);
        body.push(` return ${mt} * ${trig}`);
    }
    else {
        body.push(` return ${N.run}(${N.run}_decode(),${opts.rootPid},_ENV,{},${F.A},nil)`);
    }
    // ---- Assemble final artifact: 3 physical lines (banner, blank, IIFE) ----
    // The IIFE body is one long line. Joining body entries with " " keeps
    // every line as a single-statement Lua chunk — chains-of-ifs and the
    // cipher loop are all on one line, separated by spaces. The dispatcher
    // already emits one-statement handler bodies, so this collapses
    // cleanly. (If a future handler body becomes multi-statement, this
    // join will need a smarter split.)
    const envParam = id();
    const iiFEHeader = `return (function(${envParam}, ...)`;
    const iiFEFooter = `end)(${envParam})`;
    const lua = iiFEHeader + " " + body.join(" ") + " " + iiFEFooter;
    const banner = `-- NEVAHEX-VM v3 'Hex' — protected artifact — ${garbage(rng).slice(0, 12)}() runs it`;
    const L = [
        banner,
        "",
        lua,
    ];
    // ---- E1/E2: local & upvalue budgets — fail the BUILD, not the load ----
    const fileScopeNames = [
        ...Object.values(N),
        aeT0, aeT1, aeT2, aeT3, aeT4, aeOps, aeAllocOps, aeMemOps, aeArithOps, aeTotalOps, aeHookFlag, aeEnvScore,
        keyNames.OP, keyNames.A, keyNames.B1, keyNames.B2, keyNames.C,
        rk0N, astepN, astep2N, aincN, ck0N, cvwN, cmN, rkN,
    ];
    const runText = body.join("\n");
    const budget = (0, localbudget_1.checkBudgets)(L.join("\n"), runText, fileScopeNames.filter((n) => !localbudget_1.DECODE_BLOCK_LOCALS.has(n)));
    if (!budget.ok) {
        throw new Error(`NEVAHEX internal: emitted-code budget exceeded\n  ` +
            budget.problems.join("\n  "));
    }
    return { lua: L.join("\n"), dispatchOrder };
}
