--[[
    Sample: Lua 5.1 compatible script
    This script demonstrates features compatible with standard Lua 5.1.
    No bitwise operators, no goto, no bit32 library.
]]

-- Utility functions (standard Lua 5.1 syntax)
local function fibonacci(n)
    if n <= 1 then
        return n
    end
    return fibonacci(n - 1) + fibonacci(n - 2)
end

local function isPrime(num)
    if num < 2 then
        return false
    end
    for i = 2, math.floor(math.sqrt(num)) do
        if num % i == 0 then
            return false
        end
    end
    return true
end

local function calculateStats(tbl)
    local sum = 0
    local count = 0
    local min = math.huge
    local max = -math.huge

    for _, v in ipairs(tbl) do
        sum = sum + v
        count = count + 1
        if v < min then min = v end
        if v > max then max = v end
    end

    local mean = sum / count
    local variance = 0

    for _, v in ipairs(tbl) do
        variance = variance + (v - mean) ^ 2
    end
    variance = variance / count

    return {
        sum = sum,
        count = count,
        min = min,
        max = max,
        mean = mean,
        variance = variance,
        stddev = math.sqrt(variance)
    }
end

local function maxValue(a, b)
    if a > b then
        return a
    else
        return b
    end
end

local function minValue(a, b)
    if a < b then
        return a
    else
        return b
    end
end

-- Main execution
print("Fibonacci(10):", fibonacci(10))
print("Is 17 prime?", isPrime(17))

local numbers = {7, 14, 21, 28, 35, 42, 49, 56, 63, 70}
local stats = calculateStats(numbers)

print("Stats:", string.format(
    "sum=%.2f, count=%d, min=%.2f, max=%.2f",
    stats.sum, stats.count, stats.min, stats.max
))

-- Math utilities
print("Max(5, 10):", maxValue(5, 10))
print("Min(5, 10):", minValue(5, 10))

-- Table iteration
local config = {
    enabled = true,
    timeout = 30,
    name = "TestConfig"
}

for key, value in pairs(config) do
    print(string.format("Config %s: %s", tostring(key), tostring(value)))
end

-- Generic for loop with ipairs
local fruits = {"apple", "banana", "cherry", "orange"}
for index, fruit in ipairs(fruits) do
    print(string.format("%d: %s", index, fruit))
end

-- Closure example
local function createCounter(initial)
    local count = initial or 0
    return function()
        count = count + 1
        return count
    end
end

local counter = createCounter(0)
print("Counter:", counter(), counter(), counter())

-- Metatable example
local Vec2 = {}
Vec2.__index = Vec2

function Vec2.new(x, y)
    local self = setmetatable({}, Vec2)
    self.x = x
    self.y = y
    return self
end

function Vec2:add(other)
    return Vec2.new(self.x + other.x, self.y + other.y)
end

function Vec2:__add(other)
    return self:add(other)
end

function Vec2:__tostring()
    return string.format("(%g, %g)", self.x, self.y)
end

local v1 = Vec2.new(1, 2)
local v2 = Vec2.new(3, 4)
local v3 = v1 + v2
print("Vector sum:", tostring(v3))

-- Return module
return {
    fibonacci = fibonacci,
    isPrime = isPrime,
    calculateStats = calculateStats,
    maxValue = maxValue,
    minValue = minValue,
    createCounter = createCounter,
    Vec2 = Vec2
}