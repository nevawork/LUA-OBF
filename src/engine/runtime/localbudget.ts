// NEVAHEX-VM — runtime module: emitted-code local/upvalue budgets (E1/E2)
//
// Lua hard limits bind every byte of the artifact:
//   • locals per function: 200 on ALL targets (Lua 5.1 luaconf.h LUAI_MAXVARS;
//     Luau enforces the same value since May 2020)
//   • upvalues per closure: 60 on Lua 5.1/LuaJIT (the strictest targets we
//     ship), 200+ elsewhere
// An artifact that exceeds these dies at LOAD with "main function has more
// than 200 local variables" — a worse failure than any obfuscation mistake.
// The governor makes the BUILD fail loudly instead.
//
// Counting strategy is deliberately conservative:
//   • file-chunk count = distinct `local <name>` tokens across the WHOLE
//     artifact, including names declared inside nested frames — an overcount
//     for the main chunk, which is the safe direction
//   • run()-frame count = distinct local declarations inside the extracted
//     run() body slice
//   • upvalue estimate = file-scope names textually referenced inside the
//     run() slice (every such reference is a captured upvalue)

export const FILE_LIMIT = 170; // headroom under 200
export const FRAME_LIMIT = 150; // headroom under 200 within run()
export const UPVALUE_LIMIT = 55; // headroom under 60 (5.1/LuaJIT strictest)

export interface BudgetReport {
  /** distinct `local` names in the whole artifact */
  fileLocals: number;
  /** distinct local declarations inside the run() body */
  frameDeclared: number;
  /** file-scope names referenced inside run() ⇒ captured upvalues */
  upvaluesInRun: number;
  limits: { file: number; frame: number; upvalue: number };
  problems: string[];
  ok: boolean;
}

/** distinct names declared by `local a, b, c` statements in `text` */
export function collectLocals(text: string): Set<string> {
  const out = new Set<string>();
  const re = /\blocal\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    for (const name of m[1].split(/\s*,\s*/)) out.add(name);
  }
  return out;
}

/**
 * @param lua      full emitted artifact
 * @param runText  the extracted run() function body slice
 * @param fileScopeNames every file-scope local the emitter can name
 */
export function checkBudgets(
  lua: string,
  runText: string,
  fileScopeNames: Iterable<string>,
): BudgetReport {
  const problems: string[] = [];

  const fileSet = collectLocals(lua);
  const fileLocals = fileSet.size;
  if (fileLocals > FILE_LIMIT) {
    problems.push(
      `file chunk declares ${fileLocals} locals (budget ${FILE_LIMIT}, Lua limit 200)`,
    );
  }

  const frameSet = collectLocals(runText);
  const frameDeclared = frameSet.size;
  if (frameDeclared > FRAME_LIMIT) {
    problems.push(
      `run() declares ${frameDeclared} locals (budget ${FRAME_LIMIT})`,
    );
  }

  let upvaluesInRun = 0;
  const captured: string[] = [];
  for (const n of fileScopeNames) {
    if (n && runText.includes(n)) {
      upvaluesInRun++;
      captured.push(n);
    }
  }
  if (upvaluesInRun > UPVALUE_LIMIT) {
    problems.push(
      `run() captures ~${upvaluesInRun} upvalues (budget ${UPVALUE_LIMIT}, ` +
        `strictest target limit 60 on Lua 5.1/LuaJIT): ${captured.join(",")}`,
    );
  }

  return {
    fileLocals,
    frameDeclared,
    upvaluesInRun,
    limits: { file: FILE_LIMIT, frame: FRAME_LIMIT, upvalue: UPVALUE_LIMIT },
    problems,
    ok: problems.length === 0,
  };
}

/**
 * Bare (non-IdAllocator) locals the decode shell declares at file/do scope.
 * Kept here so the emitter's E2 input stays honest about what is NOT an
 * upvalue candidate. They are counted for E1 by the regex scan automatically.
 */
export const DECODE_BLOCK_LOCALS: ReadonlySet<string> = new Set([
  "pos", "D", "bn", "sa", "sb", "MM", "sc", "sd", "pv", "sbyte",
  "hdr", "np", "pid2", "pr", "tag", "ln", "bb", "nk", "lrk", "mm",
  "oe", "aw", "b1w", "b2w", "cw", "wa", "wb", "MM2", "wc", "wd",
  "pv2", "wln", "_bs", "sl", "hh", "i", "j",
]);
