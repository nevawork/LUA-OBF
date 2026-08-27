"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalManifestJson = canonicalManifestJson;
exports.protect = protect;
// NEVAHEX-VM — protection pipeline orchestrator
const parser_1 = require("./lang/parser");
const compiler_1 = require("./vm/compiler");
const opcodes_1 = require("./vm/opcodes");
const serializer_1 = require("./vm/serializer");
const emitter_1 = require("./vm/emitter");
const transforms_1 = require("./transforms");
const prng_1 = require("./gen/prng");
const antitamper_1 = require("./protection/antitamper");
const envkeying_1 = require("./protection/envkeying");
const antiemulation_1 = require("./protection/antiemulation");
const dispatch_check_1 = require("./testing/dispatch-check");
const contracts_1 = require("./engine/triple/contracts");
const opencode_1 = require("./engine/runtime/opencode");
const superops_1 = require("./engine/vm/superops");
/** stable canonical JSON (sorted object keys) for tagging; exported for verifier tooling */
function canonicalManifestJson(v) {
    if (Array.isArray(v))
        return `[${v.map(canonicalManifestJson).join(",")}]`;
    if (v && typeof v === "object") {
        const o = v;
        return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonicalManifestJson(o[k])}`).join(",")}}`;
    }
    return JSON.stringify(v);
}
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
    (0, transforms_1.preserveTaskLibrary)(chunk); // spec Phase 2: task as _G[...] (no-op if unused)
    (0, transforms_1.encryptStrings)(chunk, rng);
    if (opts.flatten !== false)
        (0, transforms_1.flattenControlFlow)(chunk, { keys: () => 1 + rng.int(100000) });
    (0, transforms_1.injectOpaqueJunk)(chunk, opts.junkDensity ?? 0.12, rng);
    if (opts.mbaPlus !== false)
        (0, transforms_1.applyMbaPlus)(chunk, { rng }); // corrected MBA+ algebra (spec summary item 8)
    // ---- Phase V: compile to VM bytecode ----
    const root = (0, compiler_1.compileChunk)(chunk);
    // ---- Phase 4 superoperator fusion (logical space, pre-permutation) ----
    // Windows are mined on logical ops; fused heads get ids ≥ FUSED_ID_BASE and
    // member slots become DECL NOPs (positions preserved ⇒ jump offsets valid).
    let fusedSpecs = [];
    if (opts.superops !== false) {
        fusedSpecs = (0, superops_1.fuseSuperOps)(root, rng);
    }
    const seeds = [
        (0, serializer_1.normSeed)(rng.int(2147483646) + 1),
        (0, serializer_1.normSeed)(rng.int(2147483646) + 1),
        (0, serializer_1.normSeed)(rng.int(2147483646) + 1),
        (0, serializer_1.normSeed)(rng.int(2147483646) + 1),
    ];
    const pbias = 1 + rng.int(3);
    // ---- environmental keying (hardened derive-not-compare) ----
    const envProfile = opts.envProfile ?? "universal";
    // Blob is encrypted with the EFFECTIVE seeds (manifest holds them; they are
    // holder-side secrets). The file embeds BAKED-DOWN literals; at load time the
    // runtime re-derives the fingerprint constant and adds it back, recovering
    // the effective seeds. Wrong environment ⇒ wrong stream ⇒ cryptic failure.
    const encSeeds = seeds;
    const embeddedCipherLits = envProfile === "universal"
        ? null
        : (0, envkeying_1.bakeProfileSeeds)([seeds[0], seeds[1]], envProfile);
    // ---- physical opcode permutation applied in-memory ----
    const logicalCount = Object.keys(opcodes_1.Op).filter((x) => isNaN(Number(x))).length;
    const perm = rng.shuffle(Array.from({ length: logicalCount }, (_, i) => i));
    const renumber = (p) => {
        for (const ins of p.code) {
            // fused superop heads (≥ FUSED_ID_BASE) keep their logical ids here;
            // they receive dedicated physical values from a separate band below
            if (ins[0] < superops_1.FUSED_ID_BASE)
                ins[0] = perm[ins[0]];
        }
        p.protos.forEach(renumber);
    };
    renumber(root);
    // fused physical band: unique values ≥500, far above the base ISA and the
    // decoy band (100..~110), well inside the opcode ring (<65536)
    const fusedForEmit = [];
    if (fusedSpecs.length > 0) {
        const usedPhys = new Set(perm);
        for (const spec of fusedSpecs) {
            let phys = 500 + rng.int(40000);
            while (usedPhys.has(phys))
                phys = 500 + rng.int(40000);
            usedPhys.add(phys);
            fusedForEmit.push({ phys, members: spec.members });
        }
    }
    // ---- Phase 2 dispatch-hardening material ----
    // rolling-key opcode encoder + physical set of jump ops (their B operand
    // is a relative offset and gets share-split on the wire)
    const opencode = (0, opencode_1.makeOpenCodeParams)(rng);
    const JUMPY_LOGICAL = [
        opcodes_1.Op.JMP, opcodes_1.Op.JF, opcodes_1.Op.JT, opcodes_1.Op.FORPREP, opcodes_1.Op.FORLOOP, opcodes_1.Op.GFORPREP, opcodes_1.Op.GFORLOOP,
    ];
    const jumpOps = new Set(JUMPY_LOGICAL.map((op) => perm[op]));
    // ---- watermark carriers ----
    const wmPayload = opts.watermark ? Buffer.from(opts.watermark, "utf8") : null;
    const wmRegion = wmPayload ? (0, serializer_1.spreadWatermark)(wmPayload, seeds[2]) : null;
    // ---- W1.2 keyless share schedule (opt-in --keyless) ----
    // Phase 1.4 hardening: s0 ≡ B ⊕ G1 − X1 (mod M31), s1 ≡ E ⊕ G2 − X2 (mod M31):
    //   B,E ride the encrypted prologue filler (big-endian uint32 pairs);
    //   G1,G2,X1,X2 hide inside a decoy number pool at rng-chosen indices.
    //   XOR mixing and larger pool raise reconstruction cost without changing
    //   the runtime's share-recovery path.
    // No seed literal is ever emitted; recovery requires emulating the
    // prologue layout + pool cross-reference instead of evaluating two parens.
    let prologueShares;
    let keylessPool;
    if (opts.keyless !== false) {
        const u32 = () => {
            const v = rng.int(256) * 16777216 +
                rng.int(256) * 65536 +
                rng.int(256) * 256 +
                rng.int(256);
            return v >>> 0;
        };
        const M = 2147483647;
        const norm = (v) => {
            const r = ((v % (M - 1)) + (M - 1)) % (M - 1);
            return r === 0 ? 1 : r;
        };
        const B = u32();
        const E = u32();
        prologueShares = [B, E];
        const Bn = norm(B);
        const En = norm(E);
        const G1 = norm(rng.int(2147483646) + 1);
        const X1 = norm(G1 - seeds[0] + Bn);
        const G2 = norm(rng.int(2147483646) + 1);
        const X2 = norm(G2 - seeds[1] + En);
        // Phase 1.4: expanded pool with XOR-mixed secondary shares
        const nums = [G1, X1, G2, X2];
        for (let k = 0; k < 12; k++)
            nums.push(norm(rng.int(2147483646) + 1));
        const idx = rng.shuffle([0, 1, 2, 3, 4, 5]);
        keylessPool = {
            nums,
            i1: idx[0] + 1,
            i2: idx[1] + 1,
            i3: idx[2] + 1,
            i4: idx[3] + 1,
            i5: idx[4] + 1,
            i6: idx[5] + 1,
        };
    }
    // ---- serialize & encrypt (wire v3.2: keyed records, split jumps, opE) ----
    const { plain, keys: fieldKeys } = (0, serializer_1.serializeProto)(root, wmRegion ?? undefined, {
        rng,
        jumpOps,
        opencode,
        constKey: (0, serializer_1.normSeed)(seeds[3]),
        permMap: perm,
        prologueShares,
    });
    const blob = (0, serializer_1.encryptBlob)(plain, encSeeds);
    if (process.env.NEVAHEX_DEBUG_OPS) {
        try {
            require("fs").writeFileSync("/tmp/kilo/blob.bin", blob);
        }
        catch { }
    }
    // ---- Phase 5: ciphertext-integrity windows over the ENCRYPTED blob ----
    const blobSlices = tier !== "off" ? (0, antitamper_1.planBlobSlices)(blob) : [];
    if (process.env.NEVAHEX_DEBUG_OPS) {
        try {
            require("fs").writeFileSync("/tmp/kilo/slices.json", JSON.stringify(blobSlices));
        }
        catch { }
    }
    // ---- integrity slices over decoded representation ----
    // mirror must reverse operand whitening ⇒ pass the build's rolling-key params
    const { flat } = (0, serializer_1.deserializeBlob)((0, serializer_1.decryptBlob)(blob, encSeeds), { opencode });
    const cappedIntegrity = (0, antitamper_1.planIntegritySlices)(flat);
    // ---- emit runtime ----
    const antiEmu = envProfile !== "luau"
        ? { ...antiemulation_1.DEFAULT_ANTI_EMULATION }
        : null;
    const emitted = (0, emitter_1.emitRuntime)({
        seeds,
        tier,
        rng,
        blob,
        integrity: cappedIntegrity.map((s) => s),
        pbias,
        rootPid: 1,
        perm,
        envProfile,
        antiEmulation: antiEmu,
        cipherLiterals: embeddedCipherLits,
        dynLoad: opts.dynLoad === true && envProfile !== "luau",
        layered: opts.layered === true,
        fieldKeys,
        opencode,
        fused: fusedForEmit.length > 0 ? fusedForEmit : undefined,
        blobSlices,
        mmTraps: opts.mmTraps !== false,
        keylessPool,
        stage2: opts.stage2 === true,
    });
    // ---- build-time dispatch self-verification (fail loud, not cryptic) ----
    // The decoded representation's q[0] is opE (rolling-key encoded). The
    // dispatch arms test against DECODED physical values, so we must translate
    // every (pid, ins_index) opE back to its physical opcode using the same
    // per-frame chain the runtime uses. The translation also produces a
    // position-dependent set of physical ops (each instruction's opE lives in
    // a different rk_i window); the check accepts that an arm literal is hit
    // for ANY expected position.
    const opEToPhys = new Map();
    for (const p of flat) {
        let lrk = opencode ? (0, opencode_1.initialRk)(opencode, flat.indexOf(p) + 1) : 0;
        for (const ins of p.code) {
            const opE = ins[0];
            const phys = (opE - lrk + 65536) % 65536;
            opEToPhys.set(opE, phys);
            if (opencode)
                lrk = (lrk + opencode.ainc) % 65536;
        }
    }
    const usedPhysicalOps = new Set(opEToPhys.values());
    if (process.env.NEVAHEX_DUMP_LUA) {
        try {
            require("fs").writeFileSync(process.env.NEVAHEX_DUMP_LUA, emitted.lua);
        }
        catch { }
    }
    const check = (0, dispatch_check_1.verifyGeneratedDispatch)(emitted.lua, perm, usedPhysicalOps, {
        encoded: true,
        extraReal: fusedForEmit.map((s) => s.phys),
    });
    if (!check.ok) {
        throw new Error(`NEVAHEX internal: generated dispatch failed self-check\n` +
            check.problems.map((p) => `  - ${p}`).join("\n"));
    }
    // ---- Triple-VM boundary seals (Phase 3 contracts) ----
    const layerSeals = (0, contracts_1.computeLayerSeals)(emitted.lua);
    // ---- manifest: public fields + authenticity tag; secrets opt-in only ----
    // The historical default shipped the nonce AND all four cipher seeds in
    // every manifest — handing attackers the complete key schedule. Holders who
    // need extraction pass --emit-secrets; everyone else gets an HMAC tag that
    // proves provenance without disclosing keys.
    const emitSecrets = opts.emitSecrets === true;
    const wmLen = wmPayload ? wmPayload.length : 0;
    const wmCrc = wmPayload ? (0, serializer_1.crc16)(wmPayload) : 0;
    const authPayload = {
        format: "nevahex-manifest",
        version: 3,
        tier,
        envProfile,
        integritySlices: cappedIntegrity.length,
        fingerprint: { perm, dispatchOrder: emitted.dispatchOrder },
        layerSeals,
        watermarkLen: wmLen,
        watermarkCrc16: wmCrc,
    };
    const auth = (0, prng_1.hmacSha256)(nonce, Buffer.from(canonicalManifestJson(authPayload), "utf8")).toString("hex");
    const manifest = {
        format: "nevahex-manifest",
        version: 3,
        tier,
        envProfile,
        integritySlices: cappedIntegrity.length,
        fingerprint: authPayload.fingerprint,
        layerSeals,
        watermark: { len: wmLen, crc16: wmCrc },
        auth,
        createdAt: new Date().toISOString(),
    };
    if (emitSecrets) {
        manifest.nonce = nonce.toString("hex");
        manifest.seeds = seeds.map(serializer_1.normSeed);
        manifest.pbias = pbias;
        manifest.rootPid = 1;
        manifest.watermarkSeed = (0, serializer_1.normSeed)(seeds[2]);
        // holder tooling keys (dispatch analysis / extraction support)
        manifest.opencode = [opencode.rk0, opencode.astep, opencode.ainc];
        manifest.fieldKeys = [fieldKeys.OP, fieldKeys.A, fieldKeys.B1, fieldKeys.B2, fieldKeys.C];
    }
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
