// NEVAHEX-VM — Phase 7 red-team harness & metrics tests
// CI-level assertion: the simulated devirtualization pipeline wins ZERO
// non-advisory stages against a default build. Also pins the new artifact
// metrics (blob entropy, line-Jaccard similarity) with positive and negative
// controls.
import { describe, it, expect } from "vitest";
import { protect } from "../src/pipeline";
import { runRedteam } from "../src/testing/redteam";
import { blobEntropy, lineJaccard, layoutSimilarity } from "../src/testing/metrics";

describe("phase 7: red-team harness — defense holds", () => {
  const r = protect({
    source: [
      "local msg = 'license-data-payload'",
      "_G.out = #msg",
      "return msg",
    ].join("\n"),
    watermark: "holder-secret-01",
    seedHex: "ab".repeat(32),
  });

  it("attacker wins zero stages on a default build", () => {
    const rt = runRedteam(r.lua);
    expect(rt.layersDefeated).toBe(0);
    expect(rt.ok).toBe(true);
  });

  it("every expected stage is present and reported", () => {
    const rt = runRedteam(r.lua);
    const names = rt.stages.map((s) => s.name);
    for (const n of [
      "format-identification",
      "seed-literal-recovery",
      "opcode-mapping-recovery",
      "jump-offset-recovery",
      "constant-plaintext-scan",
      "integrity-inventory",
      "watermark-extraction",
    ]) {
      expect(names).toContain(n);
    }
  });

  it("universal builds ship cipher registers BY DESIGN (advisory loss)", () => {
    const rt = runRedteam(r.lua);
    const s = rt.stages.find((x) => x.name === "seed-literal-recovery")!;
    // single-file constraint: registers are recoverable arithmetic — recorded
    // as an ADVISORY so it never counts toward layersDefeated
    expect(s.stopped).toBe(false);
    expect(s.advisory).toBe(true);
    // mapping recovery still ran on the recovered blob and was stopped by
    // the rolling-key encoding
    const map = rt.stages.find((x) => x.name === "opcode-mapping-recovery")!;
    expect(map.stopped).toBe(true);
  });

  it("masked constants defeat plaintext scanning", () => {
    const rt = runRedteam(protect({
      source: 'return "aaaaaaaaaaaaaaaa"',
      seedHex: "ab".repeat(32),
    }).lua);
    const s = rt.stages.find((x) => x.name === "constant-plaintext-scan")!;
    expect(s.stopped).toBe(true);
  });

  it("integrity inventory finds the layered mechanisms", () => {
    const rt = runRedteam(protect({
      source: "return 1", tier: "silent", antiEmulation: true,
      seedHex: "cd".repeat(32),
    }).lua);
    const s = rt.stages.find((x) => x.name === "integrity-inventory")!;
    expect(s.stopped).toBe(true);
    expect(s.detail).toContain("shell ciphertext guard");
    expect(s.detail).toContain("CVW cross-coupled decryption");
    expect(s.detail).toContain("anti-emulation probes");
  });

  it("split-jump summation is reported as an advisory, never a win", () => {
    const rt = runRedteam(r.lua);
    const s = rt.stages.find((x) => x.name === "jump-offset-recovery")!;
    expect(s.advisory).toBe(true);
    expect(rt.layersDefeated).toBe(rt.stages.filter((x) => !x.stopped && !x.advisory).length);
  });
});

describe("phase 7: negative controls (harness detects weakness)", () => {
  it("flags legacy magic markers when present", () => {
    // historical artifacts leaked their format tag as a plaintext header;
    // the checker itself must light up when one is visible
    const weak = "-- format NVX v2 header\nlocal x=1 return x";
    const rt = runRedteam(weak);
    const s = rt.stages.find((x) => x.name === "format-identification")!;
    expect(s.stopped).toBe(false); // attacker identified the format
  });

  it("plain-number seed registers reach arithmetic evaluation", () => {
    // simulate the historical weakness: bare literals behind (+j-j)
    const weak = [
      'local B="' + "\\101\\102" + "\\103".repeat(40) + '"',
      "local sa=(100+50) sb=(200+25) MM=2147483647",
    ].join("\n");
    const rt = runRedteam(weak);
    const s = rt.stages.find((x) => x.name === "seed-literal-recovery")!;
    // seeds evaluate to valid registers; the garbage blob cannot parse, so
    // the stage is stopped — but it must have gotten past declaration scan
    expect(s.detail).not.toContain("no recognizable");
    expect(s.detail).not.toContain("did not evaluate");
    expect(s.stopped).toBe(true);
  });
});

describe("phase 7: artifact metrics", () => {
  it("encrypted blobs sit near 8 bits/byte entropy", () => {
    const r = protect({ source: ("local x=0 ".repeat(60)) + "return x", seedHex: "ab".repeat(32) });
    // extract the blob literal bytes via the harness's own extractor
    const m = r.lua.match(/local \w+="((?:[^"\\]|\\[0-9]{3})*)"/)!;
    const bytes: number[] = [];
    let i = 0;
    while (i < m[1].length) {
      if (m[1][i] === "\\") { bytes.push(parseInt(m[1].substr(i + 1, 3), 10)); i += 4; }
      else { bytes.push(m[1].charCodeAt(i)); i++; }
    }
    const ent = blobEntropy(Uint8Array.from(bytes));
    expect(ent).toBeGreaterThan(7.5);
    expect(ent).toBeLessThanOrEqual(8.001);
  });

  it("zero buffer has ~zero entropy", () => {
    expect(blobEntropy(new Uint8Array(1024))).toBeLessThan(0.01);
  });

  it("cross-build line-Jaccard stays far below template levels", () => {
    const src = "local a=1 for i=1,20 do a=a+i end return a";
    const same1 = protect({ source: src, seedHex: "aa".repeat(32) }).lua;
    const same2 = protect({ source: src, seedHex: "aa".repeat(32) }).lua;
    const other = protect({ source: src, seedHex: "bb".repeat(32) }).lua;
    // identical builds → identical line vocabulary
    expect(lineJaccard(same1, same2)).toBeCloseTo(1, 5);
    // distinct builds share only boilerplate keywords
    expect(lineJaccard(same1, other)).toBeLessThan(0.15);
  });

  it("layoutSimilarity fingerprint metric still separates builds", () => {
    const a = protect({ source: "return 1", seedHex: "11".repeat(32) }).manifest.fingerprint;
    const b = protect({ source: "return 1", seedHex: "22".repeat(32) }).manifest.fingerprint;
    expect(layoutSimilarity(a, b)).toBeLessThan(0.9);
    expect(layoutSimilarity(a, a)).toBeCloseTo(1, 5);
  });
});
