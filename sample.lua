-- NEVAHEX-VM v2.1 "The Abyss". Protected artifact. Do not edit.
local yXlLlRN=setmetatable({},{__mode="k"})
local function wss8TvTmMK6(...) local n=select('#',...) return {n=n,...} end
local EYDd6aR=unpack or (table and table.unpack)
local function Tsne6xDYC2(t,i,j)
 if i>j then return end
 if EYDd6aR and j-i>15 then return EYDd6aR(t,i,j) end
 return t[i],Tsne6xDYC2(t,i+1,j)
end
local SyWlYrUq1=_G or _ENV
local quweAnpG9qM=(714045+72-72) xfXkwWn_O3a=((271559+256)-256) DvZH5UGPu=(851947*4/4) JsWFimA=(54688+40-40) u33fbwbLyD=((898451+256)-256)
local iGHGASt=((62659+256)-256) Cz6MiAUKa=((1651607+256)-256) LQUH4V567i=((75361+256)-256)
local HKKemi=(969779822*4/4)
local wYgdOYSrccZ=0
local nhF8LbFqS=string.char local ZfSbNtvA7=table.concat
local function AULcMW8C(pID,e)
 if type(e)~='table' then return e end
 local v=e.v if v~=nil then return v end
 local kk=(HKKemi+pID*7919+wYgdOYSrccZ*((30971737+256)-256))%2147483646 if kk<1 then kk=kk+2147483646 end
 _G.LAST_KK=kk _G.LAST_PID=pID _G.LAST_N=e.n _G.LAST_T=e.t
 local parts={} local g=kk
 for j=1,e.n do g=(g*48271)%2147483647 parts[j]=nhF8LbFqS((e.b[j]-(g%256)+256)%256) end
 local sv=ZfSbNtvA7(parts)
 if e.t==5 then v=tonumber(sv) else v=sv end
 _G.LAST_V=v
 e.v=v return v
end
--[L1_SHELL] outer shell: blob decryption + environment derivation + budgets
local Tk81UFg7="\196\240\233G\238\013\244PU\036{\220m\039\236\157\233W\147\215\159\227\021\255\184\189p\025\201\203\219\158U\146\033_\235\213\236\231\247\177\213\226\140H\035;\201\128,\001=\1911WQ\2283\164\147\140\016\173\023\129\212=\013\028\039\131\246\173sdi(\238ER\228\241|\034\140\195\232x\012M\016\008\017\169\252\180\152\194\180\177\018\021\237\015d\167\194\024\216|\243\215\024\033~\039=K\176\241\035\252za\028r\214\202\226\221X\022\028\234\036S\190\010\148\009\178\237\224m\233\201\012p\203Lp\013\211T\134c5\243\012K\133/\135\239,Z\216\026\127\160\019\154\035\011\241\151\221\163\196\225\225+L\254w~\151\004\132\0393Dq\1270\253\154Q\214\008\207\030i\205G\249\187nU\158\240\010\234d\188\031\175\153\008+\008Y\226K\008cT4\138)T\006\015?\201\191\204g\221\020\016\168:\171J\156{\011n\2061\252^\140\039\158\179\019\131jx4\128\199S4N\160\130\144A\013\028\132\133\231BD\254\128:9ZA{\254\139\239\139~\177\191rB\248\186\246\183R\243\231\092m\189c\176\180\183\138;Z\035\159\15005\222Q\028\243\016\033\222H\136\190\155\038\033\020\129\202oh\2023\015\214x\137O\252\250\011\0132\227\252Z\130\028@J\235\029wX\022\137\148\177\153\153@d\254\138\025\1952\163\157\133\208\136T\239}\178\009\164\237\214\226\012\008E2\009qc\1674\241\248\18544\140\177A\228tNL\174J\250Q\219\210\205D\214\236v[H\179\203\195Sb\239\021\011\150[w\158\033\223\0326\190j\215\033\219\187yhg\144\141\240\255X\131,\201)r\219\254\032\000\221\205i\173\179L\203\186P\138;\138\023b\036\034\221\029\156<5\197q\027\143\192\0227C\013\1943j\246\011\131\030\032*\250\033}\217\127\152\164\255\230\137\222\1533s|\224-\134\001\170\205EX=\021E>t\191\236SM9\224\208s\254G\150\1729\202`K\195e\015\190\154\222V\181\158\027?\001\171\243Z\190\241a\166\130R\190\178:\131{\209\223`Q-M9HR\181\172G\144Q\247\208Y\127\243\131\221\030\012yv\216\181d\033\202\035\183\170\179\132\199\017\163\128\197\219\219\017i\182\220u\146\224\197E\164\140\160V3\016\254\027v\168[\141\197\161N9P\185\201\027\153\144\158\216\092T4\244\184\150\195\241\002\177hq\227\168\166=\031\003\014v\141*\037\194\003\202\013\191P\143o_\144|\156\131\197\235\223\245\131b\206\039\240\197\248a\247\032\217\036\215\188\013\002H\136x\219\146\202\208\039\214\1539m\020,\021\130\037-\142l\127\197\189LI\178q\008\167\005Sj\199c\2141j\033\030\169\130\179\033\137.\235my\230\176\238\030\226\020\242\254\008\165v\141\027\218\034\204?Wc+\222Ln\140\202\173}\149\2328\206\148\128\167\191\168\1460\239\129\153\198\218\238\213\005\233u\143\217)\205I\0138B\1971\174sY\158\208M\191\009\151<\137\031\185\225\2421\176\233\134M\167\028-\209>\183H`W5\153\160\195\135h\027\035^JC\000\002\237\247\184\162\157\204\158\140\131\1943\217\203\034\140\151\017k\211\200\029b\037\005\191?\039\247\226\092Q\199\245\165\186u\199/\006G\20108\221\187`d\222E\003\135\188\233\033D\033\172\250\211\025\218\151\209\027\138\253\129\017\138\233>\154\013{l\177\234}\154\249\185a\250.\175\206S\173I\225\167\225R\206\026O\181\206\202\026\217\141j\247\163\221\146\220\131\188\216f\208\215W\027\216\247\223\128\178\197Q\197\162\219\194\026y/\188j\156\207i\005\023a\023\201\199\185\017\037\244_\242\144;\003\021:\143a\227\197\206\143-\141\175\000\166\146i|\163D\199k*\210K(\178\011\031\181\237z\244\012\254\002\148I\155\183\221\227\012e\182\243\2545\131KA\164\238^\1503\025\161u\146\148@\239-b\176\018=,\033\169UZ-\128n\176\199\211|\223\208\145j\238Z\215\156\193~\128\034w\174\147)\137\013\226\002\151\174*\214\151\1616\024\244<\016\128\150\129\016a\021\035w\023\135\235\142\2071\195\135\140H[\250N\1436m\002\230\184\011\217\254\216\176\208\180,\234\008\2452\171y\148\197\157\178a\160\227fv\008w\136\233\036\203_\188\188\005\131\133\243\232\036\240\230\175\009\169\092\134I\151\005,\016`\133\182\148\1334\251+\168[\011\243\169\250U\184\034S\151\183\038h\253\200S\208\246\175\188\209\249\149\159;/T\174\214\001\242\156\151\004\155\152k\233gH\191L2\004\192{\206>w\033+\026\006\255T\190\169-\039\161v\022\130\244H\165Zj\226\138\179\225\038\197\225\175s*\024\157G|v\026`\174\238v6\1281\136\128\237\162\200\216u8G\030n\192:>\166\222\188\026\252\212\137[b\175\141v\237G>}\177m\0351\249y\005\201\138n\239\215t\016\213\204:\184\154\195\177\248\181+Q\013\129\252\206\198\022\005\194r\024\197\141\147I\224\174>\030\016c\220(\132:\1305\194\171xt\168\237\243\209\012Y[[\152g\201\220?}\154\250\018\233\249\233ZR\173\179\135\240n\023\152\169\198\212gb<\180\159\188\187\197\129\018\039V\188\151\150\250\186\144\255\175\019\228\253\165\235:7\196\186\001H\145|\140\146d\226\132\224O\236\210\255]H\038\240\131CGT\193;\129\193\010<\209\245S\201\028\230\134\030C\180\232\2208\215y\189\220\020\141\218\170O\195n\205`\202\210\038d\215\248rhN\239.\218*\230\208W\239p\017\240im\217s\033\000Bb\156\159\039\028\221\020\1866v\210\244\237\226\175\019\129\192v\143\210s\010^\141z\186\001\214\129q\158\173\181\194d\2365\136\240d}\138R\033;a<\209F\173\146\1903b\252\171\017\146\163z\1746\210\251,\133\176\225\215Q\001J,\219\203\027\034\020`\229\210\210\148\141nu[\163G\246\147:\243\160T\215\248\167\016\171\023\037}3\194\034)y\251o\182\241\158\188/\150\195\158\029g\015n\155\143r\165\227\035\139{f\249\220\247\145/\198\226\033/\024=\016P\238\202`\179Q\168;\187\027\032u\005\181\212\142\184\219\037\165\0100\191\035\185H\248\234\155\172v\179/h.\177~\185_oF\180V\234\145\138L>\151{\165i\162\253\212\169\179,C\150\168\004\221\158\250\197\008\198\195\169\245*B{\253=\199\174HR\223z\015N\190\241\195KfT\249\182m3\185\193\024\194\127\194\015\036\019\237=|\1638v\027j\133\192:\131\011|{\192\021\156Z\214\149\135\234\221.\172k\177\026\137\208\019I^O\023\026\145\011\004u\160\180\148\233\128\241\010z\029\154\027\133nvVEc\221\231\1609\017t\191\001\232\0286\029W\241\165i\136\134b\217p\130W_\189\141\199\153~)\156c\212\239\198\176\028\217\1868\134k\021t\027\190\175-L\019\174\170\192]\156\234?\201\185\134\180\246\220s\247on[\240Mt\150\192\207\1403j\183f\223\207\000W\181d\133\251\208\237a\127\019\036\148k7\180\153\208\211\189\185\166\188\007\164\136\186\213\205\029i\171\243y\134_f\218\188\223H\230<\024\002\191\205\2517\187a\148\233H.\027\0005\135\229~\009\219\168\014\196|\159\157\017\231\229\190\226j\179^\200ik\008\030\2121\144Q_a\138\163\140\170\235V>\017\021\023qW5\135\166\212\182\248\209\024j\200\190K\185\170</"
local lICscIFlu={}
local G4_nBIbG={}
do
 local It3llPgzZAQ=1
 local D={} local bn=#Tk81UFg7
 if bn>4194304 then error("XXQ^A$|*![]{{[X^|?*{Z|>*#^!~") end
 local sa=(545920216*4/4) sb=((17635956+256)-256) MM=2147483647
 do
  local BS={{p=(1+22-22),a=((64+256)-256),h=(840546865*4/4)},{p=(84-0),a=(64*4/4),h=((439102002+256)-256)},{p=((168+256)-256),a=(64-0),h=(722209526-0)},{p=(252+39-39),a=((64+256)-256),h=(337814814+22-22)},{p=(336+48-48),a=(64*4/4),h=(479046876-0)},{p=((419+256)-256),a=(64*4/4),h=(502463407-0)},{p=((503+256)-256),a=((64+256)-256),h=(30992891-0)},{p=(587*4/4),a=((64+256)-256),h=(260100429-0)},{p=(671+41-41),a=(64-0),h=(966618335+53-53)},{p=((755+256)-256),a=(64-0),h=(591138041+60-60)},{p=(838*4/4),a=(64*4/4),h=(652947261+16-16)},{p=((922+256)-256),a=(64+98-98),h=(638714307+85-85)},{p=(1006*4/4),a=((64+256)-256),h=(583188176-0)},{p=(1090+12-12),a=(64-0),h=(277161536+80-80)},{p=(1174+34-34),a=(64*4/4),h=(17354718*4/4)},{p=(1257*4/4),a=((64+256)-256),h=(252859325+13-13)},{p=(1341-0),a=(64+23-23),h=((434970625+256)-256)},{p=((1425+256)-256),a=(64+43-43),h=(537342849+94-94)},{p=(1509*4/4),a=(64-0),h=(788813152+29-29)},{p=((1593+256)-256),a=((64+256)-256),h=(778545275-0)},{p=(1676+15-15),a=(64-0),h=(745546642+51-51)},{p=((1760+256)-256),a=(64-0),h=((514660343+256)-256)},{p=(1844+71-71),a=(64-0),h=(541913770+66-66)},{p=(1928-0),a=(64*4/4),h=(412364306*4/4)}}
  for _bs=1,#BS do
   local sl=BS[_bs]
   local hh=(2166136261%1000000007)
   for j=sl.p,sl.p+sl.a-1 do hh=(hh*16777619+string.byte(Tk81UFg7,j))%1000000007 end
   if hh~=sl.h then
    sa=(sa+(209487+91-91))%2147483647 if sa<1 then sa=sa+2147483646 end
    sb=(sb+(30971737-0))%2147483647 if sb<1 then sb=sb+2147483646 end
    wYgdOYSrccZ=1
   end
  end
 end
 local sbyte=string.byte
 local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
 for i=1,bn do
  sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
  sb=(sb+pv)%MM sc=(sc+sa)%MM
  pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
  D[i]=(sbyte(Tk81UFg7,i)-pv+256)%256
 end
 local function wNTGAoN() local bt=D[It3llPgzZAQ] It3llPgzZAQ=It3llPgzZAQ+1 return bt end
 local function YZvfpKJfuX()
  local sh,r=0,0
  while true do
   local bt=wNTGAoN()
   r=r+(bt%128)*(2^sh)
   if bt<128 then return r end
   sh=sh+7
  end
 end
 local function jBdz5khn()
  local u=YZvfpKJfuX()
  if u%2==1 then return -(u+1)/2 end
  return u/2
 end
 local Ebba4B=wNTGAoN()
 if Ebba4B<128 then error("!$A*{#!#~%**|}<X%>A%&]{ZX|%|") end
 for i=1,Ebba4B-128 do wNTGAoN() end
 local lXg0AR=YZvfpKJfuX()
 if lXg0AR>4096 then error("~Z%AZ#][>>]>[~&%[]%*]]#X*!X>") end
 for E522mPVbgVT=1,lXg0AR do
  local pr={}
  pr.pn=wNTGAoN()
  pr.va=wNTGAoN()==1
  local nu=YZvfpKJfuX()
  pr.uv={}
  for i=1,nu do pr.uv[i]={wNTGAoN()==1 and 1 or 0,YZvfpKJfuX()} end
  pr.ns=YZvfpKJfuX()
  YZvfpKJfuX() YZvfpKJfuX() YZvfpKJfuX() YZvfpKJfuX() YZvfpKJfuX()
  local nc=YZvfpKJfuX()
  if nc>65536 then error("&?$Q^Q!^{*Z|^#&[!}#XX<${AZA*") end
  pr.c={}
  for i=1,nc do
   local tag=wNTGAoN()
   if tag==1 then pr.c[i]=true
   elseif tag==2 then pr.c[i]=false
   elseif tag==7 then pr.c[i]=(0/0)
   elseif tag==8 then pr.c[i]=math.huge
   elseif tag==9 then pr.c[i]=-math.huge
   elseif tag==5 or tag==6 then
    local ln=YZvfpKJfuX()
    local bb={}
    for j=1,ln do It3llPgzZAQ=It3llPgzZAQ+1 bb[j]=D[It3llPgzZAQ-1] end
    pr.c[i]={t=tag,n=ln,b=bb}
   else pr.c[i]=nil end
  end
  local nk=YZvfpKJfuX()
  if nk>262144 then error("$!A$>^>!^]#!%AX<~Q>~[]^>{Q}@") end
  pr.k={}
  local lrk=(iGHGASt+E522mPVbgVT*Cz6MiAUKa)%65536
  for i=1,nk do
   local mm=math.floor(lrk/3)%256
   local oe=YZvfpKJfuX()
   local aw=jBdz5khn()-mm
   local b1w=jBdz5khn()-mm
   local b2w=jBdz5khn()+mm
   local cw=jBdz5khn()-mm
   lrk=(lrk+LQUH4V567i)%65536
   pr.k[i]={[quweAnpG9qM]=oe,[xfXkwWn_O3a]=aw,[DvZH5UGPu]=b1w,[JsWFimA]=b2w,[u33fbwbLyD]=cw}
  end
  lICscIFlu[E522mPVbgVT]=pr
 end
 local wln=YZvfpKJfuX()
 local wa=(191365950*4/4) wb=((1415535329+256)-256) MM2=2147483647
 local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
 for i=1,wln do
  wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
  wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
  pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
  G4_nBIbG[i]=(D[It3llPgzZAQ]-pv2+256)%256
  It3llPgzZAQ=It3llPgzZAQ+1
 end
end
aSxOxR=#G4_nBIbG
if aSxOxR<1 then aSxOxR=1 G4_nBIbG[1]=0 end
--[L3_CONSTS] const plane: proto constant pools + watermark carriers
local XnoiL6oTbGW={((357669980+256)-256),((626991631+256)-256)}
local y22pvbrFr={{i=1,p=((1+256)-256),a=(1+74-74),b=(52-0)},{i=2,p=(2-0),a=(1-0),b=(130+14-14)}}
eaRn9FyTk7=#y22pvbrFr
--[L2_VM] core VM: dispatcher + integrity ticks + tier policy
local function HufYjZ(AVecaN,PUHWlcjEHw1,Xk8gaK3RyL,dzGyVOSwMGR,tln6dp)
 local wGinmfTr_g_=lICscIFlu[AVecaN]
 local q_9dWxFZ=wGinmfTr_g_.k
 local wFfzyZ=wGinmfTr_g_.c
 local mJqKI8Ipmy={}
 local YpGQAGxVWP={}
 for M7o7_f97M=1,wGinmfTr_g_.ns do YpGQAGxVWP[M7o7_f97M]={} end
 local VFrOTqtYl0,WtVKyLBqvX,BjwzrWSZ1dV=0,-1,1
 local nqLd0v=dzGyVOSwMGR
 for M7o7_f97M=1,wGinmfTr_g_.pn do YpGQAGxVWP[M7o7_f97M].v=dzGyVOSwMGR[M7o7_f97M] end
 local sMowJ4N8Taz,wNM1adlUuS=37,1
 local jNjD2JPRveg,hqFcRIK,r2gxR_Zu=false,nil,0
 local ORxqWNeL4f=(iGHGASt+AVecaN*Cz6MiAUKa)%65536
 local oPjL3C,ALF0fky,fDnTrhO,xAV0ermpod,y5glO4QFPm
 local bJeIzn8,op
 while true do
  sMowJ4N8Taz=sMowJ4N8Taz-1
  if sMowJ4N8Taz<=0 then
  if eaRn9FyTk7>0 then
  local tjZE0N=y22pvbrFr[wNM1adlUuS]
  wNM1adlUuS=wNM1adlUuS%eaRn9FyTk7+1
  if tjZE0N then
  local U_7AF3=lICscIFlu[tjZE0N.p] and lICscIFlu[tjZE0N.p].k
  if U_7AF3 then
  local gNHJgPVz=(2166136261%1000000007)
  for Qp0ViSlDTW=tjZE0N.a,tjZE0N.b do
  local pNtiEUxv=U_7AF3[Qp0ViSlDTW]
  if pNtiEUxv then gNHJgPVz=(gNHJgPVz*16777619+pNtiEUxv[quweAnpG9qM]*31+pNtiEUxv[xfXkwWn_O3a]*7+(pNtiEUxv[DvZH5UGPu]+pNtiEUxv[JsWFimA])*3+pNtiEUxv[u33fbwbLyD])%1000000007 end
  end
  if gNHJgPVz~=XnoiL6oTbGW[tjZE0N.i] then
  jNjD2JPRveg=true hqFcRIK=(2-0) wYgdOYSrccZ=1
  end
  end
  end
  end
  r2gxR_Zu=(G4_nBIbG[(wNM1adlUuS*7)%aSxOxR+1]==nil) and 1 or 0
  sMowJ4N8Taz=64
  end
  bJeIzn8=q_9dWxFZ[BjwzrWSZ1dV]
  op=(((bJeIzn8[quweAnpG9qM]-ORxqWNeL4f)+65536)%65536)
  ORxqWNeL4f=(ORxqWNeL4f+LQUH4V567i)%65536
  BjwzrWSZ1dV=BjwzrWSZ1dV+1
  if op<=37 then
  if op<=15 then
  if op<=11 then
  if op<=8 then
  if op<=2 then
  if op<=0 then
  if op==(0*4/4) and ((7*r2gxR_Zu*r2gxR_Zu)+r2gxR_Zu)%2==0 then
  VFrOTqtYl0=VFrOTqtYl0-bJeIzn8[xfXkwWn_O3a]
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=1 then
  if op==((1+256)-256) then
  VFrOTqtYl0=VFrOTqtYl0+1
  local Wcce1jLz={}
  yXlLlRN[Wcce1jLz]=0
  mJqKI8Ipmy[VFrOTqtYl0]=Wcce1jLz
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(2*4/4) then
  do
  local qMcRm67VFU=mJqKI8Ipmy[VFrOTqtYl0] local Oyq_QZs=mJqKI8Ipmy[VFrOTqtYl0-1] local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0-2]
  Wcce1jLz[Oyq_QZs]=qMcRm67VFU
  VFrOTqtYl0=VFrOTqtYl0-3
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=4 then
  if op<=3 then
  if op==((3+256)-256) and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  mJqKI8Ipmy[VFrOTqtYl0-1]=mJqKI8Ipmy[VFrOTqtYl0-1][mJqKI8Ipmy[VFrOTqtYl0]]
  VFrOTqtYl0=VFrOTqtYl0-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(4+81-81) and ((sMowJ4N8Taz*sMowJ4N8Taz+sMowJ4N8Taz)%2)==0 then
  do
  local YCGfTs=mJqKI8Ipmy[VFrOTqtYl0]
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  VFrOTqtYl0=VFrOTqtYl0-1
  mJqKI8Ipmy[VFrOTqtYl0]=(osc4TJEpVG * YCGfTs)+hqFcRIK
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op<=5 then
  if op==(5+68-68) and ((7*r2gxR_Zu*r2gxR_Zu)+r2gxR_Zu)%2==0 then
  local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0]
  mJqKI8Ipmy[VFrOTqtYl0]=mJqKI8Ipmy[VFrOTqtYl0-1]
  mJqKI8Ipmy[VFrOTqtYl0-1]=Wcce1jLz
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=7 then
  if op<=6 then
  if op==(6+93-93) and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  mJqKI8Ipmy[VFrOTqtYl0+1]=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0+1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==((7+256)-256) and ((7*sMowJ4N8Taz*sMowJ4N8Taz)+sMowJ4N8Taz)%2==0 then
  do
  local LhqV0NZOBBn=bJeIzn8[xfXkwWn_O3a]
  local diMiUG4=VFrOTqtYl0-2*LhqV0NZOBBn
  for M7o7_f97M=1,LhqV0NZOBBn do
  local Oyq_QZs=mJqKI8Ipmy[diMiUG4+2*M7o7_f97M-2]
  local Wcce1jLz=mJqKI8Ipmy[diMiUG4+2*M7o7_f97M-1]
  local qMcRm67VFU=mJqKI8Ipmy[diMiUG4+2*LhqV0NZOBBn+M7o7_f97M-1]
  if Wcce1jLz==PUHWlcjEHw1 then PUHWlcjEHw1[Oyq_QZs]=qMcRm67VFU else Wcce1jLz[Oyq_QZs]=qMcRm67VFU end
  end
  VFrOTqtYl0=diMiUG4-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op==((8+256)-256) then
  do
  local b0Qdmwb=bJeIzn8[xfXkwWn_O3a]
  local qourTC=mJqKI8Ipmy[VFrOTqtYl0-b0Qdmwb+1]
  for M7o7_f97M=VFrOTqtYl0-b0Qdmwb+2,VFrOTqtYl0 do qourTC=qourTC..mJqKI8Ipmy[M7o7_f97M] end
  VFrOTqtYl0=VFrOTqtYl0-b0Qdmwb+1
  mJqKI8Ipmy[VFrOTqtYl0]=qourTC
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  end
  else
  if op<=10 then
  if op<=9 then
  if op==(9+61-61) then
  do
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  mJqKI8Ipmy[VFrOTqtYl0-1]=(osc4TJEpVG - mJqKI8Ipmy[VFrOTqtYl0])+hqFcRIK
  VFrOTqtYl0=VFrOTqtYl0-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==((10+256)-256) and ((r2gxR_Zu*r2gxR_Zu+r2gxR_Zu)%2)==0 then
  Xk8gaK3RyL[bJeIzn8[xfXkwWn_O3a]].v=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op==(11*4/4) then
  do
  local LhqV0NZOBBn=bJeIzn8[xfXkwWn_O3a]
  if LhqV0NZOBBn>=0 then
  local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0-LhqV0NZOBBn-1]
  local b0Qdmwb=yXlLlRN[Wcce1jLz] or 0
  for M7o7_f97M=1,LhqV0NZOBBn do Wcce1jLz[b0Qdmwb+M7o7_f97M]=mJqKI8Ipmy[VFrOTqtYl0-LhqV0NZOBBn+M7o7_f97M] end
  yXlLlRN[Wcce1jLz]=b0Qdmwb+LhqV0NZOBBn
  VFrOTqtYl0=VFrOTqtYl0-LhqV0NZOBBn-1
  else
  local QErEMzTT4m=(-LhqV0NZOBBn)-1
  local dGsCtY=WtVKyLBqvX<0 and 0 or WtVKyLBqvX
  local fkhoybuRt=QErEMzTT4m+dGsCtY
  local diMiUG4=VFrOTqtYl0-fkhoybuRt
  local Wcce1jLz=mJqKI8Ipmy[diMiUG4-1]
  local b0Qdmwb=yXlLlRN[Wcce1jLz] or 0
  for M7o7_f97M=1,fkhoybuRt do Wcce1jLz[b0Qdmwb+M7o7_f97M]=mJqKI8Ipmy[diMiUG4+M7o7_f97M-1] end
  yXlLlRN[Wcce1jLz]=b0Qdmwb+fkhoybuRt
  WtVKyLBqvX=-1
  VFrOTqtYl0=diMiUG4-1
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=13 then
  if op<=12 then
  if op==(12-0) and (((r2gxR_Zu*r2gxR_Zu)-r2gxR_Zu)%2)==0 then
  do
  local AYqhZJLi=bJeIzn8[xfXkwWn_O3a]
  local vQeQ7ay7gv=mJqKI8Ipmy[VFrOTqtYl0]
  local PSrpFvccq=mJqKI8Ipmy[VFrOTqtYl0-1]
  local LmYHJY1S=mJqKI8Ipmy[VFrOTqtYl0-2]
  VFrOTqtYl0=VFrOTqtYl0-3
  YpGQAGxVWP[AYqhZJLi]={v=LmYHJY1S}
  YpGQAGxVWP[AYqhZJLi+1].v=LmYHJY1S
  YpGQAGxVWP[AYqhZJLi+2].v=PSrpFvccq
  YpGQAGxVWP[AYqhZJLi+3].v=vQeQ7ay7gv
  if (vQeQ7ay7gv>0 and LmYHJY1S>PSrpFvccq) or (vQeQ7ay7gv<0 and LmYHJY1S<PSrpFvccq) then BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA]) end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(13-0) then
  do
  local qMcRm67VFU=mJqKI8Ipmy[VFrOTqtYl0] local Oyq_QZs=mJqKI8Ipmy[VFrOTqtYl0-1] local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0-bJeIzn8[xfXkwWn_O3a]]
  Wcce1jLz[Oyq_QZs]=qMcRm67VFU
  VFrOTqtYl0=VFrOTqtYl0-2
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op<=14 then
  if op==(14+13-13) and ((7*r2gxR_Zu*r2gxR_Zu)+r2gxR_Zu)%2==0 then
  error("##{{!&*%[]@[@&^[%<}Q?@?XA!>[")
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(15*4/4) and (((r2gxR_Zu*r2gxR_Zu)-r2gxR_Zu)%2)==0 then
  do
  local LhqV0NZOBBn,WmJIqT=bJeIzn8[xfXkwWn_O3a],bJeIzn8[DvZH5UGPu]
  ALF0fky=LhqV0NZOBBn<0 and (WtVKyLBqvX<0 and 0 or WtVKyLBqvX) or LhqV0NZOBBn
  fDnTrhO=1
  xAV0ermpod=VFrOTqtYl0-ALF0fky-1-fDnTrhO
  y5glO4QFPm=mJqKI8Ipmy[xAV0ermpod]
  local OFPSth
  if type(y5glO4QFPm)=='table' and y5glO4QFPm.pid then
  local WOPRbCNz={n=ALF0fky}
  for M7o7_f97M=1,ALF0fky do WOPRbCNz[M7o7_f97M]=mJqKI8Ipmy[xAV0ermpod+fDnTrhO+M7o7_f97M] end
  OFPSth=HufYjZ(y5glO4QFPm.pid,y5glO4QFPm.env,y5glO4QFPm.uv,WOPRbCNz,tln6dp)
  else
  OFPSth=wss8TvTmMK6(y5glO4QFPm(Tsne6xDYC2(mJqKI8Ipmy,xAV0ermpod+1+fDnTrhO,VFrOTqtYl0)))
  end
  if WmJIqT==0 then
  VFrOTqtYl0=xAV0ermpod-1
  WtVKyLBqvX=-1
  elseif WmJIqT==-1 then
  oPjL3C=OFPSth.n
  for M7o7_f97M=1,oPjL3C do mJqKI8Ipmy[xAV0ermpod+M7o7_f97M-1]=OFPSth[M7o7_f97M] end
  VFrOTqtYl0=xAV0ermpod+oPjL3C-1
  WtVKyLBqvX=oPjL3C
  else
  for M7o7_f97M=1,WmJIqT do mJqKI8Ipmy[xAV0ermpod+M7o7_f97M-1]=OFPSth[M7o7_f97M] end
  VFrOTqtYl0=xAV0ermpod+WmJIqT-1
  WtVKyLBqvX=-1
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  else
  if op<=23 then
  if op<=21 then
  if op<=18 then
  if op<=16 then
  if op==(16+18-18) and ((sMowJ4N8Taz*sMowJ4N8Taz+sMowJ4N8Taz)%2)==0 then
  do
  local AYqhZJLi=bJeIzn8[xfXkwWn_O3a]
  local MGBVaf8R=bJeIzn8[u33fbwbLyD]
  local tCYrSrX5icy=wss8TvTmMK6(YpGQAGxVWP[AYqhZJLi].v(YpGQAGxVWP[AYqhZJLi+1].v,YpGQAGxVWP[AYqhZJLi+2].v))
  if tCYrSrX5icy[1]~=nil then
  BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA])
  YpGQAGxVWP[AYqhZJLi+2].v=tCYrSrX5icy[1]
  for M7o7_f97M=1,MGBVaf8R do YpGQAGxVWP[AYqhZJLi+2+M7o7_f97M]={v=tCYrSrX5icy[M7o7_f97M]} end
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=17 then
  if op==(17+58-58) and ((sMowJ4N8Taz*sMowJ4N8Taz+sMowJ4N8Taz)%2)==0 then
  local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0]
  mJqKI8Ipmy[VFrOTqtYl0]=mJqKI8Ipmy[VFrOTqtYl0-1]
  mJqKI8Ipmy[VFrOTqtYl0-1]=Wcce1jLz
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(18*4/4) then
  do end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=19 then
  if op==(19+62-62) then
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=PUHWlcjEHw1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=20 then
  if op==(20*4/4) then
  do
  local YCGfTs=mJqKI8Ipmy[VFrOTqtYl0]
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  VFrOTqtYl0=VFrOTqtYl0-1
  mJqKI8Ipmy[VFrOTqtYl0]=osc4TJEpVG<YCGfTs
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(21-0) and (((r2gxR_Zu*r2gxR_Zu)-r2gxR_Zu)%2)==0 then
  do
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  mJqKI8Ipmy[VFrOTqtYl0-1]=osc4TJEpVG / mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  else
  if op<=22 then
  if op==(22+59-59) and ((7*sMowJ4N8Taz*sMowJ4N8Taz)+sMowJ4N8Taz)%2==0 then
  mJqKI8Ipmy[VFrOTqtYl0]=-mJqKI8Ipmy[VFrOTqtYl0]
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(23*4/4) and ((r2gxR_Zu*r2gxR_Zu+r2gxR_Zu)%2)==0 then
  do
  local qMcRm67VFU=AULcMW8C(AVecaN,wFfzyZ[bJeIzn8[xfXkwWn_O3a]])
  VFrOTqtYl0=VFrOTqtYl0+1
  if jNjD2JPRveg and type(qMcRm67VFU)=='number' then mJqKI8Ipmy[VFrOTqtYl0]=qMcRm67VFU+hqFcRIK else mJqKI8Ipmy[VFrOTqtYl0]=qMcRm67VFU end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=26 then
  if op<=24 then
  if op==(24*4/4) and ((r2gxR_Zu*r2gxR_Zu+r2gxR_Zu)%2)==0 then
  do
  local LhqV0NZOBBn=bJeIzn8[xfXkwWn_O3a]
  local OFPSth={n=0}
  if LhqV0NZOBBn<0 then
  local pvDGwP7lR=WtVKyLBqvX<0 and 0 or WtVKyLBqvX
  OFPSth.n=pvDGwP7lR
  local LmYHJY1S=VFrOTqtYl0-pvDGwP7lR+1
  for M7o7_f97M=1,pvDGwP7lR do OFPSth[M7o7_f97M]=mJqKI8Ipmy[LmYHJY1S+M7o7_f97M-1] end
  else
  OFPSth.n=LhqV0NZOBBn
  for M7o7_f97M=1,LhqV0NZOBBn do OFPSth[M7o7_f97M]=mJqKI8Ipmy[VFrOTqtYl0-LhqV0NZOBBn+M7o7_f97M] end
  end
  return OFPSth
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=25 then
  if op==(25*4/4) then
  do
  local LhqV0NZOBBn=bJeIzn8[xfXkwWn_O3a]
  if LhqV0NZOBBn<0 then
  local pvDGwP7lR=nqLd0v.n or #nqLd0v
  for M7o7_f97M=1,pvDGwP7lR do VFrOTqtYl0=VFrOTqtYl0+1 mJqKI8Ipmy[VFrOTqtYl0]=nqLd0v[M7o7_f97M] end
  WtVKyLBqvX=pvDGwP7lR
  else
  for M7o7_f97M=1,LhqV0NZOBBn do VFrOTqtYl0=VFrOTqtYl0+1 mJqKI8Ipmy[VFrOTqtYl0]=nqLd0v[M7o7_f97M] end
  WtVKyLBqvX=-1
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(26*4/4) then
  do
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  mJqKI8Ipmy[VFrOTqtYl0-1]=osc4TJEpVG ^ mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=30 then
  if op<=28 then
  if op<=27 then
  if op==(27+17-17) then
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=false
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(28*4/4) and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  do
  local YCGfTs=mJqKI8Ipmy[VFrOTqtYl0]
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  VFrOTqtYl0=VFrOTqtYl0-1
  mJqKI8Ipmy[VFrOTqtYl0]=(osc4TJEpVG + YCGfTs)+hqFcRIK
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op<=29 then
  if op==((29+256)-256) and ((7*r2gxR_Zu*r2gxR_Zu)+r2gxR_Zu)%2==0 then
  do
  local YCGfTs=mJqKI8Ipmy[VFrOTqtYl0]
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  VFrOTqtYl0=VFrOTqtYl0-1
  mJqKI8Ipmy[VFrOTqtYl0]=osc4TJEpVG==YCGfTs
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(30*4/4) and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  do
  local LhqV0NZOBBn,WmJIqT=bJeIzn8[xfXkwWn_O3a],bJeIzn8[DvZH5UGPu]
  ALF0fky=LhqV0NZOBBn<0 and (WtVKyLBqvX<0 and 0 or WtVKyLBqvX) or LhqV0NZOBBn
  fDnTrhO=0
  xAV0ermpod=VFrOTqtYl0-ALF0fky-1-fDnTrhO
  y5glO4QFPm=mJqKI8Ipmy[xAV0ermpod]
  local OFPSth
  if type(y5glO4QFPm)=='table' and y5glO4QFPm.pid then
  local WOPRbCNz={n=ALF0fky}
  for M7o7_f97M=1,ALF0fky do WOPRbCNz[M7o7_f97M]=mJqKI8Ipmy[xAV0ermpod+fDnTrhO+M7o7_f97M] end
  OFPSth=HufYjZ(y5glO4QFPm.pid,y5glO4QFPm.env,y5glO4QFPm.uv,WOPRbCNz,tln6dp)
  else
  OFPSth=wss8TvTmMK6(y5glO4QFPm(Tsne6xDYC2(mJqKI8Ipmy,xAV0ermpod+1+fDnTrhO,VFrOTqtYl0)))
  end
  if WmJIqT==0 then
  VFrOTqtYl0=xAV0ermpod-1
  WtVKyLBqvX=-1
  elseif WmJIqT==-1 then
  oPjL3C=OFPSth.n
  for M7o7_f97M=1,oPjL3C do mJqKI8Ipmy[xAV0ermpod+M7o7_f97M-1]=OFPSth[M7o7_f97M] end
  VFrOTqtYl0=xAV0ermpod+oPjL3C-1
  WtVKyLBqvX=oPjL3C
  else
  for M7o7_f97M=1,WmJIqT do mJqKI8Ipmy[xAV0ermpod+M7o7_f97M-1]=OFPSth[M7o7_f97M] end
  VFrOTqtYl0=xAV0ermpod+WmJIqT-1
  WtVKyLBqvX=-1
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=31 then
  if op==(31*4/4) then
  do
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  mJqKI8Ipmy[VFrOTqtYl0-1]=osc4TJEpVG % mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=34 then
  if op<=32 then
  if op==((32+256)-256) then
  do
  local YCGfTs=mJqKI8Ipmy[VFrOTqtYl0]
  local osc4TJEpVG=mJqKI8Ipmy[VFrOTqtYl0-1]
  VFrOTqtYl0=VFrOTqtYl0-1
  mJqKI8Ipmy[VFrOTqtYl0]=osc4TJEpVG<=YCGfTs
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=33 then
  if op==(33-0) then
  mJqKI8Ipmy[VFrOTqtYl0]=not mJqKI8Ipmy[VFrOTqtYl0]
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(34+54-54) and ((7*sMowJ4N8Taz*sMowJ4N8Taz)+sMowJ4N8Taz)%2==0 then
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=PUHWlcjEHw1[AULcMW8C(AVecaN,wFfzyZ[bJeIzn8[xfXkwWn_O3a]])]
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  else
  if op<=36 then
  if op<=35 then
  if op==(35-0) then
  mJqKI8Ipmy[VFrOTqtYl0]=#mJqKI8Ipmy[VFrOTqtYl0]
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(36*4/4) and ((r2gxR_Zu*r2gxR_Zu+r2gxR_Zu)%2)==0 then
  do
  local pux1_B81j=bJeIzn8[xfXkwWn_O3a]
  local X9uoE_y_=lICscIFlu[pux1_B81j]
  local Uvr7t7YNQFx={}
  for M7o7_f97M=1,#X9uoE_y_.uv do
  local CFjvwvW=X9uoE_y_.uv[M7o7_f97M]
  if CFjvwvW[1]==1 then Uvr7t7YNQFx[M7o7_f97M]=YpGQAGxVWP[CFjvwvW[2]] else Uvr7t7YNQFx[M7o7_f97M]=Xk8gaK3RyL[CFjvwvW[2]] end
  end
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]={pid=pux1_B81j,env=PUHWlcjEHw1,uv=Uvr7t7YNQFx}
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op==(37*4/4) then
  PUHWlcjEHw1[AULcMW8C(AVecaN,wFfzyZ[bJeIzn8[xfXkwWn_O3a]])]=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  end
  end
  end
  end
  else
  if op<=41 then
  if op<=38 then
  if op==((38+256)-256) then
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=true
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=39 then
  if op==((39+256)-256) and ((sMowJ4N8Taz*sMowJ4N8Taz+sMowJ4N8Taz)%2)==0 then
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=Xk8gaK3RyL[bJeIzn8[xfXkwWn_O3a]].v
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op<=40 then
  if op==(40*4/4) and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  YpGQAGxVWP[bJeIzn8[xfXkwWn_O3a]].v=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(41+57-57) and ((r2gxR_Zu*r2gxR_Zu+r2gxR_Zu)%2)==0 then
  do
  local EyqEogcij=bJeIzn8[u33fbwbLyD]
  local VvaQvHXZ=EyqEogcij<0 and ((-EyqEogcij-1)+(WtVKyLBqvX<0 and 0 or WtVKyLBqvX)) or EyqEogcij
  local LhqV0NZOBBn=bJeIzn8[xfXkwWn_O3a]
  if VvaQvHXZ>LhqV0NZOBBn then
  VFrOTqtYl0=VFrOTqtYl0-VvaQvHXZ+LhqV0NZOBBn
  elseif VvaQvHXZ<LhqV0NZOBBn then
  while VvaQvHXZ<LhqV0NZOBBn do VFrOTqtYl0=VFrOTqtYl0+1 mJqKI8Ipmy[VFrOTqtYl0]=nil VvaQvHXZ=VvaQvHXZ+1 end
  end
  WtVKyLBqvX=-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  else
  if op<=100 then
  if op<=43 then
  if op<=42 then
  if op==(42*4/4) then
  do
  local diMiUG4,pvDGwP7lR=bJeIzn8[xfXkwWn_O3a],bJeIzn8[DvZH5UGPu]
  local AILlTB=VFrOTqtYl0-pvDGwP7lR
  for M7o7_f97M=1,pvDGwP7lR do YpGQAGxVWP[diMiUG4+M7o7_f97M-1].v=mJqKI8Ipmy[AILlTB+M7o7_f97M] end
  VFrOTqtYl0=AILlTB
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(43+70-70) and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  do
  local AYqhZJLi=bJeIzn8[xfXkwWn_O3a]
  local MGBVaf8R=YpGQAGxVWP[AYqhZJLi].v+YpGQAGxVWP[AYqhZJLi+3].v
  local PSrpFvccq=YpGQAGxVWP[AYqhZJLi+2].v
  local vQeQ7ay7gv=YpGQAGxVWP[AYqhZJLi+3].v
  if (vQeQ7ay7gv>0 and MGBVaf8R<=PSrpFvccq) or (vQeQ7ay7gv<0 and MGBVaf8R>=PSrpFvccq) then
  YpGQAGxVWP[AYqhZJLi]={v=MGBVaf8R}
  YpGQAGxVWP[AYqhZJLi+1].v=MGBVaf8R
  BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA])
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op<=46 then
  if op<=45 then
  if op<=44 then
  if op==(44*4/4) and ((sMowJ4N8Taz*sMowJ4N8Taz+sMowJ4N8Taz)%2)==0 then
  if WtVKyLBqvX>1 then VFrOTqtYl0=VFrOTqtYl0-WtVKyLBqvX+1 end
  WtVKyLBqvX=-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==(45+16-16) then
  do
  local Wcce1jLz=YpGQAGxVWP[bJeIzn8[xfXkwWn_O3a]].v
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=Wcce1jLz
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op==(46+22-22) then
  do
  local qMcRm67VFU=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0-1
  if qMcRm67VFU then BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA]) end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op<=48 then
  if op<=47 then
  if op==((47+256)-256) then
  do
  local AYqhZJLi=bJeIzn8[xfXkwWn_O3a]
  local MGBVaf8R=bJeIzn8[u33fbwbLyD]
  local ZO99syfXF=mJqKI8Ipmy[VFrOTqtYl0] local Yxfc5qQ=mJqKI8Ipmy[VFrOTqtYl0-1] local efk9rodCs=mJqKI8Ipmy[VFrOTqtYl0-2]
  VFrOTqtYl0=VFrOTqtYl0-3
  YpGQAGxVWP[AYqhZJLi].v=efk9rodCs
  YpGQAGxVWP[AYqhZJLi+1].v=Yxfc5qQ
  YpGQAGxVWP[AYqhZJLi+2].v=ZO99syfXF
  local tCYrSrX5icy=wss8TvTmMK6(YpGQAGxVWP[AYqhZJLi].v(YpGQAGxVWP[AYqhZJLi+1].v,YpGQAGxVWP[AYqhZJLi+2].v))
  if tCYrSrX5icy[1]==nil then
  BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA])
  else
  YpGQAGxVWP[AYqhZJLi+2].v=tCYrSrX5icy[1]
  for M7o7_f97M=1,MGBVaf8R do YpGQAGxVWP[AYqhZJLi+2+M7o7_f97M]={v=tCYrSrX5icy[M7o7_f97M]} end
  end
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==((48+256)-256) and ((r2gxR_Zu*r2gxR_Zu+r2gxR_Zu)%2)==0 then
  BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA])
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op<=50 then
  if op<=49 then
  if op==((49+256)-256) then
  VFrOTqtYl0=VFrOTqtYl0+1
  mJqKI8Ipmy[VFrOTqtYl0]=nil
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==((50+256)-256) then
  do
  if not mJqKI8Ipmy[VFrOTqtYl0] then BjwzrWSZ1dV=BjwzrWSZ1dV+(bJeIzn8[DvZH5UGPu]+bJeIzn8[JsWFimA]) end
  VFrOTqtYl0=VFrOTqtYl0-1
  end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op==100 and ((7*sMowJ4N8Taz*sMowJ4N8Taz)+sMowJ4N8Taz)%2==0 then
  do local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0] mJqKI8Ipmy[VFrOTqtYl0]=Wcce1jLz end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  end
  else
  if op<=102 then
  if op<=101 then
  if op==101 then
  mJqKI8Ipmy[VFrOTqtYl0+1]=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0+1
  VFrOTqtYl0=VFrOTqtYl0-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  else
  if op==102 and (((sMowJ4N8Taz*sMowJ4N8Taz)-sMowJ4N8Taz)%2)==0 then
  do local Wcce1jLz=mJqKI8Ipmy[VFrOTqtYl0] mJqKI8Ipmy[VFrOTqtYl0]=Wcce1jLz end
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  else
  if op==103 then
  mJqKI8Ipmy[VFrOTqtYl0+1]=mJqKI8Ipmy[VFrOTqtYl0]
  VFrOTqtYl0=VFrOTqtYl0+1
  VFrOTqtYl0=VFrOTqtYl0-1
  else
  error("}&]*}[{[{QX{Z~<[Z{^[]]AQ!A<^")
  end
  end
  end
  end
  end
 end
end
do
 local QfABOznDnM8=wss8TvTmMK6(...)
 HufYjZ(1,SyWlYrUq1,{},QfABOznDnM8,nil)
end