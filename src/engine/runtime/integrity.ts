// NEVAHEX-VM — runtime module: integrity tick (anti-tamper weaving)
// Consumed by the dispatcher cadence: every countdown expiry, verify the next
// slice's hash against the ICV registry; mismatch routes to the tier policy.
import { IntegritySlice } from "../../protection/antitamper";

export interface IntegrityNames {
  icv: string;    // file-scope expected-hash table
  slices: string; // file-scope slice descriptor table
  nic: string;    // slice count
  six: string;    // rotating index local
  protos: string; // decoded proto registry
  sl: string; seg: string; h: string; j: string; q: string; v: string;
}

export function declareIntegrityTables(slices: IntegritySlice[], n: IntegrityNames): string[] {
  const icvLits = slices.map((s) => s[3]).join(",");
  const sliceLits = slices
    .map((s, ix) => `{i=${ix + 1},p=${s[0]},a=${s[1]},b=${s[2]}}`)
    .join(",");
  return [
    `${n.icv}={${icvLits}}`,
    `${n.slices}={${sliceLits}}`,
    `${n.nic}=#${n.slices}`,
  ];
}

export function emitIntegrityCheck(n: IntegrityNames, responseLines: string[]): string[] {
  return [
    `if ${n.nic}>0 then`,
    `local ${n.sl}=${n.slices}[${n.six}]`,
    `${n.six}=${n.six}%${n.nic}+1`,
    `if ${n.sl} then`,
    `local ${n.seg}=${n.protos}[${n.sl}.p] and ${n.protos}[${n.sl}.p].k`,
    `if ${n.seg} then`,
    `local ${n.h}=(2166136261%1000000007)`,
    `for ${n.j}=${n.sl}.a,${n.sl}.b do`,
    `local ${n.q}=${n.seg}[${n.j}]`,
    `if ${n.q} then ${n.h}=(${n.h}*16777619+${n.q}[1]*31+${n.q}[2]*7+${n.q}[3]*3+${n.q}[4])%1000000007 end`,
    `end`,
    `if ${n.h}~=${n.icv}[${n.sl}.i] then`,
    ...responseLines,
    `end`,
    `end`,
    `end`,
    `end`,
  ];
}
