import { protect } from "../src/pipeline";
import { LuaFactory } from "wasmoon";
import { decryptBlob, normSeed } from "../src/engine/vm/serializer";

(async () => {
  const r = protect({ source: "EXPECTED={2+3*4,(7-2)/2,10%3,2^10,-(-5)}", tier: "silent", seedHex: "11".repeat(32) });
  // Run the artifact. Then access internal vars via a different means.
  
  // Inject at the start of run() — but we don't have access to global frame vars
  // Better: replace the run() invocation with our own
  // Find the do block that invokes run() and replace it
  
  const lines = r.lua.split("\n");
  // Find the line with "do" before the final run() call (line 130-something)
  // The pattern: 
  //   do
  //    local <args>=<N.pk>(...)
  //    ... call to N.run ...
  //   end
  // Find the do right before the final L2 run call
  // Easier: just run the whole thing and replace the run() with a dump
  
  // Let me run normally and check what the artifact does
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(r.lua);
  } catch (e) {
    console.log("ERR:", String(e.message).split("\n")[0]);
  }
})();
