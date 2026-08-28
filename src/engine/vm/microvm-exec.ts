// NEVAHEX-VM — micro-VM reference interpreter (APEX W1.1)
// Sibling of microvm.ts (ISA) and microvm-asm.ts (assembler/masking).
//
// execProgram executes a (possibly masked) program against decrypted bytes
// and produces the deserialized proto tree + watermark array. Its semantics
// are pinned by unit tests on hand-written mini-programs here, and later by
// the differential fuzz suite against deserializeBlob once
// microvm-program.ts lands.
import { MicroError, OP, PRE, STRS } from "./microvm";
import { unmaskProgram } from "./microvm-asm";
import type { ExecOptions, ExecResult, Proto } from "./microvm";

type Slot = Record<number, unknown>;

export function execProgram(
  program: ArrayLike<number>,
  D: Uint8Array,
  opts: ExecOptions & {
    programSeed?: number;
    /** capture these registers into the result (test/diagnostic hook) */
    debugRegs?: number[];
  },
): ExecResult {
  const words = opts.programSeed !== undefined
    ? unmaskProgram(Array.from(program), opts.programSeed)
    : Array.from(program);

  // ---- state ----
  const R: Slot = {};
  R[PRE.BYTE256] = 256;
  R[PRE.WORD65536] = 65536;
  R[PRE.THREE] = 3;
  R[PRE.M31m1] = 2147483646;
  R[PRE.WSA] = opts.wmSeeds[0];
  R[PRE.WSB] = opts.wmSeeds[1];
  R[PRE.MAXPROTOS] = opts.budgets.maxProtos;
  R[PRE.MAXCONSTS] = opts.budgets.maxConsts;
  R[PRE.MAXCODE] = opts.budgets.maxCode;
  R[PRE.RK0] = opts.opencode.rk0;
  R[PRE.ASTEP] = opts.opencode.astep;
  R[PRE.AINC] = opts.opencode.ainc;
  R[PRE.KOP] = opts.fieldKeys.OP;
  R[PRE.KA] = opts.fieldKeys.A;
  R[PRE.KB1] = opts.fieldKeys.B1;
  R[PRE.KB2] = opts.fieldKeys.B2;
  R[PRE.KC] = opts.fieldKeys.C;
  R[PRE.M31] = 2147483647;
  R[PRE.M48271] = 48271;
  R[PRE.M69621] = 69621;
  R[PRE.M2994349] = 2994349;
  R[PRE.M4050403] = 4050403;
  R[PRE.C31] = 31;
  R[PRE.C17] = 17;
  R[PRE.C2048] = 2048;
  R[PRE.C1024] = 1024;

  let pos = 0;
  const protos: Proto[] = [];
  const wm: number[] = [];
  let cur: Proto | null = null;

  const u8 = (): number => {
    const v = D[pos];
    pos++;
    return v;
  };
  const uvar = (): number => {
    let v = 0;
    let shift = 1;
    for (;;) {
      const b = D[pos];
      pos++;
      v += (b & 0x7f) * shift;
      if (!(b & 0x80)) break;
      shift *= 128;
    }
    return v;
  };
  const svar = (): number => {
    const u = uvar();
    return u & 1 ? -(u >>> 1) - 1 : u >>> 1;
  };

  let pc = 0;
  while (pc < words.length) {
    const op = words[pc];
    if (op === 0 /* HALT */) break;
    const a = words[pc + 1];
    const b = words[pc + 2];
    const c = words[pc + 3];
    pc += 4;
    switch (op) {
      case 1: R[a] = u8(); break;                                     // RDU8
      case 2: R[a] = uvar(); break;                                   // RDUV
      case 3: R[a] = svar(); break;                                   // RDSV
      case 4: R[a] = b; break;                                        // LDI
      case 5: R[a] = b + c * 256; break;                              // LDIW
      case 6: R[c] = R[a] === b; break;                                // EQI
      case 7: R[a] = R[b]; break;                                     // MOV
      case 8: R[a] = (R[b] as number) + (R[c] as number); break;      // ADD
      case 9: R[a] = (R[b] as number) - (R[c] as number); break;      // SUB
      case 10: R[a] = (R[b] as number) * (R[c] as number); break;     // MUL
      case 11: R[a] = (R[b] as number) % (R[c] as number); break;      // MOD
      case 12: R[a] = Math.floor((R[b] as number) / (R[c] as number)); break; // FLOORDIV
      case 13: pc = a * 4; break;                                      // JMP
      case 14: if (!R[a]) pc = b * 4; break;                           // JEQZ
      case 15: if (R[a]) pc = b * 4; break;                            // JNEZ
      case 16:
        if ((R[a] as number) < (R[b] as number)) pc = c * 4;
        break;                                                          // JLT
      case 17: throw new MicroError(a);                                // ERR
      case 18: R[a] = {}; break;                                      // NEWT
      case 19: {                                                       // PROTO_NEW
        const skel: Proto = {
          params: 0,
          isVararg: false,
          upvals: [],
          numSlots: 0,
          consts: [],
          code: [],
          protos: [],
        };
        R[a] = skel;
        cur = skel;
        break;
      }
      case 20: {                                                       // SETF
        const t = R[a] as Record<number, unknown>;
        t[b] = R[c];
        break;
      }
      case 21: {                                                       // SETFS
        const t = R[a] as Record<string, unknown>;
        t[STRS[b]] = R[c];
        break;
      }
      case 22: {                                                       // GETF
        const t = R[b] as Record<string, unknown>;
        R[a] = t[STRS[c]];
        break;
      }
      case 24: {                                                       // PUSH
        const t = R[a] as unknown[];
        t.push(R[b]);
        break;
      }
      case 25: {                                                       // PAYLOAD
        const len = R[b] as number;
        const arr: number[] = [];
        for (let j = 1; j <= len; j++) {
          arr[j] = D[pos];
          pos++;
        }
        R[a] = arr;
        break;
      }
      case 26: {                                                       // STRFROM
        const bytes = R[b] as number[];
        let s = "";
        for (let j = 1; j < bytes.length; ) {
          const chunk: number[] = [];
          for (; j < bytes.length && chunk.length < 4096; j++) {
            if (bytes[j] !== undefined) chunk.push(bytes[j]);
          }
          s += String.fromCharCode.apply(null, chunk);
        }
        R[a] = s;
        break;
      }
      case 27: R[a] = parseFloat(R[b] as string); break;               // FLOAT
      case 28:
        R[a] = b === 0 ? NaN : b === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
        break;                                                          // NONFINITE
      case 29: R[a] = undefined; break;                                // LDNIL
      case 30: protos[(R[a] as number) - 1] = cur as Proto; break;   // COMMIT_PROTO
      case 31: wm.push(R[a] as number); break;                        // WMPUSH
      default:
        throw new Error(`microvm exec: bad opcode ${op} @${pc - 4}`);
    }
  }

  const result: ExecResult & { regsOut?: Record<number, unknown> } = {
    flat: protos,
    wm,
    pos,
  };
  if (opts.debugRegs) {
    const snap: Record<number, unknown> = {};
    for (const r of opts.debugRegs) snap[r] = R[r];
    result.regsOut = snap;
  }
  return result;
}
