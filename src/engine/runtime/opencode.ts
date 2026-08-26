// NEVAHEX-VM — runtime module: rolling-key opcode encoding (Phase 2)
//
// Physical opcode numbers are never stored in the artifact. Every encoded
// instruction carries opE = (permValue + rk_i) % 65536, where rk_i is a
// per-frame rolling key that advances once per instruction fetch:
//
//     rk_start(pid) = (RK0 + pid * ASTEP) % 65536      // per frame entry
//     rk_{i+1}      = (rk_i + AINC) % 65536            // after each decode
//
// RK0 / ASTEP / AINC are per-build constants embedded as obfuscated literals;
// the build side simulates the exact same chain (deterministic instruction
// order per proto), so a static dump of the bytecode yields values whose
// meaning is unknowable without emulating the fetch sequence. This defeats
// regex handler-lifting: `op == literal` tests still exist in the dispatch
// tree, but the bytecode side no longer contains those literals.
//
// All three helpers are pure and shared by the emitter (which emits the Lua
// text of the identical formulas), the serializer (which encodes opE at
// build time) and tests (which pin round-trip + Lua parity).
// Canonical location: src/engine/runtime/opencode.ts

/** modulus for the opcode-encoding ring */
export const OPMOD = 65536;

export interface OpenCodeParams {
  /** ring offset base (0..OPMOD-1) */
  rk0: number;
  /** per-pid phase step; MUST be odd */
  astep: number;
  /** per-fetch increment; MUST be odd */
  ainc: number;
}

/** derive params deterministically from any int(n)-style rng stream */
export function makeOpenCodeParams(rng: { int(n: number): number }): OpenCodeParams {
  const odd = (n: number): number => (n | 1) === 0 ? 1 : n | 1;
  return {
    rk0: rng.int(OPMOD),
    astep: odd(1000003 + rng.int(700000)),
    ainc: odd(65521 + rng.int(200000)),
  };
}

/** rolling key at the first instruction of proto `pid` (1-based) */
export function initialRk(p: OpenCodeParams, pid: number): number {
  return (((p.rk0 + pid * p.astep) % OPMOD) + OPMOD) % OPMOD;
}

/** advance the rolling key by one fetch */
export function stepRk(p: OpenCodeParams, rk: number): number {
  return (rk + p.ainc) % OPMOD;
}

/**
 * Encode one physical opcode value under rolling key `rk`.
 * Build-time use (serializer). permValue must be < OPMOD.
 */
export function encodeOp(permValue: number, rk: number): number {
  return (((permValue + rk) % OPMOD) + OPMOD) % OPMOD;
}

/**
 * Decode an encoded opcode under rolling key `rk`.
 * Runtime formula emitted verbatim in the dispatcher frame:
 *   op = ((opE - rk) + 65536) % 65536
 * (the double-add keeps the expression non-negative — Lua's % on negatives
 * follows the divisor sign, so the mirrored form must avoid negative lhs).
 */
export function decodeOp(opE: number, rk: number): number {
  return (((opE - rk) % OPMOD) + OPMOD) % OPMOD;
}
