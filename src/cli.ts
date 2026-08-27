#!/usr/bin/env node
// NEVAHEX-VM v2.1 "The Abyss" — CLI
import { readFileSync, writeFileSync } from "fs";
import { protect, Manifest } from "./pipeline";
import { extractWatermark } from "./extract";
import { parse } from "./lang/parser";
import { normalizeTier } from "./engine/runtime/tiers";

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
    if (!input) fail("usage: nevahex protect <input.lua> [-o out.lua] [--tier TIER_PARANOID_STRICT|TIER_PARANOID_SILENT|off] [--seed <hex>] [--watermark <text>] [--manifest out.json] [--target lua51|luajit|luau|universal] [--env-keying] [--no-anti-emu] [--no-flatten] [--no-mba] [--no-superops] [--no-mm-traps] [--no-keyless] [--dyn-load] [--emit-secrets] [--reg-obfuscate] [--const-shuffle] [--mega-superops] [--superop-nesting <n>] [--stage2]");
    let source: string;
    try {
      source = readFileSync(input, "utf8");
    } catch {
      fail(`cannot read ${input}`);
    }
    const tier = normalizeTier((flagOf("--tier") ?? "silent") as never);
    if (!["strict", "silent", "off"].includes(tier)) fail("tier must be TIER_PARANOID_STRICT|TIER_PARANOID_SILENT|TIER_PARANOID_OFF|strict|silent|off");
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
      antiEmulation: target !== "luau" && !hasFlag("--no-anti-emu"),
      flatten: !hasFlag("--no-flatten"),
      mbaPlus: !hasFlag("--no-mba"),
      dynLoad: hasFlag("--dyn-load") && target !== "luau",
      layered: hasFlag("--layered"),
      emitSecrets: hasFlag("--emit-secrets"),
      superops: !hasFlag("--no-superops"),
      megaSuperops: hasFlag("--mega-superops"),
      superopNesting: flagOf("--superop-nesting") ? parseInt(flagOf("--superop-nesting")!) : undefined,
      mmTraps: !hasFlag("--no-mm-traps"),
      keyless: !hasFlag("--no-keyless"),
      regObfuscate: hasFlag("--reg-obfuscate"),
      constShuffle: hasFlag("--const-shuffle"),
      stage2: hasFlag("--stage2"),
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
  case "metrics": {
    const a = flagOf("--a");
    const b = flagOf("--b");
    if (!a || !b) fail("usage: nevahex metrics --a <manifest1.json> --b <manifest2.json>");
    const { layoutSimilarity } = require("./testing/metrics");
    const ma = JSON.parse(readFileSync(a!, "utf8"));
    const mb = JSON.parse(readFileSync(b!, "utf8"));
    const sim = layoutSimilarity(ma.fingerprint, mb.fingerprint);
    console.log(`layout similarity: ${sim.toFixed(4)}`);
    console.log(`spec target < 0.15: ${sim < 0.15 ? "PASS" : "FAIL"}`);
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
      --tier <mode>             TIER_PARANOID_STRICT | TIER_PARANOID_SILENT | off (default silent)
      --seed <256-bit hex>      deterministic build nonce
      --watermark <text>        embed recoverable watermark
      --manifest <path>         manifest output path
      --target <env>            lua51 | luajit | luau | universal
      --env-keying              bind decryption to the target fingerprint
      --no-anti-emu             disable timing-based anti-emulation (enabled by default on non-luau)
      --no-flatten              disable control-flow flattening (enabled by default)
      --no-mba                  disable MBA+ algebra rewrites (enabled by default)
      --no-superops             disable superoperator fusion (enabled by default)
      --mega-superops           enable mega superoperator fusion (60–80 insn, operand-bearing)
      --superop-nesting <n>     recursion bound for mega→mini nesting (default: 3)
      --no-mm-traps             disable metamethod trap (enabled by default)
      --no-keyless              disable keyless schedule (enabled by default)
      --reg-obfuscate           insert copy NOPs, permute register assignments
      --const-shuffle           randomize constant order + type confusion
      --dyn-load                optional string.dump+load path (non-luau)
      --emit-secrets            include nonce+seeds in the manifest (holder
                                mode; default manifests carry NO key material)
      --stage2                  emit the inner deserializer VM + masked program
                                instead of the flat decode loop (APEX W1.1)
  nevahex extract <protected.lua> --manifest <file>
  nevahex verify <input.lua>
  nevahex metrics --a <manifest1.json> --b <manifest2.json>`);
    break;
}

void hasFlag;
type _M = Manifest;
