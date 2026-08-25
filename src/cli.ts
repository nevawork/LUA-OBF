#!/usr/bin/env node
// NEVAHEX-VM v2.1 "The Abyss" — CLI
import { readFileSync, writeFileSync } from "fs";
import { protect, Manifest } from "./pipeline";
import { extractWatermark } from "./extract";
import { parse } from "./lang/parser";

function fail(msg: string): never {
  console.error(`nevahex: ${msg}`);
  process.exit(1);
}

const [cmd, ...args] = process.argv.slice(2);

function flagOf(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
function hasFlag(name: string): boolean {
  return args.includes(name);
}

switch (cmd) {
  case "protect": {
    const input = args[0];
    if (!input) fail("usage: nevahex protect <input.lua> [-o out.lua] [--tier strict|silent|off] [--seed <hex>] [--watermark <text>] [--manifest out.json] [--target lua51|luajit|luau|universal] [--env-keying] [--anti-emu]");
    let source: string;
    try {
      source = readFileSync(input, "utf8");
    } catch {
      fail(`cannot read ${input}`);
    }
    const tier = (flagOf("--tier") ?? "silent") as "strict" | "silent" | "off";
    if (!["strict", "silent", "off"].includes(tier)) fail("tier must be strict|silent|off");
    const target = (flagOf("--target") ?? "universal") as string;
    if (!["lua51", "luajit", "luau", "universal"].includes(target))
      fail("target must be lua51|luajit|luau|universal");
    const envKeying = hasFlag("--env-keying") ? (target as import("./protection/envkeying").EnvProfile) : "universal";
    const result = protect({
      source: source!,
      tier,
      seedHex: flagOf("--seed"),
      watermark: flagOf("--watermark"),
      envProfile: envKeying,
      antiEmulation: target !== "luau" && hasFlag("--anti-emu"),
    });
    const output = flagOf("-o") ?? input.replace(/\.lua$/, "") + ".protected.lua";
    writeFileSync(output, result.lua);
    const manifestPath = flagOf("--manifest") ?? `${output}.manifest.json`;
    writeFileSync(manifestPath, JSON.stringify(result.manifest, null, 2));
    console.log(`protected -> ${output}`);
    console.log(`manifest  -> ${manifestPath}`);
    console.log(
      `stats     protos=${result.stats.protos} instrs=${result.stats.instructions} consts=${result.stats.constants} blob=${result.stats.blobBytes}B out=${result.stats.outputBytes}B`,
    );
    break;
  }
  case "extract": {
    const input = args[0];
    const manifest = flagOf("--manifest");
    if (!input || !manifest) fail("usage: nevahex extract <protected.lua> --manifest <file.manifest.json>");
    try {
      const r = extractWatermark(input!, manifest!);
      console.log(`watermark (${r.bytes} bytes, crc ${r.crcOk ? "OK" : "MISMATCH"}):`);
      console.log(r.text ?? r.hex);
    } catch (e) {
      fail(String(e));
    }
    break;
  }
  case "verify": {
    const input = args[0];
    if (!input) fail("usage: nevahex verify <input.lua>");
    try {
      parse(readFileSync(input!, "utf8"));
      console.log("OK — parses as Lua 5.1");
    } catch (e) {
      fail(String(e));
    }
    break;
  }
  default:
    console.log(`NEVAHEX-VM v2.1 "The Abyss"

Usage:
  nevahex protect <input.lua> [options]
      -o <out.lua>              output path
      --tier <mode>             strict | silent | off   (default silent)
      --seed <256-bit hex>      deterministic build nonce
      --watermark <text>        embed recoverable watermark
      --manifest <path>         manifest output path
  nevahex extract <protected.lua> --manifest <file>
  nevahex verify <input.lua>`);
    break;
}

void hasFlag;
type _M = Manifest;
