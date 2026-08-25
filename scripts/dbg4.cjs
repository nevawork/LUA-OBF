// debug: trace TS reader vs simulated-Lua reader over identical plaintext
const { parse } = require("../dist/lang/parser.js");
const { compileChunk } = require("../dist/vm/compiler.js");
const {
  serializeProto, encryptBlob, decryptBlob, deserializeBlob,
} = require("../dist/vm/serializer.js");
const { protect } = require("../dist/pipeline.js");
const fs = require("fs");

// --- simulate the EMITTED LUA DECODER logic verbatim ---
function luaDecoderSim(D) {
  let pos = 5; // skip marker(3) + version(1); Lua-side 1-based indexing
  const u8 = () => D[pos++];
  const uvar = () => {
    let sh = 0, r = 0;
    while (true) {
      const bt = u8();
      r += bt % 128 * Math.pow(2, sh);
      if (bt < 128) return r;
      sh += 7;
    }
  };
  const svar = () => {
    const u = uvar();
    return u % 2 === 1 ? -(u + 1) / 2 : u / 2;
  };
  const np = uvar();
  console.log("sim np:", np);
  for (let pid = 1; pid <= np; pid++) {
    const pn = u8();
    const va = u8() === 1;
    const nu = uvar();
    const uv = [];
    for (let i = 1; i <= nu; i++) uv.push([u8() === 1 ? 1 : 0, uvar()]);
    const ns = uvar();
    const nc = uvar();
    const c = [];
    for (let i = 1; i <= nc; i++) {
      const tag = u8();
      if (tag === 1) c[i] = true;
      else if (tag === 2) c[i] = false;
      else if (tag === 5 || tag === 6) {
        const ln = uvar();
        let sv = "";
        for (let j = 1; j <= ln; j++) { sv += String.fromCharCode(D[pos]); pos++; }
        c[i] = tag === 5 ? parseFloat(sv) : sv;
        if (pos > D.length) throw new Error(`overrun at const ${i} tag ${tag} ln ${ln}`);
      } else c[i] = null;
    }
    const nk = uvar();
    const k = [];
    for (let i = 1; i <= nk; i++) k.push([u8(), svar(), svar(), svar()]);
    console.log(`sim proto ${pid}: pn=${pn} va=${va} nu=${nu} ns=${ns} nc=${nc} nk=${nk}`);
  }
}

const src = fs.readFileSync("/tmp/kilo/smoke1.lua", "utf8");
const r = protect({ source: src, tier: "silent", seed: "a".repeat(64), watermark: "license-1234" });

// recover plaintext via TS path from manifest seeds & literal
const litMatch = r.lua.match(/local (\w+)="([^\n]{50,})"/);
const lit = litMatch[2];
const bytes = [];
let i = 0;
while (i < lit.length) {
  if (lit[i] === "\\") { bytes.push(parseInt(lit.substr(i + 1, 3), 10)); i += 4; }
  else { bytes.push(lit.charCodeAt(i)); i++; }
}
const man = JSON.parse(Buffer.from(JSON.stringify(r.manifest)).toString());
const plain = decryptBlob(Buffer.from(bytes), r.manifest.seeds);
console.log("plain len:", plain.length);
try {
  const d = deserializeBlob(plain);
  console.log("TS decode OK:", d.flat.length, "protos");
} catch (e) {
  console.log("TS decode FAIL:", e.message);
}
try {
  luaDecoderSim([0, ...Array.from(plain)]);
} catch (e) {
  console.log("LUA sim FAIL:", e.message);
}
