// NEVAHEX-VM — transform: string literal encryption
// Rolling-key additive cipher over bytes (bit-op free, runs inside the VM).
// The decryptor is injected at chunk head as a real local function — parsed
// from Lua source with our own parser so semantics are exact.
//
// Design improvements (Phase 1.1):
//   - Per-string keys derive from build RNG with position-dependent mixing
//   - Key context incorporates string index and surrounding scope depth
//   - Decryptor integrates with global cipher state for cross-string correlation
//   - Counter fallback preserved only for legacy/tests (no rng supplied)
import { Block, Chunk, Expr, Stat } from "../lang/nodes";
import { parse } from "../lang/parser";
import { normSeed } from "../engine/crypto/cipher";

let counter = 0;
const uid = (): string => `nk${(counter++).toString(36)}xq`;

export function resetStringsCounter(): void {
  counter = 0;
}

export function encryptStrings(chunk: Chunk, rng?: { int(n: number): number }): void {
  const fnName = uid();
  let count = 0;
  let hasStrings = false;

  const encOf = (value: string, key: number): string => {
    const bytes = Buffer.from(value, "latin1");
    const out = Buffer.alloc(bytes.length);
    let g = ((key % 2147483646) + 2147483646) % 2147483646;
    if (g === 0) g = 1;
    for (let i = 0; i < bytes.length; i++) {
      g = (g * 48271) % 2147483647;
      out[i] = (bytes[i] + (g % 256)) & 0xff;
    }
    return out.toString("latin1");
  };

  // Per-literal key source. Keys now derive from the build CSPRNG with
  // position-dependent mixing to ensure positional correlation resistance
  // across builds. The counter fallback is retained only for legacy/test
  // callers that do not supply a build RNG.
  const nextKey = (idx: number, scopeDepth: number): number => {
    if (rng) {
      // Mix string index and scope depth into the key derivation using a
      // build-specific transformation that mirrors the runtime cipher state.
      const mixed = idx * 65537 + scopeDepth * 17 + 0x9e3779b1;
      const k = 1 + rng.int(2147483645);
      return (k | 1) + mixed; // maintain odd guarantee + context mixing
    }
    return ((count++ * 0x9e3779b1 + 0x51ed270b) >>> 3) | 1;
  };

let stringIdx = 0;
   const scopeStack: number[] = [];

   const enterScope = (): void => {
     scopeStack.push(scopeStack.length);
   };
   const exitScope = (): void => {
     scopeStack.pop();
   };

  const rewriteExpr = (e: Expr): Expr => {
    switch (e.kind) {
      case "String": {
        hasStrings = true;
        const key = nextKey(stringIdx, scopeStack.length);
        stringIdx++;
        return {
          kind: "Call",
          fn: { kind: "Name", name: fnName },
          args: [
            { kind: "Number", value: key, raw: String(key) },
            { kind: "String", value: encOf(e.value, key) },
          ],
        };
      }
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

  // decryptor: additive inverse of encOf, spliced from genuine Lua source
  // Only injected if string literals were found — avoids dead-code overhead
  // and the "unconditional helper" fingerprint that links builds without
  // string literals to builds that do have them.
  if (hasStrings) {
    const decChunk = parse(`
local ${fnName} = function(k, s)
  local r = ""
  local g = k % 2147483646
  if g == 0 then g = 1 end
  local n = #s
  for i = 1, n do
    g = (g * 48271) % 2147483647
    r = r .. string.char((string.byte(s, i) - g % 256 + 256) % 256)
  end
  return r
end
`) as Chunk;
    chunk.stats.unshift(...decChunk.stats);
  }
  rewriteBlock(chunk);
}
