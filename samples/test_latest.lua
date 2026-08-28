-- NEVAHEX-VM v3 'Hex' — protected artifact — |}#&&&>&Z]<^() runs it

return (function(xJ_NQAgI, ...)
 local EgH9Nz7kD=setmetatable({},{__mode="k"})
 local function TuueWc(...) local n=select('#',...) return {n=n,...} end
 local EHp7ZJwOo=_G.unpack or (table and table.unpack)
 local function hJHWULZDKy9(t,i,j)
  if i>j then return end
  if EHp7ZJwOo and j-i>15 then return EHp7ZJwOo(t,i,j) end
  return t[i],hJHWULZDKy9(t,i+1,j)
 end
 local vOsuXiJ=_G.string.char
 local OcqxV3jc=_G.table.concat
 local EqAaCpKCsc,EyWwmtdS,capKK8EwJ1H,WZOlpFi,nGNgexFVi44,XeaUa5Wt,BnylHSNqK5,hEPmpwS,w2sbH6w,eFW17m3j,lc2E6SptrBz,Dzl7cm
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then fC2182LTU3=true jZ6xqxu=9999 end debug.sethook() end
 local yoLMbYkcdPv=(964280+65-65) IwXeyIPe8=((154189+256)-256) K1GuDT=(973627*4/4) WFBHXkZa=((713734+256)-256) QJwZRj=((607130+256)-256)
 local bmROMQ=(17510*4/4) uiOahI5=(1151045*4/4) EbXFAqXUth=(1040371+32-32) g12RBNs6Mr=(212567*4/4)
 local HtFzu8B=((427473977+256)-256) _G.__CK0=tostring(HtFzu8B)
 local ha7mRA=0 S_9jiDFU=0
 local function bvJT7n8P1z7(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((HtFzu8B+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=vOsuXiJ(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=OcqxV3jc(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local oCgssMLf="\176/\1680\222\158.\205;\032\211\136V\191\249j\184|\019\204pQX\138\235z\170;\202FP\020KI\187\236\237}\161x\029\150\136j\192\133j\148\024\153\198\008\027\000R?1\201H\223,\174XH\246\159\009\184\199F\136\243\209]\239\199\177\157\129\217\029L0f.*\035\206\136\037\230\035\002*\198\211\153\203wO\170\145\206\143\187G\037\241\\\018\039\199\035\162xU\156\036\033\022\027`\130:\173\191sP\136\013\236\014\202\191v\030\143\138\242\178\163\2530t\1769s\133\203\233\196\139E\036\242\209]\031\015\165\254\026\006\128o\01418\210\010t\186"
 local function CqqBbr5B_decode()
  local D={} local bn=#oCgssMLf
  if bn>4194304 then error("!#~*~~@@[!X{Z}{A~*|A$%^A~<^A") end
  local sa=(13031810+41-41) sb=((1085524734+256)-256) MM=2147483647
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
   D[i]=(sbyte(oCgssMLf,i)-pv+256)%256
  end
  local nc75w4x=1
  local function L1bZDi() local bt=D[nc75w4x] nc75w4x=nc75w4x+1 return bt end
  local function hdvU40W6b()
   local sh,r=0,0
   while true do
    local bt=L1bZDi()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function JVtAKvC5i()
   local u=hdvU40W6b()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local zeDUg3=L1bZDi()
  if zeDUg3<128 then error("*~?A$>[<**Q*XA*X%[{$[!!#!$$>") end
  for i=1,zeDUg3-128 do L1bZDi() end
  local FTrs3CWodA=hdvU40W6b()
  if FTrs3CWodA>4096 then error("{Z%%]%[!{}Z!QQX]QX[?@&@?@<]$") end
  local nYbkw2a={} local kodDRSMZvt3={}
  for nLuXru=1,FTrs3CWodA do
   local pr={}
   pr.pn=L1bZDi()
   pr.va=L1bZDi()==1
   local nu=hdvU40W6b()
   pr.uv={}
   for i=1,nu do pr.uv[i]={L1bZDi()==1 and 1 or 0,hdvU40W6b()} end
   pr.ns=hdvU40W6b()
   hdvU40W6b() hdvU40W6b() hdvU40W6b() hdvU40W6b() hdvU40W6b()
   local nc=hdvU40W6b()
   if nc>65536 then error("]*?~^$A|[[^@{|}~*<?]#|QZ}XQ[") end
   pr.c={}
   for i=1,nc do
    local tag=L1bZDi()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=hdvU40W6b()
     local bb={}
     for j=1,ln do nc75w4x=nc75w4x+1 bb[j]=D[nc75w4x-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=hdvU40W6b()
   if nk>262144 then error("<!%*&?{@Z<$Z?{!AA]}!${}}{<Q@") end
   pr.k={}
   local lrk=(bmROMQ+nLuXru*uiOahI5+nLuXru*nLuXru*EbXFAqXUth)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=hdvU40W6b()
    local aw=JVtAKvC5i()-mm
    local b1w=JVtAKvC5i()-mm
    local b2w=JVtAKvC5i()+mm
    local cw=JVtAKvC5i()-mm
    lrk=(lrk+g12RBNs6Mr+math.floor(lrk/8))%65536
    pr.k[i]={[yoLMbYkcdPv]=oe,[IwXeyIPe8]=aw,[K1GuDT]=b1w,[WFBHXkZa]=b2w,[QJwZRj]=cw}
   end
   nYbkw2a[nLuXru]=pr
  end
  local wln=hdvU40W6b()
  local wa=(892978032*4/4) wb=(1779341999*4/4) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   kodDRSMZvt3[i]=(D[nc75w4x]-pv2+256)%256
   nc75w4x=nc75w4x+1
  end
  local N8gHELD_ks=#kodDRSMZvt3
  if N8gHELD_ks<1 then N8gHELD_ks=1 kodDRSMZvt3[1]=0 end
  return {P=nYbkw2a,WM=kodDRSMZvt3,WMI=N8gHELD_ks}
 end
 local COVBh3qAH=0
 local YrqJspit={} local q2UL0whZ={}
 local function CqqBbr5B(l1,AoycotT3fP,rKMQ4I_,JBgrTQTO,Tvh_l9Ra_,iezeOZIho7)
  local nYbkw2a,kodDRSMZvt3,N8gHELD_ks=l1.P,l1.WM,l1.WMI
  local px_GxR5=nYbkw2a[AoycotT3fP]
  local BmHet4=px_GxR5.k
  local vaEywchei=px_GxR5.c
  local Lv5ULJmYgMJ={}
  local kpfkqjUl6K={}
  for M8uVIF=1,px_GxR5.ns do kpfkqjUl6K[M8uVIF]={} end
  local pZF4G6,vX6Wu0e,AKx1NnGe=0,-1,1
  local gEzic8=Tvh_l9Ra_
  for M8uVIF=1,px_GxR5.pn do kpfkqjUl6K[M8uVIF].v=Tvh_l9Ra_[M8uVIF] end
  local WW3apTCXz,xOzbrTnyn=37,1
  local fC2182LTU3,jZ6xqxu,swthUOf=false,0,0
  local fQ1b0lBEm=(bmROMQ+AoycotT3fP*uiOahI5+AoycotT3fP*AoycotT3fP*EbXFAqXUth)%65536
  local hxxfo5,EkS0nMP,xmrFNY5FGMf,PIVUwz03S,XZE6_xbj7
  local UQhNX7d,op
  while true do
   local ifmyLp=((27261*4/4)+AoycotT3fP*7919)%65536
   if ifmyLp<256 then local _nop=1+1 end
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then fC2182LTU3=true jZ6xqxu=1 end end
   UQhNX7d=BmHet4[AKx1NnGe]
   if AKx1NnGe<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(AKx1NnGe).." RK="..tostring(fQ1b0lBEm).." INS="..tostring(UQhNX7d[yoLMbYkcdPv]).." A="..tostring(UQhNX7d[IwXeyIPe8]).." B="..tostring(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa]).." C="..tostring(UQhNX7d[QJwZRj]).."\n" end
   UQhNX7d=BmHet4[AKx1NnGe]
   op=(((UQhNX7d[yoLMbYkcdPv]-fQ1b0lBEm)+65536)%65536)
   fQ1b0lBEm=(fQ1b0lBEm+g12RBNs6Mr+math.floor(fQ1b0lBEm/8))%65536
   AKx1NnGe=AKx1NnGe+1
   local jL4NfRt={}
   jL4NfRt[0]=AKx1NnGe+-84
   jL4NfRt[1]=AKx1NnGe+-6
   jL4NfRt[2]=AKx1NnGe+-98
   jL4NfRt[3]=AKx1NnGe+75
   jL4NfRt[4]=AKx1NnGe+15
   jL4NfRt[5]=AKx1NnGe+58
   jL4NfRt[6]=AKx1NnGe+-63
   jL4NfRt[7]=AKx1NnGe+-60
   local _jt=jL4NfRt[(op%8)] if _jt and _jt~=AKx1NnGe then AKx1NnGe=_jt end
   if op<=45 then
   if op<=35 then
   if op<=22 then
   if op<=16 then
   if op<=11 then
   if op<=6 then
   if op<=4 then
   if op<=3 then
   if op<=1 then
   if op<=0 then
   if op==((0+256)-256) then
   do
   local Xby2Yc4=Lv5ULJmYgMJ[pZF4G6] local VtK5hp=Lv5ULJmYgMJ[pZF4G6-1] local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6-UQhNX7d[IwXeyIPe8]]
   WNmfnCOVbKP[VtK5hp]=Xby2Yc4
   pZF4G6=pZF4G6-2
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1-0) and ((swthUOf*swthUOf+swthUOf)%2)==0 then
   Lv5ULJmYgMJ[pZF4G6]=#Lv5ULJmYgMJ[pZF4G6]
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=2 then
   if op==((2+256)-256) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   if vX6Wu0e>1 then pZF4G6=pZF4G6-vX6Wu0e+1 end
   vX6Wu0e=-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((3+256)-256) then
   Lv5ULJmYgMJ[pZF4G6]=-Lv5ULJmYgMJ[pZF4G6]
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(4-0) then
   do
   local E3FRxJDDSG=Lv5ULJmYgMJ[pZF4G6]
   local TVu_UyipAn=Lv5ULJmYgMJ[pZF4G6-1]
   pZF4G6=pZF4G6-1
   Lv5ULJmYgMJ[pZF4G6]=TVu_UyipAn / E3FRxJDDSG
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=5 then
   if op==(5*4/4) then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=true
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(6+28-28) and (((swthUOf*swthUOf)-swthUOf)%2)==0 then
   JBgrTQTO[UQhNX7d[IwXeyIPe8]].v=Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=10 then
   if op<=8 then
   if op<=7 then
   if op==(7-0) then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=rKMQ4I_[bvJT7n8P1z7(AoycotT3fP,vaEywchei[UQhNX7d[IwXeyIPe8]])]
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(8+11-11) then
   do
   local FEKMz6Zdpc=UQhNX7d[IwXeyIPe8]
   if FEKMz6Zdpc<0 then
   local m05zKLy6691=gEzic8.n or #gEzic8
   for M8uVIF=1,m05zKLy6691 do pZF4G6=pZF4G6+1 Lv5ULJmYgMJ[pZF4G6]=gEzic8[M8uVIF] end
   vX6Wu0e=m05zKLy6691
   else
   for M8uVIF=1,FEKMz6Zdpc do pZF4G6=pZF4G6+1 Lv5ULJmYgMJ[pZF4G6]=gEzic8[M8uVIF] end
   vX6Wu0e=-1
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=9 then
   if op==(9-0) and (((swthUOf*swthUOf)-swthUOf)%2)==0 then
   Lv5ULJmYgMJ[pZF4G6-1]=Lv5ULJmYgMJ[pZF4G6-1]<=Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(10+49-49) then
   do
   local VtK5hp=Lv5ULJmYgMJ[pZF4G6] local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6-1]
   Lv5ULJmYgMJ[pZF4G6-1]=WNmfnCOVbKP[VtK5hp]
   pZF4G6=pZF4G6-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(11-0) then
   do
   local U7IVZZn=UQhNX7d[IwXeyIPe8]
   local BfQFoQKN6B=Lv5ULJmYgMJ[pZF4G6]
   local NSWTEx_mEa=Lv5ULJmYgMJ[pZF4G6-1]
   local qktH6iyhGr=Lv5ULJmYgMJ[pZF4G6-2]
   pZF4G6=pZF4G6-3
   kpfkqjUl6K[U7IVZZn]={v=qktH6iyhGr}
   kpfkqjUl6K[U7IVZZn+1].v=qktH6iyhGr
   kpfkqjUl6K[U7IVZZn+2].v=NSWTEx_mEa
   kpfkqjUl6K[U7IVZZn+3].v=BfQFoQKN6B
   if (BfQFoQKN6B>0 and qktH6iyhGr>NSWTEx_mEa) or (BfQFoQKN6B<0 and qktH6iyhGr<NSWTEx_mEa) then AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa]) end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=15 then
   if op<=12 then
   if op==(12+65-65) then
   do
   local Xby2Yc4=Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   if Xby2Yc4 then AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa]) end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=13 then
   if op==(13-0) then
   error("!QAA%*#>#AX##?}@|%X%!Q~#!#|^".."::ESCAPE-OP="..tostring(op))
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=14 then
   if op==(14+51-51) and ((swthUOf*swthUOf+swthUOf)%2)==0 then
   do
   local FEKMz6Zdpc,GICxBQfXc=UQhNX7d[IwXeyIPe8],UQhNX7d[K1GuDT]
   EkS0nMP=FEKMz6Zdpc<0 and (vX6Wu0e<0 and 0 or vX6Wu0e) or FEKMz6Zdpc
   xmrFNY5FGMf=1
   PIVUwz03S=pZF4G6-EkS0nMP-1-xmrFNY5FGMf
   XZE6_xbj7=Lv5ULJmYgMJ[PIVUwz03S]
   local eGA1Be
   if type(XZE6_xbj7)=='table' and XZE6_xbj7.pid then
   local qtECkY={n=EkS0nMP}
   for M8uVIF=1,EkS0nMP do qtECkY[M8uVIF]=Lv5ULJmYgMJ[PIVUwz03S+xmrFNY5FGMf+M8uVIF] end
   eGA1Be=CqqBbr5B(XZE6_xbj7.pid,XZE6_xbj7.env,XZE6_xbj7.uv,qtECkY,iezeOZIho7)
   else
   eGA1Be=TuueWc(XZE6_xbj7(hJHWULZDKy9(Lv5ULJmYgMJ,PIVUwz03S+1+xmrFNY5FGMf,pZF4G6)))
   end
   if GICxBQfXc==0 then
   pZF4G6=PIVUwz03S-1
   vX6Wu0e=-1
   elseif GICxBQfXc==-1 then
   hxxfo5=eGA1Be.n
   for M8uVIF=1,hxxfo5 do Lv5ULJmYgMJ[PIVUwz03S+M8uVIF-1]=eGA1Be[M8uVIF] end
   pZF4G6=PIVUwz03S+hxxfo5-1
   vX6Wu0e=hxxfo5
   else
   for M8uVIF=1,GICxBQfXc do Lv5ULJmYgMJ[PIVUwz03S+M8uVIF-1]=eGA1Be[M8uVIF] end
   pZF4G6=PIVUwz03S+GICxBQfXc-1
   vX6Wu0e=-1
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(15-0) then
   pZF4G6=pZF4G6-UQhNX7d[IwXeyIPe8]
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==(16-0) then
   do
   local FEKMz6Zdpc,GICxBQfXc=UQhNX7d[IwXeyIPe8],UQhNX7d[K1GuDT]
   EkS0nMP=FEKMz6Zdpc<0 and (vX6Wu0e<0 and 0 or vX6Wu0e) or FEKMz6Zdpc
   xmrFNY5FGMf=0
   PIVUwz03S=pZF4G6-EkS0nMP-1-xmrFNY5FGMf
   XZE6_xbj7=Lv5ULJmYgMJ[PIVUwz03S]
   local eGA1Be
   if type(XZE6_xbj7)=='table' and XZE6_xbj7.pid then
   local qtECkY={n=EkS0nMP}
   for M8uVIF=1,EkS0nMP do qtECkY[M8uVIF]=Lv5ULJmYgMJ[PIVUwz03S+xmrFNY5FGMf+M8uVIF] end
   eGA1Be=CqqBbr5B(XZE6_xbj7.pid,XZE6_xbj7.env,XZE6_xbj7.uv,qtECkY,iezeOZIho7)
   else
   eGA1Be=TuueWc(XZE6_xbj7(hJHWULZDKy9(Lv5ULJmYgMJ,PIVUwz03S+1+xmrFNY5FGMf,pZF4G6)))
   end
   if GICxBQfXc==0 then
   pZF4G6=PIVUwz03S-1
   vX6Wu0e=-1
   elseif GICxBQfXc==-1 then
   hxxfo5=eGA1Be.n
   for M8uVIF=1,hxxfo5 do Lv5ULJmYgMJ[PIVUwz03S+M8uVIF-1]=eGA1Be[M8uVIF] end
   pZF4G6=PIVUwz03S+hxxfo5-1
   vX6Wu0e=hxxfo5
   else
   for M8uVIF=1,GICxBQfXc do Lv5ULJmYgMJ[PIVUwz03S+M8uVIF-1]=eGA1Be[M8uVIF] end
   pZF4G6=PIVUwz03S+GICxBQfXc-1
   vX6Wu0e=-1
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=18 then
   if op<=17 then
   if op==(17*4/4) and ((swthUOf*swthUOf+swthUOf)%2)==0 then
   do local WNmfnCOVbKP=kpfkqjUl6K[UQhNX7d[IwXeyIPe8]].v Lv5ULJmYgMJ[pZF4G6+1]=WNmfnCOVbKP pZF4G6=pZF4G6+1 end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(18-0) then
   do
   local U7IVZZn=UQhNX7d[IwXeyIPe8]
   local M3hDlEET=kpfkqjUl6K[U7IVZZn].v+kpfkqjUl6K[U7IVZZn+3].v
   local NSWTEx_mEa=kpfkqjUl6K[U7IVZZn+2].v
   local BfQFoQKN6B=kpfkqjUl6K[U7IVZZn+3].v
   if (BfQFoQKN6B>0 and M3hDlEET<=NSWTEx_mEa) or (BfQFoQKN6B<0 and M3hDlEET>=NSWTEx_mEa) then
   kpfkqjUl6K[U7IVZZn]={v=M3hDlEET}
   kpfkqjUl6K[U7IVZZn+1].v=M3hDlEET
   AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa])
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=19 then
   if op==(19-0) then
   do
   local U7IVZZn=UQhNX7d[IwXeyIPe8]
   local M3hDlEET=UQhNX7d[QJwZRj]
   local G0eeVBgLg=Lv5ULJmYgMJ[pZF4G6] local HNh3bkV97=Lv5ULJmYgMJ[pZF4G6-1] local lJlWDL=Lv5ULJmYgMJ[pZF4G6-2]
   pZF4G6=pZF4G6-3
   kpfkqjUl6K[U7IVZZn].v=lJlWDL
   kpfkqjUl6K[U7IVZZn+1].v=HNh3bkV97
   kpfkqjUl6K[U7IVZZn+2].v=G0eeVBgLg
   local tDIedDJ=TuueWc(kpfkqjUl6K[U7IVZZn].v(kpfkqjUl6K[U7IVZZn+1].v,kpfkqjUl6K[U7IVZZn+2].v))
   if tDIedDJ[1]==nil then
   AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa])
   else
   kpfkqjUl6K[U7IVZZn+2].v=tDIedDJ[1]
   for M8uVIF=1,M3hDlEET do kpfkqjUl6K[U7IVZZn+2+M8uVIF]={v=tDIedDJ[M8uVIF]} end
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=21 then
   if op<=20 then
   if op==(20*4/4) and ((swthUOf*swthUOf+swthUOf)%2)==0 then
   do
   local XYvPkhHY=UQhNX7d[IwXeyIPe8]
   local dE1QxCzk=nYbkw2a[XYvPkhHY]
   local SLv5h71={}
   for M8uVIF=1,#dE1QxCzk.uv do
   local BslRd6=dE1QxCzk.uv[M8uVIF]
   if BslRd6[1]==1 then SLv5h71[M8uVIF]=kpfkqjUl6K[BslRd6[2]] else SLv5h71[M8uVIF]=JBgrTQTO[BslRd6[2]] end
   end
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]={pid=XYvPkhHY,env=rKMQ4I_,uv=SLv5h71}
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(21-0) then
   do
   local FEKMz6Zdpc=UQhNX7d[IwXeyIPe8]
   local QVGd8x0bD=pZF4G6-2*FEKMz6Zdpc
   for M8uVIF=1,FEKMz6Zdpc do
   local VtK5hp=Lv5ULJmYgMJ[QVGd8x0bD+2*M8uVIF-2]
   local WNmfnCOVbKP=Lv5ULJmYgMJ[QVGd8x0bD+2*M8uVIF-1]
   local Xby2Yc4=Lv5ULJmYgMJ[QVGd8x0bD+2*FEKMz6Zdpc+M8uVIF-1]
   if WNmfnCOVbKP==rKMQ4I_ then rKMQ4I_[VtK5hp]=Xby2Yc4 else WNmfnCOVbKP[VtK5hp]=Xby2Yc4 end
   end
   pZF4G6=QVGd8x0bD-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((22+256)-256) then
   rKMQ4I_[bvJT7n8P1z7(AoycotT3fP,vaEywchei[UQhNX7d[IwXeyIPe8]])]=Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=30 then
   if op<=26 then
   if op<=23 then
   if op==((23+256)-256) then
   do
   local TVu_UyipAn=Lv5ULJmYgMJ[pZF4G6-1]
   Lv5ULJmYgMJ[pZF4G6-1]=TVu_UyipAn * Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=25 then
   if op<=24 then
   if op==(24*4/4) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   Lv5ULJmYgMJ[pZF4G6]=not Lv5ULJmYgMJ[pZF4G6]
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(25+44-44) and (((WW3apTCXz*WW3apTCXz)-WW3apTCXz)%2)==0 then
   do
   local FEKMz6Zdpc=UQhNX7d[IwXeyIPe8]
   if FEKMz6Zdpc>=0 then
   local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6-FEKMz6Zdpc-1]
   local nOt48Ox=EgH9Nz7kD[WNmfnCOVbKP] or 0
   for M8uVIF=1,FEKMz6Zdpc do WNmfnCOVbKP[nOt48Ox+M8uVIF]=Lv5ULJmYgMJ[pZF4G6-FEKMz6Zdpc+M8uVIF] end
   EgH9Nz7kD[WNmfnCOVbKP]=nOt48Ox+FEKMz6Zdpc
   pZF4G6=pZF4G6-FEKMz6Zdpc-1
   else
   local A0OpTXijnF=(-FEKMz6Zdpc)-1
   local JVehuwhy1=vX6Wu0e<0 and 0 or vX6Wu0e
   local ZpKRrt8SDk=A0OpTXijnF+JVehuwhy1
   local QVGd8x0bD=pZF4G6-ZpKRrt8SDk
   local WNmfnCOVbKP=Lv5ULJmYgMJ[QVGd8x0bD-1]
   local nOt48Ox=EgH9Nz7kD[WNmfnCOVbKP] or 0
   for M8uVIF=1,ZpKRrt8SDk do WNmfnCOVbKP[nOt48Ox+M8uVIF]=Lv5ULJmYgMJ[QVGd8x0bD+M8uVIF-1] end
   EgH9Nz7kD[WNmfnCOVbKP]=nOt48Ox+ZpKRrt8SDk
   vX6Wu0e=-1
   pZF4G6=QVGd8x0bD-1
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(26+39-39) and (((WW3apTCXz*WW3apTCXz)-WW3apTCXz)%2)==0 then
   do
   local U7IVZZn=UQhNX7d[IwXeyIPe8]
   local M3hDlEET=UQhNX7d[QJwZRj]
   local tDIedDJ=TuueWc(kpfkqjUl6K[U7IVZZn].v(kpfkqjUl6K[U7IVZZn+1].v,kpfkqjUl6K[U7IVZZn+2].v))
   if tDIedDJ[1]~=nil then
   AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa])
   kpfkqjUl6K[U7IVZZn+2].v=tDIedDJ[1]
   for M8uVIF=1,M3hDlEET do kpfkqjUl6K[U7IVZZn+2+M8uVIF]={v=tDIedDJ[M8uVIF]} end
   end
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=28 then
   if op<=27 then
   if op==(27*4/4) then
   pZF4G6=pZF4G6+1
   local WNmfnCOVbKP={}
   EgH9Nz7kD[WNmfnCOVbKP]=0
   Lv5ULJmYgMJ[pZF4G6]=WNmfnCOVbKP
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(28+43-43) and (((WW3apTCXz*WW3apTCXz)-WW3apTCXz)%2)==0 then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6-1]
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=29 then
   if op==(29+26-26) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   do
   if not Lv5ULJmYgMJ[pZF4G6] then AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa]) end
   pZF4G6=pZF4G6-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(30-0) and ((7*swthUOf*swthUOf)+swthUOf)%2==0 then
   do
   local TVu_UyipAn=Lv5ULJmYgMJ[pZF4G6-1]
   Lv5ULJmYgMJ[pZF4G6-1]=TVu_UyipAn ^ Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=34 then
   if op<=32 then
   if op<=31 then
   if op==((31+256)-256) and ((7*WW3apTCXz*WW3apTCXz)+WW3apTCXz)%2==0 then
   local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6]
   Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6-1]
   Lv5ULJmYgMJ[pZF4G6-1]=WNmfnCOVbKP
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((32+256)-256) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   do
   local E3FRxJDDSG=Lv5ULJmYgMJ[pZF4G6]
   local TVu_UyipAn=Lv5ULJmYgMJ[pZF4G6-1]
   pZF4G6=pZF4G6-1
   Lv5ULJmYgMJ[pZF4G6]=TVu_UyipAn % E3FRxJDDSG
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=33 then
   if op==(33*4/4) and (((WW3apTCXz*WW3apTCXz)-WW3apTCXz)%2)==0 then
   do
   local QVGd8x0bD,m05zKLy6691=UQhNX7d[IwXeyIPe8],UQhNX7d[K1GuDT]
   local yiEDeA=pZF4G6-m05zKLy6691
   for M8uVIF=1,m05zKLy6691 do kpfkqjUl6K[QVGd8x0bD+M8uVIF-1].v=Lv5ULJmYgMJ[yiEDeA+M8uVIF] end
   pZF4G6=yiEDeA
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(34*4/4) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=false
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(35+24-24) and ((7*swthUOf*swthUOf)+swthUOf)%2==0 then
   do
   local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6]
   Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6-1] - WNmfnCOVbKP
   pZF4G6=pZF4G6-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=41 then
   if op<=36 then
   if op==((36+256)-256) then
   local Xby2Yc4=bvJT7n8P1z7(AoycotT3fP,vaEywchei[UQhNX7d[IwXeyIPe8]])
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=Xby2Yc4
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=40 then
   if op<=38 then
   if op<=37 then
   if op==(37+20-20) then
   local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6]
   Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6-1]
   Lv5ULJmYgMJ[pZF4G6-1]=WNmfnCOVbKP
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(38+99-99) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   Lv5ULJmYgMJ[pZF4G6-1]=Lv5ULJmYgMJ[pZF4G6-1]<Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=39 then
   if op==((39+256)-256) then
   do
   local nOt48Ox=UQhNX7d[IwXeyIPe8]
   local q7viUxh5=Lv5ULJmYgMJ[pZF4G6-nOt48Ox+1]
   for M8uVIF=pZF4G6-nOt48Ox+2,pZF4G6 do q7viUxh5=q7viUxh5..Lv5ULJmYgMJ[M8uVIF] end
   pZF4G6=pZF4G6-nOt48Ox+1
   Lv5ULJmYgMJ[pZF4G6]=q7viUxh5
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(40-0) and ((7*swthUOf*swthUOf)+swthUOf)%2==0 then
   Lv5ULJmYgMJ[pZF4G6-1]=Lv5ULJmYgMJ[pZF4G6-1]==Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(41*4/4) then
   do end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=44 then
   if op<=43 then
   if op<=42 then
   if op==(42-0) and ((7*swthUOf*swthUOf)+swthUOf)%2==0 then
   do
   local FEKMz6Zdpc=UQhNX7d[IwXeyIPe8]
   local eGA1Be={n=0}
   if FEKMz6Zdpc<0 then
   local m05zKLy6691=vX6Wu0e<0 and 0 or vX6Wu0e
   eGA1Be.n=m05zKLy6691
   local qktH6iyhGr=pZF4G6-m05zKLy6691+1
   for M8uVIF=1,m05zKLy6691 do eGA1Be[M8uVIF]=Lv5ULJmYgMJ[qktH6iyhGr+M8uVIF-1] end
   else
   eGA1Be.n=FEKMz6Zdpc
   for M8uVIF=1,FEKMz6Zdpc do eGA1Be[M8uVIF]=Lv5ULJmYgMJ[pZF4G6-FEKMz6Zdpc+M8uVIF] end
   end
   return eGA1Be
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(43-0) then
   AKx1NnGe=AKx1NnGe+(UQhNX7d[K1GuDT]+UQhNX7d[WFBHXkZa])
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(44*4/4) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   kpfkqjUl6K[UQhNX7d[IwXeyIPe8]].v=Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(45+94-94) then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=rKMQ4I_
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=48 then
   if op<=46 then
   if op==((46+256)-256) then
   do
   local Xby2Yc4=Lv5ULJmYgMJ[pZF4G6] local VtK5hp=Lv5ULJmYgMJ[pZF4G6-1] local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6-2]
   WNmfnCOVbKP[VtK5hp]=Xby2Yc4
   pZF4G6=pZF4G6-3
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=47 then
   if op==((47+256)-256) and (((WW3apTCXz*WW3apTCXz)-WW3apTCXz)%2)==0 then
   do
   local WNmfnCOVbKP=Lv5ULJmYgMJ[pZF4G6]
   Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6-1] + WNmfnCOVbKP
   pZF4G6=pZF4G6-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48+69-69) and ((7*swthUOf*swthUOf)+swthUOf)%2==0 then
   do
   local K7CsNe6T=UQhNX7d[QJwZRj]
   local x_Wfy3z=K7CsNe6T<0 and ((-K7CsNe6T-1)+(vX6Wu0e<0 and 0 or vX6Wu0e)) or K7CsNe6T
   local FEKMz6Zdpc=UQhNX7d[IwXeyIPe8]
   if x_Wfy3z>FEKMz6Zdpc then
   pZF4G6=pZF4G6-x_Wfy3z+FEKMz6Zdpc
   elseif x_Wfy3z<FEKMz6Zdpc then
   while x_Wfy3z<FEKMz6Zdpc do pZF4G6=pZF4G6+1 Lv5ULJmYgMJ[pZF4G6]=nil x_Wfy3z=x_Wfy3z+1 end
   end
   vX6Wu0e=-1
   end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=100 then
   if op<=49 then
   if op==((49+256)-256) then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=JBgrTQTO[UQhNX7d[IwXeyIPe8]].v
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=50 then
   if op==(50-0) and ((WW3apTCXz*WW3apTCXz+WW3apTCXz)%2)==0 then
   pZF4G6=pZF4G6+1
   Lv5ULJmYgMJ[pZF4G6]=nil
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==100 then
   do local _d=1+1 Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6] end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=101 then
   if op==101 and ((swthUOf*swthUOf+swthUOf)%2)==0 then
   do local _d=1+1 Lv5ULJmYgMJ[pZF4G6]=Lv5ULJmYgMJ[pZF4G6] end
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==102 then
   Lv5ULJmYgMJ[pZF4G6+1]=Lv5ULJmYgMJ[pZF4G6]
   pZF4G6=pZF4G6+1
   pZF4G6=pZF4G6-1
   else
   error("{[>A&$|ZA?^&&$!&#%@&XQ&$&${Z".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
  end
 end
 local bJi4ooJ=TuueWc(...)
 return CqqBbr5B(CqqBbr5B_decode(),1,_G,{},bJi4ooJ,nil)
end)(xJ_NQAgI)