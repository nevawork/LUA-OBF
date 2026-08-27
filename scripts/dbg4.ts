import { LuaFactory } from "wasmoon";
import { makeKeyStream, normSeed, M31 } from "../src/engine/crypto/cipher";

(async () => {
  const sa = 733567036;
  const sb = 1704268465;
  const ks = makeKeyStream(normSeed(sa), normSeed(sb));
  const k = ks(30);
  console.log("JS ks 30:", Array.from(k));
  
  // Note: cipher.ts initState() does s0 = normSeed(seedA); s1 = normSeed(seedB === seedA ? seedB + 1 : seedB)
  // So with sa != sb, no shift. So initial state matches.
  // But what about sc/sd init? cipher.ts: sc = (s0*31+s1)%M, sd = (s1*17+s0)%M
  // In Lua: sc = (sa*31+sb)%MM
  // Are sa/sb the same as s0/s1 in cipher.ts? Yes, because sa=normSeed(sa), sb=normSeed(sb)
  console.log("normSeed(sa):", normSeed(sa), "normSeed(sb):", normSeed(sb));
  
  // The JS cipher has: s[0]=(s[0]*48271)%M etc. Where M = M31 = 2147483647
  // Same as Lua
})();
