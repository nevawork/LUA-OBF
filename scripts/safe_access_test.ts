import { LuaFactory } from "wasmoon";

// Simulate the exact safe-access pattern from the emitter
// and test it with nil _ENV, nil _G, and various env states.
const code = `
return (function(...)
 local function egf(e,k) if type(e)~="table" then return end return rawget(e,k) end
 local function egft(e,k) local v=egf(e,k) return type(v)=="table" and v end
 local envAlias=(type(_ENV)=="table" and _ENV) or (type(_G)=="table" and _G) or {}
 local uTbl=egft(envAlias,"table")
 local uup=egf(envAlias,"unpack") or egf(uTbl,"unpack") or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local sStr=egf(egft(envAlias,"string"),"char") or (type(_G)=="table" and egf(egft(_G,"string"),"char")) or string.char
 local sTbl=egf(egft(envAlias,"table"),"concat") or (type(_G)=="table" and egf(egft(_G,"table"),"concat")) or table.concat
 return {uup=uup, char=sStr("65"), concat=sTbl({"a","b"}), envType=type(envAlias)}
end)(...)
`;

async function test(name: string, setup: string) {
  const factory = new LuaFactory();
  const eng = await factory.createEngine();
  const fullCode = setup + "\n" + code;
  try {
    const result = await eng.doString(fullCode);
    console.log(`[${name}] OK ->`, JSON.stringify(result));
  } catch (e: any) {
    console.log(`[${name}] ERR ->`, String(e).split("\n")[0]);
  }
}

async function main() {
  // Normal env
  await test("normal", "");
  // _G is a table but _ENV might be the same
  await test("g_only", "_ENV = _G");
  // Simulate Roblox executor: load with empty env {} so _ENV becomes {}
  // In wasmoon, we can do: load with custom env
  // Actually simpler: just test that the pattern doesn't crash on nil fields
  await test("minimal_env", "_ENV = {string=string, table=table}");
}
main();
