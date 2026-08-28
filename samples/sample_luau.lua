-- NEVAHEX-VM v3 'Hex' — protected artifact — <Z#%<}&&@|>Q() runs it

return (function(NERmDJYSqS, ...)
 local SF4MGc=setmetatable({},{__mode="k"})
 local function eBFM5ADqB(...) local n=select('#',...) return {n=n,...} end
 local VmUp55hEEwX=type(_ENV.unpack)=="function" and _ENV.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function nBZoNGEim(t,i,j)
  if i>j then return end
  if VmUp55hEEwX and j-i>15 then return VmUp55hEEwX(t,i,j) end
  return t[i],nBZoNGEim(t,i+1,j)
 end
 local BQctmoGl5f=_ENV.string.char
 local QuS1BI=_ENV.table.concat
 local XEcWpumus=((954451+256)-256) am9UR7VL2t=(351818*4/4) UbrvdEFc=((630121+256)-256) Y99ae5_=(909638-0) RDyzVb8I_U=(60049-0)
 local oTPryct=(48370*4/4) AjDczwEgf=(1606187-0) rAiyWMgFG=(1525155-0) XDXd4jjp0X=(256587+35-35)
 local sKifX_Pg8Q=((2143171514+256)-256) _G.__CK0=tostring(sKifX_Pg8Q)
 local vRwJI8e01av=0 mDdCZ6=0
 local function xSwezzWG(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((sKifX_Pg8Q+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=BQctmoGl5f(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=QuS1BI(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local drndou="\250.\010\175_\134\168\160\039\226\224^\131K\186Ci[+0Nu{\188\013\142\178\248\243j\228\127\215\240o\188g\134\183\212\153\037N\208\169\166\001\236A\156\198\202\000pE\138}\147\1708\174j\187\225\130\005\255\2019\136q|7\000\201\006\196\032\001\2142e\005\200}\166\020\217\167\195\129\184\158\140m\012]\219\229U\205\246\009\149*\\\147\228\161\205\039\128\189A\036\216\188\010"
 local function eI1MhdwC_decode()
  local D={} local bn=#drndou
  if bn>4194304 then error("|A?>$*#{%^$%|![@#~*Z]A$&@Z}^") end
  local MM=2147483647
  local oDf2WTKr_={895454861,2007295096,548907655,375844652,111993034,1800626809,657132635,1548704630,372349298,1410814839,1604203092,1107781412,116161631,2141278375,327160995,1038565373}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^oDf2WTKr_[3]+oDf2WTKr_[5]-oDf2WTKr_[6])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^oDf2WTKr_[4]+oDf2WTKr_[1]-oDf2WTKr_[2])%2147483646 if sb<1 then sb=sb+2147483646 end
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
   D[i]=(sbyte(drndou,i)-pv+256)%256
  end
  local SwWZxb4=1
  local function I1K2oYr() local bt=D[SwWZxb4] SwWZxb4=SwWZxb4+1 return bt end
  local function tVjLJ5r()
   local sh,r=0,0
   while true do
    local bt=I1K2oYr()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function suDQar_jr6T()
   local u=tVjLJ5r()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local JPM2tde=I1K2oYr()
  if JPM2tde<128 then error("*$}%^X#*[Z*!AA^&?*{*&@&A]X*[") end
  for i=1,JPM2tde-128 do I1K2oYr() end
  local PYaMTNGr23I=tVjLJ5r()
  if PYaMTNGr23I>4096 then error(">^X#>]&?{?}<}#!|@*?|]}!**[@{") end
  local MjhKUBaxL={} local DwrYje={}
  for Nw8liNiv=1,PYaMTNGr23I do
   local pr={}
   pr.pn=I1K2oYr()
   pr.va=I1K2oYr()==1
   local nu=tVjLJ5r()
   pr.uv={}
   for i=1,nu do pr.uv[i]={I1K2oYr()==1 and 1 or 0,tVjLJ5r()} end
   pr.ns=tVjLJ5r()
   tVjLJ5r() tVjLJ5r() tVjLJ5r() tVjLJ5r() tVjLJ5r()
   local nc=tVjLJ5r()
   if nc>65536 then error("^A]A|<}*Q&^@A&[@$|[X^!!AA^]!") end
   pr.c={}
   for i=1,nc do
    local tag=I1K2oYr()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=tVjLJ5r()
     local bb={}
     for j=1,ln do SwWZxb4=SwWZxb4+1 bb[j]=D[SwWZxb4-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=tVjLJ5r()
   if nk>262144 then error("%|^!>>%^}]X@!{}{Q&?]!{!^%Z]!") end
   pr.k={}
   local lrk=(oTPryct+Nw8liNiv*AjDczwEgf+Nw8liNiv*Nw8liNiv*rAiyWMgFG)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=tVjLJ5r()
    local aw=suDQar_jr6T()-mm
    local b1w=suDQar_jr6T()-mm
    local b2w=suDQar_jr6T()+mm
    local cw=suDQar_jr6T()-mm
    lrk=(lrk+XDXd4jjp0X+math.floor(lrk/8))%65536
    pr.k[i]={[XEcWpumus]=oe,[am9UR7VL2t]=aw,[UbrvdEFc]=b1w,[Y99ae5_]=b2w,[RDyzVb8I_U]=cw}
   end
   MjhKUBaxL[Nw8liNiv]=pr
  end
  local wln=tVjLJ5r()
  local wa=(932676279+82-82) wb=(1755372392+87-87) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   DwrYje[i]=(D[SwWZxb4]-pv2+256)%256
   SwWZxb4=SwWZxb4+1
  end
  local oNGiexCe=#DwrYje
  if oNGiexCe<1 then oNGiexCe=1 DwrYje[1]=0 end
  return {P=MjhKUBaxL,WM=DwrYje,WMI=oNGiexCe}
 end
 local bxAHRdE7z=0
 local P2t9inyGoc={} local nDVfG4={}
 local function eI1MhdwC(l1,Vpn6MZK1D9,gAC5XB_nYgy,SX1bUynMNSa,bVBSL5,WUJov9L86)
  local MjhKUBaxL,DwrYje,oNGiexCe=l1.P,l1.WM,l1.WMI
  local kqnNQM1T=MjhKUBaxL[Vpn6MZK1D9]
  local VT6pZj=kqnNQM1T.k
  local e_bjlV=kqnNQM1T.c
  local erVkvxSV={}
  local nfXVKTHFhI={}
  for g7N_aJBe=1,kqnNQM1T.ns do nfXVKTHFhI[g7N_aJBe]={} end
  local qLY1mq_SMz,PBWnJc,rImzSYc=0,-1,1
  local EEnXwXM9i=bVBSL5
  for g7N_aJBe=1,kqnNQM1T.pn do nfXVKTHFhI[g7N_aJBe].v=bVBSL5[g7N_aJBe] end
  local g53zVavq6lL,cLDkKX=37,1
  local gkrEktV,b59vIpBwcu,Fezeh4UlB=false,0,0
  local uuOWBoy5e=(oTPryct+Vpn6MZK1D9*AjDczwEgf+Vpn6MZK1D9*Vpn6MZK1D9*rAiyWMgFG)%65536
  local bTg2P6PbUjI,po2W7Lg2R6x,xfiyrm,fLDWYbZ,eYOmQHkE
  local vQM_Q4tFz,op
  while true do
   local cugoTVgO=((5252*4/4)+Vpn6MZK1D9*7919)%65536
   if cugoTVgO<256 then local _nop=1+1 end
   vQM_Q4tFz=VT6pZj[rImzSYc]
   vQM_Q4tFz=VT6pZj[rImzSYc]
   vQM_Q4tFz=VT6pZj[rImzSYc]
   vQM_Q4tFz=VT6pZj[rImzSYc]
   op=(((vQM_Q4tFz[XEcWpumus]-uuOWBoy5e)+65536)%65536)
   uuOWBoy5e=(uuOWBoy5e+XDXd4jjp0X+math.floor(uuOWBoy5e/8))%65536
   rImzSYc=rImzSYc+1
   if op<=41 then
   if op<=20 then
   if op<=12 then
   if op<=4 then
   if op<=2 then
   if op<=1 then
   if op<=0 then
   if op==((0+256)-256) then
   do
   local po2W7Lg2R6x=vQM_Q4tFz[am9UR7VL2t]
   local undefined=vQM_Q4tFz[RDyzVb8I_U]
   local YceNOgKq=rImzSYc+1
   rImzSYc=YceNOgKq
   qLY1mq_SMz=qLY1mq_SMz+po2W7Lg2R6x
   eYOmQHkE=erVkvxSV[qLY1mq_SMz-po2W7Lg2R6x]
   local vdUI1iz4peh=eBFM5ADqB(eYOmQHkE(nBZoNGEim(erVkvxSV,qLY1mq_SMz-po2W7Lg2R6x+1,qLY1mq_SMz)))
   if undefined==0 then qLY1mq_SMz=qLY1mq_SMz-po2W7Lg2R6x-1 PBWnJc=-1
   elseif undefined==-1 then bTg2P6PbUjI=vdUI1iz4peh.n for g7N_aJBe=1,bTg2P6PbUjI do erVkvxSV[qLY1mq_SMz-po2W7Lg2R6x+g7N_aJBe]=vdUI1iz4peh[g7N_aJBe] end qLY1mq_SMz=qLY1mq_SMz-po2W7Lg2R6x+bTg2P6PbUjI-1 PBWnJc=bTg2P6PbUjI
   else bTg2P6PbUjI=undefined for g7N_aJBe=1,bTg2P6PbUjI do erVkvxSV[qLY1mq_SMz-po2W7Lg2R6x+g7N_aJBe]=vdUI1iz4peh[g7N_aJBe] end qLY1mq_SMz=qLY1mq_SMz-po2W7Lg2R6x+bTg2P6PbUjI-1 PBWnJc=bTg2P6PbUjI end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1-0) and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   do
   local QevQFTZNZ=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   if QevQFTZNZ then rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_]) end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(2*4/4) then
   SX1bUynMNSa[vQM_Q4tFz[am9UR7VL2t]].v=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=3 then
   if op==(3*4/4) then
   do
   local R85RD2CrU=erVkvxSV[qLY1mq_SMz]
   local xy0l73=erVkvxSV[qLY1mq_SMz-1]
   qLY1mq_SMz=qLY1mq_SMz-1
   erVkvxSV[qLY1mq_SMz]=xy0l73 * R85RD2CrU
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(4*4/4) and ((Fezeh4UlB*Fezeh4UlB+Fezeh4UlB)%2)==0 then
   do
   local Q4tjkKdy8,u0wRhksm9Yl=vQM_Q4tFz[am9UR7VL2t],vQM_Q4tFz[UbrvdEFc]
   po2W7Lg2R6x=Q4tjkKdy8<0 and (PBWnJc<0 and 0 or PBWnJc) or Q4tjkKdy8
   xfiyrm=1
   fLDWYbZ=qLY1mq_SMz-po2W7Lg2R6x-1-xfiyrm
   eYOmQHkE=erVkvxSV[fLDWYbZ]
   local vdUI1iz4peh
   if type(eYOmQHkE)=='table' and eYOmQHkE.pid then
   local rZR3eTQiJAv={n=po2W7Lg2R6x}
   for g7N_aJBe=1,po2W7Lg2R6x do rZR3eTQiJAv[g7N_aJBe]=erVkvxSV[fLDWYbZ+xfiyrm+g7N_aJBe] end
   vdUI1iz4peh=eI1MhdwC(eYOmQHkE.pid,eYOmQHkE.env,eYOmQHkE.uv,rZR3eTQiJAv,WUJov9L86)
   else
   vdUI1iz4peh=eBFM5ADqB(eYOmQHkE(nBZoNGEim(erVkvxSV,fLDWYbZ+1+xfiyrm,qLY1mq_SMz)))
   end
   if u0wRhksm9Yl==0 then
   qLY1mq_SMz=fLDWYbZ-1
   PBWnJc=-1
   elseif u0wRhksm9Yl==-1 then
   bTg2P6PbUjI=vdUI1iz4peh.n
   for g7N_aJBe=1,bTg2P6PbUjI do erVkvxSV[fLDWYbZ+g7N_aJBe-1]=vdUI1iz4peh[g7N_aJBe] end
   qLY1mq_SMz=fLDWYbZ+bTg2P6PbUjI-1
   PBWnJc=bTg2P6PbUjI
   else
   for g7N_aJBe=1,u0wRhksm9Yl do erVkvxSV[fLDWYbZ+g7N_aJBe-1]=vdUI1iz4peh[g7N_aJBe] end
   qLY1mq_SMz=fLDWYbZ+u0wRhksm9Yl-1
   PBWnJc=-1
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=11 then
   if op<=9 then
   if op<=8 then
   if op<=7 then
   if op<=5 then
   if op==(5+49-49) then
   qLY1mq_SMz=qLY1mq_SMz+1
   local YceNOgKq={}
   SF4MGc[YceNOgKq]=0
   erVkvxSV[qLY1mq_SMz]=YceNOgKq
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=6 then
   if op==(6+24-24) then
   do end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(7*4/4) and ((Fezeh4UlB*Fezeh4UlB+Fezeh4UlB)%2)==0 then
   local YceNOgKq=erVkvxSV[qLY1mq_SMz]
   erVkvxSV[qLY1mq_SMz]=erVkvxSV[qLY1mq_SMz-1]
   erVkvxSV[qLY1mq_SMz-1]=YceNOgKq
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((8+256)-256) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=false
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((9+256)-256) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   do
   local fXrDpn=erVkvxSV[qLY1mq_SMz] local YceNOgKq=erVkvxSV[qLY1mq_SMz-1]
   erVkvxSV[qLY1mq_SMz-1]=YceNOgKq[fXrDpn]
   qLY1mq_SMz=qLY1mq_SMz-1
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=10 then
   if op==(10-0) and ((Fezeh4UlB*Fezeh4UlB+Fezeh4UlB)%2)==0 then
   do
   local QevQFTZNZ=erVkvxSV[qLY1mq_SMz] local fXrDpn=erVkvxSV[qLY1mq_SMz-1] local YceNOgKq=erVkvxSV[qLY1mq_SMz-2]
   YceNOgKq[fXrDpn]=QevQFTZNZ
   qLY1mq_SMz=qLY1mq_SMz-3
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(11*4/4) then
   do
   local Q4tjkKdy8=vQM_Q4tFz[am9UR7VL2t]
   if Q4tjkKdy8<0 then
   local hbG51d6V=EEnXwXM9i.n or #EEnXwXM9i
   for g7N_aJBe=1,hbG51d6V do qLY1mq_SMz=qLY1mq_SMz+1 erVkvxSV[qLY1mq_SMz]=EEnXwXM9i[g7N_aJBe] end
   PBWnJc=hbG51d6V
   else
   for g7N_aJBe=1,Q4tjkKdy8 do qLY1mq_SMz=qLY1mq_SMz+1 erVkvxSV[qLY1mq_SMz]=EEnXwXM9i[g7N_aJBe] end
   PBWnJc=-1
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(12-0) then
   erVkvxSV[qLY1mq_SMz]=-erVkvxSV[qLY1mq_SMz]
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=15 then
   if op<=13 then
   if op==((13+256)-256) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   do
   local v1Y_PME=vQM_Q4tFz[am9UR7VL2t]
   local uT8Ed5=vQM_Q4tFz[RDyzVb8I_U]
   local pUCOSEzRu3=eBFM5ADqB(nfXVKTHFhI[v1Y_PME].v(nfXVKTHFhI[v1Y_PME+1].v,nfXVKTHFhI[v1Y_PME+2].v))
   if pUCOSEzRu3[1]~=nil then
   rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_])
   nfXVKTHFhI[v1Y_PME+2].v=pUCOSEzRu3[1]
   for g7N_aJBe=1,uT8Ed5 do nfXVKTHFhI[v1Y_PME+2+g7N_aJBe]={v=pUCOSEzRu3[g7N_aJBe]} end
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=14 then
   if op==(14*4/4) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   do
   local llmkcR,hbG51d6V=vQM_Q4tFz[am9UR7VL2t],vQM_Q4tFz[UbrvdEFc]
   local xSwrvhgYNH=qLY1mq_SMz-hbG51d6V
   for g7N_aJBe=1,hbG51d6V do nfXVKTHFhI[llmkcR+g7N_aJBe-1].v=erVkvxSV[xSwrvhgYNH+g7N_aJBe] end
   qLY1mq_SMz=xSwrvhgYNH
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(15+36-36) and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_])
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=19 then
   if op<=16 then
   if op==((16+256)-256) then
   erVkvxSV[qLY1mq_SMz]=#erVkvxSV[qLY1mq_SMz]
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=17 then
   if op==(17+88-88) and ((Fezeh4UlB*Fezeh4UlB+Fezeh4UlB)%2)==0 then
   erVkvxSV[qLY1mq_SMz-1]=erVkvxSV[qLY1mq_SMz-1]==erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=18 then
   if op==(18-0) and (((g53zVavq6lL*g53zVavq6lL)-g53zVavq6lL)%2)==0 then
   do
   local QevQFTZNZ=erVkvxSV[qLY1mq_SMz] local fXrDpn=erVkvxSV[qLY1mq_SMz-1] local YceNOgKq=erVkvxSV[qLY1mq_SMz-vQM_Q4tFz[am9UR7VL2t]]
   YceNOgKq[fXrDpn]=QevQFTZNZ
   qLY1mq_SMz=qLY1mq_SMz-2
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(19+49-49) and (((g53zVavq6lL*g53zVavq6lL)-g53zVavq6lL)%2)==0 then
   do
   local v1Y_PME=vQM_Q4tFz[am9UR7VL2t]
   local uT8Ed5=nfXVKTHFhI[v1Y_PME].v+nfXVKTHFhI[v1Y_PME+3].v
   local mZTF7JN590=nfXVKTHFhI[v1Y_PME+2].v
   local kp7fprVymxC=nfXVKTHFhI[v1Y_PME+3].v
   if (kp7fprVymxC>0 and uT8Ed5<=mZTF7JN590) or (kp7fprVymxC<0 and uT8Ed5>=mZTF7JN590) then
   nfXVKTHFhI[v1Y_PME]={v=uT8Ed5}
   nfXVKTHFhI[v1Y_PME+1].v=uT8Ed5
   rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_])
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==(20*4/4) and ((Fezeh4UlB*Fezeh4UlB+Fezeh4UlB)%2)==0 then
   do
   local lh3T0LW_PXL=vQM_Q4tFz[RDyzVb8I_U]
   local hAL8iqoC=lh3T0LW_PXL<0 and ((-lh3T0LW_PXL-1)+(PBWnJc<0 and 0 or PBWnJc)) or lh3T0LW_PXL
   local Q4tjkKdy8=vQM_Q4tFz[am9UR7VL2t]
   if hAL8iqoC>Q4tjkKdy8 then
   qLY1mq_SMz=qLY1mq_SMz-hAL8iqoC+Q4tjkKdy8
   elseif hAL8iqoC<Q4tjkKdy8 then
   while hAL8iqoC<Q4tjkKdy8 do qLY1mq_SMz=qLY1mq_SMz+1 erVkvxSV[qLY1mq_SMz]=nil hAL8iqoC=hAL8iqoC+1 end
   end
   PBWnJc=-1
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=38 then
   if op<=33 then
   if op<=30 then
   if op<=25 then
   if op<=22 then
   if op<=21 then
   if op==(21+24-24) then
   do
   local Q4tjkKdy8,u0wRhksm9Yl=vQM_Q4tFz[am9UR7VL2t],vQM_Q4tFz[UbrvdEFc]
   po2W7Lg2R6x=Q4tjkKdy8<0 and (PBWnJc<0 and 0 or PBWnJc) or Q4tjkKdy8
   xfiyrm=0
   fLDWYbZ=qLY1mq_SMz-po2W7Lg2R6x-1-xfiyrm
   eYOmQHkE=erVkvxSV[fLDWYbZ]
   local vdUI1iz4peh
   if type(eYOmQHkE)=='table' and eYOmQHkE.pid then
   local rZR3eTQiJAv={n=po2W7Lg2R6x}
   for g7N_aJBe=1,po2W7Lg2R6x do rZR3eTQiJAv[g7N_aJBe]=erVkvxSV[fLDWYbZ+xfiyrm+g7N_aJBe] end
   vdUI1iz4peh=eI1MhdwC(eYOmQHkE.pid,eYOmQHkE.env,eYOmQHkE.uv,rZR3eTQiJAv,WUJov9L86)
   else
   vdUI1iz4peh=eBFM5ADqB(eYOmQHkE(nBZoNGEim(erVkvxSV,fLDWYbZ+1+xfiyrm,qLY1mq_SMz)))
   end
   if u0wRhksm9Yl==0 then
   qLY1mq_SMz=fLDWYbZ-1
   PBWnJc=-1
   elseif u0wRhksm9Yl==-1 then
   bTg2P6PbUjI=vdUI1iz4peh.n
   for g7N_aJBe=1,bTg2P6PbUjI do erVkvxSV[fLDWYbZ+g7N_aJBe-1]=vdUI1iz4peh[g7N_aJBe] end
   qLY1mq_SMz=fLDWYbZ+bTg2P6PbUjI-1
   PBWnJc=bTg2P6PbUjI
   else
   for g7N_aJBe=1,u0wRhksm9Yl do erVkvxSV[fLDWYbZ+g7N_aJBe-1]=vdUI1iz4peh[g7N_aJBe] end
   qLY1mq_SMz=fLDWYbZ+u0wRhksm9Yl-1
   PBWnJc=-1
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22+78-78) and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   do
   local R85RD2CrU=erVkvxSV[qLY1mq_SMz]
   local xy0l73=erVkvxSV[qLY1mq_SMz-1]
   qLY1mq_SMz=qLY1mq_SMz-1
   erVkvxSV[qLY1mq_SMz]=xy0l73 - R85RD2CrU
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=23 then
   if op==(23+34-34) then
   do
   local llmkcR=vQM_Q4tFz[am9UR7VL2t]
   local undefined=vQM_Q4tFz[UbrvdEFc]
   nfXVKTHFhI[llmkcR].v=nfXVKTHFhI[llmkcR].v
   nfXVKTHFhI[llmkcR+1].v=nfXVKTHFhI[llmkcR+1].v
   nfXVKTHFhI[llmkcR+2].v=nfXVKTHFhI[llmkcR+2].v
   rImzSYc=rImzSYc+undefined
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=24 then
   if op==(24*4/4) and ((7*Fezeh4UlB*Fezeh4UlB)+Fezeh4UlB)%2==0 then
   do local QevQFTZNZ=xSwezzWG(Vpn6MZK1D9,e_bjlV[vQM_Q4tFz[am9UR7VL2t]]) qLY1mq_SMz=qLY1mq_SMz+1 erVkvxSV[qLY1mq_SMz]=QevQFTZNZ end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((25+256)-256) then
   qLY1mq_SMz=qLY1mq_SMz-vQM_Q4tFz[am9UR7VL2t]
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=29 then
   if op<=26 then
   if op==(26-0) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   do
   local Q4tjkKdy8=vQM_Q4tFz[am9UR7VL2t]
   if Q4tjkKdy8>=0 then
   local YceNOgKq=erVkvxSV[qLY1mq_SMz-Q4tjkKdy8-1]
   local HINw_wvmbB=SF4MGc[YceNOgKq] or 0
   for g7N_aJBe=1,Q4tjkKdy8 do YceNOgKq[HINw_wvmbB+g7N_aJBe]=erVkvxSV[qLY1mq_SMz-Q4tjkKdy8+g7N_aJBe] end
   SF4MGc[YceNOgKq]=HINw_wvmbB+Q4tjkKdy8
   qLY1mq_SMz=qLY1mq_SMz-Q4tjkKdy8-1
   else
   local ekZCUxAcH7=(-Q4tjkKdy8)-1
   local bfxZwKJ5A=PBWnJc<0 and 0 or PBWnJc
   local UfFvTvTSAi=ekZCUxAcH7+bfxZwKJ5A
   local llmkcR=qLY1mq_SMz-UfFvTvTSAi
   local YceNOgKq=erVkvxSV[llmkcR-1]
   local HINw_wvmbB=SF4MGc[YceNOgKq] or 0
   for g7N_aJBe=1,UfFvTvTSAi do YceNOgKq[HINw_wvmbB+g7N_aJBe]=erVkvxSV[llmkcR+g7N_aJBe-1] end
   SF4MGc[YceNOgKq]=HINw_wvmbB+UfFvTvTSAi
   PBWnJc=-1
   qLY1mq_SMz=llmkcR-1
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=28 then
   if op<=27 then
   if op==(27-0) then
   erVkvxSV[qLY1mq_SMz]=not erVkvxSV[qLY1mq_SMz]
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((28+256)-256) and ((g53zVavq6lL*g53zVavq6lL+g53zVavq6lL)%2)==0 then
   do
   local R85RD2CrU=erVkvxSV[qLY1mq_SMz]
   local xy0l73=erVkvxSV[qLY1mq_SMz-1]
   qLY1mq_SMz=qLY1mq_SMz-1
   erVkvxSV[qLY1mq_SMz]=xy0l73<R85RD2CrU
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((29+256)-256) then
   do
   local Q4tjkKdy8=vQM_Q4tFz[am9UR7VL2t]
   local vdUI1iz4peh={n=0}
   if Q4tjkKdy8<0 then
   local hbG51d6V=PBWnJc<0 and 0 or PBWnJc
   vdUI1iz4peh.n=hbG51d6V
   local fM4xQqIX=qLY1mq_SMz-hbG51d6V+1
   for g7N_aJBe=1,hbG51d6V do vdUI1iz4peh[g7N_aJBe]=erVkvxSV[fM4xQqIX+g7N_aJBe-1] end
   else
   vdUI1iz4peh.n=Q4tjkKdy8
   for g7N_aJBe=1,Q4tjkKdy8 do vdUI1iz4peh[g7N_aJBe]=erVkvxSV[qLY1mq_SMz-Q4tjkKdy8+g7N_aJBe] end
   end
   return vdUI1iz4peh
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((30+256)-256) then
   do
   local YceNOgKq=erVkvxSV[qLY1mq_SMz]
   erVkvxSV[qLY1mq_SMz]=erVkvxSV[qLY1mq_SMz-1] + YceNOgKq
   qLY1mq_SMz=qLY1mq_SMz-1
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=32 then
   if op<=31 then
   if op==(31*4/4) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=erVkvxSV[qLY1mq_SMz-1]
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(32+19-19) then
   local YceNOgKq=erVkvxSV[qLY1mq_SMz]
   erVkvxSV[qLY1mq_SMz]=erVkvxSV[qLY1mq_SMz-1]
   erVkvxSV[qLY1mq_SMz-1]=YceNOgKq
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(33-0) then
   do
   local Q4tjkKdy8=vQM_Q4tFz[am9UR7VL2t]
   local llmkcR=qLY1mq_SMz-2*Q4tjkKdy8
   for g7N_aJBe=1,Q4tjkKdy8 do
   local fXrDpn=erVkvxSV[llmkcR+2*g7N_aJBe-2]
   local YceNOgKq=erVkvxSV[llmkcR+2*g7N_aJBe-1]
   local QevQFTZNZ=erVkvxSV[llmkcR+2*Q4tjkKdy8+g7N_aJBe-1]
   if YceNOgKq==gAC5XB_nYgy then gAC5XB_nYgy[fXrDpn]=QevQFTZNZ else YceNOgKq[fXrDpn]=QevQFTZNZ end
   end
   qLY1mq_SMz=llmkcR-1
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=36 then
   if op<=35 then
   if op<=34 then
   if op==(34+37-37) then
   do
   local xy0l73=erVkvxSV[qLY1mq_SMz-1]
   erVkvxSV[qLY1mq_SMz-1]=xy0l73 % erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(35-0) then
   do
   local YceNOgKq=nfXVKTHFhI[vQM_Q4tFz[am9UR7VL2t]].v
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=YceNOgKq
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(36+22-22) then
   do
   local R85RD2CrU=erVkvxSV[qLY1mq_SMz]
   local xy0l73=erVkvxSV[qLY1mq_SMz-1]
   qLY1mq_SMz=qLY1mq_SMz-1
   erVkvxSV[qLY1mq_SMz]=xy0l73<=R85RD2CrU
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=37 then
   if op==((37+256)-256) then
   do
   local QevQFTZNZ=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   if not QevQFTZNZ then rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_]) end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(38*4/4) then
   do
   local v1Y_PME=vQM_Q4tFz[am9UR7VL2t]
   local kp7fprVymxC=erVkvxSV[qLY1mq_SMz]
   local mZTF7JN590=erVkvxSV[qLY1mq_SMz-1]
   local fM4xQqIX=erVkvxSV[qLY1mq_SMz-2]
   qLY1mq_SMz=qLY1mq_SMz-3
   nfXVKTHFhI[v1Y_PME]={v=fM4xQqIX}
   nfXVKTHFhI[v1Y_PME+1].v=fM4xQqIX
   nfXVKTHFhI[v1Y_PME+2].v=mZTF7JN590
   nfXVKTHFhI[v1Y_PME+3].v=kp7fprVymxC
   if (kp7fprVymxC>0 and fM4xQqIX>mZTF7JN590) or (kp7fprVymxC<0 and fM4xQqIX<mZTF7JN590) then rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_]) end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=39 then
   if op==((39+256)-256) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   do
   local undefined=erVkvxSV[qLY1mq_SMz-1]
   local undefined=erVkvxSV[qLY1mq_SMz]
   rImzSYc=rImzSYc+1
   eYOmQHkE=erVkvxSV[qLY1mq_SMz-2]
   local vdUI1iz4peh=eBFM5ADqB(eYOmQHkE(undefined,undefined))
   qLY1mq_SMz=qLY1mq_SMz-3+vdUI1iz4peh.n
   for g7N_aJBe=1,vdUI1iz4peh.n do erVkvxSV[qLY1mq_SMz-vdUI1iz4peh.n+g7N_aJBe]=vdUI1iz4peh[g7N_aJBe] end
   PBWnJc=vdUI1iz4peh.n
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=40 then
   if op==((40+256)-256) and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   do
   local YceNOgKq=erVkvxSV[qLY1mq_SMz]
   erVkvxSV[qLY1mq_SMz]=erVkvxSV[qLY1mq_SMz-1] / YceNOgKq
   qLY1mq_SMz=qLY1mq_SMz-1
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41*4/4) and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   do
   local Aejb1d=vQM_Q4tFz[am9UR7VL2t]
   local xV55eb_=MjhKUBaxL[Aejb1d]
   local aMEIJeA={}
   for g7N_aJBe=1,#xV55eb_.uv do
   local nlVv7XPU80v=xV55eb_.uv[g7N_aJBe]
   if nlVv7XPU80v[1]==1 then aMEIJeA[g7N_aJBe]=nfXVKTHFhI[nlVv7XPU80v[2]] else aMEIJeA[g7N_aJBe]=SX1bUynMNSa[nlVv7XPU80v[2]] end
   end
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]={pid=Aejb1d,env=gAC5XB_nYgy,uv=aMEIJeA}
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=55 then
   if op<=48 then
   if op<=47 then
   if op<=44 then
   if op<=43 then
   if op<=42 then
   if op==((42+256)-256) then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=true
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(43-0) then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=gAC5XB_nYgy[xSwezzWG(Vpn6MZK1D9,e_bjlV[vQM_Q4tFz[am9UR7VL2t]])]
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(44-0) then
   do
   local undefined=erVkvxSV[qLY1mq_SMz-1]
   local undefined=xSwezzWG(Vpn6MZK1D9,e_bjlV[vQM_Q4tFz[am9UR7VL2t]])
   rImzSYc=rImzSYc+1
   eYOmQHkE=erVkvxSV[qLY1mq_SMz-2]
   local vdUI1iz4peh=eBFM5ADqB(eYOmQHkE(undefined,undefined))
   qLY1mq_SMz=qLY1mq_SMz-3+vdUI1iz4peh.n
   for g7N_aJBe=1,vdUI1iz4peh.n do erVkvxSV[qLY1mq_SMz-vdUI1iz4peh.n+g7N_aJBe]=vdUI1iz4peh[g7N_aJBe] end
   PBWnJc=vdUI1iz4peh.n
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=45 then
   if op==(45-0) then
   do
   local undefined=erVkvxSV[qLY1mq_SMz]
   rImzSYc=rImzSYc+1
   eYOmQHkE=erVkvxSV[qLY1mq_SMz-1]
   local vdUI1iz4peh=eBFM5ADqB(eYOmQHkE(undefined))
   qLY1mq_SMz=qLY1mq_SMz-2+vdUI1iz4peh.n
   for g7N_aJBe=1,vdUI1iz4peh.n do erVkvxSV[qLY1mq_SMz-vdUI1iz4peh.n+g7N_aJBe]=vdUI1iz4peh[g7N_aJBe] end
   PBWnJc=vdUI1iz4peh.n
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=46 then
   if op==((46+256)-256) and ((g53zVavq6lL*g53zVavq6lL+g53zVavq6lL)%2)==0 then
   do
   local llmkcR=vQM_Q4tFz[am9UR7VL2t]
   local uT8Ed5=vQM_Q4tFz[RDyzVb8I_U]
   if uT8Ed5<0 then uT8Ed5=(PBWnJc<0 and 0 or PBWnJc) end
   for g7N_aJBe=1,uT8Ed5 do
     qLY1mq_SMz=qLY1mq_SMz+1
     erVkvxSV[qLY1mq_SMz]=(llmkcR+g7N_aJBe-1)>=0 and nfXVKTHFhI[llmkcR+g7N_aJBe-1].v or nil
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(47+53-53) then
   do
   local R85RD2CrU=erVkvxSV[qLY1mq_SMz]
   local xy0l73=erVkvxSV[qLY1mq_SMz-1]
   qLY1mq_SMz=qLY1mq_SMz-1
   erVkvxSV[qLY1mq_SMz]=xy0l73 ^ R85RD2CrU
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==(48*4/4) and ((g53zVavq6lL*g53zVavq6lL+g53zVavq6lL)%2)==0 then
   nfXVKTHFhI[vQM_Q4tFz[am9UR7VL2t]].v=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=50 then
   if op<=49 then
   if op==(49-0) then
   do
   local HINw_wvmbB=vQM_Q4tFz[am9UR7VL2t]
   local Jx4srq3B=erVkvxSV[qLY1mq_SMz-HINw_wvmbB+1]
   for g7N_aJBe=qLY1mq_SMz-HINw_wvmbB+2,qLY1mq_SMz do Jx4srq3B=Jx4srq3B..erVkvxSV[g7N_aJBe] end
   qLY1mq_SMz=qLY1mq_SMz-HINw_wvmbB+1
   erVkvxSV[qLY1mq_SMz]=Jx4srq3B
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(50*4/4) then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=SX1bUynMNSa[vQM_Q4tFz[am9UR7VL2t]].v
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=53 then
   if op<=52 then
   if op<=51 then
   if op==(51+65-65) then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=nil
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(52-0) then
   do
   local v1Y_PME=vQM_Q4tFz[am9UR7VL2t]
   local uT8Ed5=vQM_Q4tFz[RDyzVb8I_U]
   local I2z5u0=erVkvxSV[qLY1mq_SMz] local hu9wYot74MA=erVkvxSV[qLY1mq_SMz-1] local hKkLIgW=erVkvxSV[qLY1mq_SMz-2]
   qLY1mq_SMz=qLY1mq_SMz-3
   nfXVKTHFhI[v1Y_PME].v=hKkLIgW
   nfXVKTHFhI[v1Y_PME+1].v=hu9wYot74MA
   nfXVKTHFhI[v1Y_PME+2].v=I2z5u0
   local pUCOSEzRu3=eBFM5ADqB(nfXVKTHFhI[v1Y_PME].v(nfXVKTHFhI[v1Y_PME+1].v,nfXVKTHFhI[v1Y_PME+2].v))
   if pUCOSEzRu3[1]==nil then
   rImzSYc=rImzSYc+(vQM_Q4tFz[UbrvdEFc]+vQM_Q4tFz[Y99ae5_])
   else
   nfXVKTHFhI[v1Y_PME+2].v=pUCOSEzRu3[1]
   for g7N_aJBe=1,uT8Ed5 do nfXVKTHFhI[v1Y_PME+2+g7N_aJBe]={v=pUCOSEzRu3[g7N_aJBe]} end
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(53-0) then
   error("!]]?A>$^X!Z}Q!&><|X&>Z[*#|Z|".."::ESCAPE-OP="..tostring(op))
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=54 then
   if op==(54+84-84) and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   do
   local undefined=vQM_Q4tFz[RDyzVb8I_U]
   local undefined=xSwezzWG(Vpn6MZK1D9,undefined)
   if undefined<#MjhKUBaxL[1].consts then
     qLY1mq_SMz=qLY1mq_SMz+1
     erVkvxSV[qLY1mq_SMz]=eI1MhdwC(0,gAC5XB_nYgy,MjhKUBaxL[1].uv,{n=1,undefined},WUJov9L86)
   else
     qLY1mq_SMz=qLY1mq_SMz+1
     erVkvxSV[qLY1mq_SMz]=nil
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(55*4/4) then
   gAC5XB_nYgy[xSwezzWG(Vpn6MZK1D9,e_bjlV[vQM_Q4tFz[am9UR7VL2t]])]=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=101 then
   if op<=100 then
   if op<=56 then
   if op==(56+90-90) then
   qLY1mq_SMz=qLY1mq_SMz+1
   erVkvxSV[qLY1mq_SMz]=gAC5XB_nYgy
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=58 then
   if op<=57 then
   if op==(57-0) and ((7*g53zVavq6lL*g53zVavq6lL)+g53zVavq6lL)%2==0 then
   if PBWnJc>1 then qLY1mq_SMz=qLY1mq_SMz-PBWnJc+1 end
   PBWnJc=-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(58*4/4) and ((Fezeh4UlB*Fezeh4UlB+Fezeh4UlB)%2)==0 then
   do
   local llmkcR=vQM_Q4tFz[am9UR7VL2t]
   local undefined=vQM_Q4tFz[UbrvdEFc]
   local uT8Ed5=vQM_Q4tFz[RDyzVb8I_U]
   local pUCOSEzRu3=eBFM5ADqB(nfXVKTHFhI[llmkcR].v(nfXVKTHFhI[llmkcR+1].v,nfXVKTHFhI[llmkcR+2].v))
   if pUCOSEzRu3[1]~=nil then
     rImzSYc=rImzSYc+undefined
     nfXVKTHFhI[llmkcR+2].v=pUCOSEzRu3[1]
     for g7N_aJBe=1,uT8Ed5 do nfXVKTHFhI[llmkcR+2+g7N_aJBe]={v=pUCOSEzRu3[g7N_aJBe]} end
   end
   end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==100 and (((g53zVavq6lL*g53zVavq6lL)-g53zVavq6lL)%2)==0 then
   do local YceNOgKq=erVkvxSV[qLY1mq_SMz] erVkvxSV[qLY1mq_SMz]=YceNOgKq end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==101 and (((Fezeh4UlB*Fezeh4UlB)-Fezeh4UlB)%2)==0 then
   do local _d=1+1 erVkvxSV[qLY1mq_SMz]=erVkvxSV[qLY1mq_SMz] end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=103 then
   if op<=102 then
   if op==102 then
   erVkvxSV[qLY1mq_SMz+1]=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz+1
   qLY1mq_SMz=qLY1mq_SMz-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==103 then
   erVkvxSV[qLY1mq_SMz+1]=erVkvxSV[qLY1mq_SMz]
   qLY1mq_SMz=qLY1mq_SMz+1
   qLY1mq_SMz=qLY1mq_SMz-1
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==104 and ((g53zVavq6lL*g53zVavq6lL+g53zVavq6lL)%2)==0 then
   do local YceNOgKq=erVkvxSV[qLY1mq_SMz] erVkvxSV[qLY1mq_SMz]=YceNOgKq end
   else
   error("Z]~Q$QX}>#$^^*|<^?~&^[Z$]%#%".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
  end
 end
 local UT2crp=eBFM5ADqB(...)
 local lvunZaOUZLU=setmetatable({}, {__mod=function() return eI1MhdwC(eI1MhdwC_decode(),1,_ENV,{},UT2crp,nil) end})
 return lvunZaOUZLU % 0
end)(NERmDJYSqS)