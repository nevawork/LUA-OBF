import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Prepend code to print blob var name and bytes
  const init = `
BLOB_NAME = "cl6MKaxm"
BLOB_LEN = #cl6MKaxm
BLOB_FIRST5 = string.byte(cl6MKaxm, 1) .. "," .. string.byte(cl6MKaxm, 2) .. "," .. string.byte(cl6MKaxm, 3) .. "," .. string.byte(cl6MKaxm, 4) .. "," .. string.byte(cl6MKaxm, 5)
`;
  // Run the full artifact
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(init + "\n" + r.lua);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
  console.log("BLOB_NAME:", lua.global.get("BLOB_NAME"));
  console.log("BLOB_LEN:", lua.global.get("BLOB_LEN"));
  console.log("BLOB_FIRST5:", lua.global.get("BLOB_FIRST5"));
})();
