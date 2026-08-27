// NEVAHEX-VM — runtime module: integrity tick (anti-tamper weaving)
// Phase 2 hardening: cross-slice correlation, per-proto salts, and richer
// silent-tier responses. Any tamper now cascades: slice N depends on slice
// N-1's live hash, so modifying one region forces a mismatch downstream.
import { IntegritySlice } from "../../protection/antitamper";
import { FieldKeyNames } from "./dispatcher";

export interface IntegrityNames {
  icv: string;    // file-scope expected-hash table
  slices: string; // file-scope slice descriptor table
  nic: string;    // slice count
  six: string;    // rotating index local
  protos: string; // decoded proto registry
  keys: FieldKeyNames;
  sl: string; seg: string; h: string; j: string; q: string; v: string;
  prevHash?: string; // Phase 2: previous slice live hash for correlation
  saltVar?: string;  // Phase 2: per-proto salt mixing into each slice hash
}

export function declareIntegrityTables(slices: IntegritySlice[], n: IntegrityNames): string[] {
  const icvLits = slices.map((s) => s[3]).join(",");
  const sliceLits = slices
    .map((s, ix) => `{i=${ix + 1},p=${s[0]},a=${s[1]},b=${s[2]},salt=${s[4] ?? 0}}`)
    .join(",");
  return [
    `${n.icv}={${icvLits}}`,
    `${n.slices}={${sliceLits}}`,
    `${n.nic}=#${n.slices}`,
  ];
}

export function emitIntegrityCheck(n: IntegrityNames, responseLines: string[]): string[] {
  const { OP, A, B1, B2, C } = n.keys;
  const prevHash = n.prevHash || "0";
  const saltVar = n.saltVar || "0";
  return [
    `if ${n.nic}>0 then`,
    `local ${n.sl}=${n.slices}[${n.six}]`,
    `${n.six}=${n.six}%${n.nic}+1`,
    `if ${n.sl} then`,
    `local ${n.seg}=${n.protos}[${n.sl}.p] and ${n.protos}[${n.sl}.p].k`,
    `if ${n.seg} then`,
    `local ${n.h}=((2166136261%1000000007)+${prevHash}+${saltVar})%1000000007`,
    `for ${n.j}=${n.sl}.a,${n.sl}.b do`,
    `local ${n.q}=${n.seg}[${n.j}]`,
    `if ${n.q} then ${n.h}=(${n.h}*31+${n.q}[${OP}]*31+${n.q}[${A}]*7+(${n.q}[${B1}]+${n.q}[${B2}])*3+${n.q}[${C}])%1000000007 end`,
    `end`,
    `if ${n.h}~=${n.icv}[${n.sl}.i] then`,
    ...responseLines,
    `end`,
    `end`,
    `end`,
    `end`,
  ];
}
