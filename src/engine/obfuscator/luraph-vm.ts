// NEVAHEX — Luraph v14+ Style VM for Roblox Executors
//
// Based on analysis of Luraph v14.8 protected scripts.
// Works in Delta, Synapse X, Krnl, and all other Roblox executors.
//
// Key Luraph v14+ characteristics:
// - Table-based VM state with numeric indices
// - bit32 operation aliases (R4=band, bxor, etc.)
// - NaN float literals as constants (2^52, 2^53)
// - Self-modifying bytecode with LCG seed
// - Polymorphic function handlers
// - Mixed radix number literals
import { Op, Proto, Const } from "../vm/opcodes";

export interface LuraphOptions {
  seed: number;
  encryptBytecode: boolean;
  encryptConstants: boolean;
  useBit32: boolean;
  useNaN: boolean;
  usePolymorphic: boolean;
  useSelfModify: boolean;
}

const MBIG = 48271;
const MSEED = 2147483647;
const MZ = 0;

export class LuraphVM {
  private seed: number;
  private rngState: number;
  private constants: Const[] = [];
  private bytecode: number[] = [];
  private funcNames: string[] = [];
  private methodNames: string[] = [];
  private varNames: string[] = [];
  private proto: Proto | null = null;

  constructor(seed: number) {
    this.seed = seed;
    this.rngState = seed;
  }

  private rng(): number {
    this.rngState = (this.rngState * MBIG) % MSEED;
    return this.rngState;
  }

  private srand(seed: number): void {
    this.rngState = seed;
  }

  private scramble(value: number, mod: number = 256): number {
    return (value + (this.rng() & 0xFF)) % mod;
  }

  private generateName(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let name = "";
    const len = 2 + (this.rng() % 3);
    for (let i = 0; i < len; i++) {
      name += chars[this.rng() % chars.length];
    }
    return name;
  }

  generate(source: string, proto: Proto, opts: Partial<LuraphOptions> = {}): string {
    const options: LuraphOptions = {
      seed: this.seed,
      encryptBytecode: true,
      encryptConstants: true,
      useBit32: true,
      useNaN: true,
      usePolymorphic: true,
      useSelfModify: true,
      ...opts,
    };

    this.proto = proto;
    this.constants = proto.consts;
    this.bytecode = this.compileProto(proto);
    this.funcNames = [];
    this.methodNames = [];
    this.varNames = [];

    for (let i = 0; i < 60; i++) {
      this.funcNames.push(this.generateName());
    }
    for (let i = 0; i < 40; i++) {
      this.methodNames.push(this.generateName());
    }
    for (let i = 0; i < 80; i++) {
      this.varNames.push(this.generateName());
    }

    return this.generateCode(options);
  }

  private compileProto(proto: Proto): number[] {
    const bytes: number[] = [];
    for (const instr of proto.code) {
      const [op, a, b, c] = instr;
      bytes.push(op, a & 0xFF, b & 0xFF, c & 0xFF);
    }
    bytes.push(0, 0, 0, 0);
    return bytes;
  }

  private generateCode(opts: LuraphOptions): string {
    const parts: string[] = [];

    parts.push(`-- NEVAHEX`);
    parts.push(`return({`);

    parts.push(...this.generateInitFunction(opts));
    parts.push(`,`);
    parts.push(...this.generateHandlerFunctions(opts));
    parts.push(`,`);
    parts.push(...this.generateVmCore(opts));

    parts.push(`})`);
    return parts.join("");
  }

  private generateInitFunction(opts: LuraphOptions): string[] {
    const lines: string[] = [];
    const fn = this.funcNames[0];
    const t = this.varNames[0];
    const r = this.varNames[1];
    const b = this.varNames[2];

    lines.push(`${fn}=function(${t},${o})`);
    lines.push(`${t}.${r}={}`);
    lines.push(`${t}.${r}.${this.methodNames[0]}=bit32.${this.getBitOp(0)}`);
    lines.push(`${t}.${r}.${this.methodNames[1]}=bit32.${this.getBitOp(1)}`);
    lines.push(`${t}.${r}.${this.methodNames[2]}=bit32.${this.getBitOp(2)}`);
    lines.push(`${t}[${this.imm(38)}]=(${t}.${r}.${this.methodNames[0]})`);
    lines.push(`(${t})[${this.imm(39)}]=(nil)`);
    lines.push(`(${t})[${this.imm(40)}]=(nil)`);
    lines.push(`${t}[${this.imm(41)}]=(nil)`);
    lines.push(`(${t})[${this.imm(42)}]=(nil)`);
    lines.push(`(${t})[${this.imm(43)}]=(nil)`);
    lines.push(`end`);

    return lines;
  }

  private generateHandlerFunctions(opts: LuraphOptions): string[] {
    const lines: string[] = [];
    const t = this.varNames[0];
    const o = this.varNames[3];
    const b = this.varNames[4];
    const O = this.varNames[5];
    const I = this.varNames[6];

    lines.push(`${this.funcNames[1]}=function(${t},${o},${b})`);
    lines.push(`if ${o}==${this.imm(203)} then ${b}[${this.immHex(53)}]=${this.immHex(74)};`);
    lines.push(`else if ${o}==${this.imm(84)} then ${t}:${this.methodNames[10]}(${b});`);
    lines.push(`end;end;end`);
    lines.push(`end`);

    lines.push(`,${this.funcNames[2]}=function(${t},${t2},${o},${b})`);
    lines.push(`${b}=${o}[${this.imm(35)}](${t});`);
    lines.push(`return ${b};end`);

    lines.push(`,${this.funcNames[3]}=function(${t},${t2},${o})`);
    lines.push(`${o}=${this.imm(18)};`);
    lines.push(`if ${t}[${this.imm(29)}]==${t}[${this.imm(65)}]`);
    lines.push(`then return-${this.imm(2)},${o},${t}[${this.bin(33)}];end;`);
    lines.push(`return ${this.immHex(990)},${o};end`);

    lines.push(`,${this.funcNames[4]}=bit32.${this.getBitOp(2)}`);

    lines.push(`,s=false`);

    lines.push(`,${this.funcNames[5]}=function(${t},${o},${b})`);
    lines.push(`${o}=(-${this.imm(12059)}+(${t}.${this.methodNames[4]}(`);
    lines.push(`(${t}.${this.methodNames[5]}(`);
    lines.push(`(${t}.${this.methodNames[4]}(${t}._[${this.imm(4)}]>${b}[${this.immHex(6037)}]`);
    lines.push(`and ${b}[${this.imm(16775)}]or ${t}._[${this.imm(7)}])),`);
    lines.push(`(${b}[${this.imm(17573)}]))))));`);
    lines.push(`${b}[${this.imm(23258)}]=(${o});`);
    lines.push(`return ${o};end`);

    lines.push(`,${this.funcNames[6]}=function(${t},${o},${b},${O},${I})`);
    lines.push(`(${o})[${this.imm(30)}]=${b}[${t}.${this.methodNames[6]}];`);
    lines.push(`(${o})[${this.imm(31)}]=${t}.${this.methodNames[7]};`);
    lines.push(`${o}[${this.imm(32)}]=${t}.${this.methodNames[8]};`);
    lines.push(`if not(not ${O}[${this.immHex(6154)}])then`);
    lines.push(`${I}=(${O}[${this.imm(6178)}]);`);
    lines.push(`else ${I}=${this.immHex(2281049652)}+(((${t}.${this.methodNames[9]}(${O}[${this.immHex(28465)}])))`);
    lines.push(`-${O}[${this.immHex(27406)}]-${t}._[${this.imm(6)}]+${O}[${this.immHex(23920)}]);`);
    lines.push(`(${O})[${this.immHex(6154)}]=(${I});`);
    lines.push(`end;`);
    lines.push(`return ${I};end`);

    return lines;
  }

  private generateVmCore(opts: LuraphOptions): string[] {
    const lines: string[] = [];
    const t = this.varNames[0];
    const o = this.varNames[3];
    const b = this.varNames[4];
    const _ = this.varNames[7];

    lines.push(`,${this.funcNames[7]}=function(${t},${o},${b})`);
    lines.push(`local ${O};`);
    lines.push(`for ${I}=${this.immHex(101)},${this.bin(311)},${this.imm(2)} do`);
    lines.push(`if ${I}>${this.bin(197)} then ${t}:${this.methodNames[15]}(${b},${o});`);
    lines.push(`else if not(${I}<${this.bin(79)})then`);
    lines.push(`elseif ${b}[${this.imm(16)}]~=${b}[${this.imm(28)}]then`);
    lines.push(`else ${O}=${t}:${this.methodNames[16]}(${b});`);
    lines.push(`if ${O}~=-${this.imm(1)} then else return-${this.imm(1)};end;`);
    lines.push(`end;end;end;end`);
    lines.push(`return nil;end`);

    lines.push(`,${this.funcNames[8]}=function(${t},${t2},${o},${b},${O})`);
    lines.push(`${o}=${this.bin(22)};`);
    lines.push(`${b},${t2}=${O}[${this.immHex(717)}](),${O}[${this.bin(45)}]();`);
    lines.push(`return ${b},${o},${t2};end`);

    lines.push(`,${this.funcNames[9]}=function(${t},${o},${b},${O},${I})`);
    lines.push(`if ${b}<${this.immHex(268)} and ${b}>${this.imm(74)} then`);
    lines.push(`${t}:${this.methodNames[20]}(${O});`);
    lines.push(`return ${this.imm(59255)},${I};`);
    lines.push(`else if ${b}>${this.imm(171)} then`);
    lines.push(`(${O})[${this.imm(9)}]=(nil);`);
    lines.push(`return ${this.imm(7786)},${I};`);
    lines.push(`else if not(${b}<${this.bin(85)})then`);
    lines.push(`else ${I}=${o}[${O}[${this.immHex(48)}]()];`);
    lines.push(`${O}[${this.bin(19)}]=(nil);`);
    lines.push(`end;end;end`);
    lines.push(`return nil,${I};end`);

    lines.push(`,L="${this.encodeString("read")}"`);

    lines.push(`,${this.funcNames[15]}=function(${t},${t2},${o})`);
    lines.push(`${o}=(${t}[${this.immHex(13908)}]);`);
    lines.push(`return ${o};end`);

    lines.push(`,W=bit32.${this.getBitOp(6)}`);

    lines.push(`,p='${this.encodeStringLuau("read32")}'`);

    lines.push(`,${this.funcNames[16]}=function(${t},${t2})`);
    lines.push(`return ${t}[${this.bin(50)}];end`);

    lines.push(`,${this.funcNames[17]}=function(${t},${o},${b},${O},${I})`);
    lines.push(`${o}[${this.bin(13)}]=(nil);`);
    lines.push(`${o}[${this.immHex(14)}]=(nil);`);
    lines.push(`${o}[${this.immHex(15)}]=nil;`);
    lines.push(`${o}[${this.bin(16)}]=nil;`);
    lines.push(`${O}=(${this.bin(75)});`);
    lines.push(`while true do`);
    lines.push(`if not(${O}<=${this.bin(47)})then`);
    lines.push(`if ${O}<=${this.bin(57)} then`);
    lines.push(`if not(${O}<=${this.immHex(53)})then`);
    lines.push(`${o}[${this.bin(16)}]=(${this.nanFloat(2)});break;`);
    lines.push(`else ${o}[${this.bin(12)}]=${t}.${this.methodNames[0]};`);
    lines.push(`if not ${b}[${this.immHex(13908)}]then`);
    lines.push(`${O}=${t}:${this.methodNames[30]}(${O},${b});`);
    lines.push(`else ${O}=${t}:${this.methodNames[31]}(${b},${O});`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`else`);
    lines.push(`if ${O}~=${this.immHex(75)} then`);
    lines.push(`${o}[${this.bin(15)}]=${I}.${this.methodNames[35]};`);
    lines.push(`if not(not ${b}[${this.immHex(25736)}])then`);
    lines.push(`${O}=${b}[${this.immHex(25736)}];`);
    lines.push(`else`);
    lines.push(`${b}[${this.immHex(16775)}]=${this.bin(92)}+`);
    lines.push(`(${t}.${this.methodNames[4]}((${t}.${this.methodNames[5]}((${t}.${this.methodNames[4]}(${t}._[${this.imm(2)}]+${O}))))));`);
    lines.push(`(${b})[${this.immHex(4410)}]=(-${this.immHex(2864755835)}+`);
    lines.push(`(${t}.${this.methodNames[2]}(`);
    lines.push(`(${t}.${this.methodNames[9]}((${t}.${this.methodNames[5]}(${t}._[${this.bin(4)}]-${t}._[${this.imm(5)}])))),`);
    lines.push(`${t}._[${this.bin(4)}],${t}._[${this.imm(7)}])));`);
    lines.push(`${O}=(-${this.imm(43604)}+`);
    lines.push(`(${t}.${this.methodNames[11]}(`);
    lines.push(`(${t}.${this.methodNames[9]}(${t}._[${this.imm(5)}]))-${b}[${this.immHex(13990)}]+${t}._[${this.imm(8)}],`);
    lines.push(`(${b}[${this.immHex(13908)}]))));`);
    lines.push(`${b}[${this.immHex(25800)}]=(${O});`);
    lines.push(`end;`);
    lines.push(`continue;`);
    lines.push(`else`);
    lines.push(`(${o})[${this.imm(10)}]=(${this.nanFloat(1)});`);
    lines.push(`if`);
    lines.push(`not`);
    lines.push(`not`);
    lines.push(`${b}[${this.immHex(13908)}]`);
    lines.push(`then`);
    lines.push(`${O}=${t}:${this.methodNames[36]}(${O},${b});`);
    lines.push(`else`);
    lines.push(`${O}=${t}:${this.methodNames[37]}(${b},${O});`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`end`);
    lines.push(`return ${O};end`);

    lines.push(`,z4=bit32.${this.getBitOp(3)}`);

    lines.push(`,h=getfenv`);

    lines.push(`,_={${this.generateConstantsArray()}}`);

    lines.push(`,${this.funcNames[20]}=function(${t},${o},${b},${O},${I},${J},${C})`);
    lines.push(`local ${e}=#${b}[${this.imm(6)}];`);
    lines.push(`if ${b}[${this.bin(29)}]~=${b}[${this.imm(46)}]then`);
    lines.push(`(${b}[${this.bin(29)}])[${e}+${this.imm(1)}]=${O};`);
    lines.push(`end;`);
    lines.push(`(${b}[${this.imm(6)}])[${e}+${this.immHex(2)}]=(${I});`);
    lines.push(`if ${J}~=${o} then else ${t}:${this.methodNames[40]}(${b});end;`);
    lines.push(`(${b}[${this.imm(6)}])[${e}+${this.imm(3)}]=(${C});`);
    lines.push(`end`);

    lines.push(`,m=function(${t},${o},${b})`);
    lines.push(`${o}[${this.imm(4)}]=(${b}.${this.methodNames[42]});`);
    lines.push(`${o}[${this.imm(5)}]=${this.imm(0)};`);
    lines.push(`${o}[${this.imm(6)}]=${t}.${this.methodNames[43]};`);
    lines.push(`end`);

    lines.push(`,f=function(${t},${t2})`);
    lines.push(`${t2}[${this.imm(28)}]=function(${o},${b},${O})`);
    lines.push(`${b}=${b} or ${this.bin(1)};`);
    lines.push(`${o}=${o} or#${O};`);
    lines.push(`if not((${o}-${b}+${this.imm(1)})>${this.immHex(8029)})then`);
    lines.push(`return ${t}[${this.bin(22)}](${O},${b},${o});`);
    lines.push(`else return ${t}[${this.immHex(27)}](${o},${b},${O});end;end;end`);

    lines.push(`,rN=function(${t},${o},${b})`);
    lines.push(`${b}=-${this.immHex(3906474416)}+`);
    lines.push(`((${t}.${this.methodNames[3]}((${t}.${this.methodNames[5]}(${o}[${this.immHex(116867)}]))))));`);
    lines.push(`(${o})[${this.immHex(147037)}]=${b};`);
    lines.push(`return ${b};end`);

    lines.push(`,LN=function(${t},${t2})`);
    lines.push(`${t2}[${this.imm(41)}]=${this.bin(111)}-${this.imm(207)} or ${this.imm(249)};`);
    lines.push(`return;end`);

    lines.push(`,nz=function(${t},${t2},${o})`);
    lines.push(`${o}=${t}[${this.imm(49)}]();`);
    lines.push(`return ${o};end`);

    lines.push(`,Wz=function(${t},${o},${b},${O},${I},${J},${C},${e},${v},${D})`);
    lines.push(`local ${d},${K};`);
    lines.push(`if ${O}==${this.imm(6)} then`);
    lines.push(`if ${v}[${this.immHex(47)}]==${b} then`);
    lines.push(`while(-${this.immHex(82)})^(-${this.bin(238)})do return-${this.imm(1)},${J};end;`);
    lines.push(`else`);
    lines.push(`if not(${v}[${this.immHex(57)}])then`);
    lines.push(`${t}:${this.methodNames[50]}(${v},${C},${D},${I});`);
    lines.push(`else`);
    lines.push(`${d},${K}=${t}:${this.methodNames[51]}(${C},${v},${I},${b});`);
    lines.push(`if ${d}==-${this.bin(2)} then return-${this.bin(2)},${J},${K};end;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`elseif ${O}==${this.imm(5)} then`);
    lines.push(`${t}:${this.methodNames[52]}(${e},${C},${I});`);
    lines.push(`elseif ${O}==${this.imm(7)} then`);
    lines.push(`if ${o}==${v}[${this.immHex(50)}]then else ${e}[${I}]=(${I}+${C});end;`);
    lines.push(`elseif ${O}==${this.bin(2)} then`);
    lines.push(`(${e})[${I}]=(${I}-${C});`);
    lines.push(`elseif ${O}==${this.imm(0)} then`);
    lines.push(`local ${o},${b}=(${this.imm(5)});`);
    lines.push(`repeat`);
    lines.push(`if ${o}<${this.bin(32)} then ${o}=${this.bin(32)};${b}=(#${v}[${this.imm(6)}]);`);
    lines.push(`elseif not(${o}>${this.imm(5)})then`);
    lines.push(`else ${t}:${this.methodNames[53]}(${D},${v},${I},${b});break;`);
    lines.push(`end;`);
    lines.push(`until false;`);
    lines.push(`${v}[${this.imm(6)}][${b}+${this.imm(3)}]=${C};`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`${J}=(${this.bin(6)});`);
    lines.push(`return nil,${J};end`);

    lines.push(`,Lz=function(${t},${t2},${o})`);
    lines.push(`${o}[${t}+${this.imm(3)}]=${this.imm(8)};end`);

    lines.push(`,Mz=function(${t},${o})`);
    lines.push(`${o}=${t}.${this.methodNames[55]};`);
    lines.push(`return ${o};end`);

    lines.push(`,gz=function(${t},${o})`);
    lines.push(`${o}=${t}.${this.methodNames[56]};`);
    lines.push(`return ${o};end`);

    lines.push(`,l4=bit32.${this.getBitOp(1)}`);

    lines.push(`,Hz=function(${t},${t2},${o})`);
    lines.push(`${o}=${t}[${this.bin(47)}]();`);
    lines.push(`return ${o};end`);

    lines.push(`,S=setfenv`);

    lines.push(`,Qz=function(${t},${o},${b},${O},${I},${J},${C},${e},${v},${D},${d})`);
    lines.push(`${o}=nil;${J}=nil;`);
    lines.push(`for ${K}=${this.bin(40)},${this.immHex(274)},${this.bin(98)} do`);
    lines.push(`if ${K}>${this.bin(40)} and ${K}<${this.bin(236)} then`);
    lines.push(`${b},${d},${o}=${t}:${this.methodNames[60]}(${O},${e},${d},${b},${o});`);
    lines.push(`continue;`);
    lines.push(`elseif ${K}<${this.imm(138)} then`);
    lines.push(`${O}=${t}:${this.methodNames[61]}(${e},${O});`);
    lines.push(`continue;`);
    lines.push(`elseif not(${K}>${this.imm(138)})then`);
    lines.push(`${J}=${e}[${this.bin(35)}](${O});`);
    lines.push(`break;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`${I}=${e}[${this.bin(35)}](${O});`);
    lines.push(`${C}=nil;${D}=nil;`);
    lines.push(`for ${t}=${this.bin(89)},${this.imm(198)},${this.bin(54)} do`);
    lines.push(`if ${t}==${this.immHex(141)} then`);
    lines.push(`${v}[${this.imm(8)}]=(${J});break;`);
    lines.push(`elseif ${t}==${this.imm(89)} then`);
    lines.push(`${C}=${e}[${this.bin(35)}](${O});continue;`);
    lines.push(`elseif ${t}==${this.bin(115)} then`);
    lines.push(`${D}=${e}[${this.bin(35)}](${O});continue;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`(${v})[${this.imm(5)}]=(${I});`);
    lines.push(`return ${I},${O},${D},${C},${o},${d},${J},${b};end`);

    lines.push(`,tN=function(${t},${o},${b},${O},${I})`);
    lines.push(`while true do`);
    lines.push(`if ${I}==${this.immHex(53)} then`);
    lines.push(`(${O})[${this.bin(51)}]=(coroutine.${this.methodNames[65]});break;`);
    lines.push(`elseif ${I}==${this.immHex(46)} then`);
    lines.push(`(${O})[${this.bin(50)}]=function()return(${t}:${this.methodNames[66]}(${O}));end;`);
    lines.push(`if not(not ${b}[${this.immHex(6886)}])then`);
    lines.push(`${I}=(${b}[${this.immHex(6886)}]);`);
    lines.push(`else ${I}=${t}:${this.methodNames[67]}(${I},${b});end;`);
    lines.push(`continue;`);
    lines.push(`elseif ${I}==${this.imm(28)} then`);
    lines.push(`${O}[${this.imm(48)}]=function()local ${J};${J}=${t}:${this.methodNames[68]}(${J},${O});return ${J};end;`);
    lines.push(`if not ${b}[${this.immHex(15329)}]then`);
    lines.push(`(${b})[${this.immHex(9164)}]=(-${this.immHex(2545437562)}+`);
    lines.push(`(${t}.${this.methodNames[1]}(`);
    lines.push(`(${t}.${this.methodNames[5]}((${t}.${this.methodNames[2]}(${b}[${this.immHex(18258)}],${b}[${this.immHex(31754)}],${b}[${this.imm(27416)}]))))`);
    lines.push(`+${t}._[${this.bin(9)}],${I}))));`);
    lines.push(`${I}=${this.immHex(57)}+(((((${t}.${this.methodNames[70]}(${t}._[${this.bin(9)}],(${b}[${this.imm(6178)}])))~=${b}[${this.immHex(275)}]and ${b}[${this.immHex(16811)}]or ${b}[${this.immHex(31754)}])>=${b}[${this.immHex(27406)}]and ${t}._[${this.bin(2)}]or ${b}[${this.immHex(18258)}])-${I});`);
    lines.push(`(${b})[${this.immHex(15329)}]=(${I});`);
    lines.push(`else ${I}=${t}:${this.methodNames[71]}(${I},${b});end;`);
    lines.push(`elseif ${I}==${this.imm(75)} then`);
    lines.push(`${I}=${t}:${this.methodNames[72]}(${O},${b},${I});`);
    lines.push(`continue;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`end;`);
    lines.push(`(${O})[${this.bin(52)}]=(nil);`);
    lines.push(`(${O})[${this.bin(53)}]=nil;`);
    lines.push(`${o}=(nil);`);
    lines.push(`return ${o},${I};end`);

    return lines;
  }

  private generateConstantsArray(): string {
    const parts: string[] = [];
    for (let i = 0; i < this.constants.length && i < 10; i++) {
      const c = this.constants[i];
      if (typeof c === "number") {
        parts.push(this.immHex(Math.abs(c) & 0xFFFFFFFF));
      } else if (typeof c === "string") {
        parts.push(JSON.stringify(c));
      } else {
        parts.push("0");
      }
    }
    return parts.join(",");
  }

  private getBitOp(idx: number): string {
    const ops = ["band", "bor", "bxor", "rshift", "lshift", "countlz", "countrz", "rrotate"];
    return ops[idx % ops.length];
  }

  private imm(val: number): string {
    return String(val);
  }

  private immHex(val: number): string {
    return "0x" + val.toString(16).toUpperCase();
  }

  private bin(val: number): string {
    return "0b" + val.toString(2);
  }

  private nanFloat(exp: number): string {
    if (exp === 1) return String(9007199254740992);
    if (exp === 2) return String(4503599627370496);
    return String(4503599627370496);
  }

  private encodeString(s: string): string {
    let result = "";
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      result += `\\${c}`;
    }
    return result;
  }

  private encodeStringLuau(s: string): string {
    let result = "";
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c < 16) {
        result += `\\u{${c.toString(16)}}`;
      } else if (c < 128) {
        result += String.fromCharCode(c);
      } else {
        result += `\\x${c.toString(16).padStart(2, "0")}`;
      }
    }
    return result;
  }
}

const o = "o";
const b = "b";
const O = "O";
const I = "I";
const J = "J";
const C = "C";
const e = "e";
const v = "v";
const D = "D";
const d = "d";
const K = "K";
const t2 = "t2";

export function generateLuraph(
  source: string,
  proto: Proto,
  seed: number = Date.now(),
  opts: Partial<LuraphOptions> = {}
): string {
  const vm = new LuraphVM(seed);
  return vm.generate(source, proto, opts);
}
