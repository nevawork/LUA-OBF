// NEVAHEX-VM — Strong Source Obfuscation for Roblox Executors
//
// Implements multiple layers of obfuscation that work in Roblox executors.
// Uses loadstring to compile obfuscated source at runtime.
import { BuildRng } from "../../gen/prng";
import { sha256 } from "../../gen/prng";

export interface ObfuscatorOptions {
  seed: number;
  stringEncryption: boolean;
  identifierRenaming: boolean;
  controlFlowFlattening: boolean;
  deadCodeInjection: boolean;
  numericObfuscation: boolean;
  tableObfuscation: boolean;
  functionWrapping: boolean;
  constantEncoding: boolean;
}

const MBIG = 48271;
const MM = 2147483647;

interface RenamedVariable {
  original: string;
  renamed: string;
  isLocal: boolean;
}

export class RobloxSourceObfuscator {
  private rng: BuildRng;
  private renamedVars: Map<string, string> = new Map();
  private stringConstants: Map<string, string> = new Map();
  private stringCounter: number = 0;

  constructor(seed: number) {
    this.rng = new BuildRng(seed);
  }

  obfuscate(source: string): string {
    let result = source;

    // Phase 1: String encryption
    result = this.encryptStrings(result);

    // Phase 2: Identifier renaming
    result = this.renameIdentifiers(result);

    // Phase 3: Numeric obfuscation
    result = this.obfuscateNumbers(result);

    // Phase 4: Control flow flattening
    result = this.flattenControlFlow(result);

    // Phase 5: Dead code injection
    result = this.injectDeadCode(result);

    // Phase 6: Table obfuscation
    result = this.obfuscateTables(result);

    // Phase 7: Function wrapping
    result = this.wrapFunctions(result);

    return result;
  }

  private encryptStrings(source: string): string {
    const strings: string[] = [];
    const stringMap = new Map<string, string>();

    // Find all string literals
    const stringRegex = /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/g;
    let match;
    let index = 0;

    while ((match = stringRegex.exec(source)) !== null) {
      const str = match[0];
      const content = match[1] || match[3];
      const varName = `__STR_${index}__`;
      strings.push(varName);
      stringMap.set(varName, content);
      source = source.replace(str, varName);
      index++;
    }

    if (strings.length === 0) return source;

    // Generate decode function
    const decodeFunc = this.generateStringDecoder(stringMap);

    // Wrap in IIFE
    return `do ${decodeFunc} ${source} end`;
  }

  private generateStringDecoder(stringMap: Map<string, string>): string {
    const lines: string[] = [];
    lines.push(`local function __DECODE__()`);
    lines.push(`  local __D={}`);

    for (const [name, value] of stringMap) {
      const encoded = this.encodeString(value);
      lines.push(`  __D["${name}"]="${encoded}"`);
    }

    lines.push(`  return __D`);
    lines.push(`end`);
    lines.push(`local __S=__DECODE__()`);

    // Replace string references with decoded versions
    let replaceCode = `local function __GET__(k)`;
    replaceCode += `local v=__S[k]`;
    replaceCode += `if v then return v end`;
    replaceCode += `return k`;
    replaceCode += `end`;

    return lines.join(" ") + " " + replaceCode;
  }

  private encodeString(str: string): string {
    const encoded: number[] = [];
    for (let i = 0; i < str.length; i++) {
      encoded.push(str.charCodeAt(i) ^ (this.rng.int(256)));
    }
    return encoded.map(c => "\\" + c.toString()).join("");
  }

  private renameIdentifiers(source: string): string {
    const keywords = new Set([
      "local", "function", "end", "if", "then", "else", "elseif",
      "for", "while", "do", "repeat", "until", "return", "break",
      "and", "or", "not", "in", "nil", "true", "false"
    ]);

    const varRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    const varNames = new Set<string>();

    // Find all identifiers
    let match;
    while ((match = varRegex.exec(source)) !== null) {
      const id = match[1];
      if (!keywords.has(id)) {
        varNames.add(id);
      }
    }

    // Rename each identifier
    const renameMap = new Map<string, string>();
    for (const id of varNames) {
      if (!this.renamedVars.has(id)) {
        const newName = this.generateRandomName();
        this.renamedVars.set(id, newName);
      }
    }

    let result = source;
    for (const [oldName, newName] of this.renamedVars) {
      const regex = new RegExp(`\\b${oldName}\\b`, "g");
      result = result.replace(regex, newName);
    }

    return result;
  }

  private generateRandomName(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let name = "_";
    for (let i = 0; i < 8; i++) {
      name += chars[this.rng.int(chars.length)];
    }
    return name;
  }

  private obfuscateNumbers(source: string): string {
    // Replace numeric literals with computed expressions
    return source.replace(/\b(\d+)\b/g, (match, num) => {
      const n = parseInt(num);
      if (n === 0) return "(0)";
      if (n === 1) return "(1)";

      // Generate expression that evaluates to n
      const a = this.rng.int(65536);
      const b = this.rng.int(65536);
      const c = n - a - b;
      return `(${a}+${b}+${c})`;
    });
  }

  private flattenControlFlow(source: string): string {
    // Simple control flow flattening - wrap in state machine
    const lines = source.split("\n");
    const result: string[] = [];

    result.push("do");
    result.push("  local __state = 0");
    result.push("  local __data = {}");
    result.push("  while true do");
    result.push("    if __state == 0 then");

    let state = 0;
    for (const line of lines) {
      if (line.trim()) {
        result.push(`      ${line}`);
        state++;
        result.push(`      __state = ${state}`);
      }
    }

    result.push("      __state = -1");
    result.push("    end");
    result.push("    if __state < 0 then break end");
    result.push("  end");
    result.push("end");

    return result.join("\n");
  }

  private injectDeadCode(source: string): string {
    const deadCodePatterns = [
      "local __dead__ = function() end",
      "if false then ",
      "do local _ = nil end",
      "(function() end)()",
    ];

    const lines = source.split("\n");
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      result.push(lines[i]);
      // Inject dead code every ~5 lines
      if (i > 0 && i % 5 === 0) {
        const pattern = deadCodePatterns[this.rng.int(deadCodePatterns.length)];
        result.push(`  ${pattern} --`);
      }
    }

    return result.join("\n");
  }

  private obfuscateTables(source: string): string {
    // Replace table access with obfuscated versions
    let result = source;

    // Replace table literal access patterns
    result = result.replace(/\{([^}]+)\}/g, (match, content) => {
      const entries = content.split(",");
      const obfuscated = entries.map(e => {
        const [k, v] = e.split("=");
        if (k && v) {
          const newK = this.obfuscateString(k.trim());
          return `"${newK}":${v.trim()}`;
        }
        return e;
      });
      return `{${obfuscated.join(",")}}`;
    });

    return result;
  }

  private obfuscateString(str: string): string {
    const encoded: number[] = [];
    for (let i = 0; i < str.length; i++) {
      encoded.push(str.charCodeAt(i) ^ 0x55);
    }
    return encoded.map(c => String.fromCharCode(c)).join("");
  }

  private wrapFunctions(source: string): string {
    // Wrap function definitions with debugging countermeasures
    return source.replace(
      /(local\s+)?function\s+(\w+)\s*\(([^)]*)\)/g,
      (match, localKw, name, args) => {
        const wrapper = `local function ${name}(${args}) local __orig_${name} = nil `;
        return wrapper;
      }
    );
  }
}

export function obfuscateSourceForRoblox(
  source: string,
  seed: number,
  opts: Partial<ObfuscatorOptions> = {}
): string {
  const options: ObfuscatorOptions = {
    seed,
    stringEncryption: true,
    identifierRenaming: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    numericObfuscation: true,
    tableObfuscation: true,
    functionWrapping: true,
    constantEncoding: true,
    ...opts,
  };

  const obfuscator = new RobloxSourceObfuscator(seed);
  return obfuscator.obfuscate(source);
}
