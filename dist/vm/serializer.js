"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M31 = void 0;
exports.normSeed = normSeed;
exports.wmSeeds = wmSeeds;
exports.makeKeyStream = makeKeyStream;
exports.encryptBlob = encryptBlob;
exports.decryptBlob = decryptBlob;
exports.spreadWatermark = spreadWatermark;
exports.unspreadWatermark = unspreadWatermark;
exports.crc16 = crc16;
exports.putUvarint = putUvarint;
exports.putSvarint = putSvarint;
exports.serializeProto = serializeProto;
exports.deserializeBlob = deserializeBlob;
const M31 = 2147483647;
exports.M31 = M31;
/** normalized positive seed in [1, M31-2]; idempotent & safe for identical Lua-side % behavior */
function normSeed(s) {
    const m = M31 - 1;
    const r = ((s % m) + m) % m;
    return r === 0 ? 1 : r;
}
function lcgPair(seedA, seedB) {
    let sa = normSeed(seedA);
    let sb = normSeed(seedB === seedA ? seedB + 1 : seedB);
    return () => {
        sa = (sa * 48271) % M31;
        sb = (sb * 69621) % M31;
        return ((Math.floor(sa / 65536) + Math.floor(sb / 65536)) & 0xff);
    };
}
/** canonical second-stream seed pair for watermark masking (shared with runtime/extractor) */
function wmSeeds(seed) {
    const b = ((seed ^ 0x5f3759df) >>> 0) || 7;
    return [seed, b];
}
function makeKeyStream(seedA, seedB) {
    const next = lcgPair(seedA, seedB);
    return (n) => {
        const out = new Uint8Array(n);
        for (let i = 0; i < n; i++)
            out[i] = next();
        return out;
    };
}
function encryptBlob(plain, seeds) {
    const ks = makeKeyStream(seeds[0], seeds[1]);
    const keys = ks(plain.length);
    const out = Buffer.alloc(plain.length);
    for (let i = 0; i < plain.length; i++)
        out[i] = (plain[i] + keys[i]) & 0xff;
    return out;
}
function decryptBlob(cipher, seeds) {
    const ks = makeKeyStream(seeds[0], seeds[1]);
    const keys = ks(cipher.length);
    const out = Buffer.alloc(cipher.length);
    for (let i = 0; i < cipher.length; i++)
        out[i] = (cipher[i] - keys[i] + 256) & 0xff;
    return out;
}
/**
 * Watermark carrier region: three payload copies separated by 32-byte
 * keystream filler, whole region XOR-masked with a second keystream.
 * Layout is position-deterministic so the extractor needs only the seed + length.
 */
function spreadWatermark(payload, seed) {
    const fillerLen = 32;
    const total = payload.length * 3 + fillerLen * 2;
    const [m0, m1] = wmSeeds(seed);
    const maskKs = makeKeyStream(m0, m1);
    const fillKs = makeKeyStream((seed * 2654435761) % M31, normSeed(seed + 11));
    const fill = fillKs(fillerLen * 2);
    const region = Buffer.alloc(total);
    let o = 0;
    region.set(payload, o);
    o += payload.length;
    region.set(fill.subarray(0, fillerLen), o);
    o += fillerLen;
    region.set(payload, o);
    o += payload.length;
    region.set(fill.subarray(fillerLen), o);
    o += fillerLen;
    region.set(payload, o);
    const mask = maskKs(total);
    for (let i = 0; i < total; i++)
        region[i] = (region[i] + mask[i]) & 0xff;
    return region;
}
function unspreadWatermark(region, wmLen, seed) {
    const fillerLen = 32;
    const [m0, m1] = wmSeeds(seed);
    const maskKsCache = makeKeyStream(m0, m1)(region.length);
    const out = Buffer.alloc(wmLen);
    const copyAt = (copyIdx, i) => {
        const off = copyIdx * (wmLen + fillerLen) + i;
        return (region[off] - maskKsCache[off] + 256) & 0xff;
    };
    for (let i = 0; i < wmLen; i++) {
        const a = copyAt(0, i);
        const b = copyAt(1, i);
        const c = copyAt(2, i);
        // majority vote
        out[i] = (a === b || a === c) ? a : b;
    }
    return out;
}
function crc16(buf) {
    let crc = 0xffff;
    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i];
        for (let b = 0; b < 8; b++) {
            crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1;
        }
    }
    return crc & 0xffff;
}
// ---- varints ----
function putUvarint(buf, v) {
    let x = v >>> 0;
    do {
        let b = x & 0x7f;
        x >>>= 7;
        if (x !== 0)
            b |= 0x80;
        buf.push(b);
    } while (x !== 0);
}
function putSvarint(buf, v) {
    putUvarint(buf, v >= 0 ? v * 2 : -v * 2 - 1);
}
class Reader {
    data;
    pos = 0;
    constructor(data) {
        this.data = data;
    }
    u8() {
        return this.data[this.pos++];
    }
    uvarint() {
        let shift = 0;
        let r = 0;
        for (;;) {
            const b = this.data[this.pos++];
            r += (b & 0x7f) * Math.pow(2, shift);
            if (!(b & 0x80))
                return r;
            shift += 7;
        }
    }
    svarint() {
        const u = this.uvarint();
        return u % 2 === 1 ? -(u + 1) / 2 : u / 2;
    }
    bytesStr(n) {
        let s = "";
        for (let i = 0; i < n; i++)
            s += String.fromCharCode(this.data[this.pos++]);
        return s;
    }
}
function serializeProto(root, wmRegion) {
    // flatten tree & remap CLOSURE operands to global 1-based proto ids
    const flat = [];
    const idMap = new Map();
    const assign = (p) => {
        if (idMap.has(p))
            return idMap.get(p);
        const id = flat.length + 1;
        flat.push(p);
        idMap.set(p, id);
        for (const sub of p.protos)
            assign(sub);
        return id;
    };
    assign(root);
    for (const p of flat) {
        for (const ins of p.code) {
            if (ins[0] === 18 /* Op.CLOSURE */) {
                ins[1] = idMap.get(p.protos[ins[1] - 1]);
            }
        }
    }
    const buf = [];
    buf.push(0x4e, 0x56, 0x58); // "NVX"
    buf.push(0x02);
    putUvarint(buf, flat.length);
    for (const p of flat)
        writeProto(buf, p);
    if (wmRegion && wmRegion.length > 0) {
        putUvarint(buf, wmRegion.length);
        for (const b of wmRegion)
            buf.push(b);
    }
    else {
        putUvarint(buf, 0);
    }
    return { plain: Buffer.from(buf), flat, rootPid: 1 };
}
function writeProto(buf, p) {
    buf.push(p.params & 0xff);
    buf.push(p.isVararg ? 1 : 0);
    putUvarint(buf, p.upvals.length);
    for (const uv of p.upvals) {
        buf.push(uv.instack ? 1 : 0);
        putUvarint(buf, uv.idx);
    }
    putUvarint(buf, p.numSlots);
    putUvarint(buf, p.consts.length);
    for (const c of p.consts) {
        if (c === null)
            buf.push(0);
        else if (c === true)
            buf.push(1);
        else if (c === false)
            buf.push(2);
        else if (typeof c === "number") {
            // decimal round-trip (17 significant digits guarantee exact double recovery)
            buf.push(5);
            let s;
            if (!isFinite(c))
                s = Number.isNaN(c) ? "(0/0)" : c > 0 ? "1e999" : "-1e999";
            else
                s = String(c);
            putUvarint(buf, s.length);
            for (let i = 0; i < s.length; i++)
                buf.push(s.charCodeAt(i));
        }
        else {
            buf.push(6);
            const bytes = Buffer.from(c, "latin1");
            putUvarint(buf, bytes.length);
            for (const byte of bytes)
                buf.push(byte);
        }
    }
    putUvarint(buf, p.code.length);
    for (const ins of p.code) {
        buf.push(ins[0] & 0xff);
        putSvarint(buf, ins[1]);
        putSvarint(buf, ins[2]);
        putSvarint(buf, ins[3]);
    }
}
/** TS mirror of the runtime decoder — used for integrity hashing & extraction. */
function deserializeBlob(data) {
    const r = new Reader(data);
    if (r.u8() !== 0x4e || r.u8() !== 0x56 || r.u8() !== 0x58)
        throw new Error("bad blob marker");
    if (r.u8() !== 0x02)
        throw new Error("unsupported blob version");
    const n = r.uvarint();
    const flat = [];
    for (let i = 0; i < n; i++)
        flat.push(readProto(r));
    const wln = r.uvarint();
    let wm = null;
    if (wln > 0) {
        wm = Buffer.alloc(wln);
        for (let i = 0; i < wln; i++)
            wm[i] = r.u8();
    }
    return { flat, wm };
}
function readProto(r) {
    const params = r.u8();
    const isVararg = r.u8() === 1;
    const nu = r.uvarint();
    const upvals = [];
    for (let i = 0; i < nu; i++) {
        const instack = r.u8() === 1;
        upvals.push({ instack, idx: r.uvarint() });
    }
    const numSlots = r.uvarint();
    const nc = r.uvarint();
    const consts = [];
    for (let i = 0; i < nc; i++) {
        const tag = r.u8();
        if (tag === 0)
            consts.push(null);
        else if (tag === 1)
            consts.push(true);
        else if (tag === 2)
            consts.push(false);
        else if (tag === 5) {
            const s = r.bytesStr(r.uvarint());
            consts.push(parseFloat(s));
        }
        else if (tag === 6) {
            consts.push(r.bytesStr(r.uvarint()));
        }
        else
            throw new Error(`bad const tag ${tag}`);
    }
    const nk = r.uvarint();
    const code = [];
    for (let i = 0; i < nk; i++) {
        code.push([r.u8(), r.svarint(), r.svarint(), r.svarint()]);
    }
    return { params, isVararg, upvals, numSlots, consts: consts, code, protos: [] };
}
