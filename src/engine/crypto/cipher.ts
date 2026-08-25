// NEVAHEX-VM — transport cipher contract
// Lehmer LCG pair mod 2^31-1; keystream byte = (hi16(a) + hi16(b)) & 0xFF.
// Pure-arithmetic so the identical routine runs on Lua 5.1 / LuaJIT / Luau.
// Canonical location: src/engine/crypto/cipher.ts

export const M31 = 2147483647;
export { M31 };

/** normalized positive seed in [1, M31-2]; idempotent & Lua-safe for % behavior */
export function normSeed(s: number): number {
  const m = M31 - 1;
  const r = ((s % m) + m) % m;
  return r === 0 ? 1 : r;
}

function lcgPair(seedA: number, seedB: number): () => number {
  let sa = normSeed(seedA);
  let sb = normSeed(seedB === seedA ? seedB + 1 : seedB);
  return (): number => {
    sa = (sa * 48271) % M31;
    sb = (sb * 69621) % M31;
    return ((Math.floor(sa / 65536) + Math.floor(sb / 65536)) & 0xff);
  };
}

/** canonical second-stream seed pair for watermark masking (shared runtime/extractor) */
export function wmSeeds(seed: number): [number, number] {
  const b = ((seed ^ 0x5f3759df) >>> 0) || 7;
  return [seed, b];
}

export function makeKeyStream(seedA: number, seedB: number): (n: number) => Uint8Array {
  const next = lcgPair(seedA, seedB);
  return (n: number): Uint8Array => {
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) out[i] = next();
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
