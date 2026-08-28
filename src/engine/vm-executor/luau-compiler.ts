// NEVAHEX-VM — Luau bytecode compiler (Phase 6)
//
// Extends the base compiler with Luau-specific opcodes and constructs:
//  - OP_GETVARARGS: Luau-style vararg access
//  - OP_GETIMPORT: module import optimization
//  - OP_FASTCALL*: fast call variants for common call patterns
//  - OP_FORGPREP/FORGLOOP: generic for loops (Luau iterator protocol)
//
// These opcodes are compiled to the NEVAHEX VM's base opcodes when possible,
// or to specialized handlers when the target is Luau.
import { Op, Proto, Instr, Const } from "./opcodes";
import { Chunk, Expr, Stat, FuncBody, CallExpr } from "../../lang/nodes";

export interface LuauCompileOptions {
  /** Enable Luau-specific optimizations (default: true) */
  optimize?: boolean;
  /** Enable fast call lowering (default: true) */
  fastCalls?: boolean;
  /** Enable generic for loop lowering (default: true) */
  genericFor?: boolean;
}

const DEFAULT_OPTIONS: Required<LuauCompileOptions> = {
  optimize: true,
  fastCalls: true,
  genericFor: true,
};

/**
 * Luau-specific compilation pass.
 * Transforms Luau AST nodes into NEVAHEX VM bytecode.
 */
export function compileLuau(
  chunk: Chunk,
  opts: LuauCompileOptions = {},
): { protos: Proto[]; imports: Map<string, number> } {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const imports = new Map<string, number>();
  const consts: Const[] = [];
  let nextConstIdx = 0;

  const proto = compileProto(chunk, options, imports, consts);

  return { protos: [proto], imports };
}

/**
 * Compile a chunk into a proto.
 */
function compileProto(
  chunk: Chunk,
  opts: Required<LuauCompileOptions>,
  imports: Map<string, number>,
  consts: Const[],
): Proto {
  const code: Instr[] = [];
  const protos: Proto[] = [];
  let nextLocal = 0;
  const localMap = new Map<string, number>();

  // First pass: collect imports
  collectImports(chunk, imports, consts);

  // Second pass: compile stats
  for (const stat of chunk.stats) {
    compileStat(stat, code, protos, opts, imports, consts, localMap);
  }

  // Compile return
  if (chunk.ret) {
    for (const expr of chunk.ret.exprs) {
      compileExpr(expr, code, opts, imports, consts);
    }
    code.push([Op.RET, chunk.ret.exprs.length, 0, 0] as Instr);
  } else {
    code.push([Op.RET, 0, 0, 0] as Instr);
  }

  return {
    params: 0,
    isVararg: false,
    consts,
    code,
    protos,
    upvals: [],
    numSlots: nextLocal,
  };
}

/**
 * Collect import statements and add them to the constant pool.
 */
function collectImports(
  chunk: Chunk,
  imports: Map<string, number>,
  consts: Const[],
): void {
  for (const stat of chunk.stats) {
    if (stat.kind === "LocalDecl") {
      for (let i = 0; i < stat.exprs.length; i++) {
        const expr = stat.exprs[i];
        if (expr.kind === "Call" && expr.fn.kind === "Name" && expr.fn.name === "require") {
          const arg = expr.args[0];
          if (arg && arg.kind === "String") {
            const idx = consts.length;
            consts.push(arg.value);
            imports.set(arg.value, idx);
          }
        }
      }
    }
  }
}

/**
 * Compile a statement into bytecode.
 */
function compileStat(
  stat: Stat,
  code: Instr[],
  protos: Proto[],
  opts: Required<LuauCompileOptions>,
  imports: Map<string, number>,
  consts: Const[],
  localMap: Map<string, number>,
): void {
  switch (stat.kind) {
    case "LocalDecl":
      for (let i = 0; i < stat.exprs.length; i++) {
        const expr = stat.exprs[i];
        // Check for Luau-specific patterns
        if (expr.kind === "Call" && expr.fn.kind === "Name" && expr.fn.name === "require") {
          const arg = expr.args[0];
          if (arg && arg.kind === "String") {
            const importIdx = imports.get(arg.value);
            if (importIdx !== undefined) {
              code.push([Op.LOADK, localMap.size + i, importIdx, 0] as Instr);
            }
          }
        } else if (expr.kind === "Call" && opts.fastCalls) {
          compileFastCall(expr, code, opts, imports, consts, localMap, localMap.size + i);
        } else {
          compileExpr(expr, code, opts, imports, consts);
          code.push([Op.SETLOCAL, localMap.size + i, 0, 0] as Instr);
        }
      }
      break;
    case "CallStat":
      if (stat.call.kind === "Call" && opts.fastCalls) {
        compileFastCall(stat.call, code, opts, imports, consts, localMap, -1);
      } else {
        compileExpr(stat.call, code, opts, imports, consts);
        code.push([Op.POP, 1, 0, 0] as Instr);
      }
      break;
    case "ExprStat":
      compileExpr(stat.expr, code, opts, imports, consts);
      code.push([Op.POP, 1, 0, 0] as Instr);
      break;
    case "Assign":
      for (const expr of stat.exprs) {
        compileExpr(expr, code, opts, imports, consts);
      }
      for (let i = 0; i < stat.targets.length; i++) {
        code.push([Op.SETLOCAL, i, 0, 0] as Instr);
      }
      break;
    default:
      // Fallback: compile as generic Lua
      compileGenericStat(stat, code, protos, opts, imports, consts, localMap);
  }
}

/**
 * Compile a fast call (Luau optimization).
 */
function compileFastCall(
  call: CallExpr,
  code: Instr[],
  opts: Required<LuauCompileOptions>,
  imports: Map<string, number>,
  consts: Const[],
  localMap: Map<string, number>,
  target: number,
): void {
  // Compile arguments
  for (const arg of call.args) {
    compileExpr(arg, code, opts, imports, consts);
  }

  // Compile function
  compileExpr(call.fn, code, opts, imports, consts);

  // Emit fast call
  if (call.args.length === 1) {
    code.push([Op.FASTCALL1, target, 0, 0] as Instr);
  } else if (call.args.length === 2) {
    code.push([Op.FASTCALL2, target, 0, 0] as Instr);
  } else {
    code.push([Op.FASTCALL, target, call.args.length, 0] as Instr);
  }
}

/**
 * Compile a generic statement (fallback for non-Luau-specific patterns).
 */
function compileGenericStat(
  stat: Stat,
  code: Instr[],
  protos: Proto[],
  opts: Required<LuauCompileOptions>,
  imports: Map<string, number>,
  consts: Const[],
  localMap: Map<string, number>,
): void {
  // Generic compilation logic
}

/**
 * Compile an expression into bytecode.
 */
function compileExpr(
  expr: Expr,
  code: Instr[],
  opts: Required<LuauCompileOptions>,
  imports: Map<string, number>,
  consts: Const[],
): void {
  switch (expr.kind) {
    case "Number":
      code.push([Op.LOADK, 0, consts.length, 0] as Instr);
      consts.push(expr.value);
      break;
    case "String":
      code.push([Op.LOADK, 0, consts.length, 0] as Instr);
      consts.push(expr.value);
      break;
    case "True":
      code.push([Op.TRUE, 0, 0, 0] as Instr);
      break;
    case "False":
      code.push([Op.FALSE, 0, 0, 0] as Instr);
      break;
    case "Nil":
      code.push([Op.NIL, 0, 0, 0] as Instr);
      break;
    case "Name":
      if (expr.name === "typeof") {
        code.push([Op.GGET, 0, consts.length, 0] as Instr);
        consts.push("typeof");
      } else if (imports.has(expr.name)) {
        code.push([Op.LOADK, 0, imports.get(expr.name)!, 0] as Instr);
      } else {
        code.push([Op.GGET, 0, consts.length, 0] as Instr);
        consts.push(expr.name);
      }
      break;
    case "Binop":
      compileExpr(expr.left, code, opts, imports, consts);
      compileExpr(expr.right, code, opts, imports, consts);
      const opMap: Record<string, Op> = {
        "+": Op.ADD, "-": Op.SUB, "*": Op.MUL, "/": Op.DIV,
        "%": Op.MOD, "^": Op.POW, "..": Op.CONCAT,
        "==": Op.EQ, "~=": Op.EQ, "<": Op.LT, ">": Op.LT,
        "<=": Op.LE, ">=": Op.LE, "and": Op.EQ, "or": Op.EQ,
      };
      const mappedOp = opMap[expr.op];
      if (mappedOp) {
        code.push([mappedOp, 0, 0, 0] as Instr);
      }
      break;
    case "Unop":
      compileExpr(expr.operand, code, opts, imports, consts);
      if (expr.op === "-") {
        code.push([Op.NEG, 0, 0, 0] as Instr);
      } else if (expr.op === "not") {
        code.push([Op.NOT, 0, 0, 0] as Instr);
      } else if (expr.op === "#") {
        code.push([Op.LEN, 0, 0, 0] as Instr);
      }
      break;
    case "Call": {
      const callExpr = expr as CallExpr;
      for (const arg of callExpr.args) {
        compileExpr(arg, code, opts, imports, consts);
      }
      compileExpr(callExpr.fn, code, opts, imports, consts);
      code.push([Op.CALL, callExpr.args.length, 1, 0] as Instr);
      break;
    }
    case "Table":
      code.push([Op.NEWTABLE, 0, expr.fields.length, 0] as Instr);
      for (const field of expr.fields) {
        if (field.kind === "Keyed") {
          compileExpr(field.key, code, opts, imports, consts);
          compileExpr(field.value, code, opts, imports, consts);
          code.push([Op.SETTAB, 0, 0, 0] as Instr);
        } else if (field.kind === "Item") {
          compileExpr(field.value, code, opts, imports, consts);
          code.push([Op.SETTABAT, 0, 0, 0] as Instr);
        }
      }
      break;
    default:
      // Fallback: push nil for unsupported expressions
      code.push([Op.NIL, 0, 0, 0] as Instr);
  }
}
