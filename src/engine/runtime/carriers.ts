// NEVAHEX-VM — runtime module: watermark carrier consumption
// The decoded carrier table must stay live so naive dead-code elimination can't
// strip the watermark section from memory representations; we fold a byte of it
// through an opaque tautology each tick.

export interface CarrierNames {
  wmVar: string;   // decoded carrier byte table
  wmiVar: string;  // carrier count (min 1)
  sixVar: string;  // rotating index local
  sinkVar: string; // frame-local dead sink
}

export function emitCarrierTouch(n: CarrierNames): string[] {
  return [
    `${n.sinkVar}=(${n.wmVar}[(${n.sixVar}*7)%${n.wmiVar}+1]==nil) and 1 or 0`,
  ];
}
