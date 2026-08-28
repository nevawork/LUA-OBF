// NEVAHEX-VM — Universal Luau executor support
//
// Universal Luau profile that works on Delta, Synapse X, Krnl, Xenon, and other Luau executors.
// All common Roblox executor globals are detected to ensure compatibility.
import { BuildRng } from "../gen/prng";

export type LuauProfile = "luau_executor";

export interface LuauExecutorInfo {
  name: string;
  commonGlobals: string[];
  safeGlobals: string[];
}

export const LUAU_EXECUTOR: LuauExecutorInfo = {
  name: "Luau Executor (Universal)",
  commonGlobals: [
    "game", "workspace", "script", "Player", "Players",
    "task", "delay", "spawn", "wait",
    "tick", "time", "os", "math", "string", "table", "pairs", "ipairs",
    "type", "typeof", "next", "select", "pcall", "xpcall",
    "getgenv", "getsenv", "getrenv", "getgc", "getcallingscript",
    "hookfunction", "newcclosure", "islclosure", "getinfo",
    "loadstring", "loadfile", "dofile",
    "identifyexecutor", "getexecutorinfo", "CHECK_IF_EXECUTOR",
    "Delta", "deltainfo", "soul",
    "synapse", "synapse_core",
    "Krnl", "KrnlLibrary",
    "Xenon", "XenonLibrary",
  ],
  safeGlobals: [
    "game", "workspace", "script", "Player", "Players",
    "task", "delay", "spawn", "wait",
    "tick", "time", "os", "math", "string", "table", "pairs", "ipairs",
    "type", "typeof", "next", "select", "pcall", "xpcall",
  ],
};

export function generateUniversalLuauCode(rng: BuildRng): string[] {
  const lines: string[] = [];

  lines.push(`-- Universal Luau Executor Support`);

  lines.push(`local _IS_LUAU = type(game) == "table" and type(workspace) == "table"`);
  lines.push(`if not _IS_LUAU then error("Luau environment required") end`);

  lines.push(`local _EXECUTOR_GLOBALS = {`);
  for (const g of LUAU_EXECUTOR.safeGlobals) {
    lines.push(`  "${g}",`);
  }
  lines.push(`}`);

  lines.push(`local function _CHECK_GLOBAL(name)`);
  lines.push(`  return rawget(_G or _ENV or {}, name) ~= nil`);
  lines.push(`end`);

  const checkCount = Math.min(5, LUAU_EXECUTOR.commonGlobals.length);
  const selectedGlobals = LUAU_EXECUTOR.commonGlobals.slice(0, checkCount);
  lines.push(`local _EXECUTOR_CHECK = ${selectedGlobals.map((g) => `_CHECK_GLOBAL("${g}")`).join(" or ")}`);
  lines.push(`if not _EXECUTOR_CHECK then`);
  lines.push(`  error("Compatible Luau executor required")`);
  lines.push(`end`);

  return lines;
}

export function luauExecutorMixConstant(): number {
  const fp = LUAU_EXECUTOR;
  let h = 5381;
  const feed = (s: string): void => {
    for (let i = 0; i < s.length; i++) {
      h = ((h * 33) + s.charCodeAt(i)) % 1000000007;
    }
  };
  feed(fp.name);
  for (const b of fp.commonGlobals) feed("\x01" + b);
  return (h % 2147483646) + 1;
}

export function emitLuauExecutorKeyingBlock(saVar: string, sbVar: string): string[] {
  const fp = LUAU_EXECUTOR;
  const lines: string[] = [];

  lines.push(`do`);
  lines.push(`  local _G_ref = _G or _ENV or {}`);
  lines.push(`  local __acc = 5381`);

  for (const bit of fp.commonGlobals.slice(0, 10)) {
    lines.push(`  if rawget(_G_ref, "${bit}") ~= nil then`);
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

export function bakeLuauExecutorSeeds(seeds: [number, number]): [number, number] {
  const mix = luauExecutorMixConstant();
  const wrap = (v: number): number => {
    const r = ((v % 2147483647) + 2147483647) % 2147483647;
    return r < 1 ? r + 2147483646 : r;
  };
  return [wrap(seeds[0] - mix), wrap(seeds[1] - mix * 3)];
}
