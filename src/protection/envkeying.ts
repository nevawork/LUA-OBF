// NEVAHEX-VM — environmental keying (hardened derivation scheme)
//
// Spec Phase 1, Adversary class "Colluding Attacker": multiple differently
// obfuscated builds of the same source must not be cross-analysable.
//
// Hardened design (derive-not-compare — fixes the original spec's weakness):
//   1. Each build targets an environment PROFILE (lua51 / luajit / luau).
//   2. The profile contributes a constant to the blob keystream seeds.
//   3. At load time the runtime re-derives that constant from its ACTUAL
//      environment fingerprint and mixes it into the seed registers BEFORE
//      decryption begins.
//   4. Wrong environment ⇒ wrong stream ⇒ garbage decode ⇒ cryptic failure.
// There is no comparison to branch on, so there is nothing to patch out: an
// attacker must supply the correct fingerprint arithmetic to decrypt at all.
//
// Fingerprint inputs (pure-Lua, sandbox-safe): _VERSION plus presence/absence
// bits of a stable set of globals. Mixed with a keyed additive rolling hash.

export type EnvProfile = "lua51" | "luajit" | "luau" | "universal";

/** canonical fingerprints per profile */
export const PROFILES: Record<EnvProfile, { version: string; bits: string[] }> = {
  lua51: { version: "Lua 5.1", bits: ["unpack", "setfenv", "getfenv", "loadstring"] },
  luajit: { version: "LuaJIT", bits: ["jit", "bit", "ffi"] },
  luau: { version: "Luau", bits: ["task", "game", "workspace", "typeof"] },
  universal: { version: "", bits: [] },
};

/**
 * Derive the numeric mix constant a runtime must add to its cipher seed pair.
 * Mirrored EXACTLY by emitEnvKeyingBlock in the generated Lua.
 */
export function envMixConstant(profile: EnvProfile): number {
  const p = PROFILES[profile];
  let h = 5381;
  const feed = (s: string): void => {
    for (let i = 0; i < s.length; i++) {
      h = ((h * 33) + s.charCodeAt(i)) % 1000000007;
    }
  };
  if (p.version) feed(p.version);
  for (const b of p.bits) feed("\x01" + b);
  return (h % 2147483646) + 1;
}

/**
 * Emit Lua lines computing the same constant at load time and mixing it into
 * the seed registers `sa`/`sb` before the decode loop runs.
 * Returns null when keying is disabled ("universal").
 */
export function emitEnvKeyingBlock(profile: EnvProfile, saVar: string, sbVar: string): string[] | null {
  if (profile === "universal") return null;
  const p = PROFILES[profile];
  // deterministic DJB2 over version string + present-bits, in Lua
  const lines: string[] = [];
  lines.push(`do`);
  lines.push(`  local __fp=_VERSION or ""`);
  lines.push(`  local __bits=${JSON.stringify(p.bits)}`);
  lines.push(`  local __acc=5381`);
  lines.push(`  for i=1,#__fp do __acc=(__acc*33+string.byte(__fp,i))%1000000007 end`);
  lines.push(`  for _,bn in ipairs(__bits) do`);
  lines.push(`    if rawget(_G or _ENV or {}, bn)~=nil then`);
  lines.push(`      __acc=(__acc*33+1)%1000000007`);
  lines.push(`    else`);
  lines.push(`      __acc=(__acc*33+2)%1000000007`);
  lines.push(`    end`);
  lines.push(`  end`);
  lines.push(`  __acc=__acc%2147483646+1`);
  lines.push(`  ${saVar}=(${saVar}+__acc)%2147483647 if ${saVar}<1 then ${saVar}=${saVar}+2147483646 end`);
  lines.push(`  ${sbVar}=(${sbVar}+__acc*3)%2147483647 if ${sbVar}<1 then ${sbVar}=${sbVar}+2147483646 end`);
  lines.push(`end`);
  return lines;
}

/**
 * Build-time counterpart: adjust the plaintext-side seeds the toolchain used,
 * so that (buildSeed + runtimeDerivedMix) reproduces them at load time.
 * Returns the effective seeds to embed as literals.
 */
export function bakeProfileSeeds(seeds: [number, number], profile: EnvProfile): [number, number] {
  if (profile === "universal") return seeds;
  const mix = envMixConstant(profile);
  const wrap = (v: number): number => {
    const r = ((v % 2147483647) + 2147483647) % 2147483647;
    return r < 1 ? r + 2147483646 : r;
  };
  return [wrap(seeds[0] - mix), wrap(seeds[1] - mix * 3)];
}
