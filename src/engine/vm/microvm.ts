// NEVAHEX-VM — Stage-2 inner deserializer VM (APEX W1.1)
//
// ISA specification module. Siblings:
//   microvm-asm.ts   — Asm (label-resolving emitter) + program masking
//   microvm-exec.ts  — reference interpreter (execProgram)
//   microvm-program.ts — hand-compiled decode program (next increment)
//
// Design constraints honored by every sibling:
//   • ALL wide constants (budgets, cipher multipliers, watermark seeds, field
//     keys, opencode params) live in an interpreter-initialized PREAMBLE
//     register bank (PRE below, regs 44–70) ⇒ every program word is a pure
//     byte (0..255) ⇒ additive word masking is uniformly safe.
//   • Registers live in a table keyed by integers — immune to Lua's
//     200-local limit and invisible to local-scanner heuristics.
//   • Instruction records are built with SETF (numeric keys 1..4); dynamic
//     keys (SETDYN) exist for the future Lua-side variant.

export const OP = {
  HALT: 0,
  RDU8: 1, //        [a]              R[a] = u8()
  RDUV: 2, //        [a]              R[a] = uvar()
  RDSV: 3, //        [a]              R[a] = svar()
  LDI: 4, //         [a], imm(b)      R[a] = b                  (0..255)
  EQI: 5, //         [a], imm(b), [dst]  R[dst] = (R[a] === b)  boolean
  MOV: 6, //         [a] <- [b]
  ADD: 7, //         [a,b,c]
  SUB: 8,
  MUL: 9,
  MOD: 10,
  FLOORDIV: 11, //                  R[a] = floor(R[b]/R[c])
  JMP: 12, //        addr(a)
  JEQZ: 13, //       [a], addr(b)     if R[a]==false/0 → pc=b
  JNEZ: 14, //       [a], addr(b)     if R[a]!=false/0 → pc=b
  JLT: 15, //        [a,b], addr(c)   if R[a]<R[b] → pc=c
  ERR: 16, //        errId(a)         throw MicroError(a)
  NEWT: 17, //       [a]              R[a] = {}
  PROTO_NEW: 18, //  [a]              fresh proto skeleton; becomes `cur`
  SETF: 19, //       [t], key(b), [src]      R[t][b] = R[src]
  SETFS: 20, //      [t], strIdx(b), [src]   R[t][STRS[b]] = R[src]
  GETF: 21, //       [dst], [t], strIdx(b)   R[dst] = R[t][STRS[b]]
  PUSH: 23, //       [t],[src]        R[t][#R[t]+1] = R[src]
  PAYLOAD: 24, //    [dst],[ln]       collect R[ln] stream bytes → byte array
  STRFROM: 25, //    [dst],[bytes]    latin1 string from byte array
  FLOAT: 26, //      [dst],[str]      parseFloat(str)
  NONFINITE: 27, //  [dst], kind(b)   0=NaN 1=+inf 2=-inf
  LDNIL: 28, //      [a]              R[a] = nil (undefined)
  COMMIT_PROTO: 29, //[pid]            flat[R[pid]-1] = cur
  WMPUSH: 30, //     [src]            wm.push(R[src])
} as const;

/** string constant pool referenced by *_S ops */
export const STRS = [
  "params", "isVararg", "upvals", "numSlots", "consts", "code", "protos",
  "instack", "idx",
] as const;

export class MicroError extends Error {
  constructor(public readonly errId: number) {
    super(`microvm:${errId}`);
  }
}

/** preamble register bank — interpreter-initialized constants */
export const PRE = {
  BYTE256: 44,
  WORD65536: 45,
  THREE: 46,
  M31m1: 47,
  WSA: 48,
  WSB: 49,
  MAXPROTOS: 50,
  MAXCONSTS: 51,
  MAXCODE: 52,
  RK0: 53,
  ASTEP: 54,
  AINC: 55,
  KOP: 56,
  KA: 57,
  KB1: 58,
  KB2: 59,
  KC: 60,
  M31: 61,
  M48271: 62,
  M69621: 63,
  M2994349: 64,
  M4050403: 65,
  C31: 66,
  C17: 67,
  C2048: 68,
  C1024: 69,
} as const;

export interface ExecOptions {
  budgets: { maxProtos: number; maxConsts: number; maxCode: number };
  fieldKeys: { OP: number; A: number; B1: number; B2: number; C: number };
  opencode: OpenCodeParams;
  /** watermark seed registers (normalized, < 2^31) */
  wmSeeds: [number, number];
}

export interface ExecResult {
  flat: Proto[];
  wm: number[];
  pos: number;
}

type OpenCodeParams = import("../runtime/opencode").OpenCodeParams;
type Proto = import("./opcodes").Proto;
