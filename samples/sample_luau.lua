-- NEVAHEX-VM v3 'Hex' — protected artifact — ]<!}}X$>]@?{() runs it

return (function(ymWDYvK, ...)
 local jqa8AqfZ=setmetatable({},{__mode="k"})
 local function xywvxQRH(...) local n=select('#',...) return {n=n,...} end
 local u7slXgffs0=type(_ENV.unpack)=="function" and _ENV.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function MLoWfSdtuC(t,i,j)
  if i>j then return end
  if u7slXgffs0 and j-i>15 then return u7slXgffs0(t,i,j) end
  return t[i],MLoWfSdtuC(t,i+1,j)
 end
 local JEYNKtdG=_ENV.string.char
 local G9V2wQiS6rL=_ENV.table.concat
 local M76JhlP=(498979*4/4) lo1i36I=((411449+256)-256) KCcjqjQ=((375236+256)-256) cfGToRXud_=(715387-0) eyifPodR=((608112+256)-256)
 local FFk7qAo4Rj=(63635*4/4) A2KbsR=((1360631+256)-256) vdquKFn=(1260893-0) shS47KzA=(214955+19-19)
 local Ki5hR45=(1838498406-0) _G.__CK0=tostring(Ki5hR45)
 local A4U1debDCtA=0 fMxMnH=0
 local function XR6r3v(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((Ki5hR45+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=JEYNKtdG(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=G9V2wQiS6rL(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local zzscMCul="\028\169\187\248\161c\128\036\020z\019\025\219\031_Y\140\147\181\148\182\217\247\012\171\211\001\237\233nMjWn\166\032\2510\132O\204\185\137\029\032m\0249\000\239\133m\038\200K\223\200\216\148\237\229\\\141\037\153?\131\131\148\013\162m\142\015_\022\198\208\210\174N\004=4\021\134J\011xiv4\147\2441\0040\218\171>R\241y]\191\012\127"
 local function UxM99VP1dJ_decode()
  local D={} local bn=#zzscMCul
  if bn>4194304 then error("#|!~<~!!*A>^[@*A&]{>?AZ[[$%]") end
  local MM=2147483647
  local BBrULSDdcKQ={222421957,1989642230,1982985578,1964786358,924215486,1531216030,373722083,1305136020,1519960502,85390671,301748054,1376210129,163006884,1690790220,1923322995,172273359}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^BBrULSDdcKQ[2]+BBrULSDdcKQ[1]-BBrULSDdcKQ[4])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^BBrULSDdcKQ[3]+BBrULSDdcKQ[5]-BBrULSDdcKQ[6])%2147483646 if sb<1 then sb=sb+2147483646 end
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
   D[i]=(sbyte(zzscMCul,i)-pv+256)%256
  end
  local huFzuSz_W4i=1
  local function HorpkORBR() local bt=D[huFzuSz_W4i] huFzuSz_W4i=huFzuSz_W4i+1 return bt end
  local function gbzt7Me()
   local sh,r=0,0
   while true do
    local bt=HorpkORBR()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function DOAGbz4()
   local u=gbzt7Me()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local xecrOKCLv0=HorpkORBR()
  if xecrOKCLv0<128 then error("]ZA[{$AQ|A@]&~<{@#*!#%|#X${!") end
  for i=1,xecrOKCLv0-128 do HorpkORBR() end
  local cwg98O=gbzt7Me()
  if cwg98O>4096 then error("|]{}{Q#Z[[{A!$}&Q${$@!%<<}<A") end
  local wyku6TO={} local tDCkhl={}
  for PjALK6VfdSU=1,cwg98O do
   local pr={}
   pr.pn=HorpkORBR()
   pr.va=HorpkORBR()==1
   local nu=gbzt7Me()
   pr.uv={}
   for i=1,nu do pr.uv[i]={HorpkORBR()==1 and 1 or 0,gbzt7Me()} end
   pr.ns=gbzt7Me()
   gbzt7Me() gbzt7Me() gbzt7Me() gbzt7Me() gbzt7Me()
   local nc=gbzt7Me()
   if nc>65536 then error("XA~[@^|}A<Q}}{ZZA&[%$]^]<AZ~") end
   pr.c={}
   for i=1,nc do
    local tag=HorpkORBR()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=gbzt7Me()
     local bb={}
     for j=1,ln do huFzuSz_W4i=huFzuSz_W4i+1 bb[j]=D[huFzuSz_W4i-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=gbzt7Me()
   if nk>262144 then error("*$^Z%~[&$*@^A#%}A{[@|@}{AQ]?") end
   pr.k={}
   local lrk=(FFk7qAo4Rj+PjALK6VfdSU*A2KbsR+PjALK6VfdSU*PjALK6VfdSU*vdquKFn)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=gbzt7Me()
    local aw=DOAGbz4()-mm
    local b1w=DOAGbz4()-mm
    local b2w=DOAGbz4()+mm
    local cw=DOAGbz4()-mm
    lrk=(lrk+shS47KzA+math.floor(lrk/8))%65536
    pr.k[i]={[M76JhlP]=oe,[lo1i36I]=aw,[KCcjqjQ]=b1w,[cfGToRXud_]=b2w,[eyifPodR]=cw}
   end
   wyku6TO[PjALK6VfdSU]=pr
  end
  local wln=gbzt7Me()
  local wa=(1185530004-0) wb=(429824331+14-14) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   tDCkhl[i]=(D[huFzuSz_W4i]-pv2+256)%256
   huFzuSz_W4i=huFzuSz_W4i+1
  end
  local NsbeWQIei6E=#tDCkhl
  if NsbeWQIei6E<1 then NsbeWQIei6E=1 tDCkhl[1]=0 end
  return {P=wyku6TO,WM=tDCkhl,WMI=NsbeWQIei6E}
 end
 local h0cAdXb=0
 local ra6VH55gYj={} local l1RtEnLIP={}
 local function UxM99VP1dJ(l1,ITJxkHaXB,Yh3GBu,JRgLIyf,P6A7BiEn38,Yt9DmLOXI)
  local wyku6TO,tDCkhl,NsbeWQIei6E=l1.P,l1.WM,l1.WMI
  local u7Cbcu=wyku6TO[ITJxkHaXB]
  local T2XGFeF=u7Cbcu.k
  local Jliu47=u7Cbcu.c
  local C1Q_Aoi0b={}
  local ukhIub0is={}
  for DOQpz4y=1,u7Cbcu.ns do ukhIub0is[DOQpz4y]={} end
  local DP32hGA,kE0xHB9Z1,RYEmn90lVi=0,-1,1
  local OTRLYOmcT=P6A7BiEn38
  for DOQpz4y=1,u7Cbcu.pn do ukhIub0is[DOQpz4y].v=P6A7BiEn38[DOQpz4y] end
  local wL4wTLdRV,uMcIXDqw0=37,1
  local AKQ08Uuin,sGy1Yo,J5_FCB=false,0,0
  local WWlXitMWA=(FFk7qAo4Rj+ITJxkHaXB*A2KbsR+ITJxkHaXB*ITJxkHaXB*vdquKFn)%65536
  local nzZ3IPD,ONYy20v6H,kTWCSzTej,S_E7Ry1qgE,wIO73qActnB
  local S76WyJVz_,op
  while true do
   local XDmRFR43Y=((14825*4/4)+ITJxkHaXB*7919)%65536
   if XDmRFR43Y<256 then local _nop=1+1 end
   local HdevhSV2fY=((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2
   if HdevhSV2fY==0 then local _og=1+1 end
   S76WyJVz_=T2XGFeF[RYEmn90lVi]
   S76WyJVz_=T2XGFeF[RYEmn90lVi]
   S76WyJVz_=T2XGFeF[RYEmn90lVi]
   S76WyJVz_=T2XGFeF[RYEmn90lVi]
   op=(((S76WyJVz_[M76JhlP]-WWlXitMWA)+65536)%65536)
   WWlXitMWA=(WWlXitMWA+shS47KzA+math.floor(WWlXitMWA/8))%65536
   RYEmn90lVi=RYEmn90lVi+1
   local AVgidZM={}
   AVgidZM[0]=RYEmn90lVi+53
   AVgidZM[1]=RYEmn90lVi+-15
   AVgidZM[2]=RYEmn90lVi+-58
   AVgidZM[3]=RYEmn90lVi+-51
   AVgidZM[4]=RYEmn90lVi+-49
   AVgidZM[5]=RYEmn90lVi+8
   AVgidZM[6]=RYEmn90lVi+-85
   AVgidZM[7]=RYEmn90lVi+28
   local _jt=AVgidZM[(op%8)] if _jt and _jt~=RYEmn90lVi then RYEmn90lVi=_jt end
   if op<=20 then
   if op<=15 then
   if op<=9 then
   if op<=6 then
   if op<=3 then
   if op<=2 then
   if op<=0 then
   if op==(0+68-68) and (((wL4wTLdRV*wL4wTLdRV)-wL4wTLdRV)%2)==0 then
   C1Q_Aoi0b[DP32hGA]=not C1Q_Aoi0b[DP32hGA]
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=1 then
   if op==(1+71-71) then
   do
   local EuXlgANoHMa=C1Q_Aoi0b[DP32hGA]
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   DP32hGA=DP32hGA-1
   C1Q_Aoi0b[DP32hGA]=w0SWSxEd==EuXlgANoHMa
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((2+256)-256) and ((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2==0 then
   do
   if not C1Q_Aoi0b[DP32hGA] then RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_]) end
   DP32hGA=DP32hGA-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((3+256)-256) then
   do
   local odWfL4P=S76WyJVz_[lo1i36I]
   local undefined=S76WyJVz_[KCcjqjQ]
   local Jwm67YAVz=S76WyJVz_[eyifPodR]
   local pYWBse=xywvxQRH(ukhIub0is[odWfL4P].v(ukhIub0is[odWfL4P+1].v,ukhIub0is[odWfL4P+2].v))
   if pYWBse[1]~=nil then
     RYEmn90lVi=RYEmn90lVi+undefined
     ukhIub0is[odWfL4P+2].v=pYWBse[1]
     for DOQpz4y=1,Jwm67YAVz do ukhIub0is[odWfL4P+2+DOQpz4y]={v=pYWBse[DOQpz4y]} end
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=5 then
   if op<=4 then
   if op==(4+93-93) then
   do
   local cYJdgTplC=S76WyJVz_[lo1i36I]
   local odWfL4P=DP32hGA-2*cYJdgTplC
   for DOQpz4y=1,cYJdgTplC do
   local hVn5eAx=C1Q_Aoi0b[odWfL4P+2*DOQpz4y-2]
   local g6ePzBen=C1Q_Aoi0b[odWfL4P+2*DOQpz4y-1]
   local TsNJxlJM=C1Q_Aoi0b[odWfL4P+2*cYJdgTplC+DOQpz4y-1]
   if g6ePzBen==Yh3GBu then Yh3GBu[hVn5eAx]=TsNJxlJM else g6ePzBen[hVn5eAx]=TsNJxlJM end
   end
   DP32hGA=odWfL4P-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(5-0) then
   do
   local cYJdgTplC=S76WyJVz_[lo1i36I]
   if cYJdgTplC<0 then
   local nYjMrRBmq=OTRLYOmcT.n or #OTRLYOmcT
   for DOQpz4y=1,nYjMrRBmq do DP32hGA=DP32hGA+1 C1Q_Aoi0b[DP32hGA]=OTRLYOmcT[DOQpz4y] end
   kE0xHB9Z1=nYjMrRBmq
   else
   for DOQpz4y=1,cYJdgTplC do DP32hGA=DP32hGA+1 C1Q_Aoi0b[DP32hGA]=OTRLYOmcT[DOQpz4y] end
   kE0xHB9Z1=-1
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(6*4/4) then
   ukhIub0is[S76WyJVz_[lo1i36I]].v=C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=8 then
   if op<=7 then
   if op==(7-0) then
   do
   local undefined=C1Q_Aoi0b[DP32hGA-1]
   local undefined=XR6r3v(ITJxkHaXB,Jliu47[S76WyJVz_[lo1i36I]])
   RYEmn90lVi=RYEmn90lVi+1
   wIO73qActnB=C1Q_Aoi0b[DP32hGA-2]
   local MeEdSn=xywvxQRH(wIO73qActnB(undefined,undefined))
   DP32hGA=DP32hGA-3+MeEdSn.n
   for DOQpz4y=1,MeEdSn.n do C1Q_Aoi0b[DP32hGA-MeEdSn.n+DOQpz4y]=MeEdSn[DOQpz4y] end
   kE0xHB9Z1=MeEdSn.n
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(8-0) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   do
   local TsNJxlJM=C1Q_Aoi0b[DP32hGA] local hVn5eAx=C1Q_Aoi0b[DP32hGA-1] local g6ePzBen=C1Q_Aoi0b[DP32hGA-S76WyJVz_[lo1i36I]]
   g6ePzBen[hVn5eAx]=TsNJxlJM
   DP32hGA=DP32hGA-2
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(9-0) then
   do
   local cYJdgTplC=S76WyJVz_[lo1i36I]
   local MeEdSn={n=0}
   if cYJdgTplC<0 then
   local nYjMrRBmq=kE0xHB9Z1<0 and 0 or kE0xHB9Z1
   MeEdSn.n=nYjMrRBmq
   local ylC0Rt2BS=DP32hGA-nYjMrRBmq+1
   for DOQpz4y=1,nYjMrRBmq do MeEdSn[DOQpz4y]=C1Q_Aoi0b[ylC0Rt2BS+DOQpz4y-1] end
   else
   MeEdSn.n=cYJdgTplC
   for DOQpz4y=1,cYJdgTplC do MeEdSn[DOQpz4y]=C1Q_Aoi0b[DP32hGA-cYJdgTplC+DOQpz4y] end
   end
   return MeEdSn
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=11 then
   if op<=10 then
   if op==(10+35-35) then
   do
   local undefined=C1Q_Aoi0b[DP32hGA-1]
   local undefined=C1Q_Aoi0b[DP32hGA]
   RYEmn90lVi=RYEmn90lVi+1
   wIO73qActnB=C1Q_Aoi0b[DP32hGA-2]
   local MeEdSn=xywvxQRH(wIO73qActnB(undefined,undefined))
   DP32hGA=DP32hGA-3+MeEdSn.n
   for DOQpz4y=1,MeEdSn.n do C1Q_Aoi0b[DP32hGA-MeEdSn.n+DOQpz4y]=MeEdSn[DOQpz4y] end
   kE0xHB9Z1=MeEdSn.n
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(11-0) and ((7*J5_FCB*J5_FCB)+J5_FCB)%2==0 then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=Yh3GBu
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=13 then
   if op<=12 then
   if op==((12+256)-256) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   do
   local vBtq3Yp5vW=S76WyJVz_[lo1i36I]
   local Jwm67YAVz=S76WyJVz_[eyifPodR]
   local pYWBse=xywvxQRH(ukhIub0is[vBtq3Yp5vW].v(ukhIub0is[vBtq3Yp5vW+1].v,ukhIub0is[vBtq3Yp5vW+2].v))
   if pYWBse[1]~=nil then
   RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_])
   ukhIub0is[vBtq3Yp5vW+2].v=pYWBse[1]
   for DOQpz4y=1,Jwm67YAVz do ukhIub0is[vBtq3Yp5vW+2+DOQpz4y]={v=pYWBse[DOQpz4y]} end
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(13-0) and ((7*J5_FCB*J5_FCB)+J5_FCB)%2==0 then
   do
   local EuXlgANoHMa=C1Q_Aoi0b[DP32hGA]
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   DP32hGA=DP32hGA-1
   C1Q_Aoi0b[DP32hGA]=w0SWSxEd<=EuXlgANoHMa
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=14 then
   if op==(14+22-22) then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=nil
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(15+51-51) then
   do
   local odWfL4P=S76WyJVz_[lo1i36I]
   local Jwm67YAVz=S76WyJVz_[eyifPodR]
   if Jwm67YAVz<0 then Jwm67YAVz=(kE0xHB9Z1<0 and 0 or kE0xHB9Z1) end
   for DOQpz4y=1,Jwm67YAVz do
     DP32hGA=DP32hGA+1
     C1Q_Aoi0b[DP32hGA]=(odWfL4P+DOQpz4y-1)>=0 and ukhIub0is[odWfL4P+DOQpz4y-1].v or nil
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=17 then
   if op<=16 then
   if op==(16*4/4) then
   C1Q_Aoi0b[DP32hGA+1]=C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA+1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((17+256)-256) then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=false
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=19 then
   if op<=18 then
   if op==((18+256)-256) then
   error("[X}@*~<~Q?X{{]][^{$%^%$<$**@".."::ESCAPE-OP="..tostring(op))
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(19+57-57) then
   do
   local cYJdgTplC=S76WyJVz_[lo1i36I]
   if cYJdgTplC>=0 then
   local g6ePzBen=C1Q_Aoi0b[DP32hGA-cYJdgTplC-1]
   local C7BghSGCr=jqa8AqfZ[g6ePzBen] or 0
   for DOQpz4y=1,cYJdgTplC do g6ePzBen[C7BghSGCr+DOQpz4y]=C1Q_Aoi0b[DP32hGA-cYJdgTplC+DOQpz4y] end
   jqa8AqfZ[g6ePzBen]=C7BghSGCr+cYJdgTplC
   DP32hGA=DP32hGA-cYJdgTplC-1
   else
   local TCzgvufS=(-cYJdgTplC)-1
   local eldYBoQMyxk=kE0xHB9Z1<0 and 0 or kE0xHB9Z1
   local MzezKS=TCzgvufS+eldYBoQMyxk
   local odWfL4P=DP32hGA-MzezKS
   local g6ePzBen=C1Q_Aoi0b[odWfL4P-1]
   local C7BghSGCr=jqa8AqfZ[g6ePzBen] or 0
   for DOQpz4y=1,MzezKS do g6ePzBen[C7BghSGCr+DOQpz4y]=C1Q_Aoi0b[odWfL4P+DOQpz4y-1] end
   jqa8AqfZ[g6ePzBen]=C7BghSGCr+MzezKS
   kE0xHB9Z1=-1
   DP32hGA=odWfL4P-1
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((20+256)-256) then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=Yh3GBu[XR6r3v(ITJxkHaXB,Jliu47[S76WyJVz_[lo1i36I]])]
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=42 then
   if op<=34 then
   if op<=30 then
   if op<=24 then
   if op<=22 then
   if op<=21 then
   if op==(21+93-93) and ((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2==0 then
   do
   local EuXlgANoHMa=C1Q_Aoi0b[DP32hGA]
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   DP32hGA=DP32hGA-1
   C1Q_Aoi0b[DP32hGA]=w0SWSxEd + EuXlgANoHMa
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22+33-33) then
   do
   local undefined=C1Q_Aoi0b[DP32hGA]
   RYEmn90lVi=RYEmn90lVi+1
   wIO73qActnB=C1Q_Aoi0b[DP32hGA-1]
   local MeEdSn=xywvxQRH(wIO73qActnB(undefined))
   DP32hGA=DP32hGA-2+MeEdSn.n
   for DOQpz4y=1,MeEdSn.n do C1Q_Aoi0b[DP32hGA-MeEdSn.n+DOQpz4y]=MeEdSn[DOQpz4y] end
   kE0xHB9Z1=MeEdSn.n
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=23 then
   if op==((23+256)-256) and ((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2==0 then
   do
   local EuXlgANoHMa=C1Q_Aoi0b[DP32hGA]
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   DP32hGA=DP32hGA-1
   C1Q_Aoi0b[DP32hGA]=w0SWSxEd * EuXlgANoHMa
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(24-0) and (((J5_FCB*J5_FCB)-J5_FCB)%2)==0 then
   do end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=26 then
   if op<=25 then
   if op==(25+43-43) and (((wL4wTLdRV*wL4wTLdRV)-wL4wTLdRV)%2)==0 then
   do
   local C7BghSGCr=S76WyJVz_[lo1i36I]
   local JUPmy6k3eU=C1Q_Aoi0b[DP32hGA-C7BghSGCr+1]
   for DOQpz4y=DP32hGA-C7BghSGCr+2,DP32hGA do JUPmy6k3eU=JUPmy6k3eU..C1Q_Aoi0b[DOQpz4y] end
   DP32hGA=DP32hGA-C7BghSGCr+1
   C1Q_Aoi0b[DP32hGA]=JUPmy6k3eU
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(26-0) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   C1Q_Aoi0b[DP32hGA-1]=C1Q_Aoi0b[DP32hGA-1]<C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=27 then
   if op==(27*4/4) then
   C1Q_Aoi0b[DP32hGA]=-C1Q_Aoi0b[DP32hGA]
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=28 then
   if op==(28*4/4) and ((J5_FCB*J5_FCB+J5_FCB)%2)==0 then
   RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_])
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=29 then
   if op==(29*4/4) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   do
   local hVn5eAx=C1Q_Aoi0b[DP32hGA] local g6ePzBen=C1Q_Aoi0b[DP32hGA-1]
   C1Q_Aoi0b[DP32hGA-1]=g6ePzBen[hVn5eAx]
   DP32hGA=DP32hGA-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(30*4/4) and ((7*J5_FCB*J5_FCB)+J5_FCB)%2==0 then
   do
   local TsNJxlJM=C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   if TsNJxlJM then RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_]) end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   else
   if op<=31 then
   if op==(31+98-98) then
   do
   local HIm27mOxgWc=S76WyJVz_[eyifPodR]
   local hJLsR7jj=HIm27mOxgWc<0 and ((-HIm27mOxgWc-1)+(kE0xHB9Z1<0 and 0 or kE0xHB9Z1)) or HIm27mOxgWc
   local cYJdgTplC=S76WyJVz_[lo1i36I]
   if hJLsR7jj>cYJdgTplC then
   DP32hGA=DP32hGA-hJLsR7jj+cYJdgTplC
   elseif hJLsR7jj<cYJdgTplC then
   while hJLsR7jj<cYJdgTplC do DP32hGA=DP32hGA+1 C1Q_Aoi0b[DP32hGA]=nil hJLsR7jj=hJLsR7jj+1 end
   end
   kE0xHB9Z1=-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=33 then
   if op<=32 then
   if op==(32+83-83) then
   do
   local g6ePzBen=C1Q_Aoi0b[DP32hGA]
   C1Q_Aoi0b[DP32hGA]=C1Q_Aoi0b[DP32hGA-1] ^ g6ePzBen
   DP32hGA=DP32hGA-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(33-0) then
   do
   local undefined=S76WyJVz_[eyifPodR]
   local undefined=XR6r3v(ITJxkHaXB,undefined)
   if undefined<#wyku6TO[1].consts then
     DP32hGA=DP32hGA+1
     C1Q_Aoi0b[DP32hGA]=UxM99VP1dJ(0,Yh3GBu,wyku6TO[1].uv,{n=1,undefined},Yt9DmLOXI)
   else
     DP32hGA=DP32hGA+1
     C1Q_Aoi0b[DP32hGA]=nil
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(34+22-22) then
   do
   local vBtq3Yp5vW=S76WyJVz_[lo1i36I]
   local Jwm67YAVz=ukhIub0is[vBtq3Yp5vW].v+ukhIub0is[vBtq3Yp5vW+3].v
   local ViZJfNcD=ukhIub0is[vBtq3Yp5vW+2].v
   local jbCXpAkC=ukhIub0is[vBtq3Yp5vW+3].v
   if (jbCXpAkC>0 and Jwm67YAVz<=ViZJfNcD) or (jbCXpAkC<0 and Jwm67YAVz>=ViZJfNcD) then
   ukhIub0is[vBtq3Yp5vW]={v=Jwm67YAVz}
   ukhIub0is[vBtq3Yp5vW+1].v=Jwm67YAVz
   RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_])
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=41 then
   if op<=39 then
   if op<=37 then
   if op<=36 then
   if op<=35 then
   if op==(35-0) then
   do
   local odWfL4P=S76WyJVz_[lo1i36I]
   local undefined=S76WyJVz_[KCcjqjQ]
   ukhIub0is[odWfL4P].v=ukhIub0is[odWfL4P].v
   ukhIub0is[odWfL4P+1].v=ukhIub0is[odWfL4P+1].v
   ukhIub0is[odWfL4P+2].v=ukhIub0is[odWfL4P+2].v
   RYEmn90lVi=RYEmn90lVi+undefined
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(36*4/4) and ((7*J5_FCB*J5_FCB)+J5_FCB)%2==0 then
   do
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   C1Q_Aoi0b[DP32hGA-1]=w0SWSxEd - C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(37*4/4) and (((J5_FCB*J5_FCB)-J5_FCB)%2)==0 then
   do
   local vBtq3Yp5vW=S76WyJVz_[lo1i36I]
   local Jwm67YAVz=S76WyJVz_[eyifPodR]
   local XTGFNNN0Oh=C1Q_Aoi0b[DP32hGA] local Ppa6BtNgEH=C1Q_Aoi0b[DP32hGA-1] local f8S0FYJaLW=C1Q_Aoi0b[DP32hGA-2]
   DP32hGA=DP32hGA-3
   ukhIub0is[vBtq3Yp5vW].v=f8S0FYJaLW
   ukhIub0is[vBtq3Yp5vW+1].v=Ppa6BtNgEH
   ukhIub0is[vBtq3Yp5vW+2].v=XTGFNNN0Oh
   local pYWBse=xywvxQRH(ukhIub0is[vBtq3Yp5vW].v(ukhIub0is[vBtq3Yp5vW+1].v,ukhIub0is[vBtq3Yp5vW+2].v))
   if pYWBse[1]==nil then
   RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_])
   else
   ukhIub0is[vBtq3Yp5vW+2].v=pYWBse[1]
   for DOQpz4y=1,Jwm67YAVz do ukhIub0is[vBtq3Yp5vW+2+DOQpz4y]={v=pYWBse[DOQpz4y]} end
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=38 then
   if op==(38-0) and ((J5_FCB*J5_FCB+J5_FCB)%2)==0 then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=true
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(39*4/4) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   if kE0xHB9Z1>1 then DP32hGA=DP32hGA-kE0xHB9Z1+1 end
   kE0xHB9Z1=-1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=40 then
   if op==(40-0) and (((J5_FCB*J5_FCB)-J5_FCB)%2)==0 then
   DP32hGA=DP32hGA+1
   local g6ePzBen={}
   jqa8AqfZ[g6ePzBen]=0
   C1Q_Aoi0b[DP32hGA]=g6ePzBen
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41-0) and (((J5_FCB*J5_FCB)-J5_FCB)%2)==0 then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=XR6r3v(ITJxkHaXB,Jliu47[S76WyJVz_[lo1i36I]])
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(42+33-33) then
   do
   local cYJdgTplC,rKuBwa=S76WyJVz_[lo1i36I],S76WyJVz_[KCcjqjQ]
   ONYy20v6H=cYJdgTplC<0 and (kE0xHB9Z1<0 and 0 or kE0xHB9Z1) or cYJdgTplC
   kTWCSzTej=0
   S_E7Ry1qgE=DP32hGA-ONYy20v6H-1-kTWCSzTej
   wIO73qActnB=C1Q_Aoi0b[S_E7Ry1qgE]
   local MeEdSn
   if type(wIO73qActnB)=='table' and wIO73qActnB.pid then
   local hfWkBodtzWU={n=ONYy20v6H}
   for DOQpz4y=1,ONYy20v6H do hfWkBodtzWU[DOQpz4y]=C1Q_Aoi0b[S_E7Ry1qgE+kTWCSzTej+DOQpz4y] end
   MeEdSn=UxM99VP1dJ(wIO73qActnB.pid,wIO73qActnB.env,wIO73qActnB.uv,hfWkBodtzWU,Yt9DmLOXI)
   else
   MeEdSn=xywvxQRH(wIO73qActnB(MLoWfSdtuC(C1Q_Aoi0b,S_E7Ry1qgE+1+kTWCSzTej,DP32hGA)))
   end
   if rKuBwa==0 then
   DP32hGA=S_E7Ry1qgE-1
   kE0xHB9Z1=-1
   elseif rKuBwa==-1 then
   nzZ3IPD=MeEdSn.n
   for DOQpz4y=1,nzZ3IPD do C1Q_Aoi0b[S_E7Ry1qgE+DOQpz4y-1]=MeEdSn[DOQpz4y] end
   DP32hGA=S_E7Ry1qgE+nzZ3IPD-1
   kE0xHB9Z1=nzZ3IPD
   else
   for DOQpz4y=1,rKuBwa do C1Q_Aoi0b[S_E7Ry1qgE+DOQpz4y-1]=MeEdSn[DOQpz4y] end
   DP32hGA=S_E7Ry1qgE+rKuBwa-1
   kE0xHB9Z1=-1
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=51 then
   if op<=49 then
   if op<=45 then
   if op<=44 then
   if op<=43 then
   if op==(43*4/4) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=JRgLIyf[S76WyJVz_[lo1i36I]].v
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(44*4/4) then
   do
   local g6ePzBen=ukhIub0is[S76WyJVz_[lo1i36I]].v
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]=g6ePzBen
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(45*4/4) then
   do
   local b28EOu=S76WyJVz_[lo1i36I]
   local nLdqeIa=wyku6TO[b28EOu]
   local xEu6PS7Zc={}
   for DOQpz4y=1,#nLdqeIa.uv do
   local hN7l3g2Mvc=nLdqeIa.uv[DOQpz4y]
   if hN7l3g2Mvc[1]==1 then xEu6PS7Zc[DOQpz4y]=ukhIub0is[hN7l3g2Mvc[2]] else xEu6PS7Zc[DOQpz4y]=JRgLIyf[hN7l3g2Mvc[2]] end
   end
   DP32hGA=DP32hGA+1
   C1Q_Aoi0b[DP32hGA]={pid=b28EOu,env=Yh3GBu,uv=xEu6PS7Zc}
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=47 then
   if op<=46 then
   if op==(46*4/4) then
   do
   local vBtq3Yp5vW=S76WyJVz_[lo1i36I]
   local jbCXpAkC=C1Q_Aoi0b[DP32hGA]
   local ViZJfNcD=C1Q_Aoi0b[DP32hGA-1]
   local ylC0Rt2BS=C1Q_Aoi0b[DP32hGA-2]
   DP32hGA=DP32hGA-3
   ukhIub0is[vBtq3Yp5vW]={v=ylC0Rt2BS}
   ukhIub0is[vBtq3Yp5vW+1].v=ylC0Rt2BS
   ukhIub0is[vBtq3Yp5vW+2].v=ViZJfNcD
   ukhIub0is[vBtq3Yp5vW+3].v=jbCXpAkC
   if (jbCXpAkC>0 and ylC0Rt2BS>ViZJfNcD) or (jbCXpAkC<0 and ylC0Rt2BS<ViZJfNcD) then RYEmn90lVi=RYEmn90lVi+(S76WyJVz_[KCcjqjQ]+S76WyJVz_[cfGToRXud_]) end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(47-0) and (((wL4wTLdRV*wL4wTLdRV)-wL4wTLdRV)%2)==0 then
   do
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   C1Q_Aoi0b[DP32hGA-1]=w0SWSxEd % C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=48 then
   if op==(48+51-51) then
   JRgLIyf[S76WyJVz_[lo1i36I]].v=C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(49+92-92) and ((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2==0 then
   do
   local odWfL4P,nYjMrRBmq=S76WyJVz_[lo1i36I],S76WyJVz_[KCcjqjQ]
   local w6YvtJYrYjA=DP32hGA-nYjMrRBmq
   for DOQpz4y=1,nYjMrRBmq do ukhIub0is[odWfL4P+DOQpz4y-1].v=C1Q_Aoi0b[w6YvtJYrYjA+DOQpz4y] end
   DP32hGA=w6YvtJYrYjA
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=50 then
   if op==(50*4/4) then
   C1Q_Aoi0b[DP32hGA]=#C1Q_Aoi0b[DP32hGA]
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(51*4/4) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   local g6ePzBen=C1Q_Aoi0b[DP32hGA]
   C1Q_Aoi0b[DP32hGA]=C1Q_Aoi0b[DP32hGA-1]
   C1Q_Aoi0b[DP32hGA-1]=g6ePzBen
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=56 then
   if op<=54 then
   if op<=52 then
   if op==((52+256)-256) then
   Yh3GBu[XR6r3v(ITJxkHaXB,Jliu47[S76WyJVz_[lo1i36I]])]=C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=53 then
   if op==(53*4/4) then
   do
   local w0SWSxEd=C1Q_Aoi0b[DP32hGA-1]
   C1Q_Aoi0b[DP32hGA-1]=w0SWSxEd / C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA-1
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((54+256)-256) and (((J5_FCB*J5_FCB)-J5_FCB)%2)==0 then
   do
   local cYJdgTplC,rKuBwa=S76WyJVz_[lo1i36I],S76WyJVz_[KCcjqjQ]
   ONYy20v6H=cYJdgTplC<0 and (kE0xHB9Z1<0 and 0 or kE0xHB9Z1) or cYJdgTplC
   kTWCSzTej=1
   S_E7Ry1qgE=DP32hGA-ONYy20v6H-1-kTWCSzTej
   wIO73qActnB=C1Q_Aoi0b[S_E7Ry1qgE]
   local MeEdSn
   if type(wIO73qActnB)=='table' and wIO73qActnB.pid then
   local hfWkBodtzWU={n=ONYy20v6H}
   for DOQpz4y=1,ONYy20v6H do hfWkBodtzWU[DOQpz4y]=C1Q_Aoi0b[S_E7Ry1qgE+kTWCSzTej+DOQpz4y] end
   MeEdSn=UxM99VP1dJ(wIO73qActnB.pid,wIO73qActnB.env,wIO73qActnB.uv,hfWkBodtzWU,Yt9DmLOXI)
   else
   MeEdSn=xywvxQRH(wIO73qActnB(MLoWfSdtuC(C1Q_Aoi0b,S_E7Ry1qgE+1+kTWCSzTej,DP32hGA)))
   end
   if rKuBwa==0 then
   DP32hGA=S_E7Ry1qgE-1
   kE0xHB9Z1=-1
   elseif rKuBwa==-1 then
   nzZ3IPD=MeEdSn.n
   for DOQpz4y=1,nzZ3IPD do C1Q_Aoi0b[S_E7Ry1qgE+DOQpz4y-1]=MeEdSn[DOQpz4y] end
   DP32hGA=S_E7Ry1qgE+nzZ3IPD-1
   kE0xHB9Z1=nzZ3IPD
   else
   for DOQpz4y=1,rKuBwa do C1Q_Aoi0b[S_E7Ry1qgE+DOQpz4y-1]=MeEdSn[DOQpz4y] end
   DP32hGA=S_E7Ry1qgE+rKuBwa-1
   kE0xHB9Z1=-1
   end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=55 then
   if op==(55-0) then
   local g6ePzBen=C1Q_Aoi0b[DP32hGA]
   C1Q_Aoi0b[DP32hGA]=C1Q_Aoi0b[DP32hGA-1]
   C1Q_Aoi0b[DP32hGA-1]=g6ePzBen
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((56+256)-256) and ((wL4wTLdRV*wL4wTLdRV+wL4wTLdRV)%2)==0 then
   do
   local ONYy20v6H=S76WyJVz_[lo1i36I]
   local undefined=S76WyJVz_[eyifPodR]
   local g6ePzBen=RYEmn90lVi+1
   RYEmn90lVi=g6ePzBen
   DP32hGA=DP32hGA+ONYy20v6H
   wIO73qActnB=C1Q_Aoi0b[DP32hGA-ONYy20v6H]
   local MeEdSn=xywvxQRH(wIO73qActnB(MLoWfSdtuC(C1Q_Aoi0b,DP32hGA-ONYy20v6H+1,DP32hGA)))
   if undefined==0 then DP32hGA=DP32hGA-ONYy20v6H-1 kE0xHB9Z1=-1
   elseif undefined==-1 then nzZ3IPD=MeEdSn.n for DOQpz4y=1,nzZ3IPD do C1Q_Aoi0b[DP32hGA-ONYy20v6H+DOQpz4y]=MeEdSn[DOQpz4y] end DP32hGA=DP32hGA-ONYy20v6H+nzZ3IPD-1 kE0xHB9Z1=nzZ3IPD
   else nzZ3IPD=undefined for DOQpz4y=1,nzZ3IPD do C1Q_Aoi0b[DP32hGA-ONYy20v6H+DOQpz4y]=MeEdSn[DOQpz4y] end DP32hGA=DP32hGA-ONYy20v6H+nzZ3IPD-1 kE0xHB9Z1=nzZ3IPD end
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=100 then
   if op<=57 then
   if op==(57-0) and ((J5_FCB*J5_FCB+J5_FCB)%2)==0 then
   do
   local TsNJxlJM=C1Q_Aoi0b[DP32hGA] local hVn5eAx=C1Q_Aoi0b[DP32hGA-1] local g6ePzBen=C1Q_Aoi0b[DP32hGA-2]
   g6ePzBen[hVn5eAx]=TsNJxlJM
   DP32hGA=DP32hGA-3
   end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=58 then
   if op==((58+256)-256) then
   DP32hGA=DP32hGA-S76WyJVz_[lo1i36I]
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==100 and ((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2==0 then
   do local _d=1+1 C1Q_Aoi0b[DP32hGA]=C1Q_Aoi0b[DP32hGA] end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=101 then
   if op==101 then
   C1Q_Aoi0b[DP32hGA+1]=C1Q_Aoi0b[DP32hGA]
   DP32hGA=DP32hGA+1
   DP32hGA=DP32hGA-1
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==102 and ((7*wL4wTLdRV*wL4wTLdRV)+wL4wTLdRV)%2==0 then
   do local g6ePzBen=C1Q_Aoi0b[DP32hGA] C1Q_Aoi0b[DP32hGA]=g6ePzBen end
   else
   error("{>>~#$%[||XA@$[%*!<>Z~{%!QZ|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   end
  end
 end
 local saSJ7RYZ_Ob=xywvxQRH(...)
 local yPNbWpN0=setmetatable({}, {__add=function() return UxM99VP1dJ(UxM99VP1dJ_decode(),1,_ENV,{},saSJ7RYZ_Ob,nil) end})
 return yPNbWpN0 + -7
end)(ymWDYvK)