import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";

(async () => {
  // Just compile, no transforms
  const root = compileChunk(parse("return 1+1"));
  console.log("root.code:", root.code);
  console.log("root.protos:", root.protos.length);
})();
