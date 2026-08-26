// NEVAHEX-VM — anti-emulation layer v2 (Phase 1 adversary class: Emulation/Sandbox)
//
// Threat: adversary runs the script inside an instrumented Lua VM (custom
// build, hooked luaV_execute) that is dramatically slower than production —
// or selectively slows only certain workloads to stay under naive thresholds.
//
// Defense v2: THREE independent workload probes converge on one verdict per
// tick; any failure routes to the tier response AND raises the Phase-5 CVW
// cross-coupling flag (silent tier corrupts constant decryption from then on).
//   P1 dispatch-rate   — executed-op count vs os.clock delta (primary)
//   P2 allocation rate — string.rep bandwidth vs clock delta
//   P3 GC churn        — collectgarbage("count") availability + timing
// Probes degrade gracefully: each is gated on its primitive existing, and an
// unavailable probe simply abstains (counts as pass) — Luau keeps working.
//
// Target compatibility: requires os.clock for P1/P2. The whole layer is
// disabled for the `luau` target by the emitter (no os.clock); recommended
// for lua5.1/luajit server-side artifacts.

export interface AntiEmulationConfig {
  /** calibrated minimum instructions-per-second on genuine hardware */
  minOpsPerSecond: number;
  /** how many ops between samples */
  tickOps: number;
}

export const DEFAULT_ANTI_EMULATION: AntiEmulationConfig = {
  minOpsPerSecond: 200000,
  tickOps: 50000,
};

/**
 * Emit the Lua preamble + per-tick check lines.
 * Returns null when the layer is disabled for this target.
 *
 * Calibration state persists across frames via FILE-SCOPE LOCALS supplied by
 * the emitter (per-build generated names) — never named globals.
 *
 * @param names tcVar is unused by the probes themselves; poisonVar/pbVar come
 *        from the dispatcher frame; aeT0/aeOps are calibration locals;
 *        cvwVar raises the constant-decryption coupling on verdict.
 */
export function emitAntiEmulationBlock(
  cfg: AntiEmulationConfig | null,
  names: {
    tcVar: string;
    poisonVar: string;
    pbVar: string;
    biasLit?: string;
    aeT0: string;
    aeOps: string;
    cvwVar?: string;
  },
): string[] | null {
  if (!cfg) return null;
  const { poisonVar, pbVar, aeT0, aeOps, cvwVar } = names;
  void names.tcVar;
  const minIps = Math.max(1000, Math.floor(cfg.minOpsPerSecond));
  const tick = Math.max(1000, Math.floor(cfg.tickOps));
  const cvwSet = cvwVar ? ` ${cvwVar}=1` : "";
  return [
    // one-time calibration state (file-scope upvalues shared by all frames)
    `${aeT0}=${aeT0} or os.clock()`,
    `${aeOps}=(${aeOps} or 0)+${tick}`,
    `do`,
    `  local bad=0`,
    // ---- P1: dispatch rate over the accumulated op window ----
    `  do`,
    `   local dt=os.clock()-${aeT0}`,
    `   if dt>0 then`,
    `    local ips=${aeOps}/dt`,
    // warm-up grace: only judge after at least 3 ticks
    `    if ${aeOps}>=${tick * 3} and ips<${minIps} then bad=bad+1 end`,
    `   end`,
    `  end`,
    // ---- P2: allocation bandwidth (64KiB string.rep must be fast) ----
    `  do`,
    `   local t1=os.clock()`,
    `   local s=string.rep("x",65536)`,
    `   local dt=os.clock()-t1`,
    `   if s and #s==65536 and dt>0.5 then bad=bad+1 end`,
    `  end`,
    // ---- P3: GC presence + churn timing (abstain when unavailable) ----
    `  if collectgarbage then`,
    `   local t1=os.clock()`,
    `   collectgarbage("collect")`,
    `   local dt=os.clock()-t1`,
    `   if dt>1.5 then bad=bad+1 end`,
    `  end`,
    // ---- converged verdict: single response point, no per-probe branching ----
    `  if bad>0 then`,
    `    ${poisonVar}=true ${pbVar}=1${cvwSet}`,
    `    ${aeT0}=os.clock() ${aeOps}=0`,
    `  end`,
    `end`,
  ];
}
