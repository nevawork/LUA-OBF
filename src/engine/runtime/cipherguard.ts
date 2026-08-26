// NEVAHEX-VM — runtime module: ciphertext integrity guard (Phase 5)
//
// Emits the loader-side verifier that runs BEFORE the decode loop: sampled
// windows of the ENCRYPTED blob are re-hashed and compared against embedded
// expectations. This closes the gap of the decoded-table ticks (kept as
// decoys): a static lifter never executes those ticks, but it cannot avoid
// the shell guard either — tampered bytes mean the artifact never decodes.
//
// Tier responses:
//   strict → immediate cryptic halt on first mismatch
//   silent → the cipher SEEDS themselves are shifted by per-build deltas and
//            the constant-decryption coupling flag (CVW) is raised: decoding
//            proceeds but every downstream value is corrupted garbage.
import { BlobSlice } from "../../protection/antitamper";
import { M31 } from "../crypto/cipher";
import { Tier } from "./tiers";

export interface CipherGuardNames {
  /** file-scope encrypted blob local */
  blobVar: string;
  /** cipher seed registers (already declared where the guard is inserted) */
  saVar: string;
  sbVar: string;
  /** constant-decryption coupling flag (file-scope, init 0) */
  cvwVar: string;
  /** cryptic error literal */
  garbageLit: string;
  /** silent-tier seed-shift deltas (pre-obfuscated literal expressions) */
  deltaSa: string;
  deltaSb: string;
}

export function emitCipherGuard(
  tier: Tier,
  slices: BlobSlice[],
  tableLit: string,
  n: CipherGuardNames,
): string[] | null {
  if (tier === "off" || slices.length === 0) return null;
  const lines: string[] = [
    `do`,
    ` local BS={${tableLit}}`,
    ` for _bs=1,#BS do`,
    `  local sl=BS[_bs]`,
    `  local hh=(2166136261%1000000007)`,
    `  for j=sl.p,sl.p+sl.a-1 do hh=(hh*16777619+string.byte(${n.blobVar},j))%1000000007 end`,
    `  if hh~=sl.h then`,
  ];
  if (tier === "strict") {
    lines.push(`   error(${n.garbageLit})`);
  } else {
    // silent: poison the keystream at its ROOT and raise the CVW coupling —
    // every constant decrypted afterwards comes out as structured garbage
    lines.push(
      `   ${n.saVar}=(${n.saVar}+${n.deltaSa})%${M31} if ${n.saVar}<1 then ${n.saVar}=${n.saVar}+${M31 - 1} end`,
      `   ${n.sbVar}=(${n.sbVar}+${n.deltaSb})%${M31} if ${n.sbVar}<1 then ${n.sbVar}=${n.sbVar}+${M31 - 1} end`,
      `   ${n.cvwVar}=1`,
    );
  }
  lines.push(`  end`, ` end`, `end`);
  return lines;
}
