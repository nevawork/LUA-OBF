// NEVAHEX-VM — Phase 4 superoperator fusion tests
// Pins: target-set math, window-mining constraints (interior targets, zero-op
// class, caps), NOP rewrite invariants (positions preserved ⇒ offsets valid),
// fused phys band assignment, the CLOSURE permMap fix (latent remap bug), and
// artifact structure under --superops.
import { describe, it, expect } from "vitest";
import {
  computeTargets, fuseSuperOps, FUSED_ID_BASE, ZERO_OPERAND_OPS,
} from "../src/engine/vm/superops";
import { Op, Proto } from "../src/engine/vm/opcodes";
import { compileChunk } from "../src/vm/compiler";
import { parse } from "../src/lang/parser";
import { serializeProto, deserializeBlob } from "../src/engine/vm/serializer";
import { BuildRng, sha256 } from "../src/engine/crypto/prng";
import { protect } from "../src/pipeline";

const rngFrom = (label: string): BuildRng =>
  new BuildRng(sha256(Buffer.from(label, "utf8")));

const ins = (op: number, a = 0, b = 0, c = 0): [number, number, number, number] => [op, a, b, c];

type RawInstr = [number, number, number, number];

function bareProto(code: RawInstr[]): Proto {
  return { params: 0, isVararg: false, consts: [], code, protos: [], upvals: [], numSlots: 0 };
}

/** any literal in the fused physical band [500, 40499] */
const FUSED_BAND = /\bop==([5-9]\d{2}|[1-9]\d{3}|[1-4]\d{4})\b/;

describe("phase 4: computeTargets", () => {
  it("lands on idx+1+offset for every jump-class instruction", () => {
    const code = [
      ins(Op.ADD),
      ins(Op.JMP, 0, 3),   // → 2+3=5? idx1: 1+1+3=5
      ins(Op.JF, 0, -1),   // → 2+1-1=2 (back to self+... lands idx2? 3-1=2)
      ins(Op.ADD),
      ins(Op.RET, 0),
    ];
    const t = computeTargets(code);
    expect(t.has(5)).toBe(true);
    expect(t.has(2)).toBe(true);
    expect(t.size).toBe(2);
  });
});

describe("phase 4: window mining", () => {
  it("fuses maximal zero-op runs and NOPs interior slots", () => {
    const p = bareProto([
      ins(Op.ADD),
      ins(Op.SUB),
      ins(Op.MUL),
      ins(Op.LOADK, 7), // breaks the run (not zero-op)
      ins(Op.EQ),
      ins(Op.LT),
    ]);
    const specs = fuseSuperOps(p, rngFrom("mine1"));
    expect(specs.length).toBe(2);
    // first window [ADD,SUB,MUL]
    expect(specs[0].members).toEqual([Op.ADD, Op.SUB, Op.MUL]);
    expect(p.code[0][0]).toBe(FUSED_ID_BASE);
    for (let k = 1; k <= 2; k++) {
      expect(p.code[k][0]).toBe(Op.DECL);
      expect(p.code[k].slice(1)).toEqual([0, 0, 0]);
    }
    expect(p.code[3][0]).toBe(Op.LOADK); // untouched barrier
    // second window [EQ,LT]
    expect(specs[1].members).toEqual([Op.EQ, Op.LT]);
    expect(p.code[4][0]).toBe(FUSED_ID_BASE + 1);
    expect(p.code[5][0]).toBe(Op.DECL);
  });

  it("refuses windows whose interior slot is a jump TARGET", () => {
    // JMP at idx0 targets slot 2 ⇒ slot 2 must never join any window
    const q = bareProto([
      ins(Op.JMP, 0, 1), // idx0 → 0+1+1 = 2 ⇒ slot 2 is a target
      ins(Op.ADD),
      ins(Op.SUB),       // targeted — must stay outside every window
      ins(Op.MUL),
    ]);
    const specs = fuseSuperOps(q, rngFrom("mine2"));
    const targets = computeTargets(q.code);
    expect(targets.has(2)).toBe(true);
    for (const s of specs) {
      const start = q.code.findIndex((x) => x[0] === s.id);
      for (let k = start + 1; k < start + s.members.length; k++) {
        expect(targets.has(k)).toBe(false);
      }
    }
  });

  it("honors maxWindow and maxFused caps", () => {
    const long = bareProto(Array.from({ length: 20 }, () => ins(Op.DUP)));
    const specs = fuseSuperOps(long, rngFrom("cap1"), { maxWindow: 3 });
    for (const s of specs) expect(s.members.length).toBeLessThanOrEqual(3);
    const many = bareProto(Array.from({ length: 100 }, () => ins(Op.DUP)));
    const capped = fuseSuperOps(many, rngFrom("cap2"), { maxWindow: 2, maxFused: 5 });
    expect(capped.length).toBe(5);
  });

  it("deterministic per input; ids sequential from FUSED_ID_BASE", () => {
    const mk = (): Proto =>
      bareProto([ins(Op.ADD), ins(Op.SUB), ins(Op.NOT), ins(Op.LEN)]);
    const a = fuseSuperOps(mk(), rngFrom("det"));
    const b = fuseSuperOps(mk(), rngFrom("det"));
    expect(a).toEqual(b);
    a.forEach((s, i) => expect(s.id).toBe(FUSED_ID_BASE + i));
  });
});

describe("phase 4: CLOSURE permMap fix", () => {
  it("remaps by PHYSICAL closure value when permuted", () => {
    const root = compileChunk(parse("local function f() return 1 end return f"));
    // fake permutation moving CLOSURE(18) → 41 and something else → 18
    const logicalCount = Object.keys(Op).filter((x) => isNaN(Number(x))).length;
    const perm = Array.from({ length: logicalCount }, (_, i) => i);
    perm[18] = 41;
    perm[41] = 18;
    const permuted = JSON.parse(JSON.stringify(root)) as Proto;
    const renumber = (p: Proto): void => {
      for (const i of p.code) i[0] = perm[i[0]];
      p.protos.forEach(renumber);
    };
    renumber(permuted);
    const ctx = { permMap: perm };
    const { plain } = serializeProto(permuted, undefined, ctx as never);
    const d = deserializeBlob(plain);
    // child proto gets global id 2 (root is 1); its CLOSURE ref must be 2
    const closurePhys = perm[18];
    const closureInstr = d.flat[0].code.find((i) => i[0] === closurePhys)!;
    expect(closureInstr).toBeDefined();
    expect(closureInstr[1]).toBe(2);
  });
});

describe("phase 4: end-to-end artifacts", () => {
  const SRC = "_G.x = ((1+2)*(3-4)) == 0";

  it("fused band leaves appear only with --superops", () => {
    const off = protect({ source: SRC, seedHex: "ab".repeat(32) });
    expect(FUSED_BAND.test(off.lua)).toBe(false);

    const on = protect({ source: SRC, seedHex: "ab".repeat(32), superops: true });
    expect(FUSED_BAND.test(on.lua)).toBe(true);
  });

  it("self-check passes with fused arms (build does not throw)", () => {
    expect(() =>
      protect({ source: SRC, seedHex: "cd".repeat(32), superops: true }),
    ).not.toThrow();
  });

  it("determinism holds with fusion enabled", () => {
    const a1 = protect({ source: SRC, seedHex: "11".repeat(32), superops: true }).lua;
    const a2 = protect({ source: SRC, seedHex: "11".repeat(32), superops: true }).lua;
    expect(a1).toBe(a2);
  });
});

describe("phase 4: zero-op class sanity", () => {
  it("excludes operand consumers and control transfers", () => {
    for (const op of [Op.LOADK, Op.MOVE, Op.POP, Op.CALL, Op.JMP, Op.JF, Op.JT,
      Op.RET, Op.FORPREP, Op.FORLOOP, Op.CONCAT, Op.STOREN]) {
      expect(ZERO_OPERAND_OPS.has(op)).toBe(false);
    }
  });
});
