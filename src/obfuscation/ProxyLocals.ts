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

function generateLocalMetatableInfo(rng: BuildRng, pipelineNameGenerator: (max: number) => string): LocalMetatableInfo {
  const usedOps = new Set<string>();
  const info: LocalMetatableInfo = { 
    valueName: "", 
    setValue: { key: "", constructor: () => "" }, 
    getValue: { key: "", constructor: () => "" } 
  };
  
  for (const v of ["setValue", "getValue", "index"]) {
    let rop: { constructor: string; key: string };
    do {
      rop = METATABLE_EXPRESSIONS[Math.floor(Math.random() * METATABLE_EXPRESSIONS.length)];
    } while (usedOps.has(JSON.stringify(rop)));
    usedOps.add(JSON.stringify(rop));
    (info as any)[v] = rop;
  }

  info.valueName = callNameGenerator({ int: (n: number) => Math.floor(Math.random() * n) }, 4096);
  return info;
}

export interface ProxyLocalsOptions {
  literalType?: "dictionary" | "number" | "string" | "any";
}

export interface ProxyLocalsRuntime {
  createAssignmentExpression: (info: LocalMetatableInfo, expr: any, parentScope: any) => any;
  CreateAssignmentExpression: (info: LocalMetatableInfo, expr: any, parentScope: any) => any;
  getLocalMetatableInfo: (scope: any, id: string) => any;
  disableMetatableInfo: (scope: any, id: string) => void;
  apply: (ast: any, pipeline: any) => any;
}

export function createProxyLocalsRuntime(options: ProxyLocalsOptions = {}) {
  const literalType = options.literalType || "string";
  const localMetatableInfos: Map<any, Map<string, LocalMetatableInfo>> = new Map();
  let setMetatableVarScope: any;
  let setMetatableVarId: string;
  let emptyFunctionScope: any;
  let emptyFunctionId: string;
  let emptyFunctionUsed = false;

  function generateLocalMetatableInfo(rng: { int(n: number): number }, pipelineNameGenerator: (max: number) => string): LocalMetatableInfo {
    const usedOps = new Set<string>();
    const info: LocalMetatableInfo = { 
      valueName: "", 
      setValue: { key: "", constructor: () => "" }, 
      getValue: { key: "", constructor: () => "" } 
    };
    
    for (const v of ["setValue", "getValue", "index"]) {
      let rop: { constructor: string; key: string };
      do {
        rop = METATABLE_EXPRESSIONS[Math.floor(Math.random() * METATABLE_EXPRESSIONS.length)];
      } while (usedOps.has(JSON.stringify(rop)));
      usedOps.add(JSON.stringify(rop));
      (info as any)[v] = rop;
    }

    info.valueName = callNameGenerator({ int: (n: number) => Math.floor(Math.random() * n) }, 4096);
    return info;
  }

  function createAssignmentExpression(info: LocalMetatableInfo, expr: any, parentScope: any): any {
    const metatableVals: any[] = [];

    const setValueFunctionScope = parentScope;
    const setValueSelf = "self";
    const setValueArg = "val";
    const setvalueFunctionLiteral: any = {
      type: "FunctionLiteralExpression",
      params: ["self", "val"],
      body: {
        type: "Block",
        statements: [{
          type: "AssignmentStatement",
          lhs: [{ type: "AssignmentIndexing", object: { type: "VariableExpression", name: "self" }, index: { type: "StringExpression", value: info.valueName } }],
          rhs: [{ type: "VariableExpression", name: "val" }]
        }]
      };
    metatableVals.push({ key: info.setValue.key, value: setvalueFunctionLiteral });

    const getValueFunctionScope: any = {};
    const getValueIdxExpr = info.getValue.key === "__index" || info.setValue.key === "__index"
      ? { type: "FunctionCallExpression", callee: { type: "VariableExpression", name: "rawget" }, args: [{ type: "VariableExpression", name: "self" }, { type: "StringExpression", value: info.valueName }] }
      : { type: "IndexExpression", object: { type: "VariableExpression", name: "self" }, index: { type: "StringExpression", value: info.valueName } };
    
    const getvalueFunctionLiteral: any = {
      type: "FunctionLiteralExpression",
      params: ["self", "arg"],
      body: {
        type: "Block",
        statements: [{
          type: "ReturnStatement",
          values: [getValueIdxExpr]
        }]
      }
    };
    metatableVals.push({ key: info.getValue.key, value: getvalueFunctionLiteral });

    return {
      type: "FunctionCallExpression",
      callee: { type: "VariableExpression", name: "setmetatable" },
      args: [
        { type: "TableConstructorExpression", fields: [{ key: info.valueName, value: expr }] },
        { type: "TableConstructorExpression", fields: metatableVals }
      ];
  }

  const localMetatableInfos: Map<any, Map<string, LocalMetatableInfo>> = new Map();
  let setMetatableVarScope: any;
  let setMetatableVarId: string;
  let emptyFunctionScope: any;
  let emptyFunctionId: string;
  let emptyFunctionUsed = false;

  function generateLocalMetatableInfo(rng: { int(n: number): number }, pipelineNameGenerator: (max: number) => string): LocalMetatableInfo {
    const usedOps = new Set<string>();
    const info: LocalMetatableInfo = { 
      valueName: "", 
      setValue: { key: "", constructor: () => "" }, 
      getValue: { key: "", constructor: () => "" } 
    };
    
    for (const v of ["setValue", "getValue", "index"]) {
      let rop: { constructor: string; key: string };
      do {
        rop = METATABLE_EXPRESSIONS[Math.floor(Math.random() * METATABLE_EXPRESSIONS.length)];
      } while (usedOps.has(JSON.stringify(rop)));
      usedOps.add(JSON.stringify(rop));
      (info as any)[v] = rop;
    }

    info.valueName = callNameGenerator({ int: (n: number) => Math.floor(Math.random() * n) }, 4096);
    return info;
  }

  function createAssignmentExpression(info: LocalMetatableInfo, expr: any, parentScope: any): any {
    const metatableVals: any[] = [];

    const setValueFunctionScope = parentScope;
    const setValueSelf = "self";
    const setValueArg = "val";
    const setvalueFunctionLiteral: any = {
      type: "FunctionLiteralExpression",
      params: ["self", "val"],
      body: {
        type: "Block",
        statements: [{
          type: "AssignmentStatement",
          lhs: [{ type: "AssignmentIndexing", object: { type: "VariableExpression", name: "self" }, index: { type: "StringExpression", value: info.valueName } }],
          rhs: [{ type: "VariableExpression", name: "val" }]
        }]
      };
    metatableVals.push({ key: info.setValue.key, value: setvalueFunctionLiteral });

    const getValueFunctionScope: any = {};
    const getValueIdxExpr = info.getValue.key === "__index" || info.setValue.key === "__index"
      ? { type: "FunctionCallExpression", callee: { type: "VariableExpression", name: "rawget" }, args: [{ type: "VariableExpression", name: "self" }, { type: "StringExpression", value: info.valueName }] }
      : { type: "IndexExpression", object: { type: "VariableExpression", name: "self" }, index: { type: "StringExpression", value: info.valueName } };
    
    const getvalueFunctionLiteral: any = {
      type: "FunctionLiteralExpression",
      params: ["self", "arg"],
      body: {
        type: "Block",
        statements: [{
          type: "ReturnStatement",
          values: [getValueIdxExpr]
        }]
      }
    };
    metatableVals.push({ key: info.getValue.key, value: getvalueFunctionLiteral });

    return {
      type: "FunctionCallExpression",
      callee: { type: "VariableExpression", name: "setmetatable" },
      args: [
        { type: "TableConstructorExpression", fields: [{ key: info.valueName, value: expr }] },
        { type: "TableConstructorExpression", fields: metatableVals }
      ];
  }

  return {
    createAssignmentExpression,
    CreateAssignmentExpression: createAssignmentExpression,
    getLocalMetatableInfo: (scope: any, id: string) => {
      if (!scope || scope.isGlobal) return null;
      const scopeInfos = localMetatableInfos.get(scope);
      if (!scopeInfos || !scopeInfos.has(id)) return null;
      const info = scopeInfos.get(id);
      if (info.locked) return null;
      return info;
    },
    disableMetatableInfo: (scope: any, id: string) => {
      if (!scope || scope.isGlobal) return;
      const scopeInfos = localMetatableInfos.get(scope);
      if (scopeInfos) scopeInfos.set(id, { locked: true });
    },
    apply: (ast: any, pipeline: any) => ast
  };
}

export interface ProxyLocalsOptions {
  literalType?: "dictionary" | "number" | "string" | "any";
}

export function createProxyLocalsRuntimeModule(options: ProxyLocalsOptions = {}) {
  return { createProxyLocalsRuntime: (options: ProxyLocalsOptions) => ({ apply: (ast: any) => ast }) };
}
