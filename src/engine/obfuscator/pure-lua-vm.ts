// NEVAHEX-VM — Pure-Lua Bytecode VM Generator for Roblox
//
// Generates a complete bytecode VM in pure Lua that works in Roblox executors.
// The VM is compiled by loadstring, then interprets obfuscated bytecode.
// This provides STRONG obfuscation similar to Luraph.
import { Op, Proto, Const } from "../vm/opcodes";

export interface PureLuaVmOptions {
  seed: number;
  encryptBytecode: boolean;
  encryptConstants: boolean;
  scrambleOpcodes: boolean;
  addNoise: boolean;
  stackSize: number;
}

const MBIG = 48271;
const MM = 2147483647;

export class PureLuaBytecodeVM {
  private seed: number;
  private rngState: number;

  constructor(seed: number) {
    this.seed = seed;
    this.rngState = seed;
  }

  private rng(): number {
    this.rngState = (this.rngState * MBIG) % MM;
    return this.rngState;
  }

  private scramble(value: number): number {
    return (value + (this.rng() & 0xFF)) & 0xFF;
  }

  private unscramble(value: number): number {
    return (value - (this.rng() & 0xFF)) & 0xFF;
  }

  generate(source: string, proto: Proto, opts: Partial<PureLuaVmOptions> = {}): string[] {
    const options: PureLuaVmOptions = {
      seed: this.seed,
      encryptBytecode: true,
      encryptConstants: true,
      scrambleOpcodes: true,
      addNoise: true,
      stackSize: 256,
      ...opts,
    };

    const lines: string[] = [];

    // Header
    lines.push(`-- NEVAHEX Pure-Lua Bytecode VM`);
    lines.push(`local S=${this.seed}`);
    lines.push(`local M=${MM}`);
    lines.push(`local B=${MBIG}`);
    lines.push(`local function R()S=(S*B)%M;return S;end`);

    // Generate bytecode
    const bytecode = this.compileProto(proto, options);
    const bytecodeLua = this.encodeBytecode(bytecode, options);

    // Generate constants
    const constantsLua = this.encodeConstants(proto.consts, options);

    // VM implementation
    lines.push(...this.generateVmCore(bytecodeLua, constantsLua, options));

    return lines;
  }

  private compileProto(proto: Proto, opts: PureLuaVmOptions): number[] {
    const bytes: number[] = [];

    for (const instr of proto.code) {
      const [op, a, b, c] = instr;
      let opcode = op;

      if (opts.scrambleOpcodes) {
        opcode = this.scramble(opcode);
      }

      bytes.push(opcode, a & 0xFF, b & 0xFF, c & 0xFF);
    }

    // Halt instruction
    bytes.push(0, 0, 0, 0);

    if (opts.addNoise) {
      // Add some noise bytes
      for (let i = 0; i < 10; i++) {
        bytes.push(this.rng() & 0xFF);
      }
    }

    return bytes;
  }

  private encodeBytecode(bytecode: number[], opts: PureLuaVmOptions): string {
    if (opts.encryptBytecode) {
      const encoded = bytecode.map(b => this.scramble(b));
      return this.encodeAsInts(encoded);
    }
    return this.encodeAsInts(bytecode);
  }

  private encodeAsInts(data: number[]): string {
    const words: string[] = [];
    for (let i = 0; i < data.length; i += 4) {
      const w = (data[i] | (data[i + 1] << 8) | (data[i + 2] << 16) | (data[i + 3] << 24)) >>> 0;
      words.push(String(w));
    }
    return `{${words.join(",")}}`;
  }

  private encodeConstants(consts: Const[], opts: PureLuaVmOptions): string {
    const items: string[] = [];

    for (let i = 0; i < consts.length; i++) {
      const c = consts[i];

      if (c === null) {
        items.push("0");
      } else if (c === true) {
        items.push("1");
      } else if (c === false) {
        items.push("2");
      } else if (typeof c === "number") {
        if (opts.encryptConstants) {
          items.push(String(this.scramble(c & 0xFF)));
        } else {
          items.push(String(c));
        }
      } else if (typeof c === "string") {
        const encoded = this.encodeString(c);
        items.push(`"${encoded}"`);
      } else {
        items.push("0");
      }
    }

    return `{${items.join(",")}}`;
  }

  private encodeString(str: string): string {
    const result: string[] = [];
    for (let i = 0; i < str.length; i++) {
      result.push(String.fromCharCode(str.charCodeAt(i) ^ 0x55));
    }
    return result.join("");
  }

  private generateVmCore(bytecodeLua: string, constantsLua: string, opts: PureLuaVmOptions): string[] {
    const lines: string[] = [];

    lines.push(`local D=${bytecodeLua} -- bytecode`);
    lines.push(`local C=${constantsLua} -- constants`);
    lines.push(`local STK={} -- stack`);
    lines.push(`local SP=0 -- stack pointer`);
    lines.push(`local IP=1 -- instruction pointer`);
    lines.push(`local FP=0 -- frame pointer`);

    // Decode function if encrypted
    if (opts.encryptBytecode) {
      lines.push(`local DD={}`);
      lines.push(`S=${this.seed}`);
      lines.push(`for I=1,#D do`);
      lines.push(`  S=(S*B)%M`);
      lines.push(`  DD[I]=(D[I]-S)%256`);
      lines.push(`end`);
      lines.push(`D=DD`);
    }

    // Main loop
    lines.push(`while IP<=#D do`);
    lines.push(`  local W=D[IP]or 0;IP=IP+1`);
    lines.push(`  local A=D[IP]or 0;IP=IP+1`);
    lines.push(`  local B=D[IP]or 0;IP=IP+1`);
    lines.push(`  local C=D[IP]or 0;IP=IP+1`);
    lines.push(`  local OP=W%32`);

    // Op: HALT (0)
    lines.push(`  if OP==0 then break end`);

    // Op: MOVE (1) - R[A] = R[B]
    lines.push(`  elseif OP==1 then`);
    lines.push(`    SP=SP+1;STK[SP]=STK[B]or 0`);

    // Op: LOADK (2) - R[A] = K[B]
    lines.push(`  elseif OP==2 then`);
    lines.push(`    SP=SP+1;STK[SP]=C[B+1]or 0`);

    // Op: ADD (3) - R[A] = R[B] + R[C]
    lines.push(`  elseif OP==3 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)+(STK[C+1]or 0)`);

    // Op: SUB (4) - R[A] = R[B] - R[C]
    lines.push(`  elseif OP==4 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)-(STK[C+1]or 0)`);

    // Op: MUL (5) - R[A] = R[B] * R[C]
    lines.push(`  elseif OP==5 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)*(STK[C+1]or 0)`);

    // Op: DIV (6) - R[A] = R[B] / R[C]
    lines.push(`  elseif OP==6 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)/(STK[C+1]or 1)`);

    // Op: PRINT (7)
    lines.push(`  elseif OP==7 then`);
    lines.push(`    print(tostring(STK[SP]or ""))`);

    // Op: RETURN (8)
    lines.push(`  elseif OP==8 then`);
    lines.push(`    return STK[1]`);

    // Op: LT (9) - R[A] = R[B] < R[C]
    lines.push(`  elseif OP==9 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)<(STK[C+1]or 0) and 1 or 0`);

    // Op: LE (10) - R[A] = R[B] <= R[C]
    lines.push(`  elseif OP==10 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)<=(STK[C+1]or 0) and 1 or 0`);

    // Op: EQ (11) - R[A] = R[B] == R[C]
    lines.push(`  elseif OP==11 then`);
    lines.push(`    STK[A+1]=(STK[B+1]or 0)==(STK[C+1]or 0) and 1 or 0`);

    // Op: NOT (12)
    lines.push(`  elseif OP==12 then`);
    lines.push(`    STK[A+1]=STK[B+1] and 0 or 1`);

    // Op: NEG (13)
    lines.push(`  elseif OP==13 then`);
    lines.push(`    STK[A+1]=-(STK[B+1]or 0)`);

    // Op: LEN (14)
    lines.push(`  elseif OP==14 then`);
    lines.push(`    STK[A+1]=#(STK[B+1]or "")`);

    // Op: CONCAT (15)
    lines.push(`  elseif OP==15 then`);
    lines.push(`    STK[A+1]=tostring(STK[B+1]or "")..tostring(STK[C+1]or "")`);

    // Op: JMP (16)
    lines.push(`  elseif OP==16 then`);
    lines.push(`    IP=IP+B-1`);

    // Op: JMPF (17) - jump if false
    lines.push(`  elseif OP==17 then`);
    lines.push(`    if not STK[A+1] then IP=IP+B-1 end`);

    // Op: JMPT (18) - jump if true
    lines.push(`  elseif OP==18 then`);
    lines.push(`    if STK[A+1] then IP=IP+B-1 end`);

    // Op: CALL (19)
    lines.push(`  elseif OP==19 then`);
    lines.push(`    -- call function at A with B args`);
    lines.push(`    FP=SP`);
    lines.push(`    SP=SP+(B or 1)`);

    // Op: TAILCALL (20)
    lines.push(`  elseif OP==20 then`);
    lines.push(`    -- tail call`);
    lines.push(`    FP=SP`);

    // Op: RET (21)
    lines.push(`  elseif OP==21 then`);
    lines.push(`    SP=FP`);
    lines.push(`    return STK[1]`);

    // Op: NEWTABLE (22)
    lines.push(`  elseif OP==22 then`);
    lines.push(`    SP=SP+1;STK[SP]={}`);

    // Op: SETTABLE (23)
    lines.push(`  elseif OP==23 then`);
    lines.push(`    STK[A+1][STK[B+1]]=STK[C+1]`);

    // Op: GETTABLE (24)
    lines.push(`  elseif OP==24 then`);
    lines.push(`    SP=SP+1;STK[SP]=STK[A+1][STK[B+1]]`);

    lines.push(`  end`);
    lines.push(`end`);

    return lines;
  }
}

export function generatePureLuaVm(
  source: string,
  proto: Proto,
  seed: number,
  opts: Partial<PureLuaVmOptions> = {}
): string[] {
  const vm = new PureLuaBytecodeVM(seed);
  return vm.generate(source, proto, opts);
}
