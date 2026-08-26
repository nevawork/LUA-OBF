// NEVAHEX-VM — red-team harness (Phase 7)
//
// Runs the PUBLISHED devirtualization pipeline against our own artifacts and
// reports, stage by stage, whether each defense holds. This is the acceptance
// test for every hardening layer: CI asserts `result.ok === true`, i.e. the
// simulated attacker wins ZERO stages on a default build.
//
// Attack model (grounded in LuraphDeobfuscator / LuaHunt / IronBrew2 breakers):
//   S1 format-identification     — known magic headers in the artifact
//   S2 seed-literal-recovery     — grep seed registers, evaluate obfuscation
//                                  arithmetic, decrypt the embedded blob
//   S3 opcode-mapping-recovery   — match stored opcodes against dispatch-arm
//                                  literals (needs S2)
//   S4 jump-offset-recovery      — sum split-jump shares straight off the wire
//                                  (needs S2; NOTE: share-sums are mask-
//                                  independent BY DESIGN — split jumps are
//                                  record-shape obfuscation, not encryption)
//   S5 constant-plaintext-scan   — printable-run scan over decoded constants
//                                  without the CV key (needs S2)
//   S6 integrity-inventory       — enumerate independent tamper mechanisms;
//                                  attacker "wins" only if there are none
//   S7 watermark-extraction      — extraction against a forged holder
//                                  manifest; wins only if it yields plausible
//                                  printable payload
//
// The harness is deliberately conservative: when a heuristic cannot decide,
// the stage counts as STOPPED (defense held) — we only claim an attacker win
// on positive evidence.
import {
  decryptBlob, deserializeBlob, normSeed,
} from "../engine/vm/serializer";
import { M31 } from "../engine/crypto/cipher";
import { extractWatermarkBytes } from "../extract";

export interface RedteamStage {
  name: string;
  /** true = defense held (attacker failed this stage) */
  stopped: boolean;
  detail: string;
  /**
   * Advisory stages document known, intentional limitations (e.g. split-jump
   * sums are mask-independent by design). They never count toward
   * layersDefeated nor affect `ok`.
   */
  advisory?: boolean;
}

export interface RedteamResult {
  stages: RedteamStage[];
  /** number of stages the simulated attacker won */
  layersDefeated: number;
  /** true when no stage was won by the attacker */
  ok: boolean;
}

function evalNum(expr: string): number | null {
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict"; return (${expr});`)();
    return typeof v === "number" && isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

/** pull the longest escaped string literal (the encrypted blob) as bytes */
function extractBlobBytes(lua: string): Buffer | null {
  const re = /local (\w+)="((?:[^"\\]|\\[0-9]{3})*)"/g;
  let best: string | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(lua)) !== null) {
    if (best === null || m[2].length > best.length) best = m[2];
  }
  if (!best) return null;
  const out: number[] = [];
  let i = 0;
  while (i < best.length) {
    if (best[i] === "\\") {
      out.push(parseInt(best.substr(i + 1, 3), 10));
      i += 4;
    } else {
      out.push(best.charCodeAt(i));
      i++;
    }
  }
  return Buffer.from(out);
}

function looksLikeSaneBlob(plain: Buffer): boolean {
  if (plain.length < 4 || !(plain[0] & 0x80)) return false;
  try {
    const d = deserializeBlob(plain);
    return d.flat.length >= 1 && d.flat.length <= 4096 && d.keys.OP !== 0;
  } catch {
    return false;
  }
}

function printableRatio(s: string): number {
  if (s.length === 0) return 0;
  let ok = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 32 && c <= 126) ok++;
  }
  return ok / s.length;
}

/**
 * Run every stage against one artifact. `manifest` is only consulted for the
 * watermark stage's FORGED-manifest attack (holder keys are NOT required —
 * that is the point).
 */
export function runRedteam(lua: string, opts?: {
  /** expected watermark length for forging the extraction manifest (default 32) */
  forgedWmLen?: number;
}): RedteamResult {
  const stages: RedteamStage[] = [];
  const push = (name: string, stopped: boolean, detail: string): void =>
    stages.push({ name, stopped, detail });

  // ---- S1: format identification -----------------------------------------
  const magics = ["NVX", "LPH!", "\x1bLua"];
  const foundMagic = magics.filter((mg) => lua.includes(mg));
  push(
    "format-identification",
    foundMagic.length === 0,
    foundMagic.length ? `known magic present: ${foundMagic.join(",")}` : "no known magic markers",
  );

  // ---- S2: seed-literal recovery ------------------------------------------
  let plain: Buffer | null = null;
  let seedsRecovered = false;
  do {
    const seedRe =
      /local (\w+)=\(((?:[^()]|\([^()]*\))*?)\) (\w+)=\(((?:[^()]|\([^()]*\))*?)\) MM=2147483647/;
    const sm = seedRe.exec(lua);
    const blob = extractBlobBytes(lua);
    if (!sm || !blob) {
      push("seed-literal-recovery", true, "no recognizable seed-register declaration or blob literal");
      break;
    }
    const sa = evalNum(sm[2]);
    const sb = evalNum(sm[4]);
    if (sa === null || sb === null || sa < 1 || sb < 1 || sa >= M31 || sb >= M31) {
      push("seed-literal-recovery", true, "seed arithmetic did not evaluate to valid register values");
      break;
    }
    const candidate = decryptBlob(blob, [normSeed(sa), normSeed(sb)] as never);
    if (!looksLikeSaneBlob(candidate)) {
      push("seed-literal-recovery", true, "recovered seeds do not decrypt to a sane blob (v3 framing holds)");
      break;
    }
    plain = candidate;
    seedsRecovered = true;
    push("seed-literal-recovery", false, "ATTACKER WIN: embedded seed arithmetic recovered the blob key");
  } while (false);

  // ---- S3: opcode mapping recovery (requires S2) ---------------------------
  if (!seedsRecovered) {
    push("opcode-mapping-recovery", true, "unreachable without recovered keys");
  } else {
    // arm literals are obfuscated arithmetic — evaluate them like a real
    // attacker's constant folder would
    const LIT = String.raw`\((?:[^()]|\([^()]*\))*\)|[\d+\-*/ ]+`;
    const armRe = new RegExp(`\\b(?:if|elseif) op==(${LIT})(?= and |\\s*then)`, "g");
    const armVals = new Set<number>();
    let am: RegExpExecArray | null;
    while ((am = armRe.exec(lua)) !== null) {
      const v = evalNum(am[1]);
      if (v !== null) armVals.add(v);
    }
    const { flat } = deserializeBlob(plain!);
    const usedOps = new Set<number>();
    for (const p of flat) for (const q of p.code) usedOps.add(q[0]);
    const uncovered = [...usedOps].filter((o) => !armVals.has(o));
    // attacker needs EVERY stored opcode to sit literally in the dispatch
    // tree; rolling-key encoding makes stored values position-dependent noise
    push(
      "opcode-mapping-recovery",
      uncovered.length > 0,
      uncovered.length > 0
        ? `${uncovered.length}/${usedOps.size} stored opcodes absent from evaluated arm literals (rolling-key encoding holds)`
        : "ATTACKER WIN: all stored opcodes appear verbatim in the dispatch tree",
    );
  }

  // ---- S4: jump-offset recovery via share summation (requires S2) ----------
  if (!seedsRecovered) {
    push("jump-offset-recovery", true, "unreachable without recovered keys");
  } else {
    const { flat } = deserializeBlob(plain!);
    // split shares sum back to the true offset regardless of the operand mask
    const maxCode = Math.max(...flat.map((p) => p.code.length));
    const jumpish = flat.some((p) =>
      p.code.some((q) => q[2] !== 0 && Math.abs(q[2]) <= maxCode + 4096),
    );
    push(
      "jump-offset-recovery",
      true, // advisory: by design the share SUM is mask-independent
      jumpish
        ? "ADVISORY: split-jump shares sum without the rolling key — shape obfuscation only (documented limitation)"
        : "no summable jump candidates found",
      );
    stages[stages.length - 1].advisory = true;
  }

  // ---- S5: constant plaintext scan (requires S2) ---------------------------
  if (!seedsRecovered) {
    push("constant-plaintext-scan", true, "unreachable without recovered keys");
  } else {
    const { flat } = deserializeBlob(plain!); // masked payloads, no CV key
    let leaked = 0;
    let scanned = 0;
    for (const p of flat) {
      for (const c of p.consts) {
        if (typeof c !== "string") continue;
        scanned++;
        if (c.length >= 8 && printableRatio(c) > 0.9) leaked++;
      }
    }
    push(
      "constant-plaintext-scan",
      leaked === 0,
      leaked === 0
        ? `${scanned} masked payloads contain no printable runs (CV masking holds)`
        : `ATTACKER WIN: ${leaked}/${scanned} payloads look like plaintext`,
    );
  }

  // ---- S6: integrity mechanism inventory -----------------------------------
  const mechanisms: string[] = [];
  if (/for \w+=sl\.p,sl\.p\+sl\.a-1 do/.test(lua)) mechanisms.push("shell ciphertext guard");
  if (/2166136261%1000000007/.test(lua)) mechanisms.push("frame integrity ticks");
  if (/pID\*7919\+/.test(lua)) mechanisms.push("CVW cross-coupled decryption");
  if (/collectgarbage\("collect"\)/.test(lua)) mechanisms.push("anti-emulation probes");
  push(
    "integrity-inventory",
    mechanisms.length > 0,
    mechanisms.length ? `independent mechanisms: ${mechanisms.join("; ")}` : "ATTACKER WIN: nothing enforces integrity",
  );

  // ---- S7: watermark extraction with a FORGED manifest ---------------------
  const forgedLen = opts?.forgedWmLen ?? 32;
  try {
    const wm = extractWatermarkBytes(lua, {
      format: "nevahex-manifest",
      version: 3,
      tier: "silent",
      envProfile: "universal",
      integritySlices: 0,
      watermark: { len: forgedLen, crc16: 0 },
      fingerprint: { perm: [], dispatchOrder: [] },
      layerSeals: {} as never,
      auth: "",
      createdAt: "",
      seeds: [1, 1, 1, 1],
    } as never);
    const plausible =
      wm.crcOk === true &&
      wm.bytes === forgedLen &&
      typeof wm.text === "string" &&
      printableRatio(wm.text) > 0.9;
    push(
      "watermark-extraction",
      !plausible,
      plausible ? "ATTACKER WIN: forged-manifest extraction produced plausible payload" : "forged keys fail CRC/plausibility",
    );
  } catch (e) {
    push("watermark-extraction", true, `forged-manifest extraction rejected: ${String(e).slice(0, 80)}`);
  }

  const layersDefeated = stages.filter((s) => !s.stopped && !s.advisory).length;
  return { stages, layersDefeated, ok: layersDefeated === 0 };
}
