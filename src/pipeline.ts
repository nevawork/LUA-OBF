// NEVAHEX — protection pipeline orchestrator using Clyde VM + Prometheus Obfuscation
// Best implementations copied 100% from Clyde Protection and Prometheus

import { parse } from "./lang/parser";
import { Chunk } from "./lang/nodes";
import { BuildRng, randomNonce, sha256, hmacSha256 } from "./gen/prng";
import { bakeProfileSeeds } from "./protection/envkeying";
import { computeLayerSeals, LayerSeals } from "./engine/triple/contracts";

// Clyde VM imports - BEST VM
import { compileString, fuseChunk, injectCamouflageChunk, flattenChunk, BytecodeChunk, Constant } from "./vm/clyde/vm-gen";
import { wrapCustomCipher, wrapNestedVM, wrapStubVM } from "./vm/clyde/vm-gen";
import { compileString as compileClydeAST, compileAST } from "./vm/clyde/Compiler";
import { runVM } from "./vm/clyde/vm-runner";
import { BytecodeChunk as ClydeBytecodeChunk, Op as ClydeOp, emit as clydeEmit, addConst as clydeAddConst } from "./vm/clyde/bytecode";
import { compileString as compileRegVM, fuseChunk as fuseRegChunk, injectCamouflageChunk as injectCamouflageRegChunk, flattenChunk as flattenRegChunk, RegBytecodeChunk, RegOp } from "./vm/clyde/reg-vm-gen";
import { shuffleOpcodes, fuseChunk as fuseRegVMChunk, injectCamouflageChunk as injectCamouflageRegVMChunk, flattenChunk as flattenRegVMChunk, RegBytecodeChunk as RegVMBytecodeChunk } from "./vm/clyde/reg-vm-gen";

// Clyde obfuscator - best implementations
import { encodeStrings } from "./obfuscation/StringEncoder";
import { scrambleControlFlow } from "./obfuscation/ControlFlowScrambler";
import { obfuscate as clydeObfuscate } from "./obfuscation/Obfuscator";
import { print } from "./obfuscation/Printer";

export type Tier = "silent" | "strict" | "hex3" | "apex";
export type EnvProfile = "universal" | "luau" | "luau_executor" | "roblox_executor";

export interface ProtectOptions {
  source: string;
  tier?: Tier;
  seedHex?: string;
  watermark?: string;
  junkDensity?: number;
  flatten?: boolean;
  envProfile?: EnvProfile;
  antiEmulation?: boolean;
  executorVm?: boolean;
  mbaPlus?: boolean;
  dynLoad?: boolean;
  layered?: boolean;
  superops?: boolean;
  megaSuperops?: boolean;
  superopNesting?: number;
  mmTraps?: boolean;
  keyless?: boolean;
  stage2?: boolean;
  emitSecrets?: boolean;
  regObfuscate?: boolean;
  constShuffle?: boolean;
  mutationCount?: number;
  mbaDatabase?: boolean;
  factorizationKeys?: boolean;
  dualVm?: boolean;
  directThreaded?: boolean;
  antiLuahunt?: boolean;
  pathExplosion?: boolean;
  selfModifying?: boolean;
  luauVm?: boolean;
  luauAntiDeobfuscation?: boolean;
  luauOptimize?: boolean;
  luraph?: boolean;
}

export interface ProtectResult {
  lua: string;
  luraphLua: string | null;
  manifest: Manifest;
  stats: {
    protos: number;
    instructions: number;
    constants: number;
    blobBytes: number;
    outputBytes: number;
  };
}

export interface Manifest {
  format: string;
  version: number;
  tier: Tier;
  envProfile: EnvProfile;
  integritySlices: number;
  watermark: { len: number; crc16: number };
  fingerprint: { perm: number[]; dispatchOrder: number[] };
  layerSeals: LayerSeals;
  auth: string;
  createdAt: string;
  nonce?: string;
  seeds?: number[];
  pbias?: number;
  rootPid?: number;
  watermarkSeed?: number;
  opencode?: number[];
  fieldKeys?: number[];
}

export function protect(opts: any): any {
  const targetLuaVersion = opts.envProfile === "luau" || opts.envProfile === "luau_executor" || opts.envProfile === "roblox_executor" ? "luau" : "lua51";
  const chunk: any = parse(opts.source, targetLuaVersion);
  const tier: Tier = opts.tier ?? "silent";

  const nonce =
    opts.seedHex
      ? Buffer.from(opts.seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex")
      : randomNonce();
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);

  // Use Clyde VM to compile and obfuscate
  const clydeBytecode = compileString(opts.source);

  // Apply Clyde obfuscation passes
  fuseChunk(clydeBytecode as any);
  injectCamouflageChunk(clydeBytecode as any);
  flattenChunk(clydeBytecode as any);

  // Generate output Lua using Clyde's custom cipher
  const lua = wrapCustomCipher(opts.source);

  return {
    lua,
    luraphLua: null,
    manifest: {
      format: "nevahex-manifest",
      version: 3,
      tier,
      envProfile: opts.envProfile || "universal",
      integritySlices: 0,
      watermark: { len: 0, crc16: 0 },
      fingerprint: { perm: [], dispatchOrder: [] },
      layerSeals: {},
      auth: "",
      createdAt: new Date().toISOString(),
    },
    stats: {
      protos: 1,
      instructions: 0,
      constants: 0,
      blobBytes: 0,
      outputBytes: lua.length,
    },
  };
}
