// NEVAHEX-VM — build-time dispatch self-verification
// Static contract check between the generated artifact's dispatch chain and
// the serialized bytecode it must interpret. Catches any literal/permutation/
// decode desync AT BUILD TIME with a precise diff, instead of a cryptic
// runtime fallback error.
//
// Checks:
//  1. Every physical opcode used by decoded code has a matching chain arm.
//  2. Every chain-arm literal evaluates to a permuted opcode value.
//  3. Every gated test's MBA gate is a tautology over representative counters.
//  4. Arm count equals logical ISA size (no lost/duplicated handlers).

export interface DispatchCheckResult {
  ok: boolean;
  problems: string[];
}

function evalNum(expr: string): number | string {
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${expr});`)();
  } catch (e) {
    return `EVAL_ERROR:${String(e)}`;
  }
}

/**
 * @param lua        generated artifact text
 * @param perm       logical→physical mapping used for this build
 * @param usedPhysicalOps physical opcodes present in decoded bytecode
 */
export function verifyGeneratedDispatch(
  lua: string,
  perm: number[],
  usedPhysicalOps: Iterable<number>,
): DispatchCheckResult {
  const problems: string[] = [];

  // ---- extract chain arms ----
  // literal may contain one nesting level: ((15+256)-256)
  const LIT = String.raw`\((?:[^()]|\([^()]*\))*\)`;
  const arms: { litRaw: string; litVal: number | string; gate: string }[] = [];
  const re = new RegExp(
    `(elseif|if) op==(${LIT}|[\\d*+\\-/ ]+?)( and \\S.*)? then`,
    "g",
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(lua)) !== null) {
    const litRaw = m[2];
    const gate = (m[3] || "").trim();
    arms.push({ litRaw, litVal: evalNum(litRaw), gate });
  }

  if (arms.length !== perm.length) {
    problems.push(
      `arm count ${arms.length} != ISA size ${perm.length} (lost/duplicated handlers?)`,
    );
  }

  // ---- coverage: every used physical op must have an arm ----
  const covered = new Set<number>();
  for (const a of arms) {
    if (typeof a.litVal === "number") covered.add(a.litVal);
    else problems.push(`arm literal '${a.litRaw}' did not evaluate: ${a.litVal}`);
  }
  for (const op of usedPhysicalOps) {
    if (!covered.has(op)) {
      problems.push(
        `bytecode uses physical op ${op} (logical ${perm.indexOf(op)}) with NO dispatch arm`,
      );
    }
  }

  // ---- duplicate literals (permutation collision) ----
  const seen = new Map<number, number>();
  for (const v of covered) seen.set(v, (seen.get(v) || 0) + 1);
  for (const [v, n] of seen) {
    if (n > 1) problems.push(`physical op ${v} covered by ${n} arms`);
  }
  for (const p of perm) {
    if (!covered.has(p)) problems.push(`perm value ${p} has no arm`);
  }

  // ---- gate tautology over representative counters ----
  for (const a of arms) {
    if (!a.gate) continue;
    const body = a.gate.replace(/^and\s+/, "");
    const names = [...new Set(body.match(/[A-Za-z_]\w*/g) || [])];
    if (names.length !== 1) {
      problems.push(`gate '${body}' references unexpected identifiers: ${names.join(",")}`);
      continue;
    }
    for (const ctr of [0, 1, 2, 37, 63, 64, 65]) {
      const expr = body.split(names[0]).join(String(ctr));
      try {
        const val = Function(`"use strict"; return (${expr});`)();
        if (val !== true) {
          problems.push(`gate '${body}' is false for ${names[0]}=${ctr} (got ${val})`);
          break;
        }
      } catch (e) {
        problems.push(`gate '${body}' failed to evaluate at ${ctr}: ${String(e)}`);
        break;
      }
    }
  }

  return { ok: problems.length === 0, problems };
}
