// NEVAHEX-VM — anti-emulation layer (Phase 1 adversary class: Emulation/Sandbox)
//
// Threat: adversary runs the script inside an instrumented Lua VM (custom build,
// hooked luaV_execute) which executes dramatically slower than production.
//
// Defense: batched wall-clock sampling. Every TICK_OPS dispatched instructions
// the runtime measures elapsed time via os.clock and compares against the count
// of executed instructions. An emulator that is SLOWDOWN_FACTOR or more below
// the calibrated ops-per-second floor routes to the configured tier response.
//
// Target compatibility: requires os.clock. Disabled automatically for the
// `luau` target (Roblox sandboxes expose no os.clock); recommended for
// lua5.1/luajit server-side artifacts.

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
 * Calibration state persists across frames via two FILE-SCOPE LOCALS supplied
 * by the emitter (per-build generated names). The historical implementation
 * used `__ae_t0`/`__ae_ops` globals — a stable, greppable signature; locals
 * bound as upvalues give the same lifetime without shipping fixed names.
 *
 * @param names runtime names: tcVar/poisonVar/pbVar come from the dispatcher
 *        frame; aeT0/aeOps are the file-scope calibration locals.
 */
export function emitAntiEmulationBlock(
  cfg: AntiEmulationConfig | null,
  names: { tcVar: string; poisonVar: string; pbVar: string; biasLit?: string; aeT0: string; aeOps: string },
): string[] | null {
  if (!cfg) return null;
  const { tcVar, poisonVar, pbVar, aeT0, aeOps } = names;
  void tcVar;
  const minIps = Math.max(1000, Math.floor(cfg.minOpsPerSecond));
  const tick = Math.max(1000, Math.floor(cfg.tickOps));
  return [
    // one-time calibration state (file-scope upvalues shared by all frames)
    `${aeT0}=${aeT0} or os.clock()`,
    `${aeOps}=(${aeOps} or 0)+${tick}`,
    `do`,
    `  local dt=os.clock()-${aeT0}`,
    `  if dt>0 then`,
    `    local ips=${aeOps}/dt`,
    // warm-up grace: only judge after at least 3 ticks
    `    if ${aeOps}>=${tick * 3} and ips<${minIps} then`,
    `      ${poisonVar}=true ${pbVar}=${"1"}`,
    `      ${aeT0}=os.clock() ${aeOps}=0`,
    `    end`,
    `  end`,
    `end`,
  ];
}
