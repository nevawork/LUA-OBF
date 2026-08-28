-- NEVAHEX-VM v3 'Hex' — protected artifact — {Z[{|]A$&AZ~() runs it

return (function(hHN45_w, ...)
 local dvJCfacVwd=setmetatable({},{__mode="k"})
 local function GV6bXrE1nwN(...) local n=select('#',...) return {n=n,...} end
 local QuDl700LQz=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function MXTOKQwz(t,i,j)
  if i>j then return end
  if QuDl700LQz and j-i>15 then return QuDl700LQz(t,i,j) end
  return t[i],MXTOKQwz(t,i+1,j)
 end
 local KOgcMP=_G.string.char
 local fdjzU1=_G.table.concat
 local nDw2f_hsc,g0XnxShN,BJbGgThG5Zq,U8BB4nWZM8,zqeCqBRu7Qc,wiwfeOXw,DB0jt6,rjcgdI,IWG5WMfOu,csYhqkKyZdE,ufgD1vOWz,OgrIPrx_XB
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then hrLnle9sQ=true q_9dsUQgse=9999 end debug.sethook() end
 local ZyGGUHh=(567483*4/4) wdCMBR=((42081+256)-256) dtvktPdT=(342179-0) fjM9UgGK=((560428+256)-256) zDwJIjdTIiq=(492825*4/4)
 local E07fXm1=(31381-0) W8m37tn=(1076809*4/4) nEOsNPikvZ=(1236585*4/4) Lwd82RLEuY=(123579*4/4)
 local oyODfYy=((286797812+256)-256) _G.__CK0=tostring(oyODfYy)
 local TQvyAVw=0 v8Dgrm8qDrH=0
 local function zRzBo93tu95(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((oyODfYy+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=KOgcMP(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=fdjzU1(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local YMIRhi1571i="\197\169R\252\246sod\243i\162\161\187\\3\020d[\\\189\014\140A\193;\235\243\193f\027\231\162\217q\009\181\130z\202\209\158\234\175\154,?\012N\233d\138\242\208\232\008\0154\209\039M\224\002C\244\146.\226\2223\234\030\011\231\251\248\016\231\134T|\234\192\211pt0q\251h?O\153f\005\203\153\234\024\237g\2336\005\184\145,y3\130\218\205\140\158\241\213\220=m\152o;\143\183j\0110\181\211\254\205|d\185d\155"
 local function Ky__hfFPl_decode()
  local D={} local bn=#YMIRhi1571i
  if bn>4194304 then error("*~]~|ZQ%X]>~@|&^&>$#A?>]Q$?Q") end
  local sa=((45360982+256)-256) sb=((1930380043+256)-256) MM=2147483647
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(YMIRhi1571i,i)-pv+256)%256
  end
  local XBQDkHuu=1
  local function pdHJ6vXVqrO() local bt=D[XBQDkHuu] XBQDkHuu=XBQDkHuu+1 return bt end
  local function QmKPRoKkQS()
   local sh,r=0,0
   while true do
    local bt=pdHJ6vXVqrO()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function e5imnJwe()
   local u=QmKPRoKkQS()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local TU7A_awTdUM=pdHJ6vXVqrO()
  if TU7A_awTdUM<128 then error("A~&<*]&[*^||$^&#[X!![A#|!^X[") end
  for i=1,TU7A_awTdUM-128 do pdHJ6vXVqrO() end
  local vUVR1pc=QmKPRoKkQS()
  print("DECODE np=", vUVR1pc)
  if vUVR1pc>4096 then error("<[{^Z}]|*{&*&A|$}!X*>[A*|!>*") end
  local mB0x4Cu={} local YQA95ri={}
  for oN9GIDt=1,vUVR1pc do
   local pr={}
   pr.pn=pdHJ6vXVqrO()
   pr.va=pdHJ6vXVqrO()==1
   local nu=QmKPRoKkQS()
   pr.uv={}
   for i=1,nu do pr.uv[i]={pdHJ6vXVqrO()==1 and 1 or 0,QmKPRoKkQS()} end
   pr.ns=QmKPRoKkQS()
   QmKPRoKkQS() QmKPRoKkQS() QmKPRoKkQS() QmKPRoKkQS() QmKPRoKkQS()
   local nc=QmKPRoKkQS()
   if nc>65536 then error("~$AQ>~^*?>$[!?}<^>%*[|]A[]@|") end
   pr.c={}
   for i=1,nc do
    local tag=pdHJ6vXVqrO()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=QmKPRoKkQS()
     local bb={}
     for j=1,ln do XBQDkHuu=XBQDkHuu+1 bb[j]=D[XBQDkHuu-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=QmKPRoKkQS()
   print("DECODE pid=", oN9GIDt, "nk=", nk)
   if nk>262144 then error("$[X#Q@>#^~$!#}*[}^&ZZ^Q?%XQ]") end
   pr.k={}
   local lrk=(E07fXm1+oN9GIDt*W8m37tn+oN9GIDt*oN9GIDt*nEOsNPikvZ)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=QmKPRoKkQS()
    local aw=e5imnJwe()-mm
    local b1w=e5imnJwe()-mm
    local b2w=e5imnJwe()+mm
    local cw=e5imnJwe()-mm
    lrk=(lrk+Lwd82RLEuY+math.floor(lrk/8))%65536
    pr.k[i]={[ZyGGUHh]=oe,[wdCMBR]=aw,[dtvktPdT]=b1w,[fjM9UgGK]=b2w,[zDwJIjdTIiq]=cw}
   end
   mB0x4Cu[oN9GIDt]=pr
  end
  local wln=QmKPRoKkQS()
  local wa=(1276081572+41-41) wb=((322448507+256)-256) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   YQA95ri[i]=(D[XBQDkHuu]-pv2+256)%256
   XBQDkHuu=XBQDkHuu+1
  end
  local GpuuMlRtkuu=#YQA95ri
  if GpuuMlRtkuu<1 then GpuuMlRtkuu=1 YQA95ri[1]=0 end
  return {P=mB0x4Cu,WM=YQA95ri,WMI=GpuuMlRtkuu}
 end
 local QpERQj=0
 local jixtbPy50U={} local WRNT7aX_={}
 local function Ky__hfFPl(l1,LDSh4C2U,ipEJ6IC_GO,obw0I1kxiwY,XzuYDdmY,qwUqolkpi)
  local mB0x4Cu,YQA95ri,GpuuMlRtkuu=l1.P,l1.WM,l1.WMI
  local sM03uozcjQD=mB0x4Cu[LDSh4C2U]
  local ergeoqVf6X=sM03uozcjQD.k
  local o3AG3rRdG_9=sM03uozcjQD.c
  local xIlzJptD={}
  local LLbC5OFrr={}
  for pWp6FBE2=1,sM03uozcjQD.ns do LLbC5OFrr[pWp6FBE2]={} end
  local bqW4H8u,hPY4Yla,NEDCHU3=0,-1,1
  local St6a3fsfK=XzuYDdmY
  for pWp6FBE2=1,sM03uozcjQD.pn do LLbC5OFrr[pWp6FBE2].v=XzuYDdmY[pWp6FBE2] end
  local hHCSzSvlIP,ARoKP_=37,1
  local hrLnle9sQ,q_9dsUQgse,wvRnIf1Q=false,0,0
  local Ur9iZY35t=(E07fXm1+LDSh4C2U*W8m37tn+LDSh4C2U*LDSh4C2U*nEOsNPikvZ)%65536
  local bRUfpDu7T,cnOLR70P,jf2bfNgp,WpfjAGrKDGr,dkVvSqx5w
  local i64N0t,op
  while true do
   local KXvulQPYD=((48496*4/4)+LDSh4C2U*7919)%65536
   if KXvulQPYD<256 then local _nop=1+1 end
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then hrLnle9sQ=true q_9dsUQgse=1 end end
   i64N0t=ergeoqVf6X[NEDCHU3]
   if NEDCHU3<=6 then print("TRC PC="..tostring(NEDCHU3).." RK="..tostring(Ur9iZY35t).." OE="..tostring(i64N0t[ZyGGUHh]).." OP="..tostring(op).." A="..tostring(i64N0t[wdCMBR]).." B="..tostring(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK]).." C="..tostring(i64N0t[zDwJIjdTIiq])) end
   i64N0t=ergeoqVf6X[NEDCHU3]
   op=(((i64N0t[ZyGGUHh]-Ur9iZY35t)+65536)%65536)
   Ur9iZY35t=(Ur9iZY35t+Lwd82RLEuY+math.floor(Ur9iZY35t/8))%65536
   NEDCHU3=NEDCHU3+1
   if op<=28 then
   if op<=12 then
   if op<=6 then
   if op<=2 then
   if op<=1 then
   if op<=0 then
   if op==(0-0) and ((hHCSzSvlIP*hHCSzSvlIP+hHCSzSvlIP)%2)==0 then
   if hPY4Yla>1 then bqW4H8u=bqW4H8u-hPY4Yla+1 end
   hPY4Yla=-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1+38-38) and ((7*wvRnIf1Q*wvRnIf1Q)+wvRnIf1Q)%2==0 then
   do
   local uwoxc7=xIlzJptD[bqW4H8u] local dEKSFKi5n=xIlzJptD[bqW4H8u-1] local kL3PNO0YZ=xIlzJptD[bqW4H8u-2]
   kL3PNO0YZ[dEKSFKi5n]=uwoxc7
   bqW4H8u=bqW4H8u-3
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(2-0) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   do
   local Zpqu5a=xIlzJptD[bqW4H8u]
   local nXlYyj1gF=xIlzJptD[bqW4H8u-1]
   bqW4H8u=bqW4H8u-1
   xIlzJptD[bqW4H8u]=nXlYyj1gF / Zpqu5a
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=3 then
   if op==(3+30-30) and ((7*wvRnIf1Q*wvRnIf1Q)+wvRnIf1Q)%2==0 then
   do end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=5 then
   if op<=4 then
   if op==(4-0) and ((7*wvRnIf1Q*wvRnIf1Q)+wvRnIf1Q)%2==0 then
   do
   local uwoxc7=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   if uwoxc7 then NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK]) end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((5+256)-256) and (((hHCSzSvlIP*hHCSzSvlIP)-hHCSzSvlIP)%2)==0 then
   LLbC5OFrr[i64N0t[wdCMBR]].v=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(6-0) and ((hHCSzSvlIP*hHCSzSvlIP+hHCSzSvlIP)%2)==0 then
   do
   local TBKFIP0WX,HXDaI19iP=i64N0t[wdCMBR],i64N0t[dtvktPdT]
   cnOLR70P=TBKFIP0WX<0 and (hPY4Yla<0 and 0 or hPY4Yla) or TBKFIP0WX
   jf2bfNgp=0
   WpfjAGrKDGr=bqW4H8u-cnOLR70P-1-jf2bfNgp
   dkVvSqx5w=xIlzJptD[WpfjAGrKDGr]
   local ULI7hf77W4p
   if type(dkVvSqx5w)=='table' and dkVvSqx5w.pid then
   local gIOltS={n=cnOLR70P}
   for pWp6FBE2=1,cnOLR70P do gIOltS[pWp6FBE2]=xIlzJptD[WpfjAGrKDGr+jf2bfNgp+pWp6FBE2] end
   ULI7hf77W4p=Ky__hfFPl(dkVvSqx5w.pid,dkVvSqx5w.env,dkVvSqx5w.uv,gIOltS,qwUqolkpi)
   else
   ULI7hf77W4p=GV6bXrE1nwN(dkVvSqx5w(MXTOKQwz(xIlzJptD,WpfjAGrKDGr+1+jf2bfNgp,bqW4H8u)))
   end
   if HXDaI19iP==0 then
   bqW4H8u=WpfjAGrKDGr-1
   hPY4Yla=-1
   elseif HXDaI19iP==-1 then
   bRUfpDu7T=ULI7hf77W4p.n
   for pWp6FBE2=1,bRUfpDu7T do xIlzJptD[WpfjAGrKDGr+pWp6FBE2-1]=ULI7hf77W4p[pWp6FBE2] end
   bqW4H8u=WpfjAGrKDGr+bRUfpDu7T-1
   hPY4Yla=bRUfpDu7T
   else
   for pWp6FBE2=1,HXDaI19iP do xIlzJptD[WpfjAGrKDGr+pWp6FBE2-1]=ULI7hf77W4p[pWp6FBE2] end
   bqW4H8u=WpfjAGrKDGr+HXDaI19iP-1
   hPY4Yla=-1
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=10 then
   if op<=9 then
   if op<=7 then
   if op==(7*4/4) and (((hHCSzSvlIP*hHCSzSvlIP)-hHCSzSvlIP)%2)==0 then
   do
   local kL3PNO0YZ=xIlzJptD[bqW4H8u]
   xIlzJptD[bqW4H8u]=xIlzJptD[bqW4H8u-1] * kL3PNO0YZ
   bqW4H8u=bqW4H8u-1
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=8 then
   if op==(8*4/4) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   do
   local js1RWLajk=i64N0t[wdCMBR]
   local ILvTSe=i64N0t[zDwJIjdTIiq]
   local Mk6bUY_=xIlzJptD[bqW4H8u] local wo9qmBnL=xIlzJptD[bqW4H8u-1] local rpUBIB=xIlzJptD[bqW4H8u-2]
   bqW4H8u=bqW4H8u-3
   LLbC5OFrr[js1RWLajk].v=rpUBIB
   LLbC5OFrr[js1RWLajk+1].v=wo9qmBnL
   LLbC5OFrr[js1RWLajk+2].v=Mk6bUY_
   local RMNS_E=GV6bXrE1nwN(LLbC5OFrr[js1RWLajk].v(LLbC5OFrr[js1RWLajk+1].v,LLbC5OFrr[js1RWLajk+2].v))
   if RMNS_E[1]==nil then
   NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK])
   else
   LLbC5OFrr[js1RWLajk+2].v=RMNS_E[1]
   for pWp6FBE2=1,ILvTSe do LLbC5OFrr[js1RWLajk+2+pWp6FBE2]={v=RMNS_E[pWp6FBE2]} end
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(9*4/4) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   do
   local js1RWLajk=i64N0t[wdCMBR]
   local E8lKmiELGzR=xIlzJptD[bqW4H8u]
   local DRcq_wd=xIlzJptD[bqW4H8u-1]
   local trmsKpv5T=xIlzJptD[bqW4H8u-2]
   bqW4H8u=bqW4H8u-3
   LLbC5OFrr[js1RWLajk]={v=trmsKpv5T}
   LLbC5OFrr[js1RWLajk+1].v=trmsKpv5T
   LLbC5OFrr[js1RWLajk+2].v=DRcq_wd
   LLbC5OFrr[js1RWLajk+3].v=E8lKmiELGzR
   if (E8lKmiELGzR>0 and trmsKpv5T>DRcq_wd) or (E8lKmiELGzR<0 and trmsKpv5T<DRcq_wd) then NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK]) end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(10*4/4) then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=obw0I1kxiwY[i64N0t[wdCMBR]].v
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=11 then
   if op==((11+256)-256) then
   do
   local TBKFIP0WX,HXDaI19iP=i64N0t[wdCMBR],i64N0t[dtvktPdT]
   cnOLR70P=TBKFIP0WX<0 and (hPY4Yla<0 and 0 or hPY4Yla) or TBKFIP0WX
   jf2bfNgp=1
   WpfjAGrKDGr=bqW4H8u-cnOLR70P-1-jf2bfNgp
   dkVvSqx5w=xIlzJptD[WpfjAGrKDGr]
   local ULI7hf77W4p
   if type(dkVvSqx5w)=='table' and dkVvSqx5w.pid then
   local gIOltS={n=cnOLR70P}
   for pWp6FBE2=1,cnOLR70P do gIOltS[pWp6FBE2]=xIlzJptD[WpfjAGrKDGr+jf2bfNgp+pWp6FBE2] end
   ULI7hf77W4p=Ky__hfFPl(dkVvSqx5w.pid,dkVvSqx5w.env,dkVvSqx5w.uv,gIOltS,qwUqolkpi)
   else
   ULI7hf77W4p=GV6bXrE1nwN(dkVvSqx5w(MXTOKQwz(xIlzJptD,WpfjAGrKDGr+1+jf2bfNgp,bqW4H8u)))
   end
   if HXDaI19iP==0 then
   bqW4H8u=WpfjAGrKDGr-1
   hPY4Yla=-1
   elseif HXDaI19iP==-1 then
   bRUfpDu7T=ULI7hf77W4p.n
   for pWp6FBE2=1,bRUfpDu7T do xIlzJptD[WpfjAGrKDGr+pWp6FBE2-1]=ULI7hf77W4p[pWp6FBE2] end
   bqW4H8u=WpfjAGrKDGr+bRUfpDu7T-1
   hPY4Yla=bRUfpDu7T
   else
   for pWp6FBE2=1,HXDaI19iP do xIlzJptD[WpfjAGrKDGr+pWp6FBE2-1]=ULI7hf77W4p[pWp6FBE2] end
   bqW4H8u=WpfjAGrKDGr+HXDaI19iP-1
   hPY4Yla=-1
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((12+256)-256) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   xIlzJptD[bqW4H8u]=#xIlzJptD[bqW4H8u]
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=20 then
   if op<=17 then
   if op<=16 then
   if op<=14 then
   if op<=13 then
   if op==((13+256)-256) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   do
   local TBKFIP0WX=i64N0t[wdCMBR]
   local ULI7hf77W4p={n=0}
   if TBKFIP0WX<0 then
   local sb1E57m=hPY4Yla<0 and 0 or hPY4Yla
   ULI7hf77W4p.n=sb1E57m
   local trmsKpv5T=bqW4H8u-sb1E57m+1
   for pWp6FBE2=1,sb1E57m do ULI7hf77W4p[pWp6FBE2]=xIlzJptD[trmsKpv5T+pWp6FBE2-1] end
   else
   ULI7hf77W4p.n=TBKFIP0WX
   for pWp6FBE2=1,TBKFIP0WX do ULI7hf77W4p[pWp6FBE2]=xIlzJptD[bqW4H8u-TBKFIP0WX+pWp6FBE2] end
   end
   return ULI7hf77W4p
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(14-0) then
   xIlzJptD[bqW4H8u]=-xIlzJptD[bqW4H8u]
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=15 then
   if op==(15*4/4) then
   xIlzJptD[bqW4H8u-1]=xIlzJptD[bqW4H8u-1][xIlzJptD[bqW4H8u]]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((16+256)-256) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   do
   local kL3PNO0YZ=xIlzJptD[bqW4H8u]
   xIlzJptD[bqW4H8u]=xIlzJptD[bqW4H8u-1] ^ kL3PNO0YZ
   bqW4H8u=bqW4H8u-1
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(17-0) then
   do
   local Zpqu5a=xIlzJptD[bqW4H8u]
   local nXlYyj1gF=xIlzJptD[bqW4H8u-1]
   bqW4H8u=bqW4H8u-1
   xIlzJptD[bqW4H8u]=nXlYyj1gF % Zpqu5a
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=19 then
   if op<=18 then
   if op==(18*4/4) and ((hHCSzSvlIP*hHCSzSvlIP+hHCSzSvlIP)%2)==0 then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=nil
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(19+93-93) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   obw0I1kxiwY[i64N0t[wdCMBR]].v=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((20+256)-256) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   local uwoxc7=zRzBo93tu95(LDSh4C2U,o3AG3rRdG_9[i64N0t[wdCMBR]])
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=uwoxc7
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=25 then
   if op<=23 then
   if op<=22 then
   if op<=21 then
   if op==(21-0) and (((hHCSzSvlIP*hHCSzSvlIP)-hHCSzSvlIP)%2)==0 then
   local kL3PNO0YZ=xIlzJptD[bqW4H8u]
   xIlzJptD[bqW4H8u]=xIlzJptD[bqW4H8u-1]
   xIlzJptD[bqW4H8u-1]=kL3PNO0YZ
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22*4/4) then
   xIlzJptD[bqW4H8u]=not xIlzJptD[bqW4H8u]
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(23+78-78) and ((hHCSzSvlIP*hHCSzSvlIP+hHCSzSvlIP)%2)==0 then
   do
   local TBKFIP0WX=i64N0t[wdCMBR]
   if TBKFIP0WX>=0 then
   local kL3PNO0YZ=xIlzJptD[bqW4H8u-TBKFIP0WX-1]
   local SO29x9uID=dvJCfacVwd[kL3PNO0YZ] or 0
   for pWp6FBE2=1,TBKFIP0WX do kL3PNO0YZ[SO29x9uID+pWp6FBE2]=xIlzJptD[bqW4H8u-TBKFIP0WX+pWp6FBE2] end
   dvJCfacVwd[kL3PNO0YZ]=SO29x9uID+TBKFIP0WX
   bqW4H8u=bqW4H8u-TBKFIP0WX-1
   else
   local N0vYp2Z=(-TBKFIP0WX)-1
   local VoihIz=hPY4Yla<0 and 0 or hPY4Yla
   local vmnPbrquqY=N0vYp2Z+VoihIz
   local kGo55Rs=bqW4H8u-vmnPbrquqY
   local kL3PNO0YZ=xIlzJptD[kGo55Rs-1]
   local SO29x9uID=dvJCfacVwd[kL3PNO0YZ] or 0
   for pWp6FBE2=1,vmnPbrquqY do kL3PNO0YZ[SO29x9uID+pWp6FBE2]=xIlzJptD[kGo55Rs+pWp6FBE2-1] end
   dvJCfacVwd[kL3PNO0YZ]=SO29x9uID+vmnPbrquqY
   hPY4Yla=-1
   bqW4H8u=kGo55Rs-1
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=24 then
   if op==(24*4/4) and ((7*wvRnIf1Q*wvRnIf1Q)+wvRnIf1Q)%2==0 then
   ipEJ6IC_GO[zRzBo93tu95(LDSh4C2U,o3AG3rRdG_9[i64N0t[wdCMBR]])]=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(25+54-54) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   do
   local Zpqu5a=xIlzJptD[bqW4H8u]
   local nXlYyj1gF=xIlzJptD[bqW4H8u-1]
   bqW4H8u=bqW4H8u-1
   xIlzJptD[bqW4H8u]=nXlYyj1gF - Zpqu5a
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=27 then
   if op<=26 then
   if op==((26+256)-256) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   do
   local VxrJ2k4RpsD=i64N0t[wdCMBR]
   local o0ZzaI=mB0x4Cu[VxrJ2k4RpsD]
   local hWrlhv0={}
   for pWp6FBE2=1,#o0ZzaI.uv do
   local wcS0yqvK7=o0ZzaI.uv[pWp6FBE2]
   if wcS0yqvK7[1]==1 then hWrlhv0[pWp6FBE2]=LLbC5OFrr[wcS0yqvK7[2]] else hWrlhv0[pWp6FBE2]=obw0I1kxiwY[wcS0yqvK7[2]] end
   end
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]={pid=VxrJ2k4RpsD,env=ipEJ6IC_GO,uv=hWrlhv0}
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(27-0) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   xIlzJptD[bqW4H8u-1]=xIlzJptD[bqW4H8u-1]<=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(28-0) then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=ipEJ6IC_GO[zRzBo93tu95(LDSh4C2U,o3AG3rRdG_9[i64N0t[wdCMBR]])]
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=43 then
   if op<=39 then
   if op<=35 then
   if op<=30 then
   if op<=29 then
   if op==(29*4/4) then
   do
   local kGo55Rs,sb1E57m=i64N0t[wdCMBR],i64N0t[dtvktPdT]
   local d_bDDGXELFK=bqW4H8u-sb1E57m
   for pWp6FBE2=1,sb1E57m do LLbC5OFrr[kGo55Rs+pWp6FBE2-1].v=xIlzJptD[d_bDDGXELFK+pWp6FBE2] end
   bqW4H8u=d_bDDGXELFK
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(30*4/4) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   do
   local jtjCiGhD=i64N0t[zDwJIjdTIiq]
   local NSKXEA=jtjCiGhD<0 and ((-jtjCiGhD-1)+(hPY4Yla<0 and 0 or hPY4Yla)) or jtjCiGhD
   local TBKFIP0WX=i64N0t[wdCMBR]
   if NSKXEA>TBKFIP0WX then
   bqW4H8u=bqW4H8u-NSKXEA+TBKFIP0WX
   elseif NSKXEA<TBKFIP0WX then
   while NSKXEA<TBKFIP0WX do bqW4H8u=bqW4H8u+1 xIlzJptD[bqW4H8u]=nil NSKXEA=NSKXEA+1 end
   end
   hPY4Yla=-1
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=34 then
   if op<=31 then
   if op==(31*4/4) then
   xIlzJptD[bqW4H8u-1]=xIlzJptD[bqW4H8u-1]<xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=33 then
   if op<=32 then
   if op==(32-0) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   error("QXX&~~}@ZX^*@%^Z}|{*#ZX%$}Q^".."::ESCAPE-OP="..tostring(op))
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(33-0) then
   do
   local TBKFIP0WX=i64N0t[wdCMBR]
   if TBKFIP0WX<0 then
   local sb1E57m=St6a3fsfK.n or #St6a3fsfK
   for pWp6FBE2=1,sb1E57m do bqW4H8u=bqW4H8u+1 xIlzJptD[bqW4H8u]=St6a3fsfK[pWp6FBE2] end
   hPY4Yla=sb1E57m
   else
   for pWp6FBE2=1,TBKFIP0WX do bqW4H8u=bqW4H8u+1 xIlzJptD[bqW4H8u]=St6a3fsfK[pWp6FBE2] end
   hPY4Yla=-1
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(34+13-13) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=ipEJ6IC_GO
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(35-0) then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=xIlzJptD[bqW4H8u-1]
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=38 then
   if op<=36 then
   if op==((36+256)-256) then
   do
   local nXlYyj1gF=xIlzJptD[bqW4H8u-1]
   xIlzJptD[bqW4H8u-1]=nXlYyj1gF + xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=37 then
   if op==(37+59-59) then
   bqW4H8u=bqW4H8u+1
   local kL3PNO0YZ={}
   dvJCfacVwd[kL3PNO0YZ]=0
   xIlzJptD[bqW4H8u]=kL3PNO0YZ
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((38+256)-256) and (((wvRnIf1Q*wvRnIf1Q)-wvRnIf1Q)%2)==0 then
   bqW4H8u=bqW4H8u-i64N0t[wdCMBR]
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==((39+256)-256) then
   NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK])
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=41 then
   if op<=40 then
   if op==((40+256)-256) and ((7*hHCSzSvlIP*hHCSzSvlIP)+hHCSzSvlIP)%2==0 then
   do
   local js1RWLajk=i64N0t[wdCMBR]
   local ILvTSe=LLbC5OFrr[js1RWLajk].v+LLbC5OFrr[js1RWLajk+3].v
   local DRcq_wd=LLbC5OFrr[js1RWLajk+2].v
   local E8lKmiELGzR=LLbC5OFrr[js1RWLajk+3].v
   if (E8lKmiELGzR>0 and ILvTSe<=DRcq_wd) or (E8lKmiELGzR<0 and ILvTSe>=DRcq_wd) then
   LLbC5OFrr[js1RWLajk]={v=ILvTSe}
   LLbC5OFrr[js1RWLajk+1].v=ILvTSe
   NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK])
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(41+40-40) and (((hHCSzSvlIP*hHCSzSvlIP)-hHCSzSvlIP)%2)==0 then
   do
   local js1RWLajk=i64N0t[wdCMBR]
   local ILvTSe=i64N0t[zDwJIjdTIiq]
   local RMNS_E=GV6bXrE1nwN(LLbC5OFrr[js1RWLajk].v(LLbC5OFrr[js1RWLajk+1].v,LLbC5OFrr[js1RWLajk+2].v))
   if RMNS_E[1]~=nil then
   NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK])
   LLbC5OFrr[js1RWLajk+2].v=RMNS_E[1]
   for pWp6FBE2=1,ILvTSe do LLbC5OFrr[js1RWLajk+2+pWp6FBE2]={v=RMNS_E[pWp6FBE2]} end
   end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=42 then
   if op==(42-0) then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=false
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(43*4/4) then
   do
   local uwoxc7=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   if not uwoxc7 then NEDCHU3=NEDCHU3+(i64N0t[dtvktPdT]+i64N0t[fjM9UgGK]) end
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=47 then
   if op<=46 then
   if op<=44 then
   if op==(44+45-45) and ((hHCSzSvlIP*hHCSzSvlIP+hHCSzSvlIP)%2)==0 then
   do
   local TBKFIP0WX=i64N0t[wdCMBR]
   local kGo55Rs=bqW4H8u-2*TBKFIP0WX
   for pWp6FBE2=1,TBKFIP0WX do
   local dEKSFKi5n=xIlzJptD[kGo55Rs+2*pWp6FBE2-2]
   local kL3PNO0YZ=xIlzJptD[kGo55Rs+2*pWp6FBE2-1]
   local uwoxc7=xIlzJptD[kGo55Rs+2*TBKFIP0WX+pWp6FBE2-1]
   if kL3PNO0YZ==ipEJ6IC_GO then ipEJ6IC_GO[dEKSFKi5n]=uwoxc7 else kL3PNO0YZ[dEKSFKi5n]=uwoxc7 end
   end
   bqW4H8u=kGo55Rs-1
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=45 then
   if op==(45*4/4) and (((hHCSzSvlIP*hHCSzSvlIP)-hHCSzSvlIP)%2)==0 then
   do
   local uwoxc7=xIlzJptD[bqW4H8u] local dEKSFKi5n=xIlzJptD[bqW4H8u-1] local kL3PNO0YZ=xIlzJptD[bqW4H8u-i64N0t[wdCMBR]]
   kL3PNO0YZ[dEKSFKi5n]=uwoxc7
   bqW4H8u=bqW4H8u-2
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(46-0) then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=true
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(47-0) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   xIlzJptD[bqW4H8u-1]=xIlzJptD[bqW4H8u-1]==xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=101 then
   if op<=49 then
   if op<=48 then
   if op==(48+20-20) and ((wvRnIf1Q*wvRnIf1Q+wvRnIf1Q)%2)==0 then
   bqW4H8u=bqW4H8u+1
   xIlzJptD[bqW4H8u]=LLbC5OFrr[i64N0t[wdCMBR]].v
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(49-0) and ((7*wvRnIf1Q*wvRnIf1Q)+wvRnIf1Q)%2==0 then
   local kL3PNO0YZ=xIlzJptD[bqW4H8u]
   xIlzJptD[bqW4H8u]=xIlzJptD[bqW4H8u-1]
   xIlzJptD[bqW4H8u-1]=kL3PNO0YZ
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=50 then
   if op==(50+23-23) then
   do
   local SO29x9uID=i64N0t[wdCMBR]
   local L9MgvsfKcDj=xIlzJptD[bqW4H8u-SO29x9uID+1]
   for pWp6FBE2=bqW4H8u-SO29x9uID+2,bqW4H8u do L9MgvsfKcDj=L9MgvsfKcDj..xIlzJptD[pWp6FBE2] end
   bqW4H8u=bqW4H8u-SO29x9uID+1
   xIlzJptD[bqW4H8u]=L9MgvsfKcDj
   end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=100 then
   if op==100 then
   do local kL3PNO0YZ=xIlzJptD[bqW4H8u] xIlzJptD[bqW4H8u]=kL3PNO0YZ end
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==101 then
   xIlzJptD[bqW4H8u+1]=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u+1
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=102 then
   if op==102 and (((hHCSzSvlIP*hHCSzSvlIP)-hHCSzSvlIP)%2)==0 then
   xIlzJptD[bqW4H8u+1]=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u+1
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==103 then
   xIlzJptD[bqW4H8u+1]=xIlzJptD[bqW4H8u]
   bqW4H8u=bqW4H8u+1
   bqW4H8u=bqW4H8u-1
   else
   error("|!]Z{[[@>Z^<ZA&{^]&%Q|$[>[%|".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   end
  end
 end
 local QHXwyam=GV6bXrE1nwN(...)
 return Ky__hfFPl(Ky__hfFPl_decode(),1,_G,{},QHXwyam,nil)
end)(hHN45_w)