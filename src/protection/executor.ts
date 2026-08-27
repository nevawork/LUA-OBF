// NEVAHEX-VM — Roblox executor targeting
//
// Supports Delta, Synapse X, Krnl, and Xenon executors with proper
// environment fingerprints and anti-analysis measures.
import { BuildRng } from "../gen/prng";

export type ExecutorProfile = "delta" | "synapse_x" | "krnl" | "xenon";

export type EnvProfile = "lua51" | "luajit" | "luau" | "universal" | ExecutorProfile;

export interface ExecutorInfo {
  name: string;
  version: string;
  bits: string[];
  hasFFI: boolean;
  hasBitLib: boolean;
  hasJIT: boolean;
  antiDebugHints: string[];
  recommendedTier: "silent" | "strict";
}

export const EXECUTORS: Record<ExecutorProfile, ExecutorInfo> = {
  delta: {
    name: "Delta",
    version: "Luau",
    bits: ["Delta", "deltainfo", "soul", "identifyexecutor", "getgenv", "hookfunction", "newcclosure", " islxb"],
    hasFFI: false,
    hasBitLib: true,
    hasJIT: true,
    antiDebugHints: ["synapse", "krnl", "electron"],
    recommendedTier: "silent",
  },
  synapse_x: {
    name: "Synapse X",
    version: "Luau",
    bits: ["synapse", "getgenv", "hookfunction", "newcclosure", "islclosure", "loadstring"],
    hasFFI: false,
    hasBitLib: true,
    hasJIT: true,
    antiDebugHints: ["delta", "krnl", "xenon", "electron"],
    recommendedTier: "silent",
  },
  krnl: {
    name: "Krnl",
    version: "Luau",
    bits: ["Krnl", "getgenv", "hookfunction", "newcclosure", "islclosure", "Framerate"],
    hasFFI: true,
    hasBitLib: false,
    hasJIT: false,
    antiDebugHints: ["synapse", "delta", "electron"],
    recommendedTier: "silent",
  },
  xenon: {
    name: "Xenon",
    version: "Luau",
    bits: ["Xenon", "getgenv", "hookfunction", "newcclosure", "islclosure"],
    hasFFI: false,
    hasBitLib: true,
    hasJIT: true,
    antiDebugHints: ["synapse", "delta", "krnl", "electron"],
    recommendedTier: "silent",
  },
};

export function isExecutorProfile(profile: string): profile is ExecutorProfile {
  return profile in EXECUTORS;
}

export function getExecutorInfo(profile: ExecutorProfile): ExecutorInfo {
  return EXECUTORS[profile];
}

export function executorFingerprint(profile: ExecutorProfile): { version: string; bits: string[] } {
  const info = EXECUTORS[profile];
  return {
    version: info.version,
    bits: info.bits,
  };
}

export function generateExecutorSpecificCode(
  profile: ExecutorProfile,
  rng: BuildRng,
): string[] {
  const info = EXECUTORS[profile];
  const lines: string[] = [];

  lines.push(`-- Executor target: ${info.name}`);

  lines.push(`local _EXECUTOR = "${info.name}"`);

  if (info.hasBitLib) {
    lines.push(`local _HAS_BIT = bit ~= nil`);
  } else {
    lines.push(`local _HAS_BIT = false`);
  }

  if (info.hasFFI) {
    lines.push(`local _HAS_FFI = pcall(function() return require("ffi") end)`);
  } else {
    lines.push(`local _HAS_FFI = false`);
  }

  lines.push(`local _IS_EXECUTOR = `);

  const executorChecks = info.bits.slice(0, 3).map((b) => `rawget(_G, "${b}")`).join(" and ");
  lines.push(`  ${executorChecks}`);

  lines.push(`if not _IS_EXECUTOR then`);
  lines.push(`  error("Script requires ${info.name}")`);
  lines.push(`end`);

  return lines;
}

export function detectExecutor(): ExecutorProfile | null {
  if (typeof globalThis !== "undefined") {
    const globals = Object.keys(globalThis);
    if (globals.includes("Delta")) return "delta";
    if (globals.includes("synapse")) return "synapse_x";
    if (globals.includes("Krnl")) return "krnl";
    if (globals.includes("Xenon")) return "xenon";
  }
  return null;
}

export function executorMixConstant(profile: ExecutorProfile): number {
  const fp = executorFingerprint(profile);
  let h = 5381;
  const feed = (s: string): void => {
    for (let i = 0; i < s.length; i++) {
      h = ((h * 33) + s.charCodeAt(i)) % 1000000007;
    }
  };
  if (fp.version) feed(fp.version);
  for (const b of fp.bits) feed("\x01" + b);
  return (h % 2147483646) + 1;
}

export function emitExecutorKeyingBlock(
  profile: ExecutorProfile,
  saVar: string,
  sbVar: string,
): string[] {
  const fp = executorFingerprint(profile);
  const lines: string[] = [];

  lines.push(`do`);
  lines.push(`  local __ex = _G or _ENV or {}`);
  lines.push(`  local __acc = 5381`);

  for (const bit of fp.bits) {
    lines.push(`  if rawget(__ex, "${bit}") ~= nil then`);
    lines.push(`    __acc = (__acc * 33 + 1) % 1000000007`);
    lines.push(`  else`);
    lines.push(`    __acc = (__acc * 33 + 2) % 1000000007`);
    lines.push(`  end`);
  }

  lines.push(`  __acc = __acc % 2147483646 + 1`);
  lines.push(`  ${saVar} = (${saVar} + __acc) % 2147483647`);
  lines.push(`  if ${saVar} < 1 then ${saVar} = ${saVar} + 2147483646 end`);
  lines.push(`  ${sbVar} = (${sbVar} + __acc * 3) % 2147483647`);
  lines.push(`  if ${sbVar} < 1 then ${sbVar} = ${sbVar} + 2147483646 end`);
  lines.push(`end`);

  return lines;
}

export function bakeExecutorSeeds(
  seeds: [number, number],
  profile: ExecutorProfile,
): [number, number] {
  const mix = executorMixConstant(profile);
  const wrap = (v: number): number => {
    const r = ((v % 2147483647) + 2147483647) % 2147483647;
    return r < 1 ? r + 2147483646 : r;
  };
  return [wrap(seeds[0] - mix), wrap(seeds[1] - mix * 3)];
}
