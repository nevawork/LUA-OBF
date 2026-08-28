-- NEVAHEX-VM v3 'Hex' — protected artifact — @~XQ|X~%~X~!() runs it

return (function(XjV4JyZw, ...)
 local DTzt_c3=setmetatable({},{__mode="k"})
 local function Iu0GSW(...) local n=select('#',...) return {n=n,...} end
 local function OxC8jHQZs(e,k) if type(e)~="table" then return end return rawget(e,k) end
 local function SdzabNM70(e,k) local v=OxC8jHQZs(e,k) return type(v)=="table" and v end
 local Gr8mQwZDA=(type(_ENV)=="table" and _ENV) or (type(_G)=="table" and _G) or {}
 local ZFTSqIey=SdzabNM70(Gr8mQwZDA,"table")
 local YMCYFC6iNOY=OxC8jHQZs(Gr8mQwZDA,"unpack") or OxC8jHQZs(ZFTSqIey,"unpack") or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function r86yinP(t,i,j)
  if i>j then return end
  if YMCYFC6iNOY and j-i>15 then return YMCYFC6iNOY(t,i,j) end
  return t[i],r86yinP(t,i+1,j)
 end
 local oUoCseeZ3S=OxC8jHQZs(SdzabNM70(Gr8mQwZDA,"string"),"char") or (type(_G)=="table" and OxC8jHQZs(SdzabNM70(_G,"string"),"char")) or string.char
 local R_Djh3=OxC8jHQZs(SdzabNM70(Gr8mQwZDA,"table"),"concat") or (type(_G)=="table" and OxC8jHQZs(SdzabNM70(_G,"table"),"concat")) or table.concat
 local OKs4qKm=oUoCseeZ3S
 local ZkqUgTcV=R_Djh3
 local GvU30XY0P4u=(577242+61-61) kDphIrmy=(988391+20-20) vBMtFW=((288903+256)-256) EVOH47f=(264367*4/4) FNwqQbc=((603333+256)-256)
 local oowB36o8=(38243+18-18) W2hyh6mQ80J=(1072619*4/4) PsNRLpF6v=(1516279*4/4) g_SpJzLr=((126947+256)-256)
 local iuohWCUDLIs=((355936744+256)-256) _G.__CK0=tostring(iuohWCUDLIs)
 local G6HXjCy=0 YvSrZRPEXq=0
 local function q7Pkz7_W(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((iuohWCUDLIs+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=OKs4qKm(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=ZkqUgTcV(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local QSAFkFJ26b="\158\207c\019<\179\216[\2018\216\019F\005\243\025\192z\192c\249\196\230_Bq\140\179u\252\199\186\132z\174\212\007~\223\038\248\005\200\128\213\139\247\013K\198f\136\205<\135\162\197k\187\164\003\177\186,\1872]bw\144\225pf\130\148R\239\025sS\234J\187\1502\185\217\162\153\241p\037;\239Y\244\237\250\156\161Q\220\163\193\170\002=@\229\127\219\249\002\018\164\1513\206TE"
 local function Pua9q16_decode()
  local D={} local bn=#QSAFkFJ26b
  if bn>4194304 then error("{<[@&{^{|X><^A|A@>&Q@#*Q{Q~[") end
  local MM=2147483647
  local SGGtbZjS={98587513,757726476,464752831,919029345,517385438,460369492,1256648112,1839170923,1566397126,329926695,1273237816,1627302854,502569586,365678743,648753104,1114822825}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^SGGtbZjS[4]+SGGtbZjS[2]-SGGtbZjS[1])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^SGGtbZjS[6]+SGGtbZjS[3]-SGGtbZjS[5])%2147483646 if sb<1 then sb=sb+2147483646 end
 do
   local __fp=_VERSION or ""
   local __bits={"task","game","workspace","typeof"}
   local __acc=5381
   for i=1,#__fp do __acc=(__acc*33+string.byte(__fp,i))%1000000007 end
   for _,bn in ipairs(__bits) do
     if rawget(_G or _ENV or {}, bn)~=nil then
       __acc=(__acc*33+1)%1000000007
     else
       __acc=(__acc*33+2)%1000000007
     end
   end
   __acc=__acc%2147483646+1
   sa=(sa+__acc)%2147483647 if sa<1 then sa=sa+2147483646 end
   sb=(sb+__acc*3)%2147483647 if sb<1 then sb=sb+2147483646 end
 end
 do
   local acc=5381
   local function feed(n) acc=(acc*33+n)%2147483647 end
   local _v=tostring(_VERSION or "")
   for i=1,#_v do feed(string.byte(_v,i)*31+i-1) end
   feed(1)
   feed(rawget(_G or _ENV or {}, "unpack")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "setfenv")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "loadstring")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "jit")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "bit")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "ffi")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "task")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "game")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "typeof")~=nil and 11 or 13)
   feed(rawget(_G or _ENV or {}, "stringx")~=nil and 11 or 13)
   feed(17) feed(17)
   feed(math.fmod(-6,5)==-1 and 23 or 24)
   feed(tostring(0.1)=="0.1" and 29 or 30)
   feed((0.1+0.2)==0.3 and 31 or 32)
   feed(#("a"..string.rep("b",255))==256 and 37 or 38)
   acc=acc%2147483646+1
   sa=(sa+acc)%2147483647 if sa<1 then sa=sa+2147483646 end
   sb=(sb+acc*7)%2147483647 if sb<1 then sb=sb+2147483646 end
 end
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(QSAFkFJ26b,i)-pv+256)%256
  end
  local KTjY3aJDhQJ=1
  local function fB6vT3KgCl() local bt=D[KTjY3aJDhQJ] KTjY3aJDhQJ=KTjY3aJDhQJ+1 return bt end
  local function taa3JKctu()
   local sh,r=0,0
   while true do
    local bt=fB6vT3KgCl()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function S2iWO5()
   local u=taa3JKctu()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local ZWADmovVmL=fB6vT3KgCl()
  if ZWADmovVmL<128 then error("{&@^Z<A?^*!${A%~|?*!}]?%>*Q#") end
  for i=1,ZWADmovVmL-128 do fB6vT3KgCl() end
  local CJuO9LVMwLS=taa3JKctu()
  if CJuO9LVMwLS>4096 then error("?>~!Z#QQA>]A^A}!{Q}!#!%%%?^$") end
  local tfNMBtHB={} local mQuyaAH={}
  for kukvwlqF=1,CJuO9LVMwLS do
   local pr={}
   pr.pn=fB6vT3KgCl()
   pr.va=fB6vT3KgCl()==1
   local nu=taa3JKctu()
   pr.uv={}
   for i=1,nu do pr.uv[i]={fB6vT3KgCl()==1 and 1 or 0,taa3JKctu()} end
   pr.ns=taa3JKctu()
   taa3JKctu() taa3JKctu() taa3JKctu() taa3JKctu() taa3JKctu()
   local nc=taa3JKctu()
   if nc>65536 then error("*%$^A#!*~#~#|#$!]{%|%@^[*]Q<") end
   pr.c={}
   for i=1,nc do
    local tag=fB6vT3KgCl()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=taa3JKctu()
     local bb={}
     for j=1,ln do KTjY3aJDhQJ=KTjY3aJDhQJ+1 bb[j]=D[KTjY3aJDhQJ-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=taa3JKctu()
   if nk>262144 then error("A&?$>{*@X^&|?X*>$#?[@*?[&]<&") end
   pr.k={}
   local lrk=(oowB36o8+kukvwlqF*W2hyh6mQ80J+kukvwlqF*kukvwlqF*PsNRLpF6v)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=taa3JKctu()
    local aw=S2iWO5()-mm
    local b1w=S2iWO5()-mm
    local b2w=S2iWO5()+mm
    local cw=S2iWO5()-mm
    lrk=(lrk+g_SpJzLr+math.floor(lrk/8))%65536
    pr.k[i]={[GvU30XY0P4u]=oe,[kDphIrmy]=aw,[vBMtFW]=b1w,[EVOH47f]=b2w,[FNwqQbc]=cw}
   end
   tfNMBtHB[kukvwlqF]=pr
  end
  local wln=taa3JKctu()
  local wa=(232140637*4/4) wb=(1390507650+66-66) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   mQuyaAH[i]=(D[KTjY3aJDhQJ]-pv2+256)%256
   KTjY3aJDhQJ=KTjY3aJDhQJ+1
  end
  local XFuD56=#mQuyaAH
  if XFuD56<1 then XFuD56=1 mQuyaAH[1]=0 end
  return {P=tfNMBtHB,WM=mQuyaAH,WMI=XFuD56}
 end
 local le2S3DUBQ=0
 local XiAa14n={} local oZegTX8={}
 local function Pua9q16(l1,k148sTamxU,xyTWLBL,eQuMDJ0o7qe,QiQHERnIWF,YPyMO1Qz)
  local tfNMBtHB,mQuyaAH,XFuD56=l1.P,l1.WM,l1.WMI
  local kOTf7i6_Gz=tfNMBtHB[k148sTamxU]
  local kZujJmbE=kOTf7i6_Gz.k
  local O7dtpdgP=kOTf7i6_Gz.c
  local xpEJqz_oQ={}
  local g2q1UrxONo8={}
  for aEy2Aj3v=1,kOTf7i6_Gz.ns do g2q1UrxONo8[aEy2Aj3v]={} end
  local sTZv0gX,mZrkLU,Gs5r_i1kEVS=0,-1,1
  local B_5rLb4DPqP=QiQHERnIWF
  for aEy2Aj3v=1,kOTf7i6_Gz.pn do g2q1UrxONo8[aEy2Aj3v].v=QiQHERnIWF[aEy2Aj3v] end
  local vgFyaBJ9,pwQx2QxdD=37,1
  local h3bWJECYKe,pcYMBDLi6aR,QGbdy6_Isdd=false,0,0
  local uStNn1py3=(oowB36o8+k148sTamxU*W2hyh6mQ80J+k148sTamxU*k148sTamxU*PsNRLpF6v)%65536
  local iy9L5wWd,LAFjJaR,diVtuOaV4kf,u2eafMY,mAzbTFWFh8_
  local mdRGE0C,op
  while true do
   local Y8__ah7W7=(((58255+256)-256)+k148sTamxU*7919)%65536
   if Y8__ah7W7<256 then local _nop=1+1 end
   local vMdlGD=((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2
   if vMdlGD==0 then local _og=1+1 end
   mdRGE0C=kZujJmbE[Gs5r_i1kEVS]
   mdRGE0C=kZujJmbE[Gs5r_i1kEVS]
   mdRGE0C=kZujJmbE[Gs5r_i1kEVS]
   mdRGE0C=kZujJmbE[Gs5r_i1kEVS]
   op=(((mdRGE0C[GvU30XY0P4u]-uStNn1py3)+65536)%65536)
   uStNn1py3=(uStNn1py3+g_SpJzLr+math.floor(uStNn1py3/8))%65536
   Gs5r_i1kEVS=Gs5r_i1kEVS+1
   if op<=33 then
   if op<=16 then
   if op<=9 then
   if op<=4 then
   if op<=3 then
   if op<=2 then
   if op<=1 then
   if op<=0 then
   if op==(0*4/4) then
   xpEJqz_oQ[sTZv0gX+1]=g2q1UrxONo8[mdRGE0C[kDphIrmy]].v
   sTZv0gX=sTZv0gX+1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1+24-24) and ((7*QGbdy6_Isdd*QGbdy6_Isdd)+QGbdy6_Isdd)%2==0 then
   error("&<&~<Q]Z[@<$&@#@ZZ}#QX%X$?Z<".."::ESCAPE-OP="..tostring(op))
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(2*4/4) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=nil
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((3+256)-256) then
   do
   local undefined=xpEJqz_oQ[sTZv0gX-1]
   local undefined=xpEJqz_oQ[sTZv0gX]
   Gs5r_i1kEVS=Gs5r_i1kEVS+1
   mAzbTFWFh8_=xpEJqz_oQ[sTZv0gX-2]
   local Uo2AwAQ0C8=Iu0GSW(mAzbTFWFh8_(undefined,undefined))
   sTZv0gX=sTZv0gX-3+Uo2AwAQ0C8.n
   for aEy2Aj3v=1,Uo2AwAQ0C8.n do xpEJqz_oQ[sTZv0gX-Uo2AwAQ0C8.n+aEy2Aj3v]=Uo2AwAQ0C8[aEy2Aj3v] end
   mZrkLU=Uo2AwAQ0C8.n
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(4-0) then
   do
   local H8u5yE2klCA=mdRGE0C[kDphIrmy]
   local SkfON08ov=mdRGE0C[FNwqQbc]
   if SkfON08ov<0 then SkfON08ov=(mZrkLU<0 and 0 or mZrkLU) end
   for aEy2Aj3v=1,SkfON08ov do
     sTZv0gX=sTZv0gX+1
     xpEJqz_oQ[sTZv0gX]=(H8u5yE2klCA+aEy2Aj3v-1)>=0 and g2q1UrxONo8[H8u5yE2klCA+aEy2Aj3v-1].v or nil
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=6 then
   if op<=5 then
   if op==(5+59-59) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   do
   local H8u5yE2klCA=mdRGE0C[kDphIrmy]
   local undefined=mdRGE0C[vBMtFW]
   g2q1UrxONo8[H8u5yE2klCA].v=g2q1UrxONo8[H8u5yE2klCA].v
   g2q1UrxONo8[H8u5yE2klCA+1].v=g2q1UrxONo8[H8u5yE2klCA+1].v
   g2q1UrxONo8[H8u5yE2klCA+2].v=g2q1UrxONo8[H8u5yE2klCA+2].v
   Gs5r_i1kEVS=Gs5r_i1kEVS+undefined
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(6-0) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   do
   local nGwspGeyxH2=mdRGE0C[kDphIrmy]
   if nGwspGeyxH2<0 then
   local oaiswp43=B_5rLb4DPqP.n or #B_5rLb4DPqP
   for aEy2Aj3v=1,oaiswp43 do sTZv0gX=sTZv0gX+1 xpEJqz_oQ[sTZv0gX]=B_5rLb4DPqP[aEy2Aj3v] end
   mZrkLU=oaiswp43
   else
   for aEy2Aj3v=1,nGwspGeyxH2 do sTZv0gX=sTZv0gX+1 xpEJqz_oQ[sTZv0gX]=B_5rLb4DPqP[aEy2Aj3v] end
   mZrkLU=-1
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=7 then
   if op==((7+256)-256) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   do
   local zCvhF2U=mdRGE0C[kDphIrmy]
   local SkfON08ov=g2q1UrxONo8[zCvhF2U].v+g2q1UrxONo8[zCvhF2U+3].v
   local nIgoudC6fD=g2q1UrxONo8[zCvhF2U+2].v
   local nDvCtVMrvH8=g2q1UrxONo8[zCvhF2U+3].v
   if (nDvCtVMrvH8>0 and SkfON08ov<=nIgoudC6fD) or (nDvCtVMrvH8<0 and SkfON08ov>=nIgoudC6fD) then
   g2q1UrxONo8[zCvhF2U]={v=SkfON08ov}
   g2q1UrxONo8[zCvhF2U+1].v=SkfON08ov
   Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f])
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=8 then
   if op==((8+256)-256) then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=eQuMDJ0o7qe[mdRGE0C[kDphIrmy]].v
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(9+93-93) then
   do
   local nGwspGeyxH2=mdRGE0C[kDphIrmy]
   if nGwspGeyxH2>=0 then
   local H51AAcR=xpEJqz_oQ[sTZv0gX-nGwspGeyxH2-1]
   local o6WkNUT2w6d=DTzt_c3[H51AAcR] or 0
   for aEy2Aj3v=1,nGwspGeyxH2 do H51AAcR[o6WkNUT2w6d+aEy2Aj3v]=xpEJqz_oQ[sTZv0gX-nGwspGeyxH2+aEy2Aj3v] end
   DTzt_c3[H51AAcR]=o6WkNUT2w6d+nGwspGeyxH2
   sTZv0gX=sTZv0gX-nGwspGeyxH2-1
   else
   local Jc7iCub4mr=(-nGwspGeyxH2)-1
   local fW_P0Z7=mZrkLU<0 and 0 or mZrkLU
   local XjAB7G=Jc7iCub4mr+fW_P0Z7
   local H8u5yE2klCA=sTZv0gX-XjAB7G
   local H51AAcR=xpEJqz_oQ[H8u5yE2klCA-1]
   local o6WkNUT2w6d=DTzt_c3[H51AAcR] or 0
   for aEy2Aj3v=1,XjAB7G do H51AAcR[o6WkNUT2w6d+aEy2Aj3v]=xpEJqz_oQ[H8u5yE2klCA+aEy2Aj3v-1] end
   DTzt_c3[H51AAcR]=o6WkNUT2w6d+XjAB7G
   mZrkLU=-1
   sTZv0gX=H8u5yE2klCA-1
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=14 then
   if op<=13 then
   if op<=10 then
   if op==(10+65-65) then
   do
   local enNIddwNk=xpEJqz_oQ[sTZv0gX-1]
   xpEJqz_oQ[sTZv0gX-1]=enNIddwNk ^ xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=12 then
   if op<=11 then
   if op==(11-0) and (((vgFyaBJ9*vgFyaBJ9)-vgFyaBJ9)%2)==0 then
   do
   local nGwspGeyxH2,xrNpCO=mdRGE0C[kDphIrmy],mdRGE0C[vBMtFW]
   LAFjJaR=nGwspGeyxH2<0 and (mZrkLU<0 and 0 or mZrkLU) or nGwspGeyxH2
   diVtuOaV4kf=0
   u2eafMY=sTZv0gX-LAFjJaR-1-diVtuOaV4kf
   mAzbTFWFh8_=xpEJqz_oQ[u2eafMY]
   local Uo2AwAQ0C8
   if type(mAzbTFWFh8_)=='table' and mAzbTFWFh8_.pid then
   local coJTWdagJUC={n=LAFjJaR}
   for aEy2Aj3v=1,LAFjJaR do coJTWdagJUC[aEy2Aj3v]=xpEJqz_oQ[u2eafMY+diVtuOaV4kf+aEy2Aj3v] end
   Uo2AwAQ0C8=Pua9q16(mAzbTFWFh8_.pid,mAzbTFWFh8_.env,mAzbTFWFh8_.uv,coJTWdagJUC,YPyMO1Qz)
   else
   Uo2AwAQ0C8=Iu0GSW(mAzbTFWFh8_(r86yinP(xpEJqz_oQ,u2eafMY+1+diVtuOaV4kf,sTZv0gX)))
   end
   if xrNpCO==0 then
   sTZv0gX=u2eafMY-1
   mZrkLU=-1
   elseif xrNpCO==-1 then
   iy9L5wWd=Uo2AwAQ0C8.n
   for aEy2Aj3v=1,iy9L5wWd do xpEJqz_oQ[u2eafMY+aEy2Aj3v-1]=Uo2AwAQ0C8[aEy2Aj3v] end
   sTZv0gX=u2eafMY+iy9L5wWd-1
   mZrkLU=iy9L5wWd
   else
   for aEy2Aj3v=1,xrNpCO do xpEJqz_oQ[u2eafMY+aEy2Aj3v-1]=Uo2AwAQ0C8[aEy2Aj3v] end
   sTZv0gX=u2eafMY+xrNpCO-1
   mZrkLU=-1
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((12+256)-256) then
   do
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1] % H51AAcR
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(13+88-88) then
   do
   local nGwspGeyxH2,xrNpCO=mdRGE0C[kDphIrmy],mdRGE0C[vBMtFW]
   LAFjJaR=nGwspGeyxH2<0 and (mZrkLU<0 and 0 or mZrkLU) or nGwspGeyxH2
   diVtuOaV4kf=1
   u2eafMY=sTZv0gX-LAFjJaR-1-diVtuOaV4kf
   mAzbTFWFh8_=xpEJqz_oQ[u2eafMY]
   local Uo2AwAQ0C8
   if type(mAzbTFWFh8_)=='table' and mAzbTFWFh8_.pid then
   local coJTWdagJUC={n=LAFjJaR}
   for aEy2Aj3v=1,LAFjJaR do coJTWdagJUC[aEy2Aj3v]=xpEJqz_oQ[u2eafMY+diVtuOaV4kf+aEy2Aj3v] end
   Uo2AwAQ0C8=Pua9q16(mAzbTFWFh8_.pid,mAzbTFWFh8_.env,mAzbTFWFh8_.uv,coJTWdagJUC,YPyMO1Qz)
   else
   Uo2AwAQ0C8=Iu0GSW(mAzbTFWFh8_(r86yinP(xpEJqz_oQ,u2eafMY+1+diVtuOaV4kf,sTZv0gX)))
   end
   if xrNpCO==0 then
   sTZv0gX=u2eafMY-1
   mZrkLU=-1
   elseif xrNpCO==-1 then
   iy9L5wWd=Uo2AwAQ0C8.n
   for aEy2Aj3v=1,iy9L5wWd do xpEJqz_oQ[u2eafMY+aEy2Aj3v-1]=Uo2AwAQ0C8[aEy2Aj3v] end
   sTZv0gX=u2eafMY+iy9L5wWd-1
   mZrkLU=iy9L5wWd
   else
   for aEy2Aj3v=1,xrNpCO do xpEJqz_oQ[u2eafMY+aEy2Aj3v-1]=Uo2AwAQ0C8[aEy2Aj3v] end
   sTZv0gX=u2eafMY+xrNpCO-1
   mZrkLU=-1
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(14+60-60) and ((7*QGbdy6_Isdd*QGbdy6_Isdd)+QGbdy6_Isdd)%2==0 then
   do local eILedg2=q7Pkz7_W(k148sTamxU,O7dtpdgP[mdRGE0C[kDphIrmy]]) sTZv0gX=sTZv0gX+1 xpEJqz_oQ[sTZv0gX]=eILedg2 end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=15 then
   if op==(15+12-12) and ((vgFyaBJ9*vgFyaBJ9+vgFyaBJ9)%2)==0 then
   do
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1] + H51AAcR
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(16*4/4) then
   do
   local zCvhF2U=mdRGE0C[kDphIrmy]
   local SkfON08ov=mdRGE0C[FNwqQbc]
   local TkABF8tp3X=xpEJqz_oQ[sTZv0gX] local zGwZq5I6O_=xpEJqz_oQ[sTZv0gX-1] local yD71Vm=xpEJqz_oQ[sTZv0gX-2]
   sTZv0gX=sTZv0gX-3
   g2q1UrxONo8[zCvhF2U].v=yD71Vm
   g2q1UrxONo8[zCvhF2U+1].v=zGwZq5I6O_
   g2q1UrxONo8[zCvhF2U+2].v=TkABF8tp3X
   local Ki0N4WBVl=Iu0GSW(g2q1UrxONo8[zCvhF2U].v(g2q1UrxONo8[zCvhF2U+1].v,g2q1UrxONo8[zCvhF2U+2].v))
   if Ki0N4WBVl[1]==nil then
   Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f])
   else
   g2q1UrxONo8[zCvhF2U+2].v=Ki0N4WBVl[1]
   for aEy2Aj3v=1,SkfON08ov do g2q1UrxONo8[zCvhF2U+2+aEy2Aj3v]={v=Ki0N4WBVl[aEy2Aj3v]} end
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=25 then
   if op<=22 then
   if op<=19 then
   if op<=18 then
   if op<=17 then
   if op==((17+256)-256) then
   xyTWLBL[q7Pkz7_W(k148sTamxU,O7dtpdgP[mdRGE0C[kDphIrmy]])]=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(18-0) then
   do
   local H8u5yE2klCA=mdRGE0C[kDphIrmy]
   local undefined=mdRGE0C[vBMtFW]
   local SkfON08ov=mdRGE0C[FNwqQbc]
   local Ki0N4WBVl=Iu0GSW(g2q1UrxONo8[H8u5yE2klCA].v(g2q1UrxONo8[H8u5yE2klCA+1].v,g2q1UrxONo8[H8u5yE2klCA+2].v))
   if Ki0N4WBVl[1]~=nil then
     Gs5r_i1kEVS=Gs5r_i1kEVS+undefined
     g2q1UrxONo8[H8u5yE2klCA+2].v=Ki0N4WBVl[1]
     for aEy2Aj3v=1,SkfON08ov do g2q1UrxONo8[H8u5yE2klCA+2+aEy2Aj3v]={v=Ki0N4WBVl[aEy2Aj3v]} end
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((19+256)-256) then
   do
   local YYgiUm8esA=xpEJqz_oQ[sTZv0gX]
   local enNIddwNk=xpEJqz_oQ[sTZv0gX-1]
   sTZv0gX=sTZv0gX-1
   xpEJqz_oQ[sTZv0gX]=enNIddwNk<YYgiUm8esA
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=20 then
   if op==((20+256)-256) then
   xpEJqz_oQ[sTZv0gX-1]=xpEJqz_oQ[sTZv0gX-1]<=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=21 then
   if op==(21+66-66) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   g2q1UrxONo8[mdRGE0C[kDphIrmy]].v=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22*4/4) then
   do
   local o6WkNUT2w6d=mdRGE0C[kDphIrmy]
   local qb8oWyix=xpEJqz_oQ[sTZv0gX-o6WkNUT2w6d+1]
   for aEy2Aj3v=sTZv0gX-o6WkNUT2w6d+2,sTZv0gX do qb8oWyix=qb8oWyix..xpEJqz_oQ[aEy2Aj3v] end
   sTZv0gX=sTZv0gX-o6WkNUT2w6d+1
   xpEJqz_oQ[sTZv0gX]=qb8oWyix
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=24 then
   if op<=23 then
   if op==(23-0) then
   do
   local RGl1AQx=mdRGE0C[FNwqQbc]
   local fUw9C4Kt=RGl1AQx<0 and ((-RGl1AQx-1)+(mZrkLU<0 and 0 or mZrkLU)) or RGl1AQx
   local nGwspGeyxH2=mdRGE0C[kDphIrmy]
   if fUw9C4Kt>nGwspGeyxH2 then
   sTZv0gX=sTZv0gX-fUw9C4Kt+nGwspGeyxH2
   elseif fUw9C4Kt<nGwspGeyxH2 then
   while fUw9C4Kt<nGwspGeyxH2 do sTZv0gX=sTZv0gX+1 xpEJqz_oQ[sTZv0gX]=nil fUw9C4Kt=fUw9C4Kt+1 end
   end
   mZrkLU=-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(24-0) then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1]
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((25+256)-256) then
   do end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=32 then
   if op<=30 then
   if op<=29 then
   if op<=28 then
   if op<=26 then
   if op==((26+256)-256) then
   do
   local undefined=xpEJqz_oQ[sTZv0gX-1]
   local undefined=q7Pkz7_W(k148sTamxU,O7dtpdgP[mdRGE0C[kDphIrmy]])
   Gs5r_i1kEVS=Gs5r_i1kEVS+1
   mAzbTFWFh8_=xpEJqz_oQ[sTZv0gX-2]
   local Uo2AwAQ0C8=Iu0GSW(mAzbTFWFh8_(undefined,undefined))
   sTZv0gX=sTZv0gX-3+Uo2AwAQ0C8.n
   for aEy2Aj3v=1,Uo2AwAQ0C8.n do xpEJqz_oQ[sTZv0gX-Uo2AwAQ0C8.n+aEy2Aj3v]=Uo2AwAQ0C8[aEy2Aj3v] end
   mZrkLU=Uo2AwAQ0C8.n
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=27 then
   if op==(27+11-11) and (((QGbdy6_Isdd*QGbdy6_Isdd)-QGbdy6_Isdd)%2)==0 then
   eQuMDJ0o7qe[mdRGE0C[kDphIrmy]].v=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(28*4/4) and (((QGbdy6_Isdd*QGbdy6_Isdd)-QGbdy6_Isdd)%2)==0 then
   do
   local TU6dcg8AMJ=mdRGE0C[kDphIrmy]
   local PJctdd=tfNMBtHB[TU6dcg8AMJ]
   local B9fzDHaA={}
   for aEy2Aj3v=1,#PJctdd.uv do
   local DGx0cs=PJctdd.uv[aEy2Aj3v]
   if DGx0cs[1]==1 then B9fzDHaA[aEy2Aj3v]=g2q1UrxONo8[DGx0cs[2]] else B9fzDHaA[aEy2Aj3v]=eQuMDJ0o7qe[DGx0cs[2]] end
   end
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]={pid=TU6dcg8AMJ,env=xyTWLBL,uv=B9fzDHaA}
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((29+256)-256) and (((vgFyaBJ9*vgFyaBJ9)-vgFyaBJ9)%2)==0 then
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1]
   xpEJqz_oQ[sTZv0gX-1]=H51AAcR
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(30+62-62) then
   do
   local eILedg2=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   if eILedg2 then Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f]) end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=31 then
   if op==(31*4/4) then
   do
   local eILedg2=xpEJqz_oQ[sTZv0gX] local CLvUylAgfeu=xpEJqz_oQ[sTZv0gX-1] local H51AAcR=xpEJqz_oQ[sTZv0gX-2]
   H51AAcR[CLvUylAgfeu]=eILedg2
   sTZv0gX=sTZv0gX-3
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(32-0) then
   sTZv0gX=sTZv0gX-mdRGE0C[kDphIrmy]
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(33-0) and (((vgFyaBJ9*vgFyaBJ9)-vgFyaBJ9)%2)==0 then
   do
   local nGwspGeyxH2=mdRGE0C[kDphIrmy]
   local H8u5yE2klCA=sTZv0gX-2*nGwspGeyxH2
   for aEy2Aj3v=1,nGwspGeyxH2 do
   local CLvUylAgfeu=xpEJqz_oQ[H8u5yE2klCA+2*aEy2Aj3v-2]
   local H51AAcR=xpEJqz_oQ[H8u5yE2klCA+2*aEy2Aj3v-1]
   local eILedg2=xpEJqz_oQ[H8u5yE2klCA+2*nGwspGeyxH2+aEy2Aj3v-1]
   if H51AAcR==xyTWLBL then xyTWLBL[CLvUylAgfeu]=eILedg2 else H51AAcR[CLvUylAgfeu]=eILedg2 end
   end
   sTZv0gX=H8u5yE2klCA-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=43 then
   if op<=41 then
   if op<=39 then
   if op<=38 then
   if op<=36 then
   if op<=34 then
   if op==(34*4/4) then
   Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f])
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=35 then
   if op==((35+256)-256) then
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1]
   xpEJqz_oQ[sTZv0gX-1]=H51AAcR
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(36-0) then
   do
   local CLvUylAgfeu=xpEJqz_oQ[sTZv0gX] local H51AAcR=xpEJqz_oQ[sTZv0gX-1]
   xpEJqz_oQ[sTZv0gX-1]=H51AAcR[CLvUylAgfeu]
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=37 then
   if op==(37+83-83) and ((vgFyaBJ9*vgFyaBJ9+vgFyaBJ9)%2)==0 then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=false
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(38+92-92) then
   do
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1] / H51AAcR
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(39*4/4) then
   xpEJqz_oQ[sTZv0gX]=not xpEJqz_oQ[sTZv0gX]
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=40 then
   if op==(40*4/4) then
   xpEJqz_oQ[sTZv0gX]=#xpEJqz_oQ[sTZv0gX]
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41*4/4) then
   do
   local LAFjJaR=mdRGE0C[kDphIrmy]
   local undefined=mdRGE0C[FNwqQbc]
   local H51AAcR=Gs5r_i1kEVS+1
   Gs5r_i1kEVS=H51AAcR
   sTZv0gX=sTZv0gX+LAFjJaR
   mAzbTFWFh8_=xpEJqz_oQ[sTZv0gX-LAFjJaR]
   local Uo2AwAQ0C8=Iu0GSW(mAzbTFWFh8_(r86yinP(xpEJqz_oQ,sTZv0gX-LAFjJaR+1,sTZv0gX)))
   if undefined==0 then sTZv0gX=sTZv0gX-LAFjJaR-1 mZrkLU=-1
   elseif undefined==-1 then iy9L5wWd=Uo2AwAQ0C8.n for aEy2Aj3v=1,iy9L5wWd do xpEJqz_oQ[sTZv0gX-LAFjJaR+aEy2Aj3v]=Uo2AwAQ0C8[aEy2Aj3v] end sTZv0gX=sTZv0gX-LAFjJaR+iy9L5wWd-1 mZrkLU=iy9L5wWd
   else iy9L5wWd=undefined for aEy2Aj3v=1,iy9L5wWd do xpEJqz_oQ[sTZv0gX-LAFjJaR+aEy2Aj3v]=Uo2AwAQ0C8[aEy2Aj3v] end sTZv0gX=sTZv0gX-LAFjJaR+iy9L5wWd-1 mZrkLU=iy9L5wWd end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=42 then
   if op==((42+256)-256) and ((vgFyaBJ9*vgFyaBJ9+vgFyaBJ9)%2)==0 then
   do
   local zCvhF2U=mdRGE0C[kDphIrmy]
   local SkfON08ov=mdRGE0C[FNwqQbc]
   local Ki0N4WBVl=Iu0GSW(g2q1UrxONo8[zCvhF2U].v(g2q1UrxONo8[zCvhF2U+1].v,g2q1UrxONo8[zCvhF2U+2].v))
   if Ki0N4WBVl[1]~=nil then
   Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f])
   g2q1UrxONo8[zCvhF2U+2].v=Ki0N4WBVl[1]
   for aEy2Aj3v=1,SkfON08ov do g2q1UrxONo8[zCvhF2U+2+aEy2Aj3v]={v=Ki0N4WBVl[aEy2Aj3v]} end
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((43+256)-256) then
   do
   local eILedg2=xpEJqz_oQ[sTZv0gX] local CLvUylAgfeu=xpEJqz_oQ[sTZv0gX-1] local H51AAcR=xpEJqz_oQ[sTZv0gX-mdRGE0C[kDphIrmy]]
   H51AAcR[CLvUylAgfeu]=eILedg2
   sTZv0gX=sTZv0gX-2
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=55 then
   if op<=46 then
   if op<=44 then
   if op==((44+256)-256) then
   if mZrkLU>1 then sTZv0gX=sTZv0gX-mZrkLU+1 end
   mZrkLU=-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=45 then
   if op==(45+49-49) and (((QGbdy6_Isdd*QGbdy6_Isdd)-QGbdy6_Isdd)%2)==0 then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=xyTWLBL
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(46-0) then
   do
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1] - H51AAcR
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=53 then
   if op<=52 then
   if op<=48 then
   if op<=47 then
   if op==(47*4/4) and ((7*QGbdy6_Isdd*QGbdy6_Isdd)+QGbdy6_Isdd)%2==0 then
   do
   local nGwspGeyxH2=mdRGE0C[kDphIrmy]
   local Uo2AwAQ0C8={n=0}
   if nGwspGeyxH2<0 then
   local oaiswp43=mZrkLU<0 and 0 or mZrkLU
   Uo2AwAQ0C8.n=oaiswp43
   local Qvqvhe2=sTZv0gX-oaiswp43+1
   for aEy2Aj3v=1,oaiswp43 do Uo2AwAQ0C8[aEy2Aj3v]=xpEJqz_oQ[Qvqvhe2+aEy2Aj3v-1] end
   else
   Uo2AwAQ0C8.n=nGwspGeyxH2
   for aEy2Aj3v=1,nGwspGeyxH2 do Uo2AwAQ0C8[aEy2Aj3v]=xpEJqz_oQ[sTZv0gX-nGwspGeyxH2+aEy2Aj3v] end
   end
   return Uo2AwAQ0C8
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48-0) then
   do
   local zCvhF2U=mdRGE0C[kDphIrmy]
   local nDvCtVMrvH8=xpEJqz_oQ[sTZv0gX]
   local nIgoudC6fD=xpEJqz_oQ[sTZv0gX-1]
   local Qvqvhe2=xpEJqz_oQ[sTZv0gX-2]
   sTZv0gX=sTZv0gX-3
   g2q1UrxONo8[zCvhF2U]={v=Qvqvhe2}
   g2q1UrxONo8[zCvhF2U+1].v=Qvqvhe2
   g2q1UrxONo8[zCvhF2U+2].v=nIgoudC6fD
   g2q1UrxONo8[zCvhF2U+3].v=nDvCtVMrvH8
   if (nDvCtVMrvH8>0 and Qvqvhe2>nIgoudC6fD) or (nDvCtVMrvH8<0 and Qvqvhe2<nIgoudC6fD) then Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f]) end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=49 then
   if op==((49+256)-256) and ((QGbdy6_Isdd*QGbdy6_Isdd+QGbdy6_Isdd)%2)==0 then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=true
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=50 then
   if op==(50-0) then
   do
   local H8u5yE2klCA,oaiswp43=mdRGE0C[kDphIrmy],mdRGE0C[vBMtFW]
   local GccHQPc2lI4=sTZv0gX-oaiswp43
   for aEy2Aj3v=1,oaiswp43 do g2q1UrxONo8[H8u5yE2klCA+aEy2Aj3v-1].v=xpEJqz_oQ[GccHQPc2lI4+aEy2Aj3v] end
   sTZv0gX=GccHQPc2lI4
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=51 then
   if op==(51*4/4) and (((QGbdy6_Isdd*QGbdy6_Isdd)-QGbdy6_Isdd)%2)==0 then
   xpEJqz_oQ[sTZv0gX-1]=xpEJqz_oQ[sTZv0gX-1]==xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(52*4/4) and ((QGbdy6_Isdd*QGbdy6_Isdd+QGbdy6_Isdd)%2)==0 then
   do
   local undefined=xpEJqz_oQ[sTZv0gX]
   Gs5r_i1kEVS=Gs5r_i1kEVS+1
   mAzbTFWFh8_=xpEJqz_oQ[sTZv0gX-1]
   local Uo2AwAQ0C8=Iu0GSW(mAzbTFWFh8_(undefined))
   sTZv0gX=sTZv0gX-2+Uo2AwAQ0C8.n
   for aEy2Aj3v=1,Uo2AwAQ0C8.n do xpEJqz_oQ[sTZv0gX-Uo2AwAQ0C8.n+aEy2Aj3v]=Uo2AwAQ0C8[aEy2Aj3v] end
   mZrkLU=Uo2AwAQ0C8.n
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op==(53-0) then
   sTZv0gX=sTZv0gX+1
   local H51AAcR={}
   DTzt_c3[H51AAcR]=0
   xpEJqz_oQ[sTZv0gX]=H51AAcR
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=54 then
   if op==((54+256)-256) and ((QGbdy6_Isdd*QGbdy6_Isdd+QGbdy6_Isdd)%2)==0 then
   do
   local undefined=mdRGE0C[FNwqQbc]
   local undefined=q7Pkz7_W(k148sTamxU,undefined)
   if undefined<#tfNMBtHB[1].consts then
     sTZv0gX=sTZv0gX+1
     xpEJqz_oQ[sTZv0gX]=Pua9q16(0,xyTWLBL,tfNMBtHB[1].uv,{n=1,undefined},YPyMO1Qz)
   else
     sTZv0gX=sTZv0gX+1
     xpEJqz_oQ[sTZv0gX]=nil
   end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(55+30-30) then
   do
   local eILedg2=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX-1
   if not eILedg2 then Gs5r_i1kEVS=Gs5r_i1kEVS+(mdRGE0C[vBMtFW]+mdRGE0C[EVOH47f]) end
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=58 then
   if op<=56 then
   if op==((56+256)-256) then
   do
   local H51AAcR=xpEJqz_oQ[sTZv0gX]
   xpEJqz_oQ[sTZv0gX]=xpEJqz_oQ[sTZv0gX-1] * H51AAcR
   sTZv0gX=sTZv0gX-1
   end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=57 then
   if op==(57-0) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   sTZv0gX=sTZv0gX+1
   xpEJqz_oQ[sTZv0gX]=xyTWLBL[q7Pkz7_W(k148sTamxU,O7dtpdgP[mdRGE0C[kDphIrmy]])]
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(58-0) and ((7*vgFyaBJ9*vgFyaBJ9)+vgFyaBJ9)%2==0 then
   xpEJqz_oQ[sTZv0gX]=-xpEJqz_oQ[sTZv0gX]
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=101 then
   if op<=100 then
   if op==100 then
   xpEJqz_oQ[sTZv0gX+1]=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX+1
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 then
   do local H51AAcR=xpEJqz_oQ[sTZv0gX] xpEJqz_oQ[sTZv0gX]=H51AAcR end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=102 then
   if op==102 and (((vgFyaBJ9*vgFyaBJ9)-vgFyaBJ9)%2)==0 then
   do local H51AAcR=xpEJqz_oQ[sTZv0gX] xpEJqz_oQ[sTZv0gX]=H51AAcR end
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==103 then
   xpEJqz_oQ[sTZv0gX+1]=xpEJqz_oQ[sTZv0gX]
   sTZv0gX=sTZv0gX+1
   sTZv0gX=sTZv0gX-1
   else
   error("Z!|Q|^X!!<X#X&#QZX{[A#<||^>?".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   end
  end
 end
 local RjJPdPt1o=Iu0GSW(...)
 local nhNjD06gU0w=setmetatable({}, {__mul=function() return Pua9q16(Pua9q16_decode(),1,Gr8mQwZDA,{},RjJPdPt1o,nil) end})
 return nhNjD06gU0w * 3
end)(XjV4JyZw)