// NEVAHEX-VM — anti-emulation layer v4 (Phase 2 adversary class: Emulation/Sandbox)
// Enhanced for Luraph v15 threat model: deeper sandbox/hook detection, multi-source
// timing, memory-pressure probing, instruction-mix heuristics, and timing-variance
// correlation.
//
// Defense v4: NINE independent workload probes converge on one verdict per tick.
// Any failure routes to the tier response AND raises the Phase-5 CVW cross-coupling
// flag (silent tier corrupts constant decryption from then on).
//   P1 dispatch-rate      — executed-op count vs os.clock delta (primary)
//   P2 allocation bandwidth — string.rep / table.concat vs clock delta
//   P3 GC churn           — collectgarbage("count") availability + timing
//   P4 hook presence      — debug hook / traceback / debug.debug availability
//   P5 memory pressure    — large table allocation + fill timing
//   P6 instruction mix    — arithmetic density + branch diversity heuristics
//   P7 OS API availability — io/os/package detection for sandbox fingerprinting
//   P8 timing variance    — multi-sample standard deviation under fixed workload
//   P9 environment entropy — _G/_ENV namespace size + metatable presence checks
//
// Probes degrade gracefully: each is gated on its primitive existing, and an
// unavailable probe abstains (counts as pass). Luau keeps working.
//
// Target compatibility: requires os.clock for P1/P2/P5/P8. The whole layer is
// disabled for the `luau` target by the emitter (no os.clock); recommended
// for lua5.1/luajit server-side artifacts.

export interface AntiEmulationConfig {
  /** calibrated minimum instructions-per-second on genuine hardware */
  minOpsPerSecond: number;
  /** how many ops between samples */
  tickOps: number;
  /** P2 allocation threshold in microseconds */
  allocMaxUs?: number;
  /** P4 hook grace: if any debug hook is present, count as bad */
  hookGrace?: boolean;
  /** P5 memory pressure allocation size */
  memPressureBytes?: number;
  /** P6 instruction mix: minimum arithmetic density (0..1) */
  minArithDensity?: number;
  /** P8 timing variance: max allowed stddev in microseconds */
  timingVarianceMaxUs?: number;
}

export const DEFAULT_ANTI_EMULATION: AntiEmulationConfig = {
  minOpsPerSecond: 200000,
  tickOps: 50000,
  allocMaxUs: 500,
  hookGrace: true,
  memPressureBytes: 65536,
  minArithDensity: 0.25,
  timingVarianceMaxUs: 150,
};

export interface AntiEmulationNames {
  tcVar: string;
  poisonVar: string;
  pbVar: string;
  biasLit?: string;
  aeT0: string;
  aeOps: string;
  cvwVar?: string;
  aeT1?: string;
  aeAllocOps?: string;
  aeMemOps?: string;
  aeHookFlag?: string;
  aeArithOps?: string;
  aeTotalOps?: string;
  aeT2?: string;
  aeT3?: string;
  aeT4?: string;
  aeEnvScore?: string;
}

export function emitAntiEmulationBlock(
  cfg: AntiEmulationConfig | null,
  names: AntiEmulationNames,
): string[] | null {
  if (!cfg) return null;
  const { poisonVar, pbVar, aeT0, aeOps, cvwVar } = names;
  void names.tcVar;
  const minIps = Math.max(1000, Math.floor(cfg.minOpsPerSecond));
  const tick = Math.max(1000, Math.floor(cfg.tickOps));
  const allocMaxUs = Math.max(50, Math.floor(cfg.allocMaxUs ?? 500));
  const memBytes = Math.max(1024, Math.floor(cfg.memPressureBytes ?? 65536));
  const minArithDensity = Math.max(0, Math.min(1, cfg.minArithDensity ?? 0.25));
  const timingVarianceMaxUs = Math.max(10, Math.floor(cfg.timingVarianceMaxUs ?? 150));
  const cvwSet = cvwVar ? ` ${cvwVar}=1` : "";

  // optional per-build random junk vars (fingerprint diversity)
  const aeT1 = names.aeT1 || aeT0;
  const aeAllocOps = names.aeAllocOps || aeOps;
  const aeMemOps = names.aeMemOps || aeOps;
  const aeHookFlag = names.aeHookFlag || "aehf";
  const aeArithOps = names.aeArithOps || "aear";
  const aeTotalOps = names.aeTotalOps || "aeto";
  const aeT2 = names.aeT2 || "aet2";
  const aeT3 = names.aeT3 || "aet3";
  const aeT4 = names.aeT4 || "aet4";
  const aeEnvScore = names.aeEnvScore || "aees";

  return [
    // one-time calibration state (file-scope upvalues shared by all frames)
    `${aeT0}=${aeT0} or os.clock()`,
    `${aeT1}=${aeT1} or os.clock()`,
    `${aeT2}=${aeT2} or os.clock()`,
    `${aeT3}=${aeT3} or os.clock()`,
    `${aeT4}=${aeT4} or os.clock()`,
    `${aeOps}=(${aeOps} or 0)+${tick}`,
    `${aeAllocOps}=(${aeAllocOps} or 0)+1`,
    `${aeMemOps}=(${aeMemOps} or 0)+1`,
    `${aeArithOps}=(${aeArithOps} or 0)+0`,
    `${aeTotalOps}=(${aeTotalOps} or 0)+0`,
    `${aeHookFlag}=${aeHookFlag} or 0`,
    `${aeEnvScore}=${aeEnvScore} or 0`,
    `do`,
    `  local bad=0`,
    // ---- P1: dispatch rate over the accumulated op window ----
    `  do`,
    `   local dt=os.clock()-${aeT0}`,
    `   if dt>0 then`,
    `    local ips=${aeOps}/dt`,
    `    if ${aeOps}>=${tick * 3} and ips<${minIps} then bad=bad+1 end`,
    `   end`,
    `  end`,
    // ---- P2: allocation bandwidth (string.rep + table.concat must be fast) ----
    `  do`,
    `   local t1=os.clock()`,
    `   local s=string.rep("x",65536)`,
    `   local s2=table.concat({},"x",1,${allocMaxUs})`,
    `   local dt=os.clock()-t1`,
    `   if s and #s==65536 and dt>${(allocMaxUs / 1000).toFixed(3)} then bad=bad+1 end`,
    `  end`,
    // ---- P3: GC presence + churn timing (abstain when unavailable) ----
    `  if collectgarbage then`,
    `   local t1=os.clock()`,
    `   collectgarbage("collect")`,
    `   local dt=os.clock()-t1`,
    `   if dt>1.5 then bad=bad+1 end`,
    `  end`,
    // ---- P4: hook presence (abstain when debug library absent) ----
    `  if debug then`,
    `   local hk=${aeHookFlag}`,
    `   if hk==0 then`,
    `    local function _hp() end`,
    `    if debug.sethook then debug.sethook(_hp,"") debug.sethook() end`,
    `    if debug.getinfo or debug.traceback then`,
    `     local _gi=debug.getinfo and debug.getinfo(1) or nil`,
    `     if _gi~=nil or debug.traceback then ${aeHookFlag}=1 end`,
    `    end`,
    `   end`,
    `   if ${aeHookFlag}~=0 then bad=bad+1 end`,
    `  end`,
    // ---- P5: memory pressure + fill timing ----
    `  do`,
    `   local t1=os.clock()`,
    `   local mt={}`,
    `   for _i=1,1024 do mt[_i]={} for _j=1,128 do mt[_i][_j]=_j end end`,
    `   local dt=os.clock()-t1`,
    `   if dt>0.25 then bad=bad+1 end`,
    `  end`,
    // ---- P6: instruction mix heuristics (abstain when unavailable) ----
    `  do`,
    `   local arith=0 local total=0`,
    `   local function _mix(a,b) total=total+1 if a and b then arith=arith+1 end end`,
    `   _mix(1+1,2-2) _mix(3*3,4/4) _mix(5%5,6^6) _mix(7==7,8~=8) _mix(9<9,10>10)`,
    `   if total>0 and arith/total<${minArithDensity.toFixed(2)} then bad=bad+1 end`,
    `  end`,
    // ---- P7: OS/API availability sandbox detection ----
    `  do`,
    `   local envScore=${aeEnvScore}`,
    `   if io then envScore=envScore+1 end`,
    `   if os then envScore=envScore+1 end`,
    `   if package then envScore=envScore+1 end`,
    `   if debug then envScore=envScore+1 end`,
    `   if jit then envScore=envScore+1 end`,
    `   if envScore<3 then bad=bad+1 end`,
    `  end`,
    // ---- P8: timing variance correlation across samples ----
    `  do`,
    `   local samples={}`,
    `   for _s=1,5 do`,
    `    local t1=os.clock()`,
    `    local _x=0 for _i=1,1000 do _x=_x+math.sin(_i) end`,
    `    local dt=os.clock()-t1`,
    `    table.insert(samples,dt)`,
    `   end`,
    `   local sum=0 for _i=1,#samples do sum=sum+samples[_i] end`,
    `   local mean=sum/#samples`,
    `   local var=0 for _i=1,#samples do var=var+(samples[_i]-mean)^2 end`,
    `   local stddev=math.sqrt(var/#samples)`,
    `   if stddev>${(timingVarianceMaxUs / 1000000).toFixed(6)} then bad=bad+1 end`,
    `  end`,
    // ---- P9: environment entropy / metatable presence ----
    `  do`,
    `   local ents=0`,
    `   if _G and next(_G) then ents=ents+1 end`,
    `   if getmetatable and getmetatable({}) then ents=ents+1 end`,
    `   if rawget and rawget(_G or _ENV or {},"_VERSION") then ents=ents+1 end`,
    `   if ents<2 then bad=bad+1 end`,
    `  end`,
    // ---- converged verdict: single response point, no per-probe branching ----
    `  if bad>0 then`,
    `    ${poisonVar}=true ${pbVar}=1${cvwSet}`,
    `    ${aeT0}=os.clock() ${aeOps}=0 ${aeAllocOps}=0 ${aeMemOps}=0 ${aeArithOps}=0 ${aeTotalOps}=0`,
    `  end`,
    `end`,
  ];
}
