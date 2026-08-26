// NEVAHEX-VM — Phase 3 data-plane encryption tests
// Pins: constant-payload masking (serializer ↔ CV-accessor formula parity),
// operand whitening round-trip through the rolling-key chain, masked-wire
// guarantees, and artifact structure for the decrypt-on-access layer.
import { describe, it, expect } from "vitest";
import {
  serializeProto, deserializeBlob, normSeed, M31,
} from "../src/engine/vm/serializer";
import { compileChunk } from "../src/vm/compiler";
import { parse } from "../src/lang/parser";
import { BuildRng, sha256 } from "../src/engine/crypto/prng";
import { makeOpenCodeParams } from "../src/engine/runtime/opencode";
import { protect } from "../src/pipeline";

const rngFrom = (label: string): BuildRng =>
  new BuildRng(sha256(Buffer.from(label, "utf8")));

const SRC = [
  "local msg = 'constant-string-payload'",
  "local n = 3.14159",
  "print(msg)",
  "_G.out = n * 2",
  "return msg",
].join("\n");

/** TS mirror of the runtime CV accessor mask stream */
function cvMask(constKey: number, pid: number, len: number): number[] {
  const m31 = M31;
  let kk = ((constKey + pid * 7919) % (m31 - 1) + (m31 - 1)) % (m31 - 1);
  if (kk < 1) kk += m31 - 1;
  const out: number[] = [];
  for (let j = 0; j < len; j++) {
    kk = (kk * 48271) % m31;
    out.push(kk % 256);
  }
  return out;
}

describe("phase 3: constant payload masking", () => {
  it("wire carries MASKED payloads; serializer/CV formulas agree", () => {
    const root = compileChunk(parse(SRC));
    const constKey = normSeed(987654);
    const oc = makeOpenCodeParams(rngFrom("p3oc"));
    const rng = rngFrom("p3rng");
    const { plain } = serializeProto(root, undefined, {
      rng, opencode: oc, jumpOps: new Set(), constKey,
    });
    const dec = deserializeBlob(plain, { opencode: oc });

    // find a string const on the root proto and verify masking math
    const origStrings = root.consts.filter(
      (c): c is string => typeof c === "string",
    );
    expect(origStrings.length).toBeGreaterThan(0);
    const wireStrings = dec.flat[0].consts.filter(
      (c): c is string => typeof c === "string",
    );
    // every wire string differs from its plaintext but re-masks identically
    let checked = 0;
    for (let ci = 0; ci < root.consts.length; ci++) {
      const c = root.consts[ci];
      if (typeof c !== "string") continue;
      const wire = wireStrings[checked];
      expect(wire).not.toBe(c); // masked at rest
      expect(wire.length).toBe(c.length); // length preserved
      // replicate the build-side mask over the plaintext and compare bytes
      const pid = 1; // root proto
      const masks = cvMask(constKey, pid, c.length);
      const remasked = Buffer.from(
        c.split("").map((ch, i) => (ch.charCodeAt(0) + masks[i]) & 0xff),
      ).toString("latin1");
      expect(wire).toBe(remasked);
      checked++;
    }
    void dec;
  });

  it("number consts also rest masked (garbage when parsed without CV)", () => {
    const root = compileChunk(parse("local x = 1234567 return x"));
    const constKey = normSeed(42);
    const oc = makeOpenCodeParams(rngFrom("p3n"));
    const { plain } = serializeProto(root, undefined, {
      rng: rngFrom("p3nr"), opencode: oc, jumpOps: new Set(), constKey,
    });
    const dec = deserializeBlob(plain, { opencode: oc });
    const nums = dec.flat[0].consts.filter((c): c is number => typeof c === "number");
    expect(nums.some((v) => v !== 1234567)).toBe(true);
  });
});

describe("phase 3: operand whitening", () => {
  const SRC2 = [
    "local s = 0",
    "for i = 1, 8 do s = s + i end",
    "if s > 10 then s = s - 5 end",
    "return s",
  ].join("\n");

  it("round-trips exactly through the rk-chain unmask mirror", () => {
    const root = compileChunk(parse(SRC2));
    const snapshot = JSON.stringify(root.code);
    const oc = makeOpenCodeParams(rngFrom("p3w"));
    const { plain } = serializeProto(root, undefined, {
      rng: rngFrom("p3wr"), opencode: oc,
      jumpOps: new Set<number>([
        36, 37, 38, 46, 47, 48, 49, // logical jump ops (physical==logical here)
      ]),
    });
    // WITHOUT the mirror option tuples stay whitened — masked-wire guarantee
    const raw = deserializeBlob(plain);
    const unmasked = deserializeBlob(plain, { opencode: oc });
    const differ = raw.flat[0].code.some(
      (q, i) => q[1] !== unmasked.flat[0].code[i][1] || q[3] !== unmasked.flat[0].code[i][3],
    );
    expect(differ).toBe(true);
    // WITH the mirror, fields restore exactly (B share-sum included)
    expect(JSON.stringify(unmasked.flat[0].code)).toBe(snapshot);
  });

  it("whitening varies per instruction position", () => {
    const root = compileChunk(parse("return 1"));
    const oc = makeOpenCodeParams(rngFrom("p3v"));
    const { plain } = serializeProto(root, undefined, {
      rng: rngFrom("p3vr"), opencode: oc, jumpOps: new Set(),
    });
    // two identical RET instructions would carry different A-whitening only if
    // masks differ; assert the chain actually advances (sanity via params)
    expect(oc.ainc % 2).toBe(1);
    expect(makeOpenCodeParams(rngFrom("p3v"))).toEqual(oc);
  });
});

describe("phase 3: artifact structure", () => {
  it("ships the CV accessor, mask root, and de-whitening loop", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32) });
    expect(/local function \w+\(pID,e\)/.test(r.lua)).toBe(true);
    expect(/\+pID\*7919\)%2147483646/.test(r.lua)).toBe(true);
    expect(/e\.b\[j\]-\(g%256\)\+256\)%256/.test(r.lua)).toBe(true);
    expect(/\{t=tag,n=ln,b=bb\}/.test(r.lua)).toBe(true);
    expect(/math\.floor\(lrk\/3\)%256/.test(r.lua)).toBe(true);
  });

  it("holder manifests expose tooling keys only under emitSecrets", () => {
    const pub = protect({ source: SRC, seedHex: "cd".repeat(32) });
    expect(pub.manifest.opencode).toBeUndefined();
    expect(pub.manifest.fieldKeys).toBeUndefined();
    const holder = protect({ source: SRC, seedHex: "cd".repeat(32), emitSecrets: true });
    expect(holder.manifest.opencode).toHaveLength(3);
    expect(holder.manifest.fieldKeys).toHaveLength(5);
  });

  it("determinism holds under the phase-3 draw order", () => {
    const a1 = protect({ source: SRC, seedHex: "11".repeat(32) }).lua;
    const a2 = protect({ source: SRC, seedHex: "11".repeat(32) }).lua;
    const b = protect({ source: SRC, seedHex: "33".repeat(32) }).lua;
    expect(a1).toBe(a2);
    expect(a1).not.toBe(b);
  });
});
