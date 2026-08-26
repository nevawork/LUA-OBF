# NEVAHEX v2.2 — "Beyond Luraph" — master plan

Successor to `1787704699574-luraph-grade-hardening-plan.md` (phases 0–7,
shipped, inspection-verified). This roadmap closes the remaining structural
gaps to Luraph, then attacks the two dimensions where neither product stands:
keyless artifacts and permanent resistance to automated lifting.

Research basis (2026-08): lua.org 5.1/5.2 sources (`luaconf.h`, `llimits.h`,
`ldo.c`), luau.org/compatibility, Roblox devforum announcements,
PhoenixZeng/LuraphDeobfuscator, Ferib's Lua-devirtualization series,
Prometheus Deobfuscator toolkit (MoonSecV2/V3), MoonSec V3 field-break posts,
Luraph v14 unrolled-VM shift. Full matrices: Appendix A (Lua/Luau limits),
Appendix B (attack/tool digest).

---

## 0. Executive summary

| # | Wave | Flagship deliverable | Gap it closes vs Luraph | Effort | Risk | Depends on |
|---|------|---------------------|-------------------------|--------|------|-----------|
| G0 | Verification & correctness | verify.sh green · baselines · E1–E6 fixes | credibility (nothing is proven until this lands) | M | LOW | shell access |
| W1.1 | Stage-2 deserializer VM | decode loop becomes bytecode for a micro-interpreter (+T3 self-checksum) | layered architecture (their biggest edge) | L | MED | G0 |
| W1.2 | Keyless-in-artifact keys | 6-share XOR-fold schedule; universal stops shipping registers | key secrecy (they ship keys too) | M | MED | G0 |
| W1.3 | Metamethod traps | depth-budgeted, Roblox-degraded hidden dispatch | metamethod-hidden control flow | S | MED | G0, E4 |
| W2.1 | Context-sensitive ops | same op ≠ same semantics per band | black-box semantics testing | M | MED | G0 |
| W2.2 | Mega-superoperators | operand-rich fusion ≤40 instrs, 240 ids | their fused-op performance/obf class | L | MED | G0 |
| W2.3 | Next-pointer CFG + T1 integrity | shuffled blocks, checksum-folded pointers | dump-and-lift kills; tamper woven into execution | L | HIGH | W2.2 |
| W2.4 | Diversity multipliers | const-index proxying, slot-renaming | cheap layout entropy | S | LOW | G0 |
| W3 | Adversarial loop | redteam ≥15 tool-mapped stages, T2/T4 tripwires, metrics gates | continuous-defense process | M | LOW | each wave |
| W4 | Performance parity | native cipher default, ≤2× overhead target | runtime cost class | M | LOW | G0 baselines |

Effort: S ≈ hours, M ≈ 1–3 sessions, L ≈ multi-session with fuzz harnesses.
Risk = probability of semantic breakage requiring differential-debug cycles.

## 1. Definition of "stronger than Luraph" (measurable)

1. Red-team harness ≥15 stages, `layersDefeated === 0` on every
   `{tier}×{envProfile}×{--superops}×{--context-ops}` cell — including stages
   modeling attacks Luraph publicly suffered (format recovery, handler
   lifting, constant dumps) plus Appendix B tool-mapped stages.
2. Universal-profile artifacts carry ZERO recoverable cipher registers
   (Luraph ships keys; we won't).
3. Recovered bytecode does not lift: sequential dump-and-lift fails by
   construction (context-sensitive ops + next-pointer flow).
4. Default-profile overhead ≤2× source, measured in PERFORMANCE.md per wave.
5. Time-to-harness-stage for any new public deobfuscation technique ≤ one
   wave (the process edge that keeps Luraph ahead — copied).
6. **One-click resistance (MoonSec rule):** the `automated-pipeline-sim`
   stage — chaining key-recovery → decrypt → deserialize → lift with zero
   manual steps — must fail on every profile; no NEVAHEX artifact class may
   ever match the MoonSec V2/V3 "seconds, zero expertise" profile.

## 2. Gate 0 — verification unlock & correctness pre-work ⛒ blocked on shell access

1. Permit shell → `bash scripts/verify.sh`; fix everything surfaced across
   shipped phases 0–7; fill `docs/PERFORMANCE.md` baseline table.
2. Constraint-matrix correctness items (details: Appendix A):
   - **E1** local-budget governor ≤170/function region (limit 200),
     **E2** upvalue guard ≤40 in `run()` (limit 60 on 5.1/LuaJIT) — new
     `engine/runtime/localbudget.ts`, build-time asserts, text-count tests.
   - **E3 NaN bugfix**: `tonumber("(0/0)")` ⇒ nil today — replace text
     encodings with wire tags 7(NaN)/8(+inf)/9(−inf); serializer + TS mirror
     + CV accessor + tests.
   - **E5** version-compat matrix runners (lua5.1/LuaJIT/luau CLI) or dated
     manual checklist in `docs/COMPATIBILITY.md`.
   - **E6** precedence discipline codified (all compound emitted arithmetic
     fully parenthesized).
3. Deferred v2.1 features flip on behind differential tests:
   LZW compression (10k-buffer codec fuzz), native bit-lib ChaCha20 branch,
   `--superops`/`--context-ops` default decisions from the perf table.

Exit: verify.sh green · baselines filled · E1–E6 landed · flips decided.

## 3. Workstreams

### W1.1 Stage-2 deserializer VM ("inner VM") — closes the largest gap
- The proto-deserialization *program* itself becomes bytecode (~15 ops:
  READ-uvar/svar, LD, ADD/XOR, ST, JMP/JEQ, CALLV, HALT) executed by a tiny
  opaque micro-interpreter closure; the readable decode loop disappears.
- Inner program rolling-key encoded; keys domain-separated
  (`sha256(nonce,"stage2")`) inside CVW coupling; **T3 self-checksum** folds
  the program's own hash into jump decoding.
- E1 budgets apply (interpreter is just another emitted function).
- Accept: e2e ×4 targets green; redteam `stage2-escape` added & held;
  zero deserialize-loop signatures outside interpreter text
  (`pr.c[i]=`, `pr.k[i]=`, pid-loop patterns absent).

### W1.2 Keyless-in-artifact key schedule — wins where Luraph cannot follow
- Effective seed pair split into K=6 XOR shares: three hidden in decoy
  structures (garbage pool, slice padding, watermark tail), two derived from
  behavioral probes (VM-stable by construction — see risk R4), one folded
  from pc-independent constants. Reassembly before keystream init.
- Universal artifacts stop carrying recoverable registers ⇒ redteam
  `seed-literal-recovery` flips advisory-loss → genuinely-held on ALL
  profiles. `--emit-secrets` manifests carry every share (holder recovery).
- Accept: S2 held everywhere; determinism/isomorphism green; extraction only
  via secrets manifest.

### W1.3 Metamethod dispatch traps — depth-budgeted, Roblox-degraded
- Traps bind ONLY to plain tables we own (Roblox freezes string metatables).
- **Depth budget (E4):** metamethod handlers burn Lua-5.1 call slots
  (`nCcalls` counts Lua calls) ⇒ lua51 profile: one-shot/prologue traps only,
  net depth ≤ +1; luajit (unbounded) / luau (20k) may go richer.
- Per-build rng picks trap type (__index/__add/__concat) and density.
- Accept: e2e incl. Luau degraded; redteam `metamethod-trace` held; E4
  advisory confirms no per-dispatch indirection ships for lua51.

### W2.1 Context-sensitive opcode semantics (`--context-ops`)
- Per-proto context bit (pid-band parity) reinterprets ONE designated operand
  field on selected opcodes. Black-box semantics testing (run op X, record Y)
  becomes ambiguous — same physical number, different behavior per band.
- Serializer encodes both bands; dispatch-check simulates dual-band coverage.
- Accept: cross-band fuzz programs; redteam `semantics-probe` held.

### W2.2 Operand-rich / mega superoperators
- Lazy body factories + operand-resolver interface (base: keyed-record reads;
  fused: per-instance baked literals) — the v2.1 Phase-4 deferred design.
- n-grams ≤40 instructions, no interior targets/terminals, cap 240 ids,
  trailing-jump compensation per original mining notes.
- Accept: property tests (validity, compensation), e2e, perf ratio improves.

### W2.3 Next-pointer basic blocks + control-flow-coupled integrity (T1)
- Basic blocks emitted rng-shuffled, linked by NEXT record fields;
  JMP/JF/JT/FORPREP/FORLOOP/GFOR* rewritten onto the pointer graph.
- **T1:** NEXT values XOR-folded with block code checksums — stripping or
  tampering corrupts the pointer, i.e., integrity lives INSIDE execution:
  strict ⇒ cryptic pc garbage halt; silent ⇒ natural wrong results.
- Accept: generator-corpus equivalence fuzz (wasmoon diff); redteam
  `sequential-lift` held; mutation test proves corrupted NEXT behaves per tier.

### W2.4 Cheap diversity multipliers
Const-index proxying (per-build LOADK/GGET/GSET slot permutation) +
per-proto slot-renaming at serialization with decoder-side undo
(op-class-aware operand-semantics table). Accept: round-trip properties;
similarity metrics unaffected.

## 4. W3 — Adversarial loop & assurance (continuous)

- Redteam to ≥15 stages, tool-mapped (Appendix B):
  `lph-handler-pattern-scan`, `dynamic-dump-advisory`,
  `structural-shape-scan`, `stage2-escape`, `metamethod-trace`,
  `semantics-probe`, `sequential-lift`, `depth-budget`,
  `share-reconstruction`, statistical de-whitening detector, and
  **`automated-pipeline-sim`** (MoonSec-rule enforcement: the full S2→S3→S5
  chain must fail end-to-end, not just per-stage). Zero
  non-advisory wins enforced per matrix cell.
- **T2 instrumentation tripwires** (lua51/luajit): short
  `debug.sethook("count",N)` windows during load; hit-count anomalies fold
  into CVW. Luau abstains (no sethook).
- **T4 GC canaries** (abstain-safe): marker-table survival/count sanity into
  the same derive-not-compare sink.
- Metrics gates in tests: lineJaccard <0.10 · blob entropy ≥7.95 ·
  layoutSimilarity <0.85 · decode throughput ≥ budget.
- Technique-review cadence: new public tool/paper ⇒ new harness stage ⇒
  defense or documented advisory (CONTRIBUTING checklist).
- Roblox depth: `__namecall` virtualization behind the luau profile.

## 5. W4 — Performance parity (continuous)

Native cipher default on bit-lib targets; universal step unrolled &
measured; superoperator speedups validated against baseline; decode budget
re-checked post-W1.1 (batched micro-interpreter reads amortize interpreter
cost). Target: default ≤2× source; regressions gate the wave.

## 6. Execution order, lanes & cadence

```
Gate 0 ──────────────► everything
Lane A (structural):  W1.1 ─► W2.2 ─► W2.3(+T1)
Lane B (crypto/keys): W1.2 ─► (feeds redteam share-reconstruction)
Lane C (assurance):   redteam stage FIRST per feature (v2.1 precedent),
                      then behavior; W3 continuous across lanes
Serial tail:          W1.3 after E4 annotations; W2.1 anytime post-G0;
                      W4 measurement rides every merge
```

Wave exit checklist (every wave): verify.sh green · redteam extended with
zero non-advisory wins · PERFORMANCE.md row updated · ARCHITECTURE/plan
progress noted · constraint-matrix pins re-run for newly emitted constructs.

## 7. Risk register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|-----------|
| R1 | Shipped phases 0–7 contain latent defects (never executed) | HIGH until Gate 0 | blocks all | Gate 0 first; fix-loop budgeted before any feature work |
| R2 | Stage-2 interpreter regresses decode perf | MED | perf class | batched reads; budget gate in W4; interpreter is load-once |
| R3 | Metamethod traps blow 5.1 depth budget | MED | crashes on lua51 | E4 restriction to prologue-only traps on lua51; advisory stage enforces |
| R4 | Keyless env-shares diverge between genuine hosts (false positives) | LOW | breaks legit runs | shares derive from VM-behavior probes proven version-stable (fmod/%.14g/binary64/rep identity), never from host specifics; matrix-tested ×profiles |
| R5 | W2.3 pointer rewrite breaks jump semantics | MED | wrong execution | block-graph unit proofs + corpus diff fuzz before any ship; feature flag |
| R6 | LLM-assisted re-rolling arms race (observed vs Luraph v14) | RISING | erodes lifting resistance | keep threaded keyed loop; polymorphic bodies; context-ops ambiguity; monitor technique cadence |
| R7 | Scope creep beyond obfuscation core | MED | stalls roadmap | out-of-scope list below is binding |
| R8 | Single-file delivery leaks *something* always | CERTAIN | philosophical | goal is cost-per-artifact > asset value; honest-limit docs updated per wave |

## 8. Definition of Done (roadmap)

- [ ] Gate 0 exit criteria met (§2)
- [ ] All W1/W2 acceptance blocks checked with evidence links (test names)
- [ ] Redteam ≥15 stages, zero non-advisory wins across full matrix
- [ ] PERFORMANCE.md shows default ≤2× with real numbers
- [ ] COMPATIBILITY.md matrix executed & dated (or runner-green)
- [ ] ARCHITECTURE.md threat model + limitation ledger current
- [ ] Every deferred-item flip accompanied by its differential suite

## Appendix A — Lua/Luau constraint matrix (binding on emitted code)

| Resource | Lua 5.1 | LuaJIT | Lua 5.3 | Lua 5.4 | Luau/Roblox | NEVAHEX exposure |
|---|---|---|---|---|---|---|
| Locals/function | **200** | 200 | 200 | 200 | **200** (255-bug fixed 2020) | file chunk + frames — E1 |
| Upvalues/closure | **60** | 60 | 255 | 255 | **200** | run() ~20–26 — E2 |
| Registers/function | 250 | 250 | 255 | 255 | 255 | N/A — stack-table VM |
| Constants/function | 2^18 | 2^18 | 2^26 | 2^26 | 2^23 | N/A — custom wire + maxConsts |
| Instructions/function | 2^17 | — | — | — | 2^23 | N/A — custom ISA |
| Nested functions | 2^18 | — | — | — | 2^15 | N/A — closures flatten to records; never nest |

Call-depth ledger:

| Runtime | Lua-call depth | C-call depth |
|---|---|---|
| Lua 5.1 | **~200 total** — `nCcalls` counts LUA calls (`ldo.c`) | shared |
| LuaJIT | effectively unbounded | large |
| Lua 5.4 | 1M stack slots; CCALLS=200 C-only | 200 |
| Luau | 20,000/thread | 200/thread |

Consequences: run() recursion = 5.1-parity with unprotected source
(document, don't fix) · ur() fallback ≤16 deep ✓ · W1.3 traps burn slots ⇒
depth-budgeted per profile · user deep-recursion errors identically pre/post
(parity invariant).

Behavioral pins (regression-locked): no `goto` ever (5.1/Luau lack it) · `%`
floor-mod universal, `fmod` truncates (probe relies on sign) · `%.14g`
display everywhere (probes valid) · JS shortest-repr + strtod = exact double
round-trip · unpack feature-detected · `_G or _ENV` handled · bit libs
optional with doubles fallback · Roblox: readonly libraries, protected string
metatable (traps degrade), partial collectgarbage (AE off), main-chunk
varargs legal · **NaN today broken** (`tonumber("(0/0)")`=nil) ⇒ E3.

Structural advantage: source transforms can NEVER hit Lua limits — source
compiles to our ISA; limits bind only the constant-sized emitted runtime.
Source-to-source obfuscators do not have this property.

## Appendix B — Attack/tool research digest (2026-08)

**LuraphDeobfuscator pipeline** (parse→helper-name detect→handler detect→
encryption extraction→decrypt→symbolic chunk population→redirection undo→
anti-decompiler removal→junk→luac→unluac) answered step-by-step: generated
identifiers defeat name detection · polymorphic bodies+decoys resist handler
matching · rolling-key opcodes defeat literal tests · no redirection tables
exist to undo · junk survives constant folding.

**Ferib devirtualization lessons** (decisive): dynamic breakpoint dumping
beats ANY static unpacking ⇒ decoded state must be self-defending (encrypted
operands/constants ✓, context-ops W2.1, next-pointers W2.3). Handler lifting
by register-usage pattern needs stable bodies ⇒ mutation pools. ISA≡target-ISA
is fatal (Luraph was 1:1 Lua 5.1) ⇒ our ISA deliberately diverges (stack
table, keyed records, split jumps, whitened operands — no .luac re-encode path).

**Luraph v14.x** moved to UNROLLED dispatch + LZW/Base36 strings; LLM-assisted
"re-rolling" now attacks unrolled forms. Stance: keep threaded keyed loop
(nothing stable to re-roll toward), adopt LZW (Gate 0).

**Prometheus toolkit** (MoonSecV2/V3): 60+ steps incl. anti-tamper-removal
phase; its "manual intervention required" list — custom crypto ✓(cipher v3),
runtime-packed payloads →(W1.1), environment checks →(probes+W1.2),
multi-stage encrypted resources →(share schedule).

**MoonSec V2/V3 field reality (corrected): both fall in ≈1 second.**
One-click web tools ("paste & deobfuscate") handle V3; multiple GitHub
dumpers (`MoonsecDeobfuscator`, GoonSec) emit Lua 5.1 bytecode straight into
unluac; constant-dumping is beginner tutorial content. Root causes of
instant breakage — codified as the NEVER-list for any emitted format:
  N1 instructions/constants rest UNENCRYPTED on the wire;
  N2 identical structural shape every build (sentinel locals, Chunk
     descriptors) — one regex/script fits all artifacts forever;
  N3 wire format static across versions — dumper written once;
  N4 constants readable with NO per-build key;
  N5 deterministic single-pass pipeline ⇒ trivially hosted as a website.
NEVAHEX audit vs the NEVER-list: N1 ✗ held (masked consts, rk-encoded ops,
split jumps) · N2 ✗ held (total layout randomization) · N3 ✗ held (per-build
keys/bands) · **N4 ⚠ partially exposed** — decoded records hold plaintext
operands, and universal builds ship recoverable registers ⇒ a scripted
sub-minute break exists today (our redteam S2–S5 chain IS that pipeline);
N5 ⚠ same. Consequence: W1.2 keyless shares + W1.1 stage-2 VM are the
corrective waves; until they land, "no public tool exists" is not a defense.
Redteam gains `automated-pipeline-sim`: chains S2→S3→S5 end-to-end with zero
manual steps and must FAIL (no full automatic break) on every matrix cell.

Anti-tamper ledger (shipped → bypass class → status): decoy ticks(stripped
statically/by design) · ciphertext guard(irrelevant to pure lifting; bites
redistribution) · silent poison(diffable → upgraded by T1) · CVW(strip needs
guard emulation → deepened T1/T2) · AE×3(clock-hook patching → extended T2) ·
env-keying(offline-fakeable in principle → hardened by W1.2 shares).
New: T1 checksum-folded NEXT pointers · T2 sethook tripwires (profile-gated) ·
T3 inner-program self-checksum · T4 GC canaries.

## 9. Honest limits

Env-keying stays offline-fakeable in principle; instrumentation remains
patchable in fully hostile hosts; single-file delivery always leaks
something. The objective is economic: raising per-artifact defeat cost above
asset value, with the cost curve rising every wave.

## 10. Out of scope (binding)

Commercial service infrastructure (API/UI/licensing) · non-Lua targets ·
watermark redesign beyond v2.1 re-keying · protecting against the artifact's
own legitimate purchaser running it.
