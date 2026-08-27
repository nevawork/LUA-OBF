#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NEVAHEX-VM v2.1 "The Abyss" — CLI
const fs_1 = require("fs");
const pipeline_1 = require("./pipeline");
const extract_1 = require("./extract");
const parser_1 = require("./lang/parser");
const tiers_1 = require("./engine/runtime/tiers");
function fail(msg) {
    console.error(`nevahex: ${msg}`);
    process.exit(1);
}
const [cmd, ...args] = process.argv.slice(2);
function flagOf(name) {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
}
function hasFlag(name) {
    return args.includes(name);
}
switch (cmd) {
    case "protect": {
        const input = args[0];
        if (!input)
            fail("usage: nevahex protect <input.lua> [-o out.lua] [--tier TIER_PARANOID_STRICT|TIER_PARANOID_SILENT|off] [--seed <hex>] [--watermark <text>] [--manifest out.json] [--target lua51|luajit|luau|universal] [--env-keying] [--anti-emu] [--no-mba] [--dyn-load] [--emit-secrets]");
        let source;
        try {
            source = (0, fs_1.readFileSync)(input, "utf8");
        }
        catch {
            fail(`cannot read ${input}`);
        }
        const tier = (0, tiers_1.normalizeTier)((flagOf("--tier") ?? "silent"));
        if (!["strict", "silent", "off"].includes(tier))
            fail("tier must be TIER_PARANOID_STRICT|TIER_PARANOID_SILENT|TIER_PARANOID_OFF|strict|silent|off");
        const target = (flagOf("--target") ?? "universal");
        if (!["lua51", "luajit", "luau", "universal"].includes(target))
            fail("target must be lua51|luajit|luau|universal");
        const envKeying = hasFlag("--env-keying") ? target : "universal";
        const result = (0, pipeline_1.protect)({
            source: source,
            tier,
            seedHex: flagOf("--seed"),
            watermark: flagOf("--watermark"),
            envProfile: envKeying,
            antiEmulation: target !== "luau" && hasFlag("--anti-emu"),
            mbaPlus: !hasFlag("--no-mba"),
            dynLoad: hasFlag("--dyn-load") && target !== "luau",
            layered: hasFlag("--layered"),
            emitSecrets: hasFlag("--emit-secrets"),
            superops: hasFlag("--superops"),
            mmTraps: hasFlag("--mm-traps"),
            keyless: hasFlag("--keyless"),
            stage2: hasFlag("--stage2"),
        });
        const output = flagOf("-o") ?? input.replace(/\.lua$/, "") + ".protected.lua";
        (0, fs_1.writeFileSync)(output, result.lua);
        const manifestPath = flagOf("--manifest") ?? `${output}.manifest.json`;
        (0, fs_1.writeFileSync)(manifestPath, JSON.stringify(result.manifest, null, 2));
        console.log(`protected -> ${output}`);
        console.log(`manifest  -> ${manifestPath}`);
        console.log(`stats     protos=${result.stats.protos} instrs=${result.stats.instructions} consts=${result.stats.constants} blob=${result.stats.blobBytes}B out=${result.stats.outputBytes}B`);
        break;
    }
    case "extract": {
        const input = args[0];
        const manifest = flagOf("--manifest");
        if (!input || !manifest)
            fail("usage: nevahex extract <protected.lua> --manifest <file.manifest.json>");
        try {
            const r = (0, extract_1.extractWatermark)(input, manifest);
            console.log(`watermark (${r.bytes} bytes, crc ${r.crcOk ? "OK" : "MISMATCH"}):`);
            console.log(r.text ?? r.hex);
        }
        catch (e) {
            fail(String(e));
        }
        break;
    }
    case "metrics": {
        const a = flagOf("--a");
        const b = flagOf("--b");
        if (!a || !b)
            fail("usage: nevahex metrics --a <manifest1.json> --b <manifest2.json>");
        const { layoutSimilarity } = require("./testing/metrics");
        const ma = JSON.parse((0, fs_1.readFileSync)(a, "utf8"));
        const mb = JSON.parse((0, fs_1.readFileSync)(b, "utf8"));
        const sim = layoutSimilarity(ma.fingerprint, mb.fingerprint);
        console.log(`layout similarity: ${sim.toFixed(4)}`);
        console.log(`spec target < 0.15: ${sim < 0.15 ? "PASS" : "FAIL"}`);
        break;
    }
    case "verify": {
        const input = args[0];
        if (!input)
            fail("usage: nevahex verify <input.lua>");
        try {
            (0, parser_1.parse)((0, fs_1.readFileSync)(input, "utf8"));
            console.log("OK — parses as Lua 5.1");
        }
        catch (e) {
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
      --anti-emu                enable timing-based anti-emulation (non-luau)
      --no-mba                  disable MBA+ algebra rewrites (on by default)
      --dyn-load                optional string.dump+load path (non-luau)
      --emit-secrets            include nonce+seeds in the manifest (holder
                                mode; default manifests carry NO key material)
      --superops                enable superoperator fusion (Phase 4, opt-in
                                until the runtime differential matrix runs)
      --mm-traps                hide the root invoke behind a randomized
                                metamethod trap (APEX W1.3; depth-budgeted)
      --keyless                 split cipher registers into prologue+pool
                                shares; no seed literal ships (APEX W1.2)
      --stage2                  emit the inner deserializer VM + masked program
                                instead of the flat decode loop (APEX W1.1)
  nevahex extract <protected.lua> --manifest <file>
  nevahex verify <input.lua>
  nevahex metrics --a <manifest1.json> --b <manifest2.json>`);
        break;
}
void hasFlag;
