// NEVAHEX-VM — per-phase emitter: FRAMING (APEX W1.1, R10 decomposition)
//
// Emits the blob's framing prelude: skip the randomized prologue, read
// the proto count, and apply the proto-count budget guard. A separate
// file per the v3 plan R10 doctrine — this phase is unit-testable in
// isolation before composition.
import { OP } from "../microvm";
import { R } from "../microvm-builders";
import { Asm } from "../microvm-asm";
import { modBy } from "../microvm-builders";

/**
 * Read the framing header and store the proto count in R.np.
 * - RDU8 hdr; AND with 0x7f ⇒ prologueLen; skip prologueLen bytes.
 * - RDUV np.
 * - Guard np ≤ PRE.MAXPROTOS.
 *
 * Pre-conditions: none (runs at program start). Post-conditions: R.np holds
 * the proto count; R.pos is positioned right after the prologue bytes (the
 * interpreter's internal pos is advanced by every RDU8).
 */
export function emitFraming(a: Asm): void {
  a.emit(OP.RDU8, R.hdr);
  // prologueLen = hdr & 0x7f; store in R.cnt
  a.emit(OP.LDI, R.tmp, 0x7f);
  a.emit(OP.AND, R.cnt, R.hdr, R.tmp);
  // skip prologueLen bytes: countdown
  const savedMark = a.words.length;
  a.mark("frame_skip_test");
  a.jumpTo(OP.JEQZ, 1, [R.cnt], "frame_skip_end");
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.LDI, R.tmp2, 1);
  a.emit(OP.SUB, R.cnt, R.cnt, R.tmp2);
  a.jumpTo(OP.JMP, 0, [], "frame_skip_test");
  a.mark("frame_skip_end");
  void savedMark;

  // n = RDUV
  a.emit(OP.RDUV, R.np);

  // budget guard
  a.jumpTo(OP.JLT, 2, [R.maxP, R.np], "frame_ok");
  a.emit(OP.ERR, 0);
  a.mark("frame_ok");
}

void modBy; // re-export to satisfy bundlers that strip unused imports
