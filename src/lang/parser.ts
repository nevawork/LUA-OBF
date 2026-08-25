// NEVAHEX-VM — Lua 5.1 recursive-descent parser
import { lex, Tok, Token, LuaSyntaxError } from "./lexer";
import {
  Block, Chunk, Expr, Stat, FuncBody, Suffixed, TableField,
} from "./nodes";

// binary operator priorities (lua 5.1 lparser.c)
const BINPRI: Record<string, [number, number]> = {
  "or": [1, 1],
  "and": [2, 2],
  "<": [3, 3], ">": [3, 3], "<=": [3, 3], ">=": [3, 3], "~=": [3, 3], "==": [3, 3],
  "..": [5, 4], // right associative
  "+": [6, 6], "-": [6, 6],
  "*": [7, 7], "/": [7, 7], "%": [7, 7],
  "^": [10, 9], // right associative
};
const UNARY_PRI = 8;

export function parse(src: string): Chunk {
  return new Parser(lex(src)).parseChunk();
}

class Parser {
  private pos = 0;
  constructor(private toks: Token[]) {}

  private peek(k = 0): Token {
    return this.toks[Math.min(this.pos + k, this.toks.length - 1)];
  }
  private next(): Token {
    return this.toks[this.pos++];
  }
  private checkOp(op: string): boolean {
    const t = this.peek();
    return t.type === Tok.Op && t.value === op;
  }
  private checkKw(kw: string): boolean {
    const t = this.peek();
    return t.type === Tok.Keyword && t.value === kw;
  }
  private acceptOp(op: string): boolean {
    if (this.checkOp(op)) {
      this.pos++;
      return true;
    }
    return false;
  }
  private acceptKw(kw: string): boolean {
    if (this.checkKw(kw)) {
      this.pos++;
      return true;
    }
    return false;
  }
  private expectOp(op: string): Token {
    const t = this.peek();
    if (t.type !== Tok.Op || t.value !== op)
      throw new LuaSyntaxError(`expected '${op}' near '${t.value}'`, t.line, t.col);
    return this.next();
  }
  private expectKw(kw: string): Token {
    const t = this.peek();
    if (t.type !== Tok.Keyword || t.value !== kw)
      throw new LuaSyntaxError(`expected '${kw}' near '${t.value}'`, t.line, t.col);
    return this.next();
  }
  private expectName(): string {
    const t = this.peek();
    if (t.type !== Tok.Name)
      throw new LuaSyntaxError(`expected name near '${t.value}'`, t.line, t.col);
    return this.next().value;
  }
  private blockFollow(): boolean {
    const t = this.peek();
    if (t.type === Tok.EOF) return true;
    if (t.type === Tok.Keyword) return ["end", "else", "elseif", "until"].includes(t.value);
    return false;
  }

  parseChunk(): Chunk {
    const b = this.parseBlock();
    const t = this.peek();
    if (t.type !== Tok.EOF)
      throw new LuaSyntaxError(`unexpected '${t.value}'`, t.line, t.col);
    return b;
  }

  private parseBlock(): Block {
    const stats: Stat[] = [];
    while (!this.blockFollow() && !this.checkKw("return")) {
      const s = this.parseStatement();
      if (s) stats.push(s);
    }
    let ret;
    if (this.acceptKw("return")) {
      const exprs: Expr[] = [];
      if (!this.blockFollow() && !this.checkOp(";")) {
        exprs.push(this.parseExpr());
        while (this.acceptOp(",")) exprs.push(this.parseExpr());
      }
      this.acceptOp(";");
      ret = { kind: "Return" as const, exprs };
    }
    return { stats, ret };
  }

  private parseStatement(): Stat | null {
    const t = this.peek();
    if (t.type === Tok.Op) {
      if (t.value === ";") {
        this.next();
        return null;
      }
      if (t.value === "::") throw new LuaSyntaxError("labels not supported in Lua 5.1", t.line, t.col);
    }
    if (t.type === Tok.Keyword) {
      switch (t.value) {
        case "if":
          return this.parseIf();
        case "while": {
          this.next();
          const cond = this.parseExpr();
          this.expectKw("do");
          const body = this.parseBlock();
          this.expectKw("end");
          return { kind: "While", cond, body };
        }
        case "do": {
          this.next();
          const body = this.parseBlock();
          this.expectKw("end");
          return { kind: "Do", body };
        }
        case "for":
          return this.parseFor();
        case "repeat": {
          this.next();
          const body = this.parseBlock();
          this.expectKw("until");
          const cond = this.parseExpr();
          return { kind: "Repeat", body, cond };
        }
        case "function":
          return this.parseFuncStat();
        case "local":
          return this.parseLocal();
        case "break": {
          this.next();
          return { kind: "Break" };
        }
      }
    }
    // expression statement / assignment
    const e = this.parseSuffixed();
    if (this.checkOp("=") || this.checkOp(",")) {
      if (e.kind !== "Name" && e.kind !== "Index")
        throw new LuaSyntaxError("syntax error near assignment target", t.line, t.col);
      const targets: Suffixed[] = [e];
      while (this.acceptOp(",")) targets.push(this.parseSuffixed());
      this.expectOp("=");
      const exprs = [this.parseExpr()];
      while (this.acceptOp(",")) exprs.push(this.parseExpr());
      return { kind: "Assign", targets, exprs };
    }
    if (e.kind === "Call" || e.kind === "MethodCall") {
      return { kind: "ExprStat", expr: e };
    }
    throw new LuaSyntaxError(`syntax error near '${t.value}'`, t.line, t.col);
  }

  private parseIf(): Stat {
    this.expectKw("if");
    const clauses: { cond: Expr; body: Block }[] = [];
    const cond = this.parseExpr();
    this.expectKw("then");
    clauses.push({ cond, body: this.parseBlock() });
    let orelse;
    for (;;) {
      if (this.acceptKw("elseif")) {
        const c = this.parseExpr();
        this.expectKw("then");
        clauses.push({ cond: c, body: this.parseBlock() });
      } else if (this.acceptKw("else")) {
        orelse = this.parseBlock();
        this.expectKw("end");
        break;
      } else {
        this.expectKw("end");
        break;
      }
    }
    return { kind: "If", clauses, orelse };
  }

  private parseFor(): Stat {
    this.expectKw("for");
    const n1 = this.expectName();
    if (this.acceptOp("=")) {
      const start = this.parseExpr();
      this.expectOp(",");
      const limit = this.parseExpr();
      let step;
      if (this.acceptOp(",")) step = this.parseExpr();
      this.expectKw("do");
      const body = this.parseBlock();
      this.expectKw("end");
      return { kind: "NumFor", name: n1, start, limit, step, body };
    }
    const names = [n1];
    while (this.acceptOp(",")) names.push(this.expectName());
    this.expectKw("in");
    const exprs = [this.parseExpr()];
    while (this.acceptOp(",")) exprs.push(this.parseExpr());
    this.expectKw("do");
    const body = this.parseBlock();
    this.expectKw("end");
    return { kind: "GenFor", names, exprs, body };
  }

  private parseFuncStat(): Stat {
    this.expectKw("function");
    const names = [this.expectName()];
    let isMethod = false;
    while (this.acceptOp(".")) names.push(this.expectName());
    if (this.acceptOp(":")) {
      names.push(this.expectName());
      isMethod = true;
    }
    const func = this.parseFuncBody(isMethod);
    return { kind: "FuncStat", target: { names, isMethod }, func };
  }

  private parseLocal(): Stat {
    this.expectKw("local");
    if (this.acceptKw("function")) {
      const name = this.expectName();
      const func = this.parseFuncBody(false);
      return { kind: "LocalFunc", name, func };
    }
    const names = [this.expectName()];
    while (this.acceptOp(",")) names.push(this.expectName());
    const exprs: Expr[] = [];
    if (this.acceptOp("=")) {
      exprs.push(this.parseExpr());
      while (this.acceptOp(",")) exprs.push(this.parseExpr());
    }
    return { kind: "LocalDecl", names, exprs };
  }

  private parseFuncBody(isMethod: boolean): FuncBody {
    this.expectOp("(");
    const params: string[] = isMethod ? ["self"] : [];
    let isVararg = false;
    if (!this.checkOp(")")) {
      for (;;) {
        if (this.checkOp("...")) {
          this.next();
          isVararg = true;
          break;
        }
        params.push(this.expectName());
        if (!this.acceptOp(",")) break;
      }
    }
    this.expectOp(")");
    const body = this.parseBlock();
    this.expectKw("end");
    return { params, isVararg, isMethod, body };
  }

  // ---- expressions ----

  private parseExpr(limit = 0): Expr {
    let left: Expr;
    const t = this.peek();
    if ((t.type === Tok.Op && (t.value === "-" || t.value === "#")) ||
        (t.type === Tok.Keyword && t.value === "not")) {
      this.next();
      const operand = this.parseExpr(UNARY_PRI);
      left = { kind: "Unop", op: t.value as "-" | "#" | "not", operand };
    } else {
      left = this.parseSimpleExpr();
    }
    for (;;) {
      const op = this.peek();
      if (op.type !== Tok.Op || !(op.value in BINPRI)) break;
      const [lp, rp] = BINPRI[op.value];
      if (lp <= limit) break;
      this.next();
      const right = this.parseExpr(rp);
      left = { kind: "Binop", op: op.value, left, right };
    }
    return left;
  }

  private parseSimpleExpr(): Expr {
    const t = this.peek();
    switch (t.type) {
      case Tok.Number: {
        this.next();
        let v: number;
        if (/^0[xX]/.test(t.value)) v = parseInt(t.value.slice(2), 16);
        else v = parseFloat(t.value);
        return { kind: "Number", value: v, raw: t.value };
      }
      case Tok.String:
        this.next();
        return { kind: "String", value: t.value };
      case Tok.Keyword:
        if (t.value === "nil") { this.next(); return { kind: "Nil" }; }
        if (t.value === "true") { this.next(); return { kind: "True" }; }
        if (t.value === "false") { this.next(); return { kind: "False" }; }
        if (t.value === "function") {
          this.next();
          return { kind: "Func", func: this.parseFuncBody(false) };
        }
        break;
      case Tok.Op:
        if (t.value === "...") { this.next(); return { kind: "Vararg" }; }
        if (t.value === "{") return this.parseTable();
        if (t.value === "(") {
          this.next();
          const e = this.parseExpr();
          this.expectOp(")");
          return e; // parentheses dropped; semantics preserved for single-value contexts we emit
        }
        break;
    }
    return this.parseSuffixed();
  }

  private parsePrimary(): Suffixed {
    const t = this.peek();
    if (t.type === Tok.Name) {
      this.next();
      return { kind: "Name", name: t.value };
    }
    if (t.type === Tok.Op && t.value === "(") {
      this.next();
      const e = this.parseExpr();
      this.expectOp(")");
      return e as Suffixed;
    }
    throw new LuaSyntaxError(`unexpected symbol near '${t.value}'`, t.line, t.col);
  }

  private parseSuffixed(): Suffixed {
    let e = this.parsePrimary();
    for (;;) {
      const t = this.peek();
      if (t.type === Tok.Op) {
        if (t.value === ".") {
          this.next();
          const name = this.expectName();
          e = { kind: "Index", obj: e, index: { kind: "String", value: name } };
          continue;
        }
        if (t.value === "[") {
          this.next();
          const idx = this.parseExpr();
          this.expectOp("]");
          e = { kind: "Index", obj: e, index: idx };
          continue;
        }
        if (t.value === ":") {
          this.next();
          const method = this.expectName();
          const args = this.parseArgs();
          e = { kind: "MethodCall", receiver: e, method, args };
          continue;
        }
        if (t.value === "(" || t.value === "{") {
          const args = this.parseArgs();
          e = { kind: "Call", fn: e, args };
          continue;
        }
      }
      if (t.type === Tok.String) {
        e = { kind: "Call", fn: e, args: [{ kind: "String", value: this.next().value }] };
        continue;
      }
      if (t.type === Tok.Op && t.value === "{") {
        e = { kind: "Call", fn: e, args: [this.parseTable()] };
        continue;
      }
      return e;
    }
  }

  private parseArgs(): Expr[] {
    const t = this.peek();
    if (t.type === Tok.String) {
      this.next();
      return [{ kind: "String", value: t.value }];
    }
    if (this.checkOp("{")) {
      return [this.parseTable()];
    }
    this.expectOp("(");
    const args: Expr[] = [];
    if (!this.checkOp(")")) {
      args.push(this.parseExpr());
      while (this.acceptOp(",")) args.push(this.parseExpr());
    }
    this.expectOp(")");
    return args;
  }

  private parseTable(): Expr {
    this.expectOp("{");
    const fields: TableField[] = [];
    for (;;) {
      if (this.checkOp("}")) break;
      if (this.checkOp("[")) {
        this.next();
        const key = this.parseExpr();
        this.expectOp("]");
        this.expectOp("=");
        fields.push({ kind: "Keyed", key, value: this.parseExpr() });
      } else if (this.peek().type === Tok.Name && this.toks[this.pos + 1].type === Tok.Op && this.toks[this.pos + 1].value === "=") {
        const name = this.next().value;
        this.next(); // =
        fields.push({ kind: "NameKeyed", name, value: this.parseExpr() });
      } else {
        fields.push({ kind: "Item", value: this.parseExpr() });
      }
      if (!this.acceptOp(",") && !this.acceptOp(";")) break;
    }
    this.expectOp("}");
    return { kind: "Table", fields };
  }
}
