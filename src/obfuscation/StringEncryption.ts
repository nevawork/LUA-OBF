import type { BuildRng } from "../engine/crypto/prng";

export interface StringEncryptionOptions {
  threshold?: number;
}

export interface EncryptionService {
  encrypt(str: string): { encrypted: string; seed: number };
  genCode(): string;
  param_mul_45: number;
  param_mul_8: number;
  param_add_45: number;
  secret_key_8: number;
}

function primitiveRoot257(idx: number): number {
  let g = 1, m = 128, d = 2 * idx + 1;
  while (m >= 1) {
    g = (g * g * (d >= m ? 3 : 1)) % 257;
    m = Math.floor(m / 2);
    d = d % m;
  }
  return g;
}

export function createEncryptionService(rng: BuildRng): EncryptionService {
  const usedSeeds = new Set<number>();
  const secret_key_6 = rng.int(64);
  const secret_key_7 = rng.int(128);
  const secret_key_44 = rng.int(17592186044416);
  const secret_key_8 = rng.int(256);

  const floor = Math.floor;

  const param_mul_8 = primitiveRoot257(secret_key_7);
  const param_mul_45 = secret_key_6 * 4 + 1;
  const param_add_45 = secret_key_44 * 2 + 1;

  let state_45 = 0;
  let state_8 = 2;
  const prev_values: number[] = [];

  function setSeed(seed_53: number) {
    state_45 = seed_53 % 35184372088832;
    state_8 = seed_53 % 255 + 2;
  }

  function genSeed(): number {
    let seed: number;
    do {
      seed = rng.int(35184372088833);
    } while (usedSeeds.has(seed));
    usedSeeds.add(seed);
    return seed;
  }

  function getRandom32(): number {
    state_45 = (state_45 * param_mul_45 + param_add_45) % 35184372088832;
    do {
      state_8 = (state_8 * param_mul_8) % 257;
    } while (state_8 === 1);
    const r = state_8 % 32;
    const shift = 13 - (state_8 - r) / 32;
    const n = Math.floor(state_45 / Math.pow(2, shift)) % 4294967296 / Math.pow(2, r);
    return Math.floor(n % 1 * 4294967296) + Math.floor(n);
  }

  function getNextPseudoRandomByte(): number {
    if (prev_values.length === 0) {
      const rnd = getRandom32();
      const low_16 = rnd % 65536;
      const high_16 = (rnd - low_16) / 65536;
      prev_values.push(
        low_16 % 256,
        (low_16 - (low_16 % 256)) / 256,
        high_16 % 256,
        (high_16 - (high_16 % 256)) / 256
      );
    }
    return prev_values.pop()!;
  }

  function encrypt(str: string): { encrypted: string; seed: number } {
    const seed = genSeed();
    setSeed(seed);
    const len = str.length;
    const out: string[] = [];
    let prevVal = secret_key_8;
    for (let i = 0; i < len; i++) {
      const byte = str.charCodeAt(i);
      out.push(String.fromCharCode((byte - (getNextPseudoRandomByte() + prevVal)) % 256));
      prevVal = byte;
    }
    return { encrypted: out.join(""), seed };
  }

  function genCode(): string {
    return `do
  ${[
    "local floor = math.floor",
    "local random = math.random",
    "local remove = table.remove",
    "local char = string.char",
    `local state_45 = 0`,
    `local state_8 = 2`,
    "local charmap = {}",
    "local nums = {}"
  ].sort(() => Math.random() - 0.5).join("\n  ")} 
  for i = 1, 256 do
    nums[i] = i;
  end

  repeat
    local idx = random(1, #nums);
    local n = remove(nums, idx);
    charmap[n] = char(n - 1);
  until #nums == 0;

  local prev_values = {}
  local function get_next_pseudo_random_byte()
    if #prev_values == 0 then
      state_45 = (state_45 * ${param_mul_45} + ${param_add_45}) % 35184372088832
      repeat
        state_8 = state_8 * ${param_mul_8} % 257
      until state_8 ~= 1
      local r = state_8 % 32
      local shift = 13 - (state_8 - r) / 32
      local n = floor(state_45 / 2 ^ shift) % 4294967296 / 2 ^ r
      local rnd = floor(n % 1 * 4294967296) + floor(n)
      local low_16 = rnd % 65536
      local high_16 = (rnd - low_16) / 65536
      local b1 = low_16 % 256
      local b2 = (low_16 - b1) / 256
      local b3 = high_16 % 256
      local b4 = (high_16 - b3) / 256
      prev_values = { b1, b2, b3, b4 }
    end
    local prevValuesLen = #prev_values;
    local removed = prev_values[prevValuesLen];
    prev_values[prevValuesLen] = nil;
    return removed;
  end

  local realStrings = {};
  STRINGS = setmetatable({}, {
    __index = realStrings;
    __metatable = nil;
  });
  function DECRYPT(str, seed)
    local realStringsLocal = realStrings;
    if realStringsLocal[seed] then return seed; else
      prev_values = {};
      local chars = charmap;
      state_45 = seed % 35184372088832
      state_8 = seed % 255 + 2
      local len = #str;
      realStringsLocal[seed] = "";
      local prevVal = ${secret_key_8};
      local s = "";
      for i=1, len, 1 do
        prevVal = (string.byte(str, i) + get_next_pseudo_random_byte() + prevVal) % 256
        s = s .. chars[prevVal + 1];
      end
      realStringsLocal[seed] = s;
    end
    return seed;
  end
end`;
  }

  return {
    encrypt,
    param_mul_45,
    param_mul_8,
    param_add_45,
    secret_key_8,
    genCode
  };
}

export function createStringEncryptionRuntime(options: { threshold?: number } = {}) {
  return { 
    CreateEncryptionService: (rng: BuildRng) => createEncryptionService(rng)
  };
}
