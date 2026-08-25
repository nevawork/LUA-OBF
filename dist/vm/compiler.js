"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
exports.compileChunk = compileChunk;
const opcodes_1 = require("./opcodes");
class FnScope {
    proto;
    parent;
    scopes = [new Map()];
    slotCount = 0; // last assigned slot; 1-based after first declare
    breakStack = [];
    constructor(proto, parent) {
        this.proto = proto;
        this.parent = parent;
    }
    openBlock() {
        this.scopes.push(new Map());
    }
    closeBlock() {
        this.scopes.pop();
    }
    declare(name) {
        const slot = ++this.slotCount;
        if (name !== "_")
            this.scopes[this.scopes.length - 1].set(name, slot);
        return slot;
    }
    resolve(name) {
        let scope = this;
        let depth = 0;
        while (scope) {
            for (let i = scope.scopes.length - 1; i >= 0; i--) {
                const hit = scope.scopes[i].get(name);
                if (hit !== undefined)
                    return { depth, slot: hit };
            }
            scope = scope.parent;
            depth++;
        }
        return null;
    }
    /** upval index in THIS proto exposing the local `slot` of ancestor `depth` levels up */
    upvalIndex(depth, slot) {
        if (depth === 1)
            return this.addUpval({ instack: true, idx: slot });
        const viaParent = this.parent.upvalIndex(depth - 1, slot);
        return this.addUpval({ instack: false, idx: viaParent });
    }
    addUpval(d) {
        const uv = this.proto.upvals;
        for (let i = 0; i < uv.length; i++) {
            if (uv[i].instack === d.instack && uv[i].idx === d.idx)
                return i;
        }
        uv.push(d);
        return uv.length - 1;
    }
}
class Compiler {
    fs;
    compile(chunk) {
        const fb = { params: [], isVararg: true, isMethod: false, body: chunk };
        const proto = emptyProto(0, true);
        this.fs = new FnScope(proto, null);
        // chunk params: none; DECL emitted by compileBody
        this.compileBody(fb);
        return { root: proto };
    }
    emit(op, a = 0, b = 0, cc = 0) {
        this.fs.proto.code.push([op, a, b, cc]);
        return this.fs.proto.code.length - 1;
    }
    pc() {
        return this.fs.proto.code.length;
    }
    /** patch jump at index `at` to land on current position */
    here(at) {
        this.fs.proto.code[at][2] = this.pc() - (at + 1);
    }
    constIdx(v) {
        const consts = this.fs.proto.consts;
        for (let i = 0; i < consts.length; i++) {
            if (consts[i] === v && typeof consts[i] === typeof v)
                return i;
        }
        this.fs.proto.consts.push(v);
        return this.fs.proto.consts.length;
    }
    compileFunc(fb) {
        const parent = this.fs;
        const nParams = fb.params.length;
        const proto = emptyProto(nParams, fb.isVararg);
        const child = new FnScope(proto, parent);
        this.fs = child;
        this.emit(opcodes_1.Op.DECL, nParams);
        for (const p of fb.params)
            child.declare(p);
        this.compileBlockScoped(fb.body);
        this.emit(opcodes_1.Op.RET, 0); // implicit return
        proto.numSlots = child.slotCount;
        this.fs = parent;
        parent.proto.protos.push(proto);
        this.emit(opcodes_1.Op.CLOSURE, parent.proto.protos.length - 1);
    }
    compileBody(fb) {
        this.compileBlockScoped(fb.body);
        this.emit(opcodes_1.Op.RET, 0);
        this.fs.proto.numSlots = this.fs.slotCount;
    }
    compileBlockScoped(b) {
        this.fs.openBlock();
        for (const s of b.stats)
            this.stat(s);
        if (b.ret)
            this.compileReturn(b.ret.exprs);
        this.fs.closeBlock();
    }
    compileReturn(exprs) {
        if (exprs.length === 0) {
            this.emit(opcodes_1.Op.RET, 0);
            return;
        }
        for (let i = 0; i < exprs.length - 1; i++)
            this.expr(exprs[i], 1);
        this.expr(exprs[exprs.length - 1], -1);
        this.emit(opcodes_1.Op.RET, -1);
    }
    // ---- statements ----
    stat(s) {
        switch (s.kind) {
            case "LocalDecl": {
                const base = this.fs.slotCount + 1;
                this.emit(opcodes_1.Op.DECL, s.names.length);
                for (const n of s.names)
                    this.fs.declare(n);
                if (s.exprs.length > 0) {
                    this.exprList(s.exprs, s.names.length);
                    this.emit(opcodes_1.Op.STOREN, base, s.names.length);
                }
                break;
            }
            case "Assign":
                this.assign(s.targets, s.exprs);
                break;
            case "LocalFunc": {
                const slot = this.fs.declare(s.name);
                this.emit(opcodes_1.Op.DECL, 1);
                this.funcExpr({ kind: "Func", func: s.func });
                this.emit(opcodes_1.Op.SETLOCAL, slot);
                break;
            }
            case "FuncStat": {
                // desugar: function a.b.c() end -> a.b.c = function() end
                const t = s.target;
                let target = { kind: "Name", name: t.names[0] };
                for (let i = 1; i < t.names.length; i++)
                    target = { kind: "Index", obj: target, index: { kind: "String", value: t.names[i] } };
                this.assign([target], [{ kind: "Func", func: s.func }]);
                break;
            }
            case "ExprStat":
            case "CallStat": {
                const call = s.kind === "CallStat" ? s.call : s.expr;
                if (call.kind === "Call")
                    this.callExpr(call.fn, call.args, 0);
                else
                    this.methodCall(call.receiver, call.method, call.args, 0);
                break;
            }
            case "Do":
                this.compileBlockScoped(s.body);
                break;
            case "While": {
                const top = this.pc();
                this.expr(s.cond, 1);
                const jf = this.emit(opcodes_1.Op.JF);
                this.fs.breakStack.push([]);
                this.compileBlockScoped(s.body);
                const breaks = this.fs.breakStack.pop();
                this.emit(opcodes_1.Op.JMP, 0, top - (this.pc() + 1));
                this.here(jf);
                for (const j of breaks)
                    this.here(j);
                break;
            }
            case "Repeat": {
                const top = this.pc();
                this.fs.breakStack.push([]);
                this.fs.openBlock(); // condition shares body scope
                for (const st of s.body.stats)
                    this.stat(st);
                this.expr(s.cond, 1);
                const jt = this.emit(opcodes_1.Op.JT);
                this.fs.closeBlock();
                this.emit(opcodes_1.Op.JMP, 0, top - (this.pc() + 1));
                this.here(jt);
                const breaks = this.fs.breakStack.pop();
                for (const j of breaks)
                    this.here(j);
                break;
            }
            case "If": {
                const jumpsToEnd = [];
                for (let i = 0; i < s.clauses.length; i++) {
                    const cl = s.clauses[i];
                    this.expr(cl.cond, 1);
                    const jf = this.emit(opcodes_1.Op.JF);
                    this.compileBlockScoped(cl.body);
                    if (i < s.clauses.length - 1 || s.orelse)
                        jumpsToEnd.push(this.emit(opcodes_1.Op.JMP));
                    this.here(jf);
                }
                if (s.orelse)
                    this.compileBlockScoped(s.orelse);
                for (const j of jumpsToEnd)
                    this.here(j);
                break;
            }
            case "NumFor": {
                this.expr(s.start, 1);
                this.expr(s.limit, 1);
                if (s.step)
                    this.expr(s.step, 1);
                else
                    this.emit(opcodes_1.Op.LOADK, this.constIdx(1));
                const base = this.fs.slotCount + 1; // [ctrl, idx, limit, step] (1-based)
                this.fs.slotCount += 4;
                this.fs.scopes[this.fs.scopes.length - 1].set(s.name, base);
                const prep = this.emit(opcodes_1.Op.FORPREP, base); // B patched below
                this.fs.openBlock();
                this.fs.breakStack.push([]);
                for (const st of s.body.stats)
                    this.stat(st);
                if (s.body.ret)
                    this.compileReturn(s.body.ret.exprs);
                this.fs.closeBlock();
                const fl = this.emit(opcodes_1.Op.FORLOOP, base);
                this.here(prep); // exit lands right after FORLOOP
                const exitPc = this.pc();
                this.fs.proto.code[prep][2] = exitPc - (prep + 1);
                this.fs.proto.code[fl][2] = (prep + 1) - (fl + 1); // back-jump to body start
                const breaks = this.fs.breakStack.pop();
                for (const j of breaks)
                    this.here(j);
                break;
            }
            case "GenFor": {
                this.exprList(s.exprs, 3);
                const base = this.fs.slotCount + 1; // [f, s, ctrl, v1..vn] (1-based)
                this.fs.slotCount += 3 + s.names.length;
                const topScope = this.fs.scopes[this.fs.scopes.length - 1];
                for (let i = 0; i < s.names.length; i++)
                    topScope.set(s.names[i], base + 3 + i);
                const prep = this.emit(opcodes_1.Op.GFORPREP, base, 0, s.names.length);
                this.fs.openBlock();
                this.fs.breakStack.push([]);
                for (const st of s.body.stats)
                    this.stat(st);
                if (s.body.ret)
                    this.compileReturn(s.body.ret.exprs);
                this.fs.closeBlock();
                const gl = this.emit(opcodes_1.Op.GFORLOOP, base, 0, s.names.length);
                this.here(prep);
                this.fs.proto.code[gl][2] = (prep + 1) - (gl + 1);
                const breaks = this.fs.breakStack.pop();
                for (const j of breaks)
                    this.here(j);
                break;
            }
            case "Break": {
                const patches = this.fs.breakStack[this.fs.breakStack.length - 1];
                if (!patches)
                    throw new Error("break outside loop");
                patches.push(this.emit(opcodes_1.Op.JMP));
                break;
            }
            default:
                throw new Error(`unhandled statement ${s.kind}`);
        }
    }
    /** push expr list with multret expansion on last item, then adjust to exactly `n`
     * ADJUST encoding: a=n target; b>0 exact static size, b<0 -> size=(-b-1)+mr */
    exprList(exprs, n) {
        if (exprs.length === 0) {
            this.emit(opcodes_1.Op.ADJUST, n, 0);
            return;
        }
        for (let i = 0; i < exprs.length - 1; i++)
            this.expr(exprs[i], 1);
        const last = exprs[exprs.length - 1];
        if (expands(last)) {
            this.expr(last, -1);
            this.emit(opcodes_1.Op.ADJUST, n, -(exprs.length));
        }
        else {
            this.expr(last, 1);
            this.emit(opcodes_1.Op.ADJUST, n, exprs.length);
        }
    }
    assign(targets, rhs) {
        // phase 1: evaluate target refs left-to-right as uniform [key, tbl-or-env] pairs
        const names = []; // global names per target ("" when table target)
        for (const t of targets) {
            if (t.kind === "Name") {
                this.emit(opcodes_1.Op.LOADK, this.constIdx(t.name));
                this.emit(opcodes_1.Op.PUSHENV);
                names.push(t.name);
            }
            else if (t.kind === "Index") {
                this.expr(t.obj, 1);
                this.expr(t.index, 1);
                names.push("");
            }
            else {
                throw new Error("invalid assignment target");
            }
        }
        // phase 2: RHS
        this.exprList(rhs, targets.length);
        // phase 3: stores
        this.emit(opcodes_1.Op.MSET, targets.length);
        void names;
    }
    // ---- expressions ----
    /** want: 1 exactly one value; -1 multret allowed; 0 discarded (calls only) */
    expr(e, want) {
        switch (e.kind) {
            case "Nil":
                this.emit(opcodes_1.Op.NIL);
                break;
            case "True":
                this.emit(opcodes_1.Op.TRUE);
                break;
            case "False":
                this.emit(opcodes_1.Op.FALSE);
                break;
            case "Number":
                this.emit(opcodes_1.Op.LOADK, this.constIdx(e.value));
                break;
            case "String":
                this.emit(opcodes_1.Op.LOADK, this.constIdx(e.value));
                break;
            case "Vararg":
                this.emit(opcodes_1.Op.VARARG, want === -1 ? -1 : 1);
                break;
            case "Func":
                this.funcExpr(e);
                break;
            case "Table":
                this.tableExpr(e.fields);
                break;
            case "Binop":
                this.binop(e.left, e.op, e.right);
                break;
            case "Unop":
                this.expr(e.operand, 1);
                if (e.op === "-")
                    this.emit(opcodes_1.Op.NEG);
                else if (e.op === "#")
                    this.emit(opcodes_1.Op.LEN);
                else
                    this.emit(opcodes_1.Op.NOT);
                break;
            case "Name":
                this.nameRef(e.name);
                break;
            case "Index":
                this.expr(e.obj, 1);
                this.expr(e.index, 1);
                this.emit(opcodes_1.Op.GETTAB);
                break;
            case "Call":
                this.callExpr(e.fn, e.args, want);
                break;
            case "MethodCall":
                this.methodCall(e.receiver, e.method, e.args, want);
                break;
        }
        if (want === 1 && !isCallLike(e))
            this.emit(opcodes_1.Op.ADJUST_ONE);
    }
    funcExpr(e) {
        this.compileFunc(e.func);
    }
    nameRef(name) {
        const ref = this.fs.resolve(name);
        if (!ref) {
            this.emit(opcodes_1.Op.GGET, this.constIdx(name));
            return;
        }
        if (ref.depth === 0)
            this.emit(opcodes_1.Op.MOVE, ref.slot);
        else
            this.emit(opcodes_1.Op.UPVAL, this.fs.upvalIndex(ref.depth, ref.slot));
    }
    binop(left, op, right) {
        if (op === "and") {
            this.expr(left, 1);
            const j = this.emit(opcodes_1.Op.JF);
            this.emit(opcodes_1.Op.POP, 1);
            this.expr(right, 1);
            this.here(j);
            return;
        }
        if (op === "or") {
            this.expr(left, 1);
            const j = this.emit(opcodes_1.Op.JT);
            this.emit(opcodes_1.Op.POP, 1);
            this.expr(right, 1);
            this.here(j);
            return;
        }
        this.expr(left, 1);
        this.expr(right, 1);
        switch (op) {
            case "+":
                this.emit(opcodes_1.Op.ADD);
                break;
            case "-":
                this.emit(opcodes_1.Op.SUB);
                break;
            case "*":
                this.emit(opcodes_1.Op.MUL);
                break;
            case "/":
                this.emit(opcodes_1.Op.DIV);
                break;
            case "%":
                this.emit(opcodes_1.Op.MOD);
                break;
            case "^":
                this.emit(opcodes_1.Op.POW);
                break;
            case "..":
                this.emit(opcodes_1.Op.CONCAT, 2);
                break;
            case "==":
                this.emit(opcodes_1.Op.EQ);
                break;
            case "~=":
                this.emit(opcodes_1.Op.EQ);
                this.emit(opcodes_1.Op.NOT);
                break;
            case "<":
                this.emit(opcodes_1.Op.LT);
                break;
            case ">":
                this.emit(opcodes_1.Op.SWAP);
                this.emit(opcodes_1.Op.LT);
                break;
            case "<=":
                this.emit(opcodes_1.Op.LE);
                break;
            case ">=":
                this.emit(opcodes_1.Op.SWAP);
                this.emit(opcodes_1.Op.LE);
                break;
            default: throw new Error(`unsupported binary operator '${op}'`);
        }
    }
    tableExpr(fields) {
        this.emit(opcodes_1.Op.NEWTABLE, fields.length, fields.length);
        let pending = 0;
        const flushItems = () => {
            if (pending > 0) {
                this.emit(opcodes_1.Op.SETLIST, pending);
                pending = 0;
            }
        };
        for (let i = 0; i < fields.length; i++) {
            const f = fields[i];
            if (f.kind === "Item") {
                const isLast = i === fields.length - 1;
                if (isLast && expands(f.value)) {
                    this.expr(f.value, -1);
                    this.emit(opcodes_1.Op.SETLIST, -(pending + 1)); // absorb mr range too
                    return;
                }
                this.expr(f.value, 1);
                pending++;
            }
            else {
                flushItems();
                if (f.kind === "Keyed") {
                    this.expr(f.key, 1);
                    this.expr(f.value, 1);
                }
                else {
                    this.emit(opcodes_1.Op.LOADK, this.constIdx(f.name));
                    this.expr(f.value, 1);
                }
                this.emit(opcodes_1.Op.SETTABAT, 2); // layout [t,k,v]: table two below top
            }
        }
        flushItems();
    }
    callExpr(fn, args, want) {
        this.expr(fn, 1);
        const n = args.length;
        const absorb = n > 0 && expands(args[n - 1]) && (want === -1 || n === 1);
        for (let i = 0; i < n; i++) {
            this.expr(args[i], i === n - 1 && absorb ? -1 : 1);
        }
        this.emit(opcodes_1.Op.CALL, absorb ? -1 : n, wantToB(want));
        if (want === 1)
            this.emit(opcodes_1.Op.ADJUST_ONE);
    }
    methodCall(receiver, method, args, want) {
        this.expr(receiver, 1);
        this.emit(opcodes_1.Op.LOADK, this.constIdx(method));
        this.emit(opcodes_1.Op.GETTAB);
        this.emit(opcodes_1.Op.DUP_ROT); // -> [fn, self]
        const n = args.length;
        const absorb = n > 0 && expands(args[n - 1]) && (want === -1 || n === 1);
        for (let i = 0; i < n; i++) {
            this.expr(args[i], i === n - 1 && absorb ? -1 : 1);
        }
        this.emit(opcodes_1.Op.CALLM, absorb ? -1 : n, wantToB(want));
        if (want === 1)
            this.emit(opcodes_1.Op.ADJUST_ONE);
    }
}
exports.Compiler = Compiler;
function wantToB(want) {
    if (want === 0)
        return 0;
    if (want === -1)
        return -1;
    return 1;
}
function isCallLike(e) {
    return e.kind === "Call" || e.kind === "MethodCall";
}
function expands(e) {
    return e.kind === "Call" || e.kind === "MethodCall" || e.kind === "Vararg";
}
function emptyProto(params, isVararg) {
    return {
        params,
        isVararg,
        consts: [],
        code: [],
        protos: [],
        upvals: [],
        numSlots: 0,
    };
}
function compileChunk(chunk) {
    return new Compiler().compile(chunk).root;
}
