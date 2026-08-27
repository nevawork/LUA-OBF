import { parse } from "../src/lang/parser";
import { encryptStrings } from "../src/transforms/strings";
import { BuildRng, sha256 } from "../src/gen/prng";

const src = `local nk0xq = function(k, s)
  local r = ""
  local g = k % 2147483646
  if g == 0 then g = 1 end
  local n = #s
  for i = 1, n do
    g = (g*48271) % 2147483647
    r = r .. "x"
  end
  return r
end
return 1+1`;

(async () => {
  const seedHex = "11".repeat(32);
  const nonce = Buffer.from(seedHex.replace(/[^0-9a-fA-F]/g, "").padEnd(64, "0").slice(0, 64), "hex");
  const master = sha256(nonce, Buffer.from("NEVAHEX-ABYSS-v21"));
  const rng = new BuildRng(master);
  
  const chunk = parse(src);
  encryptStrings(chunk, rng);
  // Print the chunk
  console.log(JSON.stringify(chunk, null, 2).slice(0, 4000));
})();
