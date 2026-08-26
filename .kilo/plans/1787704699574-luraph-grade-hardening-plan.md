# NEVAHEX-VM v2.1 → Luraph-grade hardening plan

> PROGRESS (session 2026-08-26)
> - Phase 0: SHIPPED (manifest secrets opt-in + HMAC auth, blob framing v3,
>   BuildRng string keys, per-build flatten names, anti-emu locals, token scrub).
> - Phase 1 core: SHIPPED (cipher v3 4-stream feedback + emitter mirrors +
>   wasmoon parity test). DEFERRED pending runnable tests: LZW, native ChaCha20.
> - Phase 2: SHIPPED — opencode.ts rolling-key codec; wire v3.2 keyed records +
>   split jumps; range-tree dispatch with polymorphic bodies; keyed integrity
>   hash; dispatch-check encoded mode; tests/phase2.test.ts. Operand-slot audit
>   against compiler emit sites completed (SETLIST/SETTABAT fixes applied).
>   Deferred: --context-ops.
> - Phase 3: SHIPPED (core) — constant-pool payload masking + decrypt-on-access
>   CV accessor ({t,n,b} records, cache in e.v); operand whitening via the
>   rolling-key chain with share-compensated B; deserializeBlob opencode mirror;
>   holder tooling keys (opencode/fieldKeys) under emitSecrets; diagnose.cjs
>   updated; tests/phase3.test.ts. Deferred: const-index proxy,
>   next-pointer basic-block shuffle.
> - Phase 4: SHIPPED (core, opt-in --superops) — superops.ts mining (zero-op
>   class, interior-target constraint, caps), NOP rewrite preserving positions,
>   fused phys band [500,40500), dispatcher verbatim-member synthesis + pc skip
>   (silent-tier poison mirrored), dispatch-check extraReal, tests/phase4.test.ts.
>   ALSO FIXED latent bug: CLOSURE remap ran on permuted code against the
>   logical constant — now keyed off ctx.permMap[18] (serializer) with
>   pipeline passing its permutation. Deferred: operand-rich/mega fusion,
>   slot-renaming mutation.
> - Phase 5: SHIPPED — cipherguard.ts (pre-decode ciphertext windows; strict
>   halt / silent seed-shift), CVW cross-coupling into the CV key stream,
>   anti-emulation v2 (3-probe convergence, graceful abstain), behavioral
>   env-keying probes both sides, decoded-table ticks retained as decoys;
>   tests/phase5.test.ts.
> - BLOCKER: session denies bash; nothing executed yet. Run
>   `bash scripts/verify.sh` the moment shell access is granted.

## Goal

Close every weakness identified in the audit and add the layers that separate
NEVAHEX-VM from Luraph/IronBrew2-class protection. Decisions made with user:

- **Approach:** phased hardening of the existing v2.1 engine (keep pipeline,
  AST front-end, ISA shape, `scripts/verify.sh` as the regression gate).
- **Cipher:** hybrid — strengthen the doubles-only universal path AND emit
  `bit`/`bit32`-accelerated ChaCha20 on LuaJIT/Luau targets with fallback.
- **Priority:** maximum reverse-engineering resistance; accept 2–10x runtime
  slowdown and larger artifacts.

## Audit summary (what we are fixing)

| # | Weakness | Location |
|---|----------|----------|
| W1 | Cipher seeds embedded in artifact; manifest ships nonce+all seeds | `src/vm/emitter.ts:243`, `src/cli.ts:54`, `src/pipeline.ts:171-189` |
| W2 | Dual Lehmer-LCG additive cipher; fixed `"NVX\x02"` magic = known plaintext; ChaCha20 exists but unused | `src/engine/crypto/cipher.ts`, `src/engine/vm/serializer.ts:101` |
| W3 | Single static runtime template; handler bodies unique/greppable per op; `op==<literal>` tests leak the permutation → one devirtualizer kills all builds | `src/engine/runtime/dispatcher.ts`, `assembleChain()` |
| W4 | No instruction mutations, no superoperators, plaintext operands/constants after decode | compiler/serializer |
| W5 | Integrity ticks decorative (hash over attacker-controlled decoded tables, ≤32 slices, lifter never executes) | `src/protection/antitamper.ts`, `src/engine/runtime/integrity.ts` |
| W6 | Env-keying derives from fully public static inputs (`_VERSION` + ~10 global presence bits) | `src/protection/envkeying.ts` |
| W7 | Transform signatures: fixed names `__st/__d0/__d1`; constant-foldable guards; string keys counter-derived (identical across builds — violates isomorphism invariant) | `src/transforms/flatten.ts:81`, `opaque.ts:99-128`, `strings.ts:34` |
| W8 | Anti-emu: single `os.clock` floor in patchable globals; dead on Luau | `src/protection/antiemulation.ts` |
| W9 | Perf: linear if/elseif dispatch (~25 compares/instr avg), char-by-char string building, recursive `ur()` unpack | `emitter.ts`, `dispatcher.ts` |

Security hygiene found during audit: `package.json:13` embeds a GitHub access
token in the repository URL. Rotate the credential and strip it from the URL
as part of Phase 0.

## Reference techniques being adopted (research-grounded)

- **Luraph:** layered pre-VM/deserialize/exec stages, runtime-encrypted
  constants, randomized non-positional instruction field keys, control flow
  hidden in metamethods, non-nested closure chaining, compressed custom blob.
- **IronBrew2:** 35–50 register-shuffled mutation variants per opcode, mini
  (≤10) / mega (≤80-instruction) superoperators, binary-search dispatch,
  used-opcode-only emission, XOR + LZW bytecode compression.
- **Attack literature to defeat** (LuaHunt interpreter-semantics testing,
  LuraphDeobfuscator handler-lifting, published IB2/AztupBrew breakers):
  remove stable handler signatures, remove literal opcode tests, keep data
  encrypted until the moment of use, couple tamper response into decryption.

---

## Phases (ordered; each lands green on `bash scripts/verify.sh`)

### Phase 0 — Key hygiene & signature removal (quick wins)

1. Manifest: stop emitting `nonce` and `seeds` by default; add `--emit-secrets`
   for holder-side workflows. Add keyed authenticity tag (HMAC-SHA256 over
   build params) instead. Update `extract.ts` accordingly.
2. Blob framing: delete the `"NVX"` magic + fixed version byte from plaintext;
   prepend a random 16–64-byte prologue inside the encrypted region so
   plaintext starts with high-entropy bytes (kills known-plaintext attack).
   Bump internal blob version to 3; keep deserializeBlob/decoder in lockstep.
3. `transforms/strings.ts`: derive per-literal keys from `BuildRng` (thread rng
   through `encryptStrings`) instead of the fixed counter sequence.
4. Remove shipped debug surfaces: gate `__ae_*` anti-emu globals behind
   file-local upvalues; ensure `NEVAHEX_DEBUG` blocks can never ship (assert in
   pipeline when env var set during release builds).
5. `package.json`: rotate/remove the leaked git token; scrub from history note.
6. Tests: unit test asserting no output contains raw seed literals; grep-scan
   test for `__st`/`__d0`/`__d1` style fixed transform identifiers (also fix
   them: rename per-build via IdAllocator in flatten.ts).

### Phase 1 — Cipher overhaul (W2, W6 partial)

1. New universal doubles-only stream cipher in `engine/crypto/cipher.ts`
   (keep module contract): 4-wide LCG state with distinct large-prime
   multipliers, per-step cross-mixing of streams and previous output byte;
   final byte = nonlinear fold `(a*31+b*17+c*7+d*3+carry) % 256`. All
   intermediates < 2^53 (split 26-bit multiply helper where needed). Must be
   byte-exact reproducible in Lua 5.1 / LuaJIT / Luau.
2. Target-accelerated path: emitter detects profile `luajit`/`luau` and emits a
   ChaCha20 (RFC 8439) quarter-round implementation using `bit`/`bit32`;
   artifact feature-detects the library at load and selects the matching
   branch; absence falls back to the universal path (blob carries both key
   schedules derived domain-separated from the master nonce).
3. LZW compression before encryption (pure-Lua decompressor in the runtime,
   build-side compressor in TS) — destroys residual structure, shrinks size.
4. Env-keying: fold the cipher choice + library detection result into the
   seed-mix constant so wrong-environment still fails cryptically.
5. Differential tests: JS↔Lua (wasmoon) round-trips for both cipher paths ×
   all four targets; entropy assertion ≈ 8.0 bits/byte on emitted blob.

### Phase 2 — Dispatch hardening: kill handler lifting (W3)

1. **Encoded opcode tests:** replace `op == literal` with comparison against a
   value derived from rolling state: expected = f(prevOpHash, pc-band, phase);
   instruction opcodes are pre-transformed at build time. Static regex
   extraction of handler→opcode mapping becomes impossible without emulating
   the rolling key. Extend `testing/dispatch-check.ts` FIRST so self-
   verification covers the encoding.
2. **Randomized non-positional instruction records** (Luraph-style): decoded
   instructions become tables keyed by per-build random integer keys
   (`ins[K_OP]`, `ins[K_A]`, …); K_* constants live only in emitted code.
3. Binary-search dispatch tree (IB2-style) over encoded bands replacing the
   linear chain; keep `assembleChain` API; decoy arms interleaved sharing the
   syntactic shape of real arms (current `100+s` decoys are recognizable).
4. **Handler polymorphism:** ≥3 semantic-equivalent body variants per logical
   opcode in `dispatcher.ts`; per-build combinatorial selection; variant pool
   grows over time.
5. **Split jump targets:** offsets stored as two shares summed at dispatch
   (`pc = pc + ins[K_B1] + ins[K_B2]`); compiler/serializer/dispatcher updated
   together; FORPREP/FORLOOP/GFOR* included.
6. Optional `--context-ops`: selected opcodes reinterpret an operand based on
   a per-proto context bit resolved in emitted code — defeats LuaGadget
   black-box semantics testing (same physical number, different behavior).

### Phase 3 — Data-plane encryption inside the VM (W4 partial)

1. Constant pools stay encrypted in decoded protos; decrypt-on-access through
   a per-proto keyed accessor (key = f(seeds[3], protoId)); GGET/SETTAB/CALL
   read through it. Constants never rest plaintext in a dumpable table.
2. LOADK constant-index proxying via per-build permutation map (indirection
   layer between operand and pool slot).
3. Operand whitening: A/B/C masked with a rolling keystream at build time;
   single unmask point at instruction fetch into frame locals.
4. Basic-block instruction shuffling with explicit next-pointers (encoded
   relative jumps become next-pointer patches) — Luraph's "unexpected control
   flow redirect" effect inside protos.

### Phase 4 — Mutations & superoperators (W4)

1. Superoperator folding pass over flat protos pre-serialization: mine
   frequent n-grams without interior jump targets; fuse into new opcodes
   (mini ≤10, mega ≤40 to start); fused handlers emitted as concatenated
   member-handler variants. Cap added opcodes (~200); flag-configurable.
2. Per-proto slot-renaming permutation applied to operands at serialization,
   undone by a decoder-side map — cheap diversity multiplier (mutation-lite).
3. Include fused ops in permutation, integrity slicing, and dispatch checks.

### Phase 5 — Anti-tamper / anti-analysis that bites (W5, W6, W8)

1. Integrity moves to ciphertext: build-time hashes over encrypted blob
   ranges verified by the loader BEFORE the decode loop (no longer computed
   over attacker-controlled decoded tables).
2. Cross-coupled response: silent-tier violation feeds the poison value into
   the constant-decryption key derivation (not just arithmetic bias) so
   copied-but-tampered runtimes decrypt garbage; strict tier unchanged.
3. Anti-emulation v2: multi-signal (os.clock rate, collectgarbage("count")
   growth timing, string.rep micro-benchmark where available), results folded
   derive-not-compare into the seed mix instead of branching; graceful
   per-target degradation (still off for Luau core signals it lacks).
4. Env-keying signal pool expansion: behavioral probes deterministic per VM
   family (float formatting precision of chosen doubles, math.fmod edge
   cases, string.rep identity) mixed alongside presence bits. Document honest
   limits: offline-fakeable in principle, raises cost substantially.

### Phase 6 — Performance & size engineering (W9)

1. Hot-handler localization: cache `ins` field reads into frame locals once
   per dispatch; array-backed stack discipline for S with length local.
2. Decoder: batched varint reader (pointer locals over `string.byte`),
   `table.concat` for string materialization instead of `sv = sv .. ch()`.
3. Replace recursive `ur()` unpack with `table.unpack`/`unpack` fast path +
   recursive fallback.
4. Re-measure: fib/smoke fixture overhead budget documented in README table
   (baseline now, after each phase).

### Phase 7 — Red-team harness & docs

1. New `src/testing/redteam.ts`: implements the published attack pipeline
   (handler-signature scan → permutation recovery → blob decode → lift to
   Lua-ish IR) against our own output; CI asserts it FAILS per layer; report
   counts "layers defeated".
2. `testing/metrics.ts`: add cross-build handler-body similarity (target
   < 0.15 like layout similarity), encoded-op entropy, blob entropy.
3. Update `docs/ARCHITECTURE.md` (layout map, invariants, threat model notes)
   and CLI help for new flags: `--emit-secrets`, `--context-ops`,
   `--superops`, `--cipher auto|universal|native`.

## Validation

- Every phase: `bash scripts/verify.sh` (tsc + e2e differential + vitest +
  determinism/isomorphism) green before commit.
- New per-phase tests as listed above; red-team harness green (fails to lift)
  from Phase 2 onward.
- Determinism invariant preserved throughout (same seed ⇒ identical bytes),
  isomorphism invariant (different seed ⇒ dissimilar layout AND bodies).
- Manual smoke: protect `fixtures/smoke.lua` for lua51/luajit/luau profiles
  and diff observable behavior via e2e EXPECTED checks.

## Risks / mitigations

- Doubles-only strong cipher perf on large blobs → LZW-first shrinks input;
  native bit-lib path covers LuaJIT/Luau (the common heavy cases).
- Encoded dispatch complexity can silently break jumps → dispatch-check
  extension lands BEFORE the encoding change; fuzz suite extended each phase.
- Luau sandbox gaps (no os.clock/loadstring) → per-target capability matrix
  tested explicitly; features degrade, never crash.
- Superoperator file-size blowup → capped op count, `--superops` levels.
- wasmoon is Lua 5.4: universal-path differential coverage is real, but
  LuaJIT-specific native-cipher branch needs a luajit runner in CI or is
  covered by unit-level JS emulation + documented manual test.

## Out of scope (future v3)

Full deserializer-VM stage (pre-VM executing a second VM), metamethod-hidden
dispatch traps (`__mod`-style), Roblox `__namecall` virtualization, watermark
scheme redesign beyond re-keying.

---

## Appendix A — Implementation-grade designs (highest-risk components)

### A.1 Universal doubles-only stream cipher (replaces dual-Lehmer)

Constraint: byte-exact reproduction in Lua 5.1/LuaJIT/Luau using only `+ - * %
math.floor`, every intermediate < 2^53.

- State: four registers `s0..s3`, each normalized into `[1, M)` where
  `M = 2147483647`. Multipliers chosen near the doubles-safety ceiling:
  `m = {48271, 69621, 2994349, 4050403}` (last two prime). Safety proof:
  `(M-1) * m_max ≈ 8.67e15 < 2^53 ≈ 9.007e15`; emit `% M` immediately after.
- Per byte: advance all four streams, then cross-mix previous output back:
  `s1 = (s1 + prev) % M`, `s2 = (s2 + s0) % M` (feedback chain defeats
  per-stream LCG prediction).
- Output fold: `b = (math.floor(s0/65536)*31 + math.floor(s1/2048)*17 +
  math.floor(s2/1024)*7 + math.floor(s3/256)*3 + prev) % 256`.
- Keying: build-side derives `(s0,s1,s2,s3)` from sha256(nonce,
  "blob-cipher-v3") domain split; runtime receives two obfuscated register
  literals and derives the other two by fixed arithmetic (`s2=(s0*31+s1)%M`,
  `s3=(s1*17+s0)%M`) so only two literals ever ship (or zero under env-keying).
- Period: lcm of the four stream periods ≥ 2^120; feedback makes repetition
  non-cycle-aligned.

### A.2 Native bit-lib path (LuaJIT `bit`, Luau/Lua5.2+ `bit32`)

- Emitter emits one ChaCha20 block function per artifact from the existing
  RFC 8439 logic in `engine/crypto/prng.ts` (transpiled to
  `bxor/band/lor/lshift/rshift` calls). Library resolution preamble:
  `local B=bit32 or bit if not (B and B.bxor) then B=nil end`.
- Two key schedules ship domain-separated from the master nonce; artifact
  selects native vs universal branch at load; selection result folds into the
  env-keying mix constant (Phase 1 item 4) so forcing the wrong branch fails
  cryptically rather than silently downgrading.

### A.3 Encoded dispatch (Phase 2 core)

- Build time simulates the exact instruction-fetch order per proto (deterministic):
  rolling key `r_{n+1} = (r_n * A + pc_n + opPerm[real]) % M31` with per-build
  odd `A ∈ [1e6, M)`, `r_0` embedded as obfuscated literal per proto.
- Instruction field stores `opE = (opPerm[real] * 131 + r_n) % 65536`
  (precomputed; no runtime knowledge of `real` needed).
- Runtime fetch: `op = (ins[K_OP] - r * 131) % 65536` … wait — inversion must
  be exact: store instead `opE = (permBand + r_n) % 65536` with
  `permBand = opPerm[real]` scaled into a reserved band; decode
  `op = (opE - r) % 65536` into a frame local consumed by a binary-search tree
  over bands; decoy arms compare garbage band values. Static reading of tests
  yields band numbers whose meaning depends on `r`, unknowable without
  emulating the chain.
- `testing/dispatch-check.ts` extension lands FIRST: it already executes the
  emitted dispatch against used ops; extend it to simulate the rolling key in
  TS and assert every real op decodes to its unique handler arm.

### A.4 Non-positional records & split jumps

- Decoder materializes each instruction as `{[K_OP]=…,[K_A]=…,[K_B1]=…,
  [K_B2]=…,[K_C]=…}` with five per-build random keys in `[100, 999983]`;
  handlers read via those locals (hoisted once per frame).
- Jump offsets stored as shares `B1 = rng.int(4096)+1, B2 = B - B1`; handler
  form `pc = pc + ins[K_B1] + ins[K_B2]`. Serializer/compiler patch both
  shares on `here()` fixups.

### A.5 Superoperator folding (Phase 4)

- Candidate mining: sliding windows n ∈ [2..10] (mini) and [11..40] (mega)
  over each proto's code, skipping windows containing any jump-target entry
  or CLOSURE-followed slots; score by global frequency; greedily accept until
  ≤200 fused ids or no candidate ≥ min-count (3).
- Fused handler body = concatenation of selected member-handler variant
  bodies with shared locals hoisted (`do…end` scoping per member); fused ops
  join the permutation space AFTER base ops so base encoding stays stable.

### A.6 Ciphertext integrity placement (Phase 5)

- Build computes FNV-style hash over encrypted blob byte ranges
  `[start,len]` (sampled ≤64 windows); loader verifies before the decode loop
  runs, response routed through tier policy. Decoded-table ticks remain only
  as decoys (cheap, kept deliberately so attackers waste effort removing the
  wrong layer).

## Appendix B — Suggested execution order for the implementing agent

Wave 1 (parallelizable): Phase 0 items 1–6 (all independent files).
Wave 2: Phase 1 cipher (cipher.ts → serializer → emitter → e2e matrix).
Wave 3 (sequential, dispatch-check first): Phase 2 items 1→2→3→4→5→6.
Wave 4 (parallel): Phase 3 data-plane + Phase 4 mutations (different modules;
merge Phase 4 after 3 to avoid serializer conflicts).
Wave 5: Phase 5 anti-tamper relocation.
Wave 6 (parallel): Phase 6 perf + Phase 7 redteam/metrics/docs.
Each wave ends with `bash scripts/verify.sh` green + git commit per phase.
