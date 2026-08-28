-- NEVAHEX-VM v3 'Hex' — protected artifact — ^&*!~A|~}<Q?() runs it

return (function(Nc5YYh, ...)
 local NVOlj_5=setmetatable({},{__mode="k"})
 local function uTLWe6TkJ(...) local n=select('#',...) return {n=n,...} end
 local function KvWL7QC2GNi(e,k) if type(e)~="table" then return end return rawget(e,k) end
 local function TPHWUP3P(e,k) local v=KvWL7QC2GNi(e,k) return type(v)=="table" and v end
 local ArkCEG_UtW=(type(_ENV)=="table" and _ENV) or (type(_G)=="table" and _G) or {}
 local Rj3a4qOt0O=TPHWUP3P(ArkCEG_UtW,"table")
 local IKibJoxb0EJ=KvWL7QC2GNi(ArkCEG_UtW,"unpack") or KvWL7QC2GNi(Rj3a4qOt0O,"unpack") or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function HN6Qfu1e(t,i,j)
  if i>j then return end
  if IKibJoxb0EJ and j-i>15 then return IKibJoxb0EJ(t,i,j) end
  return t[i],HN6Qfu1e(t,i+1,j)
 end
 local Zu5odPTG6l=KvWL7QC2GNi(TPHWUP3P(ArkCEG_UtW,"string"),"char") or (type(_G)=="table" and KvWL7QC2GNi(TPHWUP3P(_G,"string"),"char")) or string.char
 local HVSYVdLt=KvWL7QC2GNi(TPHWUP3P(ArkCEG_UtW,"table"),"concat") or (type(_G)=="table" and KvWL7QC2GNi(TPHWUP3P(_G,"table"),"concat")) or table.concat
 local fkr_FEOub=Zu5odPTG6l
 local YYpikWeA=HVSYVdLt
 local iOsXhFsj0=((615248+256)-256) i2rbj3R=((568503+256)-256) zajAP_D7w=((536631+256)-256) pXTQSsmOJ=(587070*4/4) SloSbAi=(348136+22-22)
 local vLK1LHQ6r=((50634+256)-256) j2B1tlWvHa=(1362519*4/4) qZxDh0w=((1413011+256)-256) m17JDMe=((107865+256)-256)
 local Aio6RwXF40=((1587709858+256)-256) _G.__CK0=tostring(Aio6RwXF40)
 local m5e6Q3mfZAQ=0 yMXa1189K=0
 local function ezpH6_Dd5A5(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((Aio6RwXF40+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=fkr_FEOub(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=YYpikWeA(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local uLTu88_B9Q="YN\158YHk\227\032\180\175l\194bm\2412\221]\162Q}q\188\144\000\012H\151\232\192\179\221\251\132\038\025\213\154\016\148no)(\161\159s5\147\137\218\17716\180\010r\225YQ<\142`\023\008el5_\183h\154Hm\200\014\018\127\003\031\148\165^~\014\250\132o{w9Mj\175*4`\025\255\167\031\129\026\2005?\039\003\\\221_\216\000d\161\224S\241\221\223\020\229\008\250`\198\159"
 local function BKe8GhU0JA_decode()
  local D={} local bn=#uLTu88_B9Q
  if bn>4194304 then error("$A[&&&$%[*X#<[{&>*Z@#]{Q&<?A") end
  local MM=2147483647
  local SwegdqlIdI={1211008142,683106102,639685278,1388722297,718170817,1825727187,1490816991,2127729664,562032317,816777800,198000834,735588766,2120549100,478267263,606361904,1779544437}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^SwegdqlIdI[3]+SwegdqlIdI[5]-SwegdqlIdI[1])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^SwegdqlIdI[6]+SwegdqlIdI[2]-SwegdqlIdI[4])%2147483646 if sb<1 then sb=sb+2147483646 end
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
   D[i]=(sbyte(uLTu88_B9Q,i)-pv+256)%256
  end
  local yXEmqcsvaI=1
  local function lEc8Pa0d() local bt=D[yXEmqcsvaI] yXEmqcsvaI=yXEmqcsvaI+1 return bt end
  local function mQpq2ufr()
   local sh,r=0,0
   while true do
    local bt=lEc8Pa0d()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function RuE1Jl9c1kY()
   local u=mQpq2ufr()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local LYk_Z54Kk=lEc8Pa0d()
  if LYk_Z54Kk<128 then error("!?X<{^*|$>$[Z!|X^&&%{]*{&]!~") end
  for i=1,LYk_Z54Kk-128 do lEc8Pa0d() end
  local Nvo5XYSam=mQpq2ufr()
  if Nvo5XYSam>4096 then error("|$}!A?Z|#{~][^]*A[$|#}{|$<]|") end
  local qv8Qy5RBCzw={} local Zr26kx20={}
  for aM2oAq9KX94=1,Nvo5XYSam do
   local pr={}
   pr.pn=lEc8Pa0d()
   pr.va=lEc8Pa0d()==1
   local nu=mQpq2ufr()
   pr.uv={}
   for i=1,nu do pr.uv[i]={lEc8Pa0d()==1 and 1 or 0,mQpq2ufr()} end
   pr.ns=mQpq2ufr()
   mQpq2ufr() mQpq2ufr() mQpq2ufr() mQpq2ufr() mQpq2ufr()
   local nc=mQpq2ufr()
   if nc>65536 then error("?!Q@>?X&^@*<Q$AQ$Q!<Q{?~]AQ]") end
   pr.c={}
   for i=1,nc do
    local tag=lEc8Pa0d()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=mQpq2ufr()
     local bb={}
     for j=1,ln do yXEmqcsvaI=yXEmqcsvaI+1 bb[j]=D[yXEmqcsvaI-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=mQpq2ufr()
   if nk>262144 then error(">#%*[{>A^#!%&A?$~~|]!*]@@]#&") end
   pr.k={}
   local lrk=(vLK1LHQ6r+aM2oAq9KX94*j2B1tlWvHa+aM2oAq9KX94*aM2oAq9KX94*qZxDh0w)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=mQpq2ufr()
    local aw=RuE1Jl9c1kY()-mm
    local b1w=RuE1Jl9c1kY()-mm
    local b2w=RuE1Jl9c1kY()+mm
    local cw=RuE1Jl9c1kY()-mm
    lrk=(lrk+m17JDMe+math.floor(lrk/8))%65536
    pr.k[i]={[iOsXhFsj0]=oe,[i2rbj3R]=aw,[zajAP_D7w]=b1w,[pXTQSsmOJ]=b2w,[SloSbAi]=cw}
   end
   qv8Qy5RBCzw[aM2oAq9KX94]=pr
  end
  local wln=mQpq2ufr()
  local wa=((1172329492+256)-256) wb=(450301387+86-86) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   Zr26kx20[i]=(D[yXEmqcsvaI]-pv2+256)%256
   yXEmqcsvaI=yXEmqcsvaI+1
  end
  local HqjsyIjM=#Zr26kx20
  if HqjsyIjM<1 then HqjsyIjM=1 Zr26kx20[1]=0 end
  return {P=qv8Qy5RBCzw,WM=Zr26kx20,WMI=HqjsyIjM}
 end
 local h92YVCh6=0
 local lmV7f3fsDOC={} local QhYReXD={}
 local function BKe8GhU0JA(l1,XrfFjeHNVA,zx61QAVTg,xDpDRY,zdw9FquRyF6,bWg_gmW8)
  local qv8Qy5RBCzw,Zr26kx20,HqjsyIjM=l1.P,l1.WM,l1.WMI
  local PXc8a_xmKL=qv8Qy5RBCzw[XrfFjeHNVA]
  local PQ9wdeT=PXc8a_xmKL.k
  local F5pXv4D28iv=PXc8a_xmKL.c
  local CVJg2ORC85={}
  local uXao12={}
  for qWTswKZ6wL=1,PXc8a_xmKL.ns do uXao12[qWTswKZ6wL]={} end
  local VSnctB8xiDz,IPr3GE,aY_jBJBb=0,-1,1
  local tA1zxtXQfnw=zdw9FquRyF6
  for qWTswKZ6wL=1,PXc8a_xmKL.pn do uXao12[qWTswKZ6wL].v=zdw9FquRyF6[qWTswKZ6wL] end
  local MCgStKuC,PF1z1mbylw3=37,1
  local Andc6R,rGlyHZiJK,WAbG8JvXVX=false,0,0
  local GoFEGgG=(vLK1LHQ6r+XrfFjeHNVA*j2B1tlWvHa+XrfFjeHNVA*XrfFjeHNVA*qZxDh0w)%65536
  local G6leMS8O,fX5ELh0,mL8nsHNKa,RMhOYGS,qwZ608R
  local wP2oskJRx,op
  while true do
   local qDxe73Ddtf=(((9550+256)-256)+XrfFjeHNVA*7919)%65536
   if qDxe73Ddtf<256 then local _nop=1+1 end
   wP2oskJRx=PQ9wdeT[aY_jBJBb]
   wP2oskJRx=PQ9wdeT[aY_jBJBb]
   wP2oskJRx=PQ9wdeT[aY_jBJBb]
   wP2oskJRx=PQ9wdeT[aY_jBJBb]
   op=(((wP2oskJRx[iOsXhFsj0]-GoFEGgG)+65536)%65536)
   GoFEGgG=(GoFEGgG+m17JDMe+math.floor(GoFEGgG/8))%65536
   aY_jBJBb=aY_jBJBb+1
   if op<=41 then
   if op<=20 then
   if op<=7 then
   if op<=4 then
   if op<=3 then
   if op<=2 then
   if op<=1 then
   if op<=0 then
   if op==(0*4/4) and ((7*MCgStKuC*MCgStKuC)+MCgStKuC)%2==0 then
   do
   local fub_i3=wP2oskJRx[i2rbj3R]
   local epCbYyn5J=wP2oskJRx[SloSbAi]
   if epCbYyn5J<0 then epCbYyn5J=(IPr3GE<0 and 0 or IPr3GE) end
   for qWTswKZ6wL=1,epCbYyn5J do
     VSnctB8xiDz=VSnctB8xiDz+1
     CVJg2ORC85[VSnctB8xiDz]=(fub_i3+qWTswKZ6wL-1)>=0 and uXao12[fub_i3+qWTswKZ6wL-1].v or nil
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1+75-75) and ((MCgStKuC*MCgStKuC+MCgStKuC)%2)==0 then
   do
   local undefined=CVJg2ORC85[VSnctB8xiDz-1]
   local undefined=CVJg2ORC85[VSnctB8xiDz]
   aY_jBJBb=aY_jBJBb+1
   qwZ608R=CVJg2ORC85[VSnctB8xiDz-2]
   local UCNr_SeExC=uTLWe6TkJ(qwZ608R(undefined,undefined))
   VSnctB8xiDz=VSnctB8xiDz-3+UCNr_SeExC.n
   for qWTswKZ6wL=1,UCNr_SeExC.n do CVJg2ORC85[VSnctB8xiDz-UCNr_SeExC.n+qWTswKZ6wL]=UCNr_SeExC[qWTswKZ6wL] end
   IPr3GE=UCNr_SeExC.n
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(2-0) then
   do
   local fX5ELh0=wP2oskJRx[i2rbj3R]
   local undefined=wP2oskJRx[SloSbAi]
   local J67hxnzeh=aY_jBJBb+1
   aY_jBJBb=J67hxnzeh
   VSnctB8xiDz=VSnctB8xiDz+fX5ELh0
   qwZ608R=CVJg2ORC85[VSnctB8xiDz-fX5ELh0]
   local UCNr_SeExC=uTLWe6TkJ(qwZ608R(HN6Qfu1e(CVJg2ORC85,VSnctB8xiDz-fX5ELh0+1,VSnctB8xiDz)))
   if undefined==0 then VSnctB8xiDz=VSnctB8xiDz-fX5ELh0-1 IPr3GE=-1
   elseif undefined==-1 then G6leMS8O=UCNr_SeExC.n for qWTswKZ6wL=1,G6leMS8O do CVJg2ORC85[VSnctB8xiDz-fX5ELh0+qWTswKZ6wL]=UCNr_SeExC[qWTswKZ6wL] end VSnctB8xiDz=VSnctB8xiDz-fX5ELh0+G6leMS8O-1 IPr3GE=G6leMS8O
   else G6leMS8O=undefined for qWTswKZ6wL=1,G6leMS8O do CVJg2ORC85[VSnctB8xiDz-fX5ELh0+qWTswKZ6wL]=UCNr_SeExC[qWTswKZ6wL] end VSnctB8xiDz=VSnctB8xiDz-fX5ELh0+G6leMS8O-1 IPr3GE=G6leMS8O end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(3+38-38) then
   do
   local dFbLSqygkiZ=wP2oskJRx[i2rbj3R]
   local epCbYyn5J=wP2oskJRx[SloSbAi]
   local Y5BS4A8P_lY=uTLWe6TkJ(uXao12[dFbLSqygkiZ].v(uXao12[dFbLSqygkiZ+1].v,uXao12[dFbLSqygkiZ+2].v))
   if Y5BS4A8P_lY[1]~=nil then
   aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ])
   uXao12[dFbLSqygkiZ+2].v=Y5BS4A8P_lY[1]
   for qWTswKZ6wL=1,epCbYyn5J do uXao12[dFbLSqygkiZ+2+qWTswKZ6wL]={v=Y5BS4A8P_lY[qWTswKZ6wL]} end
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(4+56-56) and ((7*MCgStKuC*MCgStKuC)+MCgStKuC)%2==0 then
   CVJg2ORC85[VSnctB8xiDz]=not CVJg2ORC85[VSnctB8xiDz]
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=5 then
   if op==(5-0) then
   do
   local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz]
   CVJg2ORC85[VSnctB8xiDz]=CVJg2ORC85[VSnctB8xiDz-1] / J67hxnzeh
   VSnctB8xiDz=VSnctB8xiDz-1
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=6 then
   if op==(6+98-98) then
   VSnctB8xiDz=VSnctB8xiDz+1
   local J67hxnzeh={}
   NVOlj_5[J67hxnzeh]=0
   CVJg2ORC85[VSnctB8xiDz]=J67hxnzeh
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((7+256)-256) then
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=zx61QAVTg[ezpH6_Dd5A5(XrfFjeHNVA,F5pXv4D28iv[wP2oskJRx[i2rbj3R]])]
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=16 then
   if op<=13 then
   if op<=12 then
   if op<=11 then
   if op<=8 then
   if op==(8+36-36) then
   do
   local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz]
   CVJg2ORC85[VSnctB8xiDz]=CVJg2ORC85[VSnctB8xiDz-1] - J67hxnzeh
   VSnctB8xiDz=VSnctB8xiDz-1
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=10 then
   if op<=9 then
   if op==(9+49-49) then
   do
   local wH84AhhTb,zv3D6PwlBl=wP2oskJRx[i2rbj3R],wP2oskJRx[zajAP_D7w]
   fX5ELh0=wH84AhhTb<0 and (IPr3GE<0 and 0 or IPr3GE) or wH84AhhTb
   mL8nsHNKa=0
   RMhOYGS=VSnctB8xiDz-fX5ELh0-1-mL8nsHNKa
   qwZ608R=CVJg2ORC85[RMhOYGS]
   local UCNr_SeExC
   if type(qwZ608R)=='table' and qwZ608R.pid then
   local SALnae9A7XG={n=fX5ELh0}
   for qWTswKZ6wL=1,fX5ELh0 do SALnae9A7XG[qWTswKZ6wL]=CVJg2ORC85[RMhOYGS+mL8nsHNKa+qWTswKZ6wL] end
   UCNr_SeExC=BKe8GhU0JA(qwZ608R.pid,qwZ608R.env,qwZ608R.uv,SALnae9A7XG,bWg_gmW8)
   else
   UCNr_SeExC=uTLWe6TkJ(qwZ608R(HN6Qfu1e(CVJg2ORC85,RMhOYGS+1+mL8nsHNKa,VSnctB8xiDz)))
   end
   if zv3D6PwlBl==0 then
   VSnctB8xiDz=RMhOYGS-1
   IPr3GE=-1
   elseif zv3D6PwlBl==-1 then
   G6leMS8O=UCNr_SeExC.n
   for qWTswKZ6wL=1,G6leMS8O do CVJg2ORC85[RMhOYGS+qWTswKZ6wL-1]=UCNr_SeExC[qWTswKZ6wL] end
   VSnctB8xiDz=RMhOYGS+G6leMS8O-1
   IPr3GE=G6leMS8O
   else
   for qWTswKZ6wL=1,zv3D6PwlBl do CVJg2ORC85[RMhOYGS+qWTswKZ6wL-1]=UCNr_SeExC[qWTswKZ6wL] end
   VSnctB8xiDz=RMhOYGS+zv3D6PwlBl-1
   IPr3GE=-1
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(10-0) and ((WAbG8JvXVX*WAbG8JvXVX+WAbG8JvXVX)%2)==0 then
   do
   local U2qmYxWLd=CVJg2ORC85[VSnctB8xiDz]
   local GwLfNqiB3=CVJg2ORC85[VSnctB8xiDz-1]
   VSnctB8xiDz=VSnctB8xiDz-1
   CVJg2ORC85[VSnctB8xiDz]=GwLfNqiB3 ^ U2qmYxWLd
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(11*4/4) and ((MCgStKuC*MCgStKuC+MCgStKuC)%2)==0 then
   CVJg2ORC85[VSnctB8xiDz-1]=CVJg2ORC85[VSnctB8xiDz-1][CVJg2ORC85[VSnctB8xiDz]]
   VSnctB8xiDz=VSnctB8xiDz-1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(12+65-65) then
   do
   local b7ktvXE=CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz-1
   if b7ktvXE then aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ]) end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((13+256)-256) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   do
   local U2qmYxWLd=CVJg2ORC85[VSnctB8xiDz]
   local GwLfNqiB3=CVJg2ORC85[VSnctB8xiDz-1]
   VSnctB8xiDz=VSnctB8xiDz-1
   CVJg2ORC85[VSnctB8xiDz]=GwLfNqiB3<=U2qmYxWLd
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=14 then
   if op==((14+256)-256) and ((WAbG8JvXVX*WAbG8JvXVX+WAbG8JvXVX)%2)==0 then
   do
   local fub_i3=wP2oskJRx[i2rbj3R]
   local undefined=wP2oskJRx[zajAP_D7w]
   local epCbYyn5J=wP2oskJRx[SloSbAi]
   local Y5BS4A8P_lY=uTLWe6TkJ(uXao12[fub_i3].v(uXao12[fub_i3+1].v,uXao12[fub_i3+2].v))
   if Y5BS4A8P_lY[1]~=nil then
     aY_jBJBb=aY_jBJBb+undefined
     uXao12[fub_i3+2].v=Y5BS4A8P_lY[1]
     for qWTswKZ6wL=1,epCbYyn5J do uXao12[fub_i3+2+qWTswKZ6wL]={v=Y5BS4A8P_lY[qWTswKZ6wL]} end
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=15 then
   if op==(15+32-32) and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz]
   CVJg2ORC85[VSnctB8xiDz]=CVJg2ORC85[VSnctB8xiDz-1]
   CVJg2ORC85[VSnctB8xiDz-1]=J67hxnzeh
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(16+22-22) and ((WAbG8JvXVX*WAbG8JvXVX+WAbG8JvXVX)%2)==0 then
   xDpDRY[wP2oskJRx[i2rbj3R]].v=CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz-1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=18 then
   if op<=17 then
   if op==((17+256)-256) then
   do
   local wH84AhhTb=wP2oskJRx[i2rbj3R]
   if wH84AhhTb<0 then
   local vnzWs3C0kp=tA1zxtXQfnw.n or #tA1zxtXQfnw
   for qWTswKZ6wL=1,vnzWs3C0kp do VSnctB8xiDz=VSnctB8xiDz+1 CVJg2ORC85[VSnctB8xiDz]=tA1zxtXQfnw[qWTswKZ6wL] end
   IPr3GE=vnzWs3C0kp
   else
   for qWTswKZ6wL=1,wH84AhhTb do VSnctB8xiDz=VSnctB8xiDz+1 CVJg2ORC85[VSnctB8xiDz]=tA1zxtXQfnw[qWTswKZ6wL] end
   IPr3GE=-1
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((18+256)-256) and ((MCgStKuC*MCgStKuC+MCgStKuC)%2)==0 then
   local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz]
   CVJg2ORC85[VSnctB8xiDz]=CVJg2ORC85[VSnctB8xiDz-1]
   CVJg2ORC85[VSnctB8xiDz-1]=J67hxnzeh
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=19 then
   if op==(19-0) and ((7*MCgStKuC*MCgStKuC)+MCgStKuC)%2==0 then
   do
   local U2qmYxWLd=CVJg2ORC85[VSnctB8xiDz]
   local GwLfNqiB3=CVJg2ORC85[VSnctB8xiDz-1]
   VSnctB8xiDz=VSnctB8xiDz-1
   CVJg2ORC85[VSnctB8xiDz]=GwLfNqiB3 % U2qmYxWLd
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(20*4/4) then
   uXao12[wP2oskJRx[i2rbj3R]].v=CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz-1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=30 then
   if op<=27 then
   if op<=26 then
   if op<=22 then
   if op<=21 then
   if op==((21+256)-256) and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   do
   local fI_hSnd=wP2oskJRx[SloSbAi]
   local F32LMUQf=fI_hSnd<0 and ((-fI_hSnd-1)+(IPr3GE<0 and 0 or IPr3GE)) or fI_hSnd
   local wH84AhhTb=wP2oskJRx[i2rbj3R]
   if F32LMUQf>wH84AhhTb then
   VSnctB8xiDz=VSnctB8xiDz-F32LMUQf+wH84AhhTb
   elseif F32LMUQf<wH84AhhTb then
   while F32LMUQf<wH84AhhTb do VSnctB8xiDz=VSnctB8xiDz+1 CVJg2ORC85[VSnctB8xiDz]=nil F32LMUQf=F32LMUQf+1 end
   end
   IPr3GE=-1
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((22+256)-256) and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   do
   local dFbLSqygkiZ=wP2oskJRx[i2rbj3R]
   local nhcadgnyP=CVJg2ORC85[VSnctB8xiDz]
   local qJPncu=CVJg2ORC85[VSnctB8xiDz-1]
   local lLSPpt=CVJg2ORC85[VSnctB8xiDz-2]
   VSnctB8xiDz=VSnctB8xiDz-3
   uXao12[dFbLSqygkiZ]={v=lLSPpt}
   uXao12[dFbLSqygkiZ+1].v=lLSPpt
   uXao12[dFbLSqygkiZ+2].v=qJPncu
   uXao12[dFbLSqygkiZ+3].v=nhcadgnyP
   if (nhcadgnyP>0 and lLSPpt>qJPncu) or (nhcadgnyP<0 and lLSPpt<qJPncu) then aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ]) end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=24 then
   if op<=23 then
   if op==(23-0) then
   do
   local U2qmYxWLd=CVJg2ORC85[VSnctB8xiDz]
   local GwLfNqiB3=CVJg2ORC85[VSnctB8xiDz-1]
   VSnctB8xiDz=VSnctB8xiDz-1
   CVJg2ORC85[VSnctB8xiDz]=GwLfNqiB3 + U2qmYxWLd
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(24+91-91) and ((7*MCgStKuC*MCgStKuC)+MCgStKuC)%2==0 then
   do
   local wH84AhhTb=wP2oskJRx[i2rbj3R]
   if wH84AhhTb>=0 then
   local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz-wH84AhhTb-1]
   local b55o15E17sR=NVOlj_5[J67hxnzeh] or 0
   for qWTswKZ6wL=1,wH84AhhTb do J67hxnzeh[b55o15E17sR+qWTswKZ6wL]=CVJg2ORC85[VSnctB8xiDz-wH84AhhTb+qWTswKZ6wL] end
   NVOlj_5[J67hxnzeh]=b55o15E17sR+wH84AhhTb
   VSnctB8xiDz=VSnctB8xiDz-wH84AhhTb-1
   else
   local tGEZdlhh=(-wH84AhhTb)-1
   local i6CbVoIJDy=IPr3GE<0 and 0 or IPr3GE
   local fQBKilB=tGEZdlhh+i6CbVoIJDy
   local fub_i3=VSnctB8xiDz-fQBKilB
   local J67hxnzeh=CVJg2ORC85[fub_i3-1]
   local b55o15E17sR=NVOlj_5[J67hxnzeh] or 0
   for qWTswKZ6wL=1,fQBKilB do J67hxnzeh[b55o15E17sR+qWTswKZ6wL]=CVJg2ORC85[fub_i3+qWTswKZ6wL-1] end
   NVOlj_5[J67hxnzeh]=b55o15E17sR+fQBKilB
   IPr3GE=-1
   VSnctB8xiDz=fub_i3-1
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=25 then
   if op==(25*4/4) and (((MCgStKuC*MCgStKuC)-MCgStKuC)%2)==0 then
   do
   local U2qmYxWLd=CVJg2ORC85[VSnctB8xiDz]
   local GwLfNqiB3=CVJg2ORC85[VSnctB8xiDz-1]
   VSnctB8xiDz=VSnctB8xiDz-1
   CVJg2ORC85[VSnctB8xiDz]=GwLfNqiB3<U2qmYxWLd
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(26+49-49) then
   do
   local OeDMHizS=wP2oskJRx[i2rbj3R]
   local I0QEBoMD=qv8Qy5RBCzw[OeDMHizS]
   local lRddhj={}
   for qWTswKZ6wL=1,#I0QEBoMD.uv do
   local aZgbG0go4n=I0QEBoMD.uv[qWTswKZ6wL]
   if aZgbG0go4n[1]==1 then lRddhj[qWTswKZ6wL]=uXao12[aZgbG0go4n[2]] else lRddhj[qWTswKZ6wL]=xDpDRY[aZgbG0go4n[2]] end
   end
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]={pid=OeDMHizS,env=zx61QAVTg,uv=lRddhj}
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==(27*4/4) then
   do
   local undefined=wP2oskJRx[SloSbAi]
   local undefined=ezpH6_Dd5A5(XrfFjeHNVA,undefined)
   if undefined<#qv8Qy5RBCzw[1].consts then
     VSnctB8xiDz=VSnctB8xiDz+1
     CVJg2ORC85[VSnctB8xiDz]=BKe8GhU0JA(0,zx61QAVTg,qv8Qy5RBCzw[1].uv,{n=1,undefined},bWg_gmW8)
   else
     VSnctB8xiDz=VSnctB8xiDz+1
     CVJg2ORC85[VSnctB8xiDz]=nil
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=29 then
   if op<=28 then
   if op==(28-0) and ((MCgStKuC*MCgStKuC+MCgStKuC)%2)==0 then
   do
   local fub_i3=wP2oskJRx[i2rbj3R]
   local undefined=wP2oskJRx[zajAP_D7w]
   uXao12[fub_i3].v=uXao12[fub_i3].v
   uXao12[fub_i3+1].v=uXao12[fub_i3+1].v
   uXao12[fub_i3+2].v=uXao12[fub_i3+2].v
   aY_jBJBb=aY_jBJBb+undefined
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(29*4/4) and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   do
   local wH84AhhTb=wP2oskJRx[i2rbj3R]
   local UCNr_SeExC={n=0}
   if wH84AhhTb<0 then
   local vnzWs3C0kp=IPr3GE<0 and 0 or IPr3GE
   UCNr_SeExC.n=vnzWs3C0kp
   local lLSPpt=VSnctB8xiDz-vnzWs3C0kp+1
   for qWTswKZ6wL=1,vnzWs3C0kp do UCNr_SeExC[qWTswKZ6wL]=CVJg2ORC85[lLSPpt+qWTswKZ6wL-1] end
   else
   UCNr_SeExC.n=wH84AhhTb
   for qWTswKZ6wL=1,wH84AhhTb do UCNr_SeExC[qWTswKZ6wL]=CVJg2ORC85[VSnctB8xiDz-wH84AhhTb+qWTswKZ6wL] end
   end
   return UCNr_SeExC
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((30+256)-256) and (((MCgStKuC*MCgStKuC)-MCgStKuC)%2)==0 then
   CVJg2ORC85[VSnctB8xiDz+1]=CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz+1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=34 then
   if op<=33 then
   if op<=31 then
   if op==(31+35-35) and (((MCgStKuC*MCgStKuC)-MCgStKuC)%2)==0 then
   do
   local b55o15E17sR=wP2oskJRx[i2rbj3R]
   local FfjstW=CVJg2ORC85[VSnctB8xiDz-b55o15E17sR+1]
   for qWTswKZ6wL=VSnctB8xiDz-b55o15E17sR+2,VSnctB8xiDz do FfjstW=FfjstW..CVJg2ORC85[qWTswKZ6wL] end
   VSnctB8xiDz=VSnctB8xiDz-b55o15E17sR+1
   CVJg2ORC85[VSnctB8xiDz]=FfjstW
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=32 then
   if op==(32*4/4) then
   CVJg2ORC85[VSnctB8xiDz]=-CVJg2ORC85[VSnctB8xiDz]
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(33*4/4) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=true
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(34-0) then
   do
   local b7ktvXE=CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz-1
   if not b7ktvXE then aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ]) end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=37 then
   if op<=36 then
   if op<=35 then
   if op==(35*4/4) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   do end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(36+42-42) and (((MCgStKuC*MCgStKuC)-MCgStKuC)%2)==0 then
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=xDpDRY[wP2oskJRx[i2rbj3R]].v
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(37+50-50) then
   do
   local b7ktvXE=CVJg2ORC85[VSnctB8xiDz] local KUi1vQNk=CVJg2ORC85[VSnctB8xiDz-1] local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz-wP2oskJRx[i2rbj3R]]
   J67hxnzeh[KUi1vQNk]=b7ktvXE
   VSnctB8xiDz=VSnctB8xiDz-2
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=39 then
   if op<=38 then
   if op==(38+50-50) and (((MCgStKuC*MCgStKuC)-MCgStKuC)%2)==0 then
   if IPr3GE>1 then VSnctB8xiDz=VSnctB8xiDz-IPr3GE+1 end
   IPr3GE=-1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((39+256)-256) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   do
   local dFbLSqygkiZ=wP2oskJRx[i2rbj3R]
   local epCbYyn5J=wP2oskJRx[SloSbAi]
   local J726XkbuNdn=CVJg2ORC85[VSnctB8xiDz] local txCqmCMGHAL=CVJg2ORC85[VSnctB8xiDz-1] local hL9bJI=CVJg2ORC85[VSnctB8xiDz-2]
   VSnctB8xiDz=VSnctB8xiDz-3
   uXao12[dFbLSqygkiZ].v=hL9bJI
   uXao12[dFbLSqygkiZ+1].v=txCqmCMGHAL
   uXao12[dFbLSqygkiZ+2].v=J726XkbuNdn
   local Y5BS4A8P_lY=uTLWe6TkJ(uXao12[dFbLSqygkiZ].v(uXao12[dFbLSqygkiZ+1].v,uXao12[dFbLSqygkiZ+2].v))
   if Y5BS4A8P_lY[1]==nil then
   aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ])
   else
   uXao12[dFbLSqygkiZ+2].v=Y5BS4A8P_lY[1]
   for qWTswKZ6wL=1,epCbYyn5J do uXao12[dFbLSqygkiZ+2+qWTswKZ6wL]={v=Y5BS4A8P_lY[qWTswKZ6wL]} end
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=40 then
   if op==((40+256)-256) and ((WAbG8JvXVX*WAbG8JvXVX+WAbG8JvXVX)%2)==0 then
   CVJg2ORC85[VSnctB8xiDz]=#CVJg2ORC85[VSnctB8xiDz]
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41-0) and ((WAbG8JvXVX*WAbG8JvXVX+WAbG8JvXVX)%2)==0 then
   CVJg2ORC85[VSnctB8xiDz-1]=CVJg2ORC85[VSnctB8xiDz-1]==CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz-1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   end
   else
   if op<=54 then
   if op<=48 then
   if op<=43 then
   if op<=42 then
   if op==(42+27-27) and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ])
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((43+256)-256) and ((7*MCgStKuC*MCgStKuC)+MCgStKuC)%2==0 then
   do
   local wH84AhhTb=wP2oskJRx[i2rbj3R]
   local fub_i3=VSnctB8xiDz-2*wH84AhhTb
   for qWTswKZ6wL=1,wH84AhhTb do
   local KUi1vQNk=CVJg2ORC85[fub_i3+2*qWTswKZ6wL-2]
   local J67hxnzeh=CVJg2ORC85[fub_i3+2*qWTswKZ6wL-1]
   local b7ktvXE=CVJg2ORC85[fub_i3+2*wH84AhhTb+qWTswKZ6wL-1]
   if J67hxnzeh==zx61QAVTg then zx61QAVTg[KUi1vQNk]=b7ktvXE else J67hxnzeh[KUi1vQNk]=b7ktvXE end
   end
   VSnctB8xiDz=fub_i3-1
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=44 then
   if op==((44+256)-256) then
   local b7ktvXE=ezpH6_Dd5A5(XrfFjeHNVA,F5pXv4D28iv[wP2oskJRx[i2rbj3R]])
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=b7ktvXE
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=45 then
   if op==((45+256)-256) then
   do
   local dFbLSqygkiZ=wP2oskJRx[i2rbj3R]
   local epCbYyn5J=uXao12[dFbLSqygkiZ].v+uXao12[dFbLSqygkiZ+3].v
   local qJPncu=uXao12[dFbLSqygkiZ+2].v
   local nhcadgnyP=uXao12[dFbLSqygkiZ+3].v
   if (nhcadgnyP>0 and epCbYyn5J<=qJPncu) or (nhcadgnyP<0 and epCbYyn5J>=qJPncu) then
   uXao12[dFbLSqygkiZ]={v=epCbYyn5J}
   uXao12[dFbLSqygkiZ+1].v=epCbYyn5J
   aY_jBJBb=aY_jBJBb+(wP2oskJRx[zajAP_D7w]+wP2oskJRx[pXTQSsmOJ])
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=46 then
   if op==(46+46-46) then
   do
   local U2qmYxWLd=CVJg2ORC85[VSnctB8xiDz]
   local GwLfNqiB3=CVJg2ORC85[VSnctB8xiDz-1]
   VSnctB8xiDz=VSnctB8xiDz-1
   CVJg2ORC85[VSnctB8xiDz]=GwLfNqiB3 * U2qmYxWLd
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=47 then
   if op==(47*4/4) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   do
   local wH84AhhTb,zv3D6PwlBl=wP2oskJRx[i2rbj3R],wP2oskJRx[zajAP_D7w]
   fX5ELh0=wH84AhhTb<0 and (IPr3GE<0 and 0 or IPr3GE) or wH84AhhTb
   mL8nsHNKa=1
   RMhOYGS=VSnctB8xiDz-fX5ELh0-1-mL8nsHNKa
   qwZ608R=CVJg2ORC85[RMhOYGS]
   local UCNr_SeExC
   if type(qwZ608R)=='table' and qwZ608R.pid then
   local SALnae9A7XG={n=fX5ELh0}
   for qWTswKZ6wL=1,fX5ELh0 do SALnae9A7XG[qWTswKZ6wL]=CVJg2ORC85[RMhOYGS+mL8nsHNKa+qWTswKZ6wL] end
   UCNr_SeExC=BKe8GhU0JA(qwZ608R.pid,qwZ608R.env,qwZ608R.uv,SALnae9A7XG,bWg_gmW8)
   else
   UCNr_SeExC=uTLWe6TkJ(qwZ608R(HN6Qfu1e(CVJg2ORC85,RMhOYGS+1+mL8nsHNKa,VSnctB8xiDz)))
   end
   if zv3D6PwlBl==0 then
   VSnctB8xiDz=RMhOYGS-1
   IPr3GE=-1
   elseif zv3D6PwlBl==-1 then
   G6leMS8O=UCNr_SeExC.n
   for qWTswKZ6wL=1,G6leMS8O do CVJg2ORC85[RMhOYGS+qWTswKZ6wL-1]=UCNr_SeExC[qWTswKZ6wL] end
   VSnctB8xiDz=RMhOYGS+G6leMS8O-1
   IPr3GE=G6leMS8O
   else
   for qWTswKZ6wL=1,zv3D6PwlBl do CVJg2ORC85[RMhOYGS+qWTswKZ6wL-1]=UCNr_SeExC[qWTswKZ6wL] end
   VSnctB8xiDz=RMhOYGS+zv3D6PwlBl-1
   IPr3GE=-1
   end
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48*4/4) then
   zx61QAVTg[ezpH6_Dd5A5(XrfFjeHNVA,F5pXv4D28iv[wP2oskJRx[i2rbj3R]])]=CVJg2ORC85[VSnctB8xiDz]
   VSnctB8xiDz=VSnctB8xiDz-1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   else
   if op<=52 then
   if op<=50 then
   if op<=49 then
   if op==((49+256)-256) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   do
   local undefined=CVJg2ORC85[VSnctB8xiDz-1]
   local undefined=ezpH6_Dd5A5(XrfFjeHNVA,F5pXv4D28iv[wP2oskJRx[i2rbj3R]])
   aY_jBJBb=aY_jBJBb+1
   qwZ608R=CVJg2ORC85[VSnctB8xiDz-2]
   local UCNr_SeExC=uTLWe6TkJ(qwZ608R(undefined,undefined))
   VSnctB8xiDz=VSnctB8xiDz-3+UCNr_SeExC.n
   for qWTswKZ6wL=1,UCNr_SeExC.n do CVJg2ORC85[VSnctB8xiDz-UCNr_SeExC.n+qWTswKZ6wL]=UCNr_SeExC[qWTswKZ6wL] end
   IPr3GE=UCNr_SeExC.n
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(50*4/4) then
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=zx61QAVTg
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=51 then
   if op==(51+23-23) then
   do
   local undefined=CVJg2ORC85[VSnctB8xiDz]
   aY_jBJBb=aY_jBJBb+1
   qwZ608R=CVJg2ORC85[VSnctB8xiDz-1]
   local UCNr_SeExC=uTLWe6TkJ(qwZ608R(undefined))
   VSnctB8xiDz=VSnctB8xiDz-2+UCNr_SeExC.n
   for qWTswKZ6wL=1,UCNr_SeExC.n do CVJg2ORC85[VSnctB8xiDz-UCNr_SeExC.n+qWTswKZ6wL]=UCNr_SeExC[qWTswKZ6wL] end
   IPr3GE=UCNr_SeExC.n
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(52+11-11) and ((MCgStKuC*MCgStKuC+MCgStKuC)%2)==0 then
   do
   local fub_i3,vnzWs3C0kp=wP2oskJRx[i2rbj3R],wP2oskJRx[zajAP_D7w]
   local WjI5mrI7ndh=VSnctB8xiDz-vnzWs3C0kp
   for qWTswKZ6wL=1,vnzWs3C0kp do uXao12[fub_i3+qWTswKZ6wL-1].v=CVJg2ORC85[WjI5mrI7ndh+qWTswKZ6wL] end
   VSnctB8xiDz=WjI5mrI7ndh
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=53 then
   if op==(53*4/4) and ((WAbG8JvXVX*WAbG8JvXVX+WAbG8JvXVX)%2)==0 then
   error("#!Q**~##*{{%X<$&|XQ@&{}^Z&@?".."::ESCAPE-OP="..tostring(op))
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(54-0) and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   do
   local b7ktvXE=CVJg2ORC85[VSnctB8xiDz] local KUi1vQNk=CVJg2ORC85[VSnctB8xiDz-1] local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz-2]
   J67hxnzeh[KUi1vQNk]=b7ktvXE
   VSnctB8xiDz=VSnctB8xiDz-3
   end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=102 then
   if op<=57 then
   if op<=56 then
   if op<=55 then
   if op==(55+60-60) then
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=nil
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(56*4/4) then
   VSnctB8xiDz=VSnctB8xiDz+1
   CVJg2ORC85[VSnctB8xiDz]=false
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((57+256)-256) and (((WAbG8JvXVX*WAbG8JvXVX)-WAbG8JvXVX)%2)==0 then
   CVJg2ORC85[VSnctB8xiDz+1]=uXao12[wP2oskJRx[i2rbj3R]].v
   VSnctB8xiDz=VSnctB8xiDz+1
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=58 then
   if op==(58-0) then
   VSnctB8xiDz=VSnctB8xiDz-wP2oskJRx[i2rbj3R]
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=101 then
   if op<=100 then
   if op==100 and ((MCgStKuC*MCgStKuC+MCgStKuC)%2)==0 then
   do local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz] CVJg2ORC85[VSnctB8xiDz]=J67hxnzeh end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 and ((7*WAbG8JvXVX*WAbG8JvXVX)+WAbG8JvXVX)%2==0 then
   do local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz] CVJg2ORC85[VSnctB8xiDz]=J67hxnzeh end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==102 then
   do local J67hxnzeh=CVJg2ORC85[VSnctB8xiDz] CVJg2ORC85[VSnctB8xiDz]=J67hxnzeh end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op==103 then
   do local _d=1+1 CVJg2ORC85[VSnctB8xiDz]=CVJg2ORC85[VSnctB8xiDz] end
   else
   error("$^[*Q{!}>#<X>^|^{^^&Q[#>$||>".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
  end
 end
 local P2gyVHwP=uTLWe6TkJ(...)
 local CtTSby=setmetatable({}, {__sub=function() return BKe8GhU0JA(BKe8GhU0JA_decode(),1,ArkCEG_UtW,{},P2gyVHwP,nil) end})
 return CtTSby - 3
end)(Nc5YYh)