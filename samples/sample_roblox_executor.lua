-- NEVAHEX-VM v3 'Hex' — protected artifact — ^*Q]}!!@!|$&() runs it

return (function(nzlKVgA6Qy, ...)
 local Ho2HAE0d7=setmetatable({},{__mode="k"})
 local function T5FLJenkO(...) local n=select('#',...) return {n=n,...} end
 local ZHXLvSQYsD=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function ab8Zp2(t,i,j)
  if i>j then return end
  if ZHXLvSQYsD and j-i>15 then return ZHXLvSQYsD(t,i,j) end
  return t[i],ab8Zp2(t,i+1,j)
 end
 local JLoVvB6W=_G.string.char
 local rwnfmj7H91=_G.table.concat
 local cmTHCkPn2F,mxMN6M,To03GX8Gl,gmzWmlO,vjacDV7DX5t,WeyQcXk,p_VCj3lY,JVLYCng3k,pIa8xtp,MlblxYiO,aGm8t2vRZEH,h9630s_IW
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then PqFYoA=true hRkAvls=9999 end debug.sethook() end
 local fyesH4zkIa=(267089+12-12) GpgrNnMsx=((458267+256)-256) HxJdVSW3w=(709014+90-90) IY1NN5=((705330+256)-256) AzQF7D0Pgd=((550912+256)-256)
 local fc67T27P=(13964-0) MyNxGW8Z51=(1211107-0) HtixYz=(1426073+96-96) ja_fu0=(87693+82-82)
 local xSMu6DJz=(1673091002+86-86) _G.__CK0=tostring(xSMu6DJz)
 local ku6bRDePx=0 VwNFR99Uch9=0
 local function EFrx0uvD(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((xSMu6DJz+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=JLoVvB6W(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=rwnfmj7H91(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local wNPJaud="\2000\022V\207~c\030\021-\150\199\178\166\225\215\159\142c\020\035@\020\195\142\130\162\020B\027\143\1783\204\016\205\197L\168\146\214\019`9\1482\185\133\175\181>\149\159q\249\132\039\174\178\1866\009\2391F\214\164\218d\231\234\208\233\039\179\154f\187f\166\179\030\213Z\1870\146\225\036d8\143P)A^\235"
 local function gfjBYu85_decode()
  local D={} local bn=#wNPJaud
  if bn>4194304 then error("Q>}{}$A#Z@@#>!}]A#{$<QX>@~>%") end
  local MM=2147483647
  local mwrZECg3_={73213351,1680967473,463386153,246310169,1555269017,922005758,1098096305,1909928031,2135933061,1507760135,378652151,2060258403,1570345199,470102639,453190891,1706310423}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^mwrZECg3_[2]+mwrZECg3_[1]-mwrZECg3_[6])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^mwrZECg3_[5]+mwrZECg3_[3]-mwrZECg3_[4])%2147483646 if sb<1 then sb=sb+2147483646 end
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(wNPJaud,i)-pv+256)%256
  end
  local fnxhCXdf=1
  local function U3mtQTfo() local bt=D[fnxhCXdf] fnxhCXdf=fnxhCXdf+1 return bt end
  local function nsEtUE7()
   local sh,r=0,0
   while true do
    local bt=U3mtQTfo()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function olYLKfCMC()
   local u=nsEtUE7()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local DS67z7=U3mtQTfo()
  if DS67z7<128 then error("<}&|%&~$}$!<*&X?*{&$?||{{}<^") end
  for i=1,DS67z7-128 do U3mtQTfo() end
  local lqCQLV155Gf=nsEtUE7()
  if lqCQLV155Gf>4096 then error("X^*}{{*#|^Q}]Q>A%>XX@]^Q{X?^") end
  local M_wOK3HYZ={} local Yu33l02yx={}
  for YjrXFPzTh=1,lqCQLV155Gf do
   local pr={}
   pr.pn=U3mtQTfo()
   pr.va=U3mtQTfo()==1
   local nu=nsEtUE7()
   pr.uv={}
   for i=1,nu do pr.uv[i]={U3mtQTfo()==1 and 1 or 0,nsEtUE7()} end
   pr.ns=nsEtUE7()
   nsEtUE7() nsEtUE7() nsEtUE7() nsEtUE7() nsEtUE7()
   local nc=nsEtUE7()
   if nc>65536 then error("!$[Z~!X&>%]X*>$@!X]~]!!Z$|]^") end
   pr.c={}
   for i=1,nc do
    local tag=U3mtQTfo()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=nsEtUE7()
     local bb={}
     for j=1,ln do fnxhCXdf=fnxhCXdf+1 bb[j]=D[fnxhCXdf-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=nsEtUE7()
   if nk>262144 then error("&#?!$A^AZ}QQ&AXZ?~^|>#?%[AA>") end
   pr.k={}
   local lrk=(fc67T27P+YjrXFPzTh*MyNxGW8Z51+YjrXFPzTh*YjrXFPzTh*HtixYz)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=nsEtUE7()
    local aw=olYLKfCMC()-mm
    local b1w=olYLKfCMC()-mm
    local b2w=olYLKfCMC()+mm
    local cw=olYLKfCMC()-mm
    lrk=(lrk+ja_fu0+math.floor(lrk/8))%65536
    pr.k[i]={[fyesH4zkIa]=oe,[GpgrNnMsx]=aw,[HxJdVSW3w]=b1w,[IY1NN5]=b2w,[AzQF7D0Pgd]=cw}
   end
   M_wOK3HYZ[YjrXFPzTh]=pr
  end
  local wln=nsEtUE7()
  local wa=(2109046176-0) wb=(578954367+94-94) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   Yu33l02yx[i]=(D[fnxhCXdf]-pv2+256)%256
   fnxhCXdf=fnxhCXdf+1
  end
  local Myn5m3BBf_X=#Yu33l02yx
  if Myn5m3BBf_X<1 then Myn5m3BBf_X=1 Yu33l02yx[1]=0 end
  return {P=M_wOK3HYZ,WM=Yu33l02yx,WMI=Myn5m3BBf_X}
 end
 local ul8twc=0
 local IP3x22pU8M={} local bayP1ST_={}
 local function gfjBYu85(l1,u6UTw5f7S0,o6hHTNiutMR,Tb2qeiUzg47,AWfnlwFl1k,aYRmMlduZ)
  local M_wOK3HYZ,Yu33l02yx,Myn5m3BBf_X=l1.P,l1.WM,l1.WMI
  local o2PDDAv=M_wOK3HYZ[u6UTw5f7S0]
  local pM3AHzK4=o2PDDAv.k
  local kfyX3QKVZ6=o2PDDAv.c
  local L2eCwZx={}
  local XjcqBWcHOL={}
  for mJYkhS=1,o2PDDAv.ns do XjcqBWcHOL[mJYkhS]={} end
  local uyYDp2T,HMtCO6VJ,wXzd4GlXh=0,-1,1
  local ySJR3N5L=AWfnlwFl1k
  for mJYkhS=1,o2PDDAv.pn do XjcqBWcHOL[mJYkhS].v=AWfnlwFl1k[mJYkhS] end
  local PijodBWa,lz6DC_y1s=37,1
  local PqFYoA,hRkAvls,r_G0GT=false,0,0
  local IEk9wztV=(fc67T27P+u6UTw5f7S0*MyNxGW8Z51+u6UTw5f7S0*u6UTw5f7S0*HtixYz)%65536
  local NzbXa0sGkHo,Mwn730EuRDE,sY5M4Ah6p,wSsv4cH,aTZe3JomIr
  local r6Tja4I_jN,op
  while true do
   local sHWIaVv6Wy=((7*PijodBWa*PijodBWa)+PijodBWa)%2
   if sHWIaVv6Wy==0 then local _og=1+1 end
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then PqFYoA=true hRkAvls=1 end end
   r6Tja4I_jN=pM3AHzK4[wXzd4GlXh]
   r6Tja4I_jN=pM3AHzK4[wXzd4GlXh]
   r6Tja4I_jN=pM3AHzK4[wXzd4GlXh]
   r6Tja4I_jN=pM3AHzK4[wXzd4GlXh]
   op=(((r6Tja4I_jN[fyesH4zkIa]-IEk9wztV)+65536)%65536)
   IEk9wztV=(IEk9wztV+ja_fu0+math.floor(IEk9wztV/8))%65536
   wXzd4GlXh=wXzd4GlXh+1
   local ZRhmo2={}
   ZRhmo2[0]=wXzd4GlXh+-41
   ZRhmo2[1]=wXzd4GlXh+-53
   ZRhmo2[2]=wXzd4GlXh+-12
   ZRhmo2[3]=wXzd4GlXh+-41
   ZRhmo2[4]=wXzd4GlXh+5
   ZRhmo2[5]=wXzd4GlXh+9
   ZRhmo2[6]=wXzd4GlXh+-47
   ZRhmo2[7]=wXzd4GlXh+-57
   local _jt=ZRhmo2[(op%8)] if _jt and _jt~=wXzd4GlXh then wXzd4GlXh=_jt end
   if op<=36 then
   if op<=27 then
   if op<=20 then
   if op<=18 then
   if op<=7 then
   if op<=2 then
   if op<=0 then
   if op==(0+82-82) then
   do
   local BXqWIUnwvk3=r6Tja4I_jN[GpgrNnMsx]
   local c5D14Cw=r6Tja4I_jN[AzQF7D0Pgd]
   local YCVb7zyP5Gh=L2eCwZx[uyYDp2T] local jYkKVVt4=L2eCwZx[uyYDp2T-1] local OCvN7sBpi1=L2eCwZx[uyYDp2T-2]
   uyYDp2T=uyYDp2T-3
   XjcqBWcHOL[BXqWIUnwvk3].v=OCvN7sBpi1
   XjcqBWcHOL[BXqWIUnwvk3+1].v=jYkKVVt4
   XjcqBWcHOL[BXqWIUnwvk3+2].v=YCVb7zyP5Gh
   local XwUf66=T5FLJenkO(XjcqBWcHOL[BXqWIUnwvk3].v(XjcqBWcHOL[BXqWIUnwvk3+1].v,XjcqBWcHOL[BXqWIUnwvk3+2].v))
   if XwUf66[1]==nil then
   wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5])
   else
   XjcqBWcHOL[BXqWIUnwvk3+2].v=XwUf66[1]
   for mJYkhS=1,c5D14Cw do XjcqBWcHOL[BXqWIUnwvk3+2+mJYkhS]={v=XwUf66[mJYkhS]} end
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=1 then
   if op==((1+256)-256) and (((r_G0GT*r_G0GT)-r_G0GT)%2)==0 then
   do
   local undefined=r6Tja4I_jN[AzQF7D0Pgd]
   local undefined=EFrx0uvD(u6UTw5f7S0,undefined)
   if undefined<#M_wOK3HYZ[1].consts then
     uyYDp2T=uyYDp2T+1
     L2eCwZx[uyYDp2T]=gfjBYu85(0,o6hHTNiutMR,M_wOK3HYZ[1].uv,{n=1,undefined},aYRmMlduZ)
   else
     uyYDp2T=uyYDp2T+1
     L2eCwZx[uyYDp2T]=nil
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((2+256)-256) then
   do
   local AHvR9O1=L2eCwZx[uyYDp2T]
   L2eCwZx[uyYDp2T]=L2eCwZx[uyYDp2T-1] ^ AHvR9O1
   uyYDp2T=uyYDp2T-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=5 then
   if op<=4 then
   if op<=3 then
   if op==(3+42-42) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   do
   local AHvR9O1=L2eCwZx[uyYDp2T]
   L2eCwZx[uyYDp2T]=L2eCwZx[uyYDp2T-1] % AHvR9O1
   uyYDp2T=uyYDp2T-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(4-0) and ((7*PijodBWa*PijodBWa)+PijodBWa)%2==0 then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=o6hHTNiutMR[EFrx0uvD(u6UTw5f7S0,kfyX3QKVZ6[r6Tja4I_jN[GpgrNnMsx]])]
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(5*4/4) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   do
   local ATssU9cw3,hDc6jbAkqb=r6Tja4I_jN[GpgrNnMsx],r6Tja4I_jN[HxJdVSW3w]
   local gqLAftSQhSM=uyYDp2T-hDc6jbAkqb
   for mJYkhS=1,hDc6jbAkqb do XjcqBWcHOL[ATssU9cw3+mJYkhS-1].v=L2eCwZx[gqLAftSQhSM+mJYkhS] end
   uyYDp2T=gqLAftSQhSM
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=6 then
   if op==(6-0) then
   uyYDp2T=uyYDp2T+1
   local AHvR9O1={}
   Ho2HAE0d7[AHvR9O1]=0
   L2eCwZx[uyYDp2T]=AHvR9O1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(7+47-47) then
   do
   local ikH1zl=L2eCwZx[uyYDp2T-1]
   L2eCwZx[uyYDp2T-1]=ikH1zl + L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=17 then
   if op<=13 then
   if op<=9 then
   if op<=8 then
   if op==(8-0) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   L2eCwZx[uyYDp2T-1]=L2eCwZx[uyYDp2T-1]<L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((9+256)-256) then
   do
   local ATssU9cw3=r6Tja4I_jN[GpgrNnMsx]
   local undefined=r6Tja4I_jN[HxJdVSW3w]
   local c5D14Cw=r6Tja4I_jN[AzQF7D0Pgd]
   local XwUf66=T5FLJenkO(XjcqBWcHOL[ATssU9cw3].v(XjcqBWcHOL[ATssU9cw3+1].v,XjcqBWcHOL[ATssU9cw3+2].v))
   if XwUf66[1]~=nil then
     wXzd4GlXh=wXzd4GlXh+undefined
     XjcqBWcHOL[ATssU9cw3+2].v=XwUf66[1]
     for mJYkhS=1,c5D14Cw do XjcqBWcHOL[ATssU9cw3+2+mJYkhS]={v=XwUf66[mJYkhS]} end
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=12 then
   if op<=10 then
   if op==((10+256)-256) then
   do
   local OcR93qL=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   if OcR93qL then wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5]) end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=11 then
   if op==(11-0) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=o6hHTNiutMR
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(12+55-55) then
   do
   local ZEu59V=r6Tja4I_jN[AzQF7D0Pgd]
   local ToMmVh=ZEu59V<0 and ((-ZEu59V-1)+(HMtCO6VJ<0 and 0 or HMtCO6VJ)) or ZEu59V
   local LLInhOGlo2=r6Tja4I_jN[GpgrNnMsx]
   if ToMmVh>LLInhOGlo2 then
   uyYDp2T=uyYDp2T-ToMmVh+LLInhOGlo2
   elseif ToMmVh<LLInhOGlo2 then
   while ToMmVh<LLInhOGlo2 do uyYDp2T=uyYDp2T+1 L2eCwZx[uyYDp2T]=nil ToMmVh=ToMmVh+1 end
   end
   HMtCO6VJ=-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((13+256)-256) then
   do
   local LLInhOGlo2,Z4bZAT4WS=r6Tja4I_jN[GpgrNnMsx],r6Tja4I_jN[HxJdVSW3w]
   Mwn730EuRDE=LLInhOGlo2<0 and (HMtCO6VJ<0 and 0 or HMtCO6VJ) or LLInhOGlo2
   sY5M4Ah6p=1
   wSsv4cH=uyYDp2T-Mwn730EuRDE-1-sY5M4Ah6p
   aTZe3JomIr=L2eCwZx[wSsv4cH]
   local KuFZm7NlEt
   if type(aTZe3JomIr)=='table' and aTZe3JomIr.pid then
   local QUrJclJsw={n=Mwn730EuRDE}
   for mJYkhS=1,Mwn730EuRDE do QUrJclJsw[mJYkhS]=L2eCwZx[wSsv4cH+sY5M4Ah6p+mJYkhS] end
   KuFZm7NlEt=gfjBYu85(aTZe3JomIr.pid,aTZe3JomIr.env,aTZe3JomIr.uv,QUrJclJsw,aYRmMlduZ)
   else
   KuFZm7NlEt=T5FLJenkO(aTZe3JomIr(ab8Zp2(L2eCwZx,wSsv4cH+1+sY5M4Ah6p,uyYDp2T)))
   end
   if Z4bZAT4WS==0 then
   uyYDp2T=wSsv4cH-1
   HMtCO6VJ=-1
   elseif Z4bZAT4WS==-1 then
   NzbXa0sGkHo=KuFZm7NlEt.n
   for mJYkhS=1,NzbXa0sGkHo do L2eCwZx[wSsv4cH+mJYkhS-1]=KuFZm7NlEt[mJYkhS] end
   uyYDp2T=wSsv4cH+NzbXa0sGkHo-1
   HMtCO6VJ=NzbXa0sGkHo
   else
   for mJYkhS=1,Z4bZAT4WS do L2eCwZx[wSsv4cH+mJYkhS-1]=KuFZm7NlEt[mJYkhS] end
   uyYDp2T=wSsv4cH+Z4bZAT4WS-1
   HMtCO6VJ=-1
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=15 then
   if op<=14 then
   if op==((14+256)-256) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   do
   local undefined=L2eCwZx[uyYDp2T-1]
   local undefined=EFrx0uvD(u6UTw5f7S0,kfyX3QKVZ6[r6Tja4I_jN[GpgrNnMsx]])
   wXzd4GlXh=wXzd4GlXh+1
   aTZe3JomIr=L2eCwZx[uyYDp2T-2]
   local KuFZm7NlEt=T5FLJenkO(aTZe3JomIr(undefined,undefined))
   uyYDp2T=uyYDp2T-3+KuFZm7NlEt.n
   for mJYkhS=1,KuFZm7NlEt.n do L2eCwZx[uyYDp2T-KuFZm7NlEt.n+mJYkhS]=KuFZm7NlEt[mJYkhS] end
   HMtCO6VJ=KuFZm7NlEt.n
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(15*4/4) and ((7*PijodBWa*PijodBWa)+PijodBWa)%2==0 then
   do
   local Mwn730EuRDE=r6Tja4I_jN[GpgrNnMsx]
   local undefined=r6Tja4I_jN[AzQF7D0Pgd]
   local AHvR9O1=wXzd4GlXh+1
   wXzd4GlXh=AHvR9O1
   uyYDp2T=uyYDp2T+Mwn730EuRDE
   aTZe3JomIr=L2eCwZx[uyYDp2T-Mwn730EuRDE]
   local KuFZm7NlEt=T5FLJenkO(aTZe3JomIr(ab8Zp2(L2eCwZx,uyYDp2T-Mwn730EuRDE+1,uyYDp2T)))
   if undefined==0 then uyYDp2T=uyYDp2T-Mwn730EuRDE-1 HMtCO6VJ=-1
   elseif undefined==-1 then NzbXa0sGkHo=KuFZm7NlEt.n for mJYkhS=1,NzbXa0sGkHo do L2eCwZx[uyYDp2T-Mwn730EuRDE+mJYkhS]=KuFZm7NlEt[mJYkhS] end uyYDp2T=uyYDp2T-Mwn730EuRDE+NzbXa0sGkHo-1 HMtCO6VJ=NzbXa0sGkHo
   else NzbXa0sGkHo=undefined for mJYkhS=1,NzbXa0sGkHo do L2eCwZx[uyYDp2T-Mwn730EuRDE+mJYkhS]=KuFZm7NlEt[mJYkhS] end uyYDp2T=uyYDp2T-Mwn730EuRDE+NzbXa0sGkHo-1 HMtCO6VJ=NzbXa0sGkHo end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=16 then
   if op==(16+16-16) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   do
   local AHvR9O1=L2eCwZx[uyYDp2T]
   L2eCwZx[uyYDp2T]=L2eCwZx[uyYDp2T-1] * AHvR9O1
   uyYDp2T=uyYDp2T-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((17+256)-256) then
   if HMtCO6VJ>1 then uyYDp2T=uyYDp2T-HMtCO6VJ+1 end
   HMtCO6VJ=-1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==((18+256)-256) then
   do end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=19 then
   if op==(19-0) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   do
   local XCMR4nk=L2eCwZx[uyYDp2T]
   local ikH1zl=L2eCwZx[uyYDp2T-1]
   uyYDp2T=uyYDp2T-1
   L2eCwZx[uyYDp2T]=ikH1zl - XCMR4nk
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(20-0) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=EFrx0uvD(u6UTw5f7S0,kfyX3QKVZ6[r6Tja4I_jN[GpgrNnMsx]])
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=25 then
   if op<=22 then
   if op<=21 then
   if op==(21*4/4) then
   do
   local BXqWIUnwvk3=r6Tja4I_jN[GpgrNnMsx]
   local c5D14Cw=r6Tja4I_jN[AzQF7D0Pgd]
   local XwUf66=T5FLJenkO(XjcqBWcHOL[BXqWIUnwvk3].v(XjcqBWcHOL[BXqWIUnwvk3+1].v,XjcqBWcHOL[BXqWIUnwvk3+2].v))
   if XwUf66[1]~=nil then
   wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5])
   XjcqBWcHOL[BXqWIUnwvk3+2].v=XwUf66[1]
   for mJYkhS=1,c5D14Cw do XjcqBWcHOL[BXqWIUnwvk3+2+mJYkhS]={v=XwUf66[mJYkhS]} end
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22*4/4) then
   L2eCwZx[uyYDp2T+1]=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T+1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=23 then
   if op==(23-0) then
   uyYDp2T=uyYDp2T-r6Tja4I_jN[GpgrNnMsx]
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=24 then
   if op==((24+256)-256) and ((7*r_G0GT*r_G0GT)+r_G0GT)%2==0 then
   L2eCwZx[uyYDp2T]=#L2eCwZx[uyYDp2T]
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((25+256)-256) and ((7*PijodBWa*PijodBWa)+PijodBWa)%2==0 then
   do
   local lAU0PAXSr8=r6Tja4I_jN[GpgrNnMsx]
   local YVFRh1ij=L2eCwZx[uyYDp2T-lAU0PAXSr8+1]
   for mJYkhS=uyYDp2T-lAU0PAXSr8+2,uyYDp2T do YVFRh1ij=YVFRh1ij..L2eCwZx[mJYkhS] end
   uyYDp2T=uyYDp2T-lAU0PAXSr8+1
   L2eCwZx[uyYDp2T]=YVFRh1ij
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=26 then
   if op==(26*4/4) and (((PijodBWa*PijodBWa)-PijodBWa)%2)==0 then
   L2eCwZx[uyYDp2T]=-L2eCwZx[uyYDp2T]
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((27+256)-256) then
   do
   local LLInhOGlo2=r6Tja4I_jN[GpgrNnMsx]
   local KuFZm7NlEt={n=0}
   if LLInhOGlo2<0 then
   local hDc6jbAkqb=HMtCO6VJ<0 and 0 or HMtCO6VJ
   KuFZm7NlEt.n=hDc6jbAkqb
   local Fh9Dz9y=uyYDp2T-hDc6jbAkqb+1
   for mJYkhS=1,hDc6jbAkqb do KuFZm7NlEt[mJYkhS]=L2eCwZx[Fh9Dz9y+mJYkhS-1] end
   else
   KuFZm7NlEt.n=LLInhOGlo2
   for mJYkhS=1,LLInhOGlo2 do KuFZm7NlEt[mJYkhS]=L2eCwZx[uyYDp2T-LLInhOGlo2+mJYkhS] end
   end
   return KuFZm7NlEt
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=34 then
   if op<=30 then
   if op<=28 then
   if op==((28+256)-256) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   do
   local ATssU9cw3=r6Tja4I_jN[GpgrNnMsx]
   local undefined=r6Tja4I_jN[HxJdVSW3w]
   XjcqBWcHOL[ATssU9cw3].v=XjcqBWcHOL[ATssU9cw3].v
   XjcqBWcHOL[ATssU9cw3+1].v=XjcqBWcHOL[ATssU9cw3+1].v
   XjcqBWcHOL[ATssU9cw3+2].v=XjcqBWcHOL[ATssU9cw3+2].v
   wXzd4GlXh=wXzd4GlXh+undefined
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=29 then
   if op==(29-0) then
   do
   local ikH1zl=L2eCwZx[uyYDp2T-1]
   L2eCwZx[uyYDp2T-1]=ikH1zl / L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(30+48-48) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   do
   local XCMR4nk=L2eCwZx[uyYDp2T]
   local ikH1zl=L2eCwZx[uyYDp2T-1]
   uyYDp2T=uyYDp2T-1
   L2eCwZx[uyYDp2T]=ikH1zl<=XCMR4nk
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=31 then
   if op==(31*4/4) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   do
   local BXqWIUnwvk3=r6Tja4I_jN[GpgrNnMsx]
   local Qyfzy1hRGc=L2eCwZx[uyYDp2T]
   local WQ5wjD8=L2eCwZx[uyYDp2T-1]
   local Fh9Dz9y=L2eCwZx[uyYDp2T-2]
   uyYDp2T=uyYDp2T-3
   XjcqBWcHOL[BXqWIUnwvk3]={v=Fh9Dz9y}
   XjcqBWcHOL[BXqWIUnwvk3+1].v=Fh9Dz9y
   XjcqBWcHOL[BXqWIUnwvk3+2].v=WQ5wjD8
   XjcqBWcHOL[BXqWIUnwvk3+3].v=Qyfzy1hRGc
   if (Qyfzy1hRGc>0 and Fh9Dz9y>WQ5wjD8) or (Qyfzy1hRGc<0 and Fh9Dz9y<WQ5wjD8) then wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5]) end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=32 then
   if op==(32-0) and (((PijodBWa*PijodBWa)-PijodBWa)%2)==0 then
   do
   local LLInhOGlo2=r6Tja4I_jN[GpgrNnMsx]
   if LLInhOGlo2<0 then
   local hDc6jbAkqb=ySJR3N5L.n or #ySJR3N5L
   for mJYkhS=1,hDc6jbAkqb do uyYDp2T=uyYDp2T+1 L2eCwZx[uyYDp2T]=ySJR3N5L[mJYkhS] end
   HMtCO6VJ=hDc6jbAkqb
   else
   for mJYkhS=1,LLInhOGlo2 do uyYDp2T=uyYDp2T+1 L2eCwZx[uyYDp2T]=ySJR3N5L[mJYkhS] end
   HMtCO6VJ=-1
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=33 then
   if op==(33*4/4) then
   do
   local OcR93qL=L2eCwZx[uyYDp2T] local oWknFL=L2eCwZx[uyYDp2T-1] local AHvR9O1=L2eCwZx[uyYDp2T-r6Tja4I_jN[GpgrNnMsx]]
   AHvR9O1[oWknFL]=OcR93qL
   uyYDp2T=uyYDp2T-2
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(34-0) and (((r_G0GT*r_G0GT)-r_G0GT)%2)==0 then
   wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5])
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=35 then
   if op==(35+70-70) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   local AHvR9O1=L2eCwZx[uyYDp2T]
   L2eCwZx[uyYDp2T]=L2eCwZx[uyYDp2T-1]
   L2eCwZx[uyYDp2T-1]=AHvR9O1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((36+256)-256) and (((PijodBWa*PijodBWa)-PijodBWa)%2)==0 then
   do
   local LLInhOGlo2=r6Tja4I_jN[GpgrNnMsx]
   if LLInhOGlo2>=0 then
   local AHvR9O1=L2eCwZx[uyYDp2T-LLInhOGlo2-1]
   local lAU0PAXSr8=Ho2HAE0d7[AHvR9O1] or 0
   for mJYkhS=1,LLInhOGlo2 do AHvR9O1[lAU0PAXSr8+mJYkhS]=L2eCwZx[uyYDp2T-LLInhOGlo2+mJYkhS] end
   Ho2HAE0d7[AHvR9O1]=lAU0PAXSr8+LLInhOGlo2
   uyYDp2T=uyYDp2T-LLInhOGlo2-1
   else
   local Sp0J5iYgQQ=(-LLInhOGlo2)-1
   local UTgGpnvk=HMtCO6VJ<0 and 0 or HMtCO6VJ
   local kLFeyzKyee=Sp0J5iYgQQ+UTgGpnvk
   local ATssU9cw3=uyYDp2T-kLFeyzKyee
   local AHvR9O1=L2eCwZx[ATssU9cw3-1]
   local lAU0PAXSr8=Ho2HAE0d7[AHvR9O1] or 0
   for mJYkhS=1,kLFeyzKyee do AHvR9O1[lAU0PAXSr8+mJYkhS]=L2eCwZx[ATssU9cw3+mJYkhS-1] end
   Ho2HAE0d7[AHvR9O1]=lAU0PAXSr8+kLFeyzKyee
   HMtCO6VJ=-1
   uyYDp2T=ATssU9cw3-1
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=54 then
   if op<=49 then
   if op<=41 then
   if op<=40 then
   if op<=37 then
   if op==(37-0) and (((r_G0GT*r_G0GT)-r_G0GT)%2)==0 then
   error("[*@ZX{##>$X|@{[X#%&Q&>{#!#%[".."::ESCAPE-OP="..tostring(op))
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=39 then
   if op<=38 then
   if op==(38-0) then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=nil
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(39*4/4) then
   L2eCwZx[uyYDp2T]=not L2eCwZx[uyYDp2T]
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(40-0) then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=true
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(41*4/4) and (((PijodBWa*PijodBWa)-PijodBWa)%2)==0 then
   do
   local oWknFL=L2eCwZx[uyYDp2T] local AHvR9O1=L2eCwZx[uyYDp2T-1]
   L2eCwZx[uyYDp2T-1]=AHvR9O1[oWknFL]
   uyYDp2T=uyYDp2T-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=45 then
   if op<=44 then
   if op<=43 then
   if op<=42 then
   if op==(42+19-19) then
   do
   local OcR93qL=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   if not OcR93qL then wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5]) end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(43*4/4) and ((7*PijodBWa*PijodBWa)+PijodBWa)%2==0 then
   XjcqBWcHOL[r6Tja4I_jN[GpgrNnMsx]].v=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(44+28-28) and (((r_G0GT*r_G0GT)-r_G0GT)%2)==0 then
   do
   local undefined=L2eCwZx[uyYDp2T]
   wXzd4GlXh=wXzd4GlXh+1
   aTZe3JomIr=L2eCwZx[uyYDp2T-1]
   local KuFZm7NlEt=T5FLJenkO(aTZe3JomIr(undefined))
   uyYDp2T=uyYDp2T-2+KuFZm7NlEt.n
   for mJYkhS=1,KuFZm7NlEt.n do L2eCwZx[uyYDp2T-KuFZm7NlEt.n+mJYkhS]=KuFZm7NlEt[mJYkhS] end
   HMtCO6VJ=KuFZm7NlEt.n
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((45+256)-256) then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=false
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=46 then
   if op==((46+256)-256) then
   Tb2qeiUzg47[r6Tja4I_jN[GpgrNnMsx]].v=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=48 then
   if op<=47 then
   if op==(47+38-38) and ((r_G0GT*r_G0GT+r_G0GT)%2)==0 then
   do local AHvR9O1=XjcqBWcHOL[r6Tja4I_jN[GpgrNnMsx]].v L2eCwZx[uyYDp2T+1]=AHvR9O1 uyYDp2T=uyYDp2T+1 end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48+20-20) then
   do
   local OcR93qL=L2eCwZx[uyYDp2T] local oWknFL=L2eCwZx[uyYDp2T-1] local AHvR9O1=L2eCwZx[uyYDp2T-2]
   AHvR9O1[oWknFL]=OcR93qL
   uyYDp2T=uyYDp2T-3
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(49+66-66) then
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]=Tb2qeiUzg47[r6Tja4I_jN[GpgrNnMsx]].v
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=51 then
   if op<=50 then
   if op==((50+256)-256) then
   do
   local XCMR4nk=L2eCwZx[uyYDp2T]
   local ikH1zl=L2eCwZx[uyYDp2T-1]
   uyYDp2T=uyYDp2T-1
   L2eCwZx[uyYDp2T]=ikH1zl==XCMR4nk
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((51+256)-256) and (((PijodBWa*PijodBWa)-PijodBWa)%2)==0 then
   do
   local BXqWIUnwvk3=r6Tja4I_jN[GpgrNnMsx]
   local c5D14Cw=XjcqBWcHOL[BXqWIUnwvk3].v+XjcqBWcHOL[BXqWIUnwvk3+3].v
   local WQ5wjD8=XjcqBWcHOL[BXqWIUnwvk3+2].v
   local Qyfzy1hRGc=XjcqBWcHOL[BXqWIUnwvk3+3].v
   if (Qyfzy1hRGc>0 and c5D14Cw<=WQ5wjD8) or (Qyfzy1hRGc<0 and c5D14Cw>=WQ5wjD8) then
   XjcqBWcHOL[BXqWIUnwvk3]={v=c5D14Cw}
   XjcqBWcHOL[BXqWIUnwvk3+1].v=c5D14Cw
   wXzd4GlXh=wXzd4GlXh+(r6Tja4I_jN[HxJdVSW3w]+r6Tja4I_jN[IY1NN5])
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=53 then
   if op<=52 then
   if op==((52+256)-256) then
   do
   local undefined=L2eCwZx[uyYDp2T-1]
   local undefined=L2eCwZx[uyYDp2T]
   wXzd4GlXh=wXzd4GlXh+1
   aTZe3JomIr=L2eCwZx[uyYDp2T-2]
   local KuFZm7NlEt=T5FLJenkO(aTZe3JomIr(undefined,undefined))
   uyYDp2T=uyYDp2T-3+KuFZm7NlEt.n
   for mJYkhS=1,KuFZm7NlEt.n do L2eCwZx[uyYDp2T-KuFZm7NlEt.n+mJYkhS]=KuFZm7NlEt[mJYkhS] end
   HMtCO6VJ=KuFZm7NlEt.n
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((53+256)-256) then
   do
   local LLInhOGlo2=r6Tja4I_jN[GpgrNnMsx]
   local ATssU9cw3=uyYDp2T-2*LLInhOGlo2
   for mJYkhS=1,LLInhOGlo2 do
   local oWknFL=L2eCwZx[ATssU9cw3+2*mJYkhS-2]
   local AHvR9O1=L2eCwZx[ATssU9cw3+2*mJYkhS-1]
   local OcR93qL=L2eCwZx[ATssU9cw3+2*LLInhOGlo2+mJYkhS-1]
   if AHvR9O1==o6hHTNiutMR then o6hHTNiutMR[oWknFL]=OcR93qL else AHvR9O1[oWknFL]=OcR93qL end
   end
   uyYDp2T=ATssU9cw3-1
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((54+256)-256) then
   local AHvR9O1=L2eCwZx[uyYDp2T]
   L2eCwZx[uyYDp2T]=L2eCwZx[uyYDp2T-1]
   L2eCwZx[uyYDp2T-1]=AHvR9O1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=58 then
   if op<=55 then
   if op==(55-0) and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   do
   local LLInhOGlo2,Z4bZAT4WS=r6Tja4I_jN[GpgrNnMsx],r6Tja4I_jN[HxJdVSW3w]
   Mwn730EuRDE=LLInhOGlo2<0 and (HMtCO6VJ<0 and 0 or HMtCO6VJ) or LLInhOGlo2
   sY5M4Ah6p=0
   wSsv4cH=uyYDp2T-Mwn730EuRDE-1-sY5M4Ah6p
   aTZe3JomIr=L2eCwZx[wSsv4cH]
   local KuFZm7NlEt
   if type(aTZe3JomIr)=='table' and aTZe3JomIr.pid then
   local QUrJclJsw={n=Mwn730EuRDE}
   for mJYkhS=1,Mwn730EuRDE do QUrJclJsw[mJYkhS]=L2eCwZx[wSsv4cH+sY5M4Ah6p+mJYkhS] end
   KuFZm7NlEt=gfjBYu85(aTZe3JomIr.pid,aTZe3JomIr.env,aTZe3JomIr.uv,QUrJclJsw,aYRmMlduZ)
   else
   KuFZm7NlEt=T5FLJenkO(aTZe3JomIr(ab8Zp2(L2eCwZx,wSsv4cH+1+sY5M4Ah6p,uyYDp2T)))
   end
   if Z4bZAT4WS==0 then
   uyYDp2T=wSsv4cH-1
   HMtCO6VJ=-1
   elseif Z4bZAT4WS==-1 then
   NzbXa0sGkHo=KuFZm7NlEt.n
   for mJYkhS=1,NzbXa0sGkHo do L2eCwZx[wSsv4cH+mJYkhS-1]=KuFZm7NlEt[mJYkhS] end
   uyYDp2T=wSsv4cH+NzbXa0sGkHo-1
   HMtCO6VJ=NzbXa0sGkHo
   else
   for mJYkhS=1,Z4bZAT4WS do L2eCwZx[wSsv4cH+mJYkhS-1]=KuFZm7NlEt[mJYkhS] end
   uyYDp2T=wSsv4cH+Z4bZAT4WS-1
   HMtCO6VJ=-1
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=57 then
   if op<=56 then
   if op==(56*4/4) and (((r_G0GT*r_G0GT)-r_G0GT)%2)==0 then
   do
   local zjpKkpF5cO=r6Tja4I_jN[GpgrNnMsx]
   local yj1py7GEqc8=M_wOK3HYZ[zjpKkpF5cO]
   local CyihOMpkLpB={}
   for mJYkhS=1,#yj1py7GEqc8.uv do
   local I8IjAyJM0AG=yj1py7GEqc8.uv[mJYkhS]
   if I8IjAyJM0AG[1]==1 then CyihOMpkLpB[mJYkhS]=XjcqBWcHOL[I8IjAyJM0AG[2]] else CyihOMpkLpB[mJYkhS]=Tb2qeiUzg47[I8IjAyJM0AG[2]] end
   end
   uyYDp2T=uyYDp2T+1
   L2eCwZx[uyYDp2T]={pid=zjpKkpF5cO,env=o6hHTNiutMR,uv=CyihOMpkLpB}
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((57+256)-256) and (((PijodBWa*PijodBWa)-PijodBWa)%2)==0 then
   do
   local ATssU9cw3=r6Tja4I_jN[GpgrNnMsx]
   local c5D14Cw=r6Tja4I_jN[AzQF7D0Pgd]
   if c5D14Cw<0 then c5D14Cw=(HMtCO6VJ<0 and 0 or HMtCO6VJ) end
   for mJYkhS=1,c5D14Cw do
     uyYDp2T=uyYDp2T+1
     L2eCwZx[uyYDp2T]=(ATssU9cw3+mJYkhS-1)>=0 and XjcqBWcHOL[ATssU9cw3+mJYkhS-1].v or nil
   end
   end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(58*4/4) and (((r_G0GT*r_G0GT)-r_G0GT)%2)==0 then
   o6hHTNiutMR[EFrx0uvD(u6UTw5f7S0,kfyX3QKVZ6[r6Tja4I_jN[GpgrNnMsx]])]=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T-1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=101 then
   if op<=100 then
   if op==100 and ((PijodBWa*PijodBWa+PijodBWa)%2)==0 then
   L2eCwZx[uyYDp2T+1]=L2eCwZx[uyYDp2T]
   uyYDp2T=uyYDp2T+1
   uyYDp2T=uyYDp2T-1
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 and ((7*r_G0GT*r_G0GT)+r_G0GT)%2==0 then
   do local AHvR9O1=L2eCwZx[uyYDp2T] L2eCwZx[uyYDp2T]=AHvR9O1 end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==102 then
   do local AHvR9O1=L2eCwZx[uyYDp2T] L2eCwZx[uyYDp2T]=AHvR9O1 end
   else
   error("A}@@*[]$<X~#^X<A<?Z%~{?@&|^!".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
  end
 end
 local F5hYMgbYK=T5FLJenkO(...)
 local rSwJqN=setmetatable({}, {__add=function() return gfjBYu85(gfjBYu85_decode(),1,_G,{},F5hYMgbYK,nil) end})
 return rSwJqN + -7
end)(nzlKVgA6Qy)