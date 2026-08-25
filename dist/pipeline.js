"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
// NEVAHEX-VM — protection pipeline orchestrator
const parser_1 = require("./lang/parser");
const compiler_1 = require("./vm/compiler");
const opcodes_1 = require("./vm/opcodes");
const serializer_1 = require("./vm/serializer");
const emitter_1 = require("./vm/emitter");
const transforms_1 = require("./transforms");
const prng_1 = require("./gen/prng");
const DOMAINS = ["blob0", "blob1", "wm", "aux"];
function protect(opts) {
    const chunk = (0, parser_1.parse)(opts.source);
    const tier = opts.tier ?? "silent";
    // ---- per-build CSPRNG material (Addendum 0.3: deterministic, CSPRNG-seeded) ----
    const nonce = opts.seedHex
        ? Buffer.from(opts.seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex")
        : (0, prng_1.randomNonce)();
    const master = (0, prng_1.sha256)(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
    const rng = new prng_1.BuildRng(master);
    // ---- Phase T: source transforms (all randomness from the build rng) ----
    (0, transforms_1.resetCounter)();
    (0, transforms_1.encryptStrings)(chunk);
    if (opts.flatten !== false)
        (0, transforms_1.flattenControlFlow)(chunk, { keys: () => 1 + rng.int(100000) });
    (0, transforms_1.injectOpaqueJunk)(chunk, opts.junkDensity ?? 0.12, rng);
    // ---- Phase V: compile to VM bytecode ----
    const root = (0, compiler_1.compileChunk)(chunk);
    const seeds = [
        rng.int(2147483646) + 1,
        rng.int(2147483646) + 1,
        rng.int(2147483646) + 1,
        rng.int(2147483646) + 1,
    ];
    const pbias = 1 + rng.int(3);
    // ---- physical opcode permutation applied in-memory ----
    const logicalCount = Object.keys(opcodes_1.Op).filter((x) => isNaN(Number(x))).length;
    const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
    const renumber = (p) => {
        for (const ins of p.code)
            ins[0] = perm[ins[0]];
        p.protos.forEach(renumber);
    };
    renumber(root);
    // ---- watermark carriers ----
    const wmPayload = opts.watermark ? Buffer.from(opts.watermark, "utf8") : null;
    const wmRegion = wmPayload ? (0, serializer_1.spreadWatermark)(wmPayload, seeds[2]) : null;
    // ---- serialize & encrypt ----
    const { plain } = (0, serializer_1.serializeProto)(root, wmRegion ?? undefined);
    const blob = (0, serializer_1.encryptBlob)(plain, seeds);
    // ---- integrity slices over decoded representation ----
    const { flat } = (0, serializer_1.deserializeBlob)((0, serializer_1.decryptBlob)(blob, seeds));
    const integrity = [];
    const WINDOW = 48;
    for (let pid = 0; pid < flat.length; pid++) {
        const code = flat[pid].code;
        for (let start = 0; start < code.length; start += WINDOW * 4) {
            const a = start + 1; // 1-based inclusive
            const b = Math.min(code.length, start + WINDOW * 4);
            if (a > b)
                break;
            let h = 2166136261 % 1000000007;
            for (let j = a - 1; j < b; j++) {
                const q = code[j];
                h = (h * 16777619 + q[0] * 31 + q[1] * 7 + q[2] * 3 + q[3]) % 1000000007;
            }
            integrity.push([pid + 1, a, b, h]);
            if (integrity.length >= 64)
                break;
        }
        if (integrity.length >= 64)
            break;
    }
    // cap via sampling keeps runtime cost bounded (bounded resource guarantee)
    const cappedIntegrity = integrity.length > 32
        ? Array.from({ length: 32 }, (_, i) => integrity[Math.floor((i * integrity.length) / 32)])
        : integrity;
    // ---- emit runtime ----
    const emitted = (0, emitter_1.emitRuntime)({
        seeds,
        tier,
        rng,
        blob,
        integrity: cappedIntegrity.map((s) => s),
        pbias,
        rootPid: 1,
        perm,
    });
    const manifest = {
        format: "nevahex-manifest",
        version: 2,
        nonce: nonce.toString("hex"),
        seeds: seeds.map(serializer_1.normSeed),
        pbias,
        rootPid: 1,
        tier,
        integritySlices: cappedIntegrity.length,
        watermark: {
            seed: (0, serializer_1.normSeed)(seeds[2]),
            len: wmPayload ? wmPayload.length : 0,
            crc16: wmPayload ? (0, serializer_1.crc16)(wmPayload) : 0,
        },
        createdAt: new Date().toISOString(),
    };
    return {
        lua: emitted.lua,
        manifest,
        stats: {
            protos: flat.length,
            instructions: flat.reduce((n, p) => n + p.code.length, 0),
            constants: flat.reduce((n, p) => n + p.consts.length, 0),
            blobBytes: blob.length,
            outputBytes: Buffer.byteLength(emitted.lua),
        },
    };
}
