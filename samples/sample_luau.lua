--[[
    Sample: Luau (Roblox) compatible script
    This script demonstrates features compatible with Luau/Roblox environment.
    Uses bit32 library for bitwise operations (no native bitwise operators).
    Compatible with Roblox Luau VM and Roblox executors.
]]

-- Luau globals (defined before use)
local Vector3 = {
    new = function(x, y, z) return { x = x, y = y, z = z, Magnitude = math.sqrt(x*x + y*y + z*z) } end,
    zero = { x = 0, y = 0, z = 0, Magnitude = 0 }
}

local TweenInfo = {
    new = function(time, style, direction) return { time = time, style = style, direction = direction } end
}

local Enum = {
    EasingStyle = { Quad = "Quad", Linear = "Linear" },
    EasingDirection = { Out = "Out", In = "In" },
    KeyCode = { E = "E", W = "W", A = "A", S = "S", Space = "Space" }
}

-- Simulated Roblox environment for testing
local game = {
    GetService = function(self, name)
        local services = {
            Workspace = { Gravity = 196.2 },
            Players = {
                LocalPlayer = {
                    UserId = 123456,
                    Name = "TestPlayer",
                    Character = {
                        Humanoid = { WalkSpeed = 16, JumpPower = 50 },
                        HumanoidRootPart = { Position = Vector3.new(0, 5, 0) }
                    }
                }
            },
            RunService = {
                Heartbeat = { Connect = function() end },
                RenderStepped = { Connect = function() end }
            },
            TweenService = {
                Create = function(self, obj, info, props)
                    return { Play = function() end, Completed = { Wait = function() end } }
                end
            },
            UserInputService = {
                InputBegan = { Connect = function() end }
            },
            ReplicatedStorage = {},
            ServerStorage = {}
        }
        return services[name] or {}
    end
}

-- Utility functions using Luau/bit32
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

-- Bitwise operations using bit32 library (Luau standard)
local function bitwiseExample(a, b)
    local band = bit32.band(a, b)
    local bor = bit32.bor(a, b)
    local bxor = bit32.bxor(a, b)
    local bnot = bit32.bnot(a)
    local lshift = bit32.lshift(a, 2)
    local rshift = bit32.rshift(b, 1)
    return {
        band = band,
        bor = bor,
        bxor = bxor,
        bnot = bnot,
        lshift = lshift,
        rshift = rshift
    }
end

local function maxValue(a, b)
    if a > b then return a else return b end
end

local function minValue(a, b)
    if a < b then return a else return b end
end

-- Roblox-style utilities
local function calculateDistance(pos1, pos2)
    local dx = pos1.x - pos2.x
    local dy = pos1.y - pos2.y
    local dz = pos1.z - pos2.z
    return math.sqrt(dx*dx + dy*dy + dz*dz)
end

local function createTween(object, properties, duration, easingStyle, easingDirection)
    local tweenInfo = TweenInfo.new(duration, easingStyle, easingDirection)
    local tween = {
        Play = function() end,
        Completed = { Wait = function() end }
    }
    return tween
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

-- Bitwise operations using bit32 library
local bitwise = bitwiseExample(5, 3)
print("Bitwise 5 & 3:", bitwise.band)
print("Bitwise 5 | 3:", bitwise.bor)
print("Bitwise 5 ^ 3:", bitwise.bxor)
print("Bitwise ~5:", bitwise.bnot)
print("Bitwise 5 << 2:", bitwise.lshift)
print("Bitwise 3 >> 1:", bitwise.rshift)

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

-- Generic for loop with pairs
for key, value in pairs({a = 1, b = 2, c = 3}) do
    print(key, value)
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

-- Roblox-style task library
local task = {
    wait = function(n) return n end,
    spawn = function(f, ...) f(...) end,
    delay = function(n, f) f() end
}

-- Task spawn example
task.spawn(function()
    print("Running in task")
end)

-- Return module for reuse
return {
    fibonacci = fibonacci,
    isPrime = isPrime,
    calculateStats = calculateStats,
    bitwiseExample = bitwiseExample,
    maxValue = maxValue,
    minValue = minValue,
    calculateDistance = calculateDistance,
    createTween = createTween,
    createCounter = createCounter,
    Vec2 = Vec2,
    task = task
}