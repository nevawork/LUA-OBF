"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkBlock = walkBlock;
exports.walkStat = walkStat;
exports.walkExpr = walkExpr;
exports.walkFuncBody = walkFuncBody;
function walkBlock(b, visit) {
    for (const s of b.stats)
        walkStat(s, visit);
    if (b.ret)
        for (const e of b.ret.exprs)
            walkExpr(e, visit);
}
function walkStat(s, visit) {
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
            if (s.orelse)
                walkBlock(s.orelse, visit);
            break;
        case "NumFor":
            walkExpr(s.start, visit);
            walkExpr(s.limit, visit);
            if (s.step)
                walkExpr(s.step, visit);
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
function walkExpr(e, visit) {
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
                }
                else {
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
function walkFuncBody(f, visit) {
    walkBlock(f.body, visit);
}
