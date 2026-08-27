// NEVAHEX-VM — Luau encoder/decoder tests
import { describe, it, expect } from "vitest";
import { encodeLuauBytecode } from "../src/engine/vm/luau-encoder";
import { decodeLuauBytecode } from "../src/engine/vm/luau-decoder";
import { Proto, Op } from "../src/engine/vm/opcodes";

const TEST_PROTO: Proto = {
  params: 1,
  isVararg: false,
  consts: [10, 20, "hello"],
  code: [
    [Op.LOADK, 0, 0, 0], // load const 0 into R0
    [Op.LOADK, 1, 1, 0], // load const 1 into R1
    [Op.ADD, 0, 0, 1],   // R0 = R0 + R1
    [Op.RET, 1, 0, 0],   // return 1 value
  ],
  protos: [],
  upvals: [],
  numSlots: 2,
};

describe("Luau bytecode encoder/decoder", () => {
  it("encodes and decodes a simple proto", () => {
    const encoded = encodeLuauBytecode(TEST_PROTO);
    expect(encoded).toBeInstanceOf(Uint8Array);
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeLuauBytecode(encoded);
    expect(decoded.params).toBe(TEST_PROTO.params);
    expect(decoded.code.length).toBe(TEST_PROTO.code.length);
  });

  it("preserves instruction count through encode/decode roundtrip", () => {
    const encoded = encodeLuauBytecode(TEST_PROTO);
    const decoded = decodeLuauBytecode(encoded);
    expect(decoded.code.length).toBe(TEST_PROTO.code.length);
  });

  it("preserves constant count through encode/decode roundtrip", () => {
    const encoded = encodeLuauBytecode(TEST_PROTO);
    const decoded = decodeLuauBytecode(encoded);
    expect(decoded.consts.length).toBe(TEST_PROTO.consts.length);
  });

  it("handles empty proto", () => {
    const emptyProto: Proto = {
      params: 0,
      isVararg: false,
      consts: [],
      code: [[Op.RET, 0, 0, 0]],
      protos: [],
      upvals: [],
      numSlots: 0,
    };

    const encoded = encodeLuauBytecode(emptyProto);
    const decoded = decodeLuauBytecode(encoded);
    expect(decoded.code.length).toBe(1);
    expect(decoded.consts.length).toBe(0);
  });

  it("handles nested protos", () => {
    const nestedProto: Proto = {
      params: 0,
      isVararg: false,
      consts: [],
      code: [
        [Op.CLOSURE, 0, 0, 0], // push closure of proto 0
        [Op.RET, 1, 0, 0],
      ],
      protos: [TEST_PROTO],
      upvals: [],
      numSlots: 1,
    };

    const encoded = encodeLuauBytecode(nestedProto);
    const decoded = decodeLuauBytecode(encoded);
    expect(decoded.protos.length).toBe(1);
    expect(decoded.protos[0].code.length).toBe(TEST_PROTO.code.length);
  });

  it("produces deterministic output with same input", () => {
    const encoded1 = encodeLuauBytecode(TEST_PROTO);
    const encoded2 = encodeLuauBytecode(TEST_PROTO);
    expect(encoded1).toEqual(encoded2);
  });

  it("produces valid Luau header", () => {
    const encoded = encodeLuauBytecode(TEST_PROTO);
    // Check for Lua binary marker
    expect(encoded[0]).toBe(0x1B);
    expect(encoded[1]).toBe(0x4C);
    expect(encoded[2]).toBe(0x75);
    expect(encoded[3]).toBe(0x61);
    expect(encoded[4]).toBe(0x75);
    // Check for Luau version marker
    expect(encoded[5]).toBe(0x58);
  });

  it("rejects invalid bytecode header", () => {
    const invalidData = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04]);
    expect(() => decodeLuauBytecode(invalidData)).toThrow();
  });
});
