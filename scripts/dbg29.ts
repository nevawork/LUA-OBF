import { protect } from "../src/pipeline";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/engine/vm/compiler";
import { serializeProto, normSeed, encryptBlob } from "../src/engine/vm/serializer";
import { encryptStrings, flattenControlFlow, injectOpaqueJunk, applyMbaPlus, resetCounter } from "../src/transforms";
import { BuildRng, sha256 } from "../src/gen/prng";
import { makeOpenCodeParams } from "../src/engine/runtime/opencode";
import * as opMod from "../src/vm/opcodes";

(async () => {
  const src = "return 1+1";
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  const chunk = parse(src);
  resetCounter();
  encryptStrings(chunk, rng);
  flattenControlFlow(chunk, { keys: () => 1 + rng.int(100000) });
  injectOpaqueJunk(chunk, 0.12, rng);
  applyMbaPlus(chunk, { rng });
  const root = compileChunk(chunk);
  
  const seeds: [number, number, number, number] = [
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
    normSeed(rng.int(2147483646) + 1),
  ];
  const pbias = 1 + rng.int(3);
  const logicalCount = Object.keys(opMod.Op).filter((x) => isNaN(Number(x))).length;
  const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
  const renumber = (p: any) => {
    for (const ins of p.code) ins[0] = perm[ins[0]];
    p.protos.forEach(renumber);
  };
  renumber(root);
  const opencode = makeOpenCodeParams(rng);
  
  const JUMPY_LOGICAL = [opMod.Op.JMP, opMod.Op.JF, opMod.Op.JT, opMod.Op.FORPREP, opMod.Op.FORLOOP, opMod.Op.GFORPREP, opMod.Op.GFORLOOP];
  const jumpOps = new Set<number>(JUMPY_LOGICAL.map((op) => perm[op]));
  
  const { plain, flat, keys } = serializeProto(root, undefined, {
    rng,
    jumpOps,
    opencode,
    constKey: normSeed(seeds[3]),
    permMap: perm,
  });
  console.log("My plain[0..3]:", Array.from(plain.slice(0, 3)));
  console.log("My plain[0] & 0x7f =", plain[0] & 0x7f, "(prologueLen)");
  // np at plain[1 + prologueLen]
  const prologueLen = plain[0] & 0x7f;
  console.log("My plain[1+prologueLen] (np):", plain[1 + prologueLen]);
  console.log("My flat length:", flat.length);
  
  // Now also re-check the artifact
  const r = protect({ source: src, tier: "off", seedHex });
  const m = r.lua.match(/( {2}D\[i\]=\(sbyte\([\w]+,i\)-pv\+256\)%256\n end)/);
  const wrap = m[1] + "\n  do DUMP = {} for i=1,bn do DUMP[i]=D[i] end error('OK') end\n";
  const wrapped = r.lua.replace(m[1], wrap);
  const { LuaFactory } = await import("wasmoon");
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  try {
    await lua.doString(wrapped);
  } catch (e) {
    if (String(e.message).includes("OK")) {
      await lua.doString("DSTR = table.concat(DUMP, ',')");
      const s = lua.global.get("DSTR") as string;
      const arr = s.split(",").map(Number);
      console.log("ARTIFACT D[1..3]:", arr.slice(0, 3));
      console.log("ARTIFACT D[1] & 0x7f:", arr[0] & 0x7f);
      console.log("ARTIFACT D[1+prologueLen]:", arr[1 + (arr[0] & 0x7f)]);
    }
  } finally {
    lua.global.close();
  }
})();
