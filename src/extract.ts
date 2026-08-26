// NEVAHEX-VM — watermark extraction protocol
// Recovery requires the build manifest (holder-side keys). The extractor scans
// candidate blob literals in the protected artifact, decrypts with manifest
// seeds, locates the trailing carrier section, unspreads with majority vote,
// and verifies CRC-16.
import { readFileSync } from "fs";
import { decryptBlob, deserializeBlob, unspreadWatermark, crc16 } from "./vm/serializer";
import { Manifest } from "./pipeline";

export interface ExtractResult {
  text?: string;
  hex: string;
  bytes: number;
  crcOk: boolean;
}

function luaUnescape(lit: string): Buffer {
  // lit includes surrounding quotes
  const body = lit.slice(1, -1);
  const out: number[] = [];
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
      const map: Record<string, number> = {
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

/**
 * In-memory extraction core — also the attack surface probed by
 * src/testing/redteam.ts (forged-manifest stage).
 */
export function extractWatermarkBytes(lua: string, manifest: Manifest): ExtractResult {
  if (manifest.format !== "nevahex-manifest") throw new Error("not a nevahex manifest");

  const wmLen = manifest.watermark.len;
  if (!wmLen) throw new Error("artifact carries no watermark");

  if (!manifest.seeds || manifest.seeds.length !== 4) {
    throw new Error(
      "manifest lacks holder secrets — this artifact was built without " +
        "--emit-secrets; re-protect with --emit-secrets (or supply the " +
        "secrets-bearing manifest) to enable extraction",
    );
  }

  const seeds = manifest.seeds as [number, number, number, number];

  // scan every long string literal; try each as the encrypted blob
  const literalRe = /"((?:[^"\\]|\\[0-9]{3}|\\.)*)"/g;
  let m: RegExpExecArray | null;
  const errors: string[] = [];
  while ((m = literalRe.exec(lua)) !== null) {
    if (m[1].length < 64) continue;
    let plain: Buffer | null = null;
    try {
      const cipher = luaUnescape(m[0]);
      plain = decryptBlob(cipher, seeds);
    } catch (e) {
      errors.push(String(e));
      continue;
    }
    try {
      const { wm } = deserializeBlob(plain);
      if (!wm || wm.length === 0) {
        errors.push("no carrier section");
        continue;
      }
      const payload = unspreadWatermark(wm, wmLen, manifest.seeds[2]);
      const ok = crc16(payload) === manifest.watermark.crc16;
      return {
        hex: payload.toString("hex"),
        text: payload.toString("utf8").replace(/\u0000+$/g, ""),
        bytes: payload.length,
        crcOk: ok,
      };
    } catch (e) {
      errors.push(String(e));
      continue;
    }
  }
  throw new Error(`extraction failed: no candidate literal matched (${errors.slice(0, 3).join("; ")})`);
}

export function extractWatermark(luaPath: string, manifestPath: string): ExtractResult {
  const lua = readFileSync(luaPath, "utf8");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  return extractWatermarkBytes(lua, manifest);
}
