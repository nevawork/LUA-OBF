-- NEVAHEX-VM v3 'Hex' — protected artifact — ^~[<$%}X@A~{() runs it

return (function(HCSA5XdGsZ, ...)
 local A_7BPhG=setmetatable({},{__mode="k"})
 local function XoRpzXvSrsD(...) local n=select('#',...) return {n=n,...} end
 local Kv26G8O8=_G.unpack or (table and table.unpack)
 local function d_Wn_HJ1(t,i,j)
  if i>j then return end
  if Kv26G8O8 and j-i>15 then return Kv26G8O8(t,i,j) end
  return t[i],d_Wn_HJ1(t,i+1,j)
 end
 local D8ltSk=_G.string.char
 local HJNTcj8qb=_G.table.concat
 local WE6dF8iXR7,Vgm__SGnWl,SPVbzB,LCc6Azxe,d8yuJLZS,g6MaPaNxr,twWUgn,L0zeC1n0Yt,LUX7OPu,t2q3qr1PiO,hUW4QIxyBEN,m8ne_w
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then pmdcPUC9=true CHgN_Qm=9999 end debug.sethook() end
 local HejgWLu5=(148857*4/4) eI0dxr_q=(2061-0) ouBsNTU=(995809*4/4) zPHXFL=(413583+85-85) T_I4dHNj=((422946+256)-256)
 local L90PLOOd=(49165+52-52) D5beJvELj=(1255955*4/4) XRpNcTxB=(1614689*4/4) zcBqRJPt=((169537+256)-256)
 local djhsy0Qyqp=((979582417+256)-256) _G.__CK0=tostring(djhsy0Qyqp)
 local ohnFnvaIjj=0 UEFWcA=0
 local function wesPO9G(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((djhsy0Qyqp+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=D8ltSk(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=HJNTcj8qb(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local Ry5hgMJ0="+|\243\232\227C\217,\193\186M\"3\253\027U)\156\174r\178Luv\026I\015\250\128\160\232\038\1699\198u\255\239\194\157\160\215q4s\217\246\151\029\004\240l\198\226\139\199\017\196\039\027\157\017\164W\003\234\229\012\199\150\156\251@l\161\227\032f\142A\253U\185\137\2022n3?.\242\1919\009V\210\036\026\211\238\003|\192\134\247\145M\219:\136\233tU\217\004\180\177\185\036\230a\217g@\031\147\143\175\218\020\226\205\158\187\0256\135_\0143}>:[/w\197\012\127R9/\233\249\037\209\003\202\030\000y\127M\219\234D\229\183\210\250\152e\032\1352\145\202"
 local function yMvywj_decode()
  local D={} local bn=#Ry5hgMJ0
  if bn>4194304 then error("<X>~#*]^*%*{&|]X$&{#&Q>!@}*]") end
  local sa=(408156101+40-40) sb=(32501972+35-35) MM=2147483647
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
   D[i]=(sbyte(Ry5hgMJ0,i)-pv+256)%256
  end
  local luxO5eps4=1
  local function usNZ7Ul4fwr() local bt=D[luxO5eps4] luxO5eps4=luxO5eps4+1 return bt end
  local function KINjc7_()
   local sh,r=0,0
   while true do
    local bt=usNZ7Ul4fwr()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function q_WNTW()
   local u=KINjc7_()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local VcoJZ0nM=usNZ7Ul4fwr()
  if VcoJZ0nM<128 then error("^@}?}[{~%%}$>Q#}*XA%Z^A{??[^") end
  for i=1,VcoJZ0nM-128 do usNZ7Ul4fwr() end
  local T8MIzVlpga=KINjc7_()
  if T8MIzVlpga>4096 then error("Z^[@*&#@~!%X!}$}$#A~$<]*AQ#^") end
  local WhLuoLiPttn={} local nhG95Uz={}
  for CMDwSTQYgi=1,T8MIzVlpga do
   local pr={}
   pr.pn=usNZ7Ul4fwr()
   pr.va=usNZ7Ul4fwr()==1
   local nu=KINjc7_()
   pr.uv={}
   for i=1,nu do pr.uv[i]={usNZ7Ul4fwr()==1 and 1 or 0,KINjc7_()} end
   pr.ns=KINjc7_()
   KINjc7_() KINjc7_() KINjc7_() KINjc7_() KINjc7_()
   local nc=KINjc7_()
   if nc>65536 then error("&!&?&<?%&{}{AQX}~Z?~XQ$*Z^*]") end
   pr.c={}
   for i=1,nc do
    local tag=usNZ7Ul4fwr()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=KINjc7_()
     local bb={}
     for j=1,ln do luxO5eps4=luxO5eps4+1 bb[j]=D[luxO5eps4-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=KINjc7_()
   if nk>262144 then error("?^>{&!$*Q&X$[>*!$}[{}[]#!#{#") end
   pr.k={}
   local lrk=(L90PLOOd+CMDwSTQYgi*D5beJvELj+CMDwSTQYgi*CMDwSTQYgi*XRpNcTxB)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=KINjc7_()
    local aw=q_WNTW()-mm
    local b1w=q_WNTW()-mm
    local b2w=q_WNTW()+mm
    local cw=q_WNTW()-mm
    lrk=(lrk+zcBqRJPt+math.floor(lrk/8))%65536
    pr.k[i]={[HejgWLu5]=oe,[eI0dxr_q]=aw,[ouBsNTU]=b1w,[zPHXFL]=b2w,[T_I4dHNj]=cw}
   end
   WhLuoLiPttn[CMDwSTQYgi]=pr
  end
  local wln=KINjc7_()
  local wa=(655206032+65-65) wb=((2017132367+256)-256) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   nhG95Uz[i]=(D[luxO5eps4]-pv2+256)%256
   luxO5eps4=luxO5eps4+1
  end
  local mmbLWuyaeY1=#nhG95Uz
  if mmbLWuyaeY1<1 then mmbLWuyaeY1=1 nhG95Uz[1]=0 end
  return {P=WhLuoLiPttn,WM=nhG95Uz,WMI=mmbLWuyaeY1}
 end
 local zRXVQLk=0
 local iMU5h1O9NE={} local QfdPbaeWD={}
 local function yMvywj(l1,Dqm07WKi,JtfbQjpGGd,s4hNpW8zqJM,p6rBxs2G,DUAnUp)
  local WhLuoLiPttn,nhG95Uz,mmbLWuyaeY1=l1.P,l1.WM,l1.WMI
  local B4ieUrD=WhLuoLiPttn[Dqm07WKi]
  local qGAYc9f_N=B4ieUrD.k
  local xmlr9oUWg=B4ieUrD.c
  local regDkdN={}
  local fdU7LuQNpK={}
  for fyruAyWD=1,B4ieUrD.ns do fdU7LuQNpK[fyruAyWD]={} end
  local vxlv5sh1E,dx1fnPn,m4CN0onc9qf=0,-1,1
  local Y8YptIqFFJ=p6rBxs2G
  for fyruAyWD=1,B4ieUrD.pn do fdU7LuQNpK[fyruAyWD].v=p6rBxs2G[fyruAyWD] end
  local SxOIMZPM_c,xY2UNQho=37,1
  local pmdcPUC9,CHgN_Qm,xUwyVoEwSt8=false,0,0
  local sQB9S5=(L90PLOOd+Dqm07WKi*D5beJvELj+Dqm07WKi*Dqm07WKi*XRpNcTxB)%65536
  local jLDkGanFTxR,xc05P7u,vuYKL2Xb,sil3iAHY,bxB35ejP15K
  local MLyubu,op
  while true do
   local WDtKwE=((7*SxOIMZPM_c*SxOIMZPM_c)+SxOIMZPM_c)%2
   if WDtKwE==0 then local _og=1+1 end
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then pmdcPUC9=true CHgN_Qm=1 end end
   MLyubu=qGAYc9f_N[m4CN0onc9qf]
   if m4CN0onc9qf<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(m4CN0onc9qf).." RK="..tostring(sQB9S5).." INS="..tostring(MLyubu[HejgWLu5]).." A="..tostring(MLyubu[eI0dxr_q]).." B="..tostring(MLyubu[ouBsNTU]+MLyubu[zPHXFL]).." C="..tostring(MLyubu[T_I4dHNj]).."\n" end
   MLyubu=qGAYc9f_N[m4CN0onc9qf]
   op=(((MLyubu[HejgWLu5]-sQB9S5)+65536)%65536)
   sQB9S5=(sQB9S5+zcBqRJPt+math.floor(sQB9S5/8))%65536
   m4CN0onc9qf=m4CN0onc9qf+1
   if op<=29 then
   if op<=16 then
   if op<=4 then
   if op<=3 then
   if op<=0 then
   if op==((0+256)-256) and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   vxlv5sh1E=vxlv5sh1E+1
   local pEUXJiIt={}
   A_7BPhG[pEUXJiIt]=0
   regDkdN[vxlv5sh1E]=pEUXJiIt
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=2 then
   if op<=1 then
   if op==((1+256)-256) and ((7*SxOIMZPM_c*SxOIMZPM_c)+SxOIMZPM_c)%2==0 then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=false
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(2+82-82) then
   m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL])
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(3-0) then
   do
   local m64nAr0t=regDkdN[vxlv5sh1E]
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   vxlv5sh1E=vxlv5sh1E-1
   regDkdN[vxlv5sh1E]=wTJ9eNbx1xr + m64nAr0t
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(4+74-74) then
   regDkdN[vxlv5sh1E+1]=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E+1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=14 then
   if op<=11 then
   if op<=10 then
   if op<=9 then
   if op<=7 then
   if op<=6 then
   if op<=5 then
   if op==(5*4/4) then
   JtfbQjpGGd[wesPO9G(Dqm07WKi,xmlr9oUWg[MLyubu[eI0dxr_q]])]=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((6+256)-256) then
   do
   local qdGBHC9p=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   if qdGBHC9p then m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL]) end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((7+256)-256) and ((SxOIMZPM_c*SxOIMZPM_c+SxOIMZPM_c)%2)==0 then
   local pEUXJiIt=regDkdN[vxlv5sh1E]
   regDkdN[vxlv5sh1E]=regDkdN[vxlv5sh1E-1]
   regDkdN[vxlv5sh1E-1]=pEUXJiIt
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=8 then
   if op==(8-0) then
   do
   local m64nAr0t=regDkdN[vxlv5sh1E]
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   vxlv5sh1E=vxlv5sh1E-1
   regDkdN[vxlv5sh1E]=wTJ9eNbx1xr<m64nAr0t
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(9*4/4) and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   do
   local XbqHFhIaw=MLyubu[T_I4dHNj]
   local GyTXXrpDs=XbqHFhIaw<0 and ((-XbqHFhIaw-1)+(dx1fnPn<0 and 0 or dx1fnPn)) or XbqHFhIaw
   local Kq3qqZ1F=MLyubu[eI0dxr_q]
   if GyTXXrpDs>Kq3qqZ1F then
   vxlv5sh1E=vxlv5sh1E-GyTXXrpDs+Kq3qqZ1F
   elseif GyTXXrpDs<Kq3qqZ1F then
   while GyTXXrpDs<Kq3qqZ1F do vxlv5sh1E=vxlv5sh1E+1 regDkdN[vxlv5sh1E]=nil GyTXXrpDs=GyTXXrpDs+1 end
   end
   dx1fnPn=-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(10-0) and ((7*SxOIMZPM_c*SxOIMZPM_c)+SxOIMZPM_c)%2==0 then
   do
   local Kq3qqZ1F=MLyubu[eI0dxr_q]
   if Kq3qqZ1F<0 then
   local p0S5Fp=Y8YptIqFFJ.n or #Y8YptIqFFJ
   for fyruAyWD=1,p0S5Fp do vxlv5sh1E=vxlv5sh1E+1 regDkdN[vxlv5sh1E]=Y8YptIqFFJ[fyruAyWD] end
   dx1fnPn=p0S5Fp
   else
   for fyruAyWD=1,Kq3qqZ1F do vxlv5sh1E=vxlv5sh1E+1 regDkdN[vxlv5sh1E]=Y8YptIqFFJ[fyruAyWD] end
   dx1fnPn=-1
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((11+256)-256) then
   do
   local Kq3qqZ1F,xFj0nvP=MLyubu[eI0dxr_q],MLyubu[ouBsNTU]
   xc05P7u=Kq3qqZ1F<0 and (dx1fnPn<0 and 0 or dx1fnPn) or Kq3qqZ1F
   vuYKL2Xb=1
   sil3iAHY=vxlv5sh1E-xc05P7u-1-vuYKL2Xb
   bxB35ejP15K=regDkdN[sil3iAHY]
   local g0LAAUt1N
   if type(bxB35ejP15K)=='table' and bxB35ejP15K.pid then
   local yLOQ3_={n=xc05P7u}
   for fyruAyWD=1,xc05P7u do yLOQ3_[fyruAyWD]=regDkdN[sil3iAHY+vuYKL2Xb+fyruAyWD] end
   g0LAAUt1N=yMvywj(bxB35ejP15K.pid,bxB35ejP15K.env,bxB35ejP15K.uv,yLOQ3_,DUAnUp)
   else
   g0LAAUt1N=XoRpzXvSrsD(bxB35ejP15K(d_Wn_HJ1(regDkdN,sil3iAHY+1+vuYKL2Xb,vxlv5sh1E)))
   end
   if xFj0nvP==0 then
   vxlv5sh1E=sil3iAHY-1
   dx1fnPn=-1
   elseif xFj0nvP==-1 then
   jLDkGanFTxR=g0LAAUt1N.n
   for fyruAyWD=1,jLDkGanFTxR do regDkdN[sil3iAHY+fyruAyWD-1]=g0LAAUt1N[fyruAyWD] end
   vxlv5sh1E=sil3iAHY+jLDkGanFTxR-1
   dx1fnPn=jLDkGanFTxR
   else
   for fyruAyWD=1,xFj0nvP do regDkdN[sil3iAHY+fyruAyWD-1]=g0LAAUt1N[fyruAyWD] end
   vxlv5sh1E=sil3iAHY+xFj0nvP-1
   dx1fnPn=-1
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=13 then
   if op<=12 then
   if op==((12+256)-256) then
   do local qdGBHC9p=wesPO9G(Dqm07WKi,xmlr9oUWg[MLyubu[eI0dxr_q]]) vxlv5sh1E=vxlv5sh1E+1 regDkdN[vxlv5sh1E]=qdGBHC9p end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(13*4/4) and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=true
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(14+69-69) and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   do end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=15 then
   if op==(15+66-66) then
   do
   local Kq3qqZ1F,xFj0nvP=MLyubu[eI0dxr_q],MLyubu[ouBsNTU]
   xc05P7u=Kq3qqZ1F<0 and (dx1fnPn<0 and 0 or dx1fnPn) or Kq3qqZ1F
   vuYKL2Xb=0
   sil3iAHY=vxlv5sh1E-xc05P7u-1-vuYKL2Xb
   bxB35ejP15K=regDkdN[sil3iAHY]
   local g0LAAUt1N
   if type(bxB35ejP15K)=='table' and bxB35ejP15K.pid then
   local yLOQ3_={n=xc05P7u}
   for fyruAyWD=1,xc05P7u do yLOQ3_[fyruAyWD]=regDkdN[sil3iAHY+vuYKL2Xb+fyruAyWD] end
   g0LAAUt1N=yMvywj(bxB35ejP15K.pid,bxB35ejP15K.env,bxB35ejP15K.uv,yLOQ3_,DUAnUp)
   else
   g0LAAUt1N=XoRpzXvSrsD(bxB35ejP15K(d_Wn_HJ1(regDkdN,sil3iAHY+1+vuYKL2Xb,vxlv5sh1E)))
   end
   if xFj0nvP==0 then
   vxlv5sh1E=sil3iAHY-1
   dx1fnPn=-1
   elseif xFj0nvP==-1 then
   jLDkGanFTxR=g0LAAUt1N.n
   for fyruAyWD=1,jLDkGanFTxR do regDkdN[sil3iAHY+fyruAyWD-1]=g0LAAUt1N[fyruAyWD] end
   vxlv5sh1E=sil3iAHY+jLDkGanFTxR-1
   dx1fnPn=jLDkGanFTxR
   else
   for fyruAyWD=1,xFj0nvP do regDkdN[sil3iAHY+fyruAyWD-1]=g0LAAUt1N[fyruAyWD] end
   vxlv5sh1E=sil3iAHY+xFj0nvP-1
   dx1fnPn=-1
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(16-0) then
   if dx1fnPn>1 then vxlv5sh1E=vxlv5sh1E-dx1fnPn+1 end
   dx1fnPn=-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=26 then
   if op<=24 then
   if op<=21 then
   if op<=20 then
   if op<=17 then
   if op==((17+256)-256) then
   do
   if not regDkdN[vxlv5sh1E] then m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL]) end
   vxlv5sh1E=vxlv5sh1E-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=18 then
   if op==(18+58-58) then
   fdU7LuQNpK[MLyubu[eI0dxr_q]].v=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=19 then
   if op==(19*4/4) then
   regDkdN[vxlv5sh1E]=-regDkdN[vxlv5sh1E]
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(20-0) and ((xUwyVoEwSt8*xUwyVoEwSt8+xUwyVoEwSt8)%2)==0 then
   do
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   regDkdN[vxlv5sh1E-1]=wTJ9eNbx1xr / regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==(21*4/4) then
   do
   local zyWqhm2J=MLyubu[eI0dxr_q]
   local I1C5RN7=regDkdN[vxlv5sh1E]
   local eNr7GX=regDkdN[vxlv5sh1E-1]
   local FhQVcr=regDkdN[vxlv5sh1E-2]
   vxlv5sh1E=vxlv5sh1E-3
   fdU7LuQNpK[zyWqhm2J]={v=FhQVcr}
   fdU7LuQNpK[zyWqhm2J+1].v=FhQVcr
   fdU7LuQNpK[zyWqhm2J+2].v=eNr7GX
   fdU7LuQNpK[zyWqhm2J+3].v=I1C5RN7
   if (I1C5RN7>0 and FhQVcr>eNr7GX) or (I1C5RN7<0 and FhQVcr<eNr7GX) then m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL]) end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=22 then
   if op==(22+84-84) and ((7*SxOIMZPM_c*SxOIMZPM_c)+SxOIMZPM_c)%2==0 then
   do
   local qdGBHC9p=regDkdN[vxlv5sh1E] local fCTKUsRtum=regDkdN[vxlv5sh1E-1] local pEUXJiIt=regDkdN[vxlv5sh1E-MLyubu[eI0dxr_q]]
   pEUXJiIt[fCTKUsRtum]=qdGBHC9p
   vxlv5sh1E=vxlv5sh1E-2
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=23 then
   if op==(23-0) then
   s4hNpW8zqJM[MLyubu[eI0dxr_q]].v=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(24-0) and ((xUwyVoEwSt8*xUwyVoEwSt8+xUwyVoEwSt8)%2)==0 then
   do
   local m64nAr0t=regDkdN[vxlv5sh1E]
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   vxlv5sh1E=vxlv5sh1E-1
   regDkdN[vxlv5sh1E]=wTJ9eNbx1xr ^ m64nAr0t
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=25 then
   if op==(25*4/4) and ((SxOIMZPM_c*SxOIMZPM_c+SxOIMZPM_c)%2)==0 then
   do
   local Kq3qqZ1F=MLyubu[eI0dxr_q]
   local h7Qgl9sXOSP=vxlv5sh1E-2*Kq3qqZ1F
   for fyruAyWD=1,Kq3qqZ1F do
   local fCTKUsRtum=regDkdN[h7Qgl9sXOSP+2*fyruAyWD-2]
   local pEUXJiIt=regDkdN[h7Qgl9sXOSP+2*fyruAyWD-1]
   local qdGBHC9p=regDkdN[h7Qgl9sXOSP+2*Kq3qqZ1F+fyruAyWD-1]
   if pEUXJiIt==JtfbQjpGGd then JtfbQjpGGd[fCTKUsRtum]=qdGBHC9p else pEUXJiIt[fCTKUsRtum]=qdGBHC9p end
   end
   vxlv5sh1E=h7Qgl9sXOSP-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(26+60-60) then
   do
   local m64nAr0t=regDkdN[vxlv5sh1E]
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   vxlv5sh1E=vxlv5sh1E-1
   regDkdN[vxlv5sh1E]=wTJ9eNbx1xr * m64nAr0t
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=28 then
   if op<=27 then
   if op==(27+87-87) and ((SxOIMZPM_c*SxOIMZPM_c+SxOIMZPM_c)%2)==0 then
   do
   local zyWqhm2J=MLyubu[eI0dxr_q]
   local DfT1LH9uQ=MLyubu[T_I4dHNj]
   local uM6yU0zs=XoRpzXvSrsD(fdU7LuQNpK[zyWqhm2J].v(fdU7LuQNpK[zyWqhm2J+1].v,fdU7LuQNpK[zyWqhm2J+2].v))
   if uM6yU0zs[1]~=nil then
   m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL])
   fdU7LuQNpK[zyWqhm2J+2].v=uM6yU0zs[1]
   for fyruAyWD=1,DfT1LH9uQ do fdU7LuQNpK[zyWqhm2J+2+fyruAyWD]={v=uM6yU0zs[fyruAyWD]} end
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((28+256)-256) then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=fdU7LuQNpK[MLyubu[eI0dxr_q]].v
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(29-0) then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=JtfbQjpGGd
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=40 then
   if op<=34 then
   if op<=33 then
   if op<=32 then
   if op<=31 then
   if op<=30 then
   if op==((30+256)-256) then
   error("A{|]&X|%${!AZ@}ZZ}]#|^&QZ*|Q".."::ESCAPE-OP="..tostring(op))
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(31-0) and ((7*SxOIMZPM_c*SxOIMZPM_c)+SxOIMZPM_c)%2==0 then
   do
   local HUMABMsE=MLyubu[eI0dxr_q]
   local tF59TT=regDkdN[vxlv5sh1E-HUMABMsE+1]
   for fyruAyWD=vxlv5sh1E-HUMABMsE+2,vxlv5sh1E do tF59TT=tF59TT..regDkdN[fyruAyWD] end
   vxlv5sh1E=vxlv5sh1E-HUMABMsE+1
   regDkdN[vxlv5sh1E]=tF59TT
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((32+256)-256) and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   regDkdN[vxlv5sh1E-1]=regDkdN[vxlv5sh1E-1]==regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((33+256)-256) then
   regDkdN[vxlv5sh1E]=not regDkdN[vxlv5sh1E]
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(34-0) and (((xUwyVoEwSt8*xUwyVoEwSt8)-xUwyVoEwSt8)%2)==0 then
   do
   local zyWqhm2J=MLyubu[eI0dxr_q]
   local DfT1LH9uQ=MLyubu[T_I4dHNj]
   local FqVtKvp=regDkdN[vxlv5sh1E] local Vo9YM24=regDkdN[vxlv5sh1E-1] local VNFfreHV3=regDkdN[vxlv5sh1E-2]
   vxlv5sh1E=vxlv5sh1E-3
   fdU7LuQNpK[zyWqhm2J].v=VNFfreHV3
   fdU7LuQNpK[zyWqhm2J+1].v=Vo9YM24
   fdU7LuQNpK[zyWqhm2J+2].v=FqVtKvp
   local uM6yU0zs=XoRpzXvSrsD(fdU7LuQNpK[zyWqhm2J].v(fdU7LuQNpK[zyWqhm2J+1].v,fdU7LuQNpK[zyWqhm2J+2].v))
   if uM6yU0zs[1]==nil then
   m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL])
   else
   fdU7LuQNpK[zyWqhm2J+2].v=uM6yU0zs[1]
   for fyruAyWD=1,DfT1LH9uQ do fdU7LuQNpK[zyWqhm2J+2+fyruAyWD]={v=uM6yU0zs[fyruAyWD]} end
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=36 then
   if op<=35 then
   if op==(35-0) and (((xUwyVoEwSt8*xUwyVoEwSt8)-xUwyVoEwSt8)%2)==0 then
   do
   local m64nAr0t=regDkdN[vxlv5sh1E]
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   vxlv5sh1E=vxlv5sh1E-1
   regDkdN[vxlv5sh1E]=wTJ9eNbx1xr<=m64nAr0t
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(36-0) then
   do
   local h7Qgl9sXOSP,p0S5Fp=MLyubu[eI0dxr_q],MLyubu[ouBsNTU]
   local Bsd6Uf=vxlv5sh1E-p0S5Fp
   for fyruAyWD=1,p0S5Fp do fdU7LuQNpK[h7Qgl9sXOSP+fyruAyWD-1].v=regDkdN[Bsd6Uf+fyruAyWD] end
   vxlv5sh1E=Bsd6Uf
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=38 then
   if op<=37 then
   if op==(37+65-65) and ((SxOIMZPM_c*SxOIMZPM_c+SxOIMZPM_c)%2)==0 then
   do
   local zyWqhm2J=MLyubu[eI0dxr_q]
   local DfT1LH9uQ=fdU7LuQNpK[zyWqhm2J].v+fdU7LuQNpK[zyWqhm2J+3].v
   local eNr7GX=fdU7LuQNpK[zyWqhm2J+2].v
   local I1C5RN7=fdU7LuQNpK[zyWqhm2J+3].v
   if (I1C5RN7>0 and DfT1LH9uQ<=eNr7GX) or (I1C5RN7<0 and DfT1LH9uQ>=eNr7GX) then
   fdU7LuQNpK[zyWqhm2J]={v=DfT1LH9uQ}
   fdU7LuQNpK[zyWqhm2J+1].v=DfT1LH9uQ
   m4CN0onc9qf=m4CN0onc9qf+(MLyubu[ouBsNTU]+MLyubu[zPHXFL])
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(38+76-76) then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=JtfbQjpGGd[wesPO9G(Dqm07WKi,xmlr9oUWg[MLyubu[eI0dxr_q]])]
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=39 then
   if op==((39+256)-256) then
   do
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   regDkdN[vxlv5sh1E-1]=wTJ9eNbx1xr % regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(40+30-30) then
   do
   local Mi2MtpOc=MLyubu[eI0dxr_q]
   local QXPlHUpUP=WhLuoLiPttn[Mi2MtpOc]
   local gYoL0b={}
   for fyruAyWD=1,#QXPlHUpUP.uv do
   local rKDgkRvcm=QXPlHUpUP.uv[fyruAyWD]
   if rKDgkRvcm[1]==1 then gYoL0b[fyruAyWD]=fdU7LuQNpK[rKDgkRvcm[2]] else gYoL0b[fyruAyWD]=s4hNpW8zqJM[rKDgkRvcm[2]] end
   end
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]={pid=Mi2MtpOc,env=JtfbQjpGGd,uv=gYoL0b}
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=101 then
   if op<=50 then
   if op<=45 then
   if op<=44 then
   if op<=43 then
   if op<=42 then
   if op<=41 then
   if op==(41+53-53) and ((xUwyVoEwSt8*xUwyVoEwSt8+xUwyVoEwSt8)%2)==0 then
   local pEUXJiIt=regDkdN[vxlv5sh1E]
   regDkdN[vxlv5sh1E]=regDkdN[vxlv5sh1E-1]
   regDkdN[vxlv5sh1E-1]=pEUXJiIt
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(42*4/4) then
   vxlv5sh1E=vxlv5sh1E-MLyubu[eI0dxr_q]
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(43+47-47) then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=s4hNpW8zqJM[MLyubu[eI0dxr_q]].v
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(44+66-66) then
   do
   local Kq3qqZ1F=MLyubu[eI0dxr_q]
   local g0LAAUt1N={n=0}
   if Kq3qqZ1F<0 then
   local p0S5Fp=dx1fnPn<0 and 0 or dx1fnPn
   g0LAAUt1N.n=p0S5Fp
   local FhQVcr=vxlv5sh1E-p0S5Fp+1
   for fyruAyWD=1,p0S5Fp do g0LAAUt1N[fyruAyWD]=regDkdN[FhQVcr+fyruAyWD-1] end
   else
   g0LAAUt1N.n=Kq3qqZ1F
   for fyruAyWD=1,Kq3qqZ1F do g0LAAUt1N[fyruAyWD]=regDkdN[vxlv5sh1E-Kq3qqZ1F+fyruAyWD] end
   end
   return g0LAAUt1N
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(45*4/4) and ((SxOIMZPM_c*SxOIMZPM_c+SxOIMZPM_c)%2)==0 then
   vxlv5sh1E=vxlv5sh1E+1
   regDkdN[vxlv5sh1E]=nil
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=48 then
   if op<=46 then
   if op==((46+256)-256) then
   regDkdN[vxlv5sh1E]=#regDkdN[vxlv5sh1E]
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=47 then
   if op==(47+18-18) and ((7*SxOIMZPM_c*SxOIMZPM_c)+SxOIMZPM_c)%2==0 then
   do
   local fCTKUsRtum=regDkdN[vxlv5sh1E] local pEUXJiIt=regDkdN[vxlv5sh1E-1]
   regDkdN[vxlv5sh1E-1]=pEUXJiIt[fCTKUsRtum]
   vxlv5sh1E=vxlv5sh1E-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48+36-36) and (((SxOIMZPM_c*SxOIMZPM_c)-SxOIMZPM_c)%2)==0 then
   do
   local Kq3qqZ1F=MLyubu[eI0dxr_q]
   if Kq3qqZ1F>=0 then
   local pEUXJiIt=regDkdN[vxlv5sh1E-Kq3qqZ1F-1]
   local HUMABMsE=A_7BPhG[pEUXJiIt] or 0
   for fyruAyWD=1,Kq3qqZ1F do pEUXJiIt[HUMABMsE+fyruAyWD]=regDkdN[vxlv5sh1E-Kq3qqZ1F+fyruAyWD] end
   A_7BPhG[pEUXJiIt]=HUMABMsE+Kq3qqZ1F
   vxlv5sh1E=vxlv5sh1E-Kq3qqZ1F-1
   else
   local K4EJGGCgv8S=(-Kq3qqZ1F)-1
   local cLuHmtglFi=dx1fnPn<0 and 0 or dx1fnPn
   local AEhvyJAS2P=K4EJGGCgv8S+cLuHmtglFi
   local h7Qgl9sXOSP=vxlv5sh1E-AEhvyJAS2P
   local pEUXJiIt=regDkdN[h7Qgl9sXOSP-1]
   local HUMABMsE=A_7BPhG[pEUXJiIt] or 0
   for fyruAyWD=1,AEhvyJAS2P do pEUXJiIt[HUMABMsE+fyruAyWD]=regDkdN[h7Qgl9sXOSP+fyruAyWD-1] end
   A_7BPhG[pEUXJiIt]=HUMABMsE+AEhvyJAS2P
   dx1fnPn=-1
   vxlv5sh1E=h7Qgl9sXOSP-1
   end
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=49 then
   if op==(49-0) and ((xUwyVoEwSt8*xUwyVoEwSt8+xUwyVoEwSt8)%2)==0 then
   do
   local qdGBHC9p=regDkdN[vxlv5sh1E] local fCTKUsRtum=regDkdN[vxlv5sh1E-1] local pEUXJiIt=regDkdN[vxlv5sh1E-2]
   pEUXJiIt[fCTKUsRtum]=qdGBHC9p
   vxlv5sh1E=vxlv5sh1E-3
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(50-0) and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   do
   local wTJ9eNbx1xr=regDkdN[vxlv5sh1E-1]
   regDkdN[vxlv5sh1E-1]=wTJ9eNbx1xr - regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E-1
   end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=100 then
   if op==100 and ((SxOIMZPM_c*SxOIMZPM_c+SxOIMZPM_c)%2)==0 then
   regDkdN[vxlv5sh1E+1]=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E+1
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 and (((xUwyVoEwSt8*xUwyVoEwSt8)-xUwyVoEwSt8)%2)==0 then
   regDkdN[vxlv5sh1E+1]=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E+1
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=103 then
   if op<=102 then
   if op==102 and (((SxOIMZPM_c*SxOIMZPM_c)-SxOIMZPM_c)%2)==0 then
   do local _d=1+1 regDkdN[vxlv5sh1E]=regDkdN[vxlv5sh1E] end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==103 and ((7*xUwyVoEwSt8*xUwyVoEwSt8)+xUwyVoEwSt8)%2==0 then
   regDkdN[vxlv5sh1E+1]=regDkdN[vxlv5sh1E]
   vxlv5sh1E=vxlv5sh1E+1
   vxlv5sh1E=vxlv5sh1E-1
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==104 and (((SxOIMZPM_c*SxOIMZPM_c)-SxOIMZPM_c)%2)==0 then
   do local _d=1+1 regDkdN[vxlv5sh1E]=regDkdN[vxlv5sh1E] end
   else
   error(">@Q|#*{!*#}*>#QZ]Z]}>$[QA#&#".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
  end
 end
 local TyYNGOZeqd=XoRpzXvSrsD(...)
 return yMvywj(yMvywj_decode(),1,_G,{},TyYNGOZeqd,nil)
end)(HCSA5XdGsZ)