import type { BuildRng } from "../engine/crypto/prng";

export interface ControlFlowScramblerOptions {
  seed?: number;
  enabled?: boolean;
}

const OPAQUE_PREDICATES: [number, string, number, number][] = [
  [7, "*", 7, 49],
  [1, "+", 1, 2],
  [15, "*", 15, 225],
  [100, "%", 7, 2],
  [12, "*", 12, 144],
  [3, "^", 2, 9],
];

export interface ControlFlowScramblerRuntime {
  apply: (ast: any, seed: { value: number }) => any;
}

function createOpaquePredicate(index: number): any {
  const [a, op, b, c] = OPAQUE_PREDICATES[index % OPAQUE_PREDICATES.length];
  return {
    type: "BinaryExpression",
    operator: "==",
    left: {
      type: "BinaryExpression",
      operator: op,
      left: { type: "NumberLiteral", value: String(a) },
      right: { type: "NumberLiteral", value: String(b) }
    },
    right: { type: "NumberLiteral", value: String(c) }
  };
}

function wrapWithOpaque(condition: any, seed: { value: number }): any {
  return {
    type: "BinaryExpression",
    operator: "and",
    left: createOpaquePredicate(Math.floor(Math.random() * 6)),
    right: condition
  };
}

function transformExpression(exp: any, seed: { value: number }): any {
  if (!exp) return exp;
  if (exp.type === "BinaryExpression") {
    return { ...exp, left: transformExpression(exp.left, seed), right: transformExpression(exp.right, seed) };
  }
  if (exp.type === "UnaryExpression") {
    return { ...exp, argument: transformExpression(exp.argument, seed) };
  }
  if (exp.type === "CallExpression") {
    return { ...exp, callee: transformExpression(exp.callee, seed), args: exp.args.map((a: any) => transformExpression(a, seed)) };
  }
  if (exp.type === "MethodCallExpression") {
    return { ...exp, object: transformExpression(exp.object, seed), args: exp.args.map((a: any) => transformExpression(a, seed)) };
  }
  if (exp.type === "IndexExpression") {
    return { ...exp, object: transformExpression(exp.object, seed), index: transformExpression(exp.index, seed) };
  }
  if (exp.type === "MemberExpression") {
    return { ...exp, object: transformExpression(exp.object, seed) };
  }
  if (exp.type === "TableConstructor") {
    return { ...exp, fields: exp.fields.map((f: any) => ({ ...f, index: f.index ? transformExpression(f.index, seed) : undefined, value: transformExpression(f.value, seed) })) };
  }
  if (exp.type === "FunctionExpression") {
    return { ...exp, body: exp.body.map((s: any) => transformStatement(s, seed)) };
  }
  if (exp.type === "ParenExpression") {
    return { ...exp, expression: transformExpression(exp.expression, seed) };
  }
  if (exp.type === "IfElseExpression") {
    return { ...exp, condition: transformExpression(exp.condition, seed), thenExp: transformExpression(exp.thenExp, seed), elseExp: transformExpression(exp.elseExp, seed) };
  }
  return exp;
}

function transformStatement(stmt: any, seed: { value: number }): any {
  if (!stmt) return stmt;
  switch (stmt.type) {
    case "IfStatement":
      seed.value++;
      return {
        ...stmt,
        condition: wrapWithOpaque(transformExpression(stmt.condition, seed), seed),
        thenBody: stmt.thenBody.map((s: any) => transformStatement(s, seed)),
        elseifClauses: stmt.elseifClauses?.map((c: any) => {
          seed.value++;
          return {
            condition: wrapWithOpaque(transformExpression(c.condition, seed), seed),
            body: c.body.map((s: any) => transformStatement(s, seed))
          };
        }) || [],
        elseBody: stmt.elseBody?.map((s: any) => transformStatement(s, seed))
      };
    case "WhileStatement":
      seed.value++;
      return {
        ...stmt,
        condition: wrapWithOpaque(transformExpression(stmt.condition, seed), seed),
        body: stmt.body.map((s: any) => transformStatement(s, seed))
      };
    case "RepeatStatement":
      seed.value++;
      return {
        ...stmt,
        body: stmt.body.map((s: any) => transformStatement(s, seed)),
        condition: wrapWithOpaque(transformExpression(stmt.condition, seed), seed)
      };
    case "ForNumericStatement":
    case "ForInStatement":
    case "LocalStatement":
    case "AssignmentStatement":
    case "FunctionCallStatement":
    case "ReturnStatement":
    case "LocalFunctionStatement":
    case "FunctionStatement":
    case "DoStatement":
    case "WhileStatement":
    case "RepeatStatement":
      return { ...stmt, body: stmt.body?.map((s: any) => transformStatement(s, seed)) || [] };
    default:
      return stmt;
  }
}

export function createControlFlowScramblerRuntime(options: { seed?: number; enabled?: boolean } = {}) {
  const enabled = options.enabled !== false;
  const seed = { value: options.seed ?? 0 };

  if (!enabled) return { apply: (ast: any) => ast };

  return {
    apply: (ast: any) => {
      if (!ast || !ast.body) return ast;
      return {
        ...ast,
        body: ast.body.map((s: any) => transformStatement(s, seed))
      };
    }
  };
}

export interface ControlFlowScramblerOptions {
  seed?: number;
  enabled?: boolean;
}

export function createControlFlowScramblerRuntimeModule(options: ControlFlowScramblerOptions = {}) {
  return { createControlFlowScramblerRuntime: (options: ControlFlowScramblerOptions) => ({ apply: (ast: any) => ast }) };
}
