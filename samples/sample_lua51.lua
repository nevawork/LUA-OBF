-- Sample: Basic Lua 5.1 script demonstrating various features
-- This script tests obfuscation with Lua 5.1 operators

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

local numbers = {7, 14, 21, 28, 35, 42, 49, 56, 63, 70}
local stats = calculateStats(numbers)

print("Fibonacci(10):", fibonacci(10))
print("Is 17 prime?", isPrime(17))
print("Stats:", string.format(
    "sum=%.2f, count=%d, min=%.2f, max=%.2f, mean=%.2f, stddev=%.2f",
    stats.sum, stats.count, stats.min, stats.max, stats.mean, stats.stddev
))

local factorial = 1
for i = 1, 10 do
    factorial = factorial * i
end
print("10! =", factorial)

local function reverseString(str)
    local result = ""
    for i = #str, 1, -1 do
        result = result .. str:sub(i, i)
    end
    return result
end

print("Reversed 'hello':", reverseString("hello"))

local env = {
    version = "1.0.0",
    author = "Test",
    config = {
        enabled = true,
        timeout = 30,
        options = {"a", "b", "c"}
    }
}

print("Environment version:", env.version)
print("Config enabled:", env.config.enabled)

return {
    fibonacci = fibonacci,
    isPrime = isPrime,
    calculateStats = calculateStats,
    reverseString = reverseString
}
