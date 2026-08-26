#!/usr/bin/env node
// NEVAHEX — Gate-0 report generator (runs AFTER verify.sh has built dist/).
// Emits a markdown summary to stdout and .gate0/report.json with the metrics
// the APEX plan tracks: budgets, blob entropy, cross-build similarity,
// red-team verdict, and protect() timing baselines for PERFORMANCE.md.
"use strict";
const fs = require("fs");
const path = require("path");

process.chdir(path.join(__dirname, ".."));
fs.mkdirSync(".gate0", { recursive: true });

let md = "## Gate-0 report\n\n";
const report = { generatedAt: new Date().toISOString(), checks: {} };

function section(title) {
  md += `\n### ${title}\n\n`;
}

try {
  const { protect } = require("./dist/pipeline.js");
  const { runRedteam } = require("./dist/testing/redteam.js");
  const { blobEntropy, lineJaccard } = require("./dist/testing/metrics.js");
  const { checkBudgets } = require("./dist/engine/runtime/localbudget.js");

  // ---- red-team: zero non-advisory wins required ----
  const src = 'local msg="license-payload" _G.out=#msg return msg';
  const build = protect({ source: src, seedHex: "ab".repeat(32), watermark: "ci-probe" });
  const rt = runRedteam(build.lua);
  report.checks.redteam = { layersDefeated: rt.layersDefeated, ok: rt.ok };
  section("Red team");
  md += `layersDefeated: **${rt.layersDefeated}** — ok: **${rt.ok}**\n\n`;
  md += "| stage | stopped | advisory | detail |\n|---|---|---|---|\n";
  for (const s of rt.stages) {
    md += `| ${s.name} | ${s.stopped} | ${!!s.advisory} | ${s.detail.replace(/\|/g, "/")} |\n`;
  }

  // ---- budgets + entropy + similarity + timing baseline ----
  section("Build & artifact metrics");
  const t0 = process.hrtime.bigint();
  const fibSrc = fs.readFileSync("fixtures/fib.lua", "utf8");
  const fib = protect({ source: fibSrc, seedHex: "cd".repeat(32) });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const m = fib.lua.match(/local \w+="((?:[^"\\]|\\[0-9]{3})*)"/);
  let ent = 0;
  if (m) {
    const bytes = [];
    let i = 0;
    while (i < m[1].length) {
      if (m[1][i] === "\\") { bytes.push(parseInt(m[1].substr(i + 1, 3), 10)); i += 4; }
      else { bytes.push(m[1].charCodeAt(i)); i++; }
    }
    ent = blobEntropy(Uint8Array.from(bytes));
  }
  const other = protect({ source: fibSrc, seedHex: "ef".repeat(32) });
  const jac = lineJaccard(fib.lua, other.lua);
  report.checks.metrics = {
    protectMs: Math.round(ms * 100) / 100,
    outBytes: Buffer.byteLength(fib.lua),
    blobEntropy: Math.round(ent * 1000) / 1000,
    lineJaccardCrossSeed: Math.round(jac * 10000) / 10000,
  };
  md += `- protect(): ${report.checks.metrics.protectMs} ms · output ${report.checks.metrics.outBytes} bytes\n`;
  md += `- blob entropy: ${report.checks.metrics.blobEntropy} bits/byte (target ≥7.5)\n`;
  md += `- cross-seed lineJaccard: ${report.checks.metrics.lineJaccardCrossSeed} (target <0.15)\n`;

  const smoke = protect({ source: "EXPECTED={2+3}", seedHex: "11".repeat(32), tier: "silent" });
  const budgetLike = {
    locals: (smoke.lua.match(/\blocal\s+/g) || []).length,
  };
  report.checks.smokeBudget = budgetLike;
  md += `- smoke artifact local-statements: ${budgetLike.locals} (hard Lua limit 200/function; E1 governor enforces ≤170 distinct)\n`;

  md += `\n> Baselines pending real-Lua runtime timing (needs interpreter runners);\n`;
  md += `> this report pins build-side numbers and the red-team verdict.\n`;
} catch (e) {
  md += `\n**REPORT ERROR** (likely dist missing or a failing check):\n\n\`\`\`\n${String(e && e.stack || e)}\n\`\`\`\n`;
  report.error = String(e && e.message || e);
}

fs.writeFileSync(".gate0/report.json", JSON.stringify(report, null, 2));
process.stdout.write(md + "\n");
