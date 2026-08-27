"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMbaPlus = exports.luauCompatScan = exports.preserveTaskLibrary = exports.resetOpaqueCounter = exports.injectOpaqueJunk = exports.resetFlattenCounter = exports.flattenControlFlow = exports.resetStringsCounter = exports.encryptStrings = void 0;
exports.resetCounter = resetCounter;
// NEVAHEX-VM — transform registry
// Source-to-source hardening passes applied before VM compilation.
const strings_1 = require("./strings");
Object.defineProperty(exports, "encryptStrings", { enumerable: true, get: function () { return strings_1.encryptStrings; } });
Object.defineProperty(exports, "resetStringsCounter", { enumerable: true, get: function () { return strings_1.resetStringsCounter; } });
const flatten_1 = require("./flatten");
Object.defineProperty(exports, "flattenControlFlow", { enumerable: true, get: function () { return flatten_1.flattenControlFlow; } });
Object.defineProperty(exports, "resetFlattenCounter", { enumerable: true, get: function () { return flatten_1.resetFlattenCounter; } });
const opaque_1 = require("./opaque");
Object.defineProperty(exports, "injectOpaqueJunk", { enumerable: true, get: function () { return opaque_1.injectOpaqueJunk; } });
Object.defineProperty(exports, "resetOpaqueCounter", { enumerable: true, get: function () { return opaque_1.resetOpaqueCounter; } });
const luau_1 = require("./luau");
Object.defineProperty(exports, "preserveTaskLibrary", { enumerable: true, get: function () { return luau_1.preserveTaskLibrary; } });
Object.defineProperty(exports, "luauCompatScan", { enumerable: true, get: function () { return luau_1.luauCompatScan; } });
const mba_1 = require("./mba");
Object.defineProperty(exports, "applyMbaPlus", { enumerable: true, get: function () { return mba_1.applyMbaPlus; } });
/** reset all module-local counters (determinism across repeated builds) */
function resetCounter() {
    (0, strings_1.resetStringsCounter)();
    (0, flatten_1.resetFlattenCounter)();
    (0, opaque_1.resetOpaqueCounter)();
}
