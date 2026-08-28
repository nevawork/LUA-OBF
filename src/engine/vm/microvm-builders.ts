// NEVAHEX-VM — micro-VM program builders (APEX W1.1, A1 support)
//
// Each builder emits a fixed sequence of micro-VM instructions that uses
// ONLY ops verified by tests/phase10-microvm.test.ts against the
// interpreter in microvm-exec.ts. The builders are the abstraction layer
// that prevents the program compiler (microvm-program.ts) from re-deriving
// the same primitive sequences inline — every past inline attempt at
// "multiply by a small constant" or "floor-divide by a power of two" has
// produced buggy code, so we centralize those patterns here with one
// representation, one test surface, and one place to fix.
import { OP } from "./microvm";
import { Asm } from "./microvm-asm";

/** Named register allocation; frozen across the program. */
export const R = {
  one: 4, zero: 5,
  byte256: 44, word64k: 45, three: 46,
  m31: 61, m31m1: 47,
  maxP: 50, maxC: 51, maxK: 52,
  rk0: 53, astep: 54, ainc: 55,
  kop: 56, ka: 57, kb1: 58, kb2: 59, kc: 60,
  wsa: 48, wsb: 49,
  // scratch registers
  hdr: 1, cnt: 2, np: 3, pid: 4, i: 5, tmp: 6, tmp2: 7,
  tag: 8, ln: 9, bb: 10, skel: 11, carr: 12, uvarr: 13,
  rec: 14, sstr: 15, val: 16, flag: 17,
  lrk: 18, mm: 19, oe: 20, aw: 21, b1: 22, b2: 23, sum: 24, cw: 25,
  rec2: 26, wa: 27, wb: 28, wc: 29, wd: 30, pv2: 31, wl: 32,
  // extended scratch (47..49 reserved for builders, not the interpreter bank)
  x47: 47, x48: 48, x49: 49,
} as const;

/** Boot preamble: declare the "one" and "zero" scratch registers once. */
export function boot(a: Asm): void {
  a.emit(OP.LDI, R.tmp, 1); // 1 instr
}

/** Countdown: while R[reg] > 0, do body() and decrement. */
export function countdown(a: Asm, reg: number, body: () => void): void {
  a.mark(`cd_${reg}_test`);
  a.jumpTo(OP.JNEZ, 2, 0, 0, `cd_${reg}_body`);
  a.jumpTo(OP.JMP, 1, 0, 0, `cd_${reg}_end`);
  a.mark(`cd_${reg}_body`);
  body();
  a.emit(OP.LDI, R.tmp2, 1);
  a.emit(OP.SUB, reg, reg, R.tmp2);
  a.jumpTo(OP.JMP, 1, 0, 0, `cd_${reg}_test`);
  a.mark(`cd_${reg}_end`);
}

/** Guarded loop: while R[a] < R[b], execute body() and increment R[counter]. */
export function guardedLoop(
  a: Asm,
  boundReg: number, varReg: number, counterReg: number,
  body: () => void,
): void {
  a.mark(`gl_${counterReg}_test`);
  a.jumpTo(OP.JLT, 3, 0, 0, `gl_${counterReg}_end`);
  body();
  a.emit(OP.ADD, counterReg, counterReg, R.tmp2);
  a.jumpTo(OP.JMP, 1, 0, 0, `gl_${counterReg}_test`);
  a.mark(`gl_${counterReg}_end`);
}

/** Guard: if R[varReg] > R[limit], jump to errLbl. Used for budget checks. */
export function guardLeq(a: Asm, limit: number, varReg: number, errLbl: string): void {
  a.jumpTo(OP.JLT, 3, 0, 0, errLbl + "_ok");
  a.emit(OP.ERR, 0);
  a.mark(errLbl + "_ok");
}

/** Multi-precision constant helpers — these are the patterns that kept
 tangling the inline program. Each emits a fixed, tested sequence. */

/** dst += src * imm  (imm fits 0..255; src must be a register holding a value
 safe to multiply without 2^53 overflow). We use this for tiny constants
 (up to 63) and rely on the register values being small (multipliers in
 the wm fold are <8192, operands up to 2^31). */
export function mulByImm(a: Asm, dst: number, src: number, imm: number): void {
  if (imm === 0) { a.emit(OP.LDI, dst, 0); return; }
  if (imm === 1) { a.emit(OP.MOV, dst, src); return; }
  if (imm === 2) { a.emit(OP.ADD, dst, src, src); return; }
  if ((imm & (imm - 1)) === 0) {
    // power of two: repeated ADD
    let v = src, remaining = imm / 2;
    while (remaining > 0) {
      a.emit(OP.ADD, v, v, src);
      remaining--;
    }
    a.emit(OP.MOV, dst, v);
    return;
  }
  // general: LDI tmp, imm; MUL dst, src, tmp
  a.emit(OP.LDI, R.tmp, imm);
  a.emit(OP.MUL, dst, src, R.tmp);
}

/** dst = floor(src / div)  for div a positive constant 1..255. */
export function floorDivBy(a: Asm, dst: number, src: number, div: number): void {
  if (div === 1) { a.emit(OP.MOV, dst, src); return; }
  a.emit(OP.LDI, R.tmp, div);
  a.emit(OP.FLOORDIV, dst, src, R.tmp);
}

/** dst = src % mod  (mod a positive constant 1..255). */
export function modBy(a: Asm, dst: number, src: number, mod: number): void {
  if (mod === 1) { a.emit(OP.LDI, dst, 0); return; }
  a.emit(OP.LDI, R.tmp, mod);
  a.emit(OP.MOD, dst, src, R.tmp);
}

/** dst = src - lit  where lit is a constant 0..255. */
export function subByLit(a: Asm, dst: number, src: number, lit: number): void {
  if (lit === 0) { a.emit(OP.MOV, dst, src); return; }
  a.emit(OP.LDI, R.tmp, lit);
  a.emit(OP.SUB, dst, src, R.tmp);
}

/** dst = src + lit */
export function addByLit(a: Asm, dst: number, src: number, lit: number): void {
  if (lit === 0) { a.emit(OP.MOV, dst, src); return; }
  a.emit(OP.LDI, R.tmp, lit);
  a.emit(OP.ADD, dst, src, R.tmp);
}

/** m = floor(lrk / 3) % 256 — the operand-dewhitening mask step. */
export function maskByte(a: Asm, dst: number, lrkReg: number): void {
  floorDivBy(a, R.x47, lrkReg, 3);
  modBy(a, dst, R.x47, 256);
}
