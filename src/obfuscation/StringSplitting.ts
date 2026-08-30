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
  apply: (ast: any, pipeline: any) => any;
}

function generateStrCatNode(chunks: string[]): any {
  let generatedNode: any = null;
  for (const chunk of chunks) {
    if (generatedNode) {
      generatedNode = { type: "StrCatExpression", left: generatedNode, right: { type: "StringExpression", value: chunk } };
    } else {
      generatedNode = { type: "StringExpression", value: chunk };
    }
  }
  return generatedNode;
}

function generateTableConcatNode(chunks: string[], data: any): any {
  const chunkNodes = chunks.map(chunk => ({ type: "TableEntry", value: { type: "StringExpression", value: chunk } }));
  return {
    type: "FunctionCallExpression",
    callee: { type: "VariableExpression", scope: data.tableConcatScope, id: data.tableConcatId },
    args: [{ type: "TableConstructorExpression", fields: chunks.map((chunk, i) => ({ type: "TableEntry", value: { type: "StringExpression", value: chunk })) }]
  };
}

const custom1Code = `
function custom(table)
    local stringTable, str = table[#table], "";
    for i=1,#stringTable, 1 do
        str = str .. stringTable[table[i]];
    end
    return str
end
`;

const custom2Code = `
function custom(tb)
    local str = "";
    for i=1, #tb / 2, 1 do
        str = str .. tb[#tb / 2 + tb[i]];
    end
    return str
end
`;

function generateCustomNodeArgs(chunks: string[], data: any, variant: number): any[] {
  const shuffledIndices = Array.from({ length: chunks.length }, (_, i) => i);
  for (let i = chunks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
  }

  const shuffled = shuffledIndices.map(i => chunks[i]);

  if (variant === 1) {
    const args = shuffledIndices.map(v => ({ type: "TableEntry", value: { type: "NumberExpression", value: v } }));
    const tbNodes = shuffled.map(chunk => ({ type: "TableEntry", value: { type: "StringExpression", value: chunk } }));
    return [{ type: "TableConstructorExpression", fields: args }, { type: "TableConstructorExpression", fields: shuffled.map(chunk => ({ type: "TableEntry", value: { type: "StringExpression", value: chunk })) } )];
  } else {
    const args: any[] = [];
    for (let i = 0; i < chunks.length; i++) {
      args.push({ type: "TableEntry", value: { type: "NumberExpression", value: shuffledIndices[i] } });
      args.push({ type: "TableEntry", value: { type: "StringExpression", value: chunks[i] } });
    }
    return [{ type: "TableConstructorExpression", fields: args }];
  }
}

function generateCustomFunctionLiteral(parentScope: any, variant: number): any {
  const code = variant === 1 ? `
function custom(table)
    local stringTable, str = table[#table], "";
    for i=1,#stringTable, 1 do
        str = str .. stringTable[table[i]];
    end
    return str
end
` : `
function custom(tb)
    local str = "";
    for i=1, #tb / 2, 1 do
        str = str .. tb[#tb / 2 + tb[i]];
    end
    return str
end
`;
  return {
    type: "FunctionLiteralExpression",
    params: [{ type: "Param", name: "table" }, { type: "Param", name: "str" }],
    body: { type: "Block", statements: [] }
  };
}

export function createStringSplittingRuntime(options: {
  threshold?: number;
  minLength?: number;
  maxLength?: number;
  concatenationType?: "strcat" | "table" | "custom";
  customFunctionType?: "global" | "local" | "inline";
  customLocalFunctionsCount?: number;
} = {}) {
  const threshold = options.threshold ?? 1;
  const minLength = options.minLength ?? 5;
  const maxLength = options.maxLength ?? 5;
  const concatenationType = options.concatenationType || "custom";
  const customFunctionType = options.customFunctionType || "global";
  const customLocalFunctionsCount = options.customLocalFunctionsCount ?? 2;

  return {
    apply: (ast: any, pipeline: any) => {
      return ast;
    }
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

export function createStringSplittingRuntimeModule(options: { threshold?: number; minLength?: number; maxLength?: number; concatenationType?: "strcat" | "table" | "custom"; customFunctionType?: "global" | "local" | "inline"; customLocalFunctionsCount?: number } = {}) {
  return { createStringSplittingRuntime: (options: any) => ({ apply: (ast: any) => ast }) };
}
