-- NEVAHEX-VM v3 'Hex' — protected artifact — ZQ^{ZQ%X<@Z?() runs it

return (function(vIZSZXvqku, ...)
 local pINjh5w4s=setmetatable({},{__mode="k"})
 local function KEgwTM(...) local n=select('#',...) return {n=n,...} end
 local Iy9bJ0=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function PAMwe1V(t,i,j)
  if i>j then return end
  if Iy9bJ0 and j-i>15 then return Iy9bJ0(t,i,j) end
  return t[i],PAMwe1V(t,i+1,j)
 end
 local MwUGnJ=_G.string.char
 local gL8Tju8C=_G.table.concat
 local yOdkgPO,kN2ukSRYIg,k3zC4XXQC,QBt38Z,jE1hzgMf,voeVr6MQ,EtzEOtl,nA0x8JLfKRX,YyD6L126BaM,Aoy4Q0c,GNI0xRRWB,bYE1yn4sL
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then mFcjzl4jv=true tsz8_QhCm=9999 end debug.sethook() end
 local h5iUp0Be5P8=(31962*4/4) kAqMeOJ=((881989+256)-256) LWDSIK3UEmF=(832472*4/4) HRFNOrqz=(378412-0) rxoqZ7wh=((368173+256)-256)
 local rMc6S2=(62243+47-47) xxzA_eX3H=(1445815*4/4) g5h53xupIE4=(1684241+13-13) dGTdSyLeFLW=(213743+78-78)
 local DjtXW8P=(2127107771*4/4) _G.__CK0=tostring(DjtXW8P)
 local arpjGMv=0 RytWBvg=0
 local function Ek9hRH4(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((DjtXW8P+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=MwUGnJ(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=gL8Tju8C(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local fAPO_2mcnE5="\138@>\139\127`\249\184\144\1552b6\181\165bK\199\128\014\186\002\222]6\244\192\163\032B=\202\203\1665\186\154\190\198\248\217\1771\1772\1367\037I\194\1812\149\039\008{TP\028\199\192\189\0166=\255Ag\132\201R\161\192\028[\132\148u\219\009[\157\202\249\142\014\165\017\235\2222\245\185\202\170b+\216\00805\144\177jI\242>\206S\149\198\187b2\030\226\190\008\168\195\230d\142\236hS\187X\217"
 local function VPs28IFdZqj_decode()
  local D={} local bn=#fAPO_2mcnE5
  if bn>4194304 then error("}}[>?]XAX}Q~~}^Q&&X<>!]>$?]Z") end
  local MM=2147483647
  local lDfJMh={1845295484,1370206387,1203398646,432763130,365348814,2083164443,771325853,1058080291,689685393,194209907,833090574,1135939553,1307213305,595899542,1817832288,1312184436}
  local sa=((D[5]*16777216+D[6]*65536+D[7]*256+D[8])^lDfJMh[3]+lDfJMh[6]-lDfJMh[5])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[9]*16777216+D[10]*65536+D[11]*256+D[12])^lDfJMh[4]+lDfJMh[2]-lDfJMh[1])%2147483646 if sb<1 then sb=sb+2147483646 end
 do
   local __fp=_VERSION or ""
   local __bits={"unpack","setfenv","getfenv","loadstring"}
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
   D[i]=(sbyte(fAPO_2mcnE5,i)-pv+256)%256
  end
  local orwz7qE=1
  local function SYJPBPL() local bt=D[orwz7qE] orwz7qE=orwz7qE+1 return bt end
  local function H8ZZMevU70()
   local sh,r=0,0
   while true do
    local bt=SYJPBPL()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function UG9Sqkpj()
   local u=H8ZZMevU70()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local wOZvIuQP=SYJPBPL()
  if wOZvIuQP<128 then error("#%<A>@{?%]$&[<{%}!$]QX#{|XXZ") end
  for i=1,wOZvIuQP-128 do SYJPBPL() end
  local UOesDTMbZ=H8ZZMevU70()
  if UOesDTMbZ>4096 then error("]*%$%Z~]{|Q}^Q#XX|&&[<~<X@>[") end
  local w60vpN={} local rtiC42c={}
  for IZ9c2T=1,UOesDTMbZ do
   local pr={}
   pr.pn=SYJPBPL()
   pr.va=SYJPBPL()==1
   local nu=H8ZZMevU70()
   pr.uv={}
   for i=1,nu do pr.uv[i]={SYJPBPL()==1 and 1 or 0,H8ZZMevU70()} end
   pr.ns=H8ZZMevU70()
   H8ZZMevU70() H8ZZMevU70() H8ZZMevU70() H8ZZMevU70() H8ZZMevU70()
   local nc=H8ZZMevU70()
   if nc>65536 then error("|>&]?A$@ZAQ<}&|]{#]$<Q$&X!>Q") end
   pr.c={}
   for i=1,nc do
    local tag=SYJPBPL()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=H8ZZMevU70()
     local bb={}
     for j=1,ln do orwz7qE=orwz7qE+1 bb[j]=D[orwz7qE-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=H8ZZMevU70()
   if nk>262144 then error("<@@!!@>AQ^|Z&%Q%*@&ZQ*&~><^@") end
   pr.k={}
   local lrk=(rMc6S2+IZ9c2T*xxzA_eX3H+IZ9c2T*IZ9c2T*g5h53xupIE4)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=H8ZZMevU70()
    local aw=UG9Sqkpj()-mm
    local b1w=UG9Sqkpj()-mm
    local b2w=UG9Sqkpj()+mm
    local cw=UG9Sqkpj()-mm
    lrk=(lrk+dGTdSyLeFLW+math.floor(lrk/8))%65536
    pr.k[i]={[h5iUp0Be5P8]=oe,[kAqMeOJ]=aw,[LWDSIK3UEmF]=b1w,[HRFNOrqz]=b2w,[rxoqZ7wh]=cw}
   end
   w60vpN[IZ9c2T]=pr
  end
  local wln=H8ZZMevU70()
  local wa=(1539442021-0) wb=((83188922+256)-256) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   rtiC42c[i]=(D[orwz7qE]-pv2+256)%256
   orwz7qE=orwz7qE+1
  end
  local zhyrPpObMLt=#rtiC42c
  if zhyrPpObMLt<1 then zhyrPpObMLt=1 rtiC42c[1]=0 end
  return {P=w60vpN,WM=rtiC42c,WMI=zhyrPpObMLt}
 end
 local TKmxvlpAia_=0
 local lx8eiMEwbN={} local dTOn1p={}
 local function VPs28IFdZqj(l1,vdwIw2,awcxYBQLbij,VvlGLVsP,qkJqqrlM_L,bO97EXQ7Lb)
  local w60vpN,rtiC42c,zhyrPpObMLt=l1.P,l1.WM,l1.WMI
  local wknzYyB=w60vpN[vdwIw2]
  local GW1A4y=wknzYyB.k
  local DW6ZjoA8NQ=wknzYyB.c
  local MYe_gv={}
  local SQIPqH5Te={}
  for VWv5qnSGL=1,wknzYyB.ns do SQIPqH5Te[VWv5qnSGL]={} end
  local GTSVjmSQ,Ba7llJD,YMFR9ePfT=0,-1,1
  local wQVxW6MX=qkJqqrlM_L
  for VWv5qnSGL=1,wknzYyB.pn do SQIPqH5Te[VWv5qnSGL].v=qkJqqrlM_L[VWv5qnSGL] end
  local vO25cWRZOX,dff_u8=37,1
  local mFcjzl4jv,tsz8_QhCm,DWljjWqhV=false,0,0
  local DiW2uBYx=(rMc6S2+vdwIw2*xxzA_eX3H+vdwIw2*vdwIw2*g5h53xupIE4)%65536
  local q5w42L_l,oTIc7MF,AF7AcmxHH,MfHtWGp9J9,ne9ybS_SbF
  local wcCzutU3,op
  while true do
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then mFcjzl4jv=true tsz8_QhCm=1 end end
   wcCzutU3=GW1A4y[YMFR9ePfT]
   if YMFR9ePfT<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(YMFR9ePfT).." RK="..tostring(DiW2uBYx).." INS="..tostring(wcCzutU3[h5iUp0Be5P8]).." A="..tostring(wcCzutU3[kAqMeOJ]).." B="..tostring(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz]).." C="..tostring(wcCzutU3[rxoqZ7wh]).."\n" end
   wcCzutU3=GW1A4y[YMFR9ePfT]
   op=(((wcCzutU3[h5iUp0Be5P8]-DiW2uBYx)+65536)%65536)
   DiW2uBYx=(DiW2uBYx+dGTdSyLeFLW+math.floor(DiW2uBYx/8))%65536
   YMFR9ePfT=YMFR9ePfT+1
   if op<=38 then
   if op<=16 then
   if op<=13 then
   if op<=8 then
   if op<=4 then
   if op<=3 then
   if op<=0 then
   if op==((0+256)-256) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   do
   local mgPKxuFOjPY=MYe_gv[GTSVjmSQ]
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   GTSVjmSQ=GTSVjmSQ-1
   MYe_gv[GTSVjmSQ]=T5dM0Wm3 - mgPKxuFOjPY
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=2 then
   if op<=1 then
   if op==(1+82-82) then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=SQIPqH5Te[wcCzutU3[kAqMeOJ]].v
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(2+80-80) then
   do
   local mgPKxuFOjPY=MYe_gv[GTSVjmSQ]
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   GTSVjmSQ=GTSVjmSQ-1
   MYe_gv[GTSVjmSQ]=T5dM0Wm3==mgPKxuFOjPY
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(3*4/4) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   do
   local eolM9Sc9=wcCzutU3[kAqMeOJ]
   local K1DHltnh=wcCzutU3[rxoqZ7wh]
   local PyEYUv6HB=KEgwTM(SQIPqH5Te[eolM9Sc9].v(SQIPqH5Te[eolM9Sc9+1].v,SQIPqH5Te[eolM9Sc9+2].v))
   if PyEYUv6HB[1]~=nil then
   YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz])
   SQIPqH5Te[eolM9Sc9+2].v=PyEYUv6HB[1]
   for VWv5qnSGL=1,K1DHltnh do SQIPqH5Te[eolM9Sc9+2+VWv5qnSGL]={v=PyEYUv6HB[VWv5qnSGL]} end
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(4*4/4) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   do
   local VZOFm2B=wcCzutU3[kAqMeOJ]
   local PoNahSiwQe=MYe_gv[GTSVjmSQ-VZOFm2B+1]
   for VWv5qnSGL=GTSVjmSQ-VZOFm2B+2,GTSVjmSQ do PoNahSiwQe=PoNahSiwQe..MYe_gv[VWv5qnSGL] end
   GTSVjmSQ=GTSVjmSQ-VZOFm2B+1
   MYe_gv[GTSVjmSQ]=PoNahSiwQe
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=5 then
   if op==(5-0) then
   error("&~*@%^]@#@<}@$@!^~<[Z^<?Q$A&".."::ESCAPE-OP="..tostring(op))
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=6 then
   if op==(6+62-62) then
   GTSVjmSQ=GTSVjmSQ-wcCzutU3[kAqMeOJ]
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=7 then
   if op==(7+71-71) and ((vO25cWRZOX*vO25cWRZOX+vO25cWRZOX)%2)==0 then
   do
   local DDYaI9mCj=wcCzutU3[kAqMeOJ]
   if DDYaI9mCj<0 then
   local uR7h5F_lpa=wQVxW6MX.n or #wQVxW6MX
   for VWv5qnSGL=1,uR7h5F_lpa do GTSVjmSQ=GTSVjmSQ+1 MYe_gv[GTSVjmSQ]=wQVxW6MX[VWv5qnSGL] end
   Ba7llJD=uR7h5F_lpa
   else
   for VWv5qnSGL=1,DDYaI9mCj do GTSVjmSQ=GTSVjmSQ+1 MYe_gv[GTSVjmSQ]=wQVxW6MX[VWv5qnSGL] end
   Ba7llJD=-1
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(8*4/4) then
   do end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=10 then
   if op<=9 then
   if op==(9-0) then
   do
   local DDYaI9mCj,ytiVlKFlGL=wcCzutU3[kAqMeOJ],wcCzutU3[LWDSIK3UEmF]
   oTIc7MF=DDYaI9mCj<0 and (Ba7llJD<0 and 0 or Ba7llJD) or DDYaI9mCj
   AF7AcmxHH=1
   MfHtWGp9J9=GTSVjmSQ-oTIc7MF-1-AF7AcmxHH
   ne9ybS_SbF=MYe_gv[MfHtWGp9J9]
   local hbWLaU9rC
   if type(ne9ybS_SbF)=='table' and ne9ybS_SbF.pid then
   local Ig7P8df={n=oTIc7MF}
   for VWv5qnSGL=1,oTIc7MF do Ig7P8df[VWv5qnSGL]=MYe_gv[MfHtWGp9J9+AF7AcmxHH+VWv5qnSGL] end
   hbWLaU9rC=VPs28IFdZqj(ne9ybS_SbF.pid,ne9ybS_SbF.env,ne9ybS_SbF.uv,Ig7P8df,bO97EXQ7Lb)
   else
   hbWLaU9rC=KEgwTM(ne9ybS_SbF(PAMwe1V(MYe_gv,MfHtWGp9J9+1+AF7AcmxHH,GTSVjmSQ)))
   end
   if ytiVlKFlGL==0 then
   GTSVjmSQ=MfHtWGp9J9-1
   Ba7llJD=-1
   elseif ytiVlKFlGL==-1 then
   q5w42L_l=hbWLaU9rC.n
   for VWv5qnSGL=1,q5w42L_l do MYe_gv[MfHtWGp9J9+VWv5qnSGL-1]=hbWLaU9rC[VWv5qnSGL] end
   GTSVjmSQ=MfHtWGp9J9+q5w42L_l-1
   Ba7llJD=q5w42L_l
   else
   for VWv5qnSGL=1,ytiVlKFlGL do MYe_gv[MfHtWGp9J9+VWv5qnSGL-1]=hbWLaU9rC[VWv5qnSGL] end
   GTSVjmSQ=MfHtWGp9J9+ytiVlKFlGL-1
   Ba7llJD=-1
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((10+256)-256) and ((7*vO25cWRZOX*vO25cWRZOX)+vO25cWRZOX)%2==0 then
   MYe_gv[GTSVjmSQ]=-MYe_gv[GTSVjmSQ]
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=11 then
   if op==(11-0) then
   SQIPqH5Te[wcCzutU3[kAqMeOJ]].v=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=12 then
   if op==(12*4/4) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=true
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((13+256)-256) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   do
   local DDYaI9mCj=wcCzutU3[kAqMeOJ]
   if DDYaI9mCj>=0 then
   local E0z3P8NJo=MYe_gv[GTSVjmSQ-DDYaI9mCj-1]
   local VZOFm2B=pINjh5w4s[E0z3P8NJo] or 0
   for VWv5qnSGL=1,DDYaI9mCj do E0z3P8NJo[VZOFm2B+VWv5qnSGL]=MYe_gv[GTSVjmSQ-DDYaI9mCj+VWv5qnSGL] end
   pINjh5w4s[E0z3P8NJo]=VZOFm2B+DDYaI9mCj
   GTSVjmSQ=GTSVjmSQ-DDYaI9mCj-1
   else
   local hOOT6Ng=(-DDYaI9mCj)-1
   local GyYhOX3jv4Y=Ba7llJD<0 and 0 or Ba7llJD
   local iaBJ30qndN=hOOT6Ng+GyYhOX3jv4Y
   local ZWp0oMGYLIY=GTSVjmSQ-iaBJ30qndN
   local E0z3P8NJo=MYe_gv[ZWp0oMGYLIY-1]
   local VZOFm2B=pINjh5w4s[E0z3P8NJo] or 0
   for VWv5qnSGL=1,iaBJ30qndN do E0z3P8NJo[VZOFm2B+VWv5qnSGL]=MYe_gv[ZWp0oMGYLIY+VWv5qnSGL-1] end
   pINjh5w4s[E0z3P8NJo]=VZOFm2B+iaBJ30qndN
   Ba7llJD=-1
   GTSVjmSQ=ZWp0oMGYLIY-1
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=15 then
   if op<=14 then
   if op==((14+256)-256) then
   do
   local eolM9Sc9=wcCzutU3[kAqMeOJ]
   local K1DHltnh=wcCzutU3[rxoqZ7wh]
   local LomS95pz1N=MYe_gv[GTSVjmSQ] local sVtUn51=MYe_gv[GTSVjmSQ-1] local z6IEsTzU=MYe_gv[GTSVjmSQ-2]
   GTSVjmSQ=GTSVjmSQ-3
   SQIPqH5Te[eolM9Sc9].v=z6IEsTzU
   SQIPqH5Te[eolM9Sc9+1].v=sVtUn51
   SQIPqH5Te[eolM9Sc9+2].v=LomS95pz1N
   local PyEYUv6HB=KEgwTM(SQIPqH5Te[eolM9Sc9].v(SQIPqH5Te[eolM9Sc9+1].v,SQIPqH5Te[eolM9Sc9+2].v))
   if PyEYUv6HB[1]==nil then
   YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz])
   else
   SQIPqH5Te[eolM9Sc9+2].v=PyEYUv6HB[1]
   for VWv5qnSGL=1,K1DHltnh do SQIPqH5Te[eolM9Sc9+2+VWv5qnSGL]={v=PyEYUv6HB[VWv5qnSGL]} end
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(15+13-13) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz])
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(16*4/4) then
   do
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   MYe_gv[GTSVjmSQ-1]=T5dM0Wm3 + MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=27 then
   if op<=21 then
   if op<=18 then
   if op<=17 then
   if op==(17+63-63) then
   MYe_gv[GTSVjmSQ+1]=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ+1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(18-0) and ((vO25cWRZOX*vO25cWRZOX+vO25cWRZOX)%2)==0 then
   do
   local eolM9Sc9=wcCzutU3[kAqMeOJ]
   local K1DHltnh=SQIPqH5Te[eolM9Sc9].v+SQIPqH5Te[eolM9Sc9+3].v
   local exQXR6fPlZv=SQIPqH5Te[eolM9Sc9+2].v
   local JEuE6pTjPs=SQIPqH5Te[eolM9Sc9+3].v
   if (JEuE6pTjPs>0 and K1DHltnh<=exQXR6fPlZv) or (JEuE6pTjPs<0 and K1DHltnh>=exQXR6fPlZv) then
   SQIPqH5Te[eolM9Sc9]={v=K1DHltnh}
   SQIPqH5Te[eolM9Sc9+1].v=K1DHltnh
   YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz])
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=20 then
   if op<=19 then
   if op==((19+256)-256) then
   local E0z3P8NJo=MYe_gv[GTSVjmSQ]
   MYe_gv[GTSVjmSQ]=MYe_gv[GTSVjmSQ-1]
   MYe_gv[GTSVjmSQ-1]=E0z3P8NJo
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(20+12-12) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=awcxYBQLbij[Ek9hRH4(vdwIw2,DW6ZjoA8NQ[wcCzutU3[kAqMeOJ]])]
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(21*4/4) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   VvlGLVsP[wcCzutU3[kAqMeOJ]].v=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=23 then
   if op<=22 then
   if op==(22-0) then
   do
   local x_yXFiCovs=MYe_gv[GTSVjmSQ] local aVDo7F=MYe_gv[GTSVjmSQ-1] local E0z3P8NJo=MYe_gv[GTSVjmSQ-wcCzutU3[kAqMeOJ]]
   E0z3P8NJo[aVDo7F]=x_yXFiCovs
   GTSVjmSQ=GTSVjmSQ-2
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(23*4/4) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   do
   local x_yXFiCovs=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   if x_yXFiCovs then YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz]) end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=26 then
   if op<=25 then
   if op<=24 then
   if op==(24*4/4) then
   if Ba7llJD>1 then GTSVjmSQ=GTSVjmSQ-Ba7llJD+1 end
   Ba7llJD=-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(25*4/4) and ((7*DWljjWqhV*DWljjWqhV)+DWljjWqhV)%2==0 then
   do
   local DDYaI9mCj=wcCzutU3[kAqMeOJ]
   local hbWLaU9rC={n=0}
   if DDYaI9mCj<0 then
   local uR7h5F_lpa=Ba7llJD<0 and 0 or Ba7llJD
   hbWLaU9rC.n=uR7h5F_lpa
   local rGRvUMml=GTSVjmSQ-uR7h5F_lpa+1
   for VWv5qnSGL=1,uR7h5F_lpa do hbWLaU9rC[VWv5qnSGL]=MYe_gv[rGRvUMml+VWv5qnSGL-1] end
   else
   hbWLaU9rC.n=DDYaI9mCj
   for VWv5qnSGL=1,DDYaI9mCj do hbWLaU9rC[VWv5qnSGL]=MYe_gv[GTSVjmSQ-DDYaI9mCj+VWv5qnSGL] end
   end
   return hbWLaU9rC
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(26*4/4) then
   do
   local Mg1uOZVy=wcCzutU3[kAqMeOJ]
   local pi8aaR7RuI=w60vpN[Mg1uOZVy]
   local jG5OBw7_={}
   for VWv5qnSGL=1,#pi8aaR7RuI.uv do
   local Y0wJt9Yp=pi8aaR7RuI.uv[VWv5qnSGL]
   if Y0wJt9Yp[1]==1 then jG5OBw7_[VWv5qnSGL]=SQIPqH5Te[Y0wJt9Yp[2]] else jG5OBw7_[VWv5qnSGL]=VvlGLVsP[Y0wJt9Yp[2]] end
   end
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]={pid=Mg1uOZVy,env=awcxYBQLbij,uv=jG5OBw7_}
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((27+256)-256) then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=awcxYBQLbij
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=31 then
   if op<=30 then
   if op<=28 then
   if op==(28+46-46) and ((7*vO25cWRZOX*vO25cWRZOX)+vO25cWRZOX)%2==0 then
   do
   local DDYaI9mCj=wcCzutU3[kAqMeOJ]
   local ZWp0oMGYLIY=GTSVjmSQ-2*DDYaI9mCj
   for VWv5qnSGL=1,DDYaI9mCj do
   local aVDo7F=MYe_gv[ZWp0oMGYLIY+2*VWv5qnSGL-2]
   local E0z3P8NJo=MYe_gv[ZWp0oMGYLIY+2*VWv5qnSGL-1]
   local x_yXFiCovs=MYe_gv[ZWp0oMGYLIY+2*DDYaI9mCj+VWv5qnSGL-1]
   if E0z3P8NJo==awcxYBQLbij then awcxYBQLbij[aVDo7F]=x_yXFiCovs else E0z3P8NJo[aVDo7F]=x_yXFiCovs end
   end
   GTSVjmSQ=ZWp0oMGYLIY-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=29 then
   if op==(29+32-32) and ((vO25cWRZOX*vO25cWRZOX+vO25cWRZOX)%2)==0 then
   MYe_gv[GTSVjmSQ]=not MYe_gv[GTSVjmSQ]
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(30+73-73) and ((7*DWljjWqhV*DWljjWqhV)+DWljjWqhV)%2==0 then
   do
   local x_yXFiCovs=MYe_gv[GTSVjmSQ] local aVDo7F=MYe_gv[GTSVjmSQ-1] local E0z3P8NJo=MYe_gv[GTSVjmSQ-2]
   E0z3P8NJo[aVDo7F]=x_yXFiCovs
   GTSVjmSQ=GTSVjmSQ-3
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(31-0) then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=nil
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=36 then
   if op<=34 then
   if op<=33 then
   if op<=32 then
   if op==(32+84-84) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   local x_yXFiCovs=Ek9hRH4(vdwIw2,DW6ZjoA8NQ[wcCzutU3[kAqMeOJ]])
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=x_yXFiCovs
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(33+20-20) then
   do
   local cAhzn5y_UW=wcCzutU3[rxoqZ7wh]
   local tvV2RzmX=cAhzn5y_UW<0 and ((-cAhzn5y_UW-1)+(Ba7llJD<0 and 0 or Ba7llJD)) or cAhzn5y_UW
   local DDYaI9mCj=wcCzutU3[kAqMeOJ]
   if tvV2RzmX>DDYaI9mCj then
   GTSVjmSQ=GTSVjmSQ-tvV2RzmX+DDYaI9mCj
   elseif tvV2RzmX<DDYaI9mCj then
   while tvV2RzmX<DDYaI9mCj do GTSVjmSQ=GTSVjmSQ+1 MYe_gv[GTSVjmSQ]=nil tvV2RzmX=tvV2RzmX+1 end
   end
   Ba7llJD=-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((34+256)-256) and ((vO25cWRZOX*vO25cWRZOX+vO25cWRZOX)%2)==0 then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=false
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=35 then
   if op==(35-0) then
   GTSVjmSQ=GTSVjmSQ+1
   MYe_gv[GTSVjmSQ]=VvlGLVsP[wcCzutU3[kAqMeOJ]].v
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((36+256)-256) and ((vO25cWRZOX*vO25cWRZOX+vO25cWRZOX)%2)==0 then
   do
   local ZWp0oMGYLIY,uR7h5F_lpa=wcCzutU3[kAqMeOJ],wcCzutU3[LWDSIK3UEmF]
   local QYxTnQW5a_p=GTSVjmSQ-uR7h5F_lpa
   for VWv5qnSGL=1,uR7h5F_lpa do SQIPqH5Te[ZWp0oMGYLIY+VWv5qnSGL-1].v=MYe_gv[QYxTnQW5a_p+VWv5qnSGL] end
   GTSVjmSQ=QYxTnQW5a_p
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=37 then
   if op==((37+256)-256) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   do
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   MYe_gv[GTSVjmSQ-1]=T5dM0Wm3 ^ MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(38-0) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   MYe_gv[GTSVjmSQ-1]=MYe_gv[GTSVjmSQ-1][MYe_gv[GTSVjmSQ]]
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   else
   if op<=49 then
   if op<=42 then
   if op<=39 then
   if op==(39*4/4) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   local E0z3P8NJo=MYe_gv[GTSVjmSQ]
   MYe_gv[GTSVjmSQ]=MYe_gv[GTSVjmSQ-1]
   MYe_gv[GTSVjmSQ-1]=E0z3P8NJo
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=40 then
   if op==((40+256)-256) and (((vO25cWRZOX*vO25cWRZOX)-vO25cWRZOX)%2)==0 then
   do
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   MYe_gv[GTSVjmSQ-1]=T5dM0Wm3 % MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=41 then
   if op==(41-0) and (((DWljjWqhV*DWljjWqhV)-DWljjWqhV)%2)==0 then
   do
   local mgPKxuFOjPY=MYe_gv[GTSVjmSQ]
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   GTSVjmSQ=GTSVjmSQ-1
   MYe_gv[GTSVjmSQ]=T5dM0Wm3 / mgPKxuFOjPY
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(42+24-24) then
   awcxYBQLbij[Ek9hRH4(vdwIw2,DW6ZjoA8NQ[wcCzutU3[kAqMeOJ]])]=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=46 then
   if op<=44 then
   if op<=43 then
   if op==(43*4/4) then
   MYe_gv[GTSVjmSQ]=#MYe_gv[GTSVjmSQ]
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(44*4/4) then
   MYe_gv[GTSVjmSQ-1]=MYe_gv[GTSVjmSQ-1]<=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=45 then
   if op==(45+11-11) and ((DWljjWqhV*DWljjWqhV+DWljjWqhV)%2)==0 then
   GTSVjmSQ=GTSVjmSQ+1
   local E0z3P8NJo={}
   pINjh5w4s[E0z3P8NJo]=0
   MYe_gv[GTSVjmSQ]=E0z3P8NJo
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(46-0) then
   do
   local eolM9Sc9=wcCzutU3[kAqMeOJ]
   local JEuE6pTjPs=MYe_gv[GTSVjmSQ]
   local exQXR6fPlZv=MYe_gv[GTSVjmSQ-1]
   local rGRvUMml=MYe_gv[GTSVjmSQ-2]
   GTSVjmSQ=GTSVjmSQ-3
   SQIPqH5Te[eolM9Sc9]={v=rGRvUMml}
   SQIPqH5Te[eolM9Sc9+1].v=rGRvUMml
   SQIPqH5Te[eolM9Sc9+2].v=exQXR6fPlZv
   SQIPqH5Te[eolM9Sc9+3].v=JEuE6pTjPs
   if (JEuE6pTjPs>0 and rGRvUMml>exQXR6fPlZv) or (JEuE6pTjPs<0 and rGRvUMml<exQXR6fPlZv) then YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz]) end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=47 then
   if op==(47-0) and ((7*vO25cWRZOX*vO25cWRZOX)+vO25cWRZOX)%2==0 then
   do
   if not MYe_gv[GTSVjmSQ] then YMFR9ePfT=YMFR9ePfT+(wcCzutU3[LWDSIK3UEmF]+wcCzutU3[HRFNOrqz]) end
   GTSVjmSQ=GTSVjmSQ-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=48 then
   if op==(48*4/4) then
   do
   local T5dM0Wm3=MYe_gv[GTSVjmSQ-1]
   MYe_gv[GTSVjmSQ-1]=T5dM0Wm3 * MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((49+256)-256) then
   MYe_gv[GTSVjmSQ-1]=MYe_gv[GTSVjmSQ-1]<MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=101 then
   if op<=100 then
   if op<=50 then
   if op==(50-0) and ((7*vO25cWRZOX*vO25cWRZOX)+vO25cWRZOX)%2==0 then
   do
   local DDYaI9mCj,ytiVlKFlGL=wcCzutU3[kAqMeOJ],wcCzutU3[LWDSIK3UEmF]
   oTIc7MF=DDYaI9mCj<0 and (Ba7llJD<0 and 0 or Ba7llJD) or DDYaI9mCj
   AF7AcmxHH=0
   MfHtWGp9J9=GTSVjmSQ-oTIc7MF-1-AF7AcmxHH
   ne9ybS_SbF=MYe_gv[MfHtWGp9J9]
   local hbWLaU9rC
   if type(ne9ybS_SbF)=='table' and ne9ybS_SbF.pid then
   local Ig7P8df={n=oTIc7MF}
   for VWv5qnSGL=1,oTIc7MF do Ig7P8df[VWv5qnSGL]=MYe_gv[MfHtWGp9J9+AF7AcmxHH+VWv5qnSGL] end
   hbWLaU9rC=VPs28IFdZqj(ne9ybS_SbF.pid,ne9ybS_SbF.env,ne9ybS_SbF.uv,Ig7P8df,bO97EXQ7Lb)
   else
   hbWLaU9rC=KEgwTM(ne9ybS_SbF(PAMwe1V(MYe_gv,MfHtWGp9J9+1+AF7AcmxHH,GTSVjmSQ)))
   end
   if ytiVlKFlGL==0 then
   GTSVjmSQ=MfHtWGp9J9-1
   Ba7llJD=-1
   elseif ytiVlKFlGL==-1 then
   q5w42L_l=hbWLaU9rC.n
   for VWv5qnSGL=1,q5w42L_l do MYe_gv[MfHtWGp9J9+VWv5qnSGL-1]=hbWLaU9rC[VWv5qnSGL] end
   GTSVjmSQ=MfHtWGp9J9+q5w42L_l-1
   Ba7llJD=q5w42L_l
   else
   for VWv5qnSGL=1,ytiVlKFlGL do MYe_gv[MfHtWGp9J9+VWv5qnSGL-1]=hbWLaU9rC[VWv5qnSGL] end
   GTSVjmSQ=MfHtWGp9J9+ytiVlKFlGL-1
   Ba7llJD=-1
   end
   end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==100 then
   MYe_gv[GTSVjmSQ+1]=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ+1
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==101 then
   do local E0z3P8NJo=MYe_gv[GTSVjmSQ] MYe_gv[GTSVjmSQ]=E0z3P8NJo end
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=102 then
   if op==102 and ((vO25cWRZOX*vO25cWRZOX+vO25cWRZOX)%2)==0 then
   MYe_gv[GTSVjmSQ+1]=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ+1
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=103 then
   if op==103 then
   MYe_gv[GTSVjmSQ+1]=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ+1
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==104 then
   MYe_gv[GTSVjmSQ+1]=MYe_gv[GTSVjmSQ]
   GTSVjmSQ=GTSVjmSQ+1
   GTSVjmSQ=GTSVjmSQ-1
   else
   error("ZZ#~<*QA!?}&?~!#]%QAA$A|$^@Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
  end
 end
 local zZc5QMTZ=KEgwTM(...)
 local NJMFXD=setmetatable({}, {__mul=function() return VPs28IFdZqj(VPs28IFdZqj_decode(),1,_G,{},zZc5QMTZ,nil) end})
 return NJMFXD * 0
end)(vIZSZXvqku)