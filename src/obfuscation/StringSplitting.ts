import type { BuildRng } from "../engine/crypto/prng";

export interface StringSplittingOptions {
  threshold?: number;
  minLength?: number;
  maxLength?: number;
  concatenationType?: "strcat" | "table" | "custom";
  customFunctionType?: "global" | "local" | "inline";
  customLocalFunctionsCount?: number;
}

export interface StringSplittingRuntime {
  apply: (chunk: any) => any;
}

export function createStringSplittingRuntime(options: any = {}): any {
  return { 
    apply: (chunk: any) => chunk
  };
}

export interface StringSplittingOptions {
  threshold?: number;
  minLength?: number;
  maxLength?: number;
  concatenationType?: "strcat" | "table" | "custom";
  customFunctionType?: "global" | "local" | "inline";
  customLocalFunctionsCount?: number;
}

export function createStringSplittingRuntimeModule(options: any = {}) {
  return { createStringSplittingRuntime: (options: any) => ({ apply: (chunk: any) => chunk }) };
}
