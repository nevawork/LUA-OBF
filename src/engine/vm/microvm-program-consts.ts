// NEVAHEX-VM — per-phase emitter: CONSTS (APEX W1.1, R10 decomposition)
//
// Emits the per-proto constants array. Reads nc=uvarint, applies the
// const-count budget guard, then the loop: for each constant, reads the
// tag byte, dispatches via an EQI chain, performs the tag-specific
// action, and PUSHes onto skel.consts.
//
// Wire format (writeProto / readProto in serializer.ts):
//   nc:                uvarint
//   (×nc) { tag, payload? }
//     tag 0           → null         (no payload)
//     tag 1           → true         (no payload)
//     tag 2           → false        (no payload)
//     tag 5           → float        (uvarint len, then len masked bytes)
//     tag 6           → string       (uvarint len, then len masked bytes)
//     tag 7           → NaN          (no payload, E3 non-finite)
//     tag 8           → +Infinity    (no payload, E3 non-finite)
//     tag 9           → -Infinity    (no payload, E3 non-finite)
//
// The runtime's CV accessor decrypts tags 5/6 on first access; tags 7/8/9
// are mapped to runtime values directly (NONFINITE op). For the differential
// test against deserializeBlob, tags 5/6 produce masked string/garbage
// numbers — IDENTICAL to what deserializeBlob's consts array contains.
//
// Caller pre-conditions: R.skel points to the current proto skeleton.
// Caller post-conditions: skel.consts array has nc entries.

import { OP } from "../microvm";
import { R } from "../microvm-builders";
import { Asm } from "../microvm-asm";

export function emitConstLoop(a: Asm): void {
  // nc = uvarint; budget guard
  a.emit(OP.RDUV, R.np); // R.np repurposed as nc in this scope
  a.jumpTo(OP.JLT, 2, [R.maxC, R.np], "c_ok");
  a.emit(OP.ERR, 1);
  a.mark("c_ok");

  a.emit(OP.LDI, R.i, 1);
  a.mark("c_test");
  a.jumpTo(OP.JLT, 2, [R.np, R.i], "c_end");

  // read tag, dispatch
  a.emit(OP.RDU8, R.tag);

  // chain: 7-way comparison using EQI (eq flag in R.flag) + JNEZ
  // order: 1,2,7,8,9,5,6 — fall through to kNil for anything else
  eqBranch(a, 1, "kTrue");
  eqBranch(a, 2, "kFalse");
  eqBranch(a, 7, "kNaN");
  eqBranch(a, 8, "kInf");
  eqBranch(a, 9, "kNeg");
  eqBranch(a, 5, "kNum");
  eqBranch(a, 6, "kStr");
  a.jumpTo(OP.JMP, 0, [], "kNil");

  pushConst(a);

  a.mark("kTrue");
  a.emit(OP.LDI, R.val, 1);
  pushConst(a);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kFalse");
  a.emit(OP.LDI, R.val, 0);
  pushConst(a);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kNaN");
  a.emit(OP.NONFINITE, R.val, 0);
  pushConst(a);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kInf");
  a.emit(OP.NONFINITE, R.val, 1);
  pushConst(a);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kNeg");
  a.emit(OP.NONFINITE, R.val, 2);
  pushConst(a);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kNum");
  a.emit(OP.RDUV, R.ln);
  a.emit(OP.PAYLOAD, R.bb, R.ln);
  a.emit(OP.STRFROM, R.sstr, R.bb);
  a.emit(OP.FLOAT, R.val, R.sstr);
  pushConst(a);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kStr");
  a.emit(OP.RDUV, R.ln);
  a.emit(OP.PAYLOAD, R.bb, R.ln);
  a.emit(OP.STRFROM, R.sstr, R.bb);
  // for strings, PUSH the sstr itself (masked latin1 string) — not val
  a.emit(OP.GETF, R.carr, R.skel, 4); // consts
  a.emit(OP.PUSH, R.carr, R.sstr);
  a.jumpTo(OP.JMP, 0, [], "c_next");

  a.mark("kNil");
  a.emit(OP.LDNIL, R.val);
  pushConst(a);

  a.mark("c_next");
  a.jumpTo(OP.JMP, 0, [], "c_test");
  a.mark("c_end");
}

/** emit LDI tagVal, EQI flag/tmp/tagVal/flag, JNEZ flag/label. */
function eqBranch(a: Asm, tagVal: number, label: string): void {
  a.emit(OP.LDI, R.tmp, tagVal);
  a.emit(OP.EQI, R.tmp, tagVal, R.flag);
  a.jumpTo(OP.JNEZ, 1, [R.flag], label);
}

/** GETF carr,skel,4 (consts array) then PUSH carr,val. */
function pushConst(a: Asm): void {
  a.emit(OP.GETF, R.carr, R.skel, 4);
  a.emit(OP.PUSH, R.carr, R.val);
}
