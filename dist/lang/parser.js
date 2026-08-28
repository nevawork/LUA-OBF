"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
// NEVAHEX-VM — Lua 5.1 recursive-descent parser
const lexer_1 = require("./lexer");
// binary operator priorities (lua 5.1 lparser.c)
const BINPRI = {
    "or": [1, 1],
    "and": [2, 2],
    "<": [3, 3], ">": [3, 3], "<=": [3, 3], ">=": [3, 3], "~=": [3, 3], "==": [3, 3],
    "|": [4, 4], // bitwise OR (Lua 5.3+)
    "~": [5, 5], // bitwise XOR (Lua 5.3+)
    "&": [6, 6], // bitwise AND (Lua 5.3+)
    "<<": [7, 7], ">>": [7, 7], // shifts (Lua 5.3+)
    "..": [8, 7], // right associative
    "+": [9, 9], "-": [9, 9],
    "*": [10, 10], "/": [10, 10], "%": [10, 10],
    "^": [13, 12], // right associative
};
const UNARY_PRI = 11;
function parse(src) {
    return new Parser((0, lexer_1.lex)(src)).parseChunk();
}
class Parser {
    toks;
    pos = 0;
    constructor(toks) {
        this.toks = toks;
    }
    peek(k = 0) {
        return this.toks[Math.min(this.pos + k, this.toks.length - 1)];
    }
    next() {
        return this.toks[this.pos++];
    }
    checkOp(op) {
        const t = this.peek();
        return t.type === lexer_1.Tok.Op && t.value === op;
    }
    checkKw(kw) {
        const t = this.peek();
        return t.type === lexer_1.Tok.Keyword && t.value === kw;
    }
    acceptOp(op) {
        if (this.checkOp(op)) {
            this.pos++;
            return true;
        }
        return false;
    }
    acceptKw(kw) {
        if (this.checkKw(kw)) {
            this.pos++;
            return true;
        }
        return false;
    }
    expectOp(op) {
        const t = this.peek();
        if (t.type !== lexer_1.Tok.Op || t.value !== op)
            throw new lexer_1.LuaSyntaxError(`expected '${op}' near '${t.value}'`, t.line, t.col);
        return this.next();
    }
    expectKw(kw) {
        const t = this.peek();
        if (t.type !== lexer_1.Tok.Keyword || t.value !== kw)
            throw new lexer_1.LuaSyntaxError(`expected '${kw}' near '${t.value}'`, t.line, t.col);
        return this.next();
    }
    expectName() {
        const t = this.peek();
        if (t.type !== lexer_1.Tok.Name)
            throw new lexer_1.LuaSyntaxError(`expected name near '${t.value}'`, t.line, t.col);
        return this.next().value;
    }
    blockFollow() {
        const t = this.peek();
        if (t.type === lexer_1.Tok.EOF)
            return true;
        if (t.type === lexer_1.Tok.Keyword)
            return ["end", "else", "elseif", "until"].includes(t.value);
        return false;
    }
    parseChunk() {
        const b = this.parseBlock();
        const t = this.peek();
        if (t.type !== lexer_1.Tok.EOF)
            throw new lexer_1.LuaSyntaxError(`unexpected '${t.value}'`, t.line, t.col);
        return b;
    }
    parseBlock() {
        const stats = [];
        while (!this.blockFollow() && !this.checkKw("return")) {
            const s = this.parseStatement();
            if (s)
                stats.push(s);
        }
        let ret;
        if (this.acceptKw("return")) {
            const exprs = [];
            if (!this.blockFollow() && !this.checkOp(";")) {
                exprs.push(this.parseExpr());
                while (this.acceptOp(","))
                    exprs.push(this.parseExpr());
            }
            this.acceptOp(";");
            ret = { kind: "Return", exprs };
        }
        return { stats, ret };
    }
    parseStatement() {
        const t = this.peek();
        if (t.type === lexer_1.Tok.Op) {
            if (t.value === ";") {
                this.next();
                return null;
            }
            if (t.value === "::")
                throw new lexer_1.LuaSyntaxError("labels not supported in Lua 5.1", t.line, t.col);
        }
        if (t.type === lexer_1.Tok.Keyword) {
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
                throw new lexer_1.LuaSyntaxError("syntax error near assignment target", t.line, t.col);
            const targets = [e];
            while (this.acceptOp(","))
                targets.push(this.parseSuffixed());
            this.expectOp("=");
            const exprs = [this.parseExpr()];
            while (this.acceptOp(","))
                exprs.push(this.parseExpr());
            return { kind: "Assign", targets, exprs };
        }
        if (e.kind === "Call" || e.kind === "MethodCall") {
            return { kind: "ExprStat", expr: e };
        }
        throw new lexer_1.LuaSyntaxError(`syntax error near '${t.value}'`, t.line, t.col);
    }
    parseIf() {
        this.expectKw("if");
        const clauses = [];
        const cond = this.parseExpr();
        this.expectKw("then");
        clauses.push({ cond, body: this.parseBlock() });
        let orelse;
        for (;;) {
            if (this.acceptKw("elseif")) {
                const c = this.parseExpr();
                this.expectKw("then");
                clauses.push({ cond: c, body: this.parseBlock() });
            }
            else if (this.acceptKw("else")) {
                orelse = this.parseBlock();
                this.expectKw("end");
                break;
            }
            else {
                this.expectKw("end");
                break;
            }
        }
        return { kind: "If", clauses, orelse };
    }
    parseFor() {
        this.expectKw("for");
        const n1 = this.expectName();
        if (this.acceptOp("=")) {
            const start = this.parseExpr();
            this.expectOp(",");
            const limit = this.parseExpr();
            let step;
            if (this.acceptOp(","))
                step = this.parseExpr();
            this.expectKw("do");
            const body = this.parseBlock();
            this.expectKw("end");
            return { kind: "NumFor", name: n1, start, limit, step, body };
        }
        const names = [n1];
        while (this.acceptOp(","))
            names.push(this.expectName());
        this.expectKw("in");
        const exprs = [this.parseExpr()];
        while (this.acceptOp(","))
            exprs.push(this.parseExpr());
        this.expectKw("do");
        const body = this.parseBlock();
        this.expectKw("end");
        return { kind: "GenFor", names, exprs, body };
    }
    parseFuncStat() {
        this.expectKw("function");
        const names = [this.expectName()];
        let isMethod = false;
        while (this.acceptOp("."))
            names.push(this.expectName());
        if (this.acceptOp(":")) {
            names.push(this.expectName());
            isMethod = true;
        }
        const func = this.parseFuncBody(isMethod);
        return { kind: "FuncStat", target: { names, isMethod }, func };
    }
    parseLocal() {
        this.expectKw("local");
        if (this.acceptKw("function")) {
            const name = this.expectName();
            const func = this.parseFuncBody(false);
            return { kind: "LocalFunc", name, func };
        }
        const names = [this.expectName()];
        while (this.acceptOp(","))
            names.push(this.expectName());
        const exprs = [];
        if (this.acceptOp("=")) {
            exprs.push(this.parseExpr());
            while (this.acceptOp(","))
                exprs.push(this.parseExpr());
        }
        return { kind: "LocalDecl", names, exprs };
    }
    parseFuncBody(isMethod) {
        this.expectOp("(");
        const params = isMethod ? ["self"] : [];
        let isVararg = false;
        if (!this.checkOp(")")) {
            for (;;) {
                if (this.checkOp("...")) {
                    this.next();
                    isVararg = true;
                    break;
                }
                params.push(this.expectName());
                if (!this.acceptOp(","))
                    break;
            }
        }
        this.expectOp(")");
        const body = this.parseBlock();
        this.expectKw("end");
        return { params, isVararg, isMethod, body };
    }
    // ---- expressions ----
    parseExpr(limit = 0) {
        let left;
        const t = this.peek();
        if ((t.type === lexer_1.Tok.Op && (t.value === "-" || t.value === "#" || t.value === "~")) ||
            (t.type === lexer_1.Tok.Keyword && t.value === "not")) {
            this.next();
            const operand = this.parseExpr(UNARY_PRI);
            left = { kind: "Unop", op: t.value, operand };
        }
        else {
            left = this.parseSimpleExpr();
        }
        for (;;) {
            const op = this.peek();
            // infix operators arrive as Op tokens; 'and'/'or' arrive as Keywords
            if ((op.type !== lexer_1.Tok.Op && op.type !== lexer_1.Tok.Keyword) || !BINPRI[op.value])
                break;
            const [lp, rp] = BINPRI[op.value];
            if (lp <= limit)
                break;
            this.next();
            const right = this.parseExpr(rp);
            left = { kind: "Binop", op: op.value, left, right };
        }
        return left;
    }
    parseSimpleExpr() {
        const t = this.peek();
        switch (t.type) {
            case lexer_1.Tok.Number: {
                this.next();
                let v;
                if (/^0[xX]/.test(t.value))
                    v = parseInt(t.value.slice(2), 16);
                else
                    v = parseFloat(t.value);
                return { kind: "Number", value: v, raw: t.value };
            }
            case lexer_1.Tok.String:
                this.next();
                return { kind: "String", value: t.value };
            case lexer_1.Tok.Keyword:
                if (t.value === "nil") {
                    this.next();
                    return { kind: "Nil" };
                }
                if (t.value === "true") {
                    this.next();
                    return { kind: "True" };
                }
                if (t.value === "false") {
                    this.next();
                    return { kind: "False" };
                }
                if (t.value === "function") {
                    this.next();
                    return { kind: "Func", func: this.parseFuncBody(false) };
                }
                break;
            case lexer_1.Tok.Op:
                if (t.value === "...") {
                    this.next();
                    return { kind: "Vararg" };
                }
                if (t.value === "{")
                    return this.parseTable();
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
    parsePrimary() {
        const t = this.peek();
        if (t.type === lexer_1.Tok.Name) {
            this.next();
            return { kind: "Name", name: t.value };
        }
        if (t.type === lexer_1.Tok.Op && t.value === "(") {
            this.next();
            const e = this.parseExpr();
            this.expectOp(")");
            return e;
        }
        throw new lexer_1.LuaSyntaxError(`unexpected symbol near '${t.value}'`, t.line, t.col);
    }
    parseSuffixed() {
        let e = this.parsePrimary();
        for (;;) {
            const t = this.peek();
            if (t.type === lexer_1.Tok.Op) {
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
            if (t.type === lexer_1.Tok.String) {
                e = { kind: "Call", fn: e, args: [{ kind: "String", value: this.next().value }] };
                continue;
            }
            if (t.type === lexer_1.Tok.Op && t.value === "{") {
                e = { kind: "Call", fn: e, args: [this.parseTable()] };
                continue;
            }
            return e;
        }
    }
    parseArgs() {
        const t = this.peek();
        if (t.type === lexer_1.Tok.String) {
            this.next();
            return [{ kind: "String", value: t.value }];
        }
        if (this.checkOp("{")) {
            return [this.parseTable()];
        }
        this.expectOp("(");
        const args = [];
        if (!this.checkOp(")")) {
            args.push(this.parseExpr());
            while (this.acceptOp(","))
                args.push(this.parseExpr());
        }
        this.expectOp(")");
        return args;
    }
    parseTable() {
        this.expectOp("{");
        const fields = [];
        for (;;) {
            if (this.checkOp("}"))
                break;
            if (this.checkOp("[")) {
                this.next();
                const key = this.parseExpr();
                this.expectOp("]");
                this.expectOp("=");
                fields.push({ kind: "Keyed", key, value: this.parseExpr() });
            }
            else if (this.peek().type === lexer_1.Tok.Name && this.toks[this.pos + 1].type === lexer_1.Tok.Op && this.toks[this.pos + 1].value === "=") {
                const name = this.next().value;
                this.next(); // =
                fields.push({ kind: "NameKeyed", name, value: this.parseExpr() });
            }
            else {
                fields.push({ kind: "Item", value: this.parseExpr() });
            }
            if (!this.acceptOp(",") && !this.acceptOp(";"))
                break;
        }
        this.expectOp("}");
        return { kind: "Table", fields };
    }
}
