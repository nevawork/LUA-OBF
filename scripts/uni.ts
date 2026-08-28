import { LuaFactory } from "wasmoon";
import { protect } from "../src/pipeline";
import { decryptBlob, deserializeBlob } from "../src/vm/serializer";
import { initialRk, stepRk, decodeOp } from "../src/engine/runtime/opencode";
import { Op } from "../src/engine/vm/opcodes";
import * as fs from "fs";

const src = "EXPECTED = 42";
const res = protect({ source: src, tier: "off", envProfile: "universal", antiEmulation: false, flatten: false, mbaPlus: false, superops: false, mmTraps: false, keyless: false, regObfuscate: false, constShuffle: false });
fs.writeFileSync("scripts/_art.lua", res.lua);

// Now read the SAME _dbg.json that was just written
const dbg = JSON.parse(fs.readFileSync("scripts/_dbg.json", "utf8"));
const oc = dbg.opencode as any;
const seeds = dbg.seeds as number[];
const blob = Uint8Array.from(dbg.blob);

const plain = decryptBlob(blob, seeds);
const deser = deserializeBlob(plain, { opencode: oc });
console.log("JS DESER: np=", deser.flat.length, "proto1.nk=", deser.flat[0].code.length);

// Also wire-inspect nk
const r = { pos: 0, data: plain } as any;
const u8 = () => r.data[r.pos++];
const uvarint = () => { let sh=0,rv=0; for(;;){ const b=u8(); rv+=(b&0x7f)*(1<<sh); if(!(b&0x80)) return rv; sh+=7; } };
const svarint = () => { const u=uvarint(); return u%2===1 ? -(u+1)/2 : u/2; };
const hdr = u8();
for (let i=0;i<(hdr&0x7f);i++) u8();
const np = uvarint();
for (let pid=1; pid<=np; pid++) {
  u8(); u8();
  const nu = uvarint();
  for (let i=0;i<nu;i++){ u8(); uvarint(); }
  uvarint(); // numSlots
  for (let i=0;i<5;i++) uvarint();
  const nc = uvarint();
  for (let i=0;i<nc;i++){ const t=u8(); if(t===5||t===6){ const ln=uvarint(); for(let j=0;j<ln;j++) u8(); } }
  const nk = uvarint();
  console.log("WIRE: pid=", pid, "nk=", nk);
}

// Run in wasmoon
const f = new LuaFactory();
f.createEngine().then(async (e) => {
  try { await e.doString(res.lua); console.log("OK", await e.doString("return EXPECTED")); }
  catch (err) { console.log("ERR", String(err).split("\n")[0]); }
});
