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
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, resetCounter } from "./transforms";
import { BuildRng, randomNonce, sha256 } from "./gen/prng";

export interface ProtectOptions {
  source: string;
  tier?: Tier;
  /** fixed 256-bit nonce (hex) for deterministic builds */
  seedHex?: string;
  watermark?: string;
  /** transform intensities */
  junkDensity?: number;
  flatten?: boolean;
}

export interface Manifest {
  format: "nevahex-manifest";
  version: number;
  nonce: string;
  seeds: number[];
  pbias: number;
  rootPid: number;
  tier: Tier;
  integritySlices: number;
  watermark: { seed: number; len: number; crc16: number };
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
  encryptStrings(chunk);
  if (opts.flatten !== false)
    flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, opts.junkDensity ?? 0.12, rng);

  // ---- Phase V: compile to VM bytecode ----
  const root = compileChunk(chunk);

  const seeds: Seeds = [
    rng.int(2147483646) + 1,
    rng.int(2147483646) + 1,
    rng.int(2147483646) + 1,
    rng.int(2147483646) + 1,
  ];
  const pbias = 1 + rng.int(3);

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
  const blob = encryptBlob(plain, seeds);

  // ---- integrity slices over decoded representation ----
  const { flat } = deserializeBlob(decryptBlob(blob, seeds));
  const integrity: [number, number, number, number][] = [];
  const WINDOW = 48;
  for (let pid = 0; pid < flat.length; pid++) {
    const code = flat[pid].code;
    for (let start = 0; start < code.length; start += WINDOW * 4) {
      const a = start + 1; // 1-based inclusive
      const b = Math.min(code.length, start + WINDOW * 4);
      if (a > b) break;
      let h = 2166136261 % 1000000007;
      for (let j = a - 1; j < b; j++) {
        const q = code[j];
        h = (h * 16777619 + q[0] * 31 + q[1] * 7 + q[2] * 3 + q[3]) % 1000000007;
      }
      integrity.push([pid + 1, a, b, h]);
      if (integrity.length >= 64) break;
    }
    if (integrity.length >= 64) break;
  }
  // cap via sampling keeps runtime cost bounded (bounded resource guarantee)
  const cappedIntegrity = integrity.length > 32
    ? Array.from({ length: 32 }, (_, i) => integrity[Math.floor((i * integrity.length) / 32)])
    : integrity;

  // ---- emit runtime ----
  const emitted = emitRuntime({
    seeds,
    tier,
    rng,
    blob,
    integrity: cappedIntegrity.map((s) => s as [number, number, number, number]),
    pbias,
    rootPid: 1,
    perm,
  });

  const manifest: Manifest = {
    format: "nevahex-manifest",
    version: 2,
    nonce: nonce.toString("hex"),
    seeds: seeds.map(normSeed),
    pbias,
    rootPid: 1,
    tier,
    integritySlices: cappedIntegrity.length,
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
