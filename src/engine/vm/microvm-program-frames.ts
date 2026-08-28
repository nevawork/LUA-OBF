// NEVAHEX-VM — per-phase emitter: FRAMING (APEX W1.1, R10 decomposition)
//
// Emits the blob's framing prelude: read the header, skip the randomized
// prologue, read the proto count, and apply the proto-count budget guard.
// A separate file per the v3 plan's R10 doctrine — this phase is unit-
// testable in isolation before composition.
import { OP } from "./microvm";
import { R, modBy } from "./microvm-builders";
import { Asm } from "./microvm-asm";

/**
 * Read the framing header and store the proto count in R.np.
 * Pre-conditions: none (runs at program start). Post-conditions: R.np
 * holds the proto count; the interpreter's internal pos is positioned
 * right after the prologue bytes.
 */
export function emitFraming(a: Asm): void {
  // hdr = RDU8; prologueLen = hdr & 0x7f
  a.emit(OP.RDU8, R.hdr);
  // prologueLen = hdr & 0x7f; store in R.cnt
  a.emit(OP.LDI, R.tmp, 0x7f);
  a.emit(OP.AND, R.cnt, R.hdr, R.tmp);
  // skip prologueLen bytes (countdown)
  a.mark("frame_skip_test");
  a.jumpIfZero(R.cnt, "frame_skip_end");
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.LDI, R.tmp2, 1);
  a.emit(OP.SUB, R.cnt, R.cnt, R.tmp2);
  a.jumpAlways("frame_skip_test");
  a.mark("frame_skip_end");

  // n = RDUV
  a.emit(OP.RDUV, R.np);

  // budget guard: np <= PRE.MAXPROTOS
  a.jumpLess(R.maxP, R.np, "np_err");
  a.jumpAlways("frame_ok");
  a.mark("np_err");
  a.emit(OP.ERR, 0);
  a.mark("frame_ok");
}