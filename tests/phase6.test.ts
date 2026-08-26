// NEVAHEX-VM — Phase 6 performance-engineering tests
// Structural pins for the runtime hot-path optimizations (unpack fast path,
// batched constant decryption, hoisted byte primitive) plus determinism
// guards proving the rewrites changed no observable build output semantics.
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";

describe("phase 6: artifact hot-path structure", () => {
  const r = protect({
    source: 'local m = "payload-string-for-concat" return m',
    seedHex: "ab".repeat(32),
  });
  const lua = r.lua;

  it("argument spreading feature-detects native unpack", () => {
    expect(/=unpack or \(table and table\.unpack\)/.test(lua)).toBe(true);
    // threshold branch + recursive fallback preserved
    expect(/>15 then return \w+\(t,i,j\) end/.test(lua)).toBe(true);
    expect(/return t\[i\],\w+\(t,i\+1,j\)/.test(lua)).toBe(true);
  });

  it("constant decryption batches through table.concat", () => {
    // accessor accumulates parts[] then concatenates once
    expect(/parts\[\w\]=\w+\(\(e\.b\[j\]-\(g%256\)\+256\)%256\)/.test(lua)).toBe(true);
    expect(/=\w+\(parts\)/.test(lua)).toBe(true);
    // the quadratic chain is gone from the CV body
    expect(/sv=sv\.\.\./.test(lua)).toBe(false);
  });

  it("blob decode loop uses the hoisted byte primitive", () => {
    expect(/ local \w+=string\.byte\n/.test(lua)).toBe(true);
    // inner loop reads via the local, not the global table
    expect(/D\[i\]=\(\w+\(\w+,i\)-pv\+256\)%256/.test(lua)).toBe(true);
    expect(/D\[i\]=\(string\.byte\(/.test(lua)).toBe(false);
  });

  it("determinism unaffected by phase-6 emission changes", () => {
    const a1 = protect({ source: "return 1", seedHex: "11".repeat(32) }).lua;
    const a2 = protect({ source: "return 1", seedHex: "11".repeat(32) }).lua;
    expect(a1).toBe(a2);
  });

  it("isomorphism still holds across seeds", () => {
    const a = protect({ source: "return 1", seedHex: "22".repeat(32) }).lua;
    const b = protect({ source: "return 1", seedHex: "44".repeat(32) }).lua;
    expect(a).not.toBe(b);
  });
});
