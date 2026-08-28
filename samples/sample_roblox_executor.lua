-- NEVAHEX-VM v3 'Hex' — protected artifact — *@#%?<A<}Q]#() runs it

return (function(KdA4jgGOp, ...)
 local PMdF_E=setmetatable({},{__mode="k"})
 local function O5UJkOqrsR(...) local n=select('#',...) return {n=n,...} end
 local function g3560i(e,k) if type(e)~="table" then return end return rawget(e,k) end
 local function j0ZKZP9eeJA(e,k) local v=g3560i(e,k) return type(v)=="table" and v end
 local QGFmszKI=(type(_ENV)=="table" and _ENV) or (type(_G)=="table" and _G) or {}
 local ysRQZ2=j0ZKZP9eeJA(QGFmszKI,"table")
 local I3l_Bi_Ke=g3560i(QGFmszKI,"unpack") or g3560i(ysRQZ2,"unpack") or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function PYQiOw7(t,i,j)
  if i>j then return end
  if I3l_Bi_Ke and j-i>15 then return I3l_Bi_Ke(t,i,j) end
  return t[i],PYQiOw7(t,i+1,j)
 end
 local GarcY50=g3560i(j0ZKZP9eeJA(QGFmszKI,"string"),"char") or (type(_G)=="table" and g3560i(j0ZKZP9eeJA(_G,"string"),"char")) or string.char
 local VO8AE_3B=g3560i(j0ZKZP9eeJA(QGFmszKI,"table"),"concat") or (type(_G)=="table" and g3560i(j0ZKZP9eeJA(_G,"table"),"concat")) or table.concat
 local ZVt124yD=GarcY50
 local DG3XPQ=VO8AE_3B
 local YiJAetmDHV=((118044+256)-256) rLoZAAd=(126648*4/4) lbQltAj=(163653-0) fYSrcaJ4Mi=((989004+256)-256) mBjeU_DPXh=(344704+88-88)
 local QU_cDGKKsq=(41213*4/4) TZSIDI1LWRI=(1000043+30-30) PWJAhT9bdQg=(1382991-0) I6Y8wdiVvw=(230661*4/4)
 local h4_5JO4=(242523792+41-41) _G.__CK0=tostring(h4_5JO4)
 local HLRHXT1SiM=0 NTaVrB=0
 local function RmEu1X(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((h4_5JO4+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=ZVt124yD(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=DG3XPQ(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local RWac3Z8NZKT="\253\249\198S\145gE\243QH\031\025Mc\006C\226-8\187\029\133\203\213\141\234\128O\230\155\252\243xo\185=)\"\242O+,\214\241@\135>\172\248\240r=\140\038\212\220M\129d2\022\174\222\007\231\189[Cdde\185\007\208ax\133\027[v-/\037p\022\014\038u7\224(\127\171\251\252\187\231\150.\189\1951\025B\228\238\0309.\191Ut\158\165\177\005\2396\007\165\247\209\175\004\176\130\186\009HT\203\234\157\178\219\030\220\000\221H\001\008\128\177\1788\148\004yz\251\190x\191\168{\244v\003(d\136T\2129\162\179\033e\020s\220\199\005]D\186Q*B\140\009\018\189\221\1424"
 local function qSUAU9W_decode()
  local D={} local bn=#RWac3Z8NZKT
  if bn>4194304 then error("~<<*<Z{^[?$X%?[}^^A${%Q{?*%|") end
  local sa=(477024346*4/4) sb=(667276588-0) MM=2147483647
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
   D[i]=(sbyte(RWac3Z8NZKT,i)-pv+256)%256
  end
  local Idri2EQw=1
  local function kwO47Ip() local bt=D[Idri2EQw] Idri2EQw=Idri2EQw+1 return bt end
  local function vEirQura6HL()
   local sh,r=0,0
   while true do
    local bt=kwO47Ip()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function QXJEgqxV_()
   local u=vEirQura6HL()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local JuuEhS=kwO47Ip()
  if JuuEhS<128 then error("%|#A&~&%$[^~}}%!![@*%A~!~Z%&") end
  for i=1,JuuEhS-128 do kwO47Ip() end
  local kQCHiIV=vEirQura6HL()
  if kQCHiIV>4096 then error("Z!%!Q}>?}*[^{Q[%[@A{{<?#]^^?") end
  local J876nh={} local Lu6Nyh5={}
  for OQR9roc6UC=1,kQCHiIV do
   local pr={}
   pr.pn=kwO47Ip()
   pr.va=kwO47Ip()==1
   local nu=vEirQura6HL()
   pr.uv={}
   for i=1,nu do pr.uv[i]={kwO47Ip()==1 and 1 or 0,vEirQura6HL()} end
   pr.ns=vEirQura6HL()
   vEirQura6HL() vEirQura6HL() vEirQura6HL() vEirQura6HL() vEirQura6HL()
   local nc=vEirQura6HL()
   if nc>65536 then error("@!]}|??>@&~]!**Q|#|Q!>*ZZZQ*") end
   pr.c={}
   for i=1,nc do
    local tag=kwO47Ip()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=vEirQura6HL()
     local bb={}
     for j=1,ln do Idri2EQw=Idri2EQw+1 bb[j]=D[Idri2EQw-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=vEirQura6HL()
   if nk>262144 then error("{X<@*}@#Q~!}^AX#}A[$|X|[&ZA*") end
   pr.k={}
   local lrk=(QU_cDGKKsq+OQR9roc6UC*TZSIDI1LWRI+OQR9roc6UC*OQR9roc6UC*PWJAhT9bdQg)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=vEirQura6HL()
    local aw=QXJEgqxV_()-mm
    local b1w=QXJEgqxV_()-mm
    local b2w=QXJEgqxV_()+mm
    local cw=QXJEgqxV_()-mm
    lrk=(lrk+I6Y8wdiVvw+math.floor(lrk/8))%65536
    pr.k[i]={[YiJAetmDHV]=oe,[rLoZAAd]=aw,[lbQltAj]=b1w,[fYSrcaJ4Mi]=b2w,[mBjeU_DPXh]=cw}
   end
   J876nh[OQR9roc6UC]=pr
  end
  local wln=vEirQura6HL()
  local wa=((1349775763+256)-256) wb=((256157772+256)-256) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   Lu6Nyh5[i]=(D[Idri2EQw]-pv2+256)%256
   Idri2EQw=Idri2EQw+1
  end
  local l2MJsOedkUb=#Lu6Nyh5
  if l2MJsOedkUb<1 then l2MJsOedkUb=1 Lu6Nyh5[1]=0 end
  return {P=J876nh,WM=Lu6Nyh5,WMI=l2MJsOedkUb}
 end
 local ki0vjHr2Xbg=0
 local m2kYqr={} local SfjH_fg={}
 local function qSUAU9W(l1,IPFs0YIoh5,TZZJJI,hbjz_q,V4rPAuC,Wn96HERUN)
  local J876nh,Lu6Nyh5,l2MJsOedkUb=l1.P,l1.WM,l1.WMI
  local oRdZat=J876nh[IPFs0YIoh5]
  local oCfWPNtn=oRdZat.k
  local XlN0uXG=oRdZat.c
  local OmuT6a2={}
  local nPCdtHZRqtT={}
  for U7iGOwmMmQ=1,oRdZat.ns do nPCdtHZRqtT[U7iGOwmMmQ]={} end
  local sGTgJARQ,JaMZIljXmAt,tTiLa0xf=0,-1,1
  local H9W8XzH=V4rPAuC
  for U7iGOwmMmQ=1,oRdZat.pn do nPCdtHZRqtT[U7iGOwmMmQ].v=V4rPAuC[U7iGOwmMmQ] end
  local ZaIx75aJj9,XwNx7o=37,1
  local b0kWQW,xi1zAVZPTV7,n7uqSd3uPRl=false,0,0
  local ezfY3GmQ=(QU_cDGKKsq+IPFs0YIoh5*TZSIDI1LWRI+IPFs0YIoh5*IPFs0YIoh5*PWJAhT9bdQg)%65536
  local osqQJYYMdW,KTyH5BVE46B,LNFWaLvVL8K,mG_OGwkFIn,MdW9a3
  local D1I6uYLInJ,op
  while true do
   D1I6uYLInJ=oCfWPNtn[tTiLa0xf]
   D1I6uYLInJ=oCfWPNtn[tTiLa0xf]
   D1I6uYLInJ=oCfWPNtn[tTiLa0xf]
   D1I6uYLInJ=oCfWPNtn[tTiLa0xf]
   op=(((D1I6uYLInJ[YiJAetmDHV]-ezfY3GmQ)+65536)%65536)
   ezfY3GmQ=(ezfY3GmQ+I6Y8wdiVvw+math.floor(ezfY3GmQ/8))%65536
   tTiLa0xf=tTiLa0xf+1
   if op<=32 then
   if op<=18 then
   if op<=15 then
   if op<=9 then
   if op<=7 then
   if op<=2 then
   if op<=1 then
   if op<=0 then
   if op==(0-0) and ((7*ZaIx75aJj9*ZaIx75aJj9)+ZaIx75aJj9)%2==0 then
   local WlLqrWun=OmuT6a2[sGTgJARQ]
   OmuT6a2[sGTgJARQ]=OmuT6a2[sGTgJARQ-1]
   OmuT6a2[sGTgJARQ-1]=WlLqrWun
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1*4/4) and ((ZaIx75aJj9*ZaIx75aJj9+ZaIx75aJj9)%2)==0 then
   OmuT6a2[sGTgJARQ-1]=OmuT6a2[sGTgJARQ-1][OmuT6a2[sGTgJARQ]]
   sGTgJARQ=sGTgJARQ-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(2-0) then
   do
   local WlLqrWun=OmuT6a2[sGTgJARQ]
   OmuT6a2[sGTgJARQ]=OmuT6a2[sGTgJARQ-1] % WlLqrWun
   sGTgJARQ=sGTgJARQ-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=5 then
   if op<=3 then
   if op==((3+256)-256) and (((n7uqSd3uPRl*n7uqSd3uPRl)-n7uqSd3uPRl)%2)==0 then
   local WlLqrWun=OmuT6a2[sGTgJARQ]
   OmuT6a2[sGTgJARQ]=OmuT6a2[sGTgJARQ-1]
   OmuT6a2[sGTgJARQ-1]=WlLqrWun
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=4 then
   if op==(4+20-20) then
   nPCdtHZRqtT[D1I6uYLInJ[rLoZAAd]].v=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(5+36-36) then
   do
   local hO_97YPPi,hPPyP3=D1I6uYLInJ[rLoZAAd],D1I6uYLInJ[lbQltAj]
   KTyH5BVE46B=hO_97YPPi<0 and (JaMZIljXmAt<0 and 0 or JaMZIljXmAt) or hO_97YPPi
   LNFWaLvVL8K=0
   mG_OGwkFIn=sGTgJARQ-KTyH5BVE46B-1-LNFWaLvVL8K
   MdW9a3=OmuT6a2[mG_OGwkFIn]
   local NIQBFg_9F
   if type(MdW9a3)=='table' and MdW9a3.pid then
   local fnORljG={n=KTyH5BVE46B}
   for U7iGOwmMmQ=1,KTyH5BVE46B do fnORljG[U7iGOwmMmQ]=OmuT6a2[mG_OGwkFIn+LNFWaLvVL8K+U7iGOwmMmQ] end
   NIQBFg_9F=qSUAU9W(MdW9a3.pid,MdW9a3.env,MdW9a3.uv,fnORljG,Wn96HERUN)
   else
   NIQBFg_9F=O5UJkOqrsR(MdW9a3(PYQiOw7(OmuT6a2,mG_OGwkFIn+1+LNFWaLvVL8K,sGTgJARQ)))
   end
   if hPPyP3==0 then
   sGTgJARQ=mG_OGwkFIn-1
   JaMZIljXmAt=-1
   elseif hPPyP3==-1 then
   osqQJYYMdW=NIQBFg_9F.n
   for U7iGOwmMmQ=1,osqQJYYMdW do OmuT6a2[mG_OGwkFIn+U7iGOwmMmQ-1]=NIQBFg_9F[U7iGOwmMmQ] end
   sGTgJARQ=mG_OGwkFIn+osqQJYYMdW-1
   JaMZIljXmAt=osqQJYYMdW
   else
   for U7iGOwmMmQ=1,hPPyP3 do OmuT6a2[mG_OGwkFIn+U7iGOwmMmQ-1]=NIQBFg_9F[U7iGOwmMmQ] end
   sGTgJARQ=mG_OGwkFIn+hPPyP3-1
   JaMZIljXmAt=-1
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=6 then
   if op==(6*4/4) and ((7*ZaIx75aJj9*ZaIx75aJj9)+ZaIx75aJj9)%2==0 then
   OmuT6a2[sGTgJARQ]=-OmuT6a2[sGTgJARQ]
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(7+50-50) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   do
   local QOI0mX9TIM=OmuT6a2[sGTgJARQ-1]
   OmuT6a2[sGTgJARQ-1]=QOI0mX9TIM ^ OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=8 then
   if op==(8-0) and ((n7uqSd3uPRl*n7uqSd3uPRl+n7uqSd3uPRl)%2)==0 then
   do
   local BeNsu6YUZBr=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   if BeNsu6YUZBr then tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi]) end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(9+59-59) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   sGTgJARQ=sGTgJARQ-D1I6uYLInJ[rLoZAAd]
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=11 then
   if op<=10 then
   if op==(10+32-32) and ((7*ZaIx75aJj9*ZaIx75aJj9)+ZaIx75aJj9)%2==0 then
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=TZZJJI[RmEu1X(IPFs0YIoh5,XlN0uXG[D1I6uYLInJ[rLoZAAd]])]
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(11+65-65) then
   do
   local hO_97YPPi=D1I6uYLInJ[rLoZAAd]
   if hO_97YPPi<0 then
   local r9pvHbnqNh=H9W8XzH.n or #H9W8XzH
   for U7iGOwmMmQ=1,r9pvHbnqNh do sGTgJARQ=sGTgJARQ+1 OmuT6a2[sGTgJARQ]=H9W8XzH[U7iGOwmMmQ] end
   JaMZIljXmAt=r9pvHbnqNh
   else
   for U7iGOwmMmQ=1,hO_97YPPi do sGTgJARQ=sGTgJARQ+1 OmuT6a2[sGTgJARQ]=H9W8XzH[U7iGOwmMmQ] end
   JaMZIljXmAt=-1
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=14 then
   if op<=13 then
   if op<=12 then
   if op==((12+256)-256) and ((ZaIx75aJj9*ZaIx75aJj9+ZaIx75aJj9)%2)==0 then
   do
   local OvpLNIR1=D1I6uYLInJ[rLoZAAd]
   local diLE_p7QZI=OmuT6a2[sGTgJARQ-OvpLNIR1+1]
   for U7iGOwmMmQ=sGTgJARQ-OvpLNIR1+2,sGTgJARQ do diLE_p7QZI=diLE_p7QZI..OmuT6a2[U7iGOwmMmQ] end
   sGTgJARQ=sGTgJARQ-OvpLNIR1+1
   OmuT6a2[sGTgJARQ]=diLE_p7QZI
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((13+256)-256) and (((n7uqSd3uPRl*n7uqSd3uPRl)-n7uqSd3uPRl)%2)==0 then
   do
   local JEbnogRdMcg=OmuT6a2[sGTgJARQ]
   local QOI0mX9TIM=OmuT6a2[sGTgJARQ-1]
   sGTgJARQ=sGTgJARQ-1
   OmuT6a2[sGTgJARQ]=QOI0mX9TIM - JEbnogRdMcg
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(14+93-93) then
   do
   local gwjP42q5DCY=D1I6uYLInJ[rLoZAAd]
   local jbJGLE=OmuT6a2[sGTgJARQ]
   local fDeW5Po1ahH=OmuT6a2[sGTgJARQ-1]
   local Im8q57=OmuT6a2[sGTgJARQ-2]
   sGTgJARQ=sGTgJARQ-3
   nPCdtHZRqtT[gwjP42q5DCY]={v=Im8q57}
   nPCdtHZRqtT[gwjP42q5DCY+1].v=Im8q57
   nPCdtHZRqtT[gwjP42q5DCY+2].v=fDeW5Po1ahH
   nPCdtHZRqtT[gwjP42q5DCY+3].v=jbJGLE
   if (jbJGLE>0 and Im8q57>fDeW5Po1ahH) or (jbJGLE<0 and Im8q57<fDeW5Po1ahH) then tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi]) end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(15-0) then
   do
   local hO_97YPPi=D1I6uYLInJ[rLoZAAd]
   if hO_97YPPi>=0 then
   local WlLqrWun=OmuT6a2[sGTgJARQ-hO_97YPPi-1]
   local OvpLNIR1=PMdF_E[WlLqrWun] or 0
   for U7iGOwmMmQ=1,hO_97YPPi do WlLqrWun[OvpLNIR1+U7iGOwmMmQ]=OmuT6a2[sGTgJARQ-hO_97YPPi+U7iGOwmMmQ] end
   PMdF_E[WlLqrWun]=OvpLNIR1+hO_97YPPi
   sGTgJARQ=sGTgJARQ-hO_97YPPi-1
   else
   local Iwga2HYKiV=(-hO_97YPPi)-1
   local WJhy1s=JaMZIljXmAt<0 and 0 or JaMZIljXmAt
   local VvZFpHK=Iwga2HYKiV+WJhy1s
   local ny66eO6=sGTgJARQ-VvZFpHK
   local WlLqrWun=OmuT6a2[ny66eO6-1]
   local OvpLNIR1=PMdF_E[WlLqrWun] or 0
   for U7iGOwmMmQ=1,VvZFpHK do WlLqrWun[OvpLNIR1+U7iGOwmMmQ]=OmuT6a2[ny66eO6+U7iGOwmMmQ-1] end
   PMdF_E[WlLqrWun]=OvpLNIR1+VvZFpHK
   JaMZIljXmAt=-1
   sGTgJARQ=ny66eO6-1
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=16 then
   if op==(16-0) then
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=false
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=17 then
   if op==(17*4/4) then
   OmuT6a2[sGTgJARQ+1]=nPCdtHZRqtT[D1I6uYLInJ[rLoZAAd]].v
   sGTgJARQ=sGTgJARQ+1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(18-0) and ((n7uqSd3uPRl*n7uqSd3uPRl+n7uqSd3uPRl)%2)==0 then
   error("|]A^ZQ&{%^[<{^X?!%%[%$&Z>[#Z".."::ESCAPE-OP="..tostring(op))
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=28 then
   if op<=24 then
   if op<=23 then
   if op<=22 then
   if op<=20 then
   if op<=19 then
   if op==(19+89-89) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   do
   local dUO5FaB=D1I6uYLInJ[mBjeU_DPXh]
   local Ud2fiq52MbT=dUO5FaB<0 and ((-dUO5FaB-1)+(JaMZIljXmAt<0 and 0 or JaMZIljXmAt)) or dUO5FaB
   local hO_97YPPi=D1I6uYLInJ[rLoZAAd]
   if Ud2fiq52MbT>hO_97YPPi then
   sGTgJARQ=sGTgJARQ-Ud2fiq52MbT+hO_97YPPi
   elseif Ud2fiq52MbT<hO_97YPPi then
   while Ud2fiq52MbT<hO_97YPPi do sGTgJARQ=sGTgJARQ+1 OmuT6a2[sGTgJARQ]=nil Ud2fiq52MbT=Ud2fiq52MbT+1 end
   end
   JaMZIljXmAt=-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((20+256)-256) and (((n7uqSd3uPRl*n7uqSd3uPRl)-n7uqSd3uPRl)%2)==0 then
   OmuT6a2[sGTgJARQ-1]=OmuT6a2[sGTgJARQ-1]<=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=21 then
   if op==(21*4/4) then
   do
   local JEbnogRdMcg=OmuT6a2[sGTgJARQ]
   local QOI0mX9TIM=OmuT6a2[sGTgJARQ-1]
   sGTgJARQ=sGTgJARQ-1
   OmuT6a2[sGTgJARQ]=QOI0mX9TIM==JEbnogRdMcg
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((22+256)-256) and (((ZaIx75aJj9*ZaIx75aJj9)-ZaIx75aJj9)%2)==0 then
   do
   local hO_97YPPi=D1I6uYLInJ[rLoZAAd]
   local ny66eO6=sGTgJARQ-2*hO_97YPPi
   for U7iGOwmMmQ=1,hO_97YPPi do
   local ueMnmi=OmuT6a2[ny66eO6+2*U7iGOwmMmQ-2]
   local WlLqrWun=OmuT6a2[ny66eO6+2*U7iGOwmMmQ-1]
   local BeNsu6YUZBr=OmuT6a2[ny66eO6+2*hO_97YPPi+U7iGOwmMmQ-1]
   if WlLqrWun==TZZJJI then TZZJJI[ueMnmi]=BeNsu6YUZBr else WlLqrWun[ueMnmi]=BeNsu6YUZBr end
   end
   sGTgJARQ=ny66eO6-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(23+51-51) and ((ZaIx75aJj9*ZaIx75aJj9+ZaIx75aJj9)%2)==0 then
   do
   local BeNsu6YUZBr=OmuT6a2[sGTgJARQ] local ueMnmi=OmuT6a2[sGTgJARQ-1] local WlLqrWun=OmuT6a2[sGTgJARQ-D1I6uYLInJ[rLoZAAd]]
   WlLqrWun[ueMnmi]=BeNsu6YUZBr
   sGTgJARQ=sGTgJARQ-2
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(24-0) and ((ZaIx75aJj9*ZaIx75aJj9+ZaIx75aJj9)%2)==0 then
   OmuT6a2[sGTgJARQ+1]=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ+1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=25 then
   if op==(25-0) then
   do
   local hO_97YPPi,hPPyP3=D1I6uYLInJ[rLoZAAd],D1I6uYLInJ[lbQltAj]
   KTyH5BVE46B=hO_97YPPi<0 and (JaMZIljXmAt<0 and 0 or JaMZIljXmAt) or hO_97YPPi
   LNFWaLvVL8K=1
   mG_OGwkFIn=sGTgJARQ-KTyH5BVE46B-1-LNFWaLvVL8K
   MdW9a3=OmuT6a2[mG_OGwkFIn]
   local NIQBFg_9F
   if type(MdW9a3)=='table' and MdW9a3.pid then
   local fnORljG={n=KTyH5BVE46B}
   for U7iGOwmMmQ=1,KTyH5BVE46B do fnORljG[U7iGOwmMmQ]=OmuT6a2[mG_OGwkFIn+LNFWaLvVL8K+U7iGOwmMmQ] end
   NIQBFg_9F=qSUAU9W(MdW9a3.pid,MdW9a3.env,MdW9a3.uv,fnORljG,Wn96HERUN)
   else
   NIQBFg_9F=O5UJkOqrsR(MdW9a3(PYQiOw7(OmuT6a2,mG_OGwkFIn+1+LNFWaLvVL8K,sGTgJARQ)))
   end
   if hPPyP3==0 then
   sGTgJARQ=mG_OGwkFIn-1
   JaMZIljXmAt=-1
   elseif hPPyP3==-1 then
   osqQJYYMdW=NIQBFg_9F.n
   for U7iGOwmMmQ=1,osqQJYYMdW do OmuT6a2[mG_OGwkFIn+U7iGOwmMmQ-1]=NIQBFg_9F[U7iGOwmMmQ] end
   sGTgJARQ=mG_OGwkFIn+osqQJYYMdW-1
   JaMZIljXmAt=osqQJYYMdW
   else
   for U7iGOwmMmQ=1,hPPyP3 do OmuT6a2[mG_OGwkFIn+U7iGOwmMmQ-1]=NIQBFg_9F[U7iGOwmMmQ] end
   sGTgJARQ=mG_OGwkFIn+hPPyP3-1
   JaMZIljXmAt=-1
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=26 then
   if op==((26+256)-256) then
   do
   local ny66eO6,r9pvHbnqNh=D1I6uYLInJ[rLoZAAd],D1I6uYLInJ[lbQltAj]
   local v7Y80ekFzgD=sGTgJARQ-r9pvHbnqNh
   for U7iGOwmMmQ=1,r9pvHbnqNh do nPCdtHZRqtT[ny66eO6+U7iGOwmMmQ-1].v=OmuT6a2[v7Y80ekFzgD+U7iGOwmMmQ] end
   sGTgJARQ=v7Y80ekFzgD
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=27 then
   if op==(27-0) then
   do
   local QOI0mX9TIM=OmuT6a2[sGTgJARQ-1]
   OmuT6a2[sGTgJARQ-1]=QOI0mX9TIM + OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(28*4/4) then
   do
   local gwjP42q5DCY=D1I6uYLInJ[rLoZAAd]
   local l5cDUg=D1I6uYLInJ[mBjeU_DPXh]
   local ne5_PVhtm=O5UJkOqrsR(nPCdtHZRqtT[gwjP42q5DCY].v(nPCdtHZRqtT[gwjP42q5DCY+1].v,nPCdtHZRqtT[gwjP42q5DCY+2].v))
   if ne5_PVhtm[1]~=nil then
   tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi])
   nPCdtHZRqtT[gwjP42q5DCY+2].v=ne5_PVhtm[1]
   for U7iGOwmMmQ=1,l5cDUg do nPCdtHZRqtT[gwjP42q5DCY+2+U7iGOwmMmQ]={v=ne5_PVhtm[U7iGOwmMmQ]} end
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=29 then
   if op==(29-0) then
   OmuT6a2[sGTgJARQ]=not OmuT6a2[sGTgJARQ]
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=30 then
   if op==((30+256)-256) then
   hbjz_q[D1I6uYLInJ[rLoZAAd]].v=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=31 then
   if op==(31-0) and ((n7uqSd3uPRl*n7uqSd3uPRl+n7uqSd3uPRl)%2)==0 then
   do
   local gwjP42q5DCY=D1I6uYLInJ[rLoZAAd]
   local l5cDUg=D1I6uYLInJ[mBjeU_DPXh]
   local XmzBkvfRL=OmuT6a2[sGTgJARQ] local Cjctw3=OmuT6a2[sGTgJARQ-1] local ZcjtXL=OmuT6a2[sGTgJARQ-2]
   sGTgJARQ=sGTgJARQ-3
   nPCdtHZRqtT[gwjP42q5DCY].v=ZcjtXL
   nPCdtHZRqtT[gwjP42q5DCY+1].v=Cjctw3
   nPCdtHZRqtT[gwjP42q5DCY+2].v=XmzBkvfRL
   local ne5_PVhtm=O5UJkOqrsR(nPCdtHZRqtT[gwjP42q5DCY].v(nPCdtHZRqtT[gwjP42q5DCY+1].v,nPCdtHZRqtT[gwjP42q5DCY+2].v))
   if ne5_PVhtm[1]==nil then
   tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi])
   else
   nPCdtHZRqtT[gwjP42q5DCY+2].v=ne5_PVhtm[1]
   for U7iGOwmMmQ=1,l5cDUg do nPCdtHZRqtT[gwjP42q5DCY+2+U7iGOwmMmQ]={v=ne5_PVhtm[U7iGOwmMmQ]} end
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(32-0) then
   TZZJJI[RmEu1X(IPFs0YIoh5,XlN0uXG[D1I6uYLInJ[rLoZAAd]])]=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
   else
   if op<=48 then
   if op<=37 then
   if op<=34 then
   if op<=33 then
   if op==(33+69-69) then
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=nil
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(34-0) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=TZZJJI
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=35 then
   if op==(35*4/4) then
   do
   local JEbnogRdMcg=OmuT6a2[sGTgJARQ]
   local QOI0mX9TIM=OmuT6a2[sGTgJARQ-1]
   sGTgJARQ=sGTgJARQ-1
   OmuT6a2[sGTgJARQ]=QOI0mX9TIM<JEbnogRdMcg
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=36 then
   if op==(36-0) then
   do
   local WlLqrWun=OmuT6a2[sGTgJARQ]
   OmuT6a2[sGTgJARQ]=OmuT6a2[sGTgJARQ-1] * WlLqrWun
   sGTgJARQ=sGTgJARQ-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((37+256)-256) then
   do end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=45 then
   if op<=40 then
   if op<=38 then
   if op==(38+95-95) then
   do
   if not OmuT6a2[sGTgJARQ] then tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi]) end
   sGTgJARQ=sGTgJARQ-1
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=39 then
   if op==((39+256)-256) then
   tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi])
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(40-0) then
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=hbjz_q[D1I6uYLInJ[rLoZAAd]].v
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=43 then
   if op<=41 then
   if op==(41*4/4) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   do
   local BeNsu6YUZBr=OmuT6a2[sGTgJARQ] local ueMnmi=OmuT6a2[sGTgJARQ-1] local WlLqrWun=OmuT6a2[sGTgJARQ-2]
   WlLqrWun[ueMnmi]=BeNsu6YUZBr
   sGTgJARQ=sGTgJARQ-3
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=42 then
   if op==(42-0) and ((ZaIx75aJj9*ZaIx75aJj9+ZaIx75aJj9)%2)==0 then
   if JaMZIljXmAt>1 then sGTgJARQ=sGTgJARQ-JaMZIljXmAt+1 end
   JaMZIljXmAt=-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((43+256)-256) then
   OmuT6a2[sGTgJARQ]=#OmuT6a2[sGTgJARQ]
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=44 then
   if op==(44*4/4) and ((n7uqSd3uPRl*n7uqSd3uPRl+n7uqSd3uPRl)%2)==0 then
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=true
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(45*4/4) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   do
   local hO_97YPPi=D1I6uYLInJ[rLoZAAd]
   local NIQBFg_9F={n=0}
   if hO_97YPPi<0 then
   local r9pvHbnqNh=JaMZIljXmAt<0 and 0 or JaMZIljXmAt
   NIQBFg_9F.n=r9pvHbnqNh
   local Im8q57=sGTgJARQ-r9pvHbnqNh+1
   for U7iGOwmMmQ=1,r9pvHbnqNh do NIQBFg_9F[U7iGOwmMmQ]=OmuT6a2[Im8q57+U7iGOwmMmQ-1] end
   else
   NIQBFg_9F.n=hO_97YPPi
   for U7iGOwmMmQ=1,hO_97YPPi do NIQBFg_9F[U7iGOwmMmQ]=OmuT6a2[sGTgJARQ-hO_97YPPi+U7iGOwmMmQ] end
   end
   return NIQBFg_9F
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=46 then
   if op==(46-0) then
   sGTgJARQ=sGTgJARQ+1
   local WlLqrWun={}
   PMdF_E[WlLqrWun]=0
   OmuT6a2[sGTgJARQ]=WlLqrWun
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=47 then
   if op==(47+38-38) then
   do
   local gwjP42q5DCY=D1I6uYLInJ[rLoZAAd]
   local l5cDUg=nPCdtHZRqtT[gwjP42q5DCY].v+nPCdtHZRqtT[gwjP42q5DCY+3].v
   local fDeW5Po1ahH=nPCdtHZRqtT[gwjP42q5DCY+2].v
   local jbJGLE=nPCdtHZRqtT[gwjP42q5DCY+3].v
   if (jbJGLE>0 and l5cDUg<=fDeW5Po1ahH) or (jbJGLE<0 and l5cDUg>=fDeW5Po1ahH) then
   nPCdtHZRqtT[gwjP42q5DCY]={v=l5cDUg}
   nPCdtHZRqtT[gwjP42q5DCY+1].v=l5cDUg
   tTiLa0xf=tTiLa0xf+(D1I6uYLInJ[lbQltAj]+D1I6uYLInJ[fYSrcaJ4Mi])
   end
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(48*4/4) and ((n7uqSd3uPRl*n7uqSd3uPRl+n7uqSd3uPRl)%2)==0 then
   local BeNsu6YUZBr=RmEu1X(IPFs0YIoh5,XlN0uXG[D1I6uYLInJ[rLoZAAd]])
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]=BeNsu6YUZBr
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=50 then
   if op<=49 then
   if op==(49-0) and ((n7uqSd3uPRl*n7uqSd3uPRl+n7uqSd3uPRl)%2)==0 then
   do
   local s32fO4NB=D1I6uYLInJ[rLoZAAd]
   local QLk2NTjU=J876nh[s32fO4NB]
   local dEXyhcIC={}
   for U7iGOwmMmQ=1,#QLk2NTjU.uv do
   local m0Hx6X=QLk2NTjU.uv[U7iGOwmMmQ]
   if m0Hx6X[1]==1 then dEXyhcIC[U7iGOwmMmQ]=nPCdtHZRqtT[m0Hx6X[2]] else dEXyhcIC[U7iGOwmMmQ]=hbjz_q[m0Hx6X[2]] end
   end
   sGTgJARQ=sGTgJARQ+1
   OmuT6a2[sGTgJARQ]={pid=s32fO4NB,env=TZZJJI,uv=dEXyhcIC}
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(50*4/4) and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   do
   local JEbnogRdMcg=OmuT6a2[sGTgJARQ]
   local QOI0mX9TIM=OmuT6a2[sGTgJARQ-1]
   sGTgJARQ=sGTgJARQ-1
   OmuT6a2[sGTgJARQ]=QOI0mX9TIM / JEbnogRdMcg
   end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=100 then
   if op==100 and ((ZaIx75aJj9*ZaIx75aJj9+ZaIx75aJj9)%2)==0 then
   do local _d=1+1 OmuT6a2[sGTgJARQ]=OmuT6a2[sGTgJARQ] end
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 and ((7*n7uqSd3uPRl*n7uqSd3uPRl)+n7uqSd3uPRl)%2==0 then
   OmuT6a2[sGTgJARQ+1]=OmuT6a2[sGTgJARQ]
   sGTgJARQ=sGTgJARQ+1
   sGTgJARQ=sGTgJARQ-1
   else
   error("*~{*Z&A~%Z]>Q}|A@$#[*<|@<!Q~".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
  end
 end
 local jL3oLLWNS=O5UJkOqrsR(...)
 return qSUAU9W(qSUAU9W_decode(),1,QGFmszKI,{},jL3oLLWNS,nil)
end)(KdA4jgGOp)