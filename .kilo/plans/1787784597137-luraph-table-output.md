# Plan: NEVA HEX v2.1 → Luraph-style compact IIFE emitter

## Goal

Replace the current emitter shape (comment + 14 top-level `local` decls + L1
`do … end` decode block + `local function run` + final `do … HufYjZ(…) end`
invocation, ~890 lines) with a single anonymous-function IIFE that fits in
~3 physical lines. The whole protected script evaluates to one expression
of the shape:

```lua
-- NEVAHEX v3 "Hex" — protected artifact — t = loadstring(s)(); t() runs it

return (function(_ENV)
  -- file-scope constants, helpers, cipher, decoder, VM, dispatcher,
  -- integrity ticks, watermark, and the final `t()` invocation —
  -- ALL on the same line (or split across the IIFE body as needed for
  -- Lua's 200-line / line-length limits, which we will not actually
  -- hit because the body is a single statement chain).
end)({})
```

Caller consumes it as `loadstring(s)()` — no second call needed; the
return value of the IIFE is whatever the protected program returns.

## Concrete output targets

| Property | v2.1 (today) | v3 target |
| --- | --- | --- |
| Physical lines | 890 | ~3 (1 banner, 1 blank, 1 body) |
| Top-level `local` decls | ~14 | 0 |
| Top-level `do` blocks | 2 | 0 |
| Top-level `local function` | 4 | 0 |
| Identifier style | random 6-8 char (IdAllocator) | same — keep IdAllocator; visual style matches the v14 reference's short-token feel |
| Outermost expression | `do … HufYjZ(…) end` (stmt) | `return (function(_ENV) … end)({})` (expr) |
| Comments | 5+ section markers | 1 banner on line 1 |
| Cipher | unchanged | unchanged (same `engine/crypto/cipher.ts`) |
| Dispatcher | unchanged | unchanged (same `engine/runtime/dispatcher.ts`) |
| Op/perm encoding | unchanged | unchanged |
| On-wire protobuf | unchanged | unchanged |
| Public JS API | `protect({...})` returning `{lua, manifest, ...}` | **unchanged** — only `result.lua` shape differs |

## Non-goals (out of scope)

- Replacing the 4-stream Lehmer cipher with a non-linear one. (tracked
  separately; this plan only changes the outer shape.)
- A register-based VM. (tracked separately.)
- Single-line collapse. The body will be one logical expression but
  it is allowed to span physical lines if the Lua parser needs them.
  Three lines is the target because the v14 reference is three lines,
  but the implementation must not break if the body grows past Lua's
  per-line length cap.
- The earlier `return({...})` table approach. The user pivoted; the
  table plan in this same file is replaced by this plan.
- Fixing the residual runtime bugs (the e2e tests still fail at line
  758 in some tiers). Those are out of scope here; this plan only
  changes the outer emitter shape.
- New obfuscation primitives (stringed identifiers, etc.) — the file is
  already long; we only restructure.

## What currently exists (relevant to the change)

`src/vm/emitter.ts` builds a `string[] L` of ~890 lines per artifact
containing:

- `L[0]` = comment header
- `L[1..14]` = file-scope `local` and `local function` declarations
  (`N.ctn`, `N.pk`, `N.uup`, `N.ur`, `N.envroot`, `keyNames.*`,
  `rk0N/astepN/aincN`, `ck0N`, `cvwN`, `N.sch`, `N.tcn`, `N.cv`)
- `L[15..]` = L1 `do … end` block (cipher guard, env keying, 4-stream
  cipher loop, u8/uvar/svar, framing, per-proto loop, watermark tail)
- `L[…]` = L2 `local function HufYjZ(…)` (per-frame state init,
  decode + dispatch + execute loop)
- `L[end-3..end]` = final `do … end` invocation: pack `...` into args
  and call `HufYjZ(rootPid, envroot, {}, args, nil)`

The dispatcher (`src/engine/runtime/dispatcher.ts`) and cipher
(`src/engine/crypto/cipher.ts`) are unmodified. The dispatcher builds
the chain by interpolating the F-table values into body strings; the
emitter substitutes those values into the final artifact.

The `local`/helper functions declared at file-scope today (`pk`, `ur`,
`cv`, `u8`, `uvar`, `svar`, `sch`, `tcn`, `ctn`) need to be reachable
from inside the new IIFE body. The cleanest approach: declare them as
locals at the very top of the IIFE body, with values that are either
inline literals (`pk = function(...) ... end`) or randomized constants
(`uup = unpack or (table and table.unpack)`). All cipher literals and
obf-form constants stay inline as `(x*4/4)` / `((x+256)-256)` / `(x+j-j)`
expressions.

## New outer shape (the only change)

The new emitter produces:

```lua
-- NEVAHEX v3 "Hex" — protected artifact — t = loadstring(s)(); t() runs it

return (function(_ENV)
  -- BEGIN: file-scope locals (no `local` keyword at the chunk level;
  -- everything is inside the function body)
  local _pk = function(...) local n=select('#',...) return {n=n,...} end
  local _ur = function(t,i,j) if i>j then return end
    if _uup and j-i>15 then return _uup(t,i,j) end
    return t[i],_ur(t,i+1,j) end
  local _uup = _ENV.unpack or (table and table.unpack)
  local _sch = _ENV.string.char
  local _tcn = _ENV.table.concat
  local _ctn = setmetatable({},{__mode="k"})
  -- ... cipher seeds (obf literals) ...
  local _rk0 = (…); local _ast = (…); local _ainc = (…)
  local _ck0 = (…); local _cvwW = (…); local _cvw = 0
  -- field-key constants (record-key names used inside pr.k[i] = {[OP]=…, …})
  local _kOP = (…); local _kA = (…); local _kB1 = (…); local _kB2 = (…); local _kC = (…)
  -- runtime helpers (function expressions)
  local _cv = function(pID,e) … end
  local _u8 = function() … end
  local _uvar = function() … end
  local _svar = function() … end

  -- the encrypted blob (one giant string literal)
  local _blob = "…"

  -- BEGIN: L1 decode — runs the cipher + protobuf parse, returns the
  -- {P, WM, WMI} handle
  local function _decode()
    local _D = {}; local _bn = #_blob
    -- cipher guard → env keying → entropy pool → 4-stream cipher → u8/uvar/svar
    -- → framing → per-proto loop → watermark tail
    return {P=…, WM=…, WMI=…}
  end

  -- BEGIN: L2 run — the VM core
  local function _run(l1, pid, env, upv, args, escf)
    -- alias block: _K = l1.P[pid].k, _C = l1.P[pid].c, etc.
    local _P0, _K, _C, _S, _cells = l1.P[pid], l1.P[pid].k, l1.P[pid].c, {}, {}
    local _sp, _mr, _pc, _VA = 0, -1, 1, args
    local _tc, _six = 37, 1
    local _poi, _PB, _wmv = false, nil, 0
    local _rkN = (_rk0 + pid*_ast) % 65536
    while true do
      -- integrity tick (countdown → tick block)
      _ins = _K[_pc]
      _op = (((_ins[_kOP] - _rkN) + 65536) % 65536)
      _rkN = (_rkN + _ainc) % 65536
      _pc = _pc + 1
      -- <dispatch chain: deeply nested if op<=X then … else … end>
    end
  end

  -- BEGIN: bootstrap — call decode, then run, return its result.
  -- Matches the user's "t = loadstring(s)(); t() runs it" pattern.
  local _handle = _decode()
  local _args = _pk(...)
  return _run(_handle, 1, _ENV, {}, _args, nil)
end)({})
```

Three physical lines:
- line 1: the banner comment (≤ 80 chars)
- line 2: blank
- line 3: the entire `return (function(_ENV) … end)({})` expression

## Design decisions

### D1. The function is named `_ENV` for visual obfuscation only

The IIFE's first parameter is `_ENV` (not the conventional `e` or `t`).
Inside the function, `_ENV.unpack`, `_ENV.string.char`, etc. pull global
lookups through the parameter rather than the global table directly.
This:

- avoids the bareword `unpack` / `string.char` syntax that an
  obfuscator's data-flow tracer flags as "obvious"
- breaks the "this Lua file uses string.char at column N" static
  fingerprint a reverse engineer would key on
- costs 1 extra table-lookup per global access, which is negligible

The parameter is bound to the global table when the IIFE is called:
`return (function(_ENV) … end)({})` — passing `{}` here is a Luraph
trick: it makes the function's `_ENV` parameter be an empty table, so
any unqualified global reference (e.g., `_ENV.string.char`) goes through
the parameter first and only falls back to the real `_G` if the field
is missing. The empty-table bootstrap matches the v14 reference
pattern: the file's last chars are `})` — closing the table literal —
followed by nothing else. We add the `({})` bootstrap arg so the
function runs.

Wait — re-read the v14 reference first 200 chars:

```
return({hN=function(t,o)o[38]=(t.r.band);…end, pz=…end, fz=…end, …, _=function(self, _)…end})
```

The v14 reference uses `t` as the first parameter (not `_ENV`). It's
a TABLE, not an IIFE. So the `_ENV`-binding trick is specific to our
IIFE. We'll use the parameter name `_ENV` for the IIFE, and the
function-entry-point inside it can use whatever short name the
dispatcher wants for its per-frame table (e.g. `self` or `t`).

### D2. `return (function(_ENV) … end)({})` — single expression

The closing `({})` is an empty table passed as the `_ENV` parameter.
The function body runs once on load. Its return value is the protected
program's return value. Caller does `loadstring(s)()` to get the
program's result.

### D3. All file-scope constants and helpers are inside the function

The current emitter emits ~14 `local` / `local function` declarations
at the top of the artifact. After this change, every one of them lives
inside the IIFE body as a `local`. The names stay random
(IdAllocator); the visual density changes because there's no top-level
whitespace separating them from the body.

### D4. The cipher, the dispatcher, the protobuf, and the F-table
identifiers all stay the same

We do NOT change:

- `src/engine/crypto/cipher.ts`
- `src/engine/vm/serializer.ts`
- `src/engine/vm/compiler.ts`
- `src/engine/vm/opcodes.ts`
- `src/engine/runtime/dispatcher.ts`
- `src/engine/runtime/integrity.ts`
- `src/engine/runtime/cipherguard.ts`
- `src/protection/antitamper.ts`
- `src/protection/envkeying.ts`
- `src/protection/entropypool.ts`
- `src/transforms/strings.ts` / `flatten.ts` / `opaque.ts` / `mba.ts`

We only change `src/vm/emitter.ts` (and its `checkBudgets` slice).

### D5. The dispatch chain's `op` variable stays as the literal name "op"

In the previous session, `F.op` was pinned to `"op"` so the range
router `if op<=N then` matched the leaf tests `if op==N then`. We keep
that pin. The chain still references `op` (the frame-local decoded
opcode). The dispatch chain is generated as today.

### D6. The `entry` function disappears; the IIFE is the entry

Today the artifact has a final `do … HufYjZ(…) end` invocation. In
the new shape, the IIFE body's last statement IS the invocation. No
separate `entry` function on the table.

### D7. The `decode` and `run` functions stay (they're locals now)

The L1 decode logic and L2 run logic are reused as locals at the top
of the IIFE body. They still receive the same arguments they did
before. The boot block at the end of the IIFE calls them.

### D8. Body density is preserved by removing inter-line whitespace

Today, the emitter pushes one statement per line, which is the readable
debugging form. For the new IIFE, the body is a single Lua statement
chain (each local-decl ends with `;`, each function body uses compact
`function()…end`, etc.). The body MUST still be valid Lua source.

Concern: the cipher's obf-literal expressions like `(x*4/4)` already
push statement density high. After removing the file-scope header
cruft, the body should fit comfortably on one line. If the line grows
beyond Lua's parser line-length cap (Lua 5.4 has none, Luau has
1MB), we can split on `;`.

### D9. The JS-side `protect()` is unchanged

`protect({...})` still returns `{ lua, manifest, dispatchOrder, ... }`.
The only difference is `result.lua` is now ~3 lines instead of ~890.

## Implementation steps (ordered)

1. **Audit every `L.push(...)` site in `emitRuntime`**. There are ~300
   of them. Classify each as:
   - **file-scope decl** (goes inside the IIFE as `local X = ...`)
   - **L1 body line** (goes inside `_decode = function() … end`)
   - **L2 body line** (goes inside `_run = function(...) … end`)
   - **bootstrap line** (goes at the end of the IIFE: pack args, call
     `_run(_decode(), 1, _ENV, {}, args, nil)`)
2. **Rewrite `emitRuntime`** to build four `string[]` lists instead of
   one: `headerLines`, `decodeLines`, `runLines`, `bootstrapLines`.
   Each list contains the lines that go inside that section of the
   IIFE.
3. **Re-bind all name pools**. The `N` table (file-scope names) is no
   longer emitted as `local` at file scope. Instead, every name becomes
   a `local` inside the IIFE body. The dispatcher still receives the
   F-table with the same `F.x` keys; the chain lines still bake those
   into the body.
4. **Wrap into a single expression**:
   - The header is a single `--` comment (no `local` declarations
     after it).
   - The IIFE body is the concatenation of all four sections, joined
     by `\n ` (newline + one space of indent) so the body is readable
     as code but still has a single statement.
5. **Wire the bootstrap** to call `_decode()` then `_run(...)`. The
   return value of the IIFE is the program's return value.
6. **Update `checkBudgets`** to count locals + upvalues within the
   `_run` function body slice (the heaviest function in the artifact).
7. **Smoke test**: a TS script that protects `"return 1+1"`, runs
   the result via wasmoon, calls `loadstring(s)()`, asserts return
   value is 2.
8. **Visual diff**: dump a sample artifact. Verify line 1 is the
   banner, line 3 is `return (function(_ENV) … end)({})` and contains
   the cipher, decoder, VM core, and bootstrap.
9. **Run `npx vitest run tests/cipher-v3.test.ts`** — must still pass
   (cipher is unchanged).

## Affected files

- `src/vm/emitter.ts` — primary change. The `emitRuntime` function is
  restructured.
- `src/pipeline.ts` — no expected change. The dispatch self-check
  already runs against the emitted chain; the chain shape is unchanged.
- `src/testing/dispatch-check.ts` — no expected change.
- `src/engine/runtime/dispatcher.ts` — no change. Dispatcher still
  emits `${F.x}` placeholders; the emitter substitutes them.
- `scripts/e2e.cjs`, `tests/*` — no expected change (they consume
  `result.lua`).
- `plans/1787784597137-luraph-table-output.md` — replaced by this
  plan (the table approach is superseded).

## Risks and mitigations

- **R1. The single line is too long for Luau.** Luau has a 1MB line
  length cap, but the emitter produces ~700KB per artifact today. If
  the IIFE body is a single physical line, the result line would be
  ~700KB. That's well under 1MB. The v14 reference is 757KB on one
  line, so this is fine.
- **R2. The boot block needs `...` and `_ENV`.** The IIFE receives
  `_ENV` as its first param. When the file is loaded, the program
  must pass `...` to the inner function. Today, the legacy shape
  does `local A = pk(...)` at the very end. The new shape does
  `local _args = _pk(...)` inside the IIFE body, then passes
  `_args` to `_run`.
- **R3. `_ENV.unpack` vs `unpack`.** Luau doesn't have `unpack` —
  it has `table.unpack`. The legacy emitter handles this with
  `unpack or (table and table.unpack)`. We keep the same logic.
- **R4. The dispatcher body's `op` reference is global-looking but
  must be local.** The dispatcher already pins `F.op = "op"`. We
  keep that. The IIFE body declares `local op` (or `local _op`)
  and the chain references it as `op` (or `_op`).
- **R5. `checkBudgets` works on text.** It counts `local` decls in
  a slice. The new shape has all `local`s inside the IIFE body. The
  budget check should look at the `_run` body slice, which contains
  every `local` that the dispatcher or emitter references.

## Validation plan

1. `npx tsc --noEmit` passes.
2. A 5-line tsx that protects `"return 1+1"`, runs the result via
   wasmoon, calls `loadstring(s)()`, asserts return value is 2.
3. `npx vitest run tests/cipher-v3.test.ts` — must still pass.
4. Visual diff: dump a sample artifact. Verify:
   - line 1 = the banner comment
   - line 2 = blank
   - line 3 = `return (function(_ENV) … end)({})` (one line)
   - the body contains: a `local _pk`, a `local _ur`, a `local _uup`,
     a `local _sch`, a `local _tcn`, a `local _ctn`, a `local _cv`,
     a `local _u8`, a `local _uvar`, a `local _svar`, a `local _blob`,
     a `local function _decode() … end`, a `local function _run(…)
     … end`, and a final `return _run(_decode(), 1, _ENV, {},
     _args, nil)`.
5. Length sanity: the new artifact for `return 1+1` should be
   ~35-50 KB (vs 33 KB today — the new wrapping adds a few hundred
   bytes; the per-`local` declarations add ~2 KB).

## Open questions (none material)

The user's three clarifications (IIFE shape, `({})` bootstrap, random
5-8 char token names, one banner comment) cover all ambiguous design
points. The remaining decisions (D1-D9) are mechanical.

## Out of scope for this plan

- Fixing the residual runtime bugs in the previous artifact.
- The new v3 architecture (register-based VM, non-linear cipher, etc.).
  That is tracked separately in `nevahex-apex-master-plan.md`.
- Single-line collapse of the IIFE body if the cipher gets longer
  (we expect ~3 lines from the v2.1 cipher, but a heavier cipher
  could push to 4-5 lines; that is acceptable).
- The earlier `return({...})` table approach (superseded by this
  plan, which the user explicitly pivoted to).

## Concrete sample (what the output will look like)

The artifact for `return 1+1` will be **3 physical lines** total:

- **line 1** — banner: `-- NEVAHEX v3 'Hex' — protected artifact — loadstring(s)() runs it`
- **line 2** — blank
- **line 3** — `return (function(_ENV) … end)({})` (the entire protected
  runtime in one expression)

Names shown below are illustrative; the real names are per-build random
tokens (IdAllocator, 5-8 chars). Indent inside the IIFE is one space,
matching the v14 reference's compact style.

The IIFE body is one Lua statement chain (every `local` and every helper
is separated by `;` or newline-with-one-space; the dispatch chain
is a tree of `if op<=N then … else … end` blocks). The whole
protected runtime — file-scope constants, helpers, L1 decode, L2
VM core, integrity ticks, watermark, and bootstrap — is inside the
single function body. There are **zero** top-level `local` decls and
**zero** top-level `do … end` blocks.

```lua
-- NEVAHEX v3 'Hex' — protected artifact — loadstring(s)() runs it

return (function(_ENV)
 local _pk = function(...) local _n = select('#',...) return {n=_n,...} end
 local _ur = function(_t,_i,_j) if _i>_j then return end if _ENV.unpack and _j-_i>15 then return _ENV.unpack(_t,_i,_j) end return _t[_i],_ur(_t,_i+1,_j) end
 local _uup = _ENV.unpack or (table and table.unpack)
 local _sch, _tcn, _ctn = _ENV.string.char, _ENV.table.concat, setmetatable({},{__mode="k"})
 local _MM = 2147483647
 local _rk0 = (714045+39-39); local _ast = ((271559+256)-256); local _ainc = (851947*4/4)
 local _kOP = (54688-0); local _kA = ((898451*4/4)+0); local _kB1 = ((62659+256)-256); local _kB2 = ((1651607+256)-256); local _kC = ((75361*4/4))
 local _ck0 = ((969779822+256)-256); local _cvw, _cvwW = 0, ((30971737+256)-256)
 local _cv = function(_pID,_e) if type(_e)~='table' then return _e end local _v=_e.v if _v~=nil then return _v end local _kk=(_ck0+_pID*7919+_cvw*_cvwW)%2147483646 if _kk<1 then _kk=_kk+2147483646 end local _p={} local _g=_kk for _j=1,_e.n do _g=(_g*48271)%2147483647 _p[_j]=_sch((_e.b[_j]-(_g%256)+256)%256) end local _s=_tcn(_p) if _e.t==5 then _v=tonumber(_s) else _v=_s end _e.v=_v return _v end
 local _u8 = function() local _bt=_D[_pos] _pos=_pos+1 return _bt end
 local _uvar = function() local _sh,_r=0,0 while true do local _bt=_u8() _r=_r+(_bt%128)*(2^_sh) if _bt<128 then return _r end _sh=_sh+7 end end
 local _svar = function() local _u=_uvar() if _u%2==1 then return -(_u+1)/2 end return _u/2 end
 local _blob = "\196\240\233G\238\013\244PU\036{…~2KB of \NNN decimal-escaped bytes, the encrypted protobuf+watermark stream…}"
 local function _decode()
  local _D, _bn = {}, #_blob
  if _bn > 4194304 then error("…") end
  local _sa, _sb = (545920216*4/4), (17635956-0)
  -- (optional ciphertext-integrity guard: a `do local BS={{p=…,a=…,h=…},…} for _bs=1,#BS do local hh=(seedFNV%1000000007) for j=… do hh=… end if hh~=BS[_bs].h then _sa=(_sa+(…))%MM _sb=(_sb+(…))%MM _cvw=1 end end end)
  -- (optional env keying + entropy pool: `_sa=(_sa+__acc)%MM`, `_sb=(_sb+__acc*3)%MM`)
  local _sbyte = _ENV.string.byte
  local _sc, _sd, _pv = (_sa*31+_sb)%_MM, (_sb*17+_sa)%_MM, 0
  for _i=1,_bn do
   _sa=(_sa*48271)%_MM; _sb=(_sb*69621)%_MM; _sc=(_sc*2994349)%_MM; _sd=(_sd*4050403)%_MM
   _sb=(_sb+_pv)%_MM; _sc=(_sc+_sa)%_MM
   _pv=(math.floor(_sa/65536)*31 + math.floor(_sb/2048)*17 + math.floor(_sc/1024)*7 + math.floor(_sd/256)*3 + _pv) % 256
   _D[_i] = (_sbyte(_blob,_i) - _pv + 256) % 256
  end
  _pos = 1
  local _hdr = _u8()
  if _hdr < 128 then error("…") end
  for _i=1,_hdr-128 do _u8() end
  local _np = _uvar()
  if _np > 4096 then error("…") end
  local _protos, _wm = {}, {}
  for _pid=1,_np do
   local _pr = {}
   _pr.pn = _u8(); _pr.va = _u8() == 1
   local _nu = _uvar(); _pr.uv = {}
   for _i=1,_nu do _pr.uv[_i] = { _u8() == 1 and 1 or 0, _uvar() } end
   _pr.ns = _uvar()
   _uvar(); _uvar(); _uvar(); _uvar(); _uvar()  -- 5 redundant per-proto field keys
   local _nc = _uvar()
   if _nc > 65536 then error("…") end
   _pr.c = {}
   for _i=1,_nc do
    local _tag = _u8()
    if _tag == 1 then _pr.c[_i] = true
    elseif _tag == 2 then _pr.c[_i] = false
    elseif _tag == 7 then _pr.c[_i] = (0/0)
    elseif _tag == 8 then _pr.c[_i] = math.huge
    elseif _tag == 9 then _pr.c[_i] = -math.huge
    elseif _tag == 5 or _tag == 6 then
     local _ln = _uvar(); local _bb = {}
     for _j=1,_ln do _pos=_pos+1 _bb[_j] = _D[_pos-1] end
     _pr.c[_i] = {t=_tag, n=_ln, b=_bb}
    else _pr.c[_i] = nil end
   end
   local _nk = _uvar()
   if _nk > 1<<20 then error("…") end
   _pr.k = {}
   local _lrk = (_rk0 + _pid*_ast) % 65536
   for _i=1,_nk do
    local _mm = math.floor(_lrk/3) % 256
    local _oe = _uvar()
    local _aw = _svar() - _mm
    local _b1w = _svar() - _mm
    local _b2w = _svar() + _mm
    local _cw = _svar() - _mm
    _lrk = (_lrk + _ainc) % 65536
    _pr.k[_i] = { [_kOP]=_oe, [_kA]=_aw, [_kB1]=_b1w, [_kB2]=_b2w, [_kC]=_cw }
   end
   _protos[_pid] = _pr
  end
  -- watermark tail (same cipher v3, second seed)
  local _wln = _uvar()
  local _wa, _wb = …, …; local _MM2 = 2147483647
  local _wc, _wd, _pv2 = (_wa*31+_wb)%_MM2, (_wb*17+_wa)%_MM2, 0
  for _i=1,_wln do
   _wa=(_wa*48271)%_MM2; _wb=(_wb*69621)%_MM2; _wc=(_wc*2994349)%_MM2; _wd=(_wd*4050403)%_MM2
   _wb=(_wb+_pv2)%_MM2; _wc=(_wc+_wa)%_MM2
   _pv2=(math.floor(_wa/65536)*31+math.floor(_wb/2048)*17+math.floor(_wc/1024)*7+math.floor(_wd/256)*3+_pv2)%256
   _wm[_i] = (_D[_pos] - _pv2 + 256) % 256; _pos = _pos+1
  end
  local _wmi = #_wm; if _wmi < 1 then _wmi = 1; _wm[1] = 0 end
  return {P=_protos, WM=_wm, WMI=_wmi}
 end
 local function _run(_l1, _pid, _env, _upv, _args, _escf)
  local _P0 = _l1.P[_pid]
  local _K, _C, _S, _cells = _P0.k, _P0.c, {}, {}
  for _i=1,_P0.ns do _cells[_i] = {} end
  local _sp, _mr, _pc, _VA = 0, -1, 1, _args
  for _i=1,_P0.pn do _cells[_i].v = _args[_i] end
  local _tc, _six, _poi, _PB, _wmv = 37, 1, false, nil, 0
  local _rkN = (_rk0 + _pid*_ast) % 65536
  while true do
   local _ins = _K[_pc]
   local _op = (((_ins[_kOP] - _rkN) + 65536) % 65536)
   _rkN = (_rkN + _ainc) % 65536
   _pc = _pc + 1
   _tc = _tc - 1
   if _tc <= 0 then … (integrity tick: integrity check + carrier touch + _tc=64) … end
   -- dispatch chain (a balanced binary search tree of if op<=N then … else … end):
   if _op <= 16 then
    if _op == (16+58-58) and (((_six*_six-_six)%2)==0) then
     _S[_sp+1] = _cells[(..._A...)]; _sp = _sp+1
    elseif _op == (17+12-12) and (((_six*_six+_six)%2)==0) then
     local _b1 = _ins[_kB1]; local _b2 = _ins[_kB2]
     for _i=1,((_b1*2+_b2*2)/2) do
      local _k = _S[_sp - 2*((_b1*2+_b2*2)/2) + 2*_i - 2]
      local _t = _S[_sp - 2*((_b1*2+_b2*2)/2) + 2*_i - 1]
      local _v = _S[_sp - 2*((_b1*2+_b2*2)/2) + ((_b1*2+_b2*2)/2) + _i - 1]
      if _t == _env then _env[_k] = _v else _t[_k] = _v end
     end
     _sp = _sp - 2*((_b1*2+_b2*2)/2) - 1
    else
     error("…cryptic garbage…")
    end
   elseif _op <= 24 then
    if _op == (18*4/4) and (((_six*_six-_six)%2)==0) then
     _S[_sp] = -_S[_sp]
    elseif _op == (19*4/4) and (((_six*_six+_six)%2)==0) then
     _S[_sp] = #_S[_sp]
    else
     error("…")
    end
   elseif _op <= 28 then
    if _op == (20*4/4) and (((_six*_six-_six)%2)==0) then
     local _y = _S[_sp]; local _x = _S[_sp-1]; _sp = _sp-1
     _S[_sp] = _x < _y
    elseif _op == (21*4/4) and (((_six*_six+_six)%2)==0) then
     _S[_sp-1] = _S[_sp-1] / _S[_sp]; _sp = _sp - 1
    else
     error("…")
    end
   -- … (60+ more `if op<=N then … else … end` layers, one per dispatcher branch, plus ~5 decoy arms with never-matched physical opcodes) …
   else
    if _op == (50*4/4) and (((_six*_six+_six)%2)==0) then
     _S[_sp+1] = _cells[_ins[_kA]].v; _sp = _sp+1
    -- … (MOVE / LOADK / CALL / RET / etc. leaves) …
    else
     error("…")
    end
   end
  end
 end
 local _h = _decode()
 local _a = _pk(...)
 return _run(_h, 1, _ENV, {}, _a, nil)
end)({})
```

That is the v3 emit. The structure that the implementation agent must produce:

- **3 physical lines**: banner, blank, body.
- **0 top-level `local` / `do` / `local function`** outside the IIFE.
- **All file-scope constants** (`_pk`, `_ur`, `_uup`, `_sch`, `_tcn`, `_ctn`,
  `_MM`, `_rk0`, `_ast`, `_ainc`, `_kOP.._kC`, `_ck0`, `_cvw`, `_cvwW`,
  `_cv`, `_u8`, `_uvar`, `_svar`, `_blob`) declared as `local` inside
  the IIFE body.
- **`_decode` and `_run`** as `local function` blocks inside the IIFE.
- **The dispatch chain** as a nested tree of `if _op<=N then … else …
  end` blocks, with the `((((_six*_six±_six)%2)==0))` MBA gate on every
  leaf (current behavior — `(_six*_six-_six)` is even for any integer).
- **The cipher loop** with 4 stream updates (`_sa, _sb, _sc, _sd`) and
  the floor-based mixing — this is the v2.1 cipher verbatim.
- **Integrity tick** at the top of the while-loop body: `_tc = _tc - 1;
  if _tc <= 0 then <integrity check + carrier touch> end`. The exact
  tick body is whatever `src/engine/runtime/integrity.ts` and
  `src/engine/runtime/carriers.ts` currently emit.
- **The bootstrap tail**: `local _h = _decode(); local _a = _pk(...);
  return _run(_h, 1, _ENV, {}, _a, nil)`. The IIFE returns the
  protected program's return value.

### What changes vs. today

| | v2.1 emitter (today) | v3 emitter (planned) |
| --- | --- | --- |
| Lines | 890 | 3 |
| Top-level `local` | 14 | 0 |
| Top-level `do` | 2 | 0 |
| Top-level `local function` | 4 | 0 |
| `local` declarations | scattered file-scope | all inside the IIFE body, prefixed `_` |
| Comments | 5+ section markers | 1 banner |
| Caller consumption | `local t = loadstring(s)(); t.entry(t)` | `loadstring(s)()` |
| Cipher | unchanged | unchanged |
| Dispatcher | unchanged | unchanged |
| On-wire protobuf | unchanged | unchanged |
| Public JS API | unchanged | unchanged |
