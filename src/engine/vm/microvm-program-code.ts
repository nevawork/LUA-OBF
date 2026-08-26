// NEVAHEX-VM — per-phase emitter: CODE (APEX W1.1, R10 decomposition)
//
// Emits the per-proto instruction loop. For each instruction: read the
// rolling-key-encoded opE + four svarint fields, compute the operand mask
// byte m = floor(lrk/3) % 256, produce the 4-element record tuple
// [opE, aw-m, b1w-m+(b2w+m), cw-m] and PUSH it onto skel.code. Then advance
// lrk = (lrk + ainc) % 65536.
//
// Wire format (serializer.ts:303-323 for write, :411-423 for read):
//   for each ins in code:
//     putUvarint(opE)
//     putSvarint(ins[1] + m)     # masked a
//     putSvarint(b1 + m)         # masked first share
//     putSvarint(b2 - m)         # masked second share (counter-shifts so
//                                 #   b1w+b2w = b1+b2 = original offset)
//     putSvarint(ins[3] + m)     # masked c
//
// Caller pre-conditions:
//   R.skel  — current proto skeleton
//   R.pid   — current proto id (1-based)
//   R.lrk   — initial lrk for this proto (initialRk(oc, pid))
//   R.x47/R.mm — scratch (maskByte uses R.x47 as scratch)
//   R.tmp2  — already loaded with 1 (from boot)
//
// Caller post-conditions: skel.code array contains nk 4-element tuples.

import { OP } from "../microvm";
import { R, maskByte, subByLit, addByLit } from "../microvm-builders";
import { Asm } from "../microvm-asm";

export function emitCodeLoop(a: Asm): void {
  // nk = uvarint; budget guard
  a.emit(OP.RDUV, R.ln); // R.ln repurposed as nk
  a.jumpTo(OP.JLT, 2, [R.maxK, R.ln], "k_ok");
  a.emit(OP.ERR, 2);
  a.mark("k_ok");

  // i = 1; loop while i <= nk
  a.emit(OP.LDI, R.i, 1);
  a.mark("k_test");
  a.jumpTo(OP.JLT, 2, [R.ln, R.i], "k_end");

  // m = floor(lrk/3) % 256 (the maskByte helper writes the result to R.mm)
  maskByte(a, R.mm, R.lrk);

  // opE = uvarint → R.oe
  a.emit(OP.RDUV, R.oe);

  // a = svarint; a -= m → R.aw
  a.emit(OP.RDSV, R.tmp2);
  subByLit(a, R.aw, R.tmp2, R.mm);

  // b1 = svarint; b1 -= m → R.b1
  a.emit(OP.RDSV, R.tmp2);
  subByLit(a, R.b1, R.tmp2, R.mm);

  // b2 = svarint; b2 += m → R.b2
  a.emit(OP.RDSV, R.tmp2);
  addByLit(a, R.b2, R.tmp2, R.mm);

  // c = svarint; c -= m → R.cw
  a.emit(OP.RDSV, R.tmp2);
  subByLit(a, R.cw, R.tmp2, R.mm);

  // sum = b1 + b2
  a.emit(OP.ADD, R.sum, R.b1, R.b2);

  // rec2 = {}; SETF 0,oe 1,aw 2,sum 3,cw (1-based keys 0..3 so the record
  // matches the reference TS array indexing exactly)
  a.emit(OP.NEWT, R.rec2);
  a.emit(OP.SETF, R.rec2, 0, R.oe);
  a.emit(OP.SETF, R.rec2, 1, R.aw);
  a.emit(OP.SETF, R.rec2, 2, R.sum);
  a.emit(OP.SETF, R.rec2, 3, R.cw);

  // PUSH carr,rec2 (carr = skel.code via STRS index 5)
  a.emit(OP.GETF, R.carr, R.skel, 5);
  a.emit(OP.PUSH, R.carr, R.rec2);

  // lrk = (lrk + ainc) % 65536
  a.emit(OP.ADD, R.lrk, R.lrk, R.ainc);
  a.emit(OP.LDI, R.tmp, 65536);
  a.emit(OP.MOD, R.lrk, R.lrk, R.tmp);

  // i += 1
  a.emit(OP.ADD, R.i, R.i, R.tmp2);
  a.jumpTo(OP.JMP, 0, [], "k_test");
  a.mark("k_end");
}
