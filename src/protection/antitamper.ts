// NEVAHEX-VM — anti-tamper module
// Plans integrity slices over decoded proto code and mirrors the exact additive
// hash the emitted Lua runtime recomputes each tick:
//   h = 2166136261 % 1e9+7 start; per instr q: h = (h*16777619 + q0*31+q1*7+q2*3+q3) % 1e9+7
// All arithmetic stays below 2^53 so doubles match bit-for-bit across JS/Lua.
import { Proto } from "../engine/vm/opcodes";

export type IntegritySlice = [number, number, number, number]; // [pid(1-based), from, to, expected]

/** mirror of the Lua-side slice hash */
export function sliceHash(code: ReadonlyArray<[number, number, number, number]>, from: number, to: number): number {
  let h = 2166136261 % 1000000007;
  for (let j = from - 1; j < to; j++) {
    const q = code[j];
    h = (h * 16777619 + q[0] * 31 + q[1] * 7 + q[2] * 3 + q[3]) % 1000000007;
  }
  return h;
}

/**
 * Partition every proto's instruction stream into windows and hash each.
 * Caps total slices (bounded-resource guarantee): keeps an evenly spaced sample.
 */
export function planIntegritySlices(flat: Proto[], window = 48, cap = 32): IntegritySlice[] {
  const all: IntegritySlice[] = [];
  const span = window * 4;
  for (let pid = 0; pid < flat.length; pid++) {
    const code = flat[pid].code;
    for (let start = 0; start < code.length; start += span) {
      const a = start + 1;
      const b = Math.min(code.length, start + span);
      if (a > b) break;
      all.push([pid + 1, a, b, sliceHash(code, a, b)]);
    }
  }
  if (all.length > cap) {
    return Array.from({ length: cap }, (_, i) => all[Math.floor((i * all.length) / cap)]);
  }
  return all;
}
