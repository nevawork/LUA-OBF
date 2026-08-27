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
import {
  encryptStrings, flattenControlFlow, injectOpaqueJunk, resetCounter,
  preserveTaskLibrary, applyMbaPlus,
} from "./transforms";
import { obfuscateConstants, shuffleConstantPool } from "./transforms/constant-shuffle";
import { obfuscateRegisters } from "./transforms/register-obfuscation";
import { BuildRng, randomNonce, sha256, hmacSha256 } from "./gen/prng";
import { planIntegritySlices, planBlobSlices } from "./protection/antitamper";
import { EnvProfile, bakeProfileSeeds } from "./protection/envkeying";
import { DEFAULT_ANTI_EMULATION } from "./protection/antiemulation";
import { verifyGeneratedDispatch } from "./testing/dispatch-check";
import { computeLayerSeals, LayerSeals } from "./engine/triple/contracts";
import { makeOpenCodeParams, initialRk, stepRk, decodeOp } from "./engine/runtime/opencode";
import { fuseSuperOps, FUSED_ID_BASE, FusedSpec } from "./engine/vm/superops";
import { fuseMegaSuperOps, MegaFusedSpec } from "./engine/vm/superops-mega";

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
  /** corrected MBA+ algebra rewrites (spec summary item 8; default on) */
  mbaPlus?: boolean;
  /** optional string.dump+load dynamic path (Phase 2 exception; off for luau) */
  dynLoad?: boolean;
  /** enforce Triple-VM closure boundaries in the artifact (Phase 3) */
  layered?: boolean;
  /**
   * Phase 4 superoperator fusion (operand-free class). Default OFF until the
   * runtime differential matrix can run; enable with --superops.
   */
  superops?: boolean;
  /**
   * Phase 2: mega superoperator fusion (60–80 instructions, operand-bearing).
   * Enable with --mega-superops. Recursively applies mini fusion afterward.
   */
  megaSuperops?: boolean;
  /**
   * Phase 2: recursion bound for mega→mini→mega nesting (default: 3).
   * Higher values increase obfuscation but also build time.
   */
  superopNesting?: number;
  /**
   * APEX W1.3: route the root invocation through a per-build randomized
   * metamethod (__add/__sub/__mul/__mod) so the entry point hides behind a
   * table trap. One-shot prologue form ⇒ net call depth ≤ +1 on every
   * target including Lua 5.1's ~200-call budget. Default OFF; --mm-traps.
   */
  mmTraps?: boolean;
  /**
   * APEX W1.2 keyless schedule: cipher registers are NEVER emitted as
   * evaluable literals. They are split into additive shares carried by (a)
   * two big-endian components inside the encrypted prologue filler and (b)
   * a decoy number pool with rng-chosen indices. Default OFF; --keyless.
   */
  keyless?: boolean;
  /**
   * APEX W1.1 stage-2: deprecated, no-op (superseded by --v3 / Hex3).
   * Retained for build-line stability: older CI flags still pass.
   */
  stage2?: boolean;
  /**
   * holder mode: include the nonce + cipher seeds in the manifest so watermark
   * extraction can run. Default OFF — artifacts must never ship their own key
   * material, and the historical default wrote both to every manifest.
   */
  emitSecrets?: boolean;
  /**
   * Phase 1: register allocation obfuscation. Inserts copy NOPs, permutes
   * register assignments, and splits live ranges to destroy the
   * register→variable mapping used by deobfuscators.
   */
  regObfuscate?: boolean;
  /**
   * Phase 1: constant pool shuffling. Randomizes constant order and remaps
   * instruction indices, combined with type confusion (numbers→table lengths,
   * strings→MBA).
   */
  constShuffle?: boolean;
  /**
   * Phase 1: mutation engine intensity. Number of handler variants per opcode
   * (default: 50, range: 10-200). Higher = more diversity, larger output.
   */
  mutationCount?: number;
}

/** public manifest fields covered by the authenticity tag */
interface ManifestAuthPayload {
  format: string;
  version: number;
  tier: Tier;
  envProfile: EnvProfile;
  integritySlices: number;
  fingerprint: { perm: number[]; dispatchOrder: number[] };
  layerSeals: LayerSeals;
  watermarkLen: number;
  watermarkCrc16: number;
}

/** stable canonical JSON (sorted object keys) for tagging; exported for verifier tooling */
export function canonicalManifestJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalManifestJson).join(",")}]`;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonicalManifestJson(o[k])}`).join(",")}}`;
  }
  return JSON.stringify(v);
}

export interface Manifest {
  format: "nevahex-manifest";
  version: number;
  tier: Tier;
  envProfile: EnvProfile;
  integritySlices: number;
  watermark: { len: number; crc16: number };
  /** per-build layout fingerprint (handler-diversity metric, spec Phase 1) */
  fingerprint: { perm: number[]; dispatchOrder: number[] };
  /** Triple-VM boundary seals (spec Phase 3) */
  layerSeals: LayerSeals;
  /**
   * HMAC-SHA256(nonce, canonical public fields) hex — proves a manifest
   * belongs to a genuine build without disclosing any key material.
   */
  auth: string;
  createdAt: string;
  // ---- holder-side secrets, present ONLY when built with emitSecrets ----
  nonce?: string;
  seeds?: number[];
  pbias?: number;
  rootPid?: number;
  watermarkSeed?: number;
  /** rolling-key opcode params [rk0, astep, ainc] — holder tooling only */
  opencode?: number[];
  /** instruction-record field keys [OP, A, B1, B2, C] — holder tooling only */
  fieldKeys?: number[];
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
  encryptStrings(chunk, rng);
  if (opts.flatten !== false)
    flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, opts.junkDensity ?? 0.12, rng);
  if (opts.mbaPlus !== false)
    applyMbaPlus(chunk, { rng }); // corrected MBA+ algebra (spec summary item 8)

  // ---- Phase V: compile to VM bytecode ----
  const root = compileChunk(chunk);

  // ---- Phase 1: register allocation obfuscation (post-compilation) ----
  // Inserts copy NOPs, permutes register assignments, splits live ranges.
  if (opts.regObfuscate === true) {
    obfuscateRegisters(root, rng);
  }

  // ---- Phase 1: constant pool obfuscation (AST-level) ----
  // Type confusion: numbers→table lengths, strings→MBA expressions
  if (opts.constShuffle === true) {
    obfuscateConstants(chunk, rng);
  }

  // ---- Phase 4/2: superoperator fusion (logical space, pre-permutation) ----
  // Windows are mined on logical ops; fused heads get ids ≥ FUSED_ID_BASE and
  // member slots become DECL NOPs (positions preserved ⇒ jump offsets valid).
  //
  // Phase 2 mega mode: 60–80 instruction windows with operand-bearing fusion,
  // followed by recursive mini fusion (2–15 instructions) up to the nesting
  // bound. This creates a hierarchical fusion lattice that exponentially
  // increases static-analysis complexity.
  let fusedSpecs: FusedSpec[] = [];
  let megaFusedSpecs: MegaFusedSpec[] = [];
  const useMega = opts.megaSuperops === true;
  const useBaseSuperops = opts.superops !== false && !useMega;

  if (useMega) {
    megaFusedSpecs = fuseMegaSuperOps(root, rng, {
      megaWindow: [60, 80],
      miniWindow: [2, 15],
      recursionBound: opts.superopNesting ?? 3,
      maxFused: 200,
    });
  } else if (useBaseSuperops) {
    fusedSpecs = fuseSuperOps(root, rng);
  }

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
    for (const ins of p.code) {
      // fused superop heads (≥ FUSED_ID_BASE) keep their logical ids here;
      // they receive dedicated physical values from a separate band below
      if (ins[0] < FUSED_ID_BASE) ins[0] = perm[ins[0]];
    }
    p.protos.forEach(renumber);
  };
  renumber(root);

  // fused physical band: unique values ≥500, far above the base ISA and the
  // decoy band (100..~110), well inside the opcode ring (<65536)
  const fusedForEmit: Array<{ phys: number; members: Op[]; operands?: [number, number, number][] }> = [];
  const fusedIdToPhys = new Map<number, number>();
  const allFusedSpecs = [...fusedSpecs, ...megaFusedSpecs];
  if (allFusedSpecs.length > 0) {
    const usedPhys = new Set<number>(perm);
    for (const spec of allFusedSpecs) {
      let phys = 500 + rng.int(40000);
      while (usedPhys.has(phys)) phys = 500 + rng.int(40000);
      usedPhys.add(phys);
      const entry: { phys: number; members: Op[]; operands?: [number, number, number][] } = {
        phys,
        members: spec.members,
      };
      const megaSpec = spec as MegaFusedSpec;
      if (megaSpec.operands && megaSpec.operands.length > 0) {
        entry.operands = megaSpec.operands.map((ins) => [ins[1], ins[2], ins[3]] as [number, number, number]);
      }
      fusedForEmit.push(entry);
      fusedIdToPhys.set(spec.id, phys);
    }
    // Apply physical values to fused ops in the bytecode
    const applyFusedPhys = (p: import("./vm/opcodes").Proto): void => {
      for (const ins of p.code) {
        if (ins[0] >= FUSED_ID_BASE && fusedIdToPhys.has(ins[0])) {
          ins[0] = fusedIdToPhys.get(ins[0])!;
        }
      }
      p.protos.forEach(applyFusedPhys);
    };
    applyFusedPhys(root);
  }

  // ---- Phase 2 dispatch-hardening material ----
  // rolling-key opcode encoder + physical set of jump ops (their B operand
  // is a relative offset and gets share-split on the wire)
  const opencode = makeOpenCodeParams(rng);
  const JUMPY_LOGICAL = [
    Op.JMP, Op.JF, Op.JT, Op.FORPREP, Op.FORLOOP, Op.GFORPREP, Op.GFORLOOP,
  ];
  const jumpOps = new Set<number>(JUMPY_LOGICAL.map((op) => perm[op]));

  // ---- watermark carriers ----
  const wmPayload = opts.watermark ? Buffer.from(opts.watermark, "utf8") : null;
  const wmRegion = wmPayload ? spreadWatermark(wmPayload, seeds[2]) : null;

  // ---- W1.2 keyless share schedule (opt-in --keyless) ----
  // Phase 1.4 hardening: s0 ≡ B ⊕ G1 − X1 (mod M31), s1 ≡ E ⊕ G2 − X2 (mod M31):
  //   B,E ride the encrypted prologue filler (big-endian uint32 pairs);
  //   G1,G2,X1,X2 hide inside a decoy number pool at rng-chosen indices.
  //   XOR mixing and larger pool raise reconstruction cost without changing
  //   the runtime's share-recovery path.
  // No seed literal is ever emitted; recovery requires emulating the
  // prologue layout + pool cross-reference instead of evaluating two parens.
  let prologueShares: [number, number] | undefined;
  let keylessPool: { nums: number[]; i1: number; i2: number; i3: number; i4: number; i5: number; i6: number } | undefined;
  if (opts.keyless !== false) {
    const u32 = (): number => {
      const v =
        rng.int(256) * 16777216 +
        rng.int(256) * 65536 +
        rng.int(256) * 256 +
        rng.int(256);
      return v >>> 0;
    };
    const M = 2147483647;
    const norm = (v: number): number => {
      const r = ((v % (M - 1)) + (M - 1)) % (M - 1);
      return r === 0 ? 1 : r;
    };
    const B = u32();
    const E = u32();
    prologueShares = [B, E];
    const Bn = norm(B);
    const En = norm(E);
    const G1 = norm(rng.int(2147483646) + 1);
    const X1 = norm(G1 - seeds[0] + Bn);
    const G2 = norm(rng.int(2147483646) + 1);
    const X2 = norm(G2 - seeds[1] + En);
    // Phase 1.4: expanded pool with XOR-mixed secondary shares
    const nums = [G1, X1, G2, X2];
    for (let k = 0; k < 12; k++) nums.push(norm(rng.int(2147483646) + 1));
    const idx = rng.shuffle([0, 1, 2, 3, 4, 5]);
    keylessPool = {
      nums,
      i1: idx[0] + 1,
      i2: idx[1] + 1,
      i3: idx[2] + 1,
      i4: idx[3] + 1,
      i5: idx[4] + 1,
      i6: idx[5] + 1,
    };
  }

  // ---- Phase 1: constant pool shuffling (post-compilation, pre-serialization) ----
  // Randomizes constant order and remaps instruction indices after compilation.
  if (opts.constShuffle !== false) {
    shuffleConstantPool(root, rng);
  }

  // ---- serialize & encrypt (wire v3.2: keyed records, split jumps, opE) ----
  const { plain, keys: fieldKeys } = serializeProto(root, wmRegion ?? undefined, {
    rng,
    jumpOps,
    opencode,
    constKey: normSeed(seeds[3]),
    permMap: perm,
    prologueShares,
  });
  const blob = encryptBlob(plain, encSeeds);
  if (process.env.NEVAHEX_DEBUG_OPS) {
    try { require("fs").writeFileSync("/tmp/kilo/blob.bin", blob); } catch {}
  }

  // ---- Phase 5: ciphertext-integrity windows over the ENCRYPTED blob ----
  const blobSlices = tier !== "off" ? planBlobSlices(blob) : [];
  if (process.env.NEVAHEX_DEBUG_OPS) {
    try { require("fs").writeFileSync("/tmp/kilo/slices.json", JSON.stringify(blobSlices)); } catch {}
  }

  // ---- integrity slices over decoded representation ----
  // mirror must reverse operand whitening ⇒ pass the build's rolling-key params
  const { flat } = deserializeBlob(decryptBlob(blob, encSeeds), { opencode });
  const cappedIntegrity = planIntegritySlices(flat);

  // ---- emit runtime ----
  const antiEmu = envProfile !== "luau"
    ? { ...DEFAULT_ANTI_EMULATION }
    : null;
  const emitted = emitRuntime({
    seeds,
    tier,
    rng,
    blob,
    integrity: cappedIntegrity.map((s) => s as [number, number, number, number, number]),
    pbias,
    rootPid: 1,
    perm,
    envProfile,
    antiEmulation: antiEmu,
    cipherLiterals: embeddedCipherLits,
    dynLoad: opts.dynLoad === true && envProfile !== "luau",
    layered: opts.layered === true,
    fieldKeys,
    opencode,
    fused: fusedForEmit.length > 0 ? fusedForEmit : undefined,
    blobSlices,
    mmTraps: opts.mmTraps !== false,
    keylessPool,
    stage2: opts.stage2 === true,
  });

  // ---- build-time dispatch self-verification (fail loud, not cryptic) ----
  // The decoded representation's q[0] is opE (rolling-key encoded). The
  // dispatch arms test against DECODED physical values, so we must translate
  // every (pid, ins_index) opE back to its physical opcode using the same
  // per-frame chain the runtime uses. The translation also produces a
  // position-dependent set of physical ops (each instruction's opE lives in
  // a different rk_i window); the check accepts that an arm literal is hit
  // for ANY expected position.
  const opEToPhys = new Map<number, number>();
  for (const p of flat) {
    let lrk = opencode ? initialRk(opencode, flat.indexOf(p) + 1) : 0;
    for (const ins of p.code) {
      const opE = ins[0];
      const phys = opencode ? decodeOp(opE, lrk) : opE;
      opEToPhys.set(opE, phys);
      if (opencode) lrk = stepRk(opencode, lrk);
    }
  }
  const usedPhysicalOps = new Set<number>(opEToPhys.values());
  if (process.env.NEVAHEX_DUMP_LUA) {
    try { require("fs").writeFileSync(process.env.NEVAHEX_DUMP_LUA, emitted.lua); } catch {}
  }
  const check = verifyGeneratedDispatch(emitted.lua, perm, usedPhysicalOps, {
    encoded: true,
    extraReal: fusedForEmit.map((s) => s.phys),
  });
  if (!check.ok) {
    throw new Error(
      `NEVAHEX internal: generated dispatch failed self-check\n` +
        check.problems.map((p) => `  - ${p}`).join("\n"),
    );
  }

  // ---- Triple-VM boundary seals (Phase 3 contracts) ----
  const layerSeals = computeLayerSeals(emitted.lua);

  // ---- manifest: public fields + authenticity tag; secrets opt-in only ----
  // The historical default shipped the nonce AND all four cipher seeds in
  // every manifest — handing attackers the complete key schedule. Holders who
  // need extraction pass --emit-secrets; everyone else gets an HMAC tag that
  // proves provenance without disclosing keys.
  const emitSecrets = opts.emitSecrets === true;
  const wmLen = wmPayload ? wmPayload.length : 0;
  const wmCrc = wmPayload ? crc16(wmPayload) : 0;
  const authPayload: ManifestAuthPayload = {
    format: "nevahex-manifest",
    version: 3,
    tier,
    envProfile,
    integritySlices: cappedIntegrity.length,
    fingerprint: { perm, dispatchOrder: emitted.dispatchOrder },
    layerSeals,
    watermarkLen: wmLen,
    watermarkCrc16: wmCrc,
  };
  const auth = hmacSha256(
    nonce,
    Buffer.from(canonicalManifestJson(authPayload), "utf8"),
  ).toString("hex");

  const manifest: Manifest = {
    format: "nevahex-manifest",
    version: 3,
    tier,
    envProfile,
    integritySlices: cappedIntegrity.length,
    fingerprint: authPayload.fingerprint,
    layerSeals,
    watermark: { len: wmLen, crc16: wmCrc },
    auth,
    createdAt: new Date().toISOString(),
  };
  if (emitSecrets) {
    manifest.nonce = nonce.toString("hex");
    manifest.seeds = seeds.map(normSeed);
    manifest.pbias = pbias;
    manifest.rootPid = 1;
    manifest.watermarkSeed = normSeed(seeds[2]);
    // holder tooling keys (dispatch analysis / extraction support)
    manifest.opencode = [opencode.rk0, opencode.astep, opencode.ainc];
    manifest.fieldKeys = [fieldKeys.OP, fieldKeys.A, fieldKeys.B1, fieldKeys.B2, fieldKeys.C];
  }

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
