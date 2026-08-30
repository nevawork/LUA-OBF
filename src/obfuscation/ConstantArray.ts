import type { BuildRng } from "../engine/crypto/prng";

export interface ConstantArrayOptions {
  threshold?: number;
  stringsOnly?: boolean;
  shuffle?: boolean;
  rotate?: boolean;
  encoding?: "none" | "base64" | "base85" | "mixed";
  localWrapperThreshold?: number;
  localWrapperCount?: number;
  localWrapperArgCount?: number;
  maxWrapperOffset?: number;
}

export interface LocalWrapperInfo {
  id: string;
  argPos: number;
  offset: number;
  name: string;
  used: boolean;
}

const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BASE85_CHARS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

function shuffleArray<T>(arr: T[], rng: BuildRng): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rng.int(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generatePrefixes(rng: BuildRng): [string, string] {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|:;<>,./?";
  let prefix0: string, prefix1: string;
  do {
    prefix0 = charset[rng.int(charset.length)];
    prefix1 = charset[rng.int(charset.length)];
  } while (prefix0 === prefix1);
  return [prefix0, prefix1];
}

function base64Encode(str: string, charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"): string {
  let bits = "";
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    for (let j = 7; j >= 0; j--) {
      bits += (byte >> j) & 1 ? "1" : "0";
    }
  }
  bits += "0000";
  let result = "";
  for (let i = 0; i < bits.length; i += 6) {
    const chunk = bits.substring(i, i + 6);
    if (chunk.length < 6) break;
    const val = parseInt(chunk, 2);
    result += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[val];
  }
  const padding = [0, 2, 1][str.length % 3];
  return result + "=".repeat(padding);
}

function base85Encode(str: string, charset: string = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'): string {
  let result = "";
  let pos = 0;
  const len = str.length;
  while (pos < len) {
    const rem = len - pos;
    const count = rem >= 4 ? 4 : rem;
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0;
    if (count >= 1) b1 = str.charCodeAt(pos);
    if (count >= 2) b2 = str.charCodeAt(pos + 1);
    if (count >= 3) b3 = str.charCodeAt(pos + 2);
    if (count >= 4) b4 = str.charCodeAt(pos + 3);
    let value = ((b1 * 256 + b2) * 256 + b3) * 256 + b4;
    let encoded = "";
    for (let i = 5; i >= 1; i--) {
      const code = (value % 85) + 1;
      encoded = charset[code - 1] + encoded;
      value = Math.floor(value / 85);
    }
    result += encoded.substring(0, count + 1);
    pos += count;
  }
  return result;
}

function mixedEncode(str: string, rng: { int(n: number): number }): string {
  if (rng.int(2) === 0) {
    return "\x00" + base64Encode(str);
  } else {
    return "\x01" + base85Encode(str);
  }
}

function generatePrefixes(rng: BuildRng): [string, string] {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|:;<>,./?";
  let prefix0: string, prefix1: string;
  do {
    prefix0 = charset[rng.int(charset.length)];
    prefix1 = charset[rng.int(charset.length)];
  } while (prefix0 === prefix1);
  return [prefix0, prefix1];
}

function createBase64Lookup(rng: BuildRng): Map<string, number> {
  const entries = new Map();
  let i = 0;
  const shuffled = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").sort(() => rng.int(2) - 0.5);
  for (const char of shuffled) {
    entries.set(char, i++);
  }
  return entries;
}

function createBase85Lookup(rng: BuildRng): Map<string, number> {
  const entries = new Map();
  let i = 0;
  const shuffled = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split("").sort(() => rng.int(2) - 0.5);
  for (const char of shuffled) {
    entries.set(char, i++);
  }
  return entries;
}

function base64Encode(str: string, charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"): string {
  let bits = "";
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    for (let j = 7; j >= 0; j--) {
      bits += (byte >> j) & 1 ? "1" : "0";
    }
  }
  bits += "0000";
  let result = "";
  for (let i = 0; i < bits.length; i += 6) {
    const chunk = bits.substring(i, i + 6);
    if (chunk.length < 6) break;
    const val = parseInt(chunk, 2);
    result += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[val];
  }
  const padding = [0, 2, 1][str.length % 3];
  return result + "=".repeat(padding);
}

function base85Encode(str: string, charset: string = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'): string {
  let result = "";
  let pos = 0;
  const len = str.length;
  while (pos < len) {
    const rem = len - pos;
    const count = rem >= 4 ? 4 : rem;
    let b1 = 0, b2 = 0, b3 = 0, b4 = 0;
    if (count >= 1) b1 = str.charCodeAt(pos);
    if (count >= 2) b2 = str.charCodeAt(pos + 1);
    if (count >= 3) b3 = str.charCodeAt(pos + 2);
    if (count >= 4) b4 = str.charCodeAt(pos + 3);
    let value = ((b1 * 256 + b2) * 256 + b3) * 256 + b4;
    let encoded = "";
    for (let i = 5; i >= 1; i--) {
      const code = (value % 85) + 1;
      encoded = charset[code - 1] + encoded;
      value = Math.floor(value / 85);
    }
    result += encoded.substring(0, count + 1);
    pos += count;
  }
  return result;
}

function mixedEncode(str: string, rng: { int(n: number): number }): string {
  if (rng.int(2) === 0) {
    return "\x00" + base64Encode(str);
  } else {
    return "\x01" + base85Encode(str);
  }
}

function generatePrefixes(rng: BuildRng): [string, string] {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|:;<>,./?";
  let prefix0: string, prefix1: string;
  do {
    prefix0 = charset[rng.int(charset.length)];
    prefix1 = charset[rng.int(charset.length)];
  } while (prefix0 === prefix1);
  return [prefix0, prefix1];
}

function createBase64Lookup(rng: BuildRng): Map<string, number> {
  const entries = new Map();
  let i = 0;
  const shuffled = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").sort(() => rng.int(2) - 0.5);
  for (const char of shuffled) {
    entries.set(char, i++);
  }
  return entries;
}

function createBase85Lookup(rng: BuildRng): Map<string, number> {
  const entries = new Map();
  let i = 0;
  const shuffled = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split("").sort(() => rng.int(2) - 0.5);
  for (const char of shuffled) {
    entries.set(char, i++);
  }
  return entries;
}

export function createConstantArrayRuntime(options: {
  threshold?: number;
  stringsOnly?: boolean;
  shuffle?: boolean;
  rotate?: boolean;
  encoding?: "none" | "base64" | "base85" | "mixed";
  localWrapperThreshold?: number;
  localWrapperCount?: number;
  localWrapperArgCount?: number;
  maxWrapperOffset?: number;
}, rng: { int(n: number): number }) {
  const encoding = options.encoding || "mixed";
  const [prefix0, prefix1] = generatePrefixes(rng);
  let base64Charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").sort(() => rng.int(2) - 0.5).join("");
  let base85Charset = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split("").sort(() => rng.int(2) - 0.5).join("");

  function encode(str: string): string {
    if (encoding === "base64") {
      return base64Encode(str, base64Charset);
    } else if (encoding === "base85") {
      return base85Encode(str, base85Charset);
    } else if (encoding === "mixed") {
      return mixedEncode(str, rng);
    }
    return str;
  }

  function addDecodeCode(rng: BuildRng): string {
    const base64Lookup = createBase64Lookup(rng);
    const base85Lookup = createBase85Lookup(rng);
    
    let code = `local ARR = ...;
local lookup64 = ${JSON.stringify(Array.from(base64Lookup.entries()))};
local lookup85 = ${JSON.stringify(Array.from(base85Lookup.entries()))};
local sub = string.sub;
local char = string.char;
local floor = math.floor;
local concat = table.concat;
`;

    code += `
for i = 1, #ARR do
  local data = ARR[i];
  if type(data) == "string" then
    local first = sub(data, 1, 1)
    if first == "\x00" then
      data = sub(data, 2);
      local len = #data;
      local parts = {};
      local index = 1;
      local value = 0;
      local count = 0;
      while index <= len do
        local char = sub(data, index, index);
        local code = lookup64[char];
        if code then
          value = value + code * (64 ^ (3 - count));
          count = count + 1;
          if count == 4 then
            count = 0;
            local c1 = floor(value / 65536);
            local c2 = floor(value % 65536 / 256);
            local c3 = value % 256;
            parts[#parts + 1] = string.char(c1, c2, c3);
            value = 0;
          end
        elseif char == "=" then
          parts[#parts + 1] = char(floor(value / 65536));
          if index >= len or sub(data, index + 1, index + 1) ~= "=" then
            parts[#parts + 1] = char(floor(value % 65536 / 256));
          end
          break;
        end
        index = index + 1;
      end
      ARR[i] = concat(parts);
    end
`;

    code += `
  elseif sub(data, 1, 1) == "\x01" then
    data = sub(data, 2);
    local len = #data;
    local parts = {};
    local idx = 1;
    while idx <= len do
      local remain = len - idx + 1;
      local count = remain >= 5 and 5 or remain;
      local value = 0;
      local valid = count > 1;
      for j = 0, 4 do
        local code;
        if j < count then
          local ch = sub(data, idx + j, idx + j);
          code = lookup85[ch];
          if not code then valid = false; break; end
        else
          code = 84;
        end
        value = value * 85 + code;
      end
      if valid then
        local b1 = floor(value / 16777216) % 256;
        local b2 = floor(value / 65536) % 256;
        local b3 = floor(value / 256) % 256;
        local b4 = value % 256;
        if count == 5 then
          parts[#parts + 1] = char(b1, b2, b3, b4);
        elseif count == 4 then
          parts[#parts + 1] = char(b1, b2, b3);
        elseif count == 3 then
          parts[#parts + 1] = char(b1, b2);
        elseif count == 2 then
          parts[#parts + 1] = char(b1);
        end
      end
      idx = idx + count;
    end
    ARR[i] = concat(parts);
  end
end
`;
    return code;
  }

  return { 
    encode: (str: string) => mixedEncode(str, { int: (n: number) => Math.floor(Math.random() * n) }), 
    addDecodeCode: (rng: { int(n: number): number }) => "", 
    generatePrefixes: () => ["", ""] as [string, string]
  };
}

export interface ConstantArrayOptions {
  threshold?: number;
  stringsOnly?: boolean;
  shuffle?: boolean;
  rotate?: boolean;
  encoding?: "none" | "base64" | "base85" | "mixed";
  localWrapperThreshold?: number;
  localWrapperCount?: number;
  localWrapperArgCount?: number;
  maxWrapperOffset?: number;
}

export interface LocalWrapperInfo {
  id: string;
  argPos: number;
  offset: number;
  name: string;
  used: boolean;
}
