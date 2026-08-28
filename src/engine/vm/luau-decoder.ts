// NEVAHEX-VM — Luau bytecode decoder (Phase 6)
//
// Decodes Luau bytecode back into NEVAHEX Proto representation.
import { Op, Instr, Proto, Const } from "./opcodes";

export interface LuauDecodeOptions {
  /** Verify bytecode integrity during decode (default: true) */
  verifyIntegrity?: boolean;
  /** Allow unknown opcodes (default: false) */
  allowUnknown?: boolean;
  /** Maximum proto depth (default: 100) */
  maxDepth?: number;
  /** Handle oversized structures (default: false) */
  allowOversized?: boolean;
}

const DEFAULT_OPTIONS: Required<LuauDecodeOptions> = {
  verifyIntegrity: true,
  allowUnknown: false,
  maxDepth: 100,
  allowOversized: false,
};

/**
 * Decode Luau bytecode into NEVAHEX Proto.
 */
export function decodeLuauBytecode(data: Uint8Array, opts: LuauDecodeOptions = {}): Proto {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  let pos = 0;

  // Verify header
  if (options.verifyIntegrity) {
    verifyHeader(data, pos);
  }

  pos += 7; // Skip header

  // Decode proto tree
  const result = decodeProtoTree(data, pos, options, 0);
  return result.proto;
}

/**
 * Verify the Luau bytecode header.
 */
function verifyHeader(data: Uint8Array, pos: number): void {
  if (data[pos] !== 0x1B || data[pos + 1] !== 0x4C ||
      data[pos + 2] !== 0x75 || data[pos + 3] !== 0x61 || data[pos + 4] !== 0x75) {
    throw new Error("Invalid Luau bytecode header");
  }

  if (data[pos + 5] !== 0x58) {
    throw new Error("Invalid Luau version");
  }
}

/**
 * Decode a proto tree from the bytecode stream.
 */
function decodeProtoTree(
  data: Uint8Array,
  pos: number,
  opts: Required<LuauDecodeOptions>,
  depth: number,
): { proto: Proto; newPos: number } {
  if (depth > opts.maxDepth) {
    throw new Error(`Maximum proto depth exceeded: ${depth}`);
  }

  const startPos = pos;

  // Read proto size
  const protoSize = (data[pos] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | data[pos + 3];
  pos += 4;

  // Function type
  const funcType = data[pos++];

  // Parameters and vararg flag
  const params = data[pos++];
  const isVararg = data[pos++] === 1;

  // Upvalue count
  const upvalCount = data[pos++];

  // Code size
  const codeSize = (data[pos] << 8) | data[pos + 1];
  pos += 2;

  // Decode instructions
  const code: Instr[] = [];
  for (let i = 0; i < codeSize; i++) {
    const [instr, newPos] = decodeInstruction(data, pos);
    code.push(instr);
    pos = newPos;
  }

  // Decode constants
  const constCount = data[pos++];
  const consts: Const[] = [];
  for (let i = 0; i < constCount; i++) {
    const [c, newPos] = decodeConstant(data, pos);
    consts.push(c);
    pos = newPos;
  }

  // Decode upvalues
  const upvals: Proto["upvals"] = [];
  for (let i = 0; i < upvalCount; i++) {
    upvals.push({
      instack: data[pos++] === 1,
      idx: data[pos++],
    });
  }

  // Skip debug info if present
  if (funcType & 0x02) {
    pos = startPos + protoSize;
  }

  // Recursive protos
  const protos: Proto[] = [];
  while (pos < startPos + protoSize) {
    const result = decodeProtoTree(data, pos, opts, depth + 1);
    protos.push(result.proto);
    pos = result.newPos;
  }

  return {
    proto: {
      params,
      isVararg,
      consts,
      code,
      protos,
      upvals,
      numSlots: 0,
    },
    newPos: pos,
  };
}

/**
 * Decode a single instruction (simplified ABC format).
 */
function decodeInstruction(data: Uint8Array, pos: number): [Instr, number] {
  const opCode = data[pos] & 0x3F;
  const a = (data[pos] >> 6) & 0xFF;
  const bc = ((data[pos + 1] << 8) | data[pos + 2]) & 0x3FFFF;
  const b = (bc >> 9) & 0x1FF;
  const c = bc & 0x1FF;

  return [[opCode, a, b, c], pos + 3];
}

/**
 * Decode a constant value.
 */
function decodeConstant(data: Uint8Array, pos: number): [Const, number] {
  const type = data[pos++];

  switch (type) {
    case 0x00: // Nil
      return [null, pos];
    case 0x01: // Boolean true
      return [true, pos];
    case 0x02: // Boolean false
      return [false, pos];
    case 0x03: { // Number
      const buffer = new ArrayBuffer(8);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < 8; i++) {
        view[i] = data[pos++];
      }
      const numView = new Float64Array(buffer);
      return [numView[0], pos];
    }
    case 0x04: { // String
      const len = data[pos++];
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = data[pos++];
      }
      return [new TextDecoder().decode(bytes), pos];
    }
    default:
      throw new Error(`Unknown constant type: ${type}`);
  }
}
