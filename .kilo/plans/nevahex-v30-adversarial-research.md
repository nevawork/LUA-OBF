# NEVA HEX v3.0 — Adversarial Research & Threat Model

> Research dossier grounding the v3.0 hardening campaign. This is the
> ATTACKER's perspective: what would an elite reverse engineer do to
> crack v2.1, what does the current deobfuscator ecosystem do to Luraph
> v14.8/v15 today, and what does the academic literature tell us about
> what works and what doesn't.

## 1. Deobfuscator attack surface today (2025-2026)

Sources:
- `mehCake/luraph-deobfuscator-py` (33 stars, active 2025-09) — Python
  pipeline for Luraph v14.4.x (initv4 family)
- `PhoenixZeng/LuraphDeobfuscator` (Java, mature) — handles v11.5 through
  current
- `JASE08/vmp-deobf` — supports MoonVeil v1.4.5 and Luraph v14.7
- `dreamsoundzzz/deobfus` — Python analysis of Luraph v14.x
- `Lethal-Luka/IronbrewDeobfuscator` (2024-02) — for IronBrew 2

What these tools DO against Luraph v14.x artifacts today:

| Stage | What it does | What it finds |
|---|---|---|
| Detect | Pattern-match `function(t,o)` style signatures, "this file was protected with Luraph" banner | Luraph version, initv4 vs pre-initv4, VM type |
| Bootstrap extraction | Run `initv4.lua` (the file that ships with the script) in Frida / LuaJIT instrumentation mode | The custom alphabet (85+ chars), the opcode ID → mnemonic map |
| Script key recovery | If a `script_key` is embedded in the artifact, search for it (the LuraphDeobfuscator walks long-string blocks to locate the key) | The XOR key for the high-entropy bytecode blob |
| Payload decode | XOR-decode the high-entropy blob with the key | The actual encrypted bytecode |
| VM constant pool decryption | Pattern-match the `string.char` masking sequence in the VM body to extract `(ck0, weight)` per proto | The masked constant table |
| VM structure detection | Recognize the SoA (Structure-of-Arrays) bytecode format: `e[]` for opcodes, `u[]`, `Y[]`, `L[]` for operands, `H[]` for constants | The opcode dispatcher and per-opcode handlers |
| Devirtualization | Pattern-match the binary decision tree `if not(d < N) then ... else ... end` in the dispatcher | 1:1 mapping from physical op → source-level Lua operation |
| Constant pool reconstruction | Symbolically execute the per-string decryption (the `kk = (ck0+pid*7919+...)%M` pattern) to recover plaintext | All string and number constants in the original source |
| Opcode lifting | Translate the recovered SoA bytecode to a shared IR | Pseudo-Lua or direct unluac-compatible bytecode |
| Anti-tamper bypass | Hook the integer comparison in `if bn > 4194304 then error(...)` (the file-size guard) to allow blob extension; patch the integrity hash check | The integrity check is patched out without alerting the runtime |

This is a 9-stage pipeline. Any ONE of these stages is the bottleneck.
The LuraphDeobfuscator author (TheGreatSageEqualToHeaven) explicitly says
the deobfuscator can be ported to "a vast array of things related to Lua" —
the structure is generic, not Luraph-specific.

## 2. Luraph v15 (released August 11, 2026) new features

From the Luraph v15 release announcement:

- **Two VM types**: `OPAL` (default, balance) and `ONYX` (security-first)
- **Hybrid-architecture compilation pipeline** (8 months of R&D)
- **Per-function attributes**: `LPH_ATTRIBUTES(VM(ONYX), PRESET(SECURE))` etc.
- **Non-virtualized improvements**: VM(NONE) with TRANSFORM(CONTROL_FLOW, EXTRACT)
- **`LPH_PRECHECK` macro**: lets the user ship their own anti-tamper check
  that gates the bytecode decryption key
- **`LPH_ENCNUM` with up to 8 per-key encryption**: numeric constants
  can be encrypted with up to 8 separate keys, each sourced from a
  function call
- **Optimized deserialization** (3x faster on large files)
- **Brand-new framework** for handling unsupported syntax in non-virtualized
  code (e.g. Luau's `goto`)

What this tells us:
- Luraph themselves moved from a single VM to multiple VM types
- They added a user-supplied precheck that gates key delivery (this is a
  significant shift — they recognize that embedded keys always leak)
- They made the encryption of numeric constants MORE complex, not less
- They optimized the load path (load is a bottleneck when artifacts are
  hundreds of KB)

## 3. NEVA HEX v2.1 failure mode (worst-case reverse engineer walkthrough)

Assume the artifact is `protect({ source: "game logic", tier: "off" })`.

1. The reverse engineer runs the artifact in a Lua interpreter with a
   debug hook. `debug.sethook(fn, "l")` is enough — they observe
   which Lua functions are called, and in what order.
2. They see the IIFE body (post-v3, ~3 lines) runs a single anonymous
   function. They read the function name from `_ENV` parameter (or
   the per-build function-table names if we keep the table shape).
3. They trace the function-table call graph. They see `decode` (cipher
   + protobuf parse) and `run` (VM core). Both are functions, both
   are callable from the global.
4. They call `decode` directly. The cipher + protobuf parse returns a
   handle. They inspect the handle. They see `protos` (SoA bytecode)
   and `wm` (watermark).
5. The `protos` field is a Lua table. They print the bytecode. They
   have the original wire-format program.
6. They call `run(handle, 1, _G, {}, {}, nil)`. The VM executes the
   bytecode. They observe the side effects.
7. With the side effects observable and the bytecode in hand, they
   write a custom Lua interpreter to lift the bytecode back to source.
   v2.1 has SoA bytecode that any of the deobfuscator tools above
   can lift in minutes.

The v2.1 design leaks the entire wire format to anyone who can call
`decode()` directly. There is no way to prevent this without:
- Encrypting the bytecode with a per-build key derived from a
  user-supplied secret (Luraph v15 LPH_PRECHECK approach)
- Or executing the bytecode in a way that requires a side-effect
  pre-check (impossible if the artifact is fully self-contained)

## 4. Concrete v2.1 weaknesses (revisited, with attack priority)

| # | Weakness | Attack | Time | Fix cost |
|---|---|---|---|---|
| W1 | 4-stream Lehmer cipher is **linear** | Recover full state from 32 consecutive keystream bytes via linear algebra | < 1 hour | 3-4 days (non-linear Feistel cipher) |
| W2 | Binary search tree dispatch (literal `if op<=N then`) | Reverse engineer reads the tree structure directly; pattern match in 5 minutes | < 5 min | 4-5 days (pre-bound dispatch table + randomized opcode set) |
| W3 | No self-hash of the dispatch table | Single byte patch bypasses all integrity checks silently | < 1 hour | 2-3 days (table hash + per-proto integrity proofs) |
| W4 | Constant mask is one per-proto stream `(ck0+pid*7919)` | Recovering one constant reveals the key for ALL constants in that proto | < 1 hour | 2-3 days (per-constant mask with per-const salt) |
| W5 | Opaque predicates are tautologies (`x²-x ≡ 0 (mod 2)`) | Z3/TrinitySolver folds every predicate in < 1 second | < 1 sec | 3-4 days (state-bound predicates + hash-based preimages) |
| W6 | Stack-based VM is data-flow friendly | Taint-trace operand dependencies; lift to a 3-address code in < 1 hour | < 1 hour | 5-7 days (register-based VM with random register file layout) |
| W7 | Wire format is SoA + protobuf + v2.1 framing | All existing Luraph deobfuscators lift this format trivially | < 5 min | 1-2 days (rewire to a totally different encoding: variable-length instruction, multi-byte opcodes, custom serializer) |
| W8 | Self-hash of the artifact is missing | Edit any instruction byte → run() returns a different result but doesn't detect | < 1 hour | 2-3 days (per-instruction hash with a Merkle tree over the bytecode) |
| W9 | Native function calls are unmediated (`pcall`, `print` go straight to _G) | Reverse engineer attaches to native functions and observes every call | < 1 hour | 3-4 days (wrap each native call with a per-proto, per-frame mediated proxy) |
| W10 | Environment keying is fingerprintable (single DJB2 over `_VERSION`) | Sandbox with a faked `_VERSION` defeats the keying | < 1 hour | 2-3 days (multi-signal entropy, anti-sandbox fingerprints) |
| W11 | No anti-debug beyond `os.clock` | Disable `os.clock` or hook it; everything else works | < 1 min | 2-3 days (multi-pronged anti-emulation: timer + memory + register + debug library) |
| W12 | No per-build state-aware integrity | Every artifact ships the same integrity logic; pattern-match the integrity body | < 30 min | 1-2 days (per-build integrity: hash of dispatch + hash of constants + hash of protos) |

The total fix cost is roughly 30-50 days of work to close all 12
weaknesses. We don't need to close all 12 to be competitive with v15
— the high-impact ones are W1 (cipher), W2 (dispatch), W3
(integrity), W5 (opaque), W6 (register VM), and W8 (per-instruction
hash). Those six collectively raise the deobfuscation effort from
"hours" to "weeks".

## 5. Academic research that informs v3.0

### 5.1 Anti-DSE opaque predicates (Cao et al., 2025)

`Advancing Code Obfuscation: Novel Opaque Predicate Techniques to Counter
Dynamic Symbolic Execution` (CMC 2025) introduces:

- **Single-way function opaque predicates**: predicates based on hash
  functions and logarithmic transformations that are easy to compute
  forward but infeasible to invert. A constraint solver cannot find
  inputs that violate the predicate without breaking SHA-256.
- **Path-explosion opaque predicates**: predicates that fan out to an
  exponential number of branches, overwhelming symbolic execution
  engines. Implemented via recursive Fibonacci and Collatz sequences.

Result: their predicates forced KLEE and Angr to time out on multiple
benchmarks where traditional predicates were folded in seconds.

Application to NEVA HEX: replace the `(((x²-x)%2)==0)` tautologies
with `((hash(disp_count || pc || last_op) >> 64) % 2 == 0)` style
predicates. The attacker must replay the actual execution history
to satisfy them, which is a brute-force 2^64 search. The dispatch
chain becomes unsatisfiable for symbolic execution.

### 5.2 MBA-Blast (Liu et al., 2021) and GAMBA (Reichenwallner, 2023)

`MBA-Blast: Unveiling and Simplifying Mixed Boolean-Arithmetic
Obfuscation` (USENIX 2021) shows that MBA expressions can be reduced
back to source via program synthesis. `GAMBA` (EuroS&P 2023) extends
this to general MBA. Both tools recover the original expression from
MBA in seconds.

Implication: our current MBA identities (32-bit `x+y ≡ (x^y) + 2*(x&y)`)
are FOLDABLE by these tools. We need MBA identities that are
intentionally HARD — e.g. identities that require knowing a per-build
secret to invert. This is doable: a standard identity `f(x) = x*4/4`
becomes a per-build identity `f(x) = (x + k) - k` where `k` is a
per-build random constant. MBA-Blast needs the source expression; with
`k` baked into the program, the lifted expression still has `k` in it
(an unknown to the analyst) and they can't fold it to `x`.

### 5.3 COVER (2024)

`COVER: Enhancing Virtualization Obfuscation Through Dynamic Bytecode
Scheduling` (Computers & Security 2024) introduces:
- **Non-deterministic mapping rules**: which VM handler executes
  each opcode is randomized per-dispatch (not per-build). So even
  tracing the same program twice produces different execution paths.
- **Jump address protection via FCSM** (Flash Controller-based Secure
  Module): the jump table is encrypted with a key in a hardware
  module; the attacker has to break the hardware to get the key.
- **Code-based dynamic key**: the bytecode is encrypted with a key
  that is computed at runtime from the running program state.

The COVER approach is overkill for Lua obfuscation (we don't have
hardware), but the **non-deterministic mapping** is a Lua-applicable
trick. Each dispatch could permute the handler table every Nth call.
Tracing the same program twice produces different control flow.

### 5.4 VMDragonSlayer / Syntia / QE

VMDragonSlayer (active 2025) is the state-of-the-art VM deobfuscation
framework. It combines:
- Dynamic Taint Tracking
- Symbolic Execution
- Pattern Classification
- Machine Learning

For NEVA HEX, the key insight is that all of these tools look for
**structure** — they assume the dispatch is one of: a switch, a
binary decision tree, an indirect jump table, or a hash table. If
our dispatch is none of these — e.g. it is a chain of
content-addressable lookups (`if (dispatch == pc+lrk) then ...`) — the
tools fail to find the structure and fall back to brute-force
simulation.

### 5.5 Pushan (trace-free deobfuscation, 2026)

`Pushan: Trace-Free Deobfuscation of Virtualization-Obfuscated Binaries`
(arXiv 2603.18355, March 2026) — first trace-free deobfuscator.
Achieves 92-100% CFG isomorphism on VMProtect/Themida samples.

Pushan's approach: it doesn't execute the VM, it statically inverts it
by reading the VM's own internal state-transition rules. So even
without running the program, Pushan can recover the original logic.

Implication for NEVA HEX: we cannot rely on the VM being too slow to
simulate. Pushan can simulate the VM statically in seconds. Our
defense must be: **the VM is hard to INVERT, not hard to SIMULATE**.
That means non-linear operations, dynamic opcode remapping, and
state-bound dispatch — all things that Pushan would have to do
sophisticated analysis to invert.

## 6. Luraph v15 attribution analysis

Based on the v15 release notes, the v15 changes we should adopt:

- **Per-function VM selection**: allow the user (via a `vmType`
  option) to choose between a "default" (fast, like v2.1) and
  "secure" (slow, like ONYX). The default is fast; the secure
  variant enables all the v3.0 features.
- **`LPH_PRECHECK` analog**: a `precheck` option that lets the user
  ship their own pre-decode function. The bytecode decryption key is
  derived from the precheck's return value, so a tampered
  precheck produces garbage bytecode.
- **Per-key encryption of constants**: NEVA HEX v2.1 has one
  `ck0` constant-pool mask. v3.0 should support per-constant keys
  sourced from function calls (matching v15's `LPH_ENCNUM` with
  `key_1() = ...` syntax).
- **Optimized deserialization**: the L1 decode is currently a single
  for-loop with 4-stream cipher + u8/uvar/svar + protobuf + watermark
  tail. v3.0 should fuse the L1 helpers into the decode body
  directly (no separate `u8()`/`uvar()` function calls) to save
  per-instruction overhead.

## 7. Summary of attack-defend map

| Attack (current deobfuscator can do) | v2.1 resistance | v3.0 resistance |
|---|---|---|
| Pattern-match the binary decision tree | NONE — 5 min | HIGH — handler table is pre-bound and the chain is depth-1 |
| Recover the cipher state from 32 keystream bytes | NONE — 1 hour | HIGH — non-linear Feistel with 3+ rounds |
| Linear-algebra-fingerprint per-proto constant pool | NONE — 1 hour | MEDIUM — per-const salt makes per-const keys unique |
| Z3-fold MBA identities | LOW — 1 sec | MEDIUM — per-build secret in the identity prevents folding |
| Z3-fold opaque predicates | NONE — 1 sec | HIGH — hash-based preimage (2^64 brute force) |
| Direct `decode()` call to extract the wire-format program | NONE — trivial | MEDIUM — the precheck gates the key |
| Hook native functions (`pcall`, `print`) | NONE — 1 hour | MEDIUM — native calls go through a per-proto proxy |
| Patch a single byte to bypass integrity | NONE — 1 hour | HIGH — per-instruction Merkle hash aborts on patch |
| Pattern-match the wire format (SoA protobuf) | NONE — 5 min | HIGH — variable-length, custom-encoded wire format |

The v3.0 design raises the average deobfuscation time from "hours"
to "weeks" and requires attacker tools to be extended with new
VM-format plugins. The deobfuscator ecosystem that handles Luraph
v14.x today would not handle NEVA HEX v3.0 without significant
re-tooling.
