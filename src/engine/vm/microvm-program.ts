// NEVAHEX-VM — top-level decode program composer (APEX W1.1, R10)
//
// Composes the five per-phase emitters (frames, protos, consts, code, wm)
// into the full decode program. Pre-conditions:
//   • R.tmp2 = 1 (loaded by boot() before the loop, used for `+ 1`)
// Post-conditions: the assembled program consumes the entire blob and HALTs.
//
// Register discipline for the pid-iteration multiply:
//   We need lrk = (RK0 + pid * astep) % 65536 BEFORE calling emitOneProto.
//   emitOneProto does NOT read R.pid after we set it, so we can destroy it
//   across the multiply if we save the loop counter elsewhere. Strategy:
//   copy R.pid to R.x48 first, then burn R.pid for the mul countdown, then
//   restore R.pid from R.x48 before emitOneProto.
import { OP } from "./microvm";
import { R } from "./microvm-builders";
import { Asm } from "./microvm-asm";
import { emitFraming } from "./microvm-program-frames";
import { emitOneProto } from "./microvm-program-protos";
import { emitWatermark } from "./microvm-program-wm";

export const DECODE_PROGRAM: number[] = assembleDecodeProgram();

function assembleDecodeProgram(): number[] {
  const a = new Asm();

  // boot: R.tmp = R.tmp2 = 1 (used for `+ 1` increments throughout the program)
  a.emit(OP.LDI, R.tmp, 1);
  a.emit(OP.MOV, R.tmp2, R.tmp);

  // framing: skip prologue, read np
  emitFraming(a);

  // ---- outer proto loop: for pid = 1..np ----
  a.emit(OP.LDI, R.pid, 1);
  a.mark("top_test");
  a.jumpTo(OP.JLT, 2, [R.np, R.pid], "top_end");

  // ---- Phase: compute lrk = (RK0 + pid * ASTEP) % 65536 ---
  // Use R.x48 to save original pid, burn R.pid as loop counter.
  a.emit(OP.MOV, R.x48, R.pid);
  a.emit(OP.LDI, R.x49, 0);
  a.mark("mul_loop");
  a.jumpTo(OP.JEQZ, 1, [R.pid], "mul_done");
  a.emit(OP.ADD, R.x49, R.x49, R.astep);
  a.emit(OP.SUB, R.pid, R.pid, R.tmp2);
  a.jumpTo(OP.JMP, 0, [], "mul_loop");
  a.mark("mul_done");
  // lrk = (RK0 + x49) % 65536
  a.emit(OP.ADD, R.lrk, R.rk0, R.x49);
  a.emit(OP.LDI, R.tmp, 65536);
  a.emit(OP.MOD, R.lrk, R.lrk, R.tmp);
  // restore pid for emitOneProto
  a.emit(OP.MOV, R.pid, R.x48);

  // emit one proto (reads pid via COMMIT_PROTO)
  emitOneProto(a);

  // increment pid and continue
  a.emit(OP.ADD, R.pid, R.pid, R.tmp2);
  a.jumpTo(OP.JMP, 0, [], "top_test");
  a.mark("top_end");

  // watermark tail
  emitWatermark(a);
  return a.resolve();
}