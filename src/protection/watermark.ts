// NEVAHEX-VM — watermark protection module
// Spread-spectrum embedding: three payload copies separated by keystream filler,
// whole region additively masked with a second keystream. Position-deterministic
// so the extractor needs only the seed + length (holder-side manifest keys).
// CRC-16/CCITT guards recovery.
import { makeKeyStream, M31, normSeed, wmSeeds } from "../engine/crypto/cipher";

export type Seeds = [number, number, number, number];

const FILLER_LEN = 32;

export function spreadWatermark(payload: Buffer, seed: number): Buffer {
  const total = payload.length * 3 + FILLER_LEN * 2;
  const [m0, m1] = wmSeeds(seed);
  const maskKs = makeKeyStream(m0, m1);
  const fillKs = makeKeyStream((seed * 2654435761) % M31, normSeed(seed + 11));
  const fill = fillKs(FILLER_LEN * 2);
  const region = Buffer.alloc(total);
  let o = 0;
  region.set(payload, o); o += payload.length;
  region.set(fill.subarray(0, FILLER_LEN), o); o += FILLER_LEN;
  region.set(payload, o); o += payload.length;
  region.set(fill.subarray(FILLER_LEN), o); o += FILLER_LEN;
  region.set(payload, o);
  const mask = maskKs(total);
  for (let i = 0; i < total; i++) region[i] = (region[i] + mask[i]) & 0xff;
  return region;
}

export function unspreadWatermark(region: Uint8Array, wmLen: number, seed: number): Buffer {
  const [m0, m1] = wmSeeds(seed);
  const maskKsCache = makeKeyStream(m0, m1)(region.length);
  const out = Buffer.alloc(wmLen);
  const copyAt = (copyIdx: number, i: number): number =>
    (region[copyIdx * (wmLen + FILLER_LEN) + i] - maskKsCache[copyIdx * (wmLen + FILLER_LEN) + i] + 256) & 0xff;
  for (let i = 0; i < wmLen; i++) {
    const a = copyAt(0, i);
    const b = copyAt(1, i);
    const c = copyAt(2, i);
    out[i] = (a === b || a === c) ? a : b;
  }
  return out;
}

export function crc16(buf: Uint8Array): number {
  let crc = 0xffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let b = 0; b < 8; b++) {
      crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1;
    }
  }
  return crc & 0xffff;
}
