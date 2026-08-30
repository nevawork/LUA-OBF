import type { BuildRng } from "../engine/crypto/prng";

export interface ConstantArrayOptions {
  threshold?: number;
  stringsOnly?: boolean;
  shuffle?: boolean;
  rotate?: boolean;
  encoding?: "none" | "base64" | "base85" | "mixed";
  localWrapperThreshold?: number;
  localWrapperCount?: number;
  localWrapperArgCount?: number;
  maxWrapperOffset?: number;
}

export interface LocalWrapperInfo {
  id: string;
  argPos: number;
  offset: number;
  name: string;
  used: boolean;
}

export interface ConstantArrayRuntime {
  apply: (chunk: any) => any;
  encode: (str: string) => string;
  addDecodeCode: (rng: BuildRng) => string;
  generatePrefixes: () => [string, string];
}

export function createConstantArrayRuntime(options: any = {}): any {
  return { 
    apply: (chunk: any) => chunk,
    encode: (str: string) => str,
    addDecodeCode: (rng: any) => "",
    generatePrefixes: () => ["", ""] 
  };
}

export interface ConstantArrayOptions {
  threshold?: number;
  stringsOnly?: boolean;
  shuffle?: boolean;
  rotate?: boolean;
  encoding?: "none" | "base64" | "base85" | "mixed";
  localWrapperThreshold?: number;
  localWrapperCount?: number;
  localWrapperArgCount?: number;
  maxWrapperOffset?: number;
}

export interface LocalWrapperInfo {
  id: string;
  argPos: number;
  offset: number;
  name: string;
  used: boolean;
}

export function createConstantArrayRuntimeModule(options: any = {}) {
  return { createConstantArrayRuntime: (options: any) => ({ apply: (chunk: any) => chunk }) };
}
