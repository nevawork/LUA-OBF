// NEVAHEX-VM — protection pipeline orchestrator
import { parse } from "./lang/parser";
import { Chunk } from "./lang/nodes";
import { compileChunk } from "./vm/compiler";
import { Op } from "./vm/opcodes";
import {
  Seeds, serializeProto, encryptBlob, decryptBlob, deserializeBlob,
  spreadWatermark, crc16, normSeed,
} from "./vm/serializer";
import { emitRuntime, Tier } from "./vm/emitter";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, resetCounter, preserveTaskLibrary } from "./transforms";
import { BuildRng, randomNonce, sha256 } from "./gen/prng";
import { planIntegritySlices } from "./protection/antitamper";
import { EnvProfile, bakeProfileSeeds } from "./protection/envkeying";
import { DEFAULT_ANTI_EMULATION } from "./protection/antiemulation";
import { verifyGeneratedDispatch } from "./testing/dispatch-check";

export interface ProtectOptions {
  source: string;
  tier?: Tier;
  /** fixed 256-bit nonce (hex) for deterministic builds */
  seedHex?: string;
  watermark?: string;
  /** transform intensities */
  junkDensity?: number;
  flatten?: boolean;
  /** environmental keying profile (default: universal = disabled) */
  envProfile?: EnvProfile;
  /** anti-emulation timing layer (default: off; ignored for luau profile) */
  antiEmulation?: boolean;
}

export interface Manifest {
  format: "nevahex-manifest";
  version: number;
  nonce: string;
  seeds: number[];
  pbias: number;
  rootPid: number;
  tier: Tier;
  envProfile: EnvProfile;
  integritySlices: number;
  watermark: { seed: number; len: number; crc16: number };
  /** per-build layout fingerprint (handler-diversity metric, spec Phase 1) */
  fingerprint: { perm: number[]; dispatchOrder: number[] };
  createdAt: string;
}

export interface ProtectResult {
  lua: string;
  manifest: Manifest;
  stats: {
    protos: number;
    instructions: number;
    constants: number;
    blobBytes: number;
    outputBytes: number;
  };
}

const DOMAINS = ["blob0", "blob1", "wm", "aux"] as const;

export function protect(opts: ProtectOptions): ProtectResult {
  const chunk: Chunk = parse(opts.source);
  const tier: Tier = opts.tier ?? "silent";

  // ---- per-build CSPRNG material (Addendum 0.3: deterministic, CSPRNG-seeded) ----
  const nonce =
    opts.seedHex
      ? Buffer.from(opts.seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex")
      : randomNonce();
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);

  // ---- Phase T: source transforms (all randomness from the build rng) ----
  resetCounter();
  preserveTaskLibrary(chunk); // spec Phase 2: task as _G[...] (no-op if unused)
  encryptStrings(chunk);
  if (opts.flatten !== false)
    flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, opts.junkDensity ?? 0.12, rng);

  // ---- Phase V: compile to VM bytecode ----
  const root = compileChunk(chunk);

  const seeds: Seeds = [
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
  ];
  const pbias = 1 + rng.int(3);

  // ---- environmental keying (hardened derive-not-compare) ----
  const envProfile: EnvProfile = opts.envProfile ?? "universal";
  // Blob is encrypted with the EFFECTIVE seeds (manifest holds them; they are
  // holder-side secrets). The file embeds BAKED-DOWN literals; at load time the
  // runtime re-derives the fingerprint constant and adds it back, recovering
  // the effective seeds. Wrong environment ⇒ wrong stream ⇒ cryptic failure.
  const encSeeds: Seeds = seeds;
  const embeddedCipherLits: [number, number] | null = envProfile === "universal"
    ? null
    : bakeProfileSeeds([seeds[0], seeds[1]], envProfile);

  // ---- physical opcode permutation applied in-memory ----
  const logicalCount = Object.keys(Op).filter((x) => isNaN(Number(x))).length;
  const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
  const renumber = (p: import("./vm/opcodes").Proto): void => {
    for (const ins of p.code) ins[0] = perm[ins[0]];
    p.protos.forEach(renumber);
  };
  renumber(root);

  // ---- watermark carriers ----
  const wmPayload = opts.watermark ? Buffer.from(opts.watermark, "utf8") : null;
  const wmRegion = wmPayload ? spreadWatermark(wmPayload, seeds[2]) : null;

  // ---- serialize & encrypt ----
  const { plain } = serializeProto(root, wmRegion ?? undefined);
  const blob = encryptBlob(plain, encSeeds);

  // ---- integrity slices over decoded representation ----
  const { flat } = deserializeBlob(decryptBlob(blob, encSeeds));
  const cappedIntegrity = planIntegritySlices(flat);

  // ---- emit runtime ----
  const antiEmu = opts.antiEmulation && envProfile !== "luau"
    ? { ...DEFAULT_ANTI_EMULATION }
    : null;
  const emitted = emitRuntime({
    seeds,
    tier,
    rng,
    blob,
    integrity: cappedIntegrity.map((s) => s as [number, number, number, number]),
    pbias,
    rootPid: 1,
    perm,
    envProfile,
    antiEmulation: antiEmu,
    cipherLiterals: embeddedCipherLits,
  });

  // ---- build-time dispatch self-verification (fail loud, not cryptic) ----
  const usedPhysicalOps = new Set<number>();
  for (const p of flat) for (const q of p.code) usedPhysicalOps.add(q[0]);
  const check = verifyGeneratedDispatch(emitted.lua, perm, usedPhysicalOps);
  if (!check.ok) {
    throw new Error(
      `NEVAHEX internal: generated dispatch failed self-check\n` +
        check.problems.map((p) => `  - ${p}`).join("\n"),
    );
  }

  const manifest: Manifest = {
    format: "nevahex-manifest",
    version: 2,
    nonce: nonce.toString("hex"),
    seeds: seeds.map(normSeed),
    pbias,
    rootPid: 1,
    tier,
    envProfile,
    integritySlices: cappedIntegrity.length,
    fingerprint: { perm, dispatchOrder: emitted.dispatchOrder },
    watermark: {
      seed: normSeed(seeds[2]),
      len: wmPayload ? wmPayload.length : 0,
      crc16: wmPayload ? crc16(wmPayload) : 0,
    },
    createdAt: new Date().toISOString(),
  };

  return {
    lua: emitted.lua,
    manifest,
    stats: {
      protos: flat.length,
      instructions: flat.reduce((n, p) => n + p.code.length, 0),
      constants: flat.reduce((n, p) => n + p.consts.length, 0),
      blobBytes: blob.length,
      outputBytes: Buffer.byteLength(emitted.lua),
    },
  };
}
