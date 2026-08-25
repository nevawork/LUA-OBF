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
 * @param v named runtime locals: { tc, six, ins, op } etc are provided by the
 *        dispatcher; we only need the countdown variable name to piggyback on
 *        the existing tick cadence, plus a sink for the tier response.
 */
export function emitAntiEmulationBlock(
  cfg: AntiEmulationConfig | null,
  names: { tcVar: string; poisonVar: string; pbVar: string; biasLit?: string },
): string[] | null {
  if (!cfg) return null;
  const { tcVar, poisonVar, pbVar } = names;
  const minIps = Math.max(1000, Math.floor(cfg.minOpsPerSecond));
  const tick = Math.max(1000, Math.floor(cfg.tickOps));
  return [
    // one-time calibration state (closure-level upvalues via globals-in-file scope)
    `__ae_t0=__ae_t0 or os.clock()`,
    `__ae_ops=(__ae_ops or 0)+${tick}`,
    `do`,
    `  local dt=os.clock()-__ae_t0`,
    `  if dt>0 then`,
    `    local ips=__ae_ops/dt`,
    // warm-up grace: only judge after at least 3 ticks
    `    if __ae_ops>=${tick * 3} and ips<${minIps} then`,
    `      ${poisonVar}=true ${pbVar}=${"1"}`,
    `      __ae_t0=os.clock() __ae_ops=0`,
    `    end`,
    `  end`,
    `end`,
  ];
}
