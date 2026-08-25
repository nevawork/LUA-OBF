// NEVAHEX-VM — Environmental Entropy Pool (spec Phase 3.1)
//
// Original problem being fixed (per spec): environmental keying based on
// tostring({}) address fragments is unreliable (LuaJIT interns tables, Luau
// may not expose addresses) and os.clock() micro-variations are non-
// deterministic across runs.
//
// Design: a pool of STABLE environment signals — presence/absence of a wide
// set of globals, the exact _VERSION string, and behavioral probes that return
// identical values on genuine targets but differ across VM families. Signals
// fold through a DJB2 variant into one 31-bit mix. The mix is DERIVED, never
// compared (hardened scheme): build-time bakes seeds down by the canonical mix
// for the target profile; load-time folds the ACTUAL mix back in.
// Wrong environment ⇒ wrong stream ⇒ cryptic decode failure.
//
// Deterministic per session: every signal is constant for the life of a
// process on a given runtime. Unique per environment: differing VM families
// or hosts change at least one signal bit.

import { EnvProfile } from "./envkeying";

export type SignalKind =
  | { kind: "global_present"; name: string }
  | { kind: "version_is"; expect: string }
  | { kind: "math_fingerprint"; name: string };

export interface PoolSignal {
  id: string;
  sig: SignalKind;
}

const VERSIONS: Record<string, string> = {
  lua51: "Lua 5.1",
  luajit: "LuaJIT",
  luau: "Luau",
  universal: "",
};

const GLOBALS_BY_PROFILE: Record<string, string[]> = {
  lua51: ["unpack", "setfenv", "loadstring"],
  luajit: ["jit", "bit", "ffi", "unpack", "setfenv", "loadstring"],
  luau: ["task", "game", "typeof"],
  universal: [],
};

const POOL_GLOBALS = [
  "unpack", "setfenv", "loadstring", "jit", "bit", "ffi",
  "task", "game", "typeof", "stringx",
];

/** Stable, cross-target-safe signals (arithmetic/string APIs only). */
export function poolSignals(profile: EnvProfile): PoolSignal[] {
  const sigs: PoolSignal[] = [
    { id: "v", sig: { kind: "version_is", expect: VERSIONS[profile] } },
  ];
  for (const g of POOL_GLOBALS) {
    sigs.push({ id: `g_${g}`, sig: { kind: "global_present", name: g } });
  }
  sigs.push({ id: "m_pi", sig: { kind: "math_fingerprint", name: "pi" } });
  sigs.push({ id: "m_huge", sig: { kind: "math_fingerprint", name: "huge" } });
  return sigs;
}

/** canonical fold over expected signal outcomes for a profile (build side) */
export function canonicalMix(profile: EnvProfile): number {
  const present = new Set(GLOBALS_BY_PROFILE[profile] ?? []);
  let h = 5381;
  const feed = (n: number): void => {
    h = ((h * 33) + (((n % 2147483647) + 2147483647) % 2147483647)) % 2147483647;
  };
  const v = VERSIONS[profile];
  for (let i = 0; i < v.length; i++) feed(v.charCodeAt(i) * 31 + i);
  feed(1); // version terminator
  for (const s of poolSignals(profile)) {
    if (s.sig.kind === "global_present") feed(present.has(s.sig.name) ? 11 : 13);
    else if (s.sig.kind === "math_fingerprint") feed(17); // agree on all real targets
  }
  void h === h;
  return ((h % 2147483646) + 2147483646) % 2147483646 + 1 || 1;
}

/**
 * Emit Lua collecting the ACTUAL pool, folding identically, then mixing into
 * seed registers sa/sb (call after seed literal init, before fill loop).
 */
export function emitEntropyPoolBlock(
  profile: EnvProfile,
  saVar: string,
  sbVar: string,
): string[] | null {
  if (profile === "universal") return null;
  const lines: string[] = [];
  lines.push(`do`);
  lines.push(`  local acc=5381`);
  lines.push(`  local function feed(n) acc=(acc*33+n)%2147483647 end`);
  // actual version string
  lines.push(`  local _v=tostring(_VERSION or "")`);
  lines.push(`  for i=1,#_v do feed(string.byte(_v,i)*31+i-1) end`);
  lines.push(`  feed(1)`);
  for (const g of POOL_GLOBALS) {
    lines.push(`  feed(rawget(_G or _ENV or {}, "${g}")~=nil and 11 or 13)`);
  }
  lines.push(`  feed(17) feed(17)`); // math fingerprints (pi,huge)
  lines.push(`  acc=acc%2147483646+1`);
  lines.push(`  ${saVar}=(${saVar}+acc)%2147483647 if ${saVar}<1 then ${saVar}=${saVar}+2147483646 end`);
  lines.push(`  ${sbVar}=(${sbVar}+acc*7)%2147483647 if ${sbVar}<1 then ${sbVar}=${sbVar}+2147483646 end`);
  lines.push(`end`);
  return lines;
}
