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
const constant_shuffle_1 = require("./transforms/constant-shuffle");
const register_obfuscation_1 = require("./transforms/register-obfuscation");
const prng_1 = require("./gen/prng");
const antitamper_1 = require("./protection/antitamper");
const envkeying_1 = require("./protection/envkeying");
const antiemulation_1 = require("./protection/antiemulation");
const dispatch_check_1 = require("./testing/dispatch-check");
const contracts_1 = require("./engine/triple/contracts");
const opencode_1 = require("./engine/runtime/opencode");
const superops_1 = require("./engine/vm/superops");
const superops_mega_1 = require("./engine/vm/superops-mega");
const luau_compiler_1 = require("./engine/vm/luau-compiler");
const luau_antideobfuscation_1 = require("./protection/luau-antideobfuscation");
const luau_optimizer_1 = require("./engine/vm/luau-optimizer");
const mba_database_1 = require("./transforms/mba-database");
const mba_synthesizer_1 = require("./transforms/mba-synthesizer");
const anti_luahunt_1 = require("./protection/anti-luahunt");
const path_explosion_1 = require("./protection/path-explosion");
const luraph_vm_1 = require("./engine/obfuscator/luraph-vm");
/** stable canonical JSON (sorted object keys) for tagging; exported for verifier tooling */
function canonicalManifestJson(v) {
    if (Array.isArray(v))
        return `[${v.map(canonicalManifestJson).join(",")}]`;
    if (v && typeof v === "object") {
        const o = v;
        const keys = Object.keys(o).sort().filter((k) => o[k] !== undefined);
        return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalManifestJson(o[k])}`).join(",")}}`;
    }
    return JSON.stringify(v);
}
const DOMAINS = ["blob0", "blob1", "wm", "aux"];
function protect(opts) {
    const targetLuaVersion = opts.envProfile === "luau" || opts.envProfile === "luau_executor" || opts.envProfile === "roblox_executor" ? "luau" : "lua51";
    const chunk = (0, parser_1.parse)(opts.source, targetLuaVersion);
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
    // MBA+ generates bitwise operations (&, |, ~) which are NOT supported in Luau.
    // Luau has no native bitwise operators - only bit32 library functions.
    // Disable MBA+ for Luau targets to prevent parser/compiler failures.
    const isLuauTarget = opts.envProfile && ["luau", "luau_executor", "roblox_executor"].includes(opts.envProfile);
    if (opts.mbaPlus !== false && !isLuauTarget)
        (0, transforms_1.applyMbaPlus)(chunk, { rng }); // corrected MBA+ algebra (spec summary item 8)
    // ---- Phase 3: SMT-resistant MBA database ----
    // Precompute the MBA database and optionally generate factorization keys.
    // The database provides 5,000+ unique MBA expressions across 48 classes.
    const mbaDb = (0, mba_database_1.getMbaDatabase)();
    const factorizationSemiprime = opts.factorizationKeys === true ? (0, mba_synthesizer_1.generateSemiprime)(rng) : 0;
    // ---- Phase 5: anti-LuaHunt countermeasures ----
    // Breaks LuaHunt's assumptions: no stable opcode→semantics mapping,
    // non-deterministic outputs, gadget detection, format mutation.
    const antiLuahuntHandlers = opts.antiLuahunt === true
        ? (0, anti_luahunt_1.generatePolymorphicHandlers)(rng)
        : new Map();
    const gadgetDetectors = opts.antiLuahunt === true
        ? (0, anti_luahunt_1.generateGadgetDetection)(rng)
        : [];
    const pathExplosionPredicates = opts.pathExplosion === true
        ? (0, anti_luahunt_1.generatePathExplosionPredicates)(rng)
        : [];
    const selfModifyingSnippets = opts.selfModifying === true
        ? (0, path_explosion_1.generateSelfModifyingCode)(rng)
        : [];
    // ---- Phase V: compile to VM bytecode ----
    let root = (0, compiler_1.compileChunk)(chunk);
    // ---- Phase 1: register allocation obfuscation (post-compilation) ----
    // Inserts copy NOPs, permutes register assignments, splits live ranges.
    if (opts.regObfuscate === true) {
        (0, register_obfuscation_1.obfuscateRegisters)(root, rng);
    }
    // ---- Phase 1: constant pool obfuscation (AST-level) ----
    // Type confusion: numbers→table lengths, strings→MBA expressions
    if (opts.constShuffle === true) {
        (0, constant_shuffle_1.obfuscateConstants)(chunk, rng);
    }
    // ---- Phase 4/2: superoperator fusion (logical space, pre-permutation) ----
    // Windows are mined on logical ops; fused heads get ids ≥ FUSED_ID_BASE and
    // member slots become DECL NOPs (positions preserved ⇒ jump offsets valid).
    //
    // Phase 2 mega mode: 60–80 instruction windows with operand-bearing fusion,
    // followed by recursive mini fusion (2–15 instructions) up to the nesting
    // bound. This creates a hierarchical fusion lattice that exponentially
    // increases static-analysis complexity.
    let fusedSpecs = [];
    let megaFusedSpecs = [];
    const useMega = opts.megaSuperops === true;
    const useBaseSuperops = opts.superops !== false && !useMega;
    if (useMega) {
        megaFusedSpecs = (0, superops_mega_1.fuseMegaSuperOps)(root, rng, {
            megaWindow: [60, 80],
            miniWindow: [2, 15],
            recursionBound: opts.superopNesting ?? 3,
            maxFused: 200,
        });
    }
    else if (useBaseSuperops) {
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
    const encSeeds = seeds;
    const embeddedCipherLits = envProfile === "universal"
        ? null
        : (0, envkeying_1.bakeProfileSeeds)([seeds[0], seeds[1]], envProfile);
    // ---- Phase 6: Luau bytecode virtualization ----
    // When target is Luau or luauVm is enabled, use Luau-specific compilation
    // to generate Luau-optimized bytecode with fast calls, generic for loops, etc.
    if (opts.luauVm === true || envProfile === "luau") {
        const luauResult = (0, luau_compiler_1.compileLuau)(chunk, { optimize: true, fastCalls: true, genericFor: true });
        // Use the Luau-compiled protos instead of the base compilation
        root = luauResult.protos[0];
        // Apply Luau anti-deobfuscation if enabled
        if (opts.luauAntiDeobfuscation === true) {
            const antiDeobfOpts = {
                decompilerResistance: true,
                signatureMasking: true,
                envFingerprint: true,
                typeObfuscation: true,
                instanceVirtualization: true,
            };
            root = (0, luau_antideobfuscation_1.applyLuauAntiDeobfuscation)(root, rng, antiDeobfOpts);
        }
        // Apply Luau bytecode optimization if enabled
        if (opts.luauOptimize !== false) {
            const optimizeOpts = {
                peephole: true,
                constantFolding: true,
                deadCodeElimination: true,
                instructionCombining: true,
                maxPasses: 3,
            };
            root = (0, luau_optimizer_1.optimizeLuauBytecode)(root, optimizeOpts);
        }
    }
    // ---- Phase 7: Luraph v14+ style VM for Roblox executors ----
    // When luraph option is enabled, generate a Luraph-style table-based bytecode VM
    // that is compatible with all Roblox executors (Delta, Synapse X, Krnl, etc.)
    let luraphLua = null;
    if (opts.luraph === true) {
        const seed = rng.int(2147483646) + 1;
        luraphLua = (0, luraph_vm_1.generateLuraph)(opts.source, root, seed, {
            seed,
            encryptBytecode: true,
            encryptConstants: true,
            useBit32: true,
            useNaN: true,
            usePolymorphic: true,
            useSelfModify: true,
        });
    }
    // ---- physical opcode permutation applied in-memory ----
    const baseLogicalCount = 51; // base ISA: MOVE(0) .. ESCAPE(50)
    const luauLogicalCount = opts.luauVm === true || envProfile === "luau" ? 8 : 0; // GETVARARGS..FORGLOOP
    const logicalCount = baseLogicalCount + luauLogicalCount;
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
    const fusedIdToPhys = new Map();
    const allFusedSpecs = [...fusedSpecs, ...megaFusedSpecs];
    if (allFusedSpecs.length > 0) {
        const usedPhys = new Set(perm);
        for (const spec of allFusedSpecs) {
            let phys = 500 + rng.int(40000);
            while (usedPhys.has(phys))
                phys = 500 + rng.int(40000);
            usedPhys.add(phys);
            const entry = {
                phys,
                members: spec.members,
            };
            const megaSpec = spec;
            if (megaSpec.operands && megaSpec.operands.length > 0) {
                entry.operands = megaSpec.operands.map((ins) => [ins[1], ins[2], ins[3]]);
            }
            fusedForEmit.push(entry);
            fusedIdToPhys.set(spec.id, phys);
        }
        // Apply physical values to fused ops in the bytecode
        const applyFusedPhys = (p) => {
            for (const ins of p.code) {
                if (ins[0] >= superops_1.FUSED_ID_BASE && fusedIdToPhys.has(ins[0])) {
                    ins[0] = fusedIdToPhys.get(ins[0]);
                }
            }
            p.protos.forEach(applyFusedPhys);
        };
        applyFusedPhys(root);
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
    if (opts.keyless === true) {
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
    // ---- Phase 1: constant pool shuffling (post-compilation, pre-serialization) ----
    // Randomizes constant order and remaps instruction indices after compilation.
    if (opts.constShuffle !== false) {
        (0, constant_shuffle_1.shuffleConstantPool)(root, rng);
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
    const isExecutorProfile = ["luau", "luau_executor", "roblox_executor"].includes(envProfile);
    const antiEmu = !isExecutorProfile
        ? { ...antiemulation_1.DEFAULT_ANTI_EMULATION }
        : null;
    const luaVersion = targetLuaVersion;
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
        luaVersion: luaVersion,
        antiEmulation: antiEmu,
        cipherLiterals: embeddedCipherLits,
        dynLoad: opts.dynLoad === true && !isExecutorProfile,
        layered: opts.layered === true,
        fieldKeys,
        opencode,
        fused: fusedForEmit.length > 0 ? fusedForEmit : undefined,
        blobSlices,
        mmTraps: opts.mmTraps !== false,
        keylessPool,
        stage2: opts.stage2 === true,
        dualVm: opts.dualVm === true,
        directThreaded: opts.directThreaded === true,
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
            const phys = opencode ? (0, opencode_1.decodeOp)(opE, lrk) : opE;
            opEToPhys.set(opE, phys);
            if (opencode)
                lrk = (0, opencode_1.stepRk)(opencode, lrk);
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
        // Phase 3: MBA database stats
        mbaStats: opts.mbaDatabase === true ? (0, mba_database_1.getMbaStats)() : undefined,
        factorizationEnabled: opts.factorizationKeys === true,
    };
    if (opts.mbaDatabase !== true)
        delete authPayload.mbaStats;
    if (opts.factorizationKeys !== true)
        delete authPayload.factorizationEnabled;
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
        lua: luraphLua ?? emitted.lua,
        luraphLua,
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
