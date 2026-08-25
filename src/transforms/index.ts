// NEVAHEX-VM — transform registry
// Source-to-source hardening passes applied before VM compilation.
import { encryptStrings, resetStringsCounter } from "./strings";
import { flattenControlFlow, resetFlattenCounter } from "./flatten";
import { injectOpaqueJunk, resetOpaqueCounter } from "./opaque";

export { encryptStrings, resetStringsCounter };
export { flattenControlFlow, resetFlattenCounter };
export { injectOpaqueJunk, resetOpaqueCounter };

/** reset all module-local counters (determinism across repeated builds) */
export function resetCounter(): void {
  resetStringsCounter();
  resetFlattenCounter();
  resetOpaqueCounter();
}
