// diagnostics: dispatch ground-truth dump (Node-side, no Lua execution needed
// for the static part; optional wasmoon probes for tier-off vs silent).
const { protect } = require("../dist/pipeline.js");
const { decryptBlob, deserializeBlob } = require("../dist/vm/serializer.js");

function evalLuaNumExpr(expr) {
  try { return Function(`"use strict"; return (${expr});`)(); } catch { return "ERR:" + expr; }
}

function analyze(name, opts) {
  const r = protect(opts);
  const seeds = r.manifest.seeds;

  // recover the blob literal (the long escaped string)
  const m = r.lua.match(/local (\w+)="((?:[^"\\]|\\[0-9]{3})*)"/);
  const lit = m[2];
  const bytes = [];
  let i = 0;
  while (i < lit.length) {
    if (lit[i] === "\\") { bytes.push(parseInt(lit.substr(i + 1, 3), 10)); i += 4; }
    else { bytes.push(lit.charCodeAt(i)); i++; }
  }
  const plain = decryptBlob(Buffer.from(bytes), seeds);
  const oc = r.manifest.opencode;
  const { flat } = deserializeBlob(plain, oc ? {
    opencode: { rk0: oc[0], astep: oc[1], ainc: oc[2] },
  } : undefined);

  // physical ops actually used by the root proto
  const usedOps = new Set(flat[0].code.map((q) => q[0]));

  // extract chain tests from generated source and evaluate their literals
  // literal may contain one nesting level: ((15+256)-256)
  const armLines = [];
  const LIT = "\\((?:[^()]|\\([^()]*\\))*\\)";
  const re = new RegExp("(elseif|if) op==(" + LIT + "|[\\d*+\\-/ ]+?)( and \\S.*)? then", "g");
  let mm;
  while ((mm = re.exec(r.lua)) !== null) {
    armLines.push({ litRaw: mm[2], gate: (mm[3] || "").trim() });
  }
  const covered = new Set(armLines.map((a) => evalLuaNumExpr(a.litRaw)));

  // every gate must be a tautology for small nonneg counters
  let gateBad = [];
  for (const a of armLines) {
    if (!a.gate) continue;
    const body = a.gate.replace(/^and /, "");
    const names = [...new Set(body.match(/[A-Za-z_]\w*/g) || [])];
    if (names.length !== 1) {
      gateBad.push({ litRaw: a.litRaw, reason: "unexpected identifiers", names });
      continue;
    }
    for (const ctr of [0, 1, 2, 37, 63, 64]) {
      const expr = body.split(names[0]).join(String(ctr));
      try {
        const val = Function(`"use strict"; return (${expr});`)();
        if (val !== true) gateBad.push({ lit: evalLuaNumExpr(a.litRaw), gate: a.gate, ctr, val });
      } catch (e) {
        gateBad.push({ litRaw: a.litRaw, reason: "eval threw", err: String(e) });
      }
    }
  }

  console.log(`\n=== ${name} ===`);
  console.log("perm:", JSON.stringify(r.manifest.fingerprint.perm));
  console.log("dispatchOrder:", JSON.stringify(r.manifest.fingerprint.dispatchOrder));
  console.log("root first10 instrs:", JSON.stringify(flat[0].code.slice(0, 10)));
  console.log("root used physical ops:", [...usedOps].sort((x, y) => x - y).join(","));
  console.log("chain arms found:", armLines.length, "covered values:", [...covered].sort((x, y) => x - y).join(","));
  const uncovered = [...usedOps].filter((o) => !covered.has(o));
  console.log("UNCOVERED used ops:", uncovered.length ? uncovered.join(",") : "(none)");
  console.log("non-tautology gates:", gateBad.length ? JSON.stringify(gateBad.slice(0, 5)) : "(none)");
  // raw sample of first chain arms as they appear in the artifact
  const rawArms = [];
  const lre = /^\s*(?:elseif|if) op==.*$/gm;
  let lm;
  while ((lm = lre.exec(r.lua)) !== null && rawArms.length < 3) rawArms.push(lm[0].trim().slice(0, 120));
  console.log("first arms raw:", JSON.stringify(rawArms));
  console.log("lua bytes:", Buffer.byteLength(r.lua), "blob bytes:", bytes.length);
  return r;
}

analyze("tier-off", { source: "EXPECTED={2+3}", tier: "off", seedHex: "11".repeat(32), emitSecrets: true });
analyze("tier-silent", { source: "EXPECTED={2+3}", tier: "silent", seedHex: "11".repeat(32), emitSecrets: true });

// runtime probe: does tier-off execute?
async function probe() {
  const { LuaFactory } = require("wasmoon");
  for (const tier of ["off", "silent", "strict"]) {
    const r = protect({ source: "EXPECTED={2+3}", tier, seedHex: "11".repeat(32) });
    const lua = await new LuaFactory().createEngine();
    try {
      await lua.doString(r.lua);
      const got = lua.global.getTable("EXPECTED");
      console.log(`probe ${tier}: RAN, EXPECTED=${JSON.stringify(got)}`);
    } catch (e) {
      console.log(`probe ${tier}: ERROR ${String(e.message).split("\n")[0]}`);
    } finally {
      lua.global.close();
    }
  }
}
probe();
