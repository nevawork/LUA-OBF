// NEVAHEX-VM — Phase 21: formal verification & fuzzing harness
//
// Random-program generator producing semantically verifiable Lua snippets.
// Each program ships with its EXPECTED result table computed by construction,
// so the protected artifact can be differentially checked in any Lua runtime
// without needing a second interpreter: the expected values are derived from
// the generator's own arithmetic, not from running the source.
import { BuildRng, sha256 } from "../engine/crypto/prng";

export interface FuzzCase {
  name: string;
  code: string;
  /** values the compiled program must place into EXPECTED */
  expected: (number | string | boolean | null)[];
}

interface Expr3 {
  lua: string;
  /** constant-folded value when known */
  val?: number | string;
}

export class ProgramGenerator {
  constructor(private rng: BuildRng) {}

  generate(seedName: string): FuzzCase {
    const kind = this.rng.int(5);
    switch (kind) {
      case 0: return this.arithChain(seedName);
      case 1: return this.loopFold(seedName);
      case 2: return this.closureCounter(seedName);
      case 3: return this.tableBuild(seedName);
      default: return this.stringOps(seedName);
    }
  }

  private arithChain(name: string): FuzzCase {
    let e: Expr3 = { lua: String(1 + this.rng.int(50)), val: 0 };
    e.val = Number(e.lua);
    const ops = ["+", "-", "*"];
    for (let i = 0; i < 6; i++) {
      const k = 1 + this.rng.int(20);
      const op = ops[this.rng.int(ops.length)];
      const rhs: Expr3 = { lua: String(k), val: k };
      // fold left-assoc manually (no precedence traps: all same-level + - *)
      if (op === "+") { e = { lua: `${e.lua} + ${rhs.lua}`, val: (e.val as number) + k }; }
      else if (op === "-") { e = { lua: `${e.lua} - ${rhs.lua}`, val: (e.val as number) - k }; }
      else {
        // multiplication only on small accumulators to stay exact
        if ((e.val as number) * k <= 1e9) {
          e = { lua: `(${e.lua}) * ${k}`, val: (e.val as number) * k };
        } else {
          e = { lua: `${e.lua} + ${k}`, val: (e.val as number) + k };
        }
      }
    }
    return {
      name: `fuzz-arith-${name}`,
      code: `EXPECTED={${e.lua}}`,
      expected: [e.val as number],
    };
  }

  private loopFold(name: string): FuzzCase {
    const start = this.rng.int(3);
    const step = 1 + this.rng.int(4);
    const count = 2 + this.rng.int(8);
    const limit = start + step * count - 1;
    let total = 0;
    for (let v = start; v <= limit; v += step) total += v * 2;
    return {
      name: `fuzz-loop-${name}`,
      code: [
        `local s = 0`,
        `for i = ${start}, ${limit}, ${step} do s = s + i * 2 end`,
        `EXPECTED={s}`,
      ].join("\n"),
      expected: [total],
    };
  }

  private closureCounter(name: string): FuzzCase {
    const n = 1 + this.rng.int(10);
    const incA = 1 + this.rng.int(5);
    const incB = 1 + this.rng.int(5);
    return {
      name: `fuzz-closure-${name}`,
      code: [
        "local function mk(x)",
        "  return function(d) x = x + d return x end",
        "end",
        `local f, g = mk(0), mk(100)`,
        `for _ = 1, ${n} do f(${incA}) end`,
        `g(${incB})`,
        "EXPECTED={f(0), g(0)}",
      ].join("\n"),
      expected: [n * incA, 100 + incB],
    };
  }

  private tableBuild(name: string): FuzzCase {
    const vals = Array.from({ length: 3 + this.rng.int(5) }, () => this.rng.int(100));
    const sum = vals.reduce((a, b) => a + b, 0);
    const maxIdx = vals.length;
    return {
      name: `fuzz-table-${name}`,
      code: [
        `local t = {${vals.join(", ")}}`,
        "local s = 0",
        `for i = 1, #t do s = s + t[i] end`,
        "EXPECTED={s, #t, t[" + maxIdx + "]}",
      ].join("\n"),
      expected: [sum, maxIdx, vals[maxIdx - 1]],
    };
  }

  private stringOps(name: string): FuzzCase {
    const words = ["alpha", "beta", "gamma", "delta"];
    const a = words[this.rng.int(words.length)];
    const b = words[this.rng.int(words.length)];
    return {
      name: `fuzz-str-${name}`,
      code: [
        `local s = "${a}" .. "-" .. "${b}"`,
        `EXPECTED={s, #s, string.sub(s, 1, ${a.length})}`,
      ].join("\n"),
      expected: [`${a}-${b}`, a.length + 1 + b.length, a],
    };
  }
}

/** generate N distinct cases deterministically */
export function fuzzSuite(n: number, seedHex?: string): FuzzCase[] {
  // seed from provided hex or fixed default so runs are reproducible
  const seed = Buffer.from(
    seedHex ?? "fuzz".repeat(16),
    seedHex ? "hex" : "utf8",
  ).subarray(0, 32);
  const rng = new BuildRng(sha256(seed));
  const gen = new ProgramGenerator(rng);
  const cases: FuzzCase[] = [];
  for (let i = 0; i < n; i++) cases.push(gen.generate(String(i)));
  return cases;
}
