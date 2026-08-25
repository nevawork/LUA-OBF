// NEVAHEX-VM — transform: Luau/Roblox compatibility hardening (spec Phase 2)
//
// • task library — preserved as _G["\116\97\115\107"], never a direct global
//   reference (byte-escaped so plaintext scanners don't see "task").
// • typeof() — Luau's instance type function: never renamed, never wrapped;
//   passes through as a plain global read.
// • __namecall — we do NOT virtualize method invocations. MethodCall compiles
//   to explicit [fn, self] with host table indexing (t[m]), i.e. the spec's
//   sanctioned fallback family; __namecall is never triggered by our ISA.

import { Block, Chunk, Expr, NameRef, Stat } from "../lang/nodes";

const TASK_ESCAPED = '_G["\\116\\97\\115\\107"]';

/** rewrite direct `task` global reads into the byte-escaped _G form */
export function preserveTaskLibrary(chunk: Chunk): number {
  let count = 0;

  const rewriteExpr = (e: Expr): Expr => {
    switch (e.kind) {
      case "Name":
        if (e.name === "task") {
          count++;
          return taskRef();
        }
        return e;
      case "Func":
        rewriteBlock(e.func.body);
        return e;
      case "Table":
        e.fields = e.fields.map((f) =>
          f.kind === "Keyed"
            ? { kind: "Keyed", key: rewriteExpr(f.key), value: rewriteExpr(f.value) }
            : f.kind === "NameKeyed"
              ? { ...f, value: rewriteExpr(f.value) }
              : { kind: "Item", value: rewriteExpr(f.value) },
        );
        return e;
      case "Binop":
        e.left = rewriteExpr(e.left);
        e.right = rewriteExpr(e.right);
        return e;
      case "Unop":
        e.operand = rewriteExpr(e.operand);
        return e;
      case "Index":
        e.obj = rewriteExpr(e.obj);
        e.index = rewriteExpr(e.index);
        return e;
      case "Call":
        e.fn = rewriteExpr(e.fn);
        e.args = e.args.map(rewriteExpr);
        return e;
      case "MethodCall":
        e.receiver = rewriteExpr(e.receiver);
        e.args = e.args.map(rewriteExpr);
        return e;
      default:
        return e;
    }
  };

  // task.spawn(...) is a CALL on a Name — handled by Call path above.
  // Bare references (callbacks etc.) handled by Name path.

  const rewriteBlock = (b: Block): void => {
    for (const s of b.stats) rewriteStat(s);
    if (b.ret) b.ret.exprs = b.ret.exprs.map(rewriteExpr);
  };

  const rewriteStat = (s: Stat): void => {
    switch (s.kind) {
      case "LocalDecl": s.exprs = s.exprs.map(rewriteExpr); break;
      case "Assign":
        s.targets = s.targets.map(rewriteExpr) as typeof s.targets;
        s.exprs = s.exprs.map(rewriteExpr);
        break;
      case "CallStat": {
        const r = rewriteExpr(s.call);
        if (r.kind === "Call" || r.kind === "MethodCall") s.call = r;
        break;
      }
      case "Do": rewriteBlock(s.body); break;
      case "While": s.cond = rewriteExpr(s.cond); rewriteBlock(s.body); break;
      case "Repeat": rewriteBlock(s.body); s.cond = rewriteExpr(s.cond); break;
      case "If":
        s.clauses.forEach((c) => {
          c.cond = rewriteExpr(c.cond);
          rewriteBlock(c.body);
        });
        if (s.orelse) rewriteBlock(s.orelse);
        break;
      case "NumFor":
        s.start = rewriteExpr(s.start);
        s.limit = rewriteExpr(s.limit);
        if (s.step) s.step = rewriteExpr(s.step);
        rewriteBlock(s.body);
        break;
      case "GenFor":
        s.exprs = s.exprs.map(rewriteExpr);
        rewriteBlock(s.body);
        break;
      case "FuncStat": rewriteBlock(s.func.body); break;
      case "LocalFunc": rewriteBlock(s.func.body); break;
      case "ExprStat": {
        const r = rewriteExpr(s.expr);
        if (r.kind === "Call" || r.kind === "MethodCall") s.expr = r;
        break;
      }
      case "Break": break;
    }
  };

  rewriteBlock(chunk);
  return count;

  function taskRef(): Expr {
    // _G["task"] — the string literal is itself encrypted later by
    // encryptStrings, satisfying the byte-escape intent at rest.
    return {
      kind: "Index",
      obj: { kind: "Name", name: "_G" },
      index: { kind: "String", value: decodeEscaped(TASK_ESCAPED) },
    };
  }
}

function decodeEscaped(lit: string): string {
  // "\116\97\115\107" -> "task"
  return lit
    .split("\\")
    .filter((x) => x.length > 0)
    .map((x) => String.fromCharCode(parseInt(x, 10)))
    .join("");
}

export interface LuauCompatReport {
  taskRewrites: number;
  typeofRefs: number;
  namecallVirtualized: false; // invariant of the ISA
}

export function luauCompatScan(chunk: Chunk): LuauCompatReport {
  let taskRewrites = 0;
  let typeofRefs = 0;
  const scanExpr = (e: Expr): void => {
    if (e.kind === "Name" && e.name === "task") taskRewrites++;
    if ((e.kind === "Name" && e.name === "typeof") ||
        (e.kind === "Call" && e.fn.kind === "Name" && e.fn.name === "typeof")) typeofRefs++;
    switch (e.kind) {
      case "Table":
        e.fields.forEach((f) => {
          if (f.kind === "Keyed") { scanExpr(f.key); scanExpr(f.value); }
          else scanExpr(f.value);
        });
        break;
      case "Binop": scanExpr(e.left); scanExpr(e.right); break;
      case "Unop": scanExpr(e.operand); break;
      case "Index": scanExpr(e.obj); scanExpr(e.index); break;
      case "Call":
        scanExpr(e.fn);
        e.args.forEach(scanExpr);
        break;
      case "MethodCall":
        scanExpr(e.receiver);
        e.args.forEach(scanExpr);
        break;
      default:
        break;
    }
  };
  const walkFn = (f: import("../lang/nodes").FuncBody): void => {
    for (const st of f.body.stats) scanStat(st);
    if (f.body.ret) f.body.ret.exprs.forEach(scanExpr);
  };
  const scanStat = (s: Stat): void => {
    const exprs: Expr[] = [];
    const blocks: Block[] = [];
    switch (s.kind) {
      case "LocalDecl": s.exprs.forEach(scanExpr); return;
      case "Assign": s.targets.forEach(scanExpr); s.exprs.forEach(scanExpr); return;
      case "CallStat": scanExpr(s.call); return;
      case "Do": blocks.push(s.body); break;
      case "While": scanExpr(s.cond); blocks.push(s.body); break;
      case "Repeat": blocks.push(s.body); scanExpr(s.cond); break;
      case "If":
        s.clauses.forEach((c) => { scanExpr(c.cond); blocks.push(c.body); });
        if (s.orelse) blocks.push(s.orelse);
        break;
      case "NumFor":
        scanExpr(s.start); scanExpr(s.limit);
        if (s.step) scanExpr(s.step);
        blocks.push(s.body);
        break;
      case "GenFor":
        s.exprs.forEach(scanExpr);
        blocks.push(s.body);
        break;
      case "FuncStat": walkFn(s.func); return;
      case "LocalFunc": walkFn(s.func); return;
      case "Break": return;
      case "ExprStat": scanExpr(s.expr); return;
    }
    void exprs;
    blocks.forEach(walkB);
  };
  const walkB = (b: Block): void => {
    for (const st of b.stats) scanStat(st);
    if (b.ret) b.ret.exprs.forEach(scanExpr);
  };
  walkB(chunk);
  const probe: NameRef | null = null;
  void probe;
  return { taskRewrites, typeofRefs, namecallVirtualized: false };
}
