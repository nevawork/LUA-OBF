// NEVAHEX-VM — Pure-Lua Bytecode VM for Roblox Executors
//
// A comprehensive bytecode VM implemented in pure Lua that works in Roblox executors.
// Uses loadstring to compile an interpreter, then the interpreter executes bytecode.
import { Op, Proto, Const } from "../vm/opcodes";

export interface RobloxObfuscatorOptions {
  seed: number;
  encryptBytecode: boolean;
  encryptStrings: boolean;
  controlFlowFlattening: boolean;
  deadCodeInjection: boolean;
  instructionScrambling: boolean;
}

const MBIG = 48271;
const MM = 2147483647;

export class RobloxPureLuaVM {
  private seed: number;
  private rng: number;

  constructor(seed: number) {
    this.seed = seed;
    this.rng = seed;
  }

  private nextRng(): number {
    this.rng = (this.rng * MBIG) % MM;
    return this.rng;
  }

  private scramble(value: number): number {
    return (value + (this.nextRng() % 256)) & 0xFF;
  }

  private descramble(value: number): number {
    return (value - (this.nextRng() % 256)) & 0xFF;
  }

  compile(source: string, proto: Proto, opts: RobloxObfuscatorOptions): string[] {
    const lines: string[] = [];

    // VM header
    lines.push(`-- NEVAHEX Pure-Lua VM`);
    lines.push(`local SEED=${this.seed}`);
    lines.push(`local H=SEED`);
    lines.push(`local function R()H=(H*${MBIG})%${MM}return H end`);

    // Generate bytecode
    const bytecode = this.compileBytecode(proto, opts);
    const bytecodeLua = this.encodeBytecode(bytecode, opts);

    // Generate constants
    const constants = this.compileConstants(proto.consts);

    // VM interpreter (pure Lua)
    const interpreter = this.generateInterpreter(bytecodeLua, constants, opts);

    // Wrap with decoder
    lines.push(...this.generateDecoder(bytecode, opts));

    // Add interpreter
    lines.push(...interpreter);

    return lines;
  }

  private compileBytecode(proto: Proto, opts: RobloxObfuscatorOptions): number[] {
    const bytes: number[] = [];

    for (const instr of proto.code) {
      const [op, a, b, c] = instr;
      bytes.push(op & 0xFF, a & 0xFF, b & 0xFF, c & 0xFF);
    }

    // Halt
    bytes.push(0, 0, 0, 0);

    return bytes;
  }

  private encodeBytecode(bytecode: number[], opts: RobloxObfuscatorOptions): string {
    const encoded: number[] = [];

    if (opts.encryptBytecode) {
      for (const b of bytecode) {
        encoded.push(this.scramble(b));
      }
    } else {
      encoded.push(...bytecode);
    }

    // Encode as Lua table
    const chunks: string[] = [];
    for (let i = 0; i < encoded.length; i += 4) {
      const w = (encoded[i] | (encoded[i + 1] << 8) | (encoded[i + 2] << 16) | (encoded[i + 3] << 24)) >>> 0;
      chunks.push(String(w));
    }

    return `{${chunks.join(",")}}`;
  }

  private compileConstants(consts: Const[]): string {
    const items: string[] = [];

    for (const c of consts) {
      if (c === null) {
        items.push("0"); // nil marker
      } else if (c === true) {
        items.push("1"); // true marker
      } else if (c === false) {
        items.push("2"); // false marker
      } else if (typeof c === "number") {
        items.push(JSON.stringify(c));
      } else if (typeof c === "string") {
        if (c.length > 50) {
          // Split long strings
          items.push(`"${c.slice(0, 50)}".."` + JSON.stringify(c.slice(50)) + `"`);
        } else {
          items.push(JSON.stringify(c));
        }
      } else {
        items.push("0");
      }
    }

    return `{${items.join(",")}}`;
  }

  private generateInterpreter(bytecodeLua: string, constantsLua: string, opts: RobloxObfuscatorOptions): string[] {
    const lines: string[] = [];

    lines.push(`local BYTECODE=${bytecodeLua}`);
    lines.push(`local CONSTS=${constantsLua}`);
    lines.push(`local IP=1`);
    lines.push(`local SP=0`);
    lines.push(`local STACK={}`);

    if (opts.encryptBytecode) {
      lines.push(`local function DEC(X)`);
      lines.push(`  H=SEED`);
      lines.push(`  local V=0`);
      lines.push(`  for I=1,4 do`);
      lines.push(`    H=(H*${MBIG})%${MM}`);
      lines.push(`    V=(V*256)+(X%256-H)%256`);
      lines.push(`    X=X/256`);
      lines.push(`  end`);
      lines.push(`  return V`);
      lines.push(`end`);
    }

    lines.push(`local OPS={}`);

    // LoadK - push constant
    lines.push(`OPS[4]=function(A,B,C)SP=SP+1;STACK[SP]=CONSTS[A]or 0 end`);

    // Move - copy register
    lines.push(`OPS[0]=function(A,B,C)SP=SP+1;STACK[SP]=STACK[B]or 0 end`);

    // Add
    lines.push(`OPS[23]=function(A,B,C)STACK[A]=(STACK[B]or 0)+(STACK[C]or 0)end`);

    // Sub
    lines.push(`OPS[24]=function(A,B,C)STACK[A]=(STACK[B]or 0)-(STACK[C]or 0)end`);

    // Mul
    lines.push(`OPS[25]=function(A,B,C)STACK[A]=(STACK[B]or 0)*(STACK[C]or 0)end`);

    // Div
    lines.push(`OPS[26]=function(A,B,C)STACK[A]=(STACK[B]or 0)/(STACK[C]or 1)end`);

    // Return
    lines.push(`OPS[22]=function(A,B,C)return STACK[A]or 0 end`);

    lines.push(`while true do`);
    lines.push(`  local OP`);
    if (opts.encryptBytecode) {
      lines.push(`  local W=DEC(BYTECODE[IP]);IP=IP+1;OP=W%256`);
    } else {
      lines.push(`  OP=BYTECODE[IP]or 0;IP=IP+1`);
    }
    lines.push(`  if OP==0 then break end`);
    lines.push(`  local A=BYTECODE[IP]or 0;IP=IP+1`);
    lines.push(`  local B=BYTECODE[IP]or 0;IP=IP+1`);
    lines.push(`  local C=BYTECODE[IP]or 0;IP=IP+1`);
    lines.push(`  local F=OPS[OP]`);
    lines.push(`  if F then F(A,B,C)end`);
    lines.push(`end`);

    return lines;
  }

  private generateDecoder(bytecode: number[], opts: RobloxObfuscatorOptions): string[] {
    const lines: string[] = [];

    if (!opts.encryptBytecode) {
      return lines;
    }

    // XOR decode for runtime
    lines.push(`local DECODED={}`);
    lines.push(`H=SEED`);
    lines.push(`for I=1,#BYTECODE do`);
    lines.push(`  H=(H*${MBIG})%${MM}`);
    lines.push(`  DECODED[I]=(BYTECODE[I]-H)%256`);
    lines.push(`end`);
    lines.push(`BYTECODE=DECODED`);

    return lines;
  }
}

export function obfuscateForRoblox(
  source: string,
  proto: Proto,
  seed: number,
  opts: Partial<RobloxObfuscatorOptions> = {}
): string[] {
  const options: RobloxObfuscatorOptions = {
    seed,
    encryptBytecode: true,
    encryptStrings: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    instructionScrambling: true,
    ...opts,
  };

  const vm = new RobloxPureLuaVM(seed);
  return vm.compile(source, proto, options);
}
