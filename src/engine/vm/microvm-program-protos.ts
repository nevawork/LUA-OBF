// NEVAHEX-VM — per-phase emitter: PROTO (APEX W1.1, R10 decomposition)
//
// Emits the per-proto header + body: params, isVararg, uv loop, numSlots,
// 5 wire-key varints, then delegates to the consts/code sub-phase emitters.
// One of five per-phase files in the R10 decomposition. The consts and
// code loops are factored into their own files so each phase is
// unit-testable in isolation.
//
// Caller pre-conditions: R.pid holds the current proto id (1-based).
// Caller post-conditions: COMMIT_PROTO(R.pid) leaves cur=sentinel in the
// interpreter (the new skeleton). The proto loop in the top-level
// composer increments pid and re-enters.
//
// Wire format reference (writeProto / readProto in serializer.ts):
//   params:        u8
//   isVararg:      u8 (1/0)
//   nu:            uvarint
//   (×nu) { instack:u8, idx:uvarint }
//   numSlots:      uvarint
//   (×5) wire field keys (OP, A, B1, B2, C): each uvarint
//   <defer to consts+code emitters>

import { OP } from "./microvm";
import { R } from "./microvm-builders";
import { Asm } from "./microvm-asm";
import { emitConstLoop } from "./microvm-program-consts";
import { emitCodeLoop } from "./microvm-program-code";

export function emitOneProto(a: Asm): void {
  // PROTO_NEW writes the empty skeleton to R.skel and sets `cur` to it.
  a.emit(OP.PROTO_NEW, R.skel);

  // params: u8 → SETFS skel,0,val
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.SETFS, R.skel, 0, R.tmp);

  // isVararg: u8==1 → boolean → SETFS skel,1,val
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.EQI, R.tmp, 1, R.val);
  a.emit(OP.SETFS, R.skel, 1, R.val);

  // nu = uvarint; uv loop
  a.emit(OP.RDUV, R.nu);
  a.emit(OP.LDI, R.i, 1);
  a.mark("proto_uv_test");
  a.jumpLess(R.nu, R.i, "proto_uv_end");
  a.emit(OP.NEWT, R.rec);
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.EQI, R.tmp, 1, R.val);
  a.emit(OP.SETFS, R.rec, 7, R.val); // instack
  a.emit(OP.RDUV, R.tmp);
  a.emit(OP.SETFS, R.rec, 8, R.tmp); // idx
  a.emit(OP.GETF, R.uvarr, R.skel, 2); // upvals
  a.emit(OP.PUSH, R.uvarr, R.rec);
  a.emit(OP.ADD, R.i, R.i, R.one);
  a.jumpAlways("proto_uv_test");
  a.mark("proto_uv_end");

  // numSlots: uvarint → SETFS skel,3,val (STRS index 3 = "numSlots")
  a.emit(OP.RDUV, R.tmp);
  a.emit(OP.SETFS, R.skel, 3, R.tmp);

  // 5 wire field-key varints (consume the bytes; runtime uses PRE keys)
  for (let k = 0; k < 5; k++) a.emit(OP.RDUV, R.tmp);

  // delegate to sub-phase emitters
  emitConstLoop(a);
  emitCodeLoop(a);

  // commit: protos[R.pid-1] = cur (sentinel)
  a.emit(OP.COMMIT_PROTO, R.pid);
}