# NEVAHEX-VM Obfuscation Sample

This file contains a representative sample of the enhanced NEVAHEX-VM v3 obfuscation output.

## Source Input
```lua
local x = 0
for i = 1, 10 do
  if i % 2 == 0 then x = x + i else x = x - 1 end
end
return x
```

## Obfuscated Output (strict tier, keyless mode)

```lua
-- NEVAHEX-VM v3 'Hex' — protected artifact — >$>@XQ|>![&$() runs it

return (function(e2V5i7A, ...)  local dJq8LkKhOh=setmetatable({},{__mode="k"})  local function J0MJVuMcs5(...) local n=select('#',...) return {n=n,...} end  local nn8P6uj=_ENV.unpack or (table and table.unpack)  local function IebRlWn_(t,i,j)   if i>j then return end   if nn8P6uj and j-i>15 then return nn8P6uj(t,i,j) end   return t[i],IebRlWn_(t,i+1,j)  end  local MMKv0qXc=_ENV.string.char  local npcWHy=_ENV.table.concat  local wV26lRUx=(934204-0) PWgR1Y=(107247-0) pmTrFFGUV=(961998+41-41) gXElmWwyA=(985496*4/4) r3NZilI=(259134+79-79)  local TRUKhbH=((31369+256)-256) s3BRtK0=(1490917*4/4) H_DD2U=(1160641*4/4) YgKCOo_g=((214173+256)-256)  local ANx1QWma=(1587627021*4/4) _G.__CK0=tostring(ANx1QWma)  local nXJyvQnxiW=0 D1fyxZ5J=0  local function wMnpjbbsD(pID,e)   if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end   local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end   _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)   local kk=(((ANx1QWma+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end   _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk)   local parts={} local g=kk   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=MMKv0qXc(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end   local sv=npcWHy(parts)   if e.t==5 then v=tonumber(sv) else v=sv end   if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end   _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)   e.v=v return v  end  local Ca0bCHq="<...encrypted blob...>"
 local function HufYjZ_decode()
  local D={} local bn=#Ca0bCHq
  if bn>4194304 then error("XXQ^A$|*![]{{[X^|?*{Z|>*#^!~") end
  local sa=(545920216*4/4) sb=((17635956+256)-256) MM=2147483647
  do
   local BS={{p=(1+22-22),a=((64+256)-256),h=(840546865*4/4)},{p=(84-0),a=(64*4/4),h=((439102002+256)-256)},...}
   for _bs=1,#BS do
    local sl=BS[_bs]
    local hh=(2166136261%1000000007)
    for j=sl.p,sl.p+sl.a-1 do hh=(hh*16777619+string.byte(Ca0bCHq,j))%1000000007 end
    if hh~=sl.h then
     sa=(sa+(209487+91-91))%2147483647 if sa<1 then sa=sa+2147483646 end
     sb=(sb+(30971737-0))%2147483647 if sb<1 then sb=sb+2147483646 end
     wYgdOYSrccZ=1
    end
   end
  end
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(Ca0bCHq,i)-pv+256)%256
  end
  -- ... deserialization continues ...
  return {P=lICscIFlu,WM=G4_nBIbG,WMI=aSxOxR}
 end

 local function HufYjZ_run(AVecaN,PUHWlcjEHw1,Xk8gaK3RyL,dzGyVOSwMGR,tln6dp)
  -- ... VM state init ...
  while true do
   -- integrity tick, anti-emu, anti-debug checks ...
   -- fetch + decode with non-linear rolling key
   local lrk=(ANx1QWma+AVecaN*Cz6MiAUKa+AVecaN*AVecaN*LQUH4V567i)%65536
   -- keyed record access with per-build field keys
   local oe=wNTGAoN() local aw=jBdz5khn()-mm local b1w=jBdz5khn()-mm local b2w=jBdz5khn()+mm local cw=jBdz5khn()-mm
   lrk=(lrk+LQUH4V567i+(lrk>>3))%65536
   -- dispatch via range tree with MBA-scrambled handlers
   if op<=((357669980+256)-256) then
    -- handler body with silent-tier MBA poison
   else
    error("!$A*{#!#~%**|}<X%>A%&]{ZX|%|")
   end
  end
 end
 -- bootstrap and return ...
end)(_ENV)
```

## Obfuscation Layers Demonstrated

| Layer | Evidence in Sample |
|-------|-------------------|
| **String encryption** | Encrypted blob `Ca0bCHq`; per-string keys derived from build CSPRNG |
| **Ciphertext integrity** | `BS` slice table with `p`, `a`, `h`; pre-decode hash verification |
| **Constant decryption** | `wMnpjbbsD(pID,e)` decrypts constants on access with CVW coupling |
| **Keyed records** | Instruction operands accessed via randomized field keys |
| **Rolling-key opcodes** | `lrk=(ANx1QWma+AVecaN*Cz6MiAUKa+AVecaN*AVecaN*LQUH4V567i)%65536` |
| **Non-linear step** | `lrk=(lrk+LQUH4V567i+(lrk>>3))%65536` |
| **Range-tree dispatch** | Nested `if op<=... then` routers |
| **Silent-tier poison** | MBA-scrambled arithmetic in handler bodies |
| **Anti-debugging** | `debug.getinfo` checks in dispatch preamble |
| **Randomized names** | All locals are per-build randomized |
| **IIFE entropy** | Randomized env parameter `e2V5i7A` |
