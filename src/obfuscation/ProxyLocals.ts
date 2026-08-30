import type { BuildRng } from "../engine/crypto/prng";

export interface ProxyLocalsOptions {
  literalType?: "dictionary" | "number" | "string" | "any";
}

export interface LocalMetatableInfo {
  valueName: string;
  setValue: { key: string; constructor: (expr: any, literal: any) => any };
  getValue: { key: string; constructor: (expr: any, literal: any) => any };
  locked?: boolean;
}

const METATABLE_EXPRESSIONS: Array<{ constructor: string; key: string }> = [
  { constructor: "add", key: "__add" },
  { constructor: "sub", key: "__sub" },
  { constructor: "index", key: "__index" },
  { constructor: "mul", key: "__mul" },
  { constructor: "div", key: "__div" },
  { constructor: "pow", key: "__pow" },
  { constructor: "concat", key: "__concat" }
];

function callNameGenerator(rng: BuildRng, max: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[rng.int(chars.length)];
  }
  return result;
}

export interface ProxyLocalsOptions {
  literalType?: "dictionary" | "number" | "string" | "any";
}

export interface ProxyLocalsRuntime {
  apply: (ast: any, pipeline: any) => any;
}

export function createProxyLocalsRuntime(options: any = {}): ProxyLocalsRuntime {
  return {
    apply: (ast: any, pipeline: any) => ast
  };
}

export interface ProxyLocalsOptions {
  literalType?: "dictionary" | "number" | "string" | "any";
}

export function createProxyLocalsRuntimeModule(options: any = {}) {
  return { createProxyLocalsRuntime: (options: any) => ({ apply: (ast: any) => ast }) };
}
