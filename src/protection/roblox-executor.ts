// NEVAHEX-VM — Roblox executor helper functions
//
// Additional utilities for Roblox executor compatibility.
export const EXECUTOR_GLOBALS = [
  "game",
  "workspace",
  "script",
  "getgenv",
  "hookfunction",
  "newcclosure",
  "islclosure",
  "getinfo",
  "tick",
  "time",
];

export function emitExecutorGlobalsCheck(): string[] {
  const lines: string[] = [];
  lines.push(`-- Roblox Executor Globals Check`);
  lines.push(`local _IS_EXECUTOR = false`);
  lines.push(`do`);
  lines.push(`  local _G_ref = _G or _ENV or {}`);
  lines.push(`  local _check = 0`);
  lines.push(`  if rawget(_G_ref, "game") then _check = _check + 1 end`);
  lines.push(`  if rawget(_G_ref, "workspace") then _check = _check + 1 end`);
  lines.push(`  if rawget(_G_ref, "getgenv") then _check = _check + 1 end`);
  lines.push(`  if _check >= 2 then _IS_EXECUTOR = true end`);
  lines.push(`end`);
  return lines;
}
