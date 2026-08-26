# NEVAHEX — Target compatibility matrix

Status legend: ✅ automated in CI · 🕐 manual checklist (no runner available)
· ⛒ not applicable. Dated entries record the last executed verification.

| Target | Runner | Status | Last verified | Notes |
|---|---|---|---|---|
| Lua 5.4 | wasmoon (e2e.cjs) | ✅ | pending first Gate 0 run | primary differential target |
| Lua 5.1 | lua5.1 binary (detect `lua5.1`/`lua`) | 🕐 | — | strictest limits: 60 upvalues, ~200 call depth |
| LuaJIT | `luajit` binary | 🕐 | — | unbounded depth; `bit` library path |
| Luau | `luau` CLI | 🕐 | — | no os.clock/sethook; AE emitter-disabled |

## Behavioral pins exercised by the suites (must stay green everywhere)

- `%` floor-mod / `math.fmod` truncation split (probe + arithmetic parity)
- `%.14g` float display (`tostring(0.1)=="0.1"`, `(0.1+0.2)~=0.3`)
- JS-shortest-repr ↔ strtod exact double round-trip
- E3 non-finite tags: NaN ⇒ `(0/0)`, ±Inf ⇒ `math.huge` (never text forms)
- `unpack or (table and table.unpack)` feature detect
- `_G or _ENV` resolution; no setfenv/loadstring in shipped runtime
- Roblox degradations: string metatable untouched · collectgarbage abstain ·
  anti-emulation emitter-disabled for luau profile

## Manual checklist procedure (when runners are absent)

1. Protect `fixtures/smoke.lua` for each target profile.
2. Execute under the real interpreter; diff observable output against
   EXPECTED block.
3. Record date + interpreter version in this table.
4. Any deviation ⇒ file a constraint-matrix regression before proceeding.
