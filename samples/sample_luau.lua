-- NEVAHEX-VM v3 'Hex' — protected artifact — ]~$@X]@~#{]%() runs it

return (function(IToNbzq2uh, ...)
 local iFk9nompG=setmetatable({},{__mode="k"})
 local function uYIwNh(...) local n=select('#',...) return {n=n,...} end
 local s3b_qF=type(_G.unpack)=="function" and _G.unpack or (type(table)=="table" and type(table.unpack)=="function" and table.unpack)
 local function gFprng4VL(t,i,j)
  if i>j then return end
  if s3b_qF and j-i>15 then return s3b_qF(t,i,j) end
  return t[i],gFprng4VL(t,i+1,j)
 end
 local I8xlGBg=_G.string.char
 local DztyyS=_G.table.concat
 local ID2LO_tH,rPXoX2RFQ,ilLhnFDYuCz,X675AZSoXUj,eugZn6,OcrJk2,fjlg3KAK,udowVEcp,QS7vco,UJ5TlFC1I0u,jQYv6yrX4,F8cNzk9NUt
 if debug and debug.sethook then local _ad=0 local function _adh() _ad=_ad+1 end debug.sethook(_adh,"lr") local _gi=debug.getinfo and debug.getinfo(1) if _gi and (_gi.what=="C" or _ad>0) then gvUZlBsO_=true xW9qWWmt=9999 end debug.sethook() end
 local ZWCIlgj=(340896-0) FLJ3HmSr6a=(422238-0) K7xYlj=(826825*4/4) hoWKiDWQAS=(269270*4/4) aWqLcR=((430313+256)-256)
 local PmkbbuwXsA=(63238*4/4) xXgUvy=(1643391-0) kvHDrC=(1042499-0) iDXkwQr4U=(224925*4/4)
 local V4hPjohpkD=(1158665562*4/4) _G.__CK0=tostring(V4hPjohpkD)
 local tBg1OQOX=0 dpAmKfkeTmO=0
 local function IAuI5O6T3(pID,e)
  if type(e)~='table' then _G.__CV_TYPE=_G.__CV_TYPE or ""..tostring(type(e)) return e end
  local v=e.v if v~=nil then _G.__CV_CACHED=(_G.__CV_CACHED or 0)+1 return v end
  _G.__CV_RAW_T=(_G.__CV_RAW_T or "")..tostring(e.t) _G.__CV_RAW_N=(_G.__CV_RAW_N or "")..tostring(e.n)
  local kk=(((V4hPjohpkD+pID*7919)%2147483646)+2147483646)%2147483646 if kk==0 then kk=1 end
  _G.__CV_KK=(_G.__CV_KK or 0)+1 _G.__CV_KK_LAST=tostring(kk) _G.__CV_PID=tostring(pID)
  if e.t==5 or e.t==6 then
   local parts={} local g=kk
   _G.__CV_G0=(_G.__CV_G0 or 0)+1 _G.__CV_G_INIT=tostring(g)
   for j=1,e.n do g=(g*48271)%2147483647 local _mb=g%256 local _db=(e.b[j]-_mb+256)%256 parts[j]=I8xlGBg(_db) _G.__CV_MASKS=(_G.__CV_MASKS or "")..string.char(_mb) _G.__CV_DECB=(_G.__CV_DECB or "")..string.char(_db) end
   local sv=DztyyS(parts)
   if e.t==5 then v=tonumber(sv) else v=sv end
  else
   if e.t==1 then v=true elseif e.t==2 then v=false elseif e.t==7 then v=0/0 elseif e.t==8 then v=math.huge elseif e.t==9 then v=-math.huge else v=nil end
  end
  if v==nil then _G.__CV_NIL=(_G.__CV_NIL or 0)+1 _G.__CV_NIL_TYPE=tostring(e.t) _G.__CV_NIL_SV=tostring(sv) end
  _G.__CV_CALLS=(_G.__CV_CALLS or 0)+1 _G.__CV_LAST=tostring(e.t)..":"..tostring(sv)
  e.v=v return v
 end
 local pUfR43CDiDD="\239}U\195{BSd\176QMl\186u\002\192Fx\182B\004\146<\191\016\025\138\227PnU\231a\138\130\002o\199\144TZ\245\244\144\160\153iio\16655\009a\181\239\207\169\200\129\242\014|/\020R\146~\129M\128:D\174\129\241\013\239\0183\191\241\014\007\025\135B\008\247I9OC\016\184\247\208Ql7\223j:\254\170\024w\2428\010\129Z\194l.\016\221\000,\138\148\007\175\243v\171T\004\164\248\179\207c\180\009Y\188\199\021\229X\032slY\023Wa\142\038m\148\238\177\030\241KWv9\188\152a\217B\167\023\223v\161I7y\145\248\019~\152\178\195w\167\038\014\249\165\176\159o\211\139/\036\232\009{mu3`\013^\144v\200\017T\159\174\220\142\171m\031\017[H\011+\198\217f\129\1271\194\129BQ\175r\186\0065\026\019q\164\148\199\224\010\035\134\184\224F\0145\2416\038\220\223\185\180\205I\166z\233\008w\021\005u\003S\217\234K\232\129\197d\192Q>\023\003AF\227\248T\002\1916\154\031\149~\026[\176sM\201?\255\\0\196\030\242\039\243\205t\198\2022pX\158[1C\202\238\155\163V\138c\202\211\\b\219/\221\232}\004\028\165\143\023\026\184@Y\2216\250\210\029\132\139\158/\004\252\0123(\196\205:\005\035|T\\\251nS\000\141\222\026\026\242\021sP\222\171hH\213\202\016\001\038\201I\013Z\205\254\176\189h\029iw8\189q\201\184\130\196R\203\224\154\007\003i\005:\237\176\016\166\004\169\180=W\140hm\030\1653P\016\166\236K\035\222\138\008D\221\158\159\182\239\0296\031\237t\220\005\203\129\254\131\127`\246\031\149ok\027\009\018\252\145\210\189\174\247\186C\218G\176\151\169\233\204*\151\009\177to\219D5\135\249f2\247\232\138\215\229q\2518W\028\224\188\250\1555\131\210\146}\238\139\152\157\206\244\170.G\187\002\142\022\204\135\2325t\008\155kd\1376\0353\251h\020@<:\009`\181\023\005BI\187\145\171\222\143\181\168\151\0200\186\194\198\148\196\155\160\024\227\236b\029\169\240<\222s\180\176\138\165)B\032\188P5\152\013j8MX\227\201i\1965\178L\226\187\195S\138\196\210\252)\251=7pPj\135,\199:\223\165p\196\198\026\0247\245\165J\163\020b\185Gk\210\139\187\202\239G:`\017\160,HL\161c\208\231\000\038\164\019\027\147\240\181\168j\192\210\004\255\149{\133\245\166\234\214\209\127\160\219\207\162\242FuyRi\188\163Z\128\230\148\210\133JzF\229\017\241\131^/B\145,\227oc\251\001\2392E\178@B\\k7\229Y8\221\129g;\244m\138\1358\015\174n\004\024\183\251;\001\004K\162\025<t\138\004\026\238dp\234_\148\189\030\005\148\036\196\251\008\152k\227t\1650\151\230\187\230\149C\024o\249\021\016@\165\006\255\148h\223-\229E~|n+\0232\162\221Y5L\214\223\039V\225m/\022\194\016\039B\145\144\132\010\220\165\253\195\1788\188\024\145D\252\027eI\179\024\212\240\236\025\216\021\244\251\191\129\232c\000\169\025\161Do\"\157\171\028\138\247[\147\221\035\158\031i\202\182G\127P\253G\216\203(\015\197t\227\254\197\196\132\029\158\000?\172\020\131A\219\025j\010\167\027\222\232\149\032,^\199{\189\000\202\243\014\013n\170\038\165\166\007\252\003\178\030Hx\185\205\250\152\039\0288\037s\006Z\147\145p\158\212\164\012GDtUWrZ\243~\234\152\191\028\153\221\154v\218o\026\229iPM\194\248\165\253\027\128r\160QQk/\035\229{\136/=\159\242\017\147\199\0283~\021,\219\237\251\177Vf\1517\216Q)VG`\222\035\252\139\196|\155o\199\024\173\248mV\005\196\205N\151\175\223t\130\028\239\172\163\203\016\230\224\017\004S\223\133~\136;\238\145W\173E\227\185*\189<\233U?\180\136f4Nu^\192\015G\155Fd\007\234\140V\181\015\217\246\151\145_n0\009\177W\251B\141br\150uzA\221C;\146\157\206\174\187\213nx\141^\220Nq\172S\152Ip\224\152\173\153\213\134\222\038\180o{n\000\210\031\217e\196\168\159.\243\150\221\219I\003~\187\154\203`\221I\242}\014\144\138i\157\153\253F\198\0089G\037]\183lP\032s\133\137\241k\031kk\032\127\223\198\199]\129\012S\225+\009\012\023\172\253\201\244\018t\183\172\022\014L\184\152\037<Y\199\225_0\232\143\210\167\132\203\004A\204,\227m\153,\185\2184yDA\139}\212\144\141\176\004R\164\211\196E\181\\\012\006E,@D|)\197\035\137q\24268\009[BX\174\139\206b\242\190(\244\138\237cD<\151\168\146\254\154o\228\185\225\187\003\231\204\151U\168K\215,\127\178+\199\248.\164\142A\248\008\208\244p\2412\248<H\254\140\0371JS2U\198\190)\037\208\172\129xt\212\\\234`\143D\230@\195\157\132`\202\179;\238\026\185\159\171\247{\\W\246\036\247\167\203Ja3\192m9\165\004o\002/\2139V_\248\229\205\196\004\038\162\131\191WT\002\162\180\"\019\019y\150i\132[wh\249\214\161\251\235\183\235\140_z\181\182\180\174E\178\202\202c\134\181\022\003\214\153\219\201\014k8\228\187g\205\023\194:\036\228\140\244\204\131\228\020\008FS|\239\208\006@\190\144ux\141\152`bf\147_\183P\219\239)\244Eib\026\244w\"\224\033A|\228\014w\138sN\131\212@4\011\195\145h\224\039`\193\200\231Fy\178\026v\209\036\132\205\159\030\015\151\187A\232l\013\239\149Y\021<\001*\032>\225\033\200I\132\250\002q\207\243\010\245\150\180\201\028\023H\014\223\212\230\218\201\164c\177\005~u\189\022\174\"\147\030hF\171\245`\019\195\039\255\234k\037\225\"\196p\153\250Ie\209d\144\028\169\"\160Q}V\155(\174`\020=XX\191\133\146o\217)\020\195:\175\178\154\253\229\198\238\009\025\200r\187\249\236YT\170\229\218\003\0392\142Y\173V\237\243\252\209\133u\223\207\148\029\027\012\197\161\000\167\015dnUkJ\152Cu\234\2073\025*m\161\210\016\132\006\012\146r\188z\151\185^\000?\141|\153\195i\226\223\212\190\173s<W\010X\226^)\248\136\037\229\243\025\227\148H\161\2519d\202\135d\027S`\192\0222\177U\169\228\176@t\229z\200D\143\128\193\127\231\2181\162\232\231+\032\203Dub\143\159\180/\156\180\238\134\252\246\156\196\235c\211\206\2428D\174\167\146Uz\241\215\209\006x\190\031\147\151[\020\150\1809ZZ\133Sm\133\032\163i\027\193\227D\197\184\233\169\031R\013\214\192\225\0026\008N\168-\238\198\008\233I\202\210\1664K\190fv?]\1759\168_W_\188\239\028\023\218\174Pp\162[\007\200\208\247\130\251U5\219N\193\254\2286Q~\128s6\255Hg\159H\238\178K\132\1900\036J\023\152\019\138_\229\244l\161\221\165\027\203\227\184\010,;\028\001\013R\156\039\175\035\2240\170m\026\205N\184L\153\012{\012]B\182\025\137\154\026Qz\244\200\021\\\1983\228p\15015\146B\038M\142n\237\197s\196\172\159\2123\181\223\011\131Z\173(=\213\192\196\254{\029\206\137\239E\030\194\244\249\236@\160\165N\173\131\197b\252=\186\224\160\249}@G\035S\015\253\238}\216\026\238\015\157\133\015\171\160/\158\171\1812k\157\224ie\143bGe\008\1347\225\152\194\182\1575P\208\217n\019y\008\"\235\247\004\"\222>e\146\152=\004\175\019\242X;`N\152\163\142\007\209{\032\021|\026\247[UNd\221H\004\014m_<\000,R\138\180\019\136\224rs\\d\173\145q\237Vs\020]\213\247\185\132\230\186\038\220Z\224\025\183\005\146\136\181\244E\237\250\021\218\007\027\205\226\218\033\0221\026\026\162`Ze\129A\031B\213\2037\011\243d.hGWo\231\231\215J\182\036\250}\169U\240jv\236W\014@\129\2281\187k\027\134\226FII\036a\155t\025\237)q`y\224D\130\170\223\148M\005h\0069qv\132T\209\181\167=J\198\009\168\219\130\039\249\201\003\019\005T\255\0383\195e\215\151>\146L\026\012LbLw\225\148\128\242\015\194\190\179`\205\154\215\173ERD\003pU\159\185>\1416\024m+\165\239\243_\038>2\132\191X\130g\237\163\207\233\012\138\213\2272c\195\009lq\149\032\138\255\130e\251\238E\131<\128\1313A\038Oz\1655\007\198\147\129\170\222\218Q\164\237\219\166v-o\003u:7\028\184\017\213\193\211\205t|=n(\191\207u\005\221\206\234\000\186j\238\185\005n\157\127\018*<?6dz\144\133+\147c\030\250\214^\183\013\247\219d\\\200\015`\227\212\020\246\209\140\166\2114O{+9\137\229p\209\145\216\036\1499\018_\006\039\175\194\201\005\002\240x\251\237\019\162n\191\026\138\166_\174>\176+\223\217z\170\021\150\216\246\233\181\143jl\176I\196\244(\139\219\184\198s\154\016uB\188+\161)\127\202*xtl\217\240d\132\0229\156S\253A5\182\246kj\229\171\157\212\191Gr\192L\145\1603\224\1273\1668C\190\035\006Lf\230\174\015k\154]u\004N\029]C\161\179k`\203]\181\135\181\185\236\037\026\251\221\222\134\196=\188z\197\242\229\254\246\241\192Qp\007\160\229\240\013\162e1\166c\204\194\013\148K^\203\252yE\191\035A\180-\011zt\222\213\017\0170t\241\162\020G\151\180\128\238F\201\214\218\207:\219\200\009\184\190\1903\178\243\146\172\171\144\181\233\157\165\247\222\248U\154]\0205\184\152\239P4\1634\190p\003\136\189=\253\245\152\143\132m\185\181E\196\021\008\003\216V\003\240\243\012dq\143\027\195=T\225C\002\244\151\177\170\006\012v\020c\006@\175;7\039\224}\178\032+\2281\201A_\023x\177\149d\137L\2049\192\158\029\020\244\027g\210\167,\017\210\025\169\253\186\146\191IU\144\133s`M\212\"7\193\245\195\245o\158-\168*3p8i1\019\249R@\024\187\234\151V\014\247\237-\135\229vs\192\191\010ts\174@\133)G\203j\156\194m\142\186\005\027\247\215\207E\160\252\024G\247\227\015iHM<\030\129\219h\151\187t\204\1604\038\246\221\018\160\236\023\238\236\200\001\012u\162\208[\245\020\211\155\212\224\231\249\022\193\143\186\002\2447\223>\148\038\160\031\156\215\181R\249\243\1875\0385K\000\166\221=\155[C\148\156\186\\\027\180\246XG\235\186u\224\222\188\172\004e\178\128\246\195r\037\169s\225;E\243\163\251\163\006\255\129\038u\252\209\160\207\158\207\16765\127_\176\151so4f\243,\202T0Bpy\246\017tJ\205/tZ>{V\194u\252\199+\011\158\139\242\243\032<oI(d\169q\238A\217\035\031G\221\248/u\037\027i\171\180\1479\000\021\207\142\207\213\165\138\037\196\018R\207s\\\237l\1639\035\197\"\167\197\145c\224\2463\214|;,O\222\131M\196:\039\007{\167E\253d<\012\010\237\005\247\2479\022{\234\249\166\005A8\246pa\213Oc(\179\237\012\031DO\015G\207\170@\174p\145\000\168r\244l\169B\1666\161\189\168\194C\131\007\229\010}P\252@1A:\144Q\216\038o\1784\167\244\193\208\249\181\236\217\158\130^\240\023\008\127\234\141f\001\212\204X\246\167W\174\157\182*\158\203\167\012l\231\031V\229F\186\247\228=\213\158\194\004\224E\195S?\189\152k\184MT\162s1\233\225\202g\014\1949\171\250\185\202\227j\209\202\152\234\007\140\0205\230\234\140\236E\196\139\204\012C\1775\036\233\237\134\193\218\170\245\165,\235,\026\179\134gwg\024\225^7,/q\157\229\216\031)\139\"J\128\233\247\217\165\201M\217\139{\1675k\152Ty\140\252"
 local function ahCRO64Hl_decode()
  local D={} local bn=#pUfR43CDiDD
  if bn>4194304 then error("#*]#~&{X^>XQ]|%*<#*&~X#>Q]{{") end
  local MM=2147483647
  local dv2Yr17={1839932633,1461313686,986828300,1242890303,1914942962,1508104770,1746714441,1409961054,1093394859,1376180308,509837348,882458890,957516509,1440560407,1524130585,1697822860}
  local hdr=D[1] local pl=(hdr%128) local sa=((D[pl+2]*16777216+D[pl+3]*65536+D[pl+3]*256+D[pl+4])^dv2Yr17[4]+dv2Yr17[3]-dv2Yr17[6])%2147483646 if sa<1 then sa=sa+2147483646 end
  local sb=((D[pl+5]*16777216+D[pl+6]*65536+D[pl+7]*256+D[pl+6])^dv2Yr17[2]+dv2Yr17[5]-dv2Yr17[1])%2147483646 if sb<1 then sb=sb+2147483646 end
  local sbyte=string.byte
  local sc=(sa*31+sb)%MM local sd=(sb*17+sa)%MM local pv=0
  for i=1,bn do
   sa=(sa*48271)%MM sb=(sb*69621)%MM sc=(sc*2994349)%MM sd=(sd*4050403)%MM
   sb=(sb+pv)%MM sc=(sc+sa)%MM
   pv=(math.floor(sa/65536)*31+math.floor(sb/2048)*17+math.floor(sc/1024)*7+math.floor(sd/256)*3+pv)%256
   D[i]=(sbyte(pUfR43CDiDD,i)-pv+256)%256
  end
  local Iy1v_F3otuO=1
  local function gLxCM3() local bt=D[Iy1v_F3otuO] Iy1v_F3otuO=Iy1v_F3otuO+1 return bt end
  local function NL4pMlznDW()
   local sh,r=0,0
   while true do
    local bt=gLxCM3()
    r=r+(bt%128)*(2^sh)
    if bt<128 then return r end
    sh=sh+7
   end
  end
  local function Z6zEN2()
   local u=NL4pMlznDW()
   if u%2==1 then return -(u+1)/2 end
   return u/2
  end
  local YmYRl0_L_r=gLxCM3()
  if YmYRl0_L_r<128 then error("$!|[!}||X#$$ZZ~$&[>A*$@$!?#!") end
  for i=1,YmYRl0_L_r-128 do gLxCM3() end
  local ox8czgLRMCf=NL4pMlznDW()
  if ox8czgLRMCf>4096 then error("XZQ}~~]@QA|}%$@$Q*>Q^X}[$|&~") end
  local cgdqDg3S_GN={} local W7M1V2={}
  for ceSTcT=1,ox8czgLRMCf do
   local pr={}
   pr.pn=gLxCM3()
   pr.va=gLxCM3()==1
   local nu=NL4pMlznDW()
   pr.uv={}
   for i=1,nu do pr.uv[i]={gLxCM3()==1 and 1 or 0,NL4pMlznDW()} end
   pr.ns=NL4pMlznDW()
   NL4pMlznDW() NL4pMlznDW() NL4pMlznDW() NL4pMlznDW() NL4pMlznDW()
   local nc=NL4pMlznDW()
   if nc>65536 then error("~|X>X{%<[>}}@Z{[~!~>%#<}<[%$") end
   pr.c={}
   for i=1,nc do
    local tag=gLxCM3()
    if tag==1 then pr.c[i]=true
    elseif tag==2 then pr.c[i]=false
    elseif tag==7 then pr.c[i]=(0/0)
    elseif tag==8 then pr.c[i]=math.huge
    elseif tag==9 then pr.c[i]=-math.huge
    elseif tag==5 or tag==6 then
     local ln=NL4pMlznDW()
     local bb={}
     for j=1,ln do Iy1v_F3otuO=Iy1v_F3otuO+1 bb[j]=D[Iy1v_F3otuO-1] end
     pr.c[i]={t=tag,n=ln,b=bb}
    else pr.c[i]=nil end
   end
   local nk=NL4pMlznDW()
   if nk>262144 then error("@^|X~Z||!#}<%Z|<#[@>A$*[$X#~") end
   pr.k={}
   local lrk=(PmkbbuwXsA+ceSTcT*xXgUvy+ceSTcT*ceSTcT*kvHDrC)%65536
   for i=1,nk do
    local mm=math.floor(lrk/3)%256
    local oe=NL4pMlznDW()
    local aw=Z6zEN2()-mm
    local b1w=Z6zEN2()-mm
    local b2w=Z6zEN2()+mm
    local cw=Z6zEN2()-mm
    lrk=(lrk+iDXkwQr4U+math.floor(lrk/8))%65536
    pr.k[i]={[ZWCIlgj]=oe,[FLJ3HmSr6a]=aw,[K7xYlj]=b1w,[hoWKiDWQAS]=b2w,[aWqLcR]=cw}
   end
   cgdqDg3S_GN[ceSTcT]=pr
  end
  local wln=NL4pMlznDW()
  local wa=((1305182750+256)-256) wb=((318561217+256)-256) MM2=2147483647
  local wc=(wa*31+wb)%MM2 local wd=(wb*17+wa)%MM2 local pv2=0
  for i=1,wln do
   wa=(wa*48271)%MM2 wb=(wb*69621)%MM2 wc=(wc*2994349)%MM2 wd=(wd*4050403)%MM2
   wb=(wb+pv2)%MM2 wc=(wc+wa)%MM2
   pv2=(math.floor(wa/65536)*31+math.floor(wb/2048)*17+math.floor(wc/1024)*7+math.floor(wd/256)*3+pv2)%256
   W7M1V2[i]=(D[Iy1v_F3otuO]-pv2+256)%256
   Iy1v_F3otuO=Iy1v_F3otuO+1
  end
  local UCLWxGFA=#W7M1V2
  if UCLWxGFA<1 then UCLWxGFA=1 W7M1V2[1]=0 end
  return {P=cgdqDg3S_GN,WM=W7M1V2,WMI=UCLWxGFA}
 end
 local zfMaCcXKND=0
 local MxLiAa={} local HeSciicuW={}
 local function ahCRO64Hl(l1,OBu1yRtzHJd,tscYdHnLugc,TZZFPaCI1ew,VU2mM2hVkF,lTv70Yw1)
  local cgdqDg3S_GN,W7M1V2,UCLWxGFA=l1.P,l1.WM,l1.WMI
  local EFKZjnxN=cgdqDg3S_GN[OBu1yRtzHJd]
  local d0KVJxiA=EFKZjnxN.k
  local RILKDiCcTZ=EFKZjnxN.c
  local nZjt1R63={}
  local XD6D39={}
  for RihNc8gRXV=1,EFKZjnxN.ns do XD6D39[RihNc8gRXV]={} end
  local rsbu6WOw,uIrZgAz,o_UuAODN=0,-1,1
  local vocMrpGHeR=VU2mM2hVkF
  for RihNc8gRXV=1,EFKZjnxN.pn do XD6D39[RihNc8gRXV].v=VU2mM2hVkF[RihNc8gRXV] end
  local d_QUyNwQvob,iOwKJeu4uH=37,1
  local gvUZlBsO_,xW9qWWmt,SqRVTV=false,0,0
  local B0ZfGOM=(PmkbbuwXsA+OBu1yRtzHJd*xXgUvy+OBu1yRtzHJd*OBu1yRtzHJd*kvHDrC)%65536
  local p0sM90iJ,cDkzG6,SYlMuU4T,GqE2cbmuU1,mNMJ2ET
  local PxLj0ve,op
  while true do
   if debug and debug.getinfo then local _dg=debug.getinfo(1) if _dg and _dg.what=="C" then gvUZlBsO_=true xW9qWWmt=1 end end
   PxLj0ve=d0KVJxiA[o_UuAODN]
   if o_UuAODN<20 then _G.__VM_TRACE=(_G.__VM_TRACE or "").."PC="..tostring(o_UuAODN).." RK="..tostring(B0ZfGOM).." INS="..tostring(PxLj0ve[ZWCIlgj]).." A="..tostring(PxLj0ve[FLJ3HmSr6a]).." B="..tostring(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS]).." C="..tostring(PxLj0ve[aWqLcR]).."\n" end
   PxLj0ve=d0KVJxiA[o_UuAODN]
   op=(((PxLj0ve[ZWCIlgj]-B0ZfGOM)+65536)%65536)
   B0ZfGOM=(B0ZfGOM+iDXkwQr4U+math.floor(B0ZfGOM/8))%65536
   o_UuAODN=o_UuAODN+1
   if op<=24 then
   if op<=20 then
   if op<=8 then
   if op<=6 then
   if op<=3 then
   if op<=1 then
   if op<=0 then
   if op==(0*4/4) then
   do
   local LpRrVcp=PxLj0ve[FLJ3HmSr6a]
   local McB00KYrNV=cgdqDg3S_GN[LpRrVcp]
   local Yygxk9jI54T={}
   for RihNc8gRXV=1,#McB00KYrNV.uv do
   local sKHx4tLwkX=McB00KYrNV.uv[RihNc8gRXV]
   if sKHx4tLwkX[1]==1 then Yygxk9jI54T[RihNc8gRXV]=XD6D39[sKHx4tLwkX[2]] else Yygxk9jI54T[RihNc8gRXV]=TZZFPaCI1ew[sKHx4tLwkX[2]] end
   end
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]={pid=LpRrVcp,env=tscYdHnLugc,uv=Yygxk9jI54T}
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(1*4/4) then
   nZjt1R63[rsbu6WOw-1]=nZjt1R63[rsbu6WOw-1][nZjt1R63[rsbu6WOw]]
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=2 then
   if op==(2-0) then
   do
   local aQKTLt=nZjt1R63[rsbu6WOw]
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   rsbu6WOw=rsbu6WOw-1
   nZjt1R63[rsbu6WOw]=Rn0tvXU % aQKTLt
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(3*4/4) then
   do
   local YhfpqokAE=PxLj0ve[FLJ3HmSr6a]
   local QRiheTShAf=nZjt1R63[rsbu6WOw-YhfpqokAE+1]
   for RihNc8gRXV=rsbu6WOw-YhfpqokAE+2,rsbu6WOw do QRiheTShAf=QRiheTShAf..nZjt1R63[RihNc8gRXV] end
   rsbu6WOw=rsbu6WOw-YhfpqokAE+1
   nZjt1R63[rsbu6WOw]=QRiheTShAf
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=5 then
   if op<=4 then
   if op==(4*4/4) and (((d_QUyNwQvob*d_QUyNwQvob)-d_QUyNwQvob)%2)==0 then
   do
   if not nZjt1R63[rsbu6WOw] then o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS]) end
   rsbu6WOw=rsbu6WOw-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(5*4/4) and ((d_QUyNwQvob*d_QUyNwQvob+d_QUyNwQvob)%2)==0 then
   do
   local PIoOX7_=PxLj0ve[FLJ3HmSr6a]
   local ANYdf0amg6=rsbu6WOw-2*PIoOX7_
   for RihNc8gRXV=1,PIoOX7_ do
   local OJCwohZQ=nZjt1R63[ANYdf0amg6+2*RihNc8gRXV-2]
   local cAnZ0lAW=nZjt1R63[ANYdf0amg6+2*RihNc8gRXV-1]
   local OD6fdULy=nZjt1R63[ANYdf0amg6+2*PIoOX7_+RihNc8gRXV-1]
   if cAnZ0lAW==tscYdHnLugc then tscYdHnLugc[OJCwohZQ]=OD6fdULy else cAnZ0lAW[OJCwohZQ]=OD6fdULy end
   end
   rsbu6WOw=ANYdf0amg6-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(6*4/4) then
   do
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   nZjt1R63[rsbu6WOw-1]=Rn0tvXU + nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=7 then
   if op==((7+256)-256) then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=nil
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(8*4/4) then
   do
   local aQKTLt=nZjt1R63[rsbu6WOw]
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   rsbu6WOw=rsbu6WOw-1
   nZjt1R63[rsbu6WOw]=Rn0tvXU / aQKTLt
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=16 then
   if op<=11 then
   if op<=10 then
   if op<=9 then
   if op==((9+256)-256) then
   do
   local PIoOX7_=PxLj0ve[FLJ3HmSr6a]
   if PIoOX7_>=0 then
   local cAnZ0lAW=nZjt1R63[rsbu6WOw-PIoOX7_-1]
   local YhfpqokAE=iFk9nompG[cAnZ0lAW] or 0
   for RihNc8gRXV=1,PIoOX7_ do cAnZ0lAW[YhfpqokAE+RihNc8gRXV]=nZjt1R63[rsbu6WOw-PIoOX7_+RihNc8gRXV] end
   iFk9nompG[cAnZ0lAW]=YhfpqokAE+PIoOX7_
   rsbu6WOw=rsbu6WOw-PIoOX7_-1
   else
   local pIz3UE6Qi3L=(-PIoOX7_)-1
   local piS2vYmjmzT=uIrZgAz<0 and 0 or uIrZgAz
   local R3vVGd5_YB3=pIz3UE6Qi3L+piS2vYmjmzT
   local ANYdf0amg6=rsbu6WOw-R3vVGd5_YB3
   local cAnZ0lAW=nZjt1R63[ANYdf0amg6-1]
   local YhfpqokAE=iFk9nompG[cAnZ0lAW] or 0
   for RihNc8gRXV=1,R3vVGd5_YB3 do cAnZ0lAW[YhfpqokAE+RihNc8gRXV]=nZjt1R63[ANYdf0amg6+RihNc8gRXV-1] end
   iFk9nompG[cAnZ0lAW]=YhfpqokAE+R3vVGd5_YB3
   uIrZgAz=-1
   rsbu6WOw=ANYdf0amg6-1
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(10+34-34) and (((d_QUyNwQvob*d_QUyNwQvob)-d_QUyNwQvob)%2)==0 then
   do
   local ANYdf0amg6,jJgY7FZPVT=PxLj0ve[FLJ3HmSr6a],PxLj0ve[K7xYlj]
   local IG0C98PsyXr=rsbu6WOw-jJgY7FZPVT
   for RihNc8gRXV=1,jJgY7FZPVT do XD6D39[ANYdf0amg6+RihNc8gRXV-1].v=nZjt1R63[IG0C98PsyXr+RihNc8gRXV] end
   rsbu6WOw=IG0C98PsyXr
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(11*4/4) and (((SqRVTV*SqRVTV)-SqRVTV)%2)==0 then
   do
   local cAnZ0lAW=nZjt1R63[rsbu6WOw]
   nZjt1R63[rsbu6WOw]=nZjt1R63[rsbu6WOw-1] ^ cAnZ0lAW
   rsbu6WOw=rsbu6WOw-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=14 then
   if op<=13 then
   if op<=12 then
   if op==(12-0) and ((d_QUyNwQvob*d_QUyNwQvob+d_QUyNwQvob)%2)==0 then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=false
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(13*4/4) then
   do
   local lrhO1McOhZn=PxLj0ve[FLJ3HmSr6a]
   local tGybToj55=PxLj0ve[aWqLcR]
   local XDJNkaXCCwJ=uYIwNh(XD6D39[lrhO1McOhZn].v(XD6D39[lrhO1McOhZn+1].v,XD6D39[lrhO1McOhZn+2].v))
   if XDJNkaXCCwJ[1]~=nil then
   o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS])
   XD6D39[lrhO1McOhZn+2].v=XDJNkaXCCwJ[1]
   for RihNc8gRXV=1,tGybToj55 do XD6D39[lrhO1McOhZn+2+RihNc8gRXV]={v=XDJNkaXCCwJ[RihNc8gRXV]} end
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(14+35-35) then
   do
   local PIoOX7_=PxLj0ve[FLJ3HmSr6a]
   local LJwgnt94c3Y={n=0}
   if PIoOX7_<0 then
   local jJgY7FZPVT=uIrZgAz<0 and 0 or uIrZgAz
   LJwgnt94c3Y.n=jJgY7FZPVT
   local cnCf2Xi=rsbu6WOw-jJgY7FZPVT+1
   for RihNc8gRXV=1,jJgY7FZPVT do LJwgnt94c3Y[RihNc8gRXV]=nZjt1R63[cnCf2Xi+RihNc8gRXV-1] end
   else
   LJwgnt94c3Y.n=PIoOX7_
   for RihNc8gRXV=1,PIoOX7_ do LJwgnt94c3Y[RihNc8gRXV]=nZjt1R63[rsbu6WOw-PIoOX7_+RihNc8gRXV] end
   end
   return LJwgnt94c3Y
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=15 then
   if op==(15-0) and (((d_QUyNwQvob*d_QUyNwQvob)-d_QUyNwQvob)%2)==0 then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=TZZFPaCI1ew[PxLj0ve[FLJ3HmSr6a]].v
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(16-0) then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=IAuI5O6T3(OBu1yRtzHJd,RILKDiCcTZ[PxLj0ve[FLJ3HmSr6a]])
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=18 then
   if op<=17 then
   if op==(17*4/4) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   do
   local OD6fdULy=nZjt1R63[rsbu6WOw] local OJCwohZQ=nZjt1R63[rsbu6WOw-1] local cAnZ0lAW=nZjt1R63[rsbu6WOw-2]
   cAnZ0lAW[OJCwohZQ]=OD6fdULy
   rsbu6WOw=rsbu6WOw-3
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(18-0) and ((SqRVTV*SqRVTV+SqRVTV)%2)==0 then
   nZjt1R63[rsbu6WOw+1]=XD6D39[PxLj0ve[FLJ3HmSr6a]].v
   rsbu6WOw=rsbu6WOw+1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=19 then
   if op==(19+45-45) and (((d_QUyNwQvob*d_QUyNwQvob)-d_QUyNwQvob)%2)==0 then
   nZjt1R63[rsbu6WOw]=not nZjt1R63[rsbu6WOw]
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((20+256)-256) then
   do
   local lrhO1McOhZn=PxLj0ve[FLJ3HmSr6a]
   local tGybToj55=XD6D39[lrhO1McOhZn].v+XD6D39[lrhO1McOhZn+3].v
   local Fs3qh3UcS=XD6D39[lrhO1McOhZn+2].v
   local bhA74nIC=XD6D39[lrhO1McOhZn+3].v
   if (bhA74nIC>0 and tGybToj55<=Fs3qh3UcS) or (bhA74nIC<0 and tGybToj55>=Fs3qh3UcS) then
   XD6D39[lrhO1McOhZn]={v=tGybToj55}
   XD6D39[lrhO1McOhZn+1].v=tGybToj55
   o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS])
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=22 then
   if op<=21 then
   if op==(21-0) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   do end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(22+61-61) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   local cAnZ0lAW=nZjt1R63[rsbu6WOw]
   nZjt1R63[rsbu6WOw]=nZjt1R63[rsbu6WOw-1]
   nZjt1R63[rsbu6WOw-1]=cAnZ0lAW
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=23 then
   if op==(23+63-63) then
   do
   local aQKTLt=nZjt1R63[rsbu6WOw]
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   rsbu6WOw=rsbu6WOw-1
   nZjt1R63[rsbu6WOw]=Rn0tvXU==aQKTLt
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(24-0) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=true
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=42 then
   if op<=33 then
   if op<=29 then
   if op<=27 then
   if op<=25 then
   if op==(25+80-80) and (((SqRVTV*SqRVTV)-SqRVTV)%2)==0 then
   o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS])
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=26 then
   if op==(26*4/4) then
   nZjt1R63[rsbu6WOw]=-nZjt1R63[rsbu6WOw]
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(27*4/4) and ((7*d_QUyNwQvob*d_QUyNwQvob)+d_QUyNwQvob)%2==0 then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=tscYdHnLugc[IAuI5O6T3(OBu1yRtzHJd,RILKDiCcTZ[PxLj0ve[FLJ3HmSr6a]])]
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=28 then
   if op==((28+256)-256) then
   rsbu6WOw=rsbu6WOw-PxLj0ve[FLJ3HmSr6a]
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(29-0) then
   rsbu6WOw=rsbu6WOw+1
   local cAnZ0lAW={}
   iFk9nompG[cAnZ0lAW]=0
   nZjt1R63[rsbu6WOw]=cAnZ0lAW
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=31 then
   if op<=30 then
   if op==(30*4/4) then
   do
   local OD6fdULy=nZjt1R63[rsbu6WOw] local OJCwohZQ=nZjt1R63[rsbu6WOw-1] local cAnZ0lAW=nZjt1R63[rsbu6WOw-PxLj0ve[FLJ3HmSr6a]]
   cAnZ0lAW[OJCwohZQ]=OD6fdULy
   rsbu6WOw=rsbu6WOw-2
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(31-0) then
   error("%>A%}~!$}}%^#Q{][$#@[*A#]X]~".."::ESCAPE-OP="..tostring(op))
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=32 then
   if op==(32-0) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   do
   local aQKTLt=nZjt1R63[rsbu6WOw]
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   rsbu6WOw=rsbu6WOw-1
   nZjt1R63[rsbu6WOw]=Rn0tvXU<=aQKTLt
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((33+256)-256) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   TZZFPaCI1ew[PxLj0ve[FLJ3HmSr6a]].v=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=37 then
   if op<=34 then
   if op==(34*4/4) and (((SqRVTV*SqRVTV)-SqRVTV)%2)==0 then
   do
   local OD6fdULy=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   if OD6fdULy then o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS]) end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=35 then
   if op==(35+80-80) then
   nZjt1R63[rsbu6WOw]=#nZjt1R63[rsbu6WOw]
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=36 then
   if op==(36-0) then
   do
   local PIoOX7_,bfxWir2=PxLj0ve[FLJ3HmSr6a],PxLj0ve[K7xYlj]
   cDkzG6=PIoOX7_<0 and (uIrZgAz<0 and 0 or uIrZgAz) or PIoOX7_
   SYlMuU4T=1
   GqE2cbmuU1=rsbu6WOw-cDkzG6-1-SYlMuU4T
   mNMJ2ET=nZjt1R63[GqE2cbmuU1]
   local LJwgnt94c3Y
   if type(mNMJ2ET)=='table' and mNMJ2ET.pid then
   local m9aZRMqxyv4={n=cDkzG6}
   for RihNc8gRXV=1,cDkzG6 do m9aZRMqxyv4[RihNc8gRXV]=nZjt1R63[GqE2cbmuU1+SYlMuU4T+RihNc8gRXV] end
   LJwgnt94c3Y=ahCRO64Hl(mNMJ2ET.pid,mNMJ2ET.env,mNMJ2ET.uv,m9aZRMqxyv4,lTv70Yw1)
   else
   LJwgnt94c3Y=uYIwNh(mNMJ2ET(gFprng4VL(nZjt1R63,GqE2cbmuU1+1+SYlMuU4T,rsbu6WOw)))
   end
   if bfxWir2==0 then
   rsbu6WOw=GqE2cbmuU1-1
   uIrZgAz=-1
   elseif bfxWir2==-1 then
   p0sM90iJ=LJwgnt94c3Y.n
   for RihNc8gRXV=1,p0sM90iJ do nZjt1R63[GqE2cbmuU1+RihNc8gRXV-1]=LJwgnt94c3Y[RihNc8gRXV] end
   rsbu6WOw=GqE2cbmuU1+p0sM90iJ-1
   uIrZgAz=p0sM90iJ
   else
   for RihNc8gRXV=1,bfxWir2 do nZjt1R63[GqE2cbmuU1+RihNc8gRXV-1]=LJwgnt94c3Y[RihNc8gRXV] end
   rsbu6WOw=GqE2cbmuU1+bfxWir2-1
   uIrZgAz=-1
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(37*4/4) and ((7*d_QUyNwQvob*d_QUyNwQvob)+d_QUyNwQvob)%2==0 then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=nZjt1R63[rsbu6WOw-1]
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   else
   if op<=40 then
   if op<=39 then
   if op<=38 then
   if op==(38*4/4) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   do
   local lrhO1McOhZn=PxLj0ve[FLJ3HmSr6a]
   local tGybToj55=PxLj0ve[aWqLcR]
   local nOw9BxG9Xn=nZjt1R63[rsbu6WOw] local WGX7rK9nP=nZjt1R63[rsbu6WOw-1] local kUrYFERABD6=nZjt1R63[rsbu6WOw-2]
   rsbu6WOw=rsbu6WOw-3
   XD6D39[lrhO1McOhZn].v=kUrYFERABD6
   XD6D39[lrhO1McOhZn+1].v=WGX7rK9nP
   XD6D39[lrhO1McOhZn+2].v=nOw9BxG9Xn
   local XDJNkaXCCwJ=uYIwNh(XD6D39[lrhO1McOhZn].v(XD6D39[lrhO1McOhZn+1].v,XD6D39[lrhO1McOhZn+2].v))
   if XDJNkaXCCwJ[1]==nil then
   o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS])
   else
   XD6D39[lrhO1McOhZn+2].v=XDJNkaXCCwJ[1]
   for RihNc8gRXV=1,tGybToj55 do XD6D39[lrhO1McOhZn+2+RihNc8gRXV]={v=XDJNkaXCCwJ[RihNc8gRXV]} end
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(39+45-45) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   tscYdHnLugc[IAuI5O6T3(OBu1yRtzHJd,RILKDiCcTZ[PxLj0ve[FLJ3HmSr6a]])]=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==((40+256)-256) then
   do
   local PIoOX7_,bfxWir2=PxLj0ve[FLJ3HmSr6a],PxLj0ve[K7xYlj]
   cDkzG6=PIoOX7_<0 and (uIrZgAz<0 and 0 or uIrZgAz) or PIoOX7_
   SYlMuU4T=0
   GqE2cbmuU1=rsbu6WOw-cDkzG6-1-SYlMuU4T
   mNMJ2ET=nZjt1R63[GqE2cbmuU1]
   local LJwgnt94c3Y
   if type(mNMJ2ET)=='table' and mNMJ2ET.pid then
   local m9aZRMqxyv4={n=cDkzG6}
   for RihNc8gRXV=1,cDkzG6 do m9aZRMqxyv4[RihNc8gRXV]=nZjt1R63[GqE2cbmuU1+SYlMuU4T+RihNc8gRXV] end
   LJwgnt94c3Y=ahCRO64Hl(mNMJ2ET.pid,mNMJ2ET.env,mNMJ2ET.uv,m9aZRMqxyv4,lTv70Yw1)
   else
   LJwgnt94c3Y=uYIwNh(mNMJ2ET(gFprng4VL(nZjt1R63,GqE2cbmuU1+1+SYlMuU4T,rsbu6WOw)))
   end
   if bfxWir2==0 then
   rsbu6WOw=GqE2cbmuU1-1
   uIrZgAz=-1
   elseif bfxWir2==-1 then
   p0sM90iJ=LJwgnt94c3Y.n
   for RihNc8gRXV=1,p0sM90iJ do nZjt1R63[GqE2cbmuU1+RihNc8gRXV-1]=LJwgnt94c3Y[RihNc8gRXV] end
   rsbu6WOw=GqE2cbmuU1+p0sM90iJ-1
   uIrZgAz=p0sM90iJ
   else
   for RihNc8gRXV=1,bfxWir2 do nZjt1R63[GqE2cbmuU1+RihNc8gRXV-1]=LJwgnt94c3Y[RihNc8gRXV] end
   rsbu6WOw=GqE2cbmuU1+bfxWir2-1
   uIrZgAz=-1
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=41 then
   if op==(41*4/4) then
   rsbu6WOw=rsbu6WOw+1
   nZjt1R63[rsbu6WOw]=tscYdHnLugc
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((42+256)-256) then
   do
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   nZjt1R63[rsbu6WOw-1]=Rn0tvXU * nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
   else
   if op<=100 then
   if op<=44 then
   if op<=43 then
   if op==((43+256)-256) and ((d_QUyNwQvob*d_QUyNwQvob+d_QUyNwQvob)%2)==0 then
   local cAnZ0lAW=nZjt1R63[rsbu6WOw]
   nZjt1R63[rsbu6WOw]=nZjt1R63[rsbu6WOw-1]
   nZjt1R63[rsbu6WOw-1]=cAnZ0lAW
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==(44-0) then
   do
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   nZjt1R63[rsbu6WOw-1]=Rn0tvXU - nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=50 then
   if op<=49 then
   if op<=47 then
   if op<=46 then
   if op<=45 then
   if op==((45+256)-256) and ((7*d_QUyNwQvob*d_QUyNwQvob)+d_QUyNwQvob)%2==0 then
   do
   local aQKTLt=nZjt1R63[rsbu6WOw]
   local Rn0tvXU=nZjt1R63[rsbu6WOw-1]
   rsbu6WOw=rsbu6WOw-1
   nZjt1R63[rsbu6WOw]=Rn0tvXU<aQKTLt
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((46+256)-256) then
   do
   local lrhO1McOhZn=PxLj0ve[FLJ3HmSr6a]
   local bhA74nIC=nZjt1R63[rsbu6WOw]
   local Fs3qh3UcS=nZjt1R63[rsbu6WOw-1]
   local cnCf2Xi=nZjt1R63[rsbu6WOw-2]
   rsbu6WOw=rsbu6WOw-3
   XD6D39[lrhO1McOhZn]={v=cnCf2Xi}
   XD6D39[lrhO1McOhZn+1].v=cnCf2Xi
   XD6D39[lrhO1McOhZn+2].v=Fs3qh3UcS
   XD6D39[lrhO1McOhZn+3].v=bhA74nIC
   if (bhA74nIC>0 and cnCf2Xi>Fs3qh3UcS) or (bhA74nIC<0 and cnCf2Xi<Fs3qh3UcS) then o_UuAODN=o_UuAODN+(PxLj0ve[K7xYlj]+PxLj0ve[hoWKiDWQAS]) end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==(47*4/4) and ((7*d_QUyNwQvob*d_QUyNwQvob)+d_QUyNwQvob)%2==0 then
   do
   local PIoOX7_=PxLj0ve[FLJ3HmSr6a]
   if PIoOX7_<0 then
   local jJgY7FZPVT=vocMrpGHeR.n or #vocMrpGHeR
   for RihNc8gRXV=1,jJgY7FZPVT do rsbu6WOw=rsbu6WOw+1 nZjt1R63[rsbu6WOw]=vocMrpGHeR[RihNc8gRXV] end
   uIrZgAz=jJgY7FZPVT
   else
   for RihNc8gRXV=1,PIoOX7_ do rsbu6WOw=rsbu6WOw+1 nZjt1R63[rsbu6WOw]=vocMrpGHeR[RihNc8gRXV] end
   uIrZgAz=-1
   end
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op<=48 then
   if op==((48+256)-256) and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   do
   local Rd8JzXqE=PxLj0ve[aWqLcR]
   local CfAZwWgpHl=Rd8JzXqE<0 and ((-Rd8JzXqE-1)+(uIrZgAz<0 and 0 or uIrZgAz)) or Rd8JzXqE
   local PIoOX7_=PxLj0ve[FLJ3HmSr6a]
   if CfAZwWgpHl>PIoOX7_ then
   rsbu6WOw=rsbu6WOw-CfAZwWgpHl+PIoOX7_
   elseif CfAZwWgpHl<PIoOX7_ then
   while CfAZwWgpHl<PIoOX7_ do rsbu6WOw=rsbu6WOw+1 nZjt1R63[rsbu6WOw]=nil CfAZwWgpHl=CfAZwWgpHl+1 end
   end
   uIrZgAz=-1
   end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==((49+256)-256) then
   if uIrZgAz>1 then rsbu6WOw=rsbu6WOw-uIrZgAz+1 end
   uIrZgAz=-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==(50-0) then
   XD6D39[PxLj0ve[FLJ3HmSr6a]].v=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   else
   if op==100 then
   nZjt1R63[rsbu6WOw+1]=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw+1
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op<=103 then
   if op<=101 then
   if op==101 and ((SqRVTV*SqRVTV+SqRVTV)%2)==0 then
   do local _d=1+1 nZjt1R63[rsbu6WOw]=nZjt1R63[rsbu6WOw] end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op<=102 then
   if op==102 and (((d_QUyNwQvob*d_QUyNwQvob)-d_QUyNwQvob)%2)==0 then
   nZjt1R63[rsbu6WOw+1]=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw+1
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   else
   if op==103 and ((7*SqRVTV*SqRVTV)+SqRVTV)%2==0 then
   do local _d=1+1 nZjt1R63[rsbu6WOw]=nZjt1R63[rsbu6WOw] end
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   else
   if op==104 then
   nZjt1R63[rsbu6WOw+1]=nZjt1R63[rsbu6WOw]
   rsbu6WOw=rsbu6WOw+1
   rsbu6WOw=rsbu6WOw-1
   else
   error("&{^~>&$}~#!#[#{>&$&}~~X%?^**".."::FALLBACK-OP="..tostring(op))
   end
   end
   end
   end
   end
  end
 end
 local EMcLMu=uYIwNh(...)
 local nAnPvejFUqM=setmetatable({}, {__mul=function() return ahCRO64Hl(ahCRO64Hl_decode(),1,_G,{},EMcLMu,nil) end})
 return nAnPvejFUqM * 0
end)(IToNbzq2uh)