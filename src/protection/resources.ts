// NEVAHEX-VM — bounded resource governor
// Spec Addendum "Bounded Adversary Cost" / graceful degradation: the obfuscator
// must never crash low-end clients. Decode-time and run-time budgets are baked
// into the artifact; exceeding one routes to the tier response instead of
// hanging or exhausting memory.

export interface ResourceBudget {
  /** max blob bytes the decoder will materialize */
  maxDecodeBytes: number;
  /** max proto count accepted by the decoder */
  maxProtos: number;
  /** max constants per proto */
  maxConsts: number;
  /** max instructions per proto */
  maxCode: number;
}

/** defaults sized generously for real scripts but hostile to zip-bomb style blobs */
export const DEFAULT_BUDGET: ResourceBudget = {
  maxDecodeBytes: 4 * 1024 * 1024,
  maxProtos: 4096,
  maxConsts: 65536,
  maxCode: 262144,
};

/**
 * Emit Lua guard lines injected into the decoder hot paths.
 * `errName` is a function/variable producing the cryptic failure.
 */
export function emitResourceGuards(budget: ResourceBudget, names: {
  posVar: string;      // decoder read position local
  dataLenExpr: string; // expression yielding total byte length
  npVar: string;       // proto count variable (after uvar)
  failExpr: string;    // expression to call on violation, e.g. error("...")
}): string[] {
  return [
    `if ${names.dataLenExpr}>${budget.maxDecodeBytes} then ${names.failExpr} end`,
    // per-proto caps are checked inline at their loop sites:
    `-- budget: protos<=${budget.maxProtos} consts<=${budget.maxConsts} code<=${budget.maxCode}`,
  ];
}
