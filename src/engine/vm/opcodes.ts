// NEVAHEX-VM — logical opcode set (physical numbering is shuffled per build)
// Canonical location: src/engine/vm/opcodes.ts
export enum Op {
  MOVE = 0,      // A        push cells[A].v
  SETLOCAL = 1,  // A        cells[A].v = pop
  DECL = 2,      // A        reserved shape (cells preallocated); no-op at runtime
  STOREN = 3,    // A,B      pop B values into cells[A..A+B-1] in order
  LOADK = 4,     // A        push consts[A]
  NIL = 5,       //          push nil
  TRUE = 6,      //          push true
  FALSE = 7,     //          push false
  PUSHENV = 8,   //          push frame env (assignment target marker)
  GGET = 9,      // A        push env[consts[A]]
  GSET = 10,     // A        env[consts[A]] = pop
  UPVAL = 11,    // A        push upvals[A].v
  SETUPVAL = 12, // A        upvals[A].v = pop
  GETTAB = 13,   //          k,t = pops; push t[k]
  SETTAB = 14,   //          v,k,t = pops; t[k]=v
  SETTABAT = 15, // A        v,k = pops; S[sp-A][k] = v (table stays)
  NEWTABLE = 16, // A,B      push {}
  SETLIST = 17,  // A        append top A values (A<0: absorb multret range) to table under them
  CLOSURE = 18,  // A        push closure(proto id A)
  CALL = 19,     // A,B      call: A args (-1 multret), B results (0/1/-1)
  CALLM = 20,    // A,B      method call: implicit self just below fn
  VARARG = 21,   // A        push varargs (A==-1: all -> sets mr)
  RET = 22,      // A        return top A values (A==-1: multret range)
  ADD = 23,
  SUB = 24,
  MUL = 25,
  DIV = 26,
  MOD = 27,
  POW = 28,
  CONCAT = 29,   // A        concatenate top A values (left-assoc)
  EQ = 30,       //          push (a == b)
  LT = 31,       //          push (a < b)
  LE = 32,       //          push (a <= b)
  NOT = 33,
  LEN = 34,      //          push #a
  NEG = 35,      //          push -a
  JMP = 36,      // B        pc += B (relative to next instr)
  JF = 37,       // B        pop c; if not truthy(c): pc += B
  JT = 38,       // B        pop c; if truthy(c): pc += B
  DUP = 39,      //          push copy of top
  POP = 40,      // A        pop A values
  SWAP = 41,     //          swap top two
  DUP_ROT = 42,  //          [recv, fn] -> [fn, recv]
  ADJUST = 43,   // A,B      force exactly A values on top; B encodes static size (<0 => expanded)
  ADJUST_ONE = 44, //        force exactly 1 value on top; clear mr
  MSET = 45,     // A        A targets: layout [k,t] xA then A values; env-marker store
  FORPREP = 46,  // A,B      A=ctrl/state base slot, B=rel exit; pops [start,limit,step]
  FORLOOP = 47,  // A,B      A=base slot, B=rel back to body
  GFORPREP = 48, // A,B,C    A=base slot, B=rel exit, C=#ctrl vars; pops f,s,ctrl
  GFORLOOP = 49, // A,B,C    A=base slot, B=rel back to body, C=#ctrl vars
  ESCAPE = 50,   // A,B      reserved deopt valve: native escape[A] (never emitted in v2.1 core)
}

export const OP_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(Op)
    .filter(([k]) => isNaN(Number(k)))
    .map(([k, v]) => [v as number, k]),
);

/** Logical instruction: [op, a, b, c]. b often a relative jump offset. */
export type Instr = [number, number, number, number];

export interface UpvalDesc {
  instack: boolean;
  idx: number;
}

export interface Proto {
  params: number;
  isVararg: boolean;
  consts: Const[];
  code: Instr[];
  protos: Proto[];
  upvals: UpvalDesc[];
  numSlots: number;
}

export type Const = string | number | boolean | null;
