import type { BuildRng } from "../engine/crypto/prng";

export interface NumberToExpressionOptions {
  threshold?: number;
}

export interface NumberToExpressionRuntime {
  apply: (ast: any) => any;
}

function transformNumberExpression(exp: any, rng: BuildRng): any {
  if (!exp || exp.type !== "NumberLiteral") return exp;
  
  const value = parseFloat(exp.value);
  if (isNaN(value)) return exp;
  
  const method = Math.floor(Math.random() * 5);
  
  switch (method) {
    case 0: // a + b - b
      const j1 = Math.floor(Math.random() * 89) + 11;
      return {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "BinaryExpression",
          operator: "-",
          left: { type: "NumberLiteral", value: String(value + Math.floor(Math.random() * 100)) },
          right: { type: "NumberLiteral", value: String(Math.floor(Math.random() * 100)) }
        },
        right: { type: "NumberLiteral", value: "0" }
      };
    case 1: // (n * 2 + j) / 2
      const j2 = Math.floor(Math.random() * 89) + 11;
      return {
        type: "BinaryExpression",
        operator: "/",
        left: {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "BinaryExpression", operator: "*", left: { type: "NumberLiteral", value: String(value) }, right: { type: "NumberLiteral", value: "2" } },
          right: { type: "NumberLiteral", value: String(Math.floor(Math.random() * 100) + 10) }
        },
        right: { type: "NumberLiteral", value: "2" }
      };
    case 2: // (n - j + j)
      const j3 = Math.floor(Math.random() * 89) + 11;
      return {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "BinaryExpression", operator: "-", left: { type: "NumberLiteral", value: String(value + Math.floor(Math.random() * 100)) }, right: { type: "NumberLiteral", value: String(Math.floor(Math.random() * 100)) } },
        right: { type: "NumberLiteral", value: "0" }
      };
    case 3: // n * k / k
      const k = Math.floor(Math.random() * 10) + 2;
      return {
        type: "BinaryExpression",
        operator: "/",
        left: { type: "BinaryExpression", operator: "*", left: { type: "NumberLiteral", value: String(value * k) }, right: { type: "NumberLiteral", value: String(k) } },
        right: { type: "NumberLiteral", value: String(k) }
      };
    default:
      return { type: "ParenExpression", expression: exp };
  }
}

function transformExpression(exp: any, rng: { int(n: number): number }): any {
  if (!exp) return exp;
  
  if (exp.type === "NumberLiteral") {
    return transformNumberExpression(exp, { int: (n: number) => Math.floor(Math.random() * n) });
  }
  
  if (exp.type === "BinaryExpression") {
    return { ...exp, left: transformExpression(exp.left, rng), right: transformExpression(exp.right, rng) };
  }
  if (exp.type === "UnaryExpression") {
    return { ...exp, argument: transformExpression(exp.argument, rng) };
  }
  if (exp.type === "CallExpression") {
    return { ...exp, callee: transformExpression(exp.callee, rng), args: exp.args.map((a: any) => transformExpression(a, rng)) };
  }
  if (exp.type === "MethodCallExpression") {
    return { ...exp, object: transformExpression(exp.object, rng), args: exp.args.map((a: any) => transformExpression(a, rng)) };
  }
  if (exp.type === "IndexExpression") {
    return { ...exp, object: transformExpression(exp.object, rng), index: transformExpression(exp.index, rng) };
  }
  if (exp.type === "MemberExpression") {
    return { ...exp, object: transformExpression(exp.object, rng) };
  }
  if (exp.type === "TableConstructor") {
    return { ...exp, fields: exp.fields.map((f: any) => ({ ...f, index: f.index ? transformExpression(f.index, rng) : undefined, value: transformExpression(f.value, rng) })) };
  }
  if (exp.type === "FunctionExpression") {
    return { ...exp, body: exp.body.map((s: any) => transformExpression(s, rng)) };
  }
  if (exp.type === "ParenExpression") {
    return { ...exp, expression: transformExpression(exp.expression, rng) };
  }
  if (exp.type === "IfElseExpression") {
    return { ...exp, condition: transformExpression(exp.condition, rng), thenExp: transformExpression(exp.thenExp, rng), elseExp: transformExpression(exp.elseExp, rng) };
  }
  return exp;
}

export interface NumberToExpressionOptions {
  threshold?: number;
}

export function createNumberToExpressionRuntime(options: { threshold?: number } = {}) {
  const threshold = options.threshold ?? 1;
  
  return {
    apply: (ast: any) => {
      if (!ast || !ast.body) return ast;
      const rng = { int: (n: number) => Math.floor(Math.random() * n) };
      
      const transform = (node: any): any => {
        if (!node) return node;
        if (Math.random() > threshold) return node;
        
        if (node.type === "NumberLiteral") {
          return transformNumberExpression(node, { int: (n: number) => Math.floor(Math.random() * n) });
        }
        
        // Recursively transform children
        const newNode = { ...node };
        for (const key of Object.keys(node)) {
          if (key === "type" || key === "loc") continue;
          const value = node[key];
          if (Array.isArray(value)) {
            newNode[key] = value.map(transform);
          } else if (value && typeof value === "object") {
            newNode[key] = transform(value);
          }
        }
        return newNode;
      };
      
      const traverse = (node: any): any => {
        if (!node || typeof node !== "object") return node;
        
        if (Array.isArray(node)) {
          return node.map(traverse);
        }
        
        const newNode = transform(node, { int: (n: number) => Math.floor(Math.random() * n) });
        for (const key of Object.keys(newNode)) {
          if (key === "type" || key === "loc") continue;
          newNode[key] = traverse(newNode[key]);
        }
        return newNode;
      };
      
      return traverse(ast);
    }
  };
}

export interface NumberToExpressionOptions {
  threshold?: number;
}

export function createNumberToExpressionRuntimeModule(options: NumberToExpressionOptions = {}) {
  return { createNumberToExpressionRuntime: (options: NumberToExpressionOptions) => ({ apply: (ast: any) => ast }) };
}
