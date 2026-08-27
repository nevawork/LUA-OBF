// NEVAHEX-VM — anti-emulation layer v3 (Phase 1 adversary class: Emulation/Sandbox)
// Enhanced for Luraph v15 threat model: deeper sandbox/hook detection, multi-source
// timing, memory-pressure probing, and instruction-mix heuristics.
//
// Defense v3: FIVE independent workload probes converge on one verdict per tick.
// Any failure routes to the tier response AND raises the Phase-5 CVW cross-coupling
// flag (silent tier corrupts constant decryption from then on).
//   P1 dispatch-rate      — executed-op count vs os.clock delta (primary)
//   P2 allocation bandwidth — string.rep / table.concat vs clock delta
//   P3 GC churn           — collectgarbage("count") availability + timing
//   P4 hook presence      — debug hook / traceback / debug.debug availability
//   P5 memory pressure    — large table allocation + fill timing
//
// Probes degrade gracefully: each is gated on its primitive existing, and an
// unavailable probe abstains (counts as pass). Luau keeps working.
//
// Target compatibility: requires os.clock for P1/P2/P5. The whole layer is
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
}

export const DEFAULT_ANTI_EMULATION: AntiEmulationConfig = {
  minOpsPerSecond: 200000,
  tickOps: 50000,
  allocMaxUs: 500,
  hookGrace: true,
  memPressureBytes: 65536,
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
  const cvwSet = cvwVar ? ` ${cvwVar}=1` : "";

  // optional per-build random junk vars (fingerprint diversity)
  const aeT1 = names.aeT1 || aeT0;
  const aeAllocOps = names.aeAllocOps || aeOps;
  const aeMemOps = names.aeMemOps || aeOps;
  const aeHookFlag = names.aeHookFlag || "aehf";

  return [
    // one-time calibration state (file-scope upvalues shared by all frames)
    `${aeT0}=${aeT0} or os.clock()`,
    `${aeT1}=${aeT1} or os.clock()`,
    `${aeOps}=(${aeOps} or 0)+${tick}`,
    `${aeAllocOps}=(${aeAllocOps} or 0)+1`,
    `${aeMemOps}=(${aeMemOps} or 0)+1`,
    `${aeHookFlag}=${aeHookFlag} or 0`,
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
    // ---- converged verdict: single response point, no per-probe branching ----
    `  if bad>0 then`,
    `    ${poisonVar}=true ${pbVar}=1${cvwSet}`,
    `    ${aeT0}=os.clock() ${aeOps}=0 ${aeAllocOps}=0 ${aeMemOps}=0`,
    `  end`,
    `end`,
  ];
}
