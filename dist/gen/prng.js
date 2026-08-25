"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildRng = void 0;
exports.randomNonce = randomNonce;
exports.sha256 = sha256;
exports.hmacSha256 = hmacSha256;
exports.deriveKey = deriveKey;
exports.chacha20KeyStream = chacha20KeyStream;
// NEVAHEX-VM — cryptographic primitives & deterministic randomness
// Addendum 0.3: per-build isomorphism is seeded by a CSPRNG 256-bit nonce.
const nodeCrypto = __importStar(require("crypto"));
function randomNonce() {
    return nodeCrypto.randomBytes(32);
}
function sha256(...parts) {
    const h = nodeCrypto.createHash("sha256");
    for (const p of parts)
        h.update(p);
    return h.digest();
}
function hmacSha256(key, ...parts) {
    const h = nodeCrypto.createHmac("sha256", key);
    for (const p of parts)
        h.update(p);
    return h.digest();
}
/** Derive a domain-separated subkey from the master nonce. */
function deriveKey(master, domain) {
    return sha256(master, Buffer.from(domain, "utf8"));
}
/** ChaCha20 keystream (RFC 8439) — deterministic stream for blob encryption. */
function chacha20KeyStream(key, nonce, count) {
    if (key.length !== 32)
        throw new Error("chacha20 key must be 32 bytes");
    if (nonce.length !== 12)
        throw new Error("chacha20 nonce must be 12 bytes");
    const out = new Uint8Array(count * 64);
    let o = 0;
    for (let block = 0; block < count; block++) {
        const state = new Uint32Array(16);
        state[0] = 0x61707865;
        state[1] = 0x3320646e;
        state[2] = 0x79622d32;
        state[3] = 0x6b206574;
        for (let i = 0; i < 8; i++)
            state[4 + i] = key.readUInt32LE(i * 4);
        state[12] = block >>> 0;
        state[13] = nonce.readUInt32LE(0);
        state[14] = nonce.readUInt32LE(4);
        state[15] = nonce.readUInt32LE(8);
        const w = state.slice();
        for (let round = 0; round < 10; round++) {
            qr(w, 0, 4, 8, 12);
            qr(w, 1, 5, 9, 13);
            qr(w, 2, 6, 10, 14);
            qr(w, 3, 7, 11, 15);
            qr(w, 0, 5, 10, 15);
            qr(w, 1, 6, 11, 12);
            qr(w, 2, 7, 8, 13);
            qr(w, 3, 4, 9, 14);
        }
        const tmp = Buffer.alloc(64);
        for (let i = 0; i < 16; i++)
            tmp.writeUInt32LE((w[i] + state[i]) >>> 0, i * 4);
        out.set(tmp, o);
        o += 64;
    }
    return out;
    function qr(w, a, b, c, d) {
        w[a] = (w[a] + w[b]) >>> 0;
        w[d] ^= w[a];
        w[d] = ((w[d] << 16) | (w[d] >>> 16)) >>> 0;
        w[c] = (w[c] + w[d]) >>> 0;
        w[b] ^= w[c];
        w[b] = ((w[b] << 12) | (w[b] >>> 20)) >>> 0;
        w[a] = (w[a] + w[b]) >>> 0;
        w[d] ^= w[a];
        w[d] = ((w[d] << 8) | (w[d] >>> 24)) >>> 0;
        w[c] = (w[c] + w[d]) >>> 0;
        w[b] ^= w[c];
        w[b] = ((w[b] << 7) | (w[b] >>> 25)) >>> 0;
    }
}
/** Deterministic PRNG for build-time decisions (shuffles, names). Seeded by key material. */
class BuildRng {
    s0;
    s1;
    s2;
    s3;
    constructor(seed) {
        const h = sha256(seed, Buffer.from("rng", "utf8"));
        this.s0 = h.readUInt32LE(0) | 1;
        this.s1 = h.readUInt32LE(4) | 1;
        this.s2 = h.readUInt32LE(8) | 1;
        this.s3 = h.readUInt32LE(12) | 1;
    }
    nextU32() {
        // xoshiro128**
        let r = (Math.imul(this.s1, 5) >>> 0);
        r = (((r << 7) | (r >>> 25)) >>> 0);
        r = Math.imul(r, 9) >>> 0;
        const t = (this.s1 << 9) >>> 0;
        this.s2 = (this.s2 ^ this.s0) >>> 0;
        this.s3 = (this.s3 ^ this.s1) >>> 0;
        this.s1 = (this.s1 ^ this.s2) >>> 0;
        this.s0 = (this.s0 ^ this.s3) >>> 0;
        this.s2 = (this.s2 ^ t) >>> 0;
        this.s3 = (((this.s3 << 11) | (this.s3 >>> 21)) >>> 0);
        return r;
    }
    /** uniform integer in [0, n) */
    int(n) {
        return this.nextU32() % n;
    }
    pick(arr) {
        return arr[this.int(arr.length)];
    }
    shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = this.int(i + 1);
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    bool() {
        return (this.nextU32() & 1) === 1;
    }
    /** random identifier with given length using safe alphabet */
    ident(len = 8) {
        // leading letter always; mixed case+digits+underscore
        const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const rest = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
        let s = letters[this.int(letters.length)];
        for (let i = 1; i < len; i++)
            s += rest[this.int(rest.length)];
        return s;
    }
    bytes(n) {
        const b = Buffer.alloc(n);
        for (let i = 0; i < n; i += 4)
            b.writeUInt32LE(this.nextU32(), i);
        return b.subarray(0, n);
    }
}
exports.BuildRng = BuildRng;
