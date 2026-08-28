// NEVAHEX-VM — Lua 5.1 AST node definitions
export type Chunk = Block;

export interface Block {
  stats: Stat[];
  ret?: RetStat;
}

export interface RetStat {
  kind: "Return";
  exprs: Expr[];
}

export type Stat =
  | LocalDecl
  | Assign
  | CallStat
  | DoStat
  | WhileStat
  | RepeatStat
  | IfStat
  | NumFor
  | GenFor
  | FuncStat
  | LocalFunc
  | BreakStat
  | ExprStat;

export interface LocalDecl {
  kind: "LocalDecl";
  names: string[];
  exprs: Expr[];
}
export interface Assign {
  kind: "Assign";
  targets: Suffixed[];
  exprs: Expr[];
}
export interface CallStat {
  kind: "CallStat";
  call: CallExpr | MethodCallExpr;
}
export interface DoStat {
  kind: "Do";
  body: Block;
}
export interface WhileStat {
  kind: "While";
  cond: Expr;
  body: Block;
}
export interface RepeatStat {
  kind: "Repeat";
  body: Block;
  cond: Expr;
}
export interface IfStat {
  kind: "If";
  clauses: { cond: Expr; body: Block }[];
  orelse?: Block;
}
export interface NumFor {
  kind: "NumFor";
  name: string;
  start: Expr;
  limit: Expr;
  step?: Expr;
  body: Block;
}
export interface GenFor {
  kind: "GenFor";
  names: string[];
  exprs: Expr[];
  body: Block;
}
export interface FuncStat {
  kind: "FuncStat";
  target: { names: string[]; isMethod: boolean }; // a.b.c or a:b
  func: FuncBody;
}
export interface LocalFunc {
  kind: "LocalFunc";
  name: string;
  func: FuncBody;
}
export interface BreakStat {
  kind: "Break";
}
export interface ExprStat {
  kind: "ExprStat";
  expr: CallExpr | MethodCallExpr;
}

export interface FuncBody {
  params: string[];
  isVararg: boolean;
  isMethod: boolean;
  body: Block;
}

export type Expr =
  | NilLit
  | TrueLit
  | FalseLit
  | NumberLit
  | StringLit
  | VarargExpr
  | FuncExpr
  | TableExpr
  | Binop
  | Unop
  | NameRef
  | IndexExpr
  | CallExpr
  | MethodCallExpr;

export interface NilLit {
  kind: "Nil";
}
export interface TrueLit {
  kind: "True";
}
export interface FalseLit {
  kind: "False";
}
export interface NumberLit {
  kind: "Number";
  value: number;
  raw: string;
}
export interface StringLit {
  kind: "String";
  value: string; // decoded bytes as JS string (latin1 per byte)
}
export interface VarargExpr {
  kind: "Vararg";
}
export interface FuncExpr {
  kind: "Func";
  func: FuncBody;
}
export interface TableExpr {
  kind: "Table";
  fields: TableField[];
}
export type TableField =
  | { kind: "Item"; value: Expr } // positional
  | { kind: "Keyed"; key: Expr; value: Expr }
  | { kind: "NameKeyed"; name: string; value: Expr };

export interface Binop {
  kind: "Binop";
  op: string;
  left: Expr;
  right: Expr;
}
export interface Unop {
  kind: "Unop";
  op: "-" | "not" | "#" | "~";
  operand: Expr;
}
export interface NameRef {
  kind: "Name";
  name: string;
}
export interface IndexExpr {
  kind: "Index";
  obj: Expr;
  index: Expr;
}
export interface CallExpr {
  kind: "Call";
  fn: Expr;
  args: Expr[];
}
export interface MethodCallExpr {
  kind: "MethodCall";
  receiver: Expr;
  method: string;
  args: Expr[];
}

export type Suffixed = NameRef | IndexExpr | CallExpr | MethodCallExpr;

export function walkBlock(b: Block, visit: (e: Expr) => void): void {
  for (const s of b.stats) walkStat(s, visit);
  if (b.ret) for (const e of b.ret.exprs) walkExpr(e, visit);
}

export function walkStat(s: Stat, visit: (e: Expr) => void): void {
  switch (s.kind) {
    case "LocalDecl":
      s.exprs.forEach((e) => walkExpr(e, visit));
      break;
    case "Assign":
      s.targets.forEach((t) => walkExpr(t, visit));
      s.exprs.forEach((e) => walkExpr(e, visit));
      break;
    case "CallStat":
      walkExpr(s.call, visit);
      break;
    case "Do":
      walkBlock(s.body, visit);
      break;
    case "While":
      walkExpr(s.cond, visit);
      walkBlock(s.body, visit);
      break;
    case "Repeat":
      walkBlock(s.body, visit);
      walkExpr(s.cond, visit);
      break;
    case "If":
      s.clauses.forEach((c) => {
        walkExpr(c.cond, visit);
        walkBlock(c.body, visit);
      });
      if (s.orelse) walkBlock(s.orelse, visit);
      break;
    case "NumFor":
      walkExpr(s.start, visit);
      walkExpr(s.limit, visit);
      if (s.step) walkExpr(s.step, visit);
      walkBlock(s.body, visit);
      break;
    case "GenFor":
      s.exprs.forEach((e) => walkExpr(e, visit));
      walkBlock(s.body, visit);
      break;
    case "FuncStat":
      walkFuncBody(s.func, visit);
      break;
    case "LocalFunc":
      walkFuncBody(s.func, visit);
      break;
    case "Break":
      break;
    case "ExprStat":
      walkExpr(s.expr, visit);
      break;
  }
}

export function walkExpr(e: Expr, visit: (e: Expr) => void): void {
  visit(e);
  switch (e.kind) {
    case "Func":
      walkFuncBody(e.func, visit);
      break;
    case "Table":
      e.fields.forEach((f) => {
        if (f.kind === "Keyed") {
          walkExpr(f.key, visit);
          walkExpr(f.value, visit);
        } else {
          walkExpr(f.value, visit);
        }
      });
      break;
    case "Binop":
      walkExpr(e.left, visit);
      walkExpr(e.right, visit);
      break;
    case "Unop":
      walkExpr(e.operand, visit);
      break;
    case "Index":
      walkExpr(e.obj, visit);
      walkExpr(e.index, visit);
      break;
    case "Call":
      walkExpr(e.fn, visit);
      e.args.forEach((a) => walkExpr(a, visit));
      break;
    case "MethodCall":
      walkExpr(e.receiver, visit);
      e.args.forEach((a) => walkExpr(a, visit));
      break;
    default:
      break;
  }
}

export function walkFuncBody(f: FuncBody, visit: (e: Expr) => void): void {
  walkBlock(f.body, visit);
}
