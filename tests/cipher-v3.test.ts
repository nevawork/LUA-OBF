// NEVAHEX-VM — cipher v3 tests: doubles-safety bounds, stream properties,
// and JS↔Lua parity. The parity case executes a Lua transcription of the
// EXACT expressions shipped in the emitter decode loops (src/vm/emitter.ts)
// inside wasmoon, and pins them byte-for-byte against makeKeyStream.
import { describe, it, expect, beforeAll } from "vitest";
import {
  M31, normSeed, wmSeeds, makeKeyStream, encryptBytes, decryptBytes,
} from "../src/engine/crypto/cipher";

// Lua mirror of engine/crypto/cipher.ts initState()+step(), using the SAME
// register names as the emitted decode loops (sa/sb/sc/sd/pv).
// Global function so it survives the defining chunk in every Lua state.
const LUA_MIRROR = `
function ks_mirror(seedA, seedB, n)
  local MM = ${M31}
  local sa = ((seedA % ${M31 - 1}) + ${M31 - 1}) % ${M31 - 1}
  local sb = seedB
  if seedB == seedA then sb = seedB + 1 end
  sb = ((sb % ${M31 - 1}) + ${M31 - 1}) % ${M31 - 1}
  if sa < 1 then sa = 1 end
  if sb < 1 then sb = 1 end
  local sc, sd, pv = (sa * 31 + sb) % MM, (sb * 17 + sa) % MM, 0
  local out = {}
  for i = 1, n do
    sa = (sa * 48271) % MM
    sb = (sb * 69621) % MM
    sc = (sc * 2994349) % MM
    sd = (sd * 4050403) % MM
    sb = (sb + pv) % MM
    sc = (sc + sa) % MM
    pv = (math.floor(sa / 65536) * 31 + math.floor(sb / 2048) * 17 +
          math.floor(sc / 1024) * 7 + math.floor(sd / 256) * 3 + pv) % 256
    out[i] = pv
  end
  return out
end
`;

let luaFactory: typeof import("wasmoon").LuaFactory | null = null;

describe("cipher v3 core", () => {
  it("multipliers keep every intermediate below 2^53", () => {
    // (M-1) * maxMultiplier must stay double-exact
    expect((M31 - 1) * 4050403).toBeLessThan(2 ** 53);
    // fold terms: each floor(state/shift)*coef stays far below 2^53
    expect(Math.floor((M31 - 1) / 65536) * 31).toBeLessThan(2 ** 53);
  });

  it("keystream is deterministic and seed-sensitive", () => {
    const a1 = Array.from(makeKeyStream(123456789, 987654321)(64));
    const a2 = Array.from(makeKeyStream(123456789, 987654321)(64));
    const b = Array.from(makeKeyStream(123456788, 987654321)(64));
    expect(a1).toEqual(a2);
    expect(a1).not.toEqual(b);
  });

  it("encrypt/decrypt round-trips (empty, tiny, large)", () => {
    for (const len of [0, 1, 7, 255, 4096]) {
      const data = new Uint8Array(len);
      for (let i = 0; i < len; i++) data[i] = (i * 131 + 17) & 0xff;
      const enc = encryptBytes(data, normSeed(42), normSeed(1337));
      const dec = decryptBytes(enc, normSeed(42), normSeed(1337));
      expect(Array.from(dec)).toEqual(Array.from(data));
    }
  });

  it("wmSeeds pair still feeds distinct streams", () => {
    const [m0, m1] = wmSeeds(normSeed(777));
    expect(m0).not.toBe(m1);
  });

  describe("JS/Lua parity (wasmoon executes the emitter's exact expressions)", () => {
    beforeAll(async () => {
      ({ LuaFactory: luaFactory } = await import("wasmoon"));
    });

    it("lua mirror matches makeKeyStream byte-for-byte", async () => {
      // [seedA, seedB] pairs are PRE-normalized exactly like the pipeline does
      const cases: [number, number][] = [
        [normSeed(123456789), normSeed(987654321)],
        [normSeed(1), normSeed(2)],
        [normSeed(2147483645), normSeed(3)],
        [normSeed(98765), normSeed(98765)], // colliding registers branch
      ];
      const lua = await luaFactory!.createEngine();
      try {
        await lua.doString(LUA_MIRROR);
        for (const [a, b] of cases) {
          const n = 600; // well past init, crosses feedback cycles
          const js = Array.from(makeKeyStream(a, b)(n));
          lua.global.set("saIn", a);
          lua.global.set("sbIn", b);
          lua.global.set("nIn", n);
          await lua.doString("ksRes = ks_mirror(saIn, sbIn, nIn)");
          const got = lua.global.getTable("ksRes");
          const lu = Array.from({ length: n }, (_, i) => got[i + 1]);
          expect(lu).toEqual(js);
        }
      } finally {
        lua.global.close();
      }
    }, 30000);
  });
});
