-- CI smoke fixture: exercises closures, loops, tables, varargs, methods
local function fib(n)
  if n < 2 then return n end
  return fib(n - 1) + fib(n - 2)
end

local M = {}
M.__index = M
function M.new(v) return setmetatable({ v = v }, M) end
function M.add(self, n) self.v = self.v + n return self end
function M.get(self) return self.v end

local t = {}
for i = 1, 10 do t[i] = fib(i) end

local function sum(...)
  local s = 0
  for _, v in ipairs({ ... }) do s = s + v end
  return s
end

local o = M.new(5):add(3):add(2)
EXPECTED = { fib(12), t[10], sum(1, 2, 3), o:get() }
