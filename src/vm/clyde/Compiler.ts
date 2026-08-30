import { BytecodeChunk } from "./vm-gen";

export function compileString(source: string): BytecodeChunk {
  return { opcodes: [], constants: [] };
}

export function compileAST(ast: any): BytecodeChunk {
  return { opcodes: [], constants: [] };
}

export function compileClydeAST(ast: any): BytecodeChunk {
  return { opcodes: [], constants: [] };
}
