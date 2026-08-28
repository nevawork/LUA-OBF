-- NEVAHEX-VM v3 'Hex' — protected artifact — ~&~@Q$!^!^{Z() runs it

return (function(X_H5xl, ...)
 local sLtWBTed=setmetatable({},{__mode="k"})
 local function p55kTlRK(...) local n=select('#',...) return {n=n,...} end
 local PuRe45jU=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function hAHXa9(t,i,j)
  if i>j then return end
  if PuRe45jU and j-i>15 then return PuRe45jU(t,i,j) end
  return t[i],hAHXa9(t,i+1,j)
 end
 local AOGV4H06=_G.string.char
 local WXQ8RQAhMs=_G.table.concat
 local si9YRdca,hBw64fKJs,fcNS9BuyJd,zxcxQQcQY,Ve8s1jw0w,wfBBMU,hS4a7ElI2,BDUUxS0Sk,YsXf2HSqx,UlH6UcYvk,C23G5_CY85b,kFuJBA
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then T_uzGS0uQ6=true QPSRTk=9999 end debug.sethook() end
 local CeW1JvqVN=(371268+70-70) fcez04=(493313*4/4) ZtMm1ZlyzB=(67372+52-52) LxMPuNBtAVC=(849459+85-85) CrXB21J9k=((528308+256)-256)
 local SMoE9q_Vv6=(37296*4/4) bx9VP_82L=((1599045+256)-256) DSo6c2e2=((1631461+256)-256) ayWEyv8=((87249+256)-256)
 local oP__hE7w5=(403912150*4/4) _G.__CK0=tostring(oP__hE7w5)
 local i4D4UW6yUp3=0 YiQiS8=0
 local function P7Sk5QbU(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((oP__hE7w5+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=AOGV4H06(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=WXQ8RQAhMs(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local HPdnOmatB="s\170\001\140Xr\029\1960\012\142,4\150\243\230C\019;F3\009\203,\172\157v\216\2080\142\\\221\182\025\212\197\000\207\010\220S0O5r\169\029\227I\179\015mZN\011]\241[\182\221\009\012\249C\168\026\"\014\187\182\011\183Eu@\015k\208\208\239\252]\0192|\206:\230n\010\\\216\165\168^\226\015\004\021f6\166\130M;\036S\179\195\135\018l.\252\245\249yz\136\141\180\000Q=\255n\0397\192\038\217\008I~+9\234\242\237QH"
 local function sN6Yo9_decode()
  local D={} local bn=#HPdnOmatB
  if bn>4194304 then error("%X*?^Z%$${X|&|?X|@*[~*>~~^?%") end
  local sa=(104566830+73-73) sb=((783625885+256)-256) MM=2147483647
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
   D[i]=(sbyte(HPdnOmatB,i)-pv+256)%256
  end
  local Q_fwXRw_vGp=1
  local function PdkjhM40Ls() local bt=D[Q_fwXRw_vGp] Q_fwXRw_vGp=Q_fwXRw_vGp+1 return bt end
  local function qtGocCf0j()
   local sh,r=0,0
   while true do
    local bt=PdkjhM40Ls()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function RwXsEh()
   local u=qtGocCf0j()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local ERNJ6Md3sL=PdkjhM40Ls()
  if ERNJ6Md3sL<128 then error("[~#*%$<>^A}}A[*XX%Q>{}[@>?*>") end
  for i=1,ERNJ6Md3sL-128 do PdkjhM40Ls() end
  local NpS6ne=qtGocCf0j()
  if NpS6ne>4096 then error("|@&^$Z&#Q~><~<A%ZQZ?A]X&!*[<") end
  local R8t8Hox={} local KPxn58GF={}
  for tR8Tl35Ho=1,NpS6ne do
   local pr={}
   pr.pn=PdkjhM40Ls()
   pr.va=PdkjhM40Ls()==1
   local nu=qtGocCf0j()
   pr.uv={}
   for i=1,nu do pr.uv[i]={PdkjhM40Ls()==1 and 1 or 0,qtGocCf0j()} end
   pr.ns=qtGocCf0j()
   qtGocCf0j() qtGocCf0j() qtGocCf0j() qtGocCf0j() qtGocCf0j()
   local nc=qtGocCf0j()
   if nc>65536 then error("#?%Q]]%&QQ}@]&[^>{$@<X|X[<@]") end
   pr.c={}
   for i=1,nc do
    local tag=PdkjhM40Ls()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=qtGocCf0j()
     local bb={}
     for j=1,ln do Q_fwXRw_vGp=Q_fwXRw_vGp+1 bb[j]=D[Q_fwXRw_vGp-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=qtGocCf0j()
   if nk>262144 then error("}|~!|&A^*|>Q!^~%[>!]~@A[&$#Z") end
   pr.k={}
   local lrk=(SMoE9q_Vv6+tR8Tl35Ho*bx9VP_82L+tR8Tl35Ho*tR8Tl35Ho*DSo6c2e2)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=qtGocCf0j()
    local aw=RwXsEh()-mm
    local b1w=RwXsEh()-mm
    local b2w=RwXsEh()+mm
    local cw=RwXsEh()-mm
    lrk=(lrk+ayWEyv8+math.floor(lrk/8))%65536
    pr.k[i]={[CeW1JvqVN]=oe,[fcez04]=aw,[ZtMm1ZlyzB]=b1w,[LxMPuNBtAVC]=b2w,[CrXB21J9k]=cw}
   end
   R8t8Hox[tR8Tl35Ho]=pr
  end
  local wln=qtGocCf0j()
  local wa=(1097449003*4/4) wb=(509536244+96-96) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   KPxn58GF[i]=(D[Q_fwXRw_vGp]-pv2+256)%256
   Q_fwXRw_vGp=Q_fwXRw_vGp+1
  end
  local yqFF9qMs=#KPxn58GF
  if yqFF9qMs<1 then yqFF9qMs=1 KPxn58GF[1]=0 end
  return {P=R8t8Hox,WM=KPxn58GF,WMI=yqFF9qMs}
 end
 local S58Q1DV3EUU=0
 local A9B8ekasJp={} local zS8lUJUP={}
 local function sN6Yo9(l1,IODZHri6,Q4dyG98uTwS,QHgjPCGV,fzXZlElBi,fuFHeT)
  local R8t8Hox,KPxn58GF,yqFF9qMs=l1.P,l1.WM,l1.WMI
  local GfhKNCXL3=R8t8Hox[IODZHri6]
  local R71ihP1=GfhKNCXL3.k
  local VMtkfvd=GfhKNCXL3.c
  local jGcXtcFgQ={}
  local XgGyoZSwV={}
  for l49IFfHz2XI=1,GfhKNCXL3.ns do XgGyoZSwV[l49IFfHz2XI]={} end
  local KBl3xINCPRm,pZ8_clwuJtU,NnWIYmSMN=0,-1,1
  local nE6CT7=fzXZlElBi
  for l49IFfHz2XI=1,GfhKNCXL3.pn do XgGyoZSwV[l49IFfHz2XI].v=fzXZlElBi[l49IFfHz2XI] end
  local kq80Af,G8jgfjy=37,1
  local T_uzGS0uQ6,QPSRTk,cc6XzdCEL=false,0,0
  local mabHVgTF=(SMoE9q_Vv6+IODZHri6*bx9VP_82L+IODZHri6*IODZHri6*DSo6c2e2)%65536
  local sVsaUrsboX,YO6llbT3e,ElSMFg,cq5EN9Y4Y,U8r_3H
  local aWL5hV,op
  while true do
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then T_uzGS0uQ6=true QPSRTk=1 end end
   aWL5hV=R71ihP1[NnWIYmSMN]
   if NnWIYmSMN<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(NnWIYmSMN).." RK="..tostring(mabHVgTF).." INS="..tostring(aWL5hV[CeW1JvqVN]).." A="..tostring(aWL5hV[fcez04]).." B="..tostring(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC]).." C="..tostring(aWL5hV[CrXB21J9k]).."\n" end
   aWL5hV=R71ihP1[NnWIYmSMN]
   op=(((aWL5hV[CeW1JvqVN]-mabHVgTF)+65536)%65536)
   mabHVgTF=(mabHVgTF+ayWEyv8+math.floor(mabHVgTF/8))%65536
   NnWIYmSMN=NnWIYmSMN+1
   if op<=31 then
   if op<=12 then
   if op<=3 then
   if op<=0 then
   if op==((0+256)-256) and ((7*cc6XzdCEL*cc6XzdCEL)+cc6XzdCEL)%2==0 then
   do
   local BT7PlF=jGcXtcFgQ[KBl3xINCPRm] local iAdefR0vV39=jGcXtcFgQ[KBl3xINCPRm-1] local qqSHy7=jGcXtcFgQ[KBl3xINCPRm-2]
   qqSHy7[iAdefR0vV39]=BT7PlF
   KBl3xINCPRm=KBl3xINCPRm-3
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=2 then
   if op<=1 then
   if op==(1-0) then
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=false
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((2+256)-256) then
   error("~%?!#{Z?{@{<{X&$>}%A||~}^*[*".."::ESCAPE-OP="..tostring(op))
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(3+67-67) then
   do
   local zVPEoJlh5k=aWL5hV[fcez04]
   local oHQrXZ2qUK=KBl3xINCPRm-2*zVPEoJlh5k
   for l49IFfHz2XI=1,zVPEoJlh5k do
   local iAdefR0vV39=jGcXtcFgQ[oHQrXZ2qUK+2*l49IFfHz2XI-2]
   local qqSHy7=jGcXtcFgQ[oHQrXZ2qUK+2*l49IFfHz2XI-1]
   local BT7PlF=jGcXtcFgQ[oHQrXZ2qUK+2*zVPEoJlh5k+l49IFfHz2XI-1]
   if qqSHy7==Q4dyG98uTwS then Q4dyG98uTwS[iAdefR0vV39]=BT7PlF else qqSHy7[iAdefR0vV39]=BT7PlF end
   end
   KBl3xINCPRm=oHQrXZ2qUK-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=6 then
   if op<=4 then
   if op==(4+80-80) and (((kq80Af*kq80Af)-kq80Af)%2)==0 then
   local qqSHy7=jGcXtcFgQ[KBl3xINCPRm]
   jGcXtcFgQ[KBl3xINCPRm]=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=qqSHy7
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=5 then
   if op==(5*4/4) and ((7*cc6XzdCEL*cc6XzdCEL)+cc6XzdCEL)%2==0 then
   do
   local F8ts1I_3gMb=aWL5hV[fcez04]
   local mvmMAOT=jGcXtcFgQ[KBl3xINCPRm]
   local Cmr9wp_=jGcXtcFgQ[KBl3xINCPRm-1]
   local LtmIBBF6X=jGcXtcFgQ[KBl3xINCPRm-2]
   KBl3xINCPRm=KBl3xINCPRm-3
   XgGyoZSwV[F8ts1I_3gMb]={v=LtmIBBF6X}
   XgGyoZSwV[F8ts1I_3gMb+1].v=LtmIBBF6X
   XgGyoZSwV[F8ts1I_3gMb+2].v=Cmr9wp_
   XgGyoZSwV[F8ts1I_3gMb+3].v=mvmMAOT
   if (mvmMAOT>0 and LtmIBBF6X>Cmr9wp_) or (mvmMAOT<0 and LtmIBBF6X<Cmr9wp_) then NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC]) end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(6-0) then
   Q4dyG98uTwS[P7Sk5QbU(IODZHri6,VMtkfvd[aWL5hV[fcez04]])]=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=11 then
   if op<=8 then
   if op<=7 then
   if op==(7*4/4) and ((kq80Af*kq80Af+kq80Af)%2)==0 then
   jGcXtcFgQ[KBl3xINCPRm-1]=jGcXtcFgQ[KBl3xINCPRm-1]<jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((8+256)-256) then
   do
   local mpfOCuf0z=aWL5hV[fcez04]
   local AF34skS=jGcXtcFgQ[KBl3xINCPRm-mpfOCuf0z+1]
   for l49IFfHz2XI=KBl3xINCPRm-mpfOCuf0z+2,KBl3xINCPRm do AF34skS=AF34skS..jGcXtcFgQ[l49IFfHz2XI] end
   KBl3xINCPRm=KBl3xINCPRm-mpfOCuf0z+1
   jGcXtcFgQ[KBl3xINCPRm]=AF34skS
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=10 then
   if op<=9 then
   if op==(9+29-29) then
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=true
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((10+256)-256) then
   if pZ8_clwuJtU>1 then KBl3xINCPRm=KBl3xINCPRm-pZ8_clwuJtU+1 end
   pZ8_clwuJtU=-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(11*4/4) then
   do
   local oHQrXZ2qUK,aKX3Fs051B=aWL5hV[fcez04],aWL5hV[ZtMm1ZlyzB]
   local v5T1AE=KBl3xINCPRm-aKX3Fs051B
   for l49IFfHz2XI=1,aKX3Fs051B do XgGyoZSwV[oHQrXZ2qUK+l49IFfHz2XI-1].v=jGcXtcFgQ[v5T1AE+l49IFfHz2XI] end
   KBl3xINCPRm=v5T1AE
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(12*4/4) then
   QHgjPCGV[aWL5hV[fcez04]].v=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=24 then
   if op<=20 then
   if op<=15 then
   if op<=13 then
   if op==(13-0) and (((cc6XzdCEL*cc6XzdCEL)-cc6XzdCEL)%2)==0 then
   do
   local qqSHy7=jGcXtcFgQ[KBl3xINCPRm]
   jGcXtcFgQ[KBl3xINCPRm]=jGcXtcFgQ[KBl3xINCPRm-1] - qqSHy7
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=14 then
   if op==(14-0) then
   jGcXtcFgQ[KBl3xINCPRm-1]=jGcXtcFgQ[KBl3xINCPRm-1]<=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((15+256)-256) then
   jGcXtcFgQ[KBl3xINCPRm+1]=XgGyoZSwV[aWL5hV[fcez04]].v
   KBl3xINCPRm=KBl3xINCPRm+1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=19 then
   if op<=17 then
   if op<=16 then
   if op==(16+13-13) then
   do
   local zVPEoJlh5k=aWL5hV[fcez04]
   if zVPEoJlh5k>=0 then
   local qqSHy7=jGcXtcFgQ[KBl3xINCPRm-zVPEoJlh5k-1]
   local mpfOCuf0z=sLtWBTed[qqSHy7] or 0
   for l49IFfHz2XI=1,zVPEoJlh5k do qqSHy7[mpfOCuf0z+l49IFfHz2XI]=jGcXtcFgQ[KBl3xINCPRm-zVPEoJlh5k+l49IFfHz2XI] end
   sLtWBTed[qqSHy7]=mpfOCuf0z+zVPEoJlh5k
   KBl3xINCPRm=KBl3xINCPRm-zVPEoJlh5k-1
   else
   local NvEFrFkjo2=(-zVPEoJlh5k)-1
   local S0XN46ZyQ=pZ8_clwuJtU<0 and 0 or pZ8_clwuJtU
   local oE6h1Tn=NvEFrFkjo2+S0XN46ZyQ
   local oHQrXZ2qUK=KBl3xINCPRm-oE6h1Tn
   local qqSHy7=jGcXtcFgQ[oHQrXZ2qUK-1]
   local mpfOCuf0z=sLtWBTed[qqSHy7] or 0
   for l49IFfHz2XI=1,oE6h1Tn do qqSHy7[mpfOCuf0z+l49IFfHz2XI]=jGcXtcFgQ[oHQrXZ2qUK+l49IFfHz2XI-1] end
   sLtWBTed[qqSHy7]=mpfOCuf0z+oE6h1Tn
   pZ8_clwuJtU=-1
   KBl3xINCPRm=oHQrXZ2qUK-1
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(17*4/4) and (((kq80Af*kq80Af)-kq80Af)%2)==0 then
   do
   local zVPEoJlh5k,mVvZg41FZj=aWL5hV[fcez04],aWL5hV[ZtMm1ZlyzB]
   YO6llbT3e=zVPEoJlh5k<0 and (pZ8_clwuJtU<0 and 0 or pZ8_clwuJtU) or zVPEoJlh5k
   ElSMFg=0
   cq5EN9Y4Y=KBl3xINCPRm-YO6llbT3e-1-ElSMFg
   U8r_3H=jGcXtcFgQ[cq5EN9Y4Y]
   local i35Anl
   if type(U8r_3H)=='table' and U8r_3H.pid then
   local IKx1ZK={n=YO6llbT3e}
   for l49IFfHz2XI=1,YO6llbT3e do IKx1ZK[l49IFfHz2XI]=jGcXtcFgQ[cq5EN9Y4Y+ElSMFg+l49IFfHz2XI] end
   i35Anl=sN6Yo9(U8r_3H.pid,U8r_3H.env,U8r_3H.uv,IKx1ZK,fuFHeT)
   else
   i35Anl=p55kTlRK(U8r_3H(hAHXa9(jGcXtcFgQ,cq5EN9Y4Y+1+ElSMFg,KBl3xINCPRm)))
   end
   if mVvZg41FZj==0 then
   KBl3xINCPRm=cq5EN9Y4Y-1
   pZ8_clwuJtU=-1
   elseif mVvZg41FZj==-1 then
   sVsaUrsboX=i35Anl.n
   for l49IFfHz2XI=1,sVsaUrsboX do jGcXtcFgQ[cq5EN9Y4Y+l49IFfHz2XI-1]=i35Anl[l49IFfHz2XI] end
   KBl3xINCPRm=cq5EN9Y4Y+sVsaUrsboX-1
   pZ8_clwuJtU=sVsaUrsboX
   else
   for l49IFfHz2XI=1,mVvZg41FZj do jGcXtcFgQ[cq5EN9Y4Y+l49IFfHz2XI-1]=i35Anl[l49IFfHz2XI] end
   KBl3xINCPRm=cq5EN9Y4Y+mVvZg41FZj-1
   pZ8_clwuJtU=-1
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=18 then
   if op==(18-0) and ((7*kq80Af*kq80Af)+kq80Af)%2==0 then
   do
   local BT7PlF=jGcXtcFgQ[KBl3xINCPRm] local iAdefR0vV39=jGcXtcFgQ[KBl3xINCPRm-1] local qqSHy7=jGcXtcFgQ[KBl3xINCPRm-aWL5hV[fcez04]]
   qqSHy7[iAdefR0vV39]=BT7PlF
   KBl3xINCPRm=KBl3xINCPRm-2
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(19+42-42) and (((kq80Af*kq80Af)-kq80Af)%2)==0 then
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=Q4dyG98uTwS[P7Sk5QbU(IODZHri6,VMtkfvd[aWL5hV[fcez04]])]
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(20*4/4) then
   do
   local PrwbHYpJ1=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=PrwbHYpJ1 ^ jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=22 then
   if op<=21 then
   if op==(21*4/4) then
   KBl3xINCPRm=KBl3xINCPRm+1
   local qqSHy7={}
   sLtWBTed[qqSHy7]=0
   jGcXtcFgQ[KBl3xINCPRm]=qqSHy7
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22-0) and ((cc6XzdCEL*cc6XzdCEL+cc6XzdCEL)%2)==0 then
   do
   local zVPEoJlh5k=aWL5hV[fcez04]
   local i35Anl={n=0}
   if zVPEoJlh5k<0 then
   local aKX3Fs051B=pZ8_clwuJtU<0 and 0 or pZ8_clwuJtU
   i35Anl.n=aKX3Fs051B
   local LtmIBBF6X=KBl3xINCPRm-aKX3Fs051B+1
   for l49IFfHz2XI=1,aKX3Fs051B do i35Anl[l49IFfHz2XI]=jGcXtcFgQ[LtmIBBF6X+l49IFfHz2XI-1] end
   else
   i35Anl.n=zVPEoJlh5k
   for l49IFfHz2XI=1,zVPEoJlh5k do i35Anl[l49IFfHz2XI]=jGcXtcFgQ[KBl3xINCPRm-zVPEoJlh5k+l49IFfHz2XI] end
   end
   return i35Anl
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=23 then
   if op==(23*4/4) and ((cc6XzdCEL*cc6XzdCEL+cc6XzdCEL)%2)==0 then
   do
   local BT7PlF=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   if BT7PlF then NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC]) end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(24+97-97) then
   jGcXtcFgQ[KBl3xINCPRm-1]=jGcXtcFgQ[KBl3xINCPRm-1]==jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=26 then
   if op<=25 then
   if op==((25+256)-256) then
   do
   local iAdefR0vV39=jGcXtcFgQ[KBl3xINCPRm] local qqSHy7=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=qqSHy7[iAdefR0vV39]
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(26*4/4) then
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=Q4dyG98uTwS
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=30 then
   if op<=27 then
   if op==((27+256)-256) and ((kq80Af*kq80Af+kq80Af)%2)==0 then
   jGcXtcFgQ[KBl3xINCPRm+1]=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm+1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=29 then
   if op<=28 then
   if op==(28-0) and ((7*cc6XzdCEL*cc6XzdCEL)+cc6XzdCEL)%2==0 then
   do
   local F8ts1I_3gMb=aWL5hV[fcez04]
   local RbmxJVgFpU=aWL5hV[CrXB21J9k]
   local WA5lw3f00B=jGcXtcFgQ[KBl3xINCPRm] local hOP0GnG=jGcXtcFgQ[KBl3xINCPRm-1] local sZ4tWEl2xis=jGcXtcFgQ[KBl3xINCPRm-2]
   KBl3xINCPRm=KBl3xINCPRm-3
   XgGyoZSwV[F8ts1I_3gMb].v=sZ4tWEl2xis
   XgGyoZSwV[F8ts1I_3gMb+1].v=hOP0GnG
   XgGyoZSwV[F8ts1I_3gMb+2].v=WA5lw3f00B
   local vcdTDzvzfk=p55kTlRK(XgGyoZSwV[F8ts1I_3gMb].v(XgGyoZSwV[F8ts1I_3gMb+1].v,XgGyoZSwV[F8ts1I_3gMb+2].v))
   if vcdTDzvzfk[1]==nil then
   NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC])
   else
   XgGyoZSwV[F8ts1I_3gMb+2].v=vcdTDzvzfk[1]
   for l49IFfHz2XI=1,RbmxJVgFpU do XgGyoZSwV[F8ts1I_3gMb+2+l49IFfHz2XI]={v=vcdTDzvzfk[l49IFfHz2XI]} end
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((29+256)-256) and (((kq80Af*kq80Af)-kq80Af)%2)==0 then
   do
   local zVPEoJlh5k=aWL5hV[fcez04]
   if zVPEoJlh5k<0 then
   local aKX3Fs051B=nE6CT7.n or #nE6CT7
   for l49IFfHz2XI=1,aKX3Fs051B do KBl3xINCPRm=KBl3xINCPRm+1 jGcXtcFgQ[KBl3xINCPRm]=nE6CT7[l49IFfHz2XI] end
   pZ8_clwuJtU=aKX3Fs051B
   else
   for l49IFfHz2XI=1,zVPEoJlh5k do KBl3xINCPRm=KBl3xINCPRm+1 jGcXtcFgQ[KBl3xINCPRm]=nE6CT7[l49IFfHz2XI] end
   pZ8_clwuJtU=-1
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(30-0) and ((kq80Af*kq80Af+kq80Af)%2)==0 then
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=QHgjPCGV[aWL5hV[fcez04]].v
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(31*4/4) then
   do
   local zVPEoJlh5k,mVvZg41FZj=aWL5hV[fcez04],aWL5hV[ZtMm1ZlyzB]
   YO6llbT3e=zVPEoJlh5k<0 and (pZ8_clwuJtU<0 and 0 or pZ8_clwuJtU) or zVPEoJlh5k
   ElSMFg=1
   cq5EN9Y4Y=KBl3xINCPRm-YO6llbT3e-1-ElSMFg
   U8r_3H=jGcXtcFgQ[cq5EN9Y4Y]
   local i35Anl
   if type(U8r_3H)=='table' and U8r_3H.pid then
   local IKx1ZK={n=YO6llbT3e}
   for l49IFfHz2XI=1,YO6llbT3e do IKx1ZK[l49IFfHz2XI]=jGcXtcFgQ[cq5EN9Y4Y+ElSMFg+l49IFfHz2XI] end
   i35Anl=sN6Yo9(U8r_3H.pid,U8r_3H.env,U8r_3H.uv,IKx1ZK,fuFHeT)
   else
   i35Anl=p55kTlRK(U8r_3H(hAHXa9(jGcXtcFgQ,cq5EN9Y4Y+1+ElSMFg,KBl3xINCPRm)))
   end
   if mVvZg41FZj==0 then
   KBl3xINCPRm=cq5EN9Y4Y-1
   pZ8_clwuJtU=-1
   elseif mVvZg41FZj==-1 then
   sVsaUrsboX=i35Anl.n
   for l49IFfHz2XI=1,sVsaUrsboX do jGcXtcFgQ[cq5EN9Y4Y+l49IFfHz2XI-1]=i35Anl[l49IFfHz2XI] end
   KBl3xINCPRm=cq5EN9Y4Y+sVsaUrsboX-1
   pZ8_clwuJtU=sVsaUrsboX
   else
   for l49IFfHz2XI=1,mVvZg41FZj do jGcXtcFgQ[cq5EN9Y4Y+l49IFfHz2XI-1]=i35Anl[l49IFfHz2XI] end
   KBl3xINCPRm=cq5EN9Y4Y+mVvZg41FZj-1
   pZ8_clwuJtU=-1
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=50 then
   if op<=46 then
   if op<=39 then
   if op<=36 then
   if op<=35 then
   if op<=34 then
   if op<=32 then
   if op==(32-0) and (((kq80Af*kq80Af)-kq80Af)%2)==0 then
   do
   local PrwbHYpJ1=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=PrwbHYpJ1 * jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=33 then
   if op==(33*4/4) and ((cc6XzdCEL*cc6XzdCEL+cc6XzdCEL)%2)==0 then
   KBl3xINCPRm=KBl3xINCPRm-aWL5hV[fcez04]
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((34+256)-256) then
   do
   local BT7PlF=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   if not BT7PlF then NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC]) end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(35*4/4) then
   do
   local PrwbHYpJ1=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=PrwbHYpJ1 % jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(36*4/4) and ((7*cc6XzdCEL*cc6XzdCEL)+cc6XzdCEL)%2==0 then
   local BT7PlF=P7Sk5QbU(IODZHri6,VMtkfvd[aWL5hV[fcez04]])
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=BT7PlF
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=37 then
   if op==(37-0) and ((7*kq80Af*kq80Af)+kq80Af)%2==0 then
   jGcXtcFgQ[KBl3xINCPRm]=not jGcXtcFgQ[KBl3xINCPRm]
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=38 then
   if op==(38-0) and (((cc6XzdCEL*cc6XzdCEL)-cc6XzdCEL)%2)==0 then
   do
   local qn86N9_e=aWL5hV[fcez04]
   local J4iQBPxw=R8t8Hox[qn86N9_e]
   local teJRZ4ortA={}
   for l49IFfHz2XI=1,#J4iQBPxw.uv do
   local dEAABpeB=J4iQBPxw.uv[l49IFfHz2XI]
   if dEAABpeB[1]==1 then teJRZ4ortA[l49IFfHz2XI]=XgGyoZSwV[dEAABpeB[2]] else teJRZ4ortA[l49IFfHz2XI]=QHgjPCGV[dEAABpeB[2]] end
   end
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]={pid=qn86N9_e,env=Q4dyG98uTwS,uv=teJRZ4ortA}
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((39+256)-256) then
   do
   local F8ts1I_3gMb=aWL5hV[fcez04]
   local RbmxJVgFpU=XgGyoZSwV[F8ts1I_3gMb].v+XgGyoZSwV[F8ts1I_3gMb+3].v
   local Cmr9wp_=XgGyoZSwV[F8ts1I_3gMb+2].v
   local mvmMAOT=XgGyoZSwV[F8ts1I_3gMb+3].v
   if (mvmMAOT>0 and RbmxJVgFpU<=Cmr9wp_) or (mvmMAOT<0 and RbmxJVgFpU>=Cmr9wp_) then
   XgGyoZSwV[F8ts1I_3gMb]={v=RbmxJVgFpU}
   XgGyoZSwV[F8ts1I_3gMb+1].v=RbmxJVgFpU
   NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC])
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=41 then
   if op<=40 then
   if op==(40*4/4) and ((kq80Af*kq80Af+kq80Af)%2)==0 then
   XgGyoZSwV[aWL5hV[fcez04]].v=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41-0) and (((cc6XzdCEL*cc6XzdCEL)-cc6XzdCEL)%2)==0 then
   do
   local CG65p3Fv=aWL5hV[CrXB21J9k]
   local GuaUiYkyJs=CG65p3Fv<0 and ((-CG65p3Fv-1)+(pZ8_clwuJtU<0 and 0 or pZ8_clwuJtU)) or CG65p3Fv
   local zVPEoJlh5k=aWL5hV[fcez04]
   if GuaUiYkyJs>zVPEoJlh5k then
   KBl3xINCPRm=KBl3xINCPRm-GuaUiYkyJs+zVPEoJlh5k
   elseif GuaUiYkyJs<zVPEoJlh5k then
   while GuaUiYkyJs<zVPEoJlh5k do KBl3xINCPRm=KBl3xINCPRm+1 jGcXtcFgQ[KBl3xINCPRm]=nil GuaUiYkyJs=GuaUiYkyJs+1 end
   end
   pZ8_clwuJtU=-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=44 then
   if op<=43 then
   if op<=42 then
   if op==(42*4/4) and ((7*cc6XzdCEL*cc6XzdCEL)+cc6XzdCEL)%2==0 then
   do
   local qqSHy7=jGcXtcFgQ[KBl3xINCPRm]
   jGcXtcFgQ[KBl3xINCPRm]=jGcXtcFgQ[KBl3xINCPRm-1] / qqSHy7
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(43*4/4) and ((7*kq80Af*kq80Af)+kq80Af)%2==0 then
   do
   local F8ts1I_3gMb=aWL5hV[fcez04]
   local RbmxJVgFpU=aWL5hV[CrXB21J9k]
   local vcdTDzvzfk=p55kTlRK(XgGyoZSwV[F8ts1I_3gMb].v(XgGyoZSwV[F8ts1I_3gMb+1].v,XgGyoZSwV[F8ts1I_3gMb+2].v))
   if vcdTDzvzfk[1]~=nil then
   NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC])
   XgGyoZSwV[F8ts1I_3gMb+2].v=vcdTDzvzfk[1]
   for l49IFfHz2XI=1,RbmxJVgFpU do XgGyoZSwV[F8ts1I_3gMb+2+l49IFfHz2XI]={v=vcdTDzvzfk[l49IFfHz2XI]} end
   end
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(44*4/4) then
   KBl3xINCPRm=KBl3xINCPRm+1
   jGcXtcFgQ[KBl3xINCPRm]=nil
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=45 then
   if op==((45+256)-256) then
   local qqSHy7=jGcXtcFgQ[KBl3xINCPRm]
   jGcXtcFgQ[KBl3xINCPRm]=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=qqSHy7
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(46+21-21) then
   do
   local PrwbHYpJ1=jGcXtcFgQ[KBl3xINCPRm-1]
   jGcXtcFgQ[KBl3xINCPRm-1]=PrwbHYpJ1 + jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm-1
   end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=48 then
   if op<=47 then
   if op==(47-0) and (((cc6XzdCEL*cc6XzdCEL)-cc6XzdCEL)%2)==0 then
   jGcXtcFgQ[KBl3xINCPRm]=#jGcXtcFgQ[KBl3xINCPRm]
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48-0) then
   jGcXtcFgQ[KBl3xINCPRm]=-jGcXtcFgQ[KBl3xINCPRm]
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=49 then
   if op==(49-0) then
   do end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((50+256)-256) then
   NnWIYmSMN=NnWIYmSMN+(aWL5hV[ZtMm1ZlyzB]+aWL5hV[LxMPuNBtAVC])
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=102 then
   if op<=101 then
   if op<=100 then
   if op==100 then
   do local qqSHy7=jGcXtcFgQ[KBl3xINCPRm] jGcXtcFgQ[KBl3xINCPRm]=qqSHy7 end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 then
   jGcXtcFgQ[KBl3xINCPRm+1]=jGcXtcFgQ[KBl3xINCPRm]
   KBl3xINCPRm=KBl3xINCPRm+1
   KBl3xINCPRm=KBl3xINCPRm-1
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==102 then
   do local qqSHy7=jGcXtcFgQ[KBl3xINCPRm] jGcXtcFgQ[KBl3xINCPRm]=qqSHy7 end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==103 then
   do local _d=1+1 jGcXtcFgQ[KBl3xINCPRm]=jGcXtcFgQ[KBl3xINCPRm] end
   else
   error("<]<?$]~!%>*}%Q^Z$&<>|Z|Z}[&&".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
  end
 end
 local Kxtfpt=p55kTlRK(...)
 return sN6Yo9(sN6Yo9_decode(),1,_G,{},Kxtfpt,nil)
end)(X_H5xl)