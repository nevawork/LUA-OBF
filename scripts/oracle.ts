import * as fs from "fs";

const code = fs.readFileSync("scripts/_gen_lit.lua", "utf8");

// Find the blob assignment: local <name>="..." and parse the Lua short string properly.
const start = code.indexOf(`hWn6VMkdvV="`) + `hWn6VMkdvV=`.length; // points at opening quote
// start now points at the opening '"'; parse from there.
const parseLuaShortString = (src: string, from: number): { bytes: number[]; next: number } => {
  let i = from + 1; // skip opening quote
  const out: number[] = [];
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") {
      const c2 = src[i+1];
      if (c2 === "0") { out.push(0); i += 2; }
      else if (c2 === "n") { out.push(10); i += 2; }
      else if (c2 === "t") { out.push(9); i += 2; }
      else if (c2 === "r") { out.push(13); i += 2; }
      else if (c2 === "a") { out.push(7); i += 2; }
      else if (c2 === "b") { out.push(8); i += 2; }
      else if (c2 === "f") { out.push(12); i += 2; }
      else if (c2 === "v") { out.push(11); i += 2; }
      else if (c2 === "z") { i += 2; while (i < src.length && /\s/.test(src[i])) i++; }
      else if (c2 === "\\" || c2 === '"' || c2 === "'") { out.push(c2.charCodeAt(0)); i += 2; }
      else if (c2 >= "0" && c2 <= "9") {
        let num = "";
        let j = i + 1;
        while (j < src.length && src[j] >= "0" && src[j] <= "9" && num.length < 3) { num += src[j]; j++; }
        out.push(parseInt(num, 10) & 0xff);
        i = j;
      } else { out.push(c2.charCodeAt(0)); i += 2; }
    } else if (c === '"') {
      return { bytes: out, next: i + 1 };
    } else {
      out.push(c.charCodeAt(0));
      i += 1;
    }
  }
  return { bytes: out, next: i };
};
const { bytes: blob } = parseLuaShortString(code, start);

// opencode params from file
const rk0 = 2557, astep = 1604753, astep2 = 1312161, ainc = 225217;
const MM = 2147483647;

// cipher v3 decrypt (mirror of emitter lines 45-50)
const sa0 = 1384004517, sb0 = 1048807853;
const norm = (v:number)=>{ const m=MM-1; const r=((v%m)+m)%m; return r===0?1:r; };
let sa = norm(sa0), sb = norm(sb0);
let sc = (sa*31+sb)%MM, sd=(sb*17+sa)%MM, pv=0;
const D: number[] = [0]; // 1-indexed
for (let i=1; i<=blob.length; i++) {
  sa=(sa*48271)%MM; sb=(sb*69621)%MM; sc=(sc*2994349)%MM; sd=(sd*4050403)%MM;
  sb=(sb+pv)%MM; sc=(sc+sa)%MM;
  pv=(Math.floor(sa/65536)*31+Math.floor(sb/2048)*17+Math.floor(sc/1024)*7+Math.floor(sd/256)*3+pv)%256;
  D[i]=(blob[i-1]-pv+256)%256;
}

let pos = 1;
const u8 = () => D[pos++];
const uvarint = () => { let sh=0,r=0; for(;;){ const b=u8(); r+=(b&0x7f)*(2**sh); if(!(b&0x80)) return r; sh+=7; } };
const svarint = () => { const u=uvarint(); return u%2===1 ? -(u+1)/2 : u/2; };

const hdr = u8();
const prologueLen = hdr & 0x7f;
for (let i=0;i<prologueLen;i++) u8();
const np = uvarint();
console.log("prologueLen", prologueLen, "np", np, "blobLen", blob.length);

for (let pid=1; pid<=np; pid++) {
  u8(); // pn
  u8(); // va
  const nu=uvarint();
  for (let i=0;i<nu;i++){ u8(); uvarint(); }
  uvarint(); // numSlots
  uvarint(); uvarint(); uvarint(); uvarint(); uvarint(); // field keys
  const nc=uvarint();
  for (let i=0;i<nc;i++){ const tag=u8(); if(tag===5||tag===6){ const ln=uvarint(); for(let j=0;j<ln;j++) u8(); } }
  const nk=uvarint();
  const instrs: any[] = [];
  let lrk = (rk0 + pid*astep + pid*pid*astep2) % 65536;
  for (let i=0;i<nk;i++) {
    const mm = Math.floor(lrk/3)%256;
    const oe = uvarint();
    const aw = svarint()-mm;
    const b1w = svarint()-mm;
    const b2w = svarint()+mm;
    const cw = svarint()-mm;
    lrk = (lrk + ainc + Math.floor(lrk/8)) % 65536;
    instrs.push({oe, A:aw, B:(b1w+b2w), C:cw});
  }
  let rk = (rk0 + pid*astep + pid*pid*astep2) % 65536;
  const ops: number[] = [];
  for (let i=0;i<nk;i++) {
    const op = (((instrs[i].oe - rk) % 65536) + 65536) % 65536;
    ops.push(op);
    rk = (rk + ainc + Math.floor(rk/8)) % 65536;
  }
  console.log(`proto ${pid}: nk=${nk}`);
  console.log(`  ops=`, ops.slice(0,20).join(","));
  console.log(`  range min=${Math.min(...ops)} max=${Math.max(...ops)}`);
}
