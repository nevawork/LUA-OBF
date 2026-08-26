// NEVAHEX-VM — Stage-2 inner deserializer VM (APEX W1.1)
//
// STATUS: correctness-core IN PROGRESS — this file currently carries ONLY the
// frozen ISA specification. The assembler, hand-compiled decode program, and
// reference interpreter were designed (see APEX plan §A1 implementation
// notes) and are implemented in the NEXT session as a single atomic write,
// gated by tests/phase10.test.ts differential fuzz against deserializeBlob
// BEFORE any artifact emission changes. Doctrine D7: correctness is security's
// prerequisite — no staged/broken intermediates ship.

export const OP = {
  HALT: 0,
  RDU8: 1, //        [a]              R[a] = u8()
  RDUV: 2, //        [a]              R[a] = uvar()
  RDSV: 3, //        [a]              R[a] = svar()
  LDI: 4, //         [a], imm(b)      R[a] = b                (0..255)
  MOV: 6, //         [a] <- [b]
  ADD: 7, //         [a,b,c]
  SUB: 8,
  MUL: 9,
  MOD: 10,
  FLOORDIV: 11, //                  R[a] = floor(R[b]/R[c])
  JMP: 12, //        addr(a)
  JEQZ: 13, //       [a], addr(b)     if R[a]==0   → pc=b
  JNEZ: 14, //       [a], addr(b)     if R[a]!=0   → pc=b
  JLT: 15, //        [a,b], addr(c)   if R[a]<R[b] → pc=c
  ERR: 16, //        errId(a)
  NEWT: 17, //       [a]
  PROTO_NEW: 18, //  [a]              fresh proto skeleton; becomes `cur`
  SETF: 19, //       [t], key(b), [src]      numeric key
  SETFS: 20, //      [t], strIdx(b), [src]   string key (STRS)
  GETF: 21, //       [dst], [t], strIdx(b)
  SETDYN: 22, //     [t],[k],[src]    R[t][R[k]] = R[src]
  PUSH: 23, //       [t],[src]
  PAYLOAD: 24, //    [dst],[ln]       collect R[ln] bytes from stream
  STRFROM: 25, //    [dst],[bytes]
  FLOAT: 26, //      [dst],[str]
  NONFINITE: 27, //  [dst], kind(b)   0=NaN 1=+inf 2=-inf
  LDNIL: 28, //      [a]
  COMMIT_PROTO: 29, //[pid]            protos[R[pid]] = cur
  WMPUSH: 30, //     [src]
} as const;

/** string constant pool referenced by *_S ops */
export const STRS = [
  "params", "isVararg", "upvals", "numSlots", "consts", "code", "protos",
  "instack", "idx",
] as const;

export interface ExecOptions {
  budgets: { maxProtos: number; maxConsts: number; maxCode: number };
  fieldKeys: { OP: number; A: number; B1: number; B2: number; C: number };
  opencode: import("../runtime/opencode").OpenCodeParams;
}
