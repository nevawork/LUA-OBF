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

### A1 implementation notes (frozen design — implement next session, one atomic write)

ISA is FROZEN in `engine/vm/microvm.ts` (30 ops, STRS pool, ExecOptions).
Remaining build items, in order, as ONE atomic change gated by
tests/phase10.test.ts (differential fuzz ×300 vs deserializeBlob + shuffle-
invariance + maskProgram round-trip):

1. Asm class: emit(op,a,b,c) · mark/emitJ with per-slot fixups
   (JMP→word a; JEQZ/JNEZ→word b; JLT→word c) · resolve().
2. maskProgram/unmaskProgram: additive Lehmer stream mod 251 per word,
   seed=0 ⇒ plaintext.
3. Register map (frozen): hdr1 np2 pid3 one4 zero5 cnt6 nu7 ns8 nc9 nk10
   i11 lim12 tag13 ln14 bb15 tmp16 tmp17 val18 carr19 skel20 rec21 sstr22
   lrk23 mmv24 oe25 aw26 b1 27 b2 28 cw29 sum30 kOP31..kC35 wa36 wb37
   wc38 wd39 pv2 40 wl41 rk0r42 astR43.
4. emitLongConst(a,reg,v,tmp): LDI lo; LDI tmp,mid; MUL tmp,256·mid;
   ADD; LDI tmp,hi; MUL tmp,256·hi? — careful: hi lane needs ×65536 via two
   MULs or an extra const reg; verify exactness (<2^53) in test.
5. Program outline (labels): framing(skipTest/skipEnd) → np guard(npErr/npOk)
   → protoTop guard(JLT np,pid→protoEnd) → PROTO_NEW → params/isVararg
   (boolFlag pattern: EQI val,byte,1 / else-val=0) → uv loop(uvTest..uvEnd)
   → numSlots → consts guard(ncErr/ncOk) → cTest loop with tag dispatch:
     per tag [1,2,7,8,9,5,6]: LDI tmp,tag; EQI eq,tmp,tagVal; JNEZ eq,lbl
     branches kTrue/kFalse (EQI true:=EQI zeroReg,0; false:=EQI oneReg,0)/
     kNaN/kInf/kNeg (NONFINITE)/kNum(RDUV,PAYLOAD,STRFROM,FLOAT)/
     kStr(…STRFROM push)/kNil(LDNIL); each pushes via GETF consts+PUSH;
     shared cNext increment+JMP cTest.
   → code guard(nkErr/nkOk) → lrk init(LDIW RK0; MUL pid·ASTEP; MOD 65536)
   → kLoop(kLoopTest/kLoopEnd): mm=FLOORDIV(lrk,3),MOD 256; RDUV oe;
     RDSV aw−mm; b1−mm; b2+mm; cw−mm; SUM=b1+b2; step lrk+=AINC%65536;
     NEWT rec + SETF 1..4=[oe,aw,SUM,cw]; GETF code; PUSH; kLoopInc.
   → COMMIT_PROTO pid; pid+=1; JMP protoTop; protoEnd.
   → watermark: RDUV wl; long-const wa/wb from wmSeeds (normalized);
     wc=(wa*31+wb)%M; wd=(wb*17+wa)%M; pv2=0; wmTest loop: RDU8 v;
     v=(v−pv2+256)%256; WMPUSH; i+=1; JMP wmTest; wmEnd → HALT.
6. Equality contract with deserializeBlob (test comparator): deep-equal on
   flat[] (params,isVararg:boolean,upvals[{instack,idx}],numSlots,consts
   with Number.isNaN for NaN, masked tag5/6 payloads identical garbage,
   code tuples [opE,a,b1+b2,c]) + wm array.
7. Lua emission (session after core green): interpreter closure mirrors
   exec switch verbatim; program stored maskProgram(seed)-masked; seed +
   budgets embedded obfuscated; --stage2 flag replaces old decode text.

### A1 implementation notes end

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
