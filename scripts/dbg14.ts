import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={1+1}", tier: "off", seedHex: "11".repeat(32) });
  // Inject a print of the FIRST uvarint call
  const inj = `
PRINT_LOG = ""
local orig_u8 = nil
`;
  // This won't work as a textual injection easily. Let me wrap xOceLLJe
  const wrapCode = r.lua.replace(
    /local function xOceLLJe\(\) local bt=D\[QvBwbzd7_l\] QvBwbzd7_l=QvBwbzd7_l\+1 return bt end/,
    `local function xOceLLJe() local bt=D[QvBwbzd7_l] QvBwbzd7_l=QvBwbzd7_l+1; POS_LOG[#POS_LOG+1]=QvBwbzd7_l-1; return bt end
 POS_LOG = {}`
  );
  console.log("Wrapped:", wrapCode !== r.lua);
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapCode);
    // Read up to ~100 bytes positions
    await lua.doString("PSTR = table.concat(POS_LOG, ',')");
    const pstr = lua.global.get("PSTR") as string;
    const positions = pstr.split(",").map(Number);
    console.log("First 30 reads (positions):", positions.slice(0, 30));
    // Get the byte values at those positions
    await lua.doString("BYTES={}; for i,p in ipairs(POS_LOG) do BYTES[i] = D[p] end");
    await lua.doString("BSTR = table.concat(BYTES, ',')");
    const bstr = lua.global.get("BSTR") as string;
    const bytes = bstr.split(",").map(Number);
    console.log("First 30 read bytes:", bytes.slice(0, 30));
  } catch (e) {
    console.log("ERR:", String(e.message).split(String.fromCharCode(10))[0]);
  } finally {
    lua.global.close();
  }
})();
