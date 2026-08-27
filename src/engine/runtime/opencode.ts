// NEVAHEX-VM — runtime module: rolling-key opcode encoding (Phase 3)
//
// Physical opcode numbers are never stored in the artifact. Every encoded
// instruction carries opE = (permValue + rk_i) % 65536, where rk_i is a
// per-frame rolling key that advances once per instruction fetch:
//
//     rk_start(pid) = (RK0 + pid * ASTEP + pid^2 * ASTEP2) % 65536   // Phase 3.1
//     rk_{i+1}      = (rk_i + AINC + (rk_i >> 3)) % 65536           // Phase 3.2
//
// Phase 3.1 adds a quadratic pid term so adjacent protos see non-uniform
// starting keys. Phase 3.2 folds the current rk back into the increment,
// creating a non-linear recurrence that is harder to correlate across builds.
//
// RK0 / ASTEP / ASTEP2 / AINC are per-build constants embedded as obfuscated
// literals; the build side simulates the exact same chain, so a static dump of
// the bytecode yields values whose meaning is unknowable without emulating the
// fetch sequence.
//
// All helpers are pure and shared by the emitter, the serializer, and tests.
// Canonical location: src/engine/runtime/opencode.ts

/** modulus for the opcode-encoding ring */
export const OPMOD = 65536;

export interface OpenCodeParams {
  /** ring offset base (0..OPMOD-1) */
  rk0: number;
  /** per-pid linear phase step; MUST be odd */
  astep: number;
  /** per-pid quadratic phase step; MUST be odd */
  astep2: number;
  /** per-fetch increment; MUST be odd */
  ainc: number;
}

/** derive params deterministically from any int(n)-style rng stream */
export function makeOpenCodeParams(rng: { int(n: number): number }): OpenCodeParams {
  const odd = (n: number): number => (n | 1) === 0 ? 1 : n | 1;
  return {
    rk0: rng.int(OPMOD),
    astep: odd(1000003 + rng.int(700000)),
    astep2: odd(1000003 + rng.int(700000)),
    ainc: odd(65521 + rng.int(200000)),
  };
}

/** rolling key at the first instruction of proto `pid` (1-based) */
export function initialRk(p: OpenCodeParams, pid: number): number {
  return (((p.rk0 + pid * p.astep + pid * pid * p.astep2) % OPMOD) + OPMOD) % OPMOD;
}

/** advance the rolling key by one fetch with non-linear recurrence */
export function stepRk(p: OpenCodeParams, rk: number): number {
  return (rk + p.ainc + (rk >> 3)) % OPMOD;
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
