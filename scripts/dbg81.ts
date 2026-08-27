import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { Node, Block } from "../src/lang/nodes";

// Pretty-print the AST
const dumpAst = (e: any, indent = 0): string => {
  const pad = "  ".repeat(indent);
  if (e === null || e === undefined) return "nil";
  if (typeof e !== "object") return String(e);
  if (e.kind === "Number") return e.value + "";
  if (e.kind === "String") return JSON.stringify(e.value);
  if (e.kind === "Nil") return "nil";
  if (e.kind === "True") return "true";
  if (e.kind === "False") return "false";
  if (e.kind === "Name") return e.name;
  if (e.kind === "Binop") return `(${dumpAst(e.left, indent)} ${e.op} ${dumpAst(e.right, indent)})`;
  if (e.kind === "Unop") return `(${e.op} ${dumpAst(e.operand, indent)})`;
  if (e.kind === "LocalDecl") {
    const inits = e.exprs.map((x: any) => dumpAst(x, indent)).join(", ");
    return `${pad}local ${e.names.join(", ")} = ${inits}\n`;
  }
  if (e.kind === "Return") return `return ${e.exprs.map((x: any) => dumpAst(x, indent)).join(", ")}`;
  if (e.kind === "Call") return `${dumpAst(e.fn, indent)}(${e.args.map((a: any) => dumpAst(a, indent)).join(", ")})`;
  return JSON.stringify(e);
};

(async () => {
  const src = "return 1+1";
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  const chunk = parse(src);
  resetCounter();
  encryptStrings(chunk, rng);
  flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, 0.12, rng);
  applyMbaPlus(chunk, { rng });
  
  // Pretty print
  for (const s of chunk.stats) {
    console.log(dumpAst(s));
  }
  if (chunk.ret) {
    console.log("return", dumpAst(chunk.ret.exprs[0]));
  }
})();
