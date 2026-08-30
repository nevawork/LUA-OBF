import type { BuildRng } from "../engine/crypto/prng";

export interface AntiTamperOptions {
  useDebug?: boolean;
}

export interface AntiTamperRuntime {
  generateSanityCheck: () => string;
  apply: (ast: any, pipeline: any) => any;
}

function generateSanityCheck(rng: BuildRng): string {
  const sanityCheckAnswers: boolean[] = [];
  const sanityPasses = rng.int(10) + 1;
  for (let i = 0; i < sanityPasses; i++) {
    sanityCheckAnswers.push(rng.int(2) === 1);
  }
  const primaryCheck = Math.random().toString(36).substring(2, 15);
  const codeParts: string[] = [];

  function addCode(fmt: string, ...args: any[]): void {
    codeParts.push(fmt.replace(/%s/g, () => args.shift()));
  }

  function generateAssignment(idx: number): void {
    const index = Math.min(idx, sanityCheckAnswers.length - 1);
    addCode("            valid = %s;\n", sanityCheckAnswers[index]);
  }

  function generateValidation(idx: number): void {
    const index = Math.min(idx - 1, sanityCheckAnswers.length - 1);
    addCode("            if valid == %s then\n", sanityCheckAnswers[index]);
    addCode("            else\n");
    addCode("                while true do end\n");
    addCode("            end\n");
  }

  addCode("do local valid = '%s';", primaryCheck);
  addCode("for i = 0, %d do\n", sanityPasses);
  for (let i = 0; i <= sanityPasses; i++) {
    if (i === 0) {
      addCode("        if i == 0 then\n");
      addCode("            if valid ~= '%s' then\n", primaryCheck);
      addCode("                while true do end\n");
      addCode("            end\n");
      addCode("            valid = %s;\n", sanityCheckAnswers[0]);
    } else if (i === 1) {
      addCode("        elseif i == 1 then\n");
      addCode("            if valid == %s then\n", sanityCheckAnswers[0]);
      addCode("            end\n");
    } else {
      addCode("        elseif i == %d then\n", i);
      if (i % 2 === 0) {
        generateAssignment(i);
      } else {
        generateValidation(i);
      }
    }
  }
  addCode("        end\n");
  addCode("    end\n");
  addCode("do valid = true end\n");
  return codeParts.join("");
}

export function createAntiTamperRuntime(options: { useDebug?: boolean } = {}) {
  const useDebug = options.useDebug ?? true;

  return {
    generateSanityCheck: (rng: BuildRng) => generateSanityCheck(rng),
    apply: (ast: any, pipeline: any) => {
      // Generate sanity check code
      const code = generateSanityCheck({ int: (n: number) => Math.floor(Math.random() * n) });
      
      // Add anti-debug hooks if enabled
      let debugCode = "";
      if (options.useDebug) {
        const string = Math.random().toString(36).substring(2, 15);
        debugCode = `
            -- Anti Beautify
            local sethook = debug and debug.sethook or function() end;
            local allowedLine = nil;
            local called = 0;
            sethook(function(s, line)
                if not line then return end
                called = called + 1;
                if allowedLine then
                    if allowedLine ~= line then
                        sethook(error, "l", 5);
                    end
                else
                    allowedLine = line;
                end
            end, "l", 5);
            (function() end)();
            (function() end)();
            sethook();
            if called < 2 then valid = false; end
            if called < 2 then valid = false; end

            -- Anti Function Hook
            local funcs = {pcall, string.char, debug.getinfo, string.dump}
            for i = 1, #funcs do
                if debug.getinfo(funcs[i]).what ~= "C" then valid = false; end
                if debug.getupvalue(funcs[i], 1) then valid = false; end
                if pcall(string.dump, funcs[i]) then valid = false; end
            end

            -- Anti Beautify traceback
            local function getTraceback()
                local str = (function(arg) return debug.traceback(arg) end)("RANDOM_STRING");
                return str;
            end

            local traceback = getTraceback();
            valid = valid and traceback:sub(1, traceback:find("\n") - 1) == "RANDOM_STRING";
            local iter = traceback:gmatch(":(%d*):");
            local v, c = iter(), 1;
            for i in iter do
                valid = valid and i == v;
                c = c + 1;
            end
            valid = valid and c >= 2;
        `;
      }

      const code = `
local gmatch = string.gmatch;
local err = function() error("Tamper Detected!") end;

local pcallIntact2 = false;
local pcallIntact = pcall(function() pcallIntact2 = true end) and pcallIntact2;

local random = math.random;
local tblconcat = table.concat;
local unpkg = table and table.unpack or unpack;
local n = random(3, 65);
local acc1 = 0;
local acc2 = 0;
local pcallRet = {pcall(function() local a = ${Math.floor(Math.random() * 16777216)} - "${Math.random().toString(36).substring(2)}" ^ ${Math.floor(Math.random() * 16777216)} return "${Math.random().toString(36).substring(2)}" / a; end)};
local origMsg = pcallRet[2];
local line = tonumber(gmatch(tostring(origMsg), ':(%d*):')());
for i = 1, n do
    local len = math.random(1, 100);
    local n2 = random(0, 255);
    local pos = random(1, len);
    local shouldErr = random(1, 2) == 1;
    local msg = origMsg:gsub(':(%d*):', ':' .. tostring(random(0, 10000)) .. ':');
    local arr = {pcall(function()
        if random(1, 2) == 1 or i == n then
            local line2 = tonumber(gmatch(tostring(({pcall(function() local a = ${Math.floor(Math.random() * 16777216)} - "${Math.random().toString(36).substring(2)}" ^ ${Math.floor(Math.random() * 16777216)} return "${Math.random().toString(36).substring(2)}" / a; end)})[2]), ':(%d*):')());
            valid = valid and line == line2;
        end
        if shouldErr then error(msg, 0); end
        local arr = {};
        for i = 1, len do arr[i] = random(0, 255); end
        arr[pos] = n2;
        return unpkg(arr);
    end)};
    if shouldErr then valid = valid and arr[1] == false and arr[2] == msg; else valid = valid and arr[1]; acc1 = (acc1 + arr[pos + 1]) % 256; acc2 = (acc2 + n2) % 256; end
end
valid = valid and acc1 == acc2;

if valid then else
    repeat
        return (function()
            while true do
                l1, l2 = l2, l1;
                err();
            end
        end)();
    until true;
    while true do
        l2 = random(1, 6);
        if l2 > 2 then l2 = tostring(l1); else l1 = l2; end
    end
    return;
end

-- Anti Function Arg Hook
local obj = setmetatable({}, { __tostring = err });
obj[math.random(1, 100)] = obj;
(function() end)(obj);

repeat until valid;
`;

      return {
        code: code + debugCode,
        ast: null
      };
    }
  };
}

export interface AntiTamperOptions {
  useDebug?: boolean;
}

export function createAntiTamperRuntimeModule(options: AntiTamperOptions = {}) {
  return { createAntiTamperRuntime: (options: AntiTamperOptions) => createAntiTamperRuntime(options) };
}
