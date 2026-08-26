// NEVAHEX-VM — micro-VM ISA specification (APEX W1.1)
// Sibling of microvm-exec.ts (interpreter) and microvm-program-*.ts
// (per-phase emitters). op values are referenced via the OP enum; renumbering
// any op requires updating ONLY the interpreter switch in microvm-exec.ts.

export const OP = {
  HALT: 0,
  RDU8: 1, //        [a]              R[a] = u8()
  RDUV: 2, //        [a]              R[a] = uvar()
  RDSV: 3, //        [a]              R[a] = svar()
  LDI: 4, //         [a], imm(b)      R[a] = b                  (0..255)
  LDIW: 5, //        [a], lo(b), hi(c)  R[a] = b + c*256         (0..65535)
  EQI: 6, //         [a], imm(b), [dst]  R[dst] = (R[a] === b)  boolean
  MOV: 7, //         [a] <- [b]
  ADD: 8, //         [a,b,c]
  SUB: 9,
  MUL: 10,
  MOD: 11,
  FLOORDIV: 12, //                  R[a] = floor(R[b]/R[c])
  JMP: 13, //        addr(a)
  JEQZ: 14, //       [a], addr(b)     if R[a]==false/0 → pc=b
  JNEZ: 15, //       [a], addr(b)     if R[a]!=false/0 → pc=b
  JLT: 16, //        [a,b], addr(c)   if R[a]<R[b] → pc=c
  ERR: 17, //        errId(a)         throw MicroError(a)
  NEWT: 18, //       [a]
  PROTO_NEW: 19, //  [a]              fresh proto skeleton; becomes `cur`
  SETF: 20, //       [t], key(b), [src]      R[t][b] = R[src]
  SETFS: 21, //      [t], strIdx(b), [src]   R[t][STRS[b]] = R[src]
  GETF: 22, //       [dst], [t], strIdx(b)   R[dst] = R[t][STRS[b]]
  PUSH: 24, //       [t],[src]        R[t][#R[t]+1] = R[src]
  PAYLOAD: 25, //    [dst],[ln]       collect R[ln] stream bytes
  STRFROM: 26, //    [dst],[bytes]    latin1 string from byte array
  FLOAT: 27, //      [dst],[str]      parseFloat(str)
  NONFINITE: 28, //  [dst], kind(b)   0=NaN 1=+inf 2=-inf
  LDNIL: 29, //      [a]              R[a] = nil (undefined)
  COMMIT_PROTO: 30, //[pid]            flat[R[pid]-1] = cur
  WMPUSH: 31, //     [src]            wm.push(R[src])
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

export type OpenCodeParams = import("../runtime/opencode").OpenCodeParams;
export type Proto = import("./opcodes").Proto;
