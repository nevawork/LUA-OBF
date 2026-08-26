// NEVAHEX-VM — build-time dispatch self-verification
// Static contract check between the generated artifact's dispatch chain and
// the serialized bytecode it must interpret. Catches any literal/permutation/
// decode desync AT BUILD TIME with a precise diff, instead of a cryptic
// runtime fallback error.
//
// Checks:
//  1. Every physical opcode used by decoded code has a matching chain arm.
//  2. Every REAL chain-arm literal evaluates to a permuted opcode value.
//  3. Every gated test's MBA gate is a tautology over representative counters
//     (checked for ALL arms, real and decoy alike).
//  4. Every perm value is covered by exactly one REAL arm (no lost/duplicated
//     handlers).
//
// Decoy classification (spec Phase 1, DPA defense): builds intentionally
// append 2..5 synthesized never-matched DECOY arms whose literals lie outside
// the physical opcode permutation space. After extracting all arms and
// evaluating their literals, an arm is classified REAL iff its evaluated
// literal value is in the set of perm values; otherwise it is a DECOY.
// Decoys are exempt from permutation coverage but must not collide with any
// real physical opcode value nor with another decoy literal.

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

  // ---- decoy classification ----
  // REAL iff the evaluated literal is in the perm value set; else DECOY.
  const permSet = new Set<number>(perm);
  const realArms: typeof arms = [];
  const decoyArms: typeof arms = [];
  for (const a of arms) {
    if (typeof a.litVal === "number" && permSet.has(a.litVal)) realArms.push(a);
    else decoyArms.push(a);
  }
  for (const a of decoyArms) {
    if (typeof a.litVal !== "number") {
      problems.push(`arm literal '${a.litRaw}' did not evaluate: ${a.litVal}`);
    }
  }

  // ---- coverage (a): every perm value covered by exactly one REAL arm ----
  const covered = new Set<number>();
  const coverCount = new Map<number, number>();
  for (const a of realArms) {
    const v = a.litVal as number;
    covered.add(v);
    coverCount.set(v, (coverCount.get(v) || 0) + 1);
  }
  for (const [v, n] of coverCount) {
    if (n > 1) problems.push(`physical op ${v} covered by ${n} REAL arms`);
  }
  for (const p of perm) {
    if (!covered.has(p)) problems.push(`perm value ${p} has no REAL arm`);
  }

  // ---- coverage (b): every used physical op must have a REAL arm ----
  for (const op of usedPhysicalOps) {
    if (!covered.has(op)) {
      problems.push(
        `bytecode uses physical op ${op} (logical ${perm.indexOf(op)}) with NO dispatch arm`,
      );
    }
  }

  // ---- decoy hygiene (c): no collision with real ops or other decoys ----
  const seenDecoy = new Set<number>();
  for (const a of decoyArms) {
    if (typeof a.litVal !== "number") continue;
    if (permSet.has(a.litVal)) {
      problems.push(`decoy literal '${a.litRaw}' collides with physical op ${a.litVal}`);
    }
    if (seenDecoy.has(a.litVal)) {
      problems.push(`decoy literal '${a.litRaw}' duplicates decoy value ${a.litVal}`);
    }
    seenDecoy.add(a.litVal);
  }

  // ---- gate tautology over representative counters (ALL arms) ----
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
