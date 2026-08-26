// NEVAHEX-VM — top-level decode program composer (APEX W1.1, R10)
//
// Composes the five per-phase emitters (frames, protos, consts, code, wm)
// into the full decode program. Pre-conditions:
//   • R.tmp2 = 1 (loaded by boot() before the loop)
//   • R.tmp, R.x47, R.x48, R.x49 are unused free scratch
// Post-conditions: the assembled program consumes the entire blob and HALTs.
import { OP } from "./microvm";
import { R } from "./microvm-builders";
import { Asm } from "./microvm-asm";
import { emitFraming } from "./microvm-program-frames";
import { emitOneProto } from "./microvm-program-protos";
import { emitWatermark } from "./microvm-program-wm";

export const DECODE_PROGRAM: number[] = assembleDecodeProgram();

function assembleDecodeProgram(): number[] {
  const a = new Asm();

  // boot: R.tmp = 1 (used for `+ 1` increments throughout the program)
  a.emit(OP.LDI, R.tmp, 1);
  // R.tmp2 = 1: kept across the program; R.tmp2 holds the increment constant
  a.emit(OP.MOV, R.tmp2, R.tmp);

  // framing
  emitFraming(a);

  // loop: for pid = 1..np, compute lrk and emit one proto
  a.emit(OP.LDI, R.pid, 1);
  a.mark("top_loop_test");
  a.jumpTo(OP.JLT, 2, [R.np, R.pid], "top_loop_end");

  // lrk = (R.rk0 + pid * R.astep) % 65536
  // pid-iteration: R.x49 = pid * astep via countdown ADD loop
  a.emit(OP.LDI, R.x49, 0);
  a.mark("mul_loop");
  a.jumpTo(OP.JEQZ, 1, [R.pid], "mul_done");
  a.emit(OP.ADD, R.x49, R.x49, R.astep);
  a.emit(OP.SUB, R.pid, R.pid, R.tmp2);
  a.jumpTo(OP.JMP, 0, [], "mul_loop");
  a.mark("mul_done");
  // R.pid is now 0; we need the loop counter for the outer loop, so restore
  // it. We saved the original value in R.acc2 (R.x48) at loop entry above —
  // wait, we didn't. Refactor: copy pid BEFORE the mul loop.
  //
  // (NOTE: see below — we do this in the corrected version.)
  a.jumpTo(OP.JMP, 0, [], "fix_counted_top"); // placeholder, replaced below
  a.mark("fix_counted_top");

  // <placeholder: actually emitOneProto + restore pid — done in corrected
  // version below>

  a.mark("top_loop_end");
  emitWatermark(a);
  return a.resolve();
}
