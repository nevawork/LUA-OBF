// NEVAHEX-VM — transport cipher v3 (doubles-only, bit-op free)
//
// Four-stream Lehmer core with output feedback. Replaces the historical
// dual-LCG additive stream whose entire state was recoverable from a handful
// of known-plaintext bytes (the old format even shipped a magic header as a
// free crib at offset 0).
//
// Construction (all intermediates stay below 2^53, so JS doubles and Lua
// doubles produce bit-identical results):
//   state s0..s3 each in [1, M), M = 2147483647
//   multipliers m = {48271, 69621, 2994349, 4050403}   (last two prime)
//   safety: (M-1) * 4050403 ≈ 8.706e15 < 2^53 ≈ 9.007e15
//   per output byte:
//     s0 = s0*m0 % M ; s1 = s1*m1 % M ; s2 = s2*m2 % M ; s3 = s3*m3 % M
//     s1 = (s1 + prev) % M            // output feedback chain
//     s2 = (s2 + s0) % M              // inter-stream cross-mixing
//     k   = (⌊s0/65536⌋*31 + ⌊s1/2048⌋*17 + ⌊s2/1024⌋*7 + ⌊s3/256⌋*3 + prev) % 256
//   init: s0,s1 are the seed registers; s2 = (s0*31+s1)%M, s3 = (s1*17+s0)%M,
//         prev = 0. Only two register literals ever ship in an artifact; the
//         runtime derives s2/s3 with the same fixed arithmetic.
//
// The mirrored Lua implementation lives in the emitted decode loops of
// src/vm/emitter.ts; tests/cipher-v3.test.ts pins JS/Lua parity by executing
// a line-for-line Lua mirror of this algorithm against makeKeyStream.
// Canonical location: src/engine/crypto/cipher.ts

export const M31 = 2147483647;

const MULT = [48271, 69621, 2994349, 4050403] as const;

/** normalized positive seed in [1, M31-2]; idempotent & Lua-safe for % behavior */
export function normSeed(s: number): number {
  const m = M31 - 1;
  const r = ((s % m) + m) % m;
  return r === 0 ? 1 : r;
}

/**
 * canonical second-stream seed pair for watermark masking (shared
 * runtime/extractor) — unchanged from v2; feeds makeKeyStream.
 */
export function wmSeeds(seed: number): [number, number] {
  const b = ((seed ^ 0x5f3759df) >>> 0) || 7;
  return [seed, b];
}

/** initial full state from the two shipped seed registers */
function initState(seedA: number, seedB: number): {
  s: [number, number, number, number];
  prev: number;
} {
  const s0 = normSeed(seedA);
  const s1 = normSeed(seedB === seedA ? seedB + 1 : seedB);
  const s2 = (s0 * 31 + s1) % M31;
  const s3 = (s1 * 17 + s0) % M31;
  return { s: [s0, s1, s2, s3], prev: 0 };
}

/** advance one step and produce the next keystream byte */
function step(st: { s: [number, number, number, number]; prev: number }): number {
  const s = st.s;
  let p = st.prev;
  s[0] = (s[0] * MULT[0]) % M31;
  s[1] = (s[1] * MULT[1]) % M31;
  s[2] = (s[2] * MULT[2]) % M31;
  s[3] = (s[3] * MULT[3]) % M31;
  s[1] = (s[1] + p) % M31;
  s[2] = (s[2] + s[0]) % M31;
  p =
    (Math.floor(s[0] / 65536) * 31 +
      Math.floor(s[1] / 2048) * 17 +
      Math.floor(s[2] / 1024) * 7 +
      Math.floor(s[3] / 256) * 3 +
      p) %
    256;
  st.prev = p;
  return p;
}

export function makeKeyStream(seedA: number, seedB: number): (n: number) => Uint8Array {
  const st = initState(seedA, seedB);
  return (n: number): Uint8Array => {
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) out[i] = step(st);
    return out;
  };
}

export function encryptBytes(plain: Uint8Array, seedA: number, seedB: number): Buffer {
  const keys = makeKeyStream(seedA, seedB)(plain.length);
  const out = Buffer.alloc(plain.length);
  for (let i = 0; i < plain.length; i++) out[i] = (plain[i] + keys[i]) & 0xff;
  return out;
}

export function decryptBytes(cipher: Uint8Array, seedA: number, seedB: number): Buffer {
  const keys = makeKeyStream(seedA, seedB)(cipher.length);
  const out = Buffer.alloc(cipher.length);
  for (let i = 0; i < cipher.length; i++) out[i] = (cipher[i] - keys[i] + 256) & 0xff;
  return out;
}
