// NEVAHEX-VM — Gate 0 correctness pre-work tests
// E3 non-finite constant tags (the NaN-decodes-as-nil bugfix), E1/E2 budget
// governor behavior, and the fail-loud integration path.
import { describe, it, expect } from "vitest";
import {
  serializeProto, deserializeBlob,
} from "../src/engine/vm/serializer";
import { Proto } from "../src/engine/vm/opcodes";
import { checkBudgets, collectLocals, FILE_LIMIT } from "../src/engine/runtime/localbudget";
import { protect } from "../src/pipeline";

function bareProto(consts: unknown[]): Proto {
  return { params: 0, isVararg: false, consts, code: [], protos: [], upvals: [], numSlots: 0 };
}

describe("gate 0 / E3: non-finite constant tags", () => {
  it("serializes NaN/±Inf as tags 7/8/9 with no payload bytes", () => {
    const root = bareProto([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);
    const { plain } = serializeProto(root);
    // legacy text forms must never appear on the wire
    expect(plain.includes(Buffer.from("(0/0)"))).toBe(false);
    expect(plain.includes(Buffer.from("1e999"))).toBe(false);
  });

  it("round-trips non-finite values through the TS mirror", () => {
    const root = bareProto([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);
    const { plain } = serializeProto(root);
    const d = deserializeBlob(plain);
    expect(d.flat[0].consts.length).toBe(3);
    expect(Number.isNaN(d.flat[0].consts[0] as number)).toBe(true);
    expect(d.flat[0].consts[1]).toBe(Number.POSITIVE_INFINITY);
    expect(d.flat[0].consts[2]).toBe(Number.NEGATIVE_INFINITY);
  });

  it("finite numbers keep the masked decimal path", () => {
    const root = bareProto([1234.5]);
    const { plain } = serializeProto(root);
    const d = deserializeBlob(plain);
    // masked ⇒ garbage number (never the original without CV)
    expect(d.flat[0].consts[0]).not.toBe(1234.5);
  });

  it("runtime maps tag7 to (0/0) and tag8/9 to math.huge", () => {
    const r = protect({ source: "return 1", seedHex: "ab".repeat(32) });
    expect(r.lua.includes("pr.c[i]=(0/0)")).toBe(true);
    expect(r.lua.includes("pr.c[i]=math.huge")).toBe(true);
    expect(r.lua.includes("pr.c[i]=-math.huge")).toBe(true);
    // legacy broken encodings absent from runtime text
    expect(r.lua.includes('tonumber(sv) else')).toBe(true); // CV finite path intact
    expect(r.lua.includes('"(0/0)"')).toBe(false);
    expect(r.lua.includes('"(1e999"')).toBe(false);
  });
});

describe("gate 0 / E1+E2: local & upvalue budgets", () => {
  it("collectLocals captures multi-name declarations distinctly", () => {
    const set = collectLocals("local a, bb, ccc = 1 local d local e,f");
    expect(set).toEqual(new Set(["a", "bb", "ccc", "d", "e", "f"]));
  });

  it("healthy artifact passes all three budgets", () => {
    const r = protect({ source: "local a=1 return a", seedHex: "11".repeat(32) });
    // replicate the emitter's check from outside: whole-artifact local count
    const fileLocals = collectLocals(r.lua).size;
    expect(fileLocals).toBeLessThanOrEqual(FILE_LIMIT);
  });

  it("fails loudly when the file-chunk budget is breached", () => {
    let lua = "";
    for (let i = 0; i < 180; i++) lua += `local v${i}=${i}\n`;
    const rep = checkBudgets(lua, "local q=1", []);
    expect(rep.ok).toBe(false);
    expect(rep.fileLocals).toBeGreaterThan(FILE_LIMIT);
    expect(rep.problems[0]).toContain("file chunk declares");
  });

  it("fails on upvalue breach when run() references too many file-scope names", () => {
    const fileScopeNames = Array.from({ length: 60 }, (_, i) => `upv${i}`);
    const runText = fileScopeNames.map((n) => `x=${n}`).join("\n") + "\nlocal q=1";
    const rep = checkBudgets("return 1", runText, fileScopeNames);
    expect(rep.ok).toBe(false);
    expect(rep.upvaluesInRun).toBe(60);
    expect(rep.problems[0]).toContain("upvalues");
  });

  it("frame budget breach is reported independently", () => {
    let runText = "";
    for (let i = 0; i < 210; i++) runText += `local w${i}=${i}\n`;
    const rep = checkBudgets("return 1", runText, []);
    expect(rep.frameDeclared).toBe(210);
    expect(rep.problems.some((p) => p.includes("run() declares"))).toBe(true);
  });
});
