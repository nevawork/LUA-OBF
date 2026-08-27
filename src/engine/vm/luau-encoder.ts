// NEVAHEX-VM — Luau bytecode encoder (Phase 6)
//
// Encodes NEVAHEX VM bytecode into Luau-compatible bytecode format.
// Simplified implementation that focuses on correctness.
import { Op, Instr, Proto, Const } from "./opcodes";

export interface LuauEncodeOptions {
  /** Include debug information (default: false) */
  debugInfo?: boolean;
}

const DEFAULT_OPTIONS: Required<LuauEncodeOptions> = {
  debugInfo: false,
};

/**
 * Encode a NEVAHEX Proto into Luau bytecode format.
 * Returns a Uint8Array containing the encoded bytecode.
 */
export function encodeLuauBytecode(proto: Proto, _opts: LuauEncodeOptions = {}): Uint8Array {
  const chunks: number[] = [];

  // Header
  chunks.push(0x1B, 0x4C, 0x75, 0x61, 0x75); // Lua binary marker
  chunks.push(0x58); // Luau version
  chunks.push(0x00, 0x00); // Format version

  // Encode proto
  encodeProto(proto, chunks);

  return new Uint8Array(chunks);
}

/**
 * Encode a Proto structure.
 */
function encodeProto(proto: Proto, chunks: number[]): void {
  // Reserve proto size
  const sizePos = chunks.length;
  chunks.push(0, 0, 0, 0);

  // Function type (no debug info)
  chunks.push(0x00);

  // Parameters
  chunks.push(proto.params & 0xFF);
  chunks.push(proto.isVararg ? 1 : 0);
  chunks.push(proto.upvals.length & 0xFF);

  // Code size
  const codeSizePos = chunks.length;
  chunks.push(0, 0);

  // Encode instructions
  for (const instr of proto.code) {
    encodeInstruction(instr, chunks);
  }

  // Fill code size
  const codeSize = chunks.length - codeSizePos - 2;
  chunks[codeSizePos] = (codeSize >> 8) & 0xFF;
  chunks[codeSizePos + 1] = codeSize & 0xFF;

  // Encode constants
  encodeConstants(proto.consts, chunks);

  // Encode upvalues
  for (const upval of proto.upvals) {
    chunks.push(upval.instack ? 1 : 0);
    chunks.push(upval.idx & 0xFF);
  }

  // Recursive protos
  for (const subProto of proto.protos) {
    encodeProto(subProto, chunks);
  }

  // Fill proto size
  const protoSize = chunks.length - sizePos - 4;
  chunks[sizePos] = (protoSize >> 24) & 0xFF;
  chunks[sizePos + 1] = (protoSize >> 16) & 0xFF;
  chunks[sizePos + 2] = (protoSize >> 8) & 0xFF;
  chunks[sizePos + 3] = protoSize & 0xFF;
}

/**
 * Encode a single instruction (simplified ABC format).
 */
function encodeInstruction(instr: Instr, chunks: number[]): void {
  const [op, a, b, c] = instr;
  const opCode = op & 0x3F;
  const aField = a & 0xFF;
  const bField = b & 0x1FF;
  const cField = c & 0x1FF;

  chunks.push(opCode | (aField << 6));
  chunks.push((bField << 2) | (cField >> 7));
  chunks.push(cField & 0x7F);
}

/**
 * Encode constants table (simplified).
 */
function encodeConstants(consts: Const[], chunks: number[]): void {
  chunks.push(consts.length & 0xFF);

  for (const c of consts) {
    if (c === null) {
      chunks.push(0x00);
    } else if (c === true) {
      chunks.push(0x01);
    } else if (c === false) {
      chunks.push(0x02);
    } else if (typeof c === "number") {
      chunks.push(0x03);
      const buffer = new ArrayBuffer(8);
      const view = new Float64Array(buffer);
      view[0] = c;
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < 8; i++) {
        chunks.push(bytes[i]);
      }
    } else if (typeof c === "string") {
      chunks.push(0x04);
      const encoded = new TextEncoder().encode(c);
      chunks.push(encoded.length & 0xFF);
      for (const byte of encoded) {
        chunks.push(byte);
      }
    } else {
      chunks.push(0x00);
    }
  }
}
