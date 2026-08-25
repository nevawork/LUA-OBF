// NEVAHEX-VM — runtime module: tier policies
// Addendum 0.2: tamper responses are tiered.
//   off    — no integrity enforcement at all
//   strict — immediate cryptic, non-recoverable VM halt
//   silent — "silent poisoning": results become subtly wrong downstream,
//            desync is detectable but cause is not obvious

export type Tier = "off" | "strict" | "silent";

export interface TierContext {
  /** frame-local variable holding the poison flag */
  poisonVar: string;
  /** frame-local bias applied by poisoned arithmetic/loads */
  pbVar: string;
  /** obfuscated literal for the bias constant */
  biasLit: string;
}

/** response lines when an integrity violation is detected */
export function tierViolationLines(tier: Tier, garbageLiteral: string, ctx?: TierContext): string[] {
  if (tier === "strict") return [`error(${garbageLiteral})`];
  if (tier === "silent" && ctx) {
    return [`${ctx.poisonVar}=true ${ctx.pbVar}=${ctx.biasLit}`];
  }
  // "off" never reaches a check; treat as no-op
  return [];
}
