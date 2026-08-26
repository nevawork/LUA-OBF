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

// ---------------------------------------------------------------------------
// Phase 5: CIPHERTEXT integrity — hashes over the ENCRYPTED blob, verified by
// the loader BEFORE the decode loop runs. Unlike the decoded-table ticks
// (which remain as deliberate decoys), these checks cannot be bypassed by a
// static lifter that never executes: tamper with any covered byte and the
// artifact refuses to decrypt (strict) or poisons its own cipher seeds +
// constant-decryption key (silent).
// ---------------------------------------------------------------------------

export interface BlobSlice {
  /** 1-based start position inside the encrypted blob */
  p: number;
  /** window length in bytes (≤ maxLen) */
  a: number;
  /** expected range hash */
  h: number;
}

/** byte-range FNV mirror; identical arithmetic is emitted in cipherguard.lua */
export function rangeHash(buf: Uint8Array, p: number, len: number): number {
  let h = 2166136261 % 1000000007;
  for (let j = p - 1; j < p - 1 + len; j++) {
    h = (h * 16777619 + buf[j]) % 1000000007;
  }
  return h;
}

/**
 * Sample evenly-spaced windows over the encrypted blob. Deterministic given
 * the blob (no rng): descriptors are literal-embeddable and recomputable at
 * load time without any build-time state.
 */
export function planBlobSlices(blob: Uint8Array, count = 24, maxLen = 64): BlobSlice[] {
  const n = Math.max(1, Math.min(count, Math.ceil(blob.length / maxLen) || 1));
  const out: BlobSlice[] = [];
  for (let k = 0; k < n; k++) {
    const pos = Math.floor((k * blob.length) / n); // 0-based
    const len = Math.min(maxLen, blob.length - pos);
    if (len <= 0) break;
    out.push({ p: pos + 1, a: len, h: rangeHash(blob, pos + 1, len) });
  }
  return out;
}
