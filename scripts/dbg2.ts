import { decryptBlob, deserializeBlob } from "../src/vm/serializer";
import * as fs from "fs";

const dbg = JSON.parse(fs.readFileSync("scripts/_dbg.json", "utf8"));
const seeds = dbg.seeds as number[];
const blob = Uint8Array.from(dbg.blob);

const plain = decryptBlob(blob, seeds);
const deser = deserializeBlob(plain, { opencode: dbg.opencode });

console.log("np from deserializer:", deser.flat.length);
for (let pid = 0; pid < deser.flat.length; pid++) {
  const p = deser.flat[pid];
  console.log(`proto ${pid+1}: code.length=${p.code.length} protos=${(p as any).protos?.length ?? 0}`);
  for (let i = 0; i < Math.min(p.code.length, 12); i++) {
    console.log(`  i=${i} raw=[${p.code[i].join(",")}]`);
  }
}

// Also inspect wire bytes directly around where instructions should be
const r = { pos: 0, data: plain } as any;
const u8 = () => r.data[r.pos++];
const uvarint = () => { let sh=0,rv=0; for(;;){ const b=u8(); rv+=(b&0x7f)*(1<<sh); if(!(b&0x80)) return rv; sh+=7; } };
const svarint = () => { const u=uvarint(); return u%2===1 ? -(u+1)/2 : u/2; };

const hdr = u8();
const prologueLen = hdr & 0x7f;
for (let i=0;i<prologueLen;i++) u8();
const np = uvarint();
console.log("\n=== WIRE INSPECTION ===");
console.log("hdr", hdr, "prologueLen", prologueLen, "np", np);
for (let pid=1; pid<=Math.min(np,2); pid++) {
  u8(); u8();
  const nu=uvarint();
  for(let i=0;i<nu;i++){ u8(); uvarint(); }
  uvarint(); // numSlots
  for(let i=0;i<5;i++) uvarint(); // field keys
  const nc=uvarint();
  for(let i=0;i<nc;i++){ const tag=u8(); if(tag===5||tag===6){ const ln=uvarint(); for(let j=0;j<ln;j++) u8(); } }
  const nk=uvarint();
  console.log(`pid=${pid} nu=${nu} nc=${nc} nk=${nk}`);
  const instrs:number[][] = [];
  for(let i=0;i<nk;i++){
    const opE=uvarint();
    const aw=svarint();
    const b1w=svarint();
    const b2w=svarint();
    const cw=svarint();
    instrs.push([opE,aw,b1w,b2w,cw]);
  }
  console.log("first 7 raw instructions:", JSON.stringify(instrs.slice(0,7)));
}
