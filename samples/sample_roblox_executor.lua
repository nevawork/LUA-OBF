-- NEVAHEX-VM v3 'Hex' — protected artifact — Z%&^X@Q@&Q]}() runs it

return (function(gTvCh4A, ...)
 local f9N16V8DZN=setmetatable({},{__mode="k"})
 local function KUYUFTkD(...) local n=select('#',...) return {n=n,...} end
 local OTHX43SCD=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function F0B_LQ0m(t,i,j)
  if i>j then return end
  if OTHX43SCD and j-i>15 then return OTHX43SCD(t,i,j) end
  return t[i],F0B_LQ0m(t,i+1,j)
 end
 local XgHplh=_G.string.char
 local BMjFOUoul=_G.table.concat
 local MUzRkucDiUj,b5fvjWvZo,hTRnlM,TOiYBCcS,VVkcVQ,haFXM4qo,jFllzrBxd3q,NKz2g0g,Enhfc5VJ,H1qRsdL,F2xnxaVH,E_Z0H1aE
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then oU9b08EQ5Lf=true mORmVrIYi1=9999 end debug.sethook() end
 local TdiJooCo5=(484169*4/4) htwK0wj=((699843+256)-256) lhcMWoBHnp3=(819746*4/4) V0w06RIHPqe=(469126+67-67) rAlN7vu=((986269+256)-256)
 local OcL442NyT=(65214-0) qyidRv7kL=(1295119-0) LSuxQS4i9Oh=((1373185+256)-256) yS2vI9RBg7x=(161729+15-15)
 local QbDsqd=(1041782041-0) _G.__CK0=tostring(QbDsqd)
 local Phrm11aHz=0 AyrV7mbrS=0
 local function bEGMiM(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((QbDsqd+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=XgHplh(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=BMjFOUoul(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local A4SZNPIE="\191\160\240\161\150\013\030D\159\184\218\241\253\013\001\204\188~\128\024iN\254Cl\141xZ,V\253\148\009p\243I?\179\025\023\006\193\230S\030Z>my\195\010\012\198tO\254\227\038\144\202\032_\176\251H\132\189\1660\031\138B\015\001\176\147=\239\232\039sU\196At\200\200\185\014c\252\243\229\015\006*\213\202\243\204y\213G\173\143\194\137\140g\222\147\012\186\025\001I\245m\237Y\180\030O\236s\186\174\150\193\135\030N"
 local function Dg4saG_decode()
  local D={} local bn=#A4SZNPIE
  if bn>4194304 then error(">^Z[[?[#^&Q&!~~*Z>ZAA%!>*~${") end
  local MM=2147483647
  local D4kHW96={698011582,1849462946,1804818623,807261938,918298473,1474136557,353565372,1612044957,1788737503,1365903985,1909374239,1244196134,1146164267,492416628,18303382,1495798192}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^D4kHW96[5]+D4kHW96[3]-D4kHW96[2])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^D4kHW96[6]+D4kHW96[1]-D4kHW96[4])%2147483646 if sb<1 then sb=sb+2147483646 end
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(A4SZNPIE,i)-pv+256)%256
  end
  local niiN1uSkt3u=1
  local function TzqK6Ze() local bt=D[niiN1uSkt3u] niiN1uSkt3u=niiN1uSkt3u+1 return bt end
  local function j86GR6L()
   local sh,r=0,0
   while true do
    local bt=TzqK6Ze()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function sGc4eykdVa()
   local u=j86GR6L()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local k6hFkX2iwu5=TzqK6Ze()
  if k6hFkX2iwu5<128 then error("|$^&|*#?Z%>[Z>A$<^&~^{*A%&Z]") end
  for i=1,k6hFkX2iwu5-128 do TzqK6Ze() end
  local O_o3pQL4M=j86GR6L()
  if O_o3pQL4M>4096 then error("Q?X@X%Z<X@A~*%[]^<}>@@$$%{<[") end
  local tE6XHsUBg={} local mowJBjRKa={}
  for dYTw6LxHm0=1,O_o3pQL4M do
   local pr={}
   pr.pn=TzqK6Ze()
   pr.va=TzqK6Ze()==1
   local nu=j86GR6L()
   pr.uv={}
   for i=1,nu do pr.uv[i]={TzqK6Ze()==1 and 1 or 0,j86GR6L()} end
   pr.ns=j86GR6L()
   j86GR6L() j86GR6L() j86GR6L() j86GR6L() j86GR6L()
   local nc=j86GR6L()
   if nc>65536 then error("!#]}!<!^@*}*?~X!@%{%*A^|&#Q^") end
   pr.c={}
   for i=1,nc do
    local tag=TzqK6Ze()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=j86GR6L()
     local bb={}
     for j=1,ln do niiN1uSkt3u=niiN1uSkt3u+1 bb[j]=D[niiN1uSkt3u-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=j86GR6L()
   if nk>262144 then error("$%%[<<A#[@X&Z&}>~X>&]%]ZZ&${") end
   pr.k={}
   local lrk=(OcL442NyT+dYTw6LxHm0*qyidRv7kL+dYTw6LxHm0*dYTw6LxHm0*LSuxQS4i9Oh)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=j86GR6L()
    local aw=sGc4eykdVa()-mm
    local b1w=sGc4eykdVa()-mm
    local b2w=sGc4eykdVa()+mm
    local cw=sGc4eykdVa()-mm
    lrk=(lrk+yS2vI9RBg7x+math.floor(lrk/8))%65536
    pr.k[i]={[TdiJooCo5]=oe,[htwK0wj]=aw,[lhcMWoBHnp3]=b1w,[V0w06RIHPqe]=b2w,[rAlN7vu]=cw}
   end
   tE6XHsUBg[dYTw6LxHm0]=pr
  end
  local wln=j86GR6L()
  local wa=(1079017067-0) wb=(526854068+81-81) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   mowJBjRKa[i]=(D[niiN1uSkt3u]-pv2+256)%256
   niiN1uSkt3u=niiN1uSkt3u+1
  end
  local iNNwNNW=#mowJBjRKa
  if iNNwNNW<1 then iNNwNNW=1 mowJBjRKa[1]=0 end
  return {P=tE6XHsUBg,WM=mowJBjRKa,WMI=iNNwNNW}
 end
 local w5ptpUr9RWH=0
 local FptlIb7sV5={} local OdDSqQ9_e={}
 local function Dg4saG(l1,uxtzyehh,JITxOm,Vttgwk90jXU,WDPLldyvgTt,uWSTG3MJ)
  local tE6XHsUBg,mowJBjRKa,iNNwNNW=l1.P,l1.WM,l1.WMI
  local HpfE1Z6jM_=tE6XHsUBg[uxtzyehh]
  local zj2kvoh2W=HpfE1Z6jM_.k
  local lEZrqn=HpfE1Z6jM_.c
  local Mtyuda={}
  local pBjtAJ4={}
  for U9AAM5r2=1,HpfE1Z6jM_.ns do pBjtAJ4[U9AAM5r2]={} end
  local fOQ9Xtq9M,arATmIze,PvYZPFp=0,-1,1
  local qMg7oe=WDPLldyvgTt
  for U9AAM5r2=1,HpfE1Z6jM_.pn do pBjtAJ4[U9AAM5r2].v=WDPLldyvgTt[U9AAM5r2] end
  local nHimwK0BcwI,KoCViJ=37,1
  local oU9b08EQ5Lf,mORmVrIYi1,s3fEXp=false,0,0
  local QbI7fIk5DuF=(OcL442NyT+uxtzyehh*qyidRv7kL+uxtzyehh*uxtzyehh*LSuxQS4i9Oh)%65536
  local dLoE4trmJU3,eoQFQnZZCp,RZz5FwtM,qMcLPgGc,EgIKhbUB1
  local fA7ml5G,op
  while true do
   local Kkssa9=((28431-0)+uxtzyehh*7919)%65536
   if Kkssa9<256 then local _nop=1+1 end
   local y7_xtDi=((7*nHimwK0BcwI*nHimwK0BcwI)+nHimwK0BcwI)%2
   if y7_xtDi==0 then local _og=1+1 end
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then oU9b08EQ5Lf=true mORmVrIYi1=1 end end
   fA7ml5G=zj2kvoh2W[PvYZPFp]
   if PvYZPFp<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(PvYZPFp).." RK="..tostring(QbI7fIk5DuF).." INS="..tostring(fA7ml5G[TdiJooCo5]).." A="..tostring(fA7ml5G[htwK0wj]).." B="..tostring(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe]).." C="..tostring(fA7ml5G[rAlN7vu]).."\n" end
   fA7ml5G=zj2kvoh2W[PvYZPFp]
   op=(((fA7ml5G[TdiJooCo5]-QbI7fIk5DuF)+65536)%65536)
   QbI7fIk5DuF=(QbI7fIk5DuF+yS2vI9RBg7x+math.floor(QbI7fIk5DuF/8))%65536
   PvYZPFp=PvYZPFp+1
   if op<=20 then
   if op<=9 then
   if op<=7 then
   if op<=1 then
   if op<=0 then
   if op==((0+256)-256) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3 ^ xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((1+256)-256) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   local InalAcc={}
   f9N16V8DZN[InalAcc]=0
   Mtyuda[fOQ9Xtq9M]=InalAcc
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=5 then
   if op<=2 then
   if op==(2-0) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3 + xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=4 then
   if op<=3 then
   if op==((3+256)-256) then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3 / xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(4+93-93) then
   pBjtAJ4[fA7ml5G[htwK0wj]].v=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(5-0) and (((nHimwK0BcwI*nHimwK0BcwI)-nHimwK0BcwI)%2)==0 then
   Mtyuda[fOQ9Xtq9M]=-Mtyuda[fOQ9Xtq9M]
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=6 then
   if op==(6-0) then
   do
   local svzAymoDZeR=fA7ml5G[htwK0wj]
   local Zk9uUqV0C7=fA7ml5G[rAlN7vu]
   local Zx2Q2RL=Mtyuda[fOQ9Xtq9M] local WwIrz3u2=Mtyuda[fOQ9Xtq9M-1] local qbDCVhrhmhN=Mtyuda[fOQ9Xtq9M-2]
   fOQ9Xtq9M=fOQ9Xtq9M-3
   pBjtAJ4[svzAymoDZeR].v=qbDCVhrhmhN
   pBjtAJ4[svzAymoDZeR+1].v=WwIrz3u2
   pBjtAJ4[svzAymoDZeR+2].v=Zx2Q2RL
   local tM74x6uD1U=KUYUFTkD(pBjtAJ4[svzAymoDZeR].v(pBjtAJ4[svzAymoDZeR+1].v,pBjtAJ4[svzAymoDZeR+2].v))
   if tM74x6uD1U[1]==nil then
   PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe])
   else
   pBjtAJ4[svzAymoDZeR+2].v=tM74x6uD1U[1]
   for U9AAM5r2=1,Zk9uUqV0C7 do pBjtAJ4[svzAymoDZeR+2+U9AAM5r2]={v=tM74x6uD1U[U9AAM5r2]} end
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((7+256)-256) and (((s3fEXp*s3fEXp)-s3fEXp)%2)==0 then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3==xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=8 then
   if op==((8+256)-256) and ((s3fEXp*s3fEXp+s3fEXp)%2)==0 then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3 - xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(9*4/4) then
   error("{}<X&||>#<<|XZ?[X}|!?#|$&]^!".."::ESCAPE-OP="..tostring(op))
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=16 then
   if op<=14 then
   if op<=11 then
   if op<=10 then
   if op==(10+17-17) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local jASI6dByFwl,GI_5kH1BZT=fA7ml5G[htwK0wj],fA7ml5G[lhcMWoBHnp3]
   eoQFQnZZCp=jASI6dByFwl<0 and (arATmIze<0 and 0 or arATmIze) or jASI6dByFwl
   RZz5FwtM=1
   qMcLPgGc=fOQ9Xtq9M-eoQFQnZZCp-1-RZz5FwtM
   EgIKhbUB1=Mtyuda[qMcLPgGc]
   local txkq8FV9DwH
   if type(EgIKhbUB1)=='table' and EgIKhbUB1.pid then
   local Y_1otah={n=eoQFQnZZCp}
   for U9AAM5r2=1,eoQFQnZZCp do Y_1otah[U9AAM5r2]=Mtyuda[qMcLPgGc+RZz5FwtM+U9AAM5r2] end
   txkq8FV9DwH=Dg4saG(EgIKhbUB1.pid,EgIKhbUB1.env,EgIKhbUB1.uv,Y_1otah,uWSTG3MJ)
   else
   txkq8FV9DwH=KUYUFTkD(EgIKhbUB1(F0B_LQ0m(Mtyuda,qMcLPgGc+1+RZz5FwtM,fOQ9Xtq9M)))
   end
   if GI_5kH1BZT==0 then
   fOQ9Xtq9M=qMcLPgGc-1
   arATmIze=-1
   elseif GI_5kH1BZT==-1 then
   dLoE4trmJU3=txkq8FV9DwH.n
   for U9AAM5r2=1,dLoE4trmJU3 do Mtyuda[qMcLPgGc+U9AAM5r2-1]=txkq8FV9DwH[U9AAM5r2] end
   fOQ9Xtq9M=qMcLPgGc+dLoE4trmJU3-1
   arATmIze=dLoE4trmJU3
   else
   for U9AAM5r2=1,GI_5kH1BZT do Mtyuda[qMcLPgGc+U9AAM5r2-1]=txkq8FV9DwH[U9AAM5r2] end
   fOQ9Xtq9M=qMcLPgGc+GI_5kH1BZT-1
   arATmIze=-1
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(11*4/4) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   do
   local Vep2g0XeYf=fA7ml5G[htwK0wj]
   local undefined=fA7ml5G[lhcMWoBHnp3]
   pBjtAJ4[Vep2g0XeYf].v=pBjtAJ4[Vep2g0XeYf].v
   pBjtAJ4[Vep2g0XeYf+1].v=pBjtAJ4[Vep2g0XeYf+1].v
   pBjtAJ4[Vep2g0XeYf+2].v=pBjtAJ4[Vep2g0XeYf+2].v
   PvYZPFp=PvYZPFp+undefined
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=13 then
   if op<=12 then
   if op==(12-0) then
   do
   local undefined=fA7ml5G[rAlN7vu]
   local undefined=bEGMiM(uxtzyehh,undefined)
   if undefined<#tE6XHsUBg[1].consts then
     fOQ9Xtq9M=fOQ9Xtq9M+1
     Mtyuda[fOQ9Xtq9M]=Dg4saG(0,JITxOm,tE6XHsUBg[1].uv,{n=1,undefined},uWSTG3MJ)
   else
     fOQ9Xtq9M=fOQ9Xtq9M+1
     Mtyuda[fOQ9Xtq9M]=nil
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(13+21-21) and (((nHimwK0BcwI*nHimwK0BcwI)-nHimwK0BcwI)%2)==0 then
   do
   local jASI6dByFwl,GI_5kH1BZT=fA7ml5G[htwK0wj],fA7ml5G[lhcMWoBHnp3]
   eoQFQnZZCp=jASI6dByFwl<0 and (arATmIze<0 and 0 or arATmIze) or jASI6dByFwl
   RZz5FwtM=0
   qMcLPgGc=fOQ9Xtq9M-eoQFQnZZCp-1-RZz5FwtM
   EgIKhbUB1=Mtyuda[qMcLPgGc]
   local txkq8FV9DwH
   if type(EgIKhbUB1)=='table' and EgIKhbUB1.pid then
   local Y_1otah={n=eoQFQnZZCp}
   for U9AAM5r2=1,eoQFQnZZCp do Y_1otah[U9AAM5r2]=Mtyuda[qMcLPgGc+RZz5FwtM+U9AAM5r2] end
   txkq8FV9DwH=Dg4saG(EgIKhbUB1.pid,EgIKhbUB1.env,EgIKhbUB1.uv,Y_1otah,uWSTG3MJ)
   else
   txkq8FV9DwH=KUYUFTkD(EgIKhbUB1(F0B_LQ0m(Mtyuda,qMcLPgGc+1+RZz5FwtM,fOQ9Xtq9M)))
   end
   if GI_5kH1BZT==0 then
   fOQ9Xtq9M=qMcLPgGc-1
   arATmIze=-1
   elseif GI_5kH1BZT==-1 then
   dLoE4trmJU3=txkq8FV9DwH.n
   for U9AAM5r2=1,dLoE4trmJU3 do Mtyuda[qMcLPgGc+U9AAM5r2-1]=txkq8FV9DwH[U9AAM5r2] end
   fOQ9Xtq9M=qMcLPgGc+dLoE4trmJU3-1
   arATmIze=dLoE4trmJU3
   else
   for U9AAM5r2=1,GI_5kH1BZT do Mtyuda[qMcLPgGc+U9AAM5r2-1]=txkq8FV9DwH[U9AAM5r2] end
   fOQ9Xtq9M=qMcLPgGc+GI_5kH1BZT-1
   arATmIze=-1
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((14+256)-256) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   do
   local Vep2g0XeYf,WweF1r=fA7ml5G[htwK0wj],fA7ml5G[lhcMWoBHnp3]
   local u9g3jNa=fOQ9Xtq9M-WweF1r
   for U9AAM5r2=1,WweF1r do pBjtAJ4[Vep2g0XeYf+U9AAM5r2-1].v=Mtyuda[u9g3jNa+U9AAM5r2] end
   fOQ9Xtq9M=u9g3jNa
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=15 then
   if op==(15-0) and (((nHimwK0BcwI*nHimwK0BcwI)-nHimwK0BcwI)%2)==0 then
   do
   local svzAymoDZeR=fA7ml5G[htwK0wj]
   local Zk9uUqV0C7=fA7ml5G[rAlN7vu]
   local tM74x6uD1U=KUYUFTkD(pBjtAJ4[svzAymoDZeR].v(pBjtAJ4[svzAymoDZeR+1].v,pBjtAJ4[svzAymoDZeR+2].v))
   if tM74x6uD1U[1]~=nil then
   PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe])
   pBjtAJ4[svzAymoDZeR+2].v=tM74x6uD1U[1]
   for U9AAM5r2=1,Zk9uUqV0C7 do pBjtAJ4[svzAymoDZeR+2+U9AAM5r2]={v=tM74x6uD1U[U9AAM5r2]} end
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(16+97-97) then
   local lXGvUrvw2=bEGMiM(uxtzyehh,lEZrqn[fA7ml5G[htwK0wj]])
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=lXGvUrvw2
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=19 then
   if op<=18 then
   if op<=17 then
   if op==((17+256)-256) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local SVihmYwgO6=fA7ml5G[htwK0wj]
   local ffNP3ZuZubn=tE6XHsUBg[SVihmYwgO6]
   local fzJVPI={}
   for U9AAM5r2=1,#ffNP3ZuZubn.uv do
   local RdLle6Ata=ffNP3ZuZubn.uv[U9AAM5r2]
   if RdLle6Ata[1]==1 then fzJVPI[U9AAM5r2]=pBjtAJ4[RdLle6Ata[2]] else fzJVPI[U9AAM5r2]=Vttgwk90jXU[RdLle6Ata[2]] end
   end
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]={pid=SVihmYwgO6,env=JITxOm,uv=fzJVPI}
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(18+38-38) then
   Vttgwk90jXU[fA7ml5G[htwK0wj]].v=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(19-0) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=false
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(20*4/4) then
   do
   local lXGvUrvw2=Mtyuda[fOQ9Xtq9M] local Ifi8BP=Mtyuda[fOQ9Xtq9M-1] local InalAcc=Mtyuda[fOQ9Xtq9M-fA7ml5G[htwK0wj]]
   InalAcc[Ifi8BP]=lXGvUrvw2
   fOQ9Xtq9M=fOQ9Xtq9M-2
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=45 then
   if op<=42 then
   if op<=35 then
   if op<=32 then
   if op<=26 then
   if op<=23 then
   if op<=22 then
   if op<=21 then
   if op==((21+256)-256) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local lXGvUrvw2=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   if lXGvUrvw2 then PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe]) end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22+45-45) and ((7*nHimwK0BcwI*nHimwK0BcwI)+nHimwK0BcwI)%2==0 then
   do
   local jASI6dByFwl=fA7ml5G[htwK0wj]
   if jASI6dByFwl>=0 then
   local InalAcc=Mtyuda[fOQ9Xtq9M-jASI6dByFwl-1]
   local BeLC33Ay=f9N16V8DZN[InalAcc] or 0
   for U9AAM5r2=1,jASI6dByFwl do InalAcc[BeLC33Ay+U9AAM5r2]=Mtyuda[fOQ9Xtq9M-jASI6dByFwl+U9AAM5r2] end
   f9N16V8DZN[InalAcc]=BeLC33Ay+jASI6dByFwl
   fOQ9Xtq9M=fOQ9Xtq9M-jASI6dByFwl-1
   else
   local MR2_MKU4h=(-jASI6dByFwl)-1
   local PSk9UpgO=arATmIze<0 and 0 or arATmIze
   local wQa2CD=MR2_MKU4h+PSk9UpgO
   local Vep2g0XeYf=fOQ9Xtq9M-wQa2CD
   local InalAcc=Mtyuda[Vep2g0XeYf-1]
   local BeLC33Ay=f9N16V8DZN[InalAcc] or 0
   for U9AAM5r2=1,wQa2CD do InalAcc[BeLC33Ay+U9AAM5r2]=Mtyuda[Vep2g0XeYf+U9AAM5r2-1] end
   f9N16V8DZN[InalAcc]=BeLC33Ay+wQa2CD
   arATmIze=-1
   fOQ9Xtq9M=Vep2g0XeYf-1
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((23+256)-256) then
   do
   local jASI6dByFwl=fA7ml5G[htwK0wj]
   if jASI6dByFwl<0 then
   local WweF1r=qMg7oe.n or #qMg7oe
   for U9AAM5r2=1,WweF1r do fOQ9Xtq9M=fOQ9Xtq9M+1 Mtyuda[fOQ9Xtq9M]=qMg7oe[U9AAM5r2] end
   arATmIze=WweF1r
   else
   for U9AAM5r2=1,jASI6dByFwl do fOQ9Xtq9M=fOQ9Xtq9M+1 Mtyuda[fOQ9Xtq9M]=qMg7oe[U9AAM5r2] end
   arATmIze=-1
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=24 then
   if op==(24+71-71) then
   do
   local Ifi8BP=Mtyuda[fOQ9Xtq9M] local InalAcc=Mtyuda[fOQ9Xtq9M-1]
   Mtyuda[fOQ9Xtq9M-1]=InalAcc[Ifi8BP]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=25 then
   if op==(25+96-96) and (((s3fEXp*s3fEXp)-s3fEXp)%2)==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=true
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(26-0) then
   do
   local lXGvUrvw2=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   if not lXGvUrvw2 then PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe]) end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=29 then
   if op<=27 then
   if op==(27*4/4) then
   do
   local undefined=Mtyuda[fOQ9Xtq9M-1]
   local undefined=Mtyuda[fOQ9Xtq9M]
   PvYZPFp=PvYZPFp+1
   EgIKhbUB1=Mtyuda[fOQ9Xtq9M-2]
   local txkq8FV9DwH=KUYUFTkD(EgIKhbUB1(undefined,undefined))
   fOQ9Xtq9M=fOQ9Xtq9M-3+txkq8FV9DwH.n
   for U9AAM5r2=1,txkq8FV9DwH.n do Mtyuda[fOQ9Xtq9M-txkq8FV9DwH.n+U9AAM5r2]=txkq8FV9DwH[U9AAM5r2] end
   arATmIze=txkq8FV9DwH.n
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=28 then
   if op==((28+256)-256) then
   do
   local jASI6dByFwl=fA7ml5G[htwK0wj]
   local Vep2g0XeYf=fOQ9Xtq9M-2*jASI6dByFwl
   for U9AAM5r2=1,jASI6dByFwl do
   local Ifi8BP=Mtyuda[Vep2g0XeYf+2*U9AAM5r2-2]
   local InalAcc=Mtyuda[Vep2g0XeYf+2*U9AAM5r2-1]
   local lXGvUrvw2=Mtyuda[Vep2g0XeYf+2*jASI6dByFwl+U9AAM5r2-1]
   if InalAcc==JITxOm then JITxOm[Ifi8BP]=lXGvUrvw2 else InalAcc[Ifi8BP]=lXGvUrvw2 end
   end
   fOQ9Xtq9M=Vep2g0XeYf-1
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(29*4/4) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local Vep2g0XeYf=fA7ml5G[htwK0wj]
   local undefined=fA7ml5G[lhcMWoBHnp3]
   local Zk9uUqV0C7=fA7ml5G[rAlN7vu]
   local tM74x6uD1U=KUYUFTkD(pBjtAJ4[Vep2g0XeYf].v(pBjtAJ4[Vep2g0XeYf+1].v,pBjtAJ4[Vep2g0XeYf+2].v))
   if tM74x6uD1U[1]~=nil then
     PvYZPFp=PvYZPFp+undefined
     pBjtAJ4[Vep2g0XeYf+2].v=tM74x6uD1U[1]
     for U9AAM5r2=1,Zk9uUqV0C7 do pBjtAJ4[Vep2g0XeYf+2+U9AAM5r2]={v=tM74x6uD1U[U9AAM5r2]} end
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=30 then
   if op==(30-0) then
   fOQ9Xtq9M=fOQ9Xtq9M-fA7ml5G[htwK0wj]
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=31 then
   if op==(31-0) and (((nHimwK0BcwI*nHimwK0BcwI)-nHimwK0BcwI)%2)==0 then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3 % xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(32-0) then
   Mtyuda[fOQ9Xtq9M-1]=Mtyuda[fOQ9Xtq9M-1]<Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=34 then
   if op<=33 then
   if op==((33+256)-256) then
   Mtyuda[fOQ9Xtq9M]=#Mtyuda[fOQ9Xtq9M]
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(34*4/4) and (((s3fEXp*s3fEXp)-s3fEXp)%2)==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=JITxOm
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(35-0) and (((s3fEXp*s3fEXp)-s3fEXp)%2)==0 then
   do
   local svzAymoDZeR=fA7ml5G[htwK0wj]
   local VeWs1FxY1TA=Mtyuda[fOQ9Xtq9M]
   local oFCn2nMs=Mtyuda[fOQ9Xtq9M-1]
   local MCbBcdFdQ=Mtyuda[fOQ9Xtq9M-2]
   fOQ9Xtq9M=fOQ9Xtq9M-3
   pBjtAJ4[svzAymoDZeR]={v=MCbBcdFdQ}
   pBjtAJ4[svzAymoDZeR+1].v=MCbBcdFdQ
   pBjtAJ4[svzAymoDZeR+2].v=oFCn2nMs
   pBjtAJ4[svzAymoDZeR+3].v=VeWs1FxY1TA
   if (VeWs1FxY1TA>0 and MCbBcdFdQ>oFCn2nMs) or (VeWs1FxY1TA<0 and MCbBcdFdQ<oFCn2nMs) then PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe]) end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=41 then
   if op<=37 then
   if op<=36 then
   if op==(36*4/4) then
   local InalAcc=Mtyuda[fOQ9Xtq9M]
   Mtyuda[fOQ9Xtq9M]=Mtyuda[fOQ9Xtq9M-1]
   Mtyuda[fOQ9Xtq9M-1]=InalAcc
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((37+256)-256) then
   do
   local undefined=Mtyuda[fOQ9Xtq9M-1]
   local undefined=bEGMiM(uxtzyehh,lEZrqn[fA7ml5G[htwK0wj]])
   PvYZPFp=PvYZPFp+1
   EgIKhbUB1=Mtyuda[fOQ9Xtq9M-2]
   local txkq8FV9DwH=KUYUFTkD(EgIKhbUB1(undefined,undefined))
   fOQ9Xtq9M=fOQ9Xtq9M-3+txkq8FV9DwH.n
   for U9AAM5r2=1,txkq8FV9DwH.n do Mtyuda[fOQ9Xtq9M-txkq8FV9DwH.n+U9AAM5r2]=txkq8FV9DwH[U9AAM5r2] end
   arATmIze=txkq8FV9DwH.n
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=40 then
   if op<=39 then
   if op<=38 then
   if op==((38+256)-256) then
   do
   local lXGvUrvw2=Mtyuda[fOQ9Xtq9M] local Ifi8BP=Mtyuda[fOQ9Xtq9M-1] local InalAcc=Mtyuda[fOQ9Xtq9M-2]
   InalAcc[Ifi8BP]=lXGvUrvw2
   fOQ9Xtq9M=fOQ9Xtq9M-3
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((39+256)-256) then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=pBjtAJ4[fA7ml5G[htwK0wj]].v
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(40-0) and (((s3fEXp*s3fEXp)-s3fEXp)%2)==0 then
   do end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(41-0) then
   Mtyuda[fOQ9Xtq9M]=not Mtyuda[fOQ9Xtq9M]
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(42-0) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   do
   local eoQFQnZZCp=fA7ml5G[htwK0wj]
   local undefined=fA7ml5G[rAlN7vu]
   local InalAcc=PvYZPFp+1
   PvYZPFp=InalAcc
   fOQ9Xtq9M=fOQ9Xtq9M+eoQFQnZZCp
   EgIKhbUB1=Mtyuda[fOQ9Xtq9M-eoQFQnZZCp]
   local txkq8FV9DwH=KUYUFTkD(EgIKhbUB1(F0B_LQ0m(Mtyuda,fOQ9Xtq9M-eoQFQnZZCp+1,fOQ9Xtq9M)))
   if undefined==0 then fOQ9Xtq9M=fOQ9Xtq9M-eoQFQnZZCp-1 arATmIze=-1
   elseif undefined==-1 then dLoE4trmJU3=txkq8FV9DwH.n for U9AAM5r2=1,dLoE4trmJU3 do Mtyuda[fOQ9Xtq9M-eoQFQnZZCp+U9AAM5r2]=txkq8FV9DwH[U9AAM5r2] end fOQ9Xtq9M=fOQ9Xtq9M-eoQFQnZZCp+dLoE4trmJU3-1 arATmIze=dLoE4trmJU3
   else dLoE4trmJU3=undefined for U9AAM5r2=1,dLoE4trmJU3 do Mtyuda[fOQ9Xtq9M-eoQFQnZZCp+U9AAM5r2]=txkq8FV9DwH[U9AAM5r2] end fOQ9Xtq9M=fOQ9Xtq9M-eoQFQnZZCp+dLoE4trmJU3-1 arATmIze=dLoE4trmJU3 end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=43 then
   if op==((43+256)-256) then
   if arATmIze>1 then fOQ9Xtq9M=fOQ9Xtq9M-arATmIze+1 end
   arATmIze=-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=44 then
   if op==(44+60-60) then
   PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe])
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((45+256)-256) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local undefined=Mtyuda[fOQ9Xtq9M]
   PvYZPFp=PvYZPFp+1
   EgIKhbUB1=Mtyuda[fOQ9Xtq9M-1]
   local txkq8FV9DwH=KUYUFTkD(EgIKhbUB1(undefined))
   fOQ9Xtq9M=fOQ9Xtq9M-2+txkq8FV9DwH.n
   for U9AAM5r2=1,txkq8FV9DwH.n do Mtyuda[fOQ9Xtq9M-txkq8FV9DwH.n+U9AAM5r2]=txkq8FV9DwH[U9AAM5r2] end
   arATmIze=txkq8FV9DwH.n
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=58 then
   if op<=50 then
   if op<=47 then
   if op<=46 then
   if op==(46+44-44) then
   do
   local xbjIpuTBsC=Mtyuda[fOQ9Xtq9M]
   local Iz916t3=Mtyuda[fOQ9Xtq9M-1]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   Mtyuda[fOQ9Xtq9M]=Iz916t3<=xbjIpuTBsC
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(47-0) then
   JITxOm[bEGMiM(uxtzyehh,lEZrqn[fA7ml5G[htwK0wj]])]=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=49 then
   if op<=48 then
   if op==(48-0) and (((s3fEXp*s3fEXp)-s3fEXp)%2)==0 then
   do
   local qXZr9_r=fA7ml5G[rAlN7vu]
   local Vrm0tlm2=qXZr9_r<0 and ((-qXZr9_r-1)+(arATmIze<0 and 0 or arATmIze)) or qXZr9_r
   local jASI6dByFwl=fA7ml5G[htwK0wj]
   if Vrm0tlm2>jASI6dByFwl then
   fOQ9Xtq9M=fOQ9Xtq9M-Vrm0tlm2+jASI6dByFwl
   elseif Vrm0tlm2<jASI6dByFwl then
   while Vrm0tlm2<jASI6dByFwl do fOQ9Xtq9M=fOQ9Xtq9M+1 Mtyuda[fOQ9Xtq9M]=nil Vrm0tlm2=Vrm0tlm2+1 end
   end
   arATmIze=-1
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(49*4/4) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   do
   local svzAymoDZeR=fA7ml5G[htwK0wj]
   local Zk9uUqV0C7=pBjtAJ4[svzAymoDZeR].v+pBjtAJ4[svzAymoDZeR+3].v
   local oFCn2nMs=pBjtAJ4[svzAymoDZeR+2].v
   local VeWs1FxY1TA=pBjtAJ4[svzAymoDZeR+3].v
   if (VeWs1FxY1TA>0 and Zk9uUqV0C7<=oFCn2nMs) or (VeWs1FxY1TA<0 and Zk9uUqV0C7>=oFCn2nMs) then
   pBjtAJ4[svzAymoDZeR]={v=Zk9uUqV0C7}
   pBjtAJ4[svzAymoDZeR+1].v=Zk9uUqV0C7
   PvYZPFp=PvYZPFp+(fA7ml5G[lhcMWoBHnp3]+fA7ml5G[V0w06RIHPqe])
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(50*4/4) then
   local InalAcc=Mtyuda[fOQ9Xtq9M]
   Mtyuda[fOQ9Xtq9M]=Mtyuda[fOQ9Xtq9M-1]
   Mtyuda[fOQ9Xtq9M-1]=InalAcc
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=56 then
   if op<=54 then
   if op<=52 then
   if op<=51 then
   if op==(51*4/4) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=nil
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(52*4/4) then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=Vttgwk90jXU[fA7ml5G[htwK0wj]].v
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=53 then
   if op==(53+35-35) and ((7*nHimwK0BcwI*nHimwK0BcwI)+nHimwK0BcwI)%2==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=Mtyuda[fOQ9Xtq9M-1]
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(54*4/4) and ((7*nHimwK0BcwI*nHimwK0BcwI)+nHimwK0BcwI)%2==0 then
   do
   local BeLC33Ay=fA7ml5G[htwK0wj]
   local T64DYJ62l=Mtyuda[fOQ9Xtq9M-BeLC33Ay+1]
   for U9AAM5r2=fOQ9Xtq9M-BeLC33Ay+2,fOQ9Xtq9M do T64DYJ62l=T64DYJ62l..Mtyuda[U9AAM5r2] end
   fOQ9Xtq9M=fOQ9Xtq9M-BeLC33Ay+1
   Mtyuda[fOQ9Xtq9M]=T64DYJ62l
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=55 then
   if op==((55+256)-256) then
   do
   local Vep2g0XeYf=fA7ml5G[htwK0wj]
   local Zk9uUqV0C7=fA7ml5G[rAlN7vu]
   if Zk9uUqV0C7<0 then Zk9uUqV0C7=(arATmIze<0 and 0 or arATmIze) end
   for U9AAM5r2=1,Zk9uUqV0C7 do
     fOQ9Xtq9M=fOQ9Xtq9M+1
     Mtyuda[fOQ9Xtq9M]=(Vep2g0XeYf+U9AAM5r2-1)>=0 and pBjtAJ4[Vep2g0XeYf+U9AAM5r2-1].v or nil
   end
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(56+13-13) and ((nHimwK0BcwI*nHimwK0BcwI+nHimwK0BcwI)%2)==0 then
   fOQ9Xtq9M=fOQ9Xtq9M+1
   Mtyuda[fOQ9Xtq9M]=JITxOm[bEGMiM(uxtzyehh,lEZrqn[fA7ml5G[htwK0wj]])]
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=57 then
   if op==(57-0) then
   do
   local InalAcc=Mtyuda[fOQ9Xtq9M]
   Mtyuda[fOQ9Xtq9M]=Mtyuda[fOQ9Xtq9M-1] * InalAcc
   fOQ9Xtq9M=fOQ9Xtq9M-1
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(58*4/4) and ((7*s3fEXp*s3fEXp)+s3fEXp)%2==0 then
   do
   local jASI6dByFwl=fA7ml5G[htwK0wj]
   local txkq8FV9DwH={n=0}
   if jASI6dByFwl<0 then
   local WweF1r=arATmIze<0 and 0 or arATmIze
   txkq8FV9DwH.n=WweF1r
   local MCbBcdFdQ=fOQ9Xtq9M-WweF1r+1
   for U9AAM5r2=1,WweF1r do txkq8FV9DwH[U9AAM5r2]=Mtyuda[MCbBcdFdQ+U9AAM5r2-1] end
   else
   txkq8FV9DwH.n=jASI6dByFwl
   for U9AAM5r2=1,jASI6dByFwl do txkq8FV9DwH[U9AAM5r2]=Mtyuda[fOQ9Xtq9M-jASI6dByFwl+U9AAM5r2] end
   end
   return txkq8FV9DwH
   end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=100 then
   if op==100 and (((nHimwK0BcwI*nHimwK0BcwI)-nHimwK0BcwI)%2)==0 then
   Mtyuda[fOQ9Xtq9M+1]=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M+1
   fOQ9Xtq9M=fOQ9Xtq9M-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=101 then
   if op==101 then
   Mtyuda[fOQ9Xtq9M+1]=Mtyuda[fOQ9Xtq9M]
   fOQ9Xtq9M=fOQ9Xtq9M+1
   fOQ9Xtq9M=fOQ9Xtq9M-1
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==102 then
   do local InalAcc=Mtyuda[fOQ9Xtq9M] Mtyuda[fOQ9Xtq9M]=InalAcc end
   else
   error("@?@?^?<]X]*##<!^{@}Z^}#QQ$[&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
  end
 end
 local PKAd1lUpaf=KUYUFTkD(...)
 local IY9OVi9=setmetatable({}, {__add=function() return Dg4saG(Dg4saG_decode(),1,_G,{},PKAd1lUpaf,nil) end})
 return IY9OVi9 + -7
end)(gTvCh4A)