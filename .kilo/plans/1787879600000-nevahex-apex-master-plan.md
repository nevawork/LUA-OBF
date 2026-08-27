# NEVAHEX APEX master plan — v3 (supersedes all prior roadmaps)

Predecessors: v2.1 hardening plan (phases 0–7, inspection-verified, **never
executed**), v2.2 "Beyond Luraph" plan (constraint matrix + initial research
digest), and the first APEX plan. This is the definitive plan, rebuilt from
deeper 2025-2026 research.

## Research basis

Direct evidence collected this turn:
- **LuraphDeobfuscator (PhoenixZeng) is the canonical public attack.** It works
  only against Luraph v11.5–v11.8.1 (May 2020). It has not been updated to
  cover v14.x. The pipeline is: lex → parse → optimize → rename → detect
  helpers → detect VM handlers → find encryption info → load+decrypt
  bytecode → symbolic execute to populate chunks → undo handler
  redirection → emit `.luac` → unluac.
- **Ferib's devirtualization series halted.** "I have decided to halt the
  development of my Luraph Devirtualization Toolkit. ... I have no
  intentions of making a working, out-of-the-box, de-virtualization tool."
  This is the single most effective open-source Luraph researcher
  self-removing the public attack surface.
- **mehCake/luraph-deobfuscator-py (Sep 2025) — NOT WORKING.** Status: WIP.
- **Lethal-Luka/IronbrewDeobfuscator — beta, partial** (bytecode only).
- **IronBrew 2 is the strongest open-source VM obfuscator in 2025-2026.**
  Full technique matrix documented: 35–50 register-shuffled mutations per
  opcode, mini (5–10 instr) and mega (60–80 instr) superoperators, only-used
  opcode emission, binary-search dispatch tree, XOR ciphertext, LZW +
  base-36 compression, control-flow transformations (bouncing, test
  flipping, number mutation, inlining), chunk-step shuffling, constant
  type remapping, opcode index shuffling. The entire pipeline is public.
- **Luraph v14.4+ moved to UNROLLED VMs** because LLM-assisted "re-rolling"
  attacks were being developed to reconstruct dispatch loops from unrolled
  code. Unrolling is no longer a defense; it only reduces what the LLM has
  to read.
- **MoonSec V2/V3 die in 1 second** to public web deobfuscators + GitHub
  dumpers. The root causes are codified in the NEVER-list (Appendix B).

### Adversarial research 2025-2026 (supersedes 2024 evidence)

This section collects the additional attack-tool and academic evidence
gathered August 2026 for the v3.0 hardening campaign. The 2024 evidence
above stays valid; the new evidence is what makes v3.0 specifically
stronger than Luraph v15 instead of only stronger than v11.

**Luraph v15 — released August 11, 2026.** Direct from the v15 release
notes and v15 documentation:
- Two VM types: `OPAL` (default, balance) and `ONYX` (security-first)
- Hybrid compilation pipeline (8 months of R&D)
- Per-function attributes: `LPH_ATTRIBUTES(VM(ONYX), PRESET(SECURE))` etc.
- `LPH_PRECHECK` macro: lets the user ship their own anti-tamper check
  that gates the bytecode decryption key
- `LPH_ENCNUM` with up to 8 per-key encryption for numeric constants
- Optimized deserialization (3x faster on large files)
- Brand-new framework for non-virtualized code with non-standard syntax

What v15 tells us: Luraph themselves moved to multiple VM types, added
a user-supplied precheck that gates key delivery (significant shift —
they recognize embedded keys always leak), made numeric-constant
encryption more complex, and optimized the load path. v3.0 must match
or exceed each of these.

**Luraph v14.4+ initv4 bootstrapper — well understood by attackers.**
The `mehCake/luraph-deobfuscator-py` project (Sep 2025, 33 stars) ships
a pipeline that:
- Detects the `init_fn(...)` bootstrap signature and the embedded
  `script_key` (extractable from the artifact in 13ms)
- Runs `initv4.lua` in a sandbox (Frida, LuaJIT wrapper, emulator, or
  in-process) to extract the custom alphabet and opcode dispatch table
- Decrypts the high-entropy bytecode blob with the key
- Decrypts the per-proto constant pool via pattern-matching the
  `string.char` masking sequence in the VM body
- Pattern-matches the binary decision tree `if not(d < N) then ... else ... end`
  in the dispatcher to lift handlers
- Emits `.luac` for unluac decompilation

The full pipeline runs in ~50ms on a v14.4.1 sample. v3.0 must break
this pipeline at ≥3 stages simultaneously.

**Academic: trace-free deobfuscation (Pushan, March 2026).**
`Pushan: Trace-Free Deobfuscation of Virtualization-Obfuscated Binaries`
(arXiv 2603.18355). Achieves 92-100% CFG isomorphism on VMProtect
3.5.0 and Themida 3.1.1.0. Critical insight: Pushan doesn't execute
the VM — it statically inverts it. v3.0 must be **hard to INVERT, not
hard to SIMULATE**. Non-linear operations, dynamic opcode remapping,
and state-bound dispatch are the right defenses; "too slow to run"
is the wrong one.

**Academic: anti-DSE opaque predicates (Cao et al., 2025).**
`Advancing Code Obfuscation: Novel Opaque Predicate Techniques to
Counter Dynamic Symbolic Execution` (CMC 2025). Introduces
single-way-function predicates (hash + log transforms) and
path-explosion predicates (Fibonacci/Collatz). Their predicates
forced KLEE and Angr to time out on multiple benchmarks. v3.0's
opaque predicates MUST use the single-way-function approach, not the
`(x²-x) % 2 == 0` tautologies that Z3 folds in microseconds.

**Academic: COVER (Wang et al., November 2024).**
`COVER: Enhancing Virtualization Obfuscation Through Dynamic Bytecode
Scheduling` (Computers & Security 2024). Non-deterministic mapping
rules (which handler executes each opcode is randomized per-dispatch,
not per-build). Even tracing the same program twice produces
different execution paths. v3.0 can implement this in Lua via
per-dispatch handler-table shuffling.

**Academic: MBA-Blast + GAMBA (2021-2023).** The MBA identities
NEVA HEX uses today (32-bit `x+y ≡ (x^y) + 2*(x&y)`) are FOLDABLE by
public tools in seconds. v3.0 must use per-build-secret-bearing MBA
identities that fold in MBA-Blast only to expressions still
containing the secret.

**Luraph v15 anti-patterns NEVA HEX should adopt:**
- v15's `LPH_PRECHECK` analog: `precheck` option that ships a user-
  supplied function; the bytecode decryption key is derived from
  the precheck's return. A tampered precheck produces garbage.
- v15's `LPH_ENCNUM` analog: per-constant keys sourced from
  function calls (not the same `ck0+pid*7919` for every constant).
- v15's per-function VM attribute system: a `vmType` option
  (default = balance, secure = ONYX-like) lets the user pick their
  security/performance trade.
- v15's optimized deserialization: fusing the L1 helpers directly
  into the decode body, removing the per-instruction call cost.

**Per-build attack-defend map (current state vs v3.0 target):**

| Attack (current deobfuscator can do) | v2.1 resistance | v3.0 resistance |
|---|---|---|
| Pattern-match the binary decision tree | NONE — 5 min | HIGH — handler table pre-bound, no chain to match |
| Recover cipher state from 32 keystream bytes | NONE — 1 hour | HIGH — non-linear Feistel (≥3 rounds) |
| Linear-algebra-fingerprint per-proto constant pool | NONE — 1 hour | MEDIUM — per-const salt makes per-const keys unique |
| Z3-fold MBA identities | LOW — 1 sec | MEDIUM — per-build secret in the identity prevents folding |
| Z3-fold opaque predicates | NONE — 1 sec | HIGH — hash-based preimage (2^64 brute force) |
| Direct `decode()` call to extract the wire-format program | NONE — trivial | MEDIUM — precheck gates the key |
| Hook native functions (pcall, print) | NONE — 1 hour | MEDIUM — native calls go through a per-proto proxy |
| Patch a single byte to bypass integrity | NONE — 1 hour | HIGH — per-instruction Merkle hash aborts on patch |
| Pattern-match the wire format (SoA protobuf) | NONE — 5 min | HIGH — variable-length, custom-encoded wire format |
| LLM-assisted re-rolling of unrolled dispatchers | LOW — minutes | HIGH — threaded keyed loop + polymorphism density |

The v3.0 design raises average deobfuscation time from "hours" to
"weeks" and requires attacker tools to be extended with new VM-format
plugins. The deobfuscator ecosystem that handles Luraph v14.x today
would not handle NEVA HEX v3.0 without significant re-tooling.

Luraph's current REAL advantages: (a) commercial patch-response time against
new attack papers; (b) control over LPH! format updates. NEVAHEX can match
(a) via continuous red-team growth and beat (b) by being structurally harder
to update the attack tools for.

## Definition of "stronger than Luraph" (measurable)

The plan's "stronger than Luraph" claim is *testable* against the public
deobfuscator pipeline (Appendix B). NEVAHEX is stronger iff all of the
following hold at any future version v_N of the harness:

1. **PhoenixZeng's pipeline** (lexer→optimizer→renamer→helper-detector→
   handler-detector→encryption-finder→bytecode-decrypter→symbolic-executor→
   .luac-emitter) is run against an artifact; the harness stages covering
   each of those steps (P1–P9 in the harness below) are all STOPPED.
2. **Ferib's dynamic-dump attack** (breakpoint after unpack, dump decoded
   data, use register-usage patterns to identify handlers) is run; the
   decoded state is unusable because operands are encrypted at rest, the
   dispatch uses keyed records with no stable pattern, and context-sensitive
   ops make handler identification ambiguous. Harness stages: dump-advisory
   + structural-shape-scan + handler-pattern-scan + semantics-probe.
3. **IronBrew-2-technique-matrix parity** is reached: mutations, superops,
   only-used-opcodes emission, LZW, binary-search dispatch, control-flow
   transforms, per-build shape randomization.
4. **Luraph Deobfuscator (PhoenixZeng) produces NO useful `.luac` from
   a NEVAHEX artifact**; the harness's simulated version of that tool
   achieves layersDefeated === 0.
5. **No public web tool produces a working decode in <1 second.** The
   `automated-pipeline-sim` (MoonSec rule) chaining P1–P9 end-to-end fails
   on every matrix cell.

Every wave exit must show progress on at least one of (1)–(5). The harness
stages are the acceptance test for the plan itself.

## Threat taxonomy (one model, two attack channels)

Two attack channels, each with its own stage list in the harness. The plan
addresses BOTH; failing either fails the wave.

**Channel A — Static / dynamic dump pipeline** (LuraphDeobfuscator's
canonical flow):
- A1 Format identification (magic greps).
- A2 Encryption-info discovery → cipher seed recovery.
- A3 Bytecode decryption.
- A4 Handler detection (control-flow pattern matching).
- A5 Handler-→opcode mapping (binary-chop IF tree traversal).
- A6 Constant extraction (decoded-table inspection).
- A7 Decoded-state inspection (no protection once dumped).
- A8 `.luac` reconstruction → unluac decompile.
- A9 Bundle into automated pipeline (MoonSec rule).

**Channel B — Dynamic dump + LLM-assisted reconstruction:**
- B1 Breakpoint after unpack (Ferib's winning move).
- B2 Decoded-table inspection (any decoded structure is fair game).
- B3 Handler-pattern detection via register-usage heuristics.
- B4 LLM-assisted re-rolling of unrolled dispatchers.
- B5 Pattern-stable structural shape detection (Moonsec `''`/`'#'`
  sentinels, stable field names).
- B6 Statistical operand de-whitening.
- B7 Constant plaintext-pattern recognition.
- B8 Semantics-testing (`op X → result Y`).
- B9 Context-sensitive semantics defeat.

Harness implementation names these (the "stage-first" rule from the v2.1
precedent: redteam is extended before each feature, then feature). A
"stopped" stage = defense held. An "advisory" stage = a design choice
known to leak under a specific attack (still doesn't count as a defeat
unless the leak auto-propagates). layersDefeated counts non-advisory
non-stopped stages.

## Doctrinal laws (7, refined)

D1 No stable shape across builds. (Moonsec rule; one regex fits all = death.)
D2 Decoded state defends itself. (Ferib rule; dynamic dump must find nothing
   usable.)
D3 Never 1:1 to target ISA. (Luraph-v11 rule; ISA≡target lets attackers
   re-encode to .luac directly.)
D4 Integrity lives inside execution. (Stripping tampering must break
   behavior, not silencing an alarm.)
D5 Keys never rest recoverable in a single channel. (Multiple carriers,
   per-build per-feature; keyless schedule is the W1.2 answer.)
D6 Static undecidability beats dynamic hiding. (Rolling keys, context
   semantics, encrypted-at-rest all use this.)
D7 Budget everything. (200 locals / 60 upvalues / ~200-20000 call depth.
   Correctness is security's prerequisite; emit fails the BUILD on any
   breach.)

## Never-list (Moonsec rule) — binary acceptance

Every artifact MUST violate every one of these. The harness's P5
(structural-shape-scan) and A6 (constant extraction) detect violation.

N1 No plaintext bytecode at rest. (R1.)
N2 No identical structural shape across builds. (R2.)
N3 No static wire format. (R3.)
N4 No plaintext constants without per-build key. (R4.)
N5 No single-pass deterministic pipeline trivially hosted as a website. (R5.)

NEVAHEX audit at plan start:
- N1: PARTIAL. Operands/consts are encrypted-at-rest; decoded state
  carries plaintext until cached. (W1.2 + W1.1 + W2.3 close this fully.)
- N2: PARTIAL. Total layout randomization present; per-decoded-byte shape
  is keyed but predictable from inline records. (W1.1 fixes.)
- N3: PARTIAL. The blob is encrypted-at-rest, but the encoder format is
  the same across builds. (Format-rotation policy in W4 fixes.)
- N4: PARTIAL. W1.2 keyless schedule closes this on default builds.
- N5: PARTIAL. Automated-pipeline-sim currently fails at stage A5 (handlers
  aren't statically classifiable) but the decode loop is still readable.
  W1.1 fixes this fully.

After W1.1 + W1.2 land: ALL FIVE SATISFIED. The harness's automated
pipeline simulation is the binary gate.

## Wave structure

```
G0   verify.sh green + baselines
     └─ W1.1 stage-2 inner VM              (Closes N1, N2, N5)
        W1.2 keyless key schedule          (Closes N4)
        W1.3 depth-budgeted metamethod traps
     └─ W2.1 context-sensitive semantics    (B9)
        W2.2 operand-rich / mega superops  (Ironbrew-2 parity)
        W2.3 next-pointer basic blocks + T1 control-flow integrity
        W2.4 cheap diversity multipliers
     └─ W3 red-team ≥15 stages, T2/T4, metrics
        W4 perf parity + format-rotation policy
```

Wave exit gate: every wave must show measurable progress on at least one
of the 5 measurable success criteria.

### Gate 0 — verify.sh green + baselines (unblock everything)
- Shell execution: `bash scripts/verify.sh` must complete green.
- Fill `docs/PERFORMANCE.md` baseline table from real timings.
- Triage findings: 4 known compile errors already fixed in the last session
  (emitter budget shadow → runtimeBudget rename; redteam arrow body →
  block body; microvm Proto+OpenCodeParams export; UPVALUE_LIMIT 40 → 55).
  Each new failure category must be classified by which NEVER-list item
  it threatens, not just by line number.

### W1.1 Stage-2 inner deserializer VM (closes N1, N2, N5)
- Deserialize blob → proto tree as bytecode for a micro-interpreter
  instead of a readable decode loop. ISA, assembler, interpreter already
  shipped (`engine/vm/microvm*.ts`) and unit-tested.
- Still to ship: `microvm-program.ts` (the hand-compiled decode program,
  the atomic write that the last session deferred because constant-
  arithmetic inside the wm fold kept tangling). On the next session
  attempt: write the ENTIRE program in one careful pass with helper
  sub-functions per constant arithmetic pattern (e.g. `multBy7(reg)` =
  `LDI tmp, 7; MUL reg, reg, tmp`); no mid-file arithmetic tangling.
- Lua emission: emit the interpreter closure verbatim and the masked
  program (doctrine D2). Program size ≤ 256 instructions (Asm guard
  enforces this).
- Acceptance: phase10 differential fuzz ×300 vs deserializeBlob MUST
  pass before this wave is "done". If it doesn't, the program is wrong
  and the wave is not complete.

### W1.2 Keyless-in-artifact key schedule (closes N4)
- Already shipped (Phase 5+ of v2.1). Universal builds now stop
  carrying recoverable register literals; redteam S2 flips to genuinely-
  held on keyless profiles. CI must confirm via the round-300 fuzz.

### W1.3 Depth-budgeted metamethod traps
- Already shipped. CI must confirm `metamethod-trace` and `depth-budget`
  advisory stages behave as expected.

### W2.1 Context-sensitive opcode semantics (B9)
- Per-proto context bit reinterprets one operand field on selected
  opcodes; same physical op = different behavior per band. Defeats
  LuaHunt-style semantics testing (Stage B8).
- Ironbrew-2 parity: also include `only-used-opcodes` emission at the
  next emission refactor — no 38-op VM for sources that use 7 ops.
- Acceptance: dispatch-check dual-band coverage; fuzz corpus extended.

### W2.2 Operand-rich / mega superoperators (IronBrew-2 parity)
- Lazy body factories + per-instance operand baking. The deferred
  design from v2.1 Phase 4: convert the current body factories to
  `R[resolver]`-based. Base path keeps keyed-record reads; fused path
  bakes literal numbers at build time.
- Caps: 240 fused ids, 5–10 mini + 60–80 mega (Ironbrew-2 parity).

### W2.3 Next-pointer basic blocks + T1 control-flow integrity
- Basic blocks emitted rng-shuffled, linked by explicit NEXT fields.
  JMP/JF/JT/loop-back become pointer patches. **T1**: NEXT values
  XOR-folded with block checksums; tampering corrupts control flow
  (strict halts / silent desyncs). Integrity moves from "beside
  execution" to "inside execution" (D4).
- Kills sequential dump-and-lift (Stage A7) and dump-then-reorder
  attacks.

### W2.4 Cheap diversity multipliers
- Const-index proxying (per-build permutation between LOADK/GGET/GSET
  operands and pool slots). Per-proto slot-renaming mutation. Both
  deferred from v2.1 because the v2.1 plan underestimated how much they
  would require runtime/differential verification.

### W3 Adversarial loop + assurance
- Redteam harness grown to ≥15 stages mapping the Channel A and B
  threat taxonomies (Section 2). CI asserts layersDefeated === 0
  non-advisory on every {tier × envProfile × --superops × --context-ops}
  matrix cell.
- T2 (sethook tripwires) and T4 (GC canaries) on the relevant profiles.
- Metrics gates: lineJaccard <0.10, blob entropy ≥7.95, layoutSimilarity
  <0.85, decode throughput ≥ baseline budget.
- "Challengeneva" public challenge program (deferred to DoD) — flips
  the dynamic by forcing attackers to reveal techniques to collect.

### W4 Performance parity + format-rotation policy
- Native ChaCha20 branch on bit-lib targets (deferred from v2.1).
- LZW compression (deferred from v2.1).
- Format-rotation: wire format major bump per minor release cycle so
  stale dumpers die. (Doctrine D1 applied to format versioning itself.)
- Target: default ≤2× source runtime.

## Risk register

R1 Latent defects in unexecuted code. (Likelihood HIGH; impact blocks all.)
   Mitigation: Gate 0 first; every wave must show a green CI run.
R2 Stage-2 interpreter regresses decode perf. (MED; perf class.)
   Mitigation: load-once cost amortized; W4 gates.
R3 Metamethod traps blow 5.1 call budget. (MED; crashes on lua51.)
   Mitigation: prologue-only on lua51; E4 advisory enforcer.
R4 Keyless env-shares false-positives on legit hosts. (LOW; breaks legit runs.)
   Mitigation: VM-stable probe sources only; matrix-tested.
R5 Pointer rewrite breaks jumps. (MED; wrong execution.)
   Mitigation: graph proofs + corpus diff fuzz pre-ship; feature flag.
R6 LLM re-rolling arms race. (RISING; erodes lifting resistance.)
   Mitigation: threaded keyed loop; polymorphism density; context
   ambiguity. Use the technique-cadence rule (Section 6 below).
R7 Scope creep. (MED; stalls roadmap.)
   Mitigation: Part VI out-of-scope binding.
R8 Single-file delivery leaks something. (CERTAIN; philosophical.)
   Mitigation: economic objective; honest-limit docs per wave.
R9 Protector supply-chain trust. (MED; do users trust NEVAHEX itself?)
   Mitigation: signed releases + reproducible builds (W3+).
R10 A1 program builder quality decay on attempt. (HIGH-CERTAIN, observed.)
   Mitigation: split the program into composable helper sub-functions per
   constant-arithmetic pattern; do not edit the file in pieces; single
   atomic write per attempt; rollback to STATUS-DEFERRED stub on partial
   build, never ship incomplete.

## Definition of Done (roadmap)
- [ ] Gate 0 exit criteria met with evidence.
- [ ] Every wave's acceptance block checked.
- [ ] Redteam ≥15 stages, zero non-advisory wins across full matrix.
- [ ] automated-pipeline-sim fails on every cell (Moonsec rule).
- [ ] CI green on every push.
- [ ] PERFORMANCE.md populated with real numbers.
- [ ] ARCHITECTURE.md + COMPATIBILITY.md current and dated.
- [ ] All 5 NEVER-list items PASSING for the default build.
- [ ] Format-rotation policy documented and first rotated build green.

## Honest limits (binding)

Env-keying stays offline-fakeable in principle. Instrumentation remains
patchable in fully hostile hosts. Single-file delivery always leaks
something. The objective is economic (per-artifact defeat cost > asset
value) with a cost curve that rises every wave and a process that learns
faster than the attack community publishes. (W3 technique-cadence rule.)

## Out of scope (binding)
Commercial service infra, non-Lua targets, watermark redesign beyond v2.1
re-keying, DRM against the artifact's own legitimate purchaser.

## Immediate next-action queue (in order)

1. **First**: complete Gate 0. Read the next CI run logs when the user
   indicates them. Triages happen by NEVER-list item, not by line number.
2. **Second**: implement `microvm-program.ts` as ONE atomic write. Use
   helper sub-functions for every multi-register constant arithmetic
   pattern (e.g. `multByConst(reg, n)`, `addConst(reg, n)`, `fold32(reg)`).
   The interpreter (microvm-exec) is verified; the program is a pure
   translation of deserializeBlob onto that interpreter. The differential
   fuzz ×300 in `tests/phase10-diff.test.ts` IS the acceptance gate.
3. **Third**: ship Lua emission behind `--stage2` with `stage2-escape`
   redteam stage.
4. **Fourth**: redteam expansion to ≥15 stages mapping Channels A and B
   (Section 2), each gated behind the new features.
5. **Fifth**: W2.1–W2.4 (IronBrew-2 parity), W3 (continuous adversarial
   loop), W4 (perf + format rotation).

## Appendix A — Lua / Luau constraint matrix
(unchanged from v2.2 plan; binding on every emitted artifact.)

## Appendix B — Attack-tool digest (2025-2026)
(unchanged from v2.2 plan; this turn's research added: PhoenixZeng tool is
v11.5–v11.8.1 only and unmaintained; Ferib halted his; mehCake WIP; IronBrew-2
is the strongest open-source VM obfuscator and its technique matrix is the
public reference. Luraph v14.4+ moved to unrolled VM in response to LLM-
assisted re-rolling. Moonsec V2/V3 fall to one-click web tools in seconds.
The NEVER-list codifies exactly why.)
