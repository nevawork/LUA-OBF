# NEVAHEX APEX — master plan (v3, supersedes all prior roadmaps)

Single source of truth. Predecessors: v2.1 hardening (`1787704699574`, phases
0–7 shipped) and v2.2 "Beyond Luraph" (`1787710226000`, constraint matrix +
research digest live there as Appendices A/B). Nothing in those files is
dropped; this document consolidates, prioritizes, and extends.

---

## Part I — Where we stand (truth ledger)

| Item | State |
|---|---|
| Phases 0–7 (hygiene, cipher v3, dispatch hardening, data-plane crypto, superops, anti-tamper, perf, redteam 7-stage) | SHIPPED, inspection-verified |
| Runtime verification | ⛒ BLOCKED — session denies bash; `verify.sh` has never run |
| Known live bug | NaN constants decode as nil (`tonumber("(0/0)")`) — fix = E3 |
| Known exposure | Universal builds ship recoverable cipher registers ⇒ scripted sub-minute break possible today (redteam S2 proves it) |
| Leaked credential | GitHub token was scrubbed from package.json; ROTATION still owed server-side |
| Deferred, designed | LZW, native ChaCha20, context-ops, mega-fusion, slot-renaming, const-index proxy, next-pointer shuffle |

Standing rule: no capability claim is true until Gate 0 executes green.

## Part II — Doctrine (the seven laws every change must obey)

Derived from how every public Lua protector actually died:

- **D1 — No stable shape.** One regex fitting two builds is a root cause of
  death (MoonSec law). Field keys, band values, bodies, tree shapes,
  identifiers: all per-build.
- **D2 — Decoded state defends itself.** Dynamic dumping beats static
  unpacking (Ferib law). Anything resting plaintext after decode is a
  liability: encrypt-on-wire AND decrypt-on-access, cache reluctantly.
- **D3 — Never map 1:1 to the target ISA.** Luraph v11 died because its ops
  were Lua 5.1 ops. Our stack-table machine, keyed records, split jumps,
  whitened operands exist so no `.luac` re-encoder can be written.
- **D4 — Integrity lives inside execution.** Checks an attacker can delete
  are decorations. Fold verification into pointers and key streams (T1/CVW),
  so removal corrupts behavior rather than silencing an alarm.
- **D5 — Keys never rest recoverable.** Arithmetic wrappers are obfuscation,
  not security. Shares or nothing (W1.2).
- **D6 — Static undecidability over dynamic hiding.** Prefer defenses whose
  effect is provable only by running (rolling keys, context-ops) over ones
  readable by inspection.
- **D7 — Budget everything.** 200 locals / 60–200 upvalues / ~200–20000 call
  depth / ≤2× runtime / artifact size. Correctness is security's
  prerequisite; every emitter change carries its budget assertion (E1/E2/E4).

## Part III — Roadmap

### Gate 0 — prove the base (prerequisite for all)
Shell access → `bash scripts/verify.sh` → fix findings → PERFORMANCE.md
baseline. Then, in order: **E3 NaN tags** (bugfix), **E1/E2 budget
governor**, **E5 compat matrix** (runners or dated COMPATIBILITY.md), **E6
precedence codification**, then flip deferred features behind differential
tests: LZW (10k-buffer codec fuzz), native ChaCha20 branch,
`--superops`/`--context-ops` defaults from measured overhead.
Exit: green suite · baselines filled · flips decided · token rotated.

### Wave A — structural superiority (parallel lanes A1/A2 after Gate 0)
- **A1 Stage-2 inner VM (+T3):** deserialization becomes bytecode (~15 ops)
  for an opaque micro-interpreter; program self-checksums into its own jump
  decoding; domain-separated keys inside CVW coupling. Kills the "read the
  decode loop once keys are recovered" path — the last Luraph-class edge.
- **A2 Keyless schedule:** K=6 XOR shares — three hidden in decoy structures,
  two VM-behavior-derived (version-stable probes only; risk R4 guarded), one
  constant-fold mask. Universal artifacts stop shipping registers; redteam
  S2 flips advisory→held everywhere. `--emit-secrets` carries all shares.
- **A3 Metamethod traps (depth-budgeted, Roblox-degraded):** plain-table-only
  binding, lua51 restricted to prologue one-shots (net depth ≤ +1), richer on
  luajit/luau; per-build trap-type/density rng.
Exit: e2e ×targets green · new redteam stages held · budgets asserted.

### Wave B — permanent lifting resistance
- **B1 Context-sensitive semantics (`--context-ops`):** pid-band bit
  reinterprets one operand field on selected ops → black-box semantics
  testing ambiguous (LuaHunt counter).
- **B2 Mega-superoperators:** lazy factories + operand baking, ≤40-instr
  n-grams, cap 240 ids, trailing-jump compensation.
- **B3 Next-pointer CFG + T1 checksum-folded pointers:** shuffled blocks;
  tamper/stripping corrupts control flow itself (strict halts, silent
  desyncs). Sequential dump-and-lift dies by construction.
- **B4 Diversity multipliers:** const-index proxying, slot-renaming mutation
  (op-class-aware undo maps).
Exit: corpus equivalence fuzz green · `semantics-probe`, `sequential-lift`
held · perf ratio improves or holds.

### Wave C — adversarial loop & product edge
- Redteam ≥15 stages incl. tool-mapped set (`lph-handler-pattern-scan`,
  `dynamic-dump-advisory`, `structural-shape-scan`, `stage2-escape`,
  `metamethod-trace`, `semantics-probe`, `sequential-lift`, `depth-budget`,
  `share-reconstruction`, de-whitening detector,
  **`automated-pipeline-sim`**) — zero non-advisory wins across the full
  `{tier}×{envProfile}×{--superops}×{--context-ops}` matrix.
- **T2 sethook tripwires** (lua51/luajit; Luau abstains) and **T4 GC
  canaries** feed derive-not-compare.
- Metrics gates in CI: lineJaccard <0.10 · entropy ≥7.95 · similarity <0.85.
- Technique-review cadence: new public tool ⇒ harness stage within a wave.
- **Profiles productization:** `--profile lite|balanced|paranoid|apex`
  bundling tiers/layers/costs — strength becomes selectable, not all-or-
  nothing (practical edge over Luraph's flat pricing of complexity).
- **Challenge program ("Challengeneva"):** publish bounty-protected sample
  artifacts per profile; forced-disclosure dynamic — adversaries reveal
  techniques to collect, feeding the harness. No competitor runs one.

### Wave D — performance & format lifecycle
- Native cipher default on bit-lib targets; universal step unrolled &
  measured; decode budget re-checked post-A1.
- **Format-generation rotation policy:** wire-format major bump every minor
  release ⇒ stale dumpers die with old formats (institutionalizes D1).
- Targets: default ≤2× source runtime; decode ≥ baseline budget; size within
  regression caps.

## Part IV — Execution graph

```
Gate 0 ─┬─ A1 stage-2 VM ────► B2 mega-fusion ─► B3 NEXT-CFG(+T1)
        ├─ A2 keyless shares ─────────────────────┐
        ├─ A3 metamethod traps (needs E4 notes)    │
        └─ B1 context-ops ──► B4 multipliers       │
              W3 redteam expansion rides EVERY node (stage-first rule)
              W4 measurement rides every merge
Wave C cadence starts the moment Gate 0 exits (profiles can land early)
```

Wave exit checklist (every wave): verify.sh green · redteam extended, zero
non-advisory wins · budgets asserted · PERFORMANCE.md row · docs updated.

## Part V — Risk register

| ID | Risk | L | Mitigation |
|----|------|---|-----------|
| R1 | Latent defects in unexecuted shipped code | HIGH until G0 | Gate 0 first; fix-loop before features |
| R2 | Inner-VM decode regression | MED | load-once amortization; W4 gate |
| R3 | Traps blow 5.1 depth | MED | prologue-only on lua51; advisory enforcer |
| R4 | Env-share false positives on legit hosts | LOW | VM-stable probe sources only; matrix-tested |
| R5 | Pointer rewrite breaks jumps | MED | graph proofs + corpus diff fuzz pre-ship; flag-gated |
| R6 | LLM re-rolling arms race | RISING | threaded keyed loop kept; polymorphism density targets; context ambiguity |
| R7 | Scope creep | MED | §Part VI binding |
| R8 | Single-file always leaks something | CERTAIN | economic objective; honest-limit docs per wave |
| R9 | Protector supply-chain trust (is NEVAHEX itself what it claims?) | MED | signed releases + reproducible builds item in Wave C |

## Part VI — Definition of Done (roadmap)

- [ ] Gate 0 exit criteria met with evidence (test names linked)
- [ ] Waves A–D acceptance blocks checked
- [ ] Redteam ≥15 stages · zero non-advisory wins · full matrix CI-enforced
- [ ] `automated-pipeline-sim` fails end-to-end on every profile (MoonSec rule)
- [ ] Default ≤2× overhead with real numbers; COMPATIBILITY.md executed/dated
- [ ] Profiles shipped; challenge program live with ≥3 bounty artifacts
- [ ] ARCHITECTURE.md doctrine + limitation ledger current; signed-release
      process documented

## Part VII — Honest limits

Env-keying offline-fakeable in principle; instrumentation patchable in fully
hostile hosts; single-file delivery leaks something, always; no obfuscator
survives its adversary's unlimited effort — the objective is economic
(per-artifact defeat cost > asset value) with a cost curve that rises every
wave and a process that learns faster than the attack community publishes.

## Part VIII — Out of scope (binding)

Commercial service infra (API/UI/licensing) · non-Lua targets · watermark
redesign beyond v2.1 re-keying · DRM against legitimate purchasers.

## Part IX — Immediate action queue (next session, in order)

1. Rotate the leaked GitHub token (server-side; independent of code).
2. Grant shell access → run `bash scripts/verify.sh`; triage findings.
3. Land E3 (NaN bugfix) → E1/E2 budgets → E5/E6.
4. Flip LZW + native ChaCha20 behind their differential suites.
5. Start Lane A1 (inner VM) — the single highest-leverage build item.

PROGRESS (2026-08-26, later session): shell still denied locally ⇒ **GitHub
Actions adopted as the execution shell** per user directive:
`.github/workflows/ci.yml` runs the full gate on every push and renders a
Gate-0 summary + artifacts (`scripts/gate0-report.cjs`). Landed since APEX
was written: E3 NaN/±Inf tags · E1/E2 budget governor
(`localbudget.ts`, fail-loud in emitter) · E5 COMPATIBILITY.md · E6
conventions · **W1.3 mm-traps** (`--mm-traps`, one-shot prologue form,
E4-budgeted, redteam `metamethod-trace`+`depth-budget` advisory stages) ·
**W1.2 keyless schedule** (`--keyless`: registers split into prologue-BE
uint32 pairs + 12-entry decoy pool at shuffled indices; modulus M31−1
end-to-end; redteam S2 flips to genuinely-held on keyless profiles;
MoonSec-rule `automated-pipeline-sim` requirement recorded in Definition §1.6
and Appendix B NEVER-list audit). Next: push to GitHub to execute Gate 0
remotely; then **A1 inner deserializer VM** (last Wave-A item).
