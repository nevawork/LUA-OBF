-- NEVAHEX-VM v3 'Hex' — protected artifact — #QZQ%!&<$Q#~() runs it

return (function(aUr6X51b0, ...)
 local li8RZ7mWfAX=setmetatable({},{__mode="k"})
 local function Dm7cuo(...) local n=select('#',...) return {n=n,...} end
 local OtUMHkp=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function nDyJ_IE30(t,i,j)
  if i>j then return end
  if OtUMHkp and j-i>15 then return OtUMHkp(t,i,j) end
  return t[i],nDyJ_IE30(t,i+1,j)
 end
 local TsLqYJAfkz5=_G.string.char
 local Zt4R9OpH=_G.table.concat
 local ZOh5Ijww3B,M7Qf_nrg,QgpUlva7H2B,SkprxEUM,VHOemKGC,thbjgvFe4J,xL2XKOLm,HuqcgqML,Q7cdyuHbfid,EIja6Y,Xvli5fp4QW,t6CRkSucl
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then M55A7KoDK53=true m0n3o4=9999 end debug.sethook() end
 local HQ0FDb=(932583-0) RzmkIYgs=((999172+256)-256) BxOLKTE0YwQ=(974460*4/4) QPr8wYzd=(159170-0) ipn83O=(686746*4/4)
 local cakA5y4Kg7s=(11387*4/4) MNx2FqbNf=((1219043+256)-256) G7m2LXQGM5p=((1281605+256)-256) CO5dL5P8Pd=((196757+256)-256)
 local GWpYjaI=(1259836878*4/4) _G.__CK0=tostring(GWpYjaI)
 local eDCRftFigZ=0 lCGvAsjr_4z=0
 local function xB9DAXxNxod(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((GWpYjaI+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=TsLqYJAfkz5(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=Zt4R9OpH(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local IO1bMp="\159\205\165\144\186\132d\178\169\204)\229\131\222\\\246nx\230\138hhF\127\203D\221\185\193r/P@\165\212\215\227\225.\220\2451\250\254\031\029\249z6\229\021\142\225\161@\220\158Z\147\192@?\"\156\143\176\137\212\026\033\148\238\006\154\208\012B\243\253\140\202\167\223\177\178>\014\212e?;\240\008\246{p\226\140\010;[=x\217f\160\017\197\127\001r\225\217\151\128\213)w\169\239\235e\0038\247GK"
 local function m8D4UkM5iT_decode()
  local D={} local bn=#IO1bMp
  if bn>4194304 then error("[*Q~]@]!Z*{|X@~Z&}Z|[Z$X?#]^") end
  local sa=(5652910*4/4) sb=((1485124499+256)-256) MM=2147483647
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(IO1bMp,i)-pv+256)%256
  end
  local ldrJ5Tru=1
  local function VgmhIbV() local bt=D[ldrJ5Tru] ldrJ5Tru=ldrJ5Tru+1 return bt end
  local function aOBVlF46tL()
   local sh,r=0,0
   while true do
    local bt=VgmhIbV()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function wXk7rQq80B()
   local u=aOBVlF46tL()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local ow2mGhIJ2=VgmhIbV()
  if ow2mGhIJ2<128 then error("*&}Q{~[!Z*%X]*>@Q]]XZXX~Z}Q$") end
  for i=1,ow2mGhIJ2-128 do VgmhIbV() end
  local nTAC4Ig=aOBVlF46tL()
  print("DECODE np=", nTAC4Ig)
  if nTAC4Ig>4096 then error("~AQQ#Z!Z|]]!$&>*$@<?<]^^ZQ}}") end
  local g7h6v0PU8={} local RJ2NeB={}
  for mtgkrFR8F2R=1,nTAC4Ig do
   local pr={}
   pr.pn=VgmhIbV()
   pr.va=VgmhIbV()==1
   local nu=aOBVlF46tL()
   pr.uv={}
   for i=1,nu do pr.uv[i]={VgmhIbV()==1 and 1 or 0,aOBVlF46tL()} end
   pr.ns=aOBVlF46tL()
   aOBVlF46tL() aOBVlF46tL() aOBVlF46tL() aOBVlF46tL() aOBVlF46tL()
   local nc=aOBVlF46tL()
   if nc>65536 then error("[|[^?X{Z>^*!<AZ#&}@@Z|Q|%~@X") end
   pr.c={}
   for i=1,nc do
    local tag=VgmhIbV()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=aOBVlF46tL()
     local bb={}
     for j=1,ln do ldrJ5Tru=ldrJ5Tru+1 bb[j]=D[ldrJ5Tru-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=aOBVlF46tL()
   print("DECODE pid=", mtgkrFR8F2R, "nk=", nk)
   if nk>262144 then error(">~&#}&>]Q&$$>A^}X]<]|Q{|~%{<") end
   pr.k={}
   local lrk=(cakA5y4Kg7s+mtgkrFR8F2R*MNx2FqbNf+mtgkrFR8F2R*mtgkrFR8F2R*G7m2LXQGM5p)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=aOBVlF46tL()
    local aw=wXk7rQq80B()-mm
    local b1w=wXk7rQq80B()-mm
    local b2w=wXk7rQq80B()+mm
    local cw=wXk7rQq80B()-mm
    lrk=(lrk+CO5dL5P8Pd+math.floor(lrk/8))%65536
    pr.k[i]={[HQ0FDb]=oe,[RzmkIYgs]=aw,[BxOLKTE0YwQ]=b1w,[QPr8wYzd]=b2w,[ipn83O]=cw}
   end
   g7h6v0PU8[mtgkrFR8F2R]=pr
  end
  local wln=aOBVlF46tL()
  local wa=(1175833281*4/4) wb=(421696286*4/4) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   RJ2NeB[i]=(D[ldrJ5Tru]-pv2+256)%256
   ldrJ5Tru=ldrJ5Tru+1
  end
  local RqSTcl=#RJ2NeB
  if RqSTcl<1 then RqSTcl=1 RJ2NeB[1]=0 end
  return {P=g7h6v0PU8,WM=RJ2NeB,WMI=RqSTcl}
 end
 local DkcN5jm=0
 local EgMtwNxKZp={} local GwQMvYYe1N={}
 local function m8D4UkM5iT(l1,Awf9mm,k7J1hUWBmI,VF1lOTRBZ,zucMcFla2,S0vdThTaf)
  local g7h6v0PU8,RJ2NeB,RqSTcl=l1.P,l1.WM,l1.WMI
  local CYpV6ShDyIj=g7h6v0PU8[Awf9mm]
  local MChVyB2l=CYpV6ShDyIj.k
  local RzjNnlne=CYpV6ShDyIj.c
  local ZzzE8J={}
  local Gcag65Z={}
  for UAepcblKK=1,CYpV6ShDyIj.ns do Gcag65Z[UAepcblKK]={} end
  local gSr9E8WiVG,Tf7iS9yiOW,A4eKF4gFe=0,-1,1
  local fXETdDT=zucMcFla2
  for UAepcblKK=1,CYpV6ShDyIj.pn do Gcag65Z[UAepcblKK].v=zucMcFla2[UAepcblKK] end
  local E2ioq5piPm8,Mo2RPeRUGc=37,1
  local M55A7KoDK53,m0n3o4,bn_aBKRp=false,0,0
  local sulGZylud=(cakA5y4Kg7s+Awf9mm*MNx2FqbNf+Awf9mm*Awf9mm*G7m2LXQGM5p)%65536
  local VLe5295,wrwmbkOkP,CHLpbx,rsRAOYclgUc,ZtBMZaY
  local mBpYZq,op
  while true do
   local Tcv7_zgzkI=((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2
   if Tcv7_zgzkI==0 then local _og=1+1 end
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then M55A7KoDK53=true m0n3o4=1 end end
   mBpYZq=MChVyB2l[A4eKF4gFe]
   if A4eKF4gFe<=6 then print("TRC PC="..tostring(A4eKF4gFe).." RK="..tostring(sulGZylud).." OE="..tostring(mBpYZq[HQ0FDb]).." OP="..tostring(op).." A="..tostring(mBpYZq[RzmkIYgs]).." B="..tostring(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd]).." C="..tostring(mBpYZq[ipn83O])) end
   mBpYZq=MChVyB2l[A4eKF4gFe]
   op=(((mBpYZq[HQ0FDb]-sulGZylud)+65536)%65536)
   sulGZylud=(sulGZylud+CO5dL5P8Pd+math.floor(sulGZylud/8))%65536
   A4eKF4gFe=A4eKF4gFe+1
   if op<=16 then
   if op<=8 then
   if op<=3 then
   if op<=1 then
   if op<=0 then
   if op==((0+256)-256) then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=true
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1-0) and (((E2ioq5piPm8*E2ioq5piPm8)-E2ioq5piPm8)%2)==0 then
   do
   local FtwUOF=ZzzE8J[gSr9E8WiVG]
   ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG-1] * FtwUOF
   gSr9E8WiVG=gSr9E8WiVG-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=2 then
   if op==(2*4/4) then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=k7J1hUWBmI
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((3+256)-256) and (((bn_aBKRp*bn_aBKRp)-bn_aBKRp)%2)==0 then
   do
   local uN2UhUCX=mBpYZq[RzmkIYgs]
   local g5GdlG=ZzzE8J[gSr9E8WiVG]
   local KXfCc2S7I=ZzzE8J[gSr9E8WiVG-1]
   local R1YjYvFZ=ZzzE8J[gSr9E8WiVG-2]
   gSr9E8WiVG=gSr9E8WiVG-3
   Gcag65Z[uN2UhUCX]={v=R1YjYvFZ}
   Gcag65Z[uN2UhUCX+1].v=R1YjYvFZ
   Gcag65Z[uN2UhUCX+2].v=KXfCc2S7I
   Gcag65Z[uN2UhUCX+3].v=g5GdlG
   if (g5GdlG>0 and R1YjYvFZ>KXfCc2S7I) or (g5GdlG<0 and R1YjYvFZ<KXfCc2S7I) then A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd]) end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=4 then
   if op==(4*4/4) then
   do
   local vmuyArc=ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   if vmuyArc then A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd]) end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=7 then
   if op<=6 then
   if op<=5 then
   if op==(5*4/4) then
   ZzzE8J[gSr9E8WiVG-1]=ZzzE8J[gSr9E8WiVG-1]==ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(6-0) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   do
   local b3t0Qd,QmjLxANPyb=mBpYZq[RzmkIYgs],mBpYZq[BxOLKTE0YwQ]
   local wHuArM=gSr9E8WiVG-QmjLxANPyb
   for UAepcblKK=1,QmjLxANPyb do Gcag65Z[b3t0Qd+UAepcblKK-1].v=ZzzE8J[wHuArM+UAepcblKK] end
   gSr9E8WiVG=wHuArM
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((7+256)-256) then
   ZzzE8J[gSr9E8WiVG-1]=ZzzE8J[gSr9E8WiVG-1]<=ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((8+256)-256) and (((bn_aBKRp*bn_aBKRp)-bn_aBKRp)%2)==0 then
   do
   local C9clcAlKhlH=mBpYZq[RzmkIYgs]
   local mYdtwQ=g7h6v0PU8[C9clcAlKhlH]
   local G9puP1QhOU={}
   for UAepcblKK=1,#mYdtwQ.uv do
   local vkPKcR9Qb=mYdtwQ.uv[UAepcblKK]
   if vkPKcR9Qb[1]==1 then G9puP1QhOU[UAepcblKK]=Gcag65Z[vkPKcR9Qb[2]] else G9puP1QhOU[UAepcblKK]=VF1lOTRBZ[vkPKcR9Qb[2]] end
   end
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]={pid=C9clcAlKhlH,env=k7J1hUWBmI,uv=G9puP1QhOU}
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=11 then
   if op<=10 then
   if op<=9 then
   if op==(9-0) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=nil
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(10+28-28) then
   do
   local uN2UhUCX=mBpYZq[RzmkIYgs]
   local GBsxbl=mBpYZq[ipn83O]
   local ervJr237=Dm7cuo(Gcag65Z[uN2UhUCX].v(Gcag65Z[uN2UhUCX+1].v,Gcag65Z[uN2UhUCX+2].v))
   if ervJr237[1]~=nil then
   A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd])
   Gcag65Z[uN2UhUCX+2].v=ervJr237[1]
   for UAepcblKK=1,GBsxbl do Gcag65Z[uN2UhUCX+2+UAepcblKK]={v=ervJr237[UAepcblKK]} end
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(11*4/4) and ((bn_aBKRp*bn_aBKRp+bn_aBKRp)%2)==0 then
   do end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=15 then
   if op<=12 then
   if op==(12*4/4) then
   do
   local bcwnGyTW8Z=ZzzE8J[gSr9E8WiVG]
   local aM0QWlz3lA=ZzzE8J[gSr9E8WiVG-1]
   gSr9E8WiVG=gSr9E8WiVG-1
   ZzzE8J[gSr9E8WiVG]=aM0QWlz3lA - bcwnGyTW8Z
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=14 then
   if op<=13 then
   if op==(13*4/4) and (((E2ioq5piPm8*E2ioq5piPm8)-E2ioq5piPm8)%2)==0 then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=k7J1hUWBmI[xB9DAXxNxod(Awf9mm,RzjNnlne[mBpYZq[RzmkIYgs]])]
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(14+37-37) then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG-1]
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(15*4/4) and (((bn_aBKRp*bn_aBKRp)-bn_aBKRp)%2)==0 then
   do
   local uN2UhUCX=mBpYZq[RzmkIYgs]
   local GBsxbl=mBpYZq[ipn83O]
   local gi_tjFw=ZzzE8J[gSr9E8WiVG] local X4_8koTsd=ZzzE8J[gSr9E8WiVG-1] local hTnLoieTQ=ZzzE8J[gSr9E8WiVG-2]
   gSr9E8WiVG=gSr9E8WiVG-3
   Gcag65Z[uN2UhUCX].v=hTnLoieTQ
   Gcag65Z[uN2UhUCX+1].v=X4_8koTsd
   Gcag65Z[uN2UhUCX+2].v=gi_tjFw
   local ervJr237=Dm7cuo(Gcag65Z[uN2UhUCX].v(Gcag65Z[uN2UhUCX+1].v,Gcag65Z[uN2UhUCX+2].v))
   if ervJr237[1]==nil then
   A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd])
   else
   Gcag65Z[uN2UhUCX+2].v=ervJr237[1]
   for UAepcblKK=1,GBsxbl do Gcag65Z[uN2UhUCX+2+UAepcblKK]={v=ervJr237[UAepcblKK]} end
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(16-0) then
   do
   local h9KRQ1IVGk,i6d65MEl=mBpYZq[RzmkIYgs],mBpYZq[BxOLKTE0YwQ]
   wrwmbkOkP=h9KRQ1IVGk<0 and (Tf7iS9yiOW<0 and 0 or Tf7iS9yiOW) or h9KRQ1IVGk
   CHLpbx=0
   rsRAOYclgUc=gSr9E8WiVG-wrwmbkOkP-1-CHLpbx
   ZtBMZaY=ZzzE8J[rsRAOYclgUc]
   local rjFztDG
   if type(ZtBMZaY)=='table' and ZtBMZaY.pid then
   local GENowl1BPP={n=wrwmbkOkP}
   for UAepcblKK=1,wrwmbkOkP do GENowl1BPP[UAepcblKK]=ZzzE8J[rsRAOYclgUc+CHLpbx+UAepcblKK] end
   rjFztDG=m8D4UkM5iT(ZtBMZaY.pid,ZtBMZaY.env,ZtBMZaY.uv,GENowl1BPP,S0vdThTaf)
   else
   rjFztDG=Dm7cuo(ZtBMZaY(nDyJ_IE30(ZzzE8J,rsRAOYclgUc+1+CHLpbx,gSr9E8WiVG)))
   end
   if i6d65MEl==0 then
   gSr9E8WiVG=rsRAOYclgUc-1
   Tf7iS9yiOW=-1
   elseif i6d65MEl==-1 then
   VLe5295=rjFztDG.n
   for UAepcblKK=1,VLe5295 do ZzzE8J[rsRAOYclgUc+UAepcblKK-1]=rjFztDG[UAepcblKK] end
   gSr9E8WiVG=rsRAOYclgUc+VLe5295-1
   Tf7iS9yiOW=VLe5295
   else
   for UAepcblKK=1,i6d65MEl do ZzzE8J[rsRAOYclgUc+UAepcblKK-1]=rjFztDG[UAepcblKK] end
   gSr9E8WiVG=rsRAOYclgUc+i6d65MEl-1
   Tf7iS9yiOW=-1
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=37 then
   if op<=34 then
   if op<=29 then
   if op<=21 then
   if op<=19 then
   if op<=17 then
   if op==((17+256)-256) and ((E2ioq5piPm8*E2ioq5piPm8+E2ioq5piPm8)%2)==0 then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=false
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=18 then
   if op==(18+71-71) and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   do
   local aM0QWlz3lA=ZzzE8J[gSr9E8WiVG-1]
   ZzzE8J[gSr9E8WiVG-1]=aM0QWlz3lA ^ ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((19+256)-256) then
   error("]Z!>@&>@{~]A?Z<|&Z>#Q#$Z[$*Z".."::ESCAPE-OP="..tostring(op))
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=20 then
   if op==(20*4/4) and ((E2ioq5piPm8*E2ioq5piPm8+E2ioq5piPm8)%2)==0 then
   Gcag65Z[mBpYZq[RzmkIYgs]].v=ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(21*4/4) then
   do
   local ihfbIlU=ZzzE8J[gSr9E8WiVG] local FtwUOF=ZzzE8J[gSr9E8WiVG-1]
   ZzzE8J[gSr9E8WiVG-1]=FtwUOF[ihfbIlU]
   gSr9E8WiVG=gSr9E8WiVG-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=24 then
   if op<=22 then
   if op==(22-0) then
   do
   local bcwnGyTW8Z=ZzzE8J[gSr9E8WiVG]
   local aM0QWlz3lA=ZzzE8J[gSr9E8WiVG-1]
   gSr9E8WiVG=gSr9E8WiVG-1
   ZzzE8J[gSr9E8WiVG]=aM0QWlz3lA / bcwnGyTW8Z
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=23 then
   if op==((23+256)-256) and (((E2ioq5piPm8*E2ioq5piPm8)-E2ioq5piPm8)%2)==0 then
   gSr9E8WiVG=gSr9E8WiVG+1
   ZzzE8J[gSr9E8WiVG]=VF1lOTRBZ[mBpYZq[RzmkIYgs]].v
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((24+256)-256) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   do
   if not ZzzE8J[gSr9E8WiVG] then A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd]) end
   gSr9E8WiVG=gSr9E8WiVG-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=25 then
   if op==(25+41-41) then
   do
   local h9KRQ1IVGk=mBpYZq[RzmkIYgs]
   if h9KRQ1IVGk<0 then
   local QmjLxANPyb=fXETdDT.n or #fXETdDT
   for UAepcblKK=1,QmjLxANPyb do gSr9E8WiVG=gSr9E8WiVG+1 ZzzE8J[gSr9E8WiVG]=fXETdDT[UAepcblKK] end
   Tf7iS9yiOW=QmjLxANPyb
   else
   for UAepcblKK=1,h9KRQ1IVGk do gSr9E8WiVG=gSr9E8WiVG+1 ZzzE8J[gSr9E8WiVG]=fXETdDT[UAepcblKK] end
   Tf7iS9yiOW=-1
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=27 then
   if op<=26 then
   if op==(26-0) then
   k7J1hUWBmI[xB9DAXxNxod(Awf9mm,RzjNnlne[mBpYZq[RzmkIYgs]])]=ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((27+256)-256) and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd])
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=28 then
   if op==(28+71-71) then
   do
   local HdMyZiolylm=mBpYZq[ipn83O]
   local I1tAxy=HdMyZiolylm<0 and ((-HdMyZiolylm-1)+(Tf7iS9yiOW<0 and 0 or Tf7iS9yiOW)) or HdMyZiolylm
   local h9KRQ1IVGk=mBpYZq[RzmkIYgs]
   if I1tAxy>h9KRQ1IVGk then
   gSr9E8WiVG=gSr9E8WiVG-I1tAxy+h9KRQ1IVGk
   elseif I1tAxy<h9KRQ1IVGk then
   while I1tAxy<h9KRQ1IVGk do gSr9E8WiVG=gSr9E8WiVG+1 ZzzE8J[gSr9E8WiVG]=nil I1tAxy=I1tAxy+1 end
   end
   Tf7iS9yiOW=-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(29-0) then
   do
   local h9KRQ1IVGk=mBpYZq[RzmkIYgs]
   local b3t0Qd=gSr9E8WiVG-2*h9KRQ1IVGk
   for UAepcblKK=1,h9KRQ1IVGk do
   local ihfbIlU=ZzzE8J[b3t0Qd+2*UAepcblKK-2]
   local FtwUOF=ZzzE8J[b3t0Qd+2*UAepcblKK-1]
   local vmuyArc=ZzzE8J[b3t0Qd+2*h9KRQ1IVGk+UAepcblKK-1]
   if FtwUOF==k7J1hUWBmI then k7J1hUWBmI[ihfbIlU]=vmuyArc else FtwUOF[ihfbIlU]=vmuyArc end
   end
   gSr9E8WiVG=b3t0Qd-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   else
   if op<=32 then
   if op<=30 then
   if op==(30*4/4) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   ZzzE8J[gSr9E8WiVG]=not ZzzE8J[gSr9E8WiVG]
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=31 then
   if op==((31+256)-256) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   do
   local uN2UhUCX=mBpYZq[RzmkIYgs]
   local GBsxbl=Gcag65Z[uN2UhUCX].v+Gcag65Z[uN2UhUCX+3].v
   local KXfCc2S7I=Gcag65Z[uN2UhUCX+2].v
   local g5GdlG=Gcag65Z[uN2UhUCX+3].v
   if (g5GdlG>0 and GBsxbl<=KXfCc2S7I) or (g5GdlG<0 and GBsxbl>=KXfCc2S7I) then
   Gcag65Z[uN2UhUCX]={v=GBsxbl}
   Gcag65Z[uN2UhUCX+1].v=GBsxbl
   A4eKF4gFe=A4eKF4gFe+(mBpYZq[BxOLKTE0YwQ]+mBpYZq[QPr8wYzd])
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(32-0) then
   gSr9E8WiVG=gSr9E8WiVG+1
   local FtwUOF={}
   li8RZ7mWfAX[FtwUOF]=0
   ZzzE8J[gSr9E8WiVG]=FtwUOF
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=33 then
   if op==((33+256)-256) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   do
   local Fo_1SUMhf=mBpYZq[RzmkIYgs]
   local kQi_WVvLncW=ZzzE8J[gSr9E8WiVG-Fo_1SUMhf+1]
   for UAepcblKK=gSr9E8WiVG-Fo_1SUMhf+2,gSr9E8WiVG do kQi_WVvLncW=kQi_WVvLncW..ZzzE8J[UAepcblKK] end
   gSr9E8WiVG=gSr9E8WiVG-Fo_1SUMhf+1
   ZzzE8J[gSr9E8WiVG]=kQi_WVvLncW
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(34-0) then
   ZzzE8J[gSr9E8WiVG-1]=ZzzE8J[gSr9E8WiVG-1]<ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=36 then
   if op<=35 then
   if op==(35*4/4) then
   ZzzE8J[gSr9E8WiVG]=-ZzzE8J[gSr9E8WiVG]
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(36*4/4) then
   do
   local vmuyArc=ZzzE8J[gSr9E8WiVG] local ihfbIlU=ZzzE8J[gSr9E8WiVG-1] local FtwUOF=ZzzE8J[gSr9E8WiVG-2]
   FtwUOF[ihfbIlU]=vmuyArc
   gSr9E8WiVG=gSr9E8WiVG-3
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(37+82-82) then
   do
   local FtwUOF=ZzzE8J[gSr9E8WiVG]
   ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG-1] + FtwUOF
   gSr9E8WiVG=gSr9E8WiVG-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=47 then
   if op<=44 then
   if op<=41 then
   if op<=39 then
   if op<=38 then
   if op==((38+256)-256) and ((E2ioq5piPm8*E2ioq5piPm8+E2ioq5piPm8)%2)==0 then
   if Tf7iS9yiOW>1 then gSr9E8WiVG=gSr9E8WiVG-Tf7iS9yiOW+1 end
   Tf7iS9yiOW=-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(39+52-52) and ((7*E2ioq5piPm8*E2ioq5piPm8)+E2ioq5piPm8)%2==0 then
   do
   local FtwUOF=ZzzE8J[gSr9E8WiVG]
   ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG-1] % FtwUOF
   gSr9E8WiVG=gSr9E8WiVG-1
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=40 then
   if op==((40+256)-256) then
   do
   local h9KRQ1IVGk,i6d65MEl=mBpYZq[RzmkIYgs],mBpYZq[BxOLKTE0YwQ]
   wrwmbkOkP=h9KRQ1IVGk<0 and (Tf7iS9yiOW<0 and 0 or Tf7iS9yiOW) or h9KRQ1IVGk
   CHLpbx=1
   rsRAOYclgUc=gSr9E8WiVG-wrwmbkOkP-1-CHLpbx
   ZtBMZaY=ZzzE8J[rsRAOYclgUc]
   local rjFztDG
   if type(ZtBMZaY)=='table' and ZtBMZaY.pid then
   local GENowl1BPP={n=wrwmbkOkP}
   for UAepcblKK=1,wrwmbkOkP do GENowl1BPP[UAepcblKK]=ZzzE8J[rsRAOYclgUc+CHLpbx+UAepcblKK] end
   rjFztDG=m8D4UkM5iT(ZtBMZaY.pid,ZtBMZaY.env,ZtBMZaY.uv,GENowl1BPP,S0vdThTaf)
   else
   rjFztDG=Dm7cuo(ZtBMZaY(nDyJ_IE30(ZzzE8J,rsRAOYclgUc+1+CHLpbx,gSr9E8WiVG)))
   end
   if i6d65MEl==0 then
   gSr9E8WiVG=rsRAOYclgUc-1
   Tf7iS9yiOW=-1
   elseif i6d65MEl==-1 then
   VLe5295=rjFztDG.n
   for UAepcblKK=1,VLe5295 do ZzzE8J[rsRAOYclgUc+UAepcblKK-1]=rjFztDG[UAepcblKK] end
   gSr9E8WiVG=rsRAOYclgUc+VLe5295-1
   Tf7iS9yiOW=VLe5295
   else
   for UAepcblKK=1,i6d65MEl do ZzzE8J[rsRAOYclgUc+UAepcblKK-1]=rjFztDG[UAepcblKK] end
   gSr9E8WiVG=rsRAOYclgUc+i6d65MEl-1
   Tf7iS9yiOW=-1
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41-0) and ((bn_aBKRp*bn_aBKRp+bn_aBKRp)%2)==0 then
   ZzzE8J[gSr9E8WiVG]=#ZzzE8J[gSr9E8WiVG]
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=42 then
   if op==(42*4/4) and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   do
   local h9KRQ1IVGk=mBpYZq[RzmkIYgs]
   local rjFztDG={n=0}
   if h9KRQ1IVGk<0 then
   local QmjLxANPyb=Tf7iS9yiOW<0 and 0 or Tf7iS9yiOW
   rjFztDG.n=QmjLxANPyb
   local R1YjYvFZ=gSr9E8WiVG-QmjLxANPyb+1
   for UAepcblKK=1,QmjLxANPyb do rjFztDG[UAepcblKK]=ZzzE8J[R1YjYvFZ+UAepcblKK-1] end
   else
   rjFztDG.n=h9KRQ1IVGk
   for UAepcblKK=1,h9KRQ1IVGk do rjFztDG[UAepcblKK]=ZzzE8J[gSr9E8WiVG-h9KRQ1IVGk+UAepcblKK] end
   end
   return rjFztDG
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=43 then
   if op==(43-0) and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   local FtwUOF=ZzzE8J[gSr9E8WiVG]
   ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG-1]
   ZzzE8J[gSr9E8WiVG-1]=FtwUOF
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((44+256)-256) and ((E2ioq5piPm8*E2ioq5piPm8+E2ioq5piPm8)%2)==0 then
   do
   local vmuyArc=ZzzE8J[gSr9E8WiVG] local ihfbIlU=ZzzE8J[gSr9E8WiVG-1] local FtwUOF=ZzzE8J[gSr9E8WiVG-mBpYZq[RzmkIYgs]]
   FtwUOF[ihfbIlU]=vmuyArc
   gSr9E8WiVG=gSr9E8WiVG-2
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=45 then
   if op==(45+48-48) then
   do
   local h9KRQ1IVGk=mBpYZq[RzmkIYgs]
   if h9KRQ1IVGk>=0 then
   local FtwUOF=ZzzE8J[gSr9E8WiVG-h9KRQ1IVGk-1]
   local Fo_1SUMhf=li8RZ7mWfAX[FtwUOF] or 0
   for UAepcblKK=1,h9KRQ1IVGk do FtwUOF[Fo_1SUMhf+UAepcblKK]=ZzzE8J[gSr9E8WiVG-h9KRQ1IVGk+UAepcblKK] end
   li8RZ7mWfAX[FtwUOF]=Fo_1SUMhf+h9KRQ1IVGk
   gSr9E8WiVG=gSr9E8WiVG-h9KRQ1IVGk-1
   else
   local upu4BSy=(-h9KRQ1IVGk)-1
   local MCk6rdqrL9=Tf7iS9yiOW<0 and 0 or Tf7iS9yiOW
   local ak39I119=upu4BSy+MCk6rdqrL9
   local b3t0Qd=gSr9E8WiVG-ak39I119
   local FtwUOF=ZzzE8J[b3t0Qd-1]
   local Fo_1SUMhf=li8RZ7mWfAX[FtwUOF] or 0
   for UAepcblKK=1,ak39I119 do FtwUOF[Fo_1SUMhf+UAepcblKK]=ZzzE8J[b3t0Qd+UAepcblKK-1] end
   li8RZ7mWfAX[FtwUOF]=Fo_1SUMhf+ak39I119
   Tf7iS9yiOW=-1
   gSr9E8WiVG=b3t0Qd-1
   end
   end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=46 then
   if op==((46+256)-256) and ((bn_aBKRp*bn_aBKRp+bn_aBKRp)%2)==0 then
   VF1lOTRBZ[mBpYZq[RzmkIYgs]].v=ZzzE8J[gSr9E8WiVG]
   gSr9E8WiVG=gSr9E8WiVG-1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(47+20-20) then
   gSr9E8WiVG=gSr9E8WiVG-mBpYZq[RzmkIYgs]
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=100 then
   if op<=50 then
   if op<=48 then
   if op==(48*4/4) and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   ZzzE8J[gSr9E8WiVG+1]=Gcag65Z[mBpYZq[RzmkIYgs]].v
   gSr9E8WiVG=gSr9E8WiVG+1
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=49 then
   if op==(49-0) then
   local FtwUOF=ZzzE8J[gSr9E8WiVG]
   ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG-1]
   ZzzE8J[gSr9E8WiVG-1]=FtwUOF
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(50+42-42) and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   do local vmuyArc=xB9DAXxNxod(Awf9mm,RzjNnlne[mBpYZq[RzmkIYgs]]) gSr9E8WiVG=gSr9E8WiVG+1 ZzzE8J[gSr9E8WiVG]=vmuyArc end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==100 and ((E2ioq5piPm8*E2ioq5piPm8+E2ioq5piPm8)%2)==0 then
   do local _d=1+1 ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG] end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=101 then
   if op==101 and ((7*bn_aBKRp*bn_aBKRp)+bn_aBKRp)%2==0 then
   do local _d=1+1 ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG] end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==102 and (((E2ioq5piPm8*E2ioq5piPm8)-E2ioq5piPm8)%2)==0 then
   do local _d=1+1 ZzzE8J[gSr9E8WiVG]=ZzzE8J[gSr9E8WiVG] end
   else
   error("|Q$Q<}A>X{X#}QQ~ZA!<$@?Q**&@".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
  end
 end
 local L918DKUi=Dm7cuo(...)
 return m8D4UkM5iT(m8D4UkM5iT_decode(),1,_G,{},L918DKUi,nil)
end)(aUr6X51b0)