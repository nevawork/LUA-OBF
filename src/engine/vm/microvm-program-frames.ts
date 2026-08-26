// NEVAHEX-VM — per-phase emitter: FRAMING (APEX W1.1, R10 decomposition)
//
// Emits the blob's framing prelude: read the header, skip the randomized
// prologue, read the proto count, and apply the proto-count budget guard.
// A separate file per the v3 plan's R10 doctrine — this phase is unit-
// testable in isolation before composition. Wire format reference:
// serializeProto() emits [0x80|prologueLen, prologueLen filler bytes,
// uvarint np, ...protos..., uvarint wln, ...wm bytes]. The TS deserializer
// (deserializeBlob) consumes exactly that.
import { OP } from "../microvm";
import { R, modBy } from "../microvm-builders";
import { Asm } from "../microvm-asm";

/**
 * Read the framing header and store the proto count in R.np.
 * Pre-conditions: none (runs at program start). Post-conditions: R.np
 * holds the proto count; the interpreter's internal pos is positioned
 * right after the prologue bytes.
 */
export function emitFraming(a: Asm): void {
  // hdr = RDU8; prologueLen = hdr & 0x7f (use modBy since AND is not in ISA)
  a.emit(OP.RDU8, R.hdr);
  modBy(a, R.cnt, R.hdr, 0x7f);
  // skip prologueLen bytes (countdown)
  a.mark("frame_skip_test");
  a.jumpTo(OP.JEQZ, 1, [R.cnt], "frame_skip_end");
  a.emit(OP.RDU8, R.tmp);
  a.emit(OP.LDI, R.tmp2, 1);
  a.emit(OP.SUB, R.cnt, R.cnt, R.tmp2);
  a.jumpTo(OP.JMP, 0, [], "frame_skip_test");
  a.mark("frame_skip_end");

  // n = RDUV
  a.emit(OP.RDUV, R.np);

  // budget guard: np <= PRE.MAXPROTOS
  a.jumpTo(OP.JLT, 2, [R.maxP, R.np], "frame_ok");
  a.emit(OP.ERR, 0);
  a.mark("frame_ok");
}
