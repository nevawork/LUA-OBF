-- NEVAHEX Test Sample - Luau
local function fib(n)
  if n <= 1 then return n end
  return fib(n - 1) + fib(n - 2)
end
local function fact(n)
  if n <= 1 then return 1 end
  return n * fact(n - 1)
end
local t = {1, 2, 3, 4, 5}
local sum = 0
for i, v in ipairs(t) do sum = sum + v end
local result = fib(8) + fact(6) + sum
print("Result: " .. tostring(result))
