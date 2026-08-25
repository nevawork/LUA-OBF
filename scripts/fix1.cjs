const fs = require("fs");

// parser: remove impossible Tok.String check inside Op branch
let p = fs.readFileSync("src/lang/parser.ts", "utf8");
p = p.replace(
  'if (t.value === "(" || t.value === "{" || (t.type === Tok.String)) {',
  'if (t.value === "(" || t.value === "{") {'
);
fs.writeFileSync("src/lang/parser.ts", p);

// transforms: cast Assign targets
let tr = fs.readFileSync("src/transforms/index.ts", "utf8");
tr = tr.replace(
  "      case \"Assign\":\n        s.targets = s.targets.map(rewriteExpr);\n        s.exprs = s.exprs.map(rewriteExpr);\n        break;",
  "      case \"Assign\":\n        s.targets = s.targets.map(rewriteExpr) as typeof s.targets;\n        s.exprs = s.exprs.map(rewriteExpr);\n        break;"
);
fs.writeFileSync("src/transforms/index.ts", tr);

// emitter: add() arrow body needs braces; N.pid references -> F.pid
let e = fs.readFileSync("src/vm/emitter.ts", "utf8");
e = e.replace(
  "  const add = (op: Op, body: string[]): void =>\n    hs.push({ test: `op==${lit(op)}${gate()}`, body });",
  "  const add = (op: Op, body: string[]): void => {\n    hs.push({ test: `op==${lit(op)}${gate()}`, body });\n  };"
);
e = e.split("${N.protos}[${F.pid}]").join("${N.protos}[${F.pid}]");
fs.writeFileSync("src/vm/emitter.ts", e);
console.log("patched");
