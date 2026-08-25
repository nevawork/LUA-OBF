"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractWatermark = extractWatermark;
// NEVAHEX-VM — watermark extraction protocol
// Recovery requires the build manifest (holder-side keys). The extractor scans
// candidate blob literals in the protected artifact, decrypts with manifest
// seeds, locates the trailing carrier section, unspreads with majority vote,
// and verifies CRC-16.
const fs_1 = require("fs");
const serializer_1 = require("./vm/serializer");
function luaUnescape(lit) {
    // lit includes surrounding quotes
    const body = lit.slice(1, -1);
    const out = [];
    let i = 0;
    while (i < body.length) {
        const c = body[i];
        if (c === "\\" && i + 1 < body.length) {
            const d = body[i + 1];
            if (/[0-9]/.test(d)) {
                let digits = "";
                let k = i + 1;
                while (k < body.length && digits.length < 3 && /[0-9]/.test(body[k])) {
                    digits += body[k];
                    k++;
                }
                out.push(parseInt(digits, 10) & 0xff);
                i = k;
                continue;
            }
            const map = {
                n: 10, t: 9, r: 13, a: 7, b: 8, f: 12, v: 11, "\\": 92, '"': 34, "'": 39,
            };
            out.push(map[d] ?? d.charCodeAt(0));
            i += 2;
            continue;
        }
        out.push(c.charCodeAt(0) & 0xff);
        i++;
    }
    return Buffer.from(out);
}
function extractWatermark(luaPath, manifestPath) {
    const lua = (0, fs_1.readFileSync)(luaPath, "utf8");
    const manifest = JSON.parse((0, fs_1.readFileSync)(manifestPath, "utf8"));
    if (manifest.format !== "nevahex-manifest")
        throw new Error("not a nevahex manifest");
    const wmLen = manifest.watermark.len;
    if (!wmLen)
        throw new Error("artifact carries no watermark");
    const seeds = manifest.seeds;
    // scan every long string literal; try each as the encrypted blob
    const literalRe = /"((?:[^"\\]|\\[0-9]{3}|\\.)*)"/g;
    let m;
    const errors = [];
    while ((m = literalRe.exec(lua)) !== null) {
        if (m[1].length < 64)
            continue;
        let plain = null;
        try {
            const cipher = luaUnescape(m[0]);
            plain = (0, serializer_1.decryptBlob)(cipher, seeds);
        }
        catch (e) {
            errors.push(String(e));
            continue;
        }
        try {
            const { wm } = (0, serializer_1.deserializeBlob)(plain);
            if (!wm || wm.length === 0) {
                errors.push("no carrier section");
                continue;
            }
            const payload = (0, serializer_1.unspreadWatermark)(wm, wmLen, manifest.seeds[2]);
            const ok = (0, serializer_1.crc16)(payload) === manifest.watermark.crc16;
            return {
                hex: payload.toString("hex"),
                text: payload.toString("utf8").replace(/\u0000+$/g, ""),
                bytes: payload.length,
                crcOk: ok,
            };
        }
        catch (e) {
            errors.push(String(e));
            continue;
        }
    }
    throw new Error(`extraction failed: no candidate literal matched (${errors.slice(0, 3).join("; ")})`);
}
