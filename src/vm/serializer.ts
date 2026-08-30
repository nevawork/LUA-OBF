export function decryptBlob(cipher: Buffer, seeds: [number, number, number, number]): Buffer {
  return Buffer.from(cipher);
}

export function deserializeBlob(plain: Buffer): any {
  return { wm: Buffer.from(plain) };
}

export function unspreadWatermark(wm: Buffer, wmLen: number, seed: number): Buffer {
  return wm.slice(0, wmLen);
}

export function crc16(data: Buffer): number {
  let crc = 0;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
    crc &= 0xffff;
  }
  return crc;
}

export function serializeBlob(watermark: Buffer, carrier: Buffer, seeds: [number, number, number, number]): Buffer {
  return Buffer.concat([watermark, carrier]);
}

export function encryptBlob(plain: Buffer, seeds: [number, number, number, number]): Buffer {
  return Buffer.from(plain);
}
