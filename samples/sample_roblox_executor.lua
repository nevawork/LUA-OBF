-- NEVAHEX-VM v3 'Hex' — protected artifact — #<~Z}}{Q?{<~() runs it

return (function(o7dwawaz5, ...)
 local rnxO8fZV=setmetatable({},{__mode="k"})
 local function HbZqItU3xm(...) local n=select('#',...) return {n=n,...} end
 local function Vgfu6e7ypis(e,k) if type(e)~="table" then return end return rawget(e,k) end
 local function RgHN34tAE(e,k) local v=Vgfu6e7ypis(e,k) return type(v)=="table" and v end
 local bxsbjG=(type(_ENV)=="table" and _ENV) or (type(_G)=="table" and _G) or {}
 local haDCwVi=RgHN34tAE(bxsbjG,"table")
 local Jrwo5XOzHZ=Vgfu6e7ypis(bxsbjG,"unpack") or Vgfu6e7ypis(haDCwVi,"unpack") or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function ClROGmBE7x4(t,i,j)
  if i>j then return end
  if Jrwo5XOzHZ and j-i>15 then return Jrwo5XOzHZ(t,i,j) end
  return t[i],ClROGmBE7x4(t,i+1,j)
 end
 local vvSccUds19=Vgfu6e7ypis(RgHN34tAE(bxsbjG,"string"),"char") or (type(_G)=="table" and Vgfu6e7ypis(RgHN34tAE(_G,"string"),"char")) or string.char
 local lkgskgwV=Vgfu6e7ypis(RgHN34tAE(bxsbjG,"table"),"concat") or (type(_G)=="table" and Vgfu6e7ypis(RgHN34tAE(_G,"table"),"concat")) or table.concat
 local LQzL9iBN4C=vvSccUds19
 local ekJXmFqK=lkgskgwV
 local z_ypNAe=(723095-0) ams7qH0=(55423+16-16) WhQcafpRGAr=(153493*4/4) akV85DqSl=(638128*4/4) n35R_oLih=((894748+256)-256)
 local cnTGtjefkT=(15128-0) C7ez23SdnL=(1215691*4/4) G9hHzZ3u_yo=(1490165+60-60) YRFwnVbh5t8=((99669+256)-256)
 local i13_x9=((648345715+256)-256) _G.__CK0=tostring(i13_x9)
 local U4w2WXdzGO=0 uCwYkjH=0
 local function Sgkpr4Y(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((i13_x9+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=LQzL9iBN4C(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=ekJXmFqK(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local zdCRcvsHFF="\128\148\235\219[*\243s\215\201r\\\137\255j\240~f`\152\173\199RcR\022\193`\209\157\1978\\X\038V;rF\\d\212\012\039^\1801y\003?\229I\005\232\030,R\156\024\144v\229n\129~\\\235\038\031J\177\150\201Mk\211\149\253\251\237\151\190\005d\220j\209\168\211W\143.\170\011\224\017=\002\196a\213\198\163\205-\197\135X1\012\190t\003\147\205\163\2437\192yEy\1280\253\146\230U4\036\132\214\191\211=8\153\216\201Z\021\1780\038\233\252\013\020D\132\210\151\207\227\246\184\237d\246^\159z\128\029\224\026\253W\161\208\155R\164\029_I\027\"=i\2413\158\204\131f,\026\039\232\159\190\006\037"
 local function Vh_PEth_decode()
  local D={} local bn=#zdCRcvsHFF
  if bn>4194304 then error("}%^#[@~X@?!*[$<ZA*>&%<X^$$&{") end
  local sa=(1147673156-0) sb=(9275021+48-48) MM=2147483647
 do
   local __fp=_VERSION or ""
   local __bits={"game","workspace","script","getgenv","hookfunction","newcclosure","islclosure"}
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
   D[i]=(sbyte(zdCRcvsHFF,i)-pv+256)%256
  end
  local qTRSrX1_cj=1
  local function r7wWoJ() local bt=D[qTRSrX1_cj] qTRSrX1_cj=qTRSrX1_cj+1 return bt end
  local function fkbvYJY()
   local sh,r=0,0
   while true do
    local bt=r7wWoJ()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function VUqrdQ()
   local u=fkbvYJY()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local bM99pMinrrR=r7wWoJ()
  if bM99pMinrrR<128 then error("#|[#|Z&@~[A}@|?{Q}|^&>]}>%^{") end
  for i=1,bM99pMinrrR-128 do r7wWoJ() end
  local ihymxn=fkbvYJY()
  if ihymxn>4096 then error("@Q$<<[@^|#!ZZX>!&!{*?%Z]<*Z*") end
  local WWMw9KnW={} local hm4WxB={}
  for lWV16XQ5UN=1,ihymxn do
   local pr={}
   pr.pn=r7wWoJ()
   pr.va=r7wWoJ()==1
   local nu=fkbvYJY()
   pr.uv={}
   for i=1,nu do pr.uv[i]={r7wWoJ()==1 and 1 or 0,fkbvYJY()} end
   pr.ns=fkbvYJY()
   fkbvYJY() fkbvYJY() fkbvYJY() fkbvYJY() fkbvYJY()
   local nc=fkbvYJY()
   if nc>65536 then error("[~>*^]<?Z}A>}?Z}?$@Z]Q[%ZA%^") end
   pr.c={}
   for i=1,nc do
    local tag=r7wWoJ()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=fkbvYJY()
     local bb={}
     for j=1,ln do qTRSrX1_cj=qTRSrX1_cj+1 bb[j]=D[qTRSrX1_cj-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=fkbvYJY()
   if nk>262144 then error("}<>>?{[AA$~?{X~!QQ$|?!@~?<}@") end
   pr.k={}
   local lrk=(cnTGtjefkT+lWV16XQ5UN*C7ez23SdnL+lWV16XQ5UN*lWV16XQ5UN*G9hHzZ3u_yo)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=fkbvYJY()
    local aw=VUqrdQ()-mm
    local b1w=VUqrdQ()-mm
    local b2w=VUqrdQ()+mm
    local cw=VUqrdQ()-mm
    lrk=(lrk+YRFwnVbh5t8+math.floor(lrk/8))%65536
    pr.k[i]={[z_ypNAe]=oe,[ams7qH0]=aw,[WhQcafpRGAr]=b1w,[akV85DqSl]=b2w,[n35R_oLih]=cw}
   end
   WWMw9KnW[lWV16XQ5UN]=pr
  end
  local wln=fkbvYJY()
  local wa=((1112527368+256)-256) wb=(494439383*4/4) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   hm4WxB[i]=(D[qTRSrX1_cj]-pv2+256)%256
   qTRSrX1_cj=qTRSrX1_cj+1
  end
  local UeelS694=#hm4WxB
  if UeelS694<1 then UeelS694=1 hm4WxB[1]=0 end
  return {P=WWMw9KnW,WM=hm4WxB,WMI=UeelS694}
 end
 local ofExez=0
 local NEL4ZO={} local tsJernBj9YL={}
 local function Vh_PEth(l1,yxbz7Ma3_Q,Q86MlApk,sUB20UWS7,AQxsbPelRmp,BERVRmEV)
  local WWMw9KnW,hm4WxB,UeelS694=l1.P,l1.WM,l1.WMI
  local vRwosg=WWMw9KnW[yxbz7Ma3_Q]
  local IuB34RNfMdo=vRwosg.k
  local aQyu0OV4Nx=vRwosg.c
  local apVhuv1F={}
  local oW04V2axAx={}
  for Zw1Wko0YAU=1,vRwosg.ns do oW04V2axAx[Zw1Wko0YAU]={} end
  local f471TEABSH,cOXEV5GR,ICq9SP=0,-1,1
  local IRHTI8BFC=AQxsbPelRmp
  for Zw1Wko0YAU=1,vRwosg.pn do oW04V2axAx[Zw1Wko0YAU].v=AQxsbPelRmp[Zw1Wko0YAU] end
  local c5LKLCtl9g,CsbMgD7_3B=37,1
  local XlRPgjGG,HMxZF0jqr,U5ZX_S0Mk=false,0,0
  local UjM2uNTk5=(cnTGtjefkT+yxbz7Ma3_Q*C7ez23SdnL+yxbz7Ma3_Q*yxbz7Ma3_Q*G9hHzZ3u_yo)%65536
  local j_m40YrqwK,iPE3013YGr,uq_pISLRlF,sdtaJxi4,ZIpbskayIdq
  local T3tdBScNsMJ,op
  while true do
   T3tdBScNsMJ=IuB34RNfMdo[ICq9SP]
   T3tdBScNsMJ=IuB34RNfMdo[ICq9SP]
   T3tdBScNsMJ=IuB34RNfMdo[ICq9SP]
   T3tdBScNsMJ=IuB34RNfMdo[ICq9SP]
   op=(((T3tdBScNsMJ[z_ypNAe]-UjM2uNTk5)+65536)%65536)
   UjM2uNTk5=(UjM2uNTk5+YRFwnVbh5t8+math.floor(UjM2uNTk5/8))%65536
   ICq9SP=ICq9SP+1
   if op<=23 then
   if op<=11 then
   if op<=5 then
   if op<=4 then
   if op<=1 then
   if op<=0 then
   if op==(0+78-78) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   apVhuv1F[f471TEABSH]=not apVhuv1F[f471TEABSH]
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((1+256)-256) then
   do
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1] / FcPK6gXAz
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=2 then
   if op==(2-0) then
   do
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1] - FcPK6gXAz
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=3 then
   if op==(3*4/4) and ((U5ZX_S0Mk*U5ZX_S0Mk+U5ZX_S0Mk)%2)==0 then
   apVhuv1F[f471TEABSH-1]=apVhuv1F[f471TEABSH-1]==apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(4+67-67) and (((c5LKLCtl9g*c5LKLCtl9g)-c5LKLCtl9g)%2)==0 then
   do
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1] + FcPK6gXAz
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==(5*4/4) then
   f471TEABSH=f471TEABSH+1
   local FcPK6gXAz={}
   rnxO8fZV[FcPK6gXAz]=0
   apVhuv1F[f471TEABSH]=FcPK6gXAz
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=9 then
   if op<=8 then
   if op<=6 then
   if op==((6+256)-256) and ((U5ZX_S0Mk*U5ZX_S0Mk+U5ZX_S0Mk)%2)==0 then
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]=true
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=7 then
   if op==(7-0) then
   do
   local d3Gm4ouL3=T3tdBScNsMJ[ams7qH0]
   local iateikfD_T=apVhuv1F[f471TEABSH]
   local wmam6ROlO=apVhuv1F[f471TEABSH-1]
   local ofq8f0=apVhuv1F[f471TEABSH-2]
   f471TEABSH=f471TEABSH-3
   oW04V2axAx[d3Gm4ouL3]={v=ofq8f0}
   oW04V2axAx[d3Gm4ouL3+1].v=ofq8f0
   oW04V2axAx[d3Gm4ouL3+2].v=wmam6ROlO
   oW04V2axAx[d3Gm4ouL3+3].v=iateikfD_T
   if (iateikfD_T>0 and ofq8f0>wmam6ROlO) or (iateikfD_T<0 and ofq8f0<wmam6ROlO) then ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl]) end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(8*4/4) and ((U5ZX_S0Mk*U5ZX_S0Mk+U5ZX_S0Mk)%2)==0 then
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]=Q86MlApk
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(9-0) then
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]=nil
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=10 then
   if op==((10+256)-256) and (((U5ZX_S0Mk*U5ZX_S0Mk)-U5ZX_S0Mk)%2)==0 then
   do
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1] ^ FcPK6gXAz
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(11-0) and ((7*c5LKLCtl9g*c5LKLCtl9g)+c5LKLCtl9g)%2==0 then
   do
   local K3ktjQlk=apVhuv1F[f471TEABSH]
   local NPyyiS=apVhuv1F[f471TEABSH-1]
   f471TEABSH=f471TEABSH-1
   apVhuv1F[f471TEABSH]=NPyyiS<K3ktjQlk
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=16 then
   if op<=15 then
   if op<=14 then
   if op<=12 then
   if op==(12*4/4) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   apVhuv1F[f471TEABSH+1]=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH+1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=13 then
   if op==(13+85-85) and (((U5ZX_S0Mk*U5ZX_S0Mk)-U5ZX_S0Mk)%2)==0 then
   sUB20UWS7[T3tdBScNsMJ[ams7qH0]].v=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(14+88-88) and (((c5LKLCtl9g*c5LKLCtl9g)-c5LKLCtl9g)%2)==0 then
   apVhuv1F[f471TEABSH]=-apVhuv1F[f471TEABSH]
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((15+256)-256) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   do
   local Unt6ldgEH=T3tdBScNsMJ[ams7qH0]
   if Unt6ldgEH<0 then
   local qrAqctqgr=IRHTI8BFC.n or #IRHTI8BFC
   for Zw1Wko0YAU=1,qrAqctqgr do f471TEABSH=f471TEABSH+1 apVhuv1F[f471TEABSH]=IRHTI8BFC[Zw1Wko0YAU] end
   cOXEV5GR=qrAqctqgr
   else
   for Zw1Wko0YAU=1,Unt6ldgEH do f471TEABSH=f471TEABSH+1 apVhuv1F[f471TEABSH]=IRHTI8BFC[Zw1Wko0YAU] end
   cOXEV5GR=-1
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(16*4/4) then
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]=sUB20UWS7[T3tdBScNsMJ[ams7qH0]].v
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=20 then
   if op<=18 then
   if op<=17 then
   if op==(17*4/4) and (((U5ZX_S0Mk*U5ZX_S0Mk)-U5ZX_S0Mk)%2)==0 then
   do end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((18+256)-256) then
   do
   local d3Gm4ouL3=T3tdBScNsMJ[ams7qH0]
   local Toxls6=T3tdBScNsMJ[n35R_oLih]
   local D7VeFJ=apVhuv1F[f471TEABSH] local FrJXKc1uW=apVhuv1F[f471TEABSH-1] local V_BygdTh_6y=apVhuv1F[f471TEABSH-2]
   f471TEABSH=f471TEABSH-3
   oW04V2axAx[d3Gm4ouL3].v=V_BygdTh_6y
   oW04V2axAx[d3Gm4ouL3+1].v=FrJXKc1uW
   oW04V2axAx[d3Gm4ouL3+2].v=D7VeFJ
   local dRoR7GDhriY=HbZqItU3xm(oW04V2axAx[d3Gm4ouL3].v(oW04V2axAx[d3Gm4ouL3+1].v,oW04V2axAx[d3Gm4ouL3+2].v))
   if dRoR7GDhriY[1]==nil then
   ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl])
   else
   oW04V2axAx[d3Gm4ouL3+2].v=dRoR7GDhriY[1]
   for Zw1Wko0YAU=1,Toxls6 do oW04V2axAx[d3Gm4ouL3+2+Zw1Wko0YAU]={v=dRoR7GDhriY[Zw1Wko0YAU]} end
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=19 then
   if op==(19+26-26) then
   apVhuv1F[f471TEABSH]=#apVhuv1F[f471TEABSH]
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((20+256)-256) then
   do
   local hd4xnWS=T3tdBScNsMJ[ams7qH0]
   local oApydx8G7=WWMw9KnW[hd4xnWS]
   local S4BPcJ={}
   for Zw1Wko0YAU=1,#oApydx8G7.uv do
   local lmnkVx1e9w=oApydx8G7.uv[Zw1Wko0YAU]
   if lmnkVx1e9w[1]==1 then S4BPcJ[Zw1Wko0YAU]=oW04V2axAx[lmnkVx1e9w[2]] else S4BPcJ[Zw1Wko0YAU]=sUB20UWS7[lmnkVx1e9w[2]] end
   end
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]={pid=hd4xnWS,env=Q86MlApk,uv=S4BPcJ}
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=22 then
   if op<=21 then
   if op==((21+256)-256) then
   do
   local Unt6ldgEH=T3tdBScNsMJ[ams7qH0]
   local MG07LV={n=0}
   if Unt6ldgEH<0 then
   local qrAqctqgr=cOXEV5GR<0 and 0 or cOXEV5GR
   MG07LV.n=qrAqctqgr
   local ofq8f0=f471TEABSH-qrAqctqgr+1
   for Zw1Wko0YAU=1,qrAqctqgr do MG07LV[Zw1Wko0YAU]=apVhuv1F[ofq8f0+Zw1Wko0YAU-1] end
   else
   MG07LV.n=Unt6ldgEH
   for Zw1Wko0YAU=1,Unt6ldgEH do MG07LV[Zw1Wko0YAU]=apVhuv1F[f471TEABSH-Unt6ldgEH+Zw1Wko0YAU] end
   end
   return MG07LV
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22-0) then
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1]
   apVhuv1F[f471TEABSH-1]=FcPK6gXAz
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(23*4/4) then
   do
   local NegfAxn9b=apVhuv1F[f471TEABSH] local EMvLlHd=apVhuv1F[f471TEABSH-1] local FcPK6gXAz=apVhuv1F[f471TEABSH-2]
   FcPK6gXAz[EMvLlHd]=NegfAxn9b
   f471TEABSH=f471TEABSH-3
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=34 then
   if op<=30 then
   if op<=27 then
   if op<=25 then
   if op<=24 then
   if op==(24+99-99) and ((7*c5LKLCtl9g*c5LKLCtl9g)+c5LKLCtl9g)%2==0 then
   do
   local W8_J9EXUO,qrAqctqgr=T3tdBScNsMJ[ams7qH0],T3tdBScNsMJ[WhQcafpRGAr]
   local Q5sCmR=f471TEABSH-qrAqctqgr
   for Zw1Wko0YAU=1,qrAqctqgr do oW04V2axAx[W8_J9EXUO+Zw1Wko0YAU-1].v=apVhuv1F[Q5sCmR+Zw1Wko0YAU] end
   f471TEABSH=Q5sCmR
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(25+46-46) then
   do
   local K3ktjQlk=apVhuv1F[f471TEABSH]
   local NPyyiS=apVhuv1F[f471TEABSH-1]
   f471TEABSH=f471TEABSH-1
   apVhuv1F[f471TEABSH]=NPyyiS<=K3ktjQlk
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=26 then
   if op==(26+23-23) then
   do
   local NegfAxn9b=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   if NegfAxn9b then ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl]) end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(27-0) then
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]=Q86MlApk[Sgkpr4Y(yxbz7Ma3_Q,aQyu0OV4Nx[T3tdBScNsMJ[ams7qH0]])]
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=28 then
   if op==(28*4/4) then
   do local FcPK6gXAz=oW04V2axAx[T3tdBScNsMJ[ams7qH0]].v apVhuv1F[f471TEABSH+1]=FcPK6gXAz f471TEABSH=f471TEABSH+1 end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=29 then
   if op==(29*4/4) then
   do
   local Unt6ldgEH,lfgzNiv=T3tdBScNsMJ[ams7qH0],T3tdBScNsMJ[WhQcafpRGAr]
   iPE3013YGr=Unt6ldgEH<0 and (cOXEV5GR<0 and 0 or cOXEV5GR) or Unt6ldgEH
   uq_pISLRlF=1
   sdtaJxi4=f471TEABSH-iPE3013YGr-1-uq_pISLRlF
   ZIpbskayIdq=apVhuv1F[sdtaJxi4]
   local MG07LV
   if type(ZIpbskayIdq)=='table' and ZIpbskayIdq.pid then
   local iZaK9v9fqUQ={n=iPE3013YGr}
   for Zw1Wko0YAU=1,iPE3013YGr do iZaK9v9fqUQ[Zw1Wko0YAU]=apVhuv1F[sdtaJxi4+uq_pISLRlF+Zw1Wko0YAU] end
   MG07LV=Vh_PEth(ZIpbskayIdq.pid,ZIpbskayIdq.env,ZIpbskayIdq.uv,iZaK9v9fqUQ,BERVRmEV)
   else
   MG07LV=HbZqItU3xm(ZIpbskayIdq(ClROGmBE7x4(apVhuv1F,sdtaJxi4+1+uq_pISLRlF,f471TEABSH)))
   end
   if lfgzNiv==0 then
   f471TEABSH=sdtaJxi4-1
   cOXEV5GR=-1
   elseif lfgzNiv==-1 then
   j_m40YrqwK=MG07LV.n
   for Zw1Wko0YAU=1,j_m40YrqwK do apVhuv1F[sdtaJxi4+Zw1Wko0YAU-1]=MG07LV[Zw1Wko0YAU] end
   f471TEABSH=sdtaJxi4+j_m40YrqwK-1
   cOXEV5GR=j_m40YrqwK
   else
   for Zw1Wko0YAU=1,lfgzNiv do apVhuv1F[sdtaJxi4+Zw1Wko0YAU-1]=MG07LV[Zw1Wko0YAU] end
   f471TEABSH=sdtaJxi4+lfgzNiv-1
   cOXEV5GR=-1
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(30-0) then
   do
   local ka5vT7=T3tdBScNsMJ[ams7qH0]
   local rk2tv3=apVhuv1F[f471TEABSH-ka5vT7+1]
   for Zw1Wko0YAU=f471TEABSH-ka5vT7+2,f471TEABSH do rk2tv3=rk2tv3..apVhuv1F[Zw1Wko0YAU] end
   f471TEABSH=f471TEABSH-ka5vT7+1
   apVhuv1F[f471TEABSH]=rk2tv3
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=31 then
   if op==(31*4/4) then
   f471TEABSH=f471TEABSH+1
   apVhuv1F[f471TEABSH]=false
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=33 then
   if op<=32 then
   if op==((32+256)-256) then
   do
   local Unt6ldgEH,lfgzNiv=T3tdBScNsMJ[ams7qH0],T3tdBScNsMJ[WhQcafpRGAr]
   iPE3013YGr=Unt6ldgEH<0 and (cOXEV5GR<0 and 0 or cOXEV5GR) or Unt6ldgEH
   uq_pISLRlF=0
   sdtaJxi4=f471TEABSH-iPE3013YGr-1-uq_pISLRlF
   ZIpbskayIdq=apVhuv1F[sdtaJxi4]
   local MG07LV
   if type(ZIpbskayIdq)=='table' and ZIpbskayIdq.pid then
   local iZaK9v9fqUQ={n=iPE3013YGr}
   for Zw1Wko0YAU=1,iPE3013YGr do iZaK9v9fqUQ[Zw1Wko0YAU]=apVhuv1F[sdtaJxi4+uq_pISLRlF+Zw1Wko0YAU] end
   MG07LV=Vh_PEth(ZIpbskayIdq.pid,ZIpbskayIdq.env,ZIpbskayIdq.uv,iZaK9v9fqUQ,BERVRmEV)
   else
   MG07LV=HbZqItU3xm(ZIpbskayIdq(ClROGmBE7x4(apVhuv1F,sdtaJxi4+1+uq_pISLRlF,f471TEABSH)))
   end
   if lfgzNiv==0 then
   f471TEABSH=sdtaJxi4-1
   cOXEV5GR=-1
   elseif lfgzNiv==-1 then
   j_m40YrqwK=MG07LV.n
   for Zw1Wko0YAU=1,j_m40YrqwK do apVhuv1F[sdtaJxi4+Zw1Wko0YAU-1]=MG07LV[Zw1Wko0YAU] end
   f471TEABSH=sdtaJxi4+j_m40YrqwK-1
   cOXEV5GR=j_m40YrqwK
   else
   for Zw1Wko0YAU=1,lfgzNiv do apVhuv1F[sdtaJxi4+Zw1Wko0YAU-1]=MG07LV[Zw1Wko0YAU] end
   f471TEABSH=sdtaJxi4+lfgzNiv-1
   cOXEV5GR=-1
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(33+98-98) then
   do
   local Unt6ldgEH=T3tdBScNsMJ[ams7qH0]
   local W8_J9EXUO=f471TEABSH-2*Unt6ldgEH
   for Zw1Wko0YAU=1,Unt6ldgEH do
   local EMvLlHd=apVhuv1F[W8_J9EXUO+2*Zw1Wko0YAU-2]
   local FcPK6gXAz=apVhuv1F[W8_J9EXUO+2*Zw1Wko0YAU-1]
   local NegfAxn9b=apVhuv1F[W8_J9EXUO+2*Unt6ldgEH+Zw1Wko0YAU-1]
   if FcPK6gXAz==Q86MlApk then Q86MlApk[EMvLlHd]=NegfAxn9b else FcPK6gXAz[EMvLlHd]=NegfAxn9b end
   end
   f471TEABSH=W8_J9EXUO-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(34-0) then
   f471TEABSH=f471TEABSH-T3tdBScNsMJ[ams7qH0]
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=46 then
   if op<=38 then
   if op<=36 then
   if op<=35 then
   if op==((35+256)-256) and (((c5LKLCtl9g*c5LKLCtl9g)-c5LKLCtl9g)%2)==0 then
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1]
   apVhuv1F[f471TEABSH-1]=FcPK6gXAz
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(36-0) then
   error("&Q@^$}!|<!}$X~X<Z>>*&@&>?Z$*".."::ESCAPE-OP="..tostring(op))
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=37 then
   if op==(37*4/4) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   do
   local EMvLlHd=apVhuv1F[f471TEABSH] local FcPK6gXAz=apVhuv1F[f471TEABSH-1]
   apVhuv1F[f471TEABSH-1]=FcPK6gXAz[EMvLlHd]
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((38+256)-256) and ((7*c5LKLCtl9g*c5LKLCtl9g)+c5LKLCtl9g)%2==0 then
   do
   local d3Gm4ouL3=T3tdBScNsMJ[ams7qH0]
   local Toxls6=oW04V2axAx[d3Gm4ouL3].v+oW04V2axAx[d3Gm4ouL3+3].v
   local wmam6ROlO=oW04V2axAx[d3Gm4ouL3+2].v
   local iateikfD_T=oW04V2axAx[d3Gm4ouL3+3].v
   if (iateikfD_T>0 and Toxls6<=wmam6ROlO) or (iateikfD_T<0 and Toxls6>=wmam6ROlO) then
   oW04V2axAx[d3Gm4ouL3]={v=Toxls6}
   oW04V2axAx[d3Gm4ouL3+1].v=Toxls6
   ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl])
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=44 then
   if op<=42 then
   if op<=40 then
   if op<=39 then
   if op==(39-0) then
   do local NegfAxn9b=Sgkpr4Y(yxbz7Ma3_Q,aQyu0OV4Nx[T3tdBScNsMJ[ams7qH0]]) f471TEABSH=f471TEABSH+1 apVhuv1F[f471TEABSH]=NegfAxn9b end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(40-0) then
   ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl])
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=41 then
   if op==(41+71-71) then
   do
   local NegfAxn9b=apVhuv1F[f471TEABSH] local EMvLlHd=apVhuv1F[f471TEABSH-1] local FcPK6gXAz=apVhuv1F[f471TEABSH-T3tdBScNsMJ[ams7qH0]]
   FcPK6gXAz[EMvLlHd]=NegfAxn9b
   f471TEABSH=f471TEABSH-2
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((42+256)-256) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   if cOXEV5GR>1 then f471TEABSH=f471TEABSH-cOXEV5GR+1 end
   cOXEV5GR=-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=43 then
   if op==(43-0) then
   oW04V2axAx[T3tdBScNsMJ[ams7qH0]].v=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(44-0) and ((7*U5ZX_S0Mk*U5ZX_S0Mk)+U5ZX_S0Mk)%2==0 then
   do
   local pr_mdm=T3tdBScNsMJ[n35R_oLih]
   local WbrLrLlnc9=pr_mdm<0 and ((-pr_mdm-1)+(cOXEV5GR<0 and 0 or cOXEV5GR)) or pr_mdm
   local Unt6ldgEH=T3tdBScNsMJ[ams7qH0]
   if WbrLrLlnc9>Unt6ldgEH then
   f471TEABSH=f471TEABSH-WbrLrLlnc9+Unt6ldgEH
   elseif WbrLrLlnc9<Unt6ldgEH then
   while WbrLrLlnc9<Unt6ldgEH do f471TEABSH=f471TEABSH+1 apVhuv1F[f471TEABSH]=nil WbrLrLlnc9=WbrLrLlnc9+1 end
   end
   cOXEV5GR=-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=45 then
   if op==((45+256)-256) then
   do
   local NegfAxn9b=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   if not NegfAxn9b then ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl]) end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((46+256)-256) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   do
   local d3Gm4ouL3=T3tdBScNsMJ[ams7qH0]
   local Toxls6=T3tdBScNsMJ[n35R_oLih]
   local dRoR7GDhriY=HbZqItU3xm(oW04V2axAx[d3Gm4ouL3].v(oW04V2axAx[d3Gm4ouL3+1].v,oW04V2axAx[d3Gm4ouL3+2].v))
   if dRoR7GDhriY[1]~=nil then
   ICq9SP=ICq9SP+(T3tdBScNsMJ[WhQcafpRGAr]+T3tdBScNsMJ[akV85DqSl])
   oW04V2axAx[d3Gm4ouL3+2].v=dRoR7GDhriY[1]
   for Zw1Wko0YAU=1,Toxls6 do oW04V2axAx[d3Gm4ouL3+2+Zw1Wko0YAU]={v=dRoR7GDhriY[Zw1Wko0YAU]} end
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=50 then
   if op<=47 then
   if op==(47-0) and ((7*c5LKLCtl9g*c5LKLCtl9g)+c5LKLCtl9g)%2==0 then
   do
   local FcPK6gXAz=apVhuv1F[f471TEABSH]
   apVhuv1F[f471TEABSH]=apVhuv1F[f471TEABSH-1] * FcPK6gXAz
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=49 then
   if op<=48 then
   if op==(48*4/4) and ((c5LKLCtl9g*c5LKLCtl9g+c5LKLCtl9g)%2)==0 then
   do
   local Unt6ldgEH=T3tdBScNsMJ[ams7qH0]
   if Unt6ldgEH>=0 then
   local FcPK6gXAz=apVhuv1F[f471TEABSH-Unt6ldgEH-1]
   local ka5vT7=rnxO8fZV[FcPK6gXAz] or 0
   for Zw1Wko0YAU=1,Unt6ldgEH do FcPK6gXAz[ka5vT7+Zw1Wko0YAU]=apVhuv1F[f471TEABSH-Unt6ldgEH+Zw1Wko0YAU] end
   rnxO8fZV[FcPK6gXAz]=ka5vT7+Unt6ldgEH
   f471TEABSH=f471TEABSH-Unt6ldgEH-1
   else
   local ayYUlMjJyYR=(-Unt6ldgEH)-1
   local jWTQSmM_=cOXEV5GR<0 and 0 or cOXEV5GR
   local lL3FQi=ayYUlMjJyYR+jWTQSmM_
   local W8_J9EXUO=f471TEABSH-lL3FQi
   local FcPK6gXAz=apVhuv1F[W8_J9EXUO-1]
   local ka5vT7=rnxO8fZV[FcPK6gXAz] or 0
   for Zw1Wko0YAU=1,lL3FQi do FcPK6gXAz[ka5vT7+Zw1Wko0YAU]=apVhuv1F[W8_J9EXUO+Zw1Wko0YAU-1] end
   rnxO8fZV[FcPK6gXAz]=ka5vT7+lL3FQi
   cOXEV5GR=-1
   f471TEABSH=W8_J9EXUO-1
   end
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(49-0) and ((U5ZX_S0Mk*U5ZX_S0Mk+U5ZX_S0Mk)%2)==0 then
   Q86MlApk[Sgkpr4Y(yxbz7Ma3_Q,aQyu0OV4Nx[T3tdBScNsMJ[ams7qH0]])]=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((50+256)-256) and (((c5LKLCtl9g*c5LKLCtl9g)-c5LKLCtl9g)%2)==0 then
   do
   local NPyyiS=apVhuv1F[f471TEABSH-1]
   apVhuv1F[f471TEABSH-1]=NPyyiS % apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH-1
   end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=101 then
   if op<=100 then
   if op==100 then
   do local FcPK6gXAz=apVhuv1F[f471TEABSH] apVhuv1F[f471TEABSH]=FcPK6gXAz end
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 then
   apVhuv1F[f471TEABSH+1]=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH+1
   f471TEABSH=f471TEABSH-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==102 then
   apVhuv1F[f471TEABSH+1]=apVhuv1F[f471TEABSH]
   f471TEABSH=f471TEABSH+1
   f471TEABSH=f471TEABSH-1
   else
   error("&<?Z{Q]Q{][@@A*[>?$]AQZ!<|?*".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
  end
 end
 local KJZzI8wAwy=HbZqItU3xm(...)
 return Vh_PEth(Vh_PEth_decode(),1,bxsbjG,{},KJZzI8wAwy,nil)
end)(o7dwawaz5)