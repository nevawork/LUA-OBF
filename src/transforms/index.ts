// NEVAHEX-VM — transform registry
// Source-to-source hardening passes applied before VM compilation.
export { encryptStrings, resetStringsCounter } from "./strings";
export { flattenControlFlow, resetFlattenCounter } from "./flatten";
export { injectOpaqueJunk, resetOpaqueCounter } from "./opaque";
export { preserveTaskLibrary, luauCompatScan } from "./luau";

/** reset all module-local counters (determinism across repeated builds) */
export function resetCounter(): void {
  resetStringsCounter();
  resetFlattenCounter();
  resetOpaqueCounter();
}
