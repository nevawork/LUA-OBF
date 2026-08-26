// NEVAHEX-VM — micro-VM interpreter unit tests (APEX W1.1, increment 1)
// Validates execProgram on hand-written mini-programs: arithmetic/loop
// execution, comparison+branch semantics, boolean EQI, string/payload ops,
// non-finite literals, error propagation, and program masking round-trip.
import { describe, it, expect } from "vitest";
import { execProgram } from "../src/engine/vm/microvm-exec";
import { maskProgram, unmaskProgram } from "../src/engine/vm/microvm-asm";
import { MicroError } from "../src/engine/vm/microvm";

const OPTS = {
  budgets: { maxProtos: 16, maxConsts: 64, maxCode: 256 },
  fieldKeys: { OP: 31, A: 32, B1: 33, B2: 34, C: 35 },
  opencode: { rk0: 12345, astep: 1000003, ainc: 65537 },
  wmSeeds: [111111, 222222] as [number, number],
};

// instruction helper: HALT=0 RDU8=1 RDUV=2 RDSV=3 LDI=4 LDIW=5 EQI=6 MOV=7 ADD=8
// SUB=9 MUL=10 MOD=11 FLOORDIV=12 JMP=13 JEQZ=14 JNEZ=15 JLT=16 ERR=17
// NEWT=18 PROTO_NEW=19 SETF=20 SETFS=21 GETF=22 PUSH=24 PAYLOAD=25
// STRFROM=26 FLOAT=27 NONFINITE=28 LDNIL=29 COMMIT=30 WMPUSH=31
const I = {
  halt: (): number[] => [0, 0, 0, 0],
  ldi: (r: number, v: number): number[] => [4, r, v & 255, 0],
  ldiw: (r: number, v: number): number[] => [5, r, v & 255, (v >>> 8) & 255],
  mov: (a: number, b: number): number[] => [7, a, b, 0],
  add: (d: number, x: number, y: number): number[] => [8, d, x, y],
  sub: (d: number, x: number, y: number): number[] => [9, d, x, y],
  jmp: (addrInstr: number): number[] => [13, addrInstr, 0, 0],
  jnez: (r: number, addrInstr: number): number[] => [15, r, addrInstr, 0],
  jlt: (x: number, y: number, addrInstr: number): number[] => [16, x, y, addrInstr],
  eqi: (r: number, imm: number, dst: number): number[] => [6, r, imm, dst],
  err: (id: number): number[] => [17, id, 0, 0],
  strfrom: (dst: number, bytes: number): number[] => [26, dst, bytes, 0],
  float: (dst: number, str: number): number[] => [27, dst, str, 0],
  payload: (dst: number, ln: number): number[] => [25, dst, ln, 0],
  nonfinite: (dst: number, kind: number): number[] => [28, dst, kind, 0],

describe("microvm exec: control flow & arithmetic", () => {
  it("sums 1..10 with an explicit guard loop (result in R2 = 55)", () => {
    // r1=i, r2=sum, r3=tmp, r4=one
    const prog = [
      ...I.ldi(4, 1),
      ...I.ldi(1, 1),
      ...I.ldi(2, 0),
      ...I.ldi(3, 10),
      ...I.jlt(3, 1, 8), // if 10 < i → end (instr index 8)
      ...I.add(2, 2, 1),
      ...I.add(1, 1, 4),
      ...I.jmp(4),       // back to loop test (instr index 4)
      ...I.halt(),
    ];
    const res = execProgram(prog, new Uint8Array(0), {
      ...OPTS,
      debugRegs: [2],
    });
    expect(res.regsOut![2]).toBe(55);
  });

  it("JEQZ/JNEZ branch on booleans produced by EQI", () => {
    // EQI r5,0,? never used; craft: LDI r1,0; EQI r1,0,r2 (true); JNEZ r2 -> taken
    const prog = [
      ...I.ldi(1, 0),
      ...I.eqi(1, 0, 2),   // r2 = (0 === 0) = true
      ...I.jnez(2, 6),     // jump to instr 6
      ...I.err(7),         // must be skipped
      ...I.halt(),         // instr 6 → clean end
    ];
    expect(() =>
      execProgram(prog, new Uint8Array(0), OPTS),
    ).not.toThrow();
  });
});

describe("microvm exec: data-plane ops", () => {
  it("PAYLOAD + STRFROM + FLOAT reconstruct masked decimal constants", () => {
    const D = Uint8Array.from([0x31, 0x32, 0x2e, 0x35]); // "12.5"
    const prog = [
      ...I.ldi(13, 4),          // ln = 4
      ...I.payload(14, 13),     // bb = bytes
      ...I.strfrom(21, 14),     // sstr
      ...I.float(17, 21),       // val
      ...I.halt(),
    ];
    const res = execProgram(prog, D, { ...OPTS, debugRegs: [17] });
    expect(res.regsOut![17]).toBe(12.5);
    expect(res.pos).toBe(4);
  });

  it("NONFINITE produces NaN and ±Infinity", () => {
    const base = [...I.nonfinite(18, 0), ...I.halt()];
    expect(Number.isNaN(execProgram(base, new Uint8Array(0), { ...OPTS, debugRegs: [18] }).regsOut![18])).toBe(true);
    const inf = execProgram([...I.nonfinite(18, 1), ...I.halt()], new Uint8Array(0), { ...OPTS, debugRegs: [18] });
    expect(inf.regsOut![18]).toBe(Number.POSITIVE_INFINITY);
    const ninf = execProgram([...I.nonfinite(18, 2), ...I.halt()], new Uint8Array(0), { ...OPTS, debugRegs: [18] });
    expect(ninf.regsOut![18]).toBe(Number.NEGATIVE_INFINITY);
  });

  it("ERR throws MicroError carrying the build-side id", () => {
    expect(() =>
      execProgram([...I.err(3), ...I.halt()], new Uint8Array(0), OPTS),
    ).toThrow(MicroError);
    try {
      execProgram([...I.err(3)], new Uint8Array(0), OPTS);
    } catch (e) {
      expect((e as MicroError).errId).toBe(3);
    }
  });
});

describe("microvm asm: masking round-trip", () => {
  it("mask→unmask is identity for byte programs", () => {
    const words = [4, 1, 55, 0, 15, 1, 2, 9, 12, 4, 0, 0];
    const masked = maskProgram(words, 987654321);
    expect(masked.some((w) => w < 0 || w > 255)).toBe(false);
    expect(unmaskProgram(masked, 987654321)).toEqual(words);
  });

  it("masked program executes identically under its seed", () => {
    const words = [
      ...I.ldi(4, 1),
      ...I.ldi(1, 1),
      ...I.ldi(2, 0),
      ...I.ldi(3, 5),
      ...I.jlt(3, 1, 8),
      ...I.add(2, 2, 1),
      ...I.add(1, 1, 4),
      ...I.jmp(4),
      ...I.halt(),
    ];
    const seed = 123456789;
    const plain = execProgram(words, new Uint8Array(0), { ...OPTS, debugRegs: [2] });
    const masked = execProgram(maskProgram(words, seed), new Uint8Array(0), {
      ...OPTS,
      debugRegs: [2],
      programSeed: seed,
    });
    expect(masked.regsOut![2]).toBe(plain.regsOut![2]);
    expect(masked.regsOut![2]).toBe(15);
  });
});
