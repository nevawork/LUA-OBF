import { LuaFactory } from "wasmoon";
import { serializeProto, encryptBlob, decryptBlob, normSeed } from "../src/engine/vm/serializer";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";

(async () => {
  const root = compileChunk(parse("return 1+1"));
  const { plain } = serializeProto(root);
  console.log("plain[0..5]:", Array.from(plain.slice(0, 5)));
  console.log("plain len:", plain.length);
  console.log("plain[0] high bit:", (plain[0] & 0x80) !== 0);
  console.log("plain[0] low 7:", plain[0] & 0x7f);
})();
