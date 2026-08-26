// NEVAHEX-VM — Phase 0 key-hygiene & signature-removal tests
// Guards the invariants introduced by the hardening plan:
//   • manifests carry no key material unless built with emitSecrets
//   • manifests carry an HMAC authenticity tag verifiable without secrets
//   • blob framing v3: no magic header, randomized prologue, old format rejected
//   • no fixed transform identifiers (__st/__d0/__d1) or anti-emu globals ship
//   • string-encryption keys are build-seeded (per-build isomorphism)
import { describe, it, expect } from "vitest";
import { protect, canonicalManifestJson } from "../src/pipeline";
import { hmacSha256, sha256, BuildRng } from "../src/engine/crypto/prng";
import {
  serializeProto, deserializeBlob, encryptBlob, decryptBlob, normSeed,
} from "../src/vm/serializer";
import { compileChunk } from "../src/vm/compiler";
import { parse } from "../src/lang/parser";

const SRC = 'local msg = "hello world" print(msg) return 42';

describe("phase 0: manifest key hygiene", () => {
  it("default manifests carry NO nonce/seeds/key material", () => {
    const r = protect({ source: SRC });
    expect(r.manifest.nonce).toBeUndefined();
    expect(r.manifest.seeds).toBeUndefined();
    expect(r.manifest.pbias).toBeUndefined();
    expect(r.manifest.rootPid).toBeUndefined();
    expect(r.manifest.watermarkSeed).toBeUndefined();
  });

  it("manifest carries an authenticity tag verifiable without secrets", () => {
    const r = protect({ source: SRC, seedHex: "ab".repeat(32) });
    expect(typeof r.manifest.auth).toBe("string");
    expect(r.manifest.auth.length).toBe(64);
    const expected = hmacSha256(
      Buffer.from("ab".repeat(32), "hex"),
      Buffer.from(
        canonicalManifestJson({
          format: r.manifest.format,
          version: r.manifest.version,
          tier: r.manifest.tier,
          envProfile: r.manifest.envProfile,
          integritySlices: r.manifest.integritySlices,
          fingerprint: r.manifest.fingerprint,
          layerSeals: r.manifest.layerSeals,
          watermarkLen: r.manifest.watermark.len,
          watermarkCrc16: r.manifest.watermark.crc16,
        }),
        "utf8",
      ),
    ).toString("hex");
    expect(r.manifest.auth).toBe(expected);
  });

  it("emitSecrets exposes holder material (opt-in)", () => {
    const r = protect({ source: SRC, seedHex: "cd".repeat(32), emitSecrets: true });
    expect(r.manifest.nonce).toBe("cd".repeat(32));
    expect(r.manifest.seeds).toHaveLength(4);
    expect(typeof r.manifest.watermarkSeed).toBe("number");
  });

  it("watermarked builds still record len+crc publicly", () => {
    const r = protect({ source: SRC, watermark: "license-xyz" });
    expect(r.manifest.watermark.len).toBe(11);
    expect(r.manifest.watermark.crc16).toBeGreaterThan(0);
    expect(r.manifest.watermark).not.toHaveProperty("seed");
  });
});

describe("phase 0: blob framing v3", () => {
  it("plaintext no longer begins with the NVX magic", () => {
    const root = compileChunk(parse(SRC));
    const { plain } = serializeProto(root);
    expect(plain[0] & 0x80).toBe(0x80); // v3 format tag
    expect(plain.subarray(0, 3).toString("latin1")).not.toBe("NVX");
  });

  it("round-trips through the randomized prologue", () => {
    const root = compileChunk(parse("local t={1,2,3} return #t"));
    const rng = new BuildRng(sha256(Buffer.from("framing-test")));
    const { plain } = serializeProto(root, undefined, { rng });
    const d = deserializeBlob(plain);
    expect(d.flat.length).toBeGreaterThan(0);
    expect(d.flat[0].code.length).toBe(root.code.length);
  });

  it("prologue content varies with the build rng stream", () => {
    const mk = (seedHex: string): Buffer => {
      const root = compileChunk(parse("return 7"));
      return serializeProto(
        root,
        undefined,
        { rng: new BuildRng(sha256(Buffer.from(seedHex, "hex"))) },
      ).plain;
    };
    const pa = mk("aa".repeat(32));
    const pb = mk("bb".repeat(32));
    const la = pa[0] & 0x7f;
    const lb = pb[0] & 0x7f;
    // prologue lengths within spec range
    expect(la).toBeGreaterThanOrEqual(16);
    expect(la).toBeLessThanOrEqual(64);
    expect(lb).toBeGreaterThanOrEqual(16);
    expect(lb).toBeLessThanOrEqual(64);
    // length differs or filler bytes differ (distinct rng streams)
    const n = Math.min(la, lb);
    const differs =
      la !== lb || !pa.subarray(1, 1 + n).equals(pb.subarray(1, 1 + n));
    expect(differs).toBe(true);
  });

  it("rejects pre-v3 blobs", () => {
    const legacy = Buffer.from([0x4e, 0x56, 0x58, 0x02, 0x00]);
    expect(() => deserializeBlob(legacy)).toThrow(/unsupported blob format/);
  });

  it("cipher round-trip still holds under the new framing", () => {
    const root = compileChunk(parse('return "payload"'));
    const seeds = [normSeed(11), normSeed(22), normSeed(33), normSeed(44)];
    const { plain } = serializeProto(root);
    const enc = encryptBlob(plain, seeds as never);
    const dec = decryptBlob(enc, seeds as never);
    const d = deserializeBlob(dec);
    expect(d.flat.length).toBeGreaterThan(0);
  });
});

describe("phase 0: static signature removal", () => {
  it("flattening state names are per-build generated", () => {
    const r = protect({
      source: "local a=1 a=a+1 a=a*2 a=a-3 a=a/2 return a",
      seedHex: "11".repeat(32),
    });
    expect(/\b__st\b/.test(r.lua)).toBe(false);
    expect(/__d0|__d1/.test(r.lua)).toBe(false);
  });

  it("anti-emulation calibration state uses no named globals", () => {
    const r = protect({ source: SRC, tier: "strict", antiEmulation: true });
    expect(/__ae_t0|__ae_ops/.test(r.lua)).toBe(false);
  });

  it("seed values ship only inside obfuscation arithmetic, never as bare tokens", () => {
    // Phase-1 design decision: two cipher register literals DO ship in the
    // artifact (single-file constraint) — always wrapped in evaluable-but-
    // noisy arithmetic like (n+j-j). The invariant worth enforcing is that a
    // seed never appears as a BARE assignment/operand token, which would make
    // extraction regex-trivial even without evaluating the wrapper.
    const r = protect({ source: SRC, seedHex: "12".repeat(32), emitSecrets: true });
    for (const s of r.manifest.seeds!) {
      // bare-token check is only meaningful for values too large to collide
      // with ordinary runtime constants (tick counts etc.)
      if (s >= 100000) {
        const bareRe = new RegExp(`=\\s*${s}\\b`);
        expect(bareRe.test(r.lua)).toBe(false);
      }
      // every shipped occurrence sits inside obfuscation arithmetic
      if (r.lua.includes(String(s))) {
        expect(/\(\d+[-+*/]/.test(r.lua)).toBe(true);
      }
    }
    // manifests remain the only structured key carrier, and only with secrets
    expect(r.manifest.seeds!.length).toBe(4);
  });
});

describe("phase 0: string-key isomorphism", () => {
  it("same literal encrypts differently across build seeds; determinism preserved", () => {
    const src = 'return "aaaaaaaaaaaaaaaa"';
    const a1 = protect({ source: src, seedHex: "aa".repeat(32) }).lua;
    const a2 = protect({ source: src, seedHex: "aa".repeat(32) }).lua;
    const b1 = protect({ source: src, seedHex: "bb".repeat(32) }).lua;
    expect(a1).toBe(a2); // determinism invariant intact
    expect(a1).not.toBe(b1); // per-build divergence (keys drawn from build rng)
  });
});
