// e2e: protect fixtures, run in wasmoon (Lua 5.4), compare EXPECTED against reference values
const { protect } = require("../dist/pipeline.js");
const { LuaFactory } = require("wasmoon");
const fs = require("fs");

async function runCase(name, source, expected, opts) {
  opts = opts || {};
  let r;
  try {
    r = protect({ source: source, tier: opts.tier || "silent", seedHex: opts.seed || "11".repeat(32) });
  } catch (e) {
    console.log("FAIL " + name + ": protect() threw: " + String(e.message).split("\n")[0]);
    return false;
  }
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
    const got = lua.global.getTable("EXPECTED");
    const ok = JSON.stringify(got) === JSON.stringify(expected);
    console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : " got=" + JSON.stringify(got) + " want=" + JSON.stringify(expected)));
    if (!ok && process.env.VERBOSE) fs.writeFileSync("/tmp/kilo/" + name + ".fail.lua", r.lua);
    return ok;
  } catch (e) {
    console.log("FAIL " + name + ": " + String(e.message).split("\n")[0]);
    if (process.env.VERBOSE) fs.writeFileSync("/tmp/kilo/" + name + ".fail.lua", r.lua);
    return false;
  } finally {
    lua.global.close();
  }
}

const CASES = [
  ["arithmetic", "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", [14, 2.5, 1, 1024, 5]],
  ["strings", 'local s="Hello"..",".."World" EXPECTED={s,#s,string.upper(s)}', ["Hello,World", 11, "HELLO,WORLD"]],
  ["closures", [
    "local function counter()",
    "  local n = 0",
    "  return function() n = n + 1 return n end",
    "end",
    "local c1, c2 = counter(), counter()",
    "c1(); c1(); c2()",
    "EXPECTED={c1(), c1(), c2()}",
  ].join("\n"), [3, 4, 2]],
  ["tables", [
    "local t = {1, 2, 3, x=10, y=20}",
    "t[#t+1] = 4",
    "local s = 0",
    "for i=1,#t do s = s + t[i] end",
    "EXPECTED={s, t.x+t.y, #t}",
  ].join("\n"), [10, 30, 4]],
  ["loops", [
    "local acc = {}",
    "for i=10,1,-3 do acc[#acc+1]=i end",
    "local gs = 0",
    "for k,v in ipairs({5,6,7}) do gs = gs + k*v end",
    "local w = 0",
    "for i=0,3 do w = w + i end",
    "EXPECTED={#acc, acc[2], gs, w}",
  ].join("\n"), [3, 7, 38, 6]],
  ["varargs", [
    "local function sum(...) local s=0 for _,v in ipairs({...}) do s=s+v end return s end",
    "EXPECTED={sum(1,2,3)}",
  ].join("\n"), [6]],
  ["methods", [
    "local M = {}",
    "M.__index = M",
    "function M.new(v) return setmetatable({v=v}, M) end",
    "function M.get(self) return self.v end",
    "function M.add(self, n) self.v = self.v + n return self end",
    "local o = M.new(5):add(3):add(2)",
    "EXPECTED={o:get()}",
  ].join("\n"), [10]],
  ["multiple-returns", [
    "local function multi() return 1, 2, 3 end",
    "local a, b = multi()",
    "local t = {multi()}",
    "EXPECTED={a, b, #t}",
  ].join("\n"), [1, 2, 3]],
  ["recursion", [
    "local function fib(n) if n < 2 then return n end return fib(n-1)+fib(n-2) end",
    "local y = {}",
    "for i=1,10 do y[i]=fib(i) end",
    "EXPECTED={fib(15), y[10]}",
  ].join("\n"), [610, 34]],
  ["metatables", [
    'local v = setmetatable({}, {__index=function(t,k) return tostring(k).."!" end, __add=function(a,b) return "added" end})',
    "EXPECTED={v.foo, v + 1}",
  ].join("\n"), ["foo!", "added"]],
  ["break-repeat", [
    "local i, out = 0, {}",
    "repeat",
    "  i = i + 1",
    "  if i > 3 then break end",
    "  out[#out+1] = i * i",
    "until i >= 100",
    "EXPECTED={#out, out[3], i}",
  ].join("\n"), [3, 9, 4]],
  ["shadowing", [
    "local x = 1",
    "do local x = 2",
    "  do local x = 3 SAVED = x end",
    "end",
    "EXPECTED={x, SAVED}",
  ].join("\n"), [1, 3]],
  ["loop-capture", [
    "local fns = {}",
    "for i=1,3 do fns[i] = function() return i end end",
    "EXPECTED={fns[1](), fns[2](), fns[3]()}",
  ].join("\n"), [1, 2, 3]],
  ["and-or", [
    "local t = {x=nil, y=false, z=0}",
    'EXPECTED={(t.x or "d"), (t.y or "e"), (t.z or "f")}',
  ].join("\n"), ["d", "e", 0]],
  ["numeric-for-step", [
    "local s = 0",
    "for i = 1, 10, 0.5 do s = s + 1 end",
    "EXPECTED={s}",
  ].join("\n"), [19]],
  ["upvalue-adder", [
    "local function makeAdder(x) return function(y) return x+y end end",
    "local a5 = makeAdder(5)",
    "EXPECTED={a5(1), a5(-5)}",
  ].join("\n"), [6, 0]],
  ["nested-closures", [
    "local function outer()",
    "  local a = 1",
    "  local function mid()",
    "    local b = 2",
    "    return function() return a + b end",
    "  end",
    "  return mid()",
    "end",
    "EXPECTED={outer()}",
  ].join("\n"), [3]],
];

async function main() {
  let pass = 0;
  let total = 0;
  for (const c of CASES) {
    total++;
    if (await runCase(c[0], c[1], c[2])) pass++;
  }
  // tier variants
  total++;
  if (await runCase("tier-off", "EXPECTED={1+1}", [2], { tier: "off" })) pass++;
  total++;
  if (await runCase("tier-strict", "EXPECTED={1+1}", [2], { tier: "strict" })) pass++;
  // determinism
  total++;
  const a = protect({ source: "return 1", tier: "silent", seedHex: "ab".repeat(32) });
  const b = protect({ source: "return 1", tier: "silent", seedHex: "ab".repeat(32) });
  const det = a.lua === b.lua;
  console.log((det ? "PASS " : "FAIL ") + "determinism");
  if (det) pass++;
  // distinct builds under different seeds
  total++;
  const c = protect({ source: "return 1", tier: "silent", seedHex: "cd".repeat(32) });
  const iso = a.lua !== c.lua;
  console.log((iso ? "PASS " : "FAIL ") + "per-build-isomorphism");
  if (iso) pass++;

  console.log("\n" + pass + "/" + total + " passed");
  process.exitCode = pass === total ? 0 : 1;
}
main();
