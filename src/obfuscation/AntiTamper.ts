import type { BuildRng } from "../engine/crypto/prng";

export interface AntiTamperOptions {
  useDebug?: boolean;
}

export interface AntiTamperRuntime {
  apply: (ast: any, pipeline: any) => any;
}

export function createAntiTamperRuntime(options: any = {}): AntiTamperRuntime {
  return {
    apply: (ast: any, pipeline: any) => ast
  };
}

export interface AntiTamperOptions {
  useDebug?: boolean;
}

export function createAntiTamperRuntimeModule(options: any = {}) {
  return { createAntiTamperRuntime: (options: any) => ({ apply: (ast: any) => ast }) };
}
