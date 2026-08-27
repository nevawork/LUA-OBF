import { LuaFactory } from "wasmoon";

(async () => {
  const src = "return 1+1";
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  // Run with MBA-like junk injected
  const xformSrc = `
local _st=true
local __st=_st
local j=0
if not (9*9+9)%2==0 then
  local js = (3 * 7) - 7
end
return 1+1
`;
  await lua.doString(xformSrc);
  console.log("OK");
})();
