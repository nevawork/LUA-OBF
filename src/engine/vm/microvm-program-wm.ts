// NEVAHEX-VM — per-phase emitter: WATERMARK (APEX W1.1, R10 decomposition)
//
// Emits the watermark tail: read uvarint wln; for i=0..wln-1 read u8 into
// the wm array via WMPUSH. The runtime's wm array (number[]) compares
// byte-for-byte with deserializeBlob's wm Buffer once normalized to a
// common byte sequence.
//
// Wire format (serializer.ts:360-365):
//   wln: uvarint
//   (×wln) u8 bytes
//
// Pre-conditions: the program has just finished processing protos. There
// are no register constraints from the previous phase; we use R.tmp for
// the RDU8 result and push directly. The wm array is interpreter-global
// (constructed in microvm-exec.ts:let wm: number[] = []).

import { OP } from "../microvm";
import { R } from "../microvm-builders";
import { Asm } from "../microvm-asm";

export function emitWatermark(a: Asm): void {
  // wln = uvarint
  a.emit(OP.RDUV, R.ln);
  a.emit(OP.LDI, R.i, 1);
  a.mark("wm_test");
  a.jumpLess(R.ln, R.i, "wm_end");
  // wm[i] = RDU8
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.WMPUSH, R.tmp);
  a.emit(OP.ADD, R.i, R.i, R.one);
  a.jumpAlways("wm_test");
  a.mark("wm_end");
  a.emit(OP.HALT);
}