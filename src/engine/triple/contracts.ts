// NEVAHEX-VM — Triple-VM boundary contracts (spec Phase 3)
//
// The artifact is organized as three sealed layers. Each layer exposes only
// opaque handles to the next; no layer can reach another layer's internals
// directly (cross-layer information-leak prevention).
//
//   L1 OUTER SHELL  — blob decryption, environment derivation, resource gates
//   L2 CORE VM      — proto registry, dispatcher, integrity ticks, tiers
//   L3 CONST PLANE  — constant pool access + watermark carriers
//
// Contracts are enforced two ways:
//   • statically: each layer is a Lua do..end closure exposing exactly one
//     bound value to the next layer (sealed table), verified by seal hashes;
//   • dynamically: manifest carries per-layer seal digests; tamper with any
//     layer's slice and its tick fails closed via the tier policy.

export type LayerId = "L1_SHELL" | "L2_VM" | "L3_CONSTS";

export interface LayerContract {
  id: LayerId;
  /** what this layer hands upward (opaque handle description) */
  provides: string;
  /** what this layer consumes from below */
  requires: string[];
}

export const LAYER_CONTRACTS: Record<LayerId, LayerContract> = {
  L1_SHELL: {
    id: "L1_SHELL",
    provides: "decoded proto/const/carrier byte tables (opaque)",
    requires: ["blob literal", "cipher seeds", "environment fingerprint"],
  },
  L2_VM: {
    id: "L2_VM",
    provides: "chunk execution entrypoint run(pid, env, upv, args, escf)",
    requires: ["PROTOS", "ICV/SLICES registries"],
  },
  L3_CONSTS: {
    id: "L3_CONSTS",
    provides: "constant pool C per proto; watermark carriers WM",
    requires: ["PROTOS", "WM table"],
  },
};

/** FNV-style digest over a layer's emitted source region (manifest seal) */
export function layerSeal(sourceRegion: string): number {
  let h = 2166136261 % 1000000007;
  for (let i = 0; i < sourceRegion.length; i++) {
    h = (h * 16777619 + sourceRegion.charCodeAt(i)) % 1000000007;
  }
  return h;
}

export interface LayerSeals {
  l1_shell: number;
  l2_vm: number;
  l3_consts: number;
}

/**
 * Compute seals for the three regions of an assembled artifact.
 * Regions are delimited by the emitted boundary markers.
 */
export function computeLayerSeals(lua: string): LayerSeals {
  const m1 = lua.indexOf("--[L1_SHELL]");
  const m2 = lua.indexOf("--[L2_VM]");
  const m3 = lua.indexOf("--[L3_CONSTS]");
  const end = lua.length;
  if (m1 < 0 || m2 < 0 || m3 < 0) {
    // artifact predates layering markers: seal whole-file slices instead
    return {
      l1_shell: layerSeal(lua.slice(0, Math.floor(end / 3))),
      l2_vm: layerSeal(lua.slice(Math.floor(end / 3), Math.floor((2 * end) / 3))),
      l3_consts: layerSeal(lua.slice(Math.floor((2 * end) / 3))),
    };
  }
  return {
    l1_shell: layerSeal(lua.slice(m1, m2)),
    l2_vm: layerSeal(lua.slice(m2, m3)),
    l3_consts: layerSeal(lua.slice(m3)),
  };
}
