// NEVAHEX-VM — handler-diversity metric (spec Phase 1 replacement claim)
// "Feature extraction from handler bodies must produce feature vectors with
//  pairwise cosine similarity < 0.15 across builds."
//
// We operationalize this without ML: each build's runtime is characterized by
// (a) its physical opcode permutation, (b) the dispatch-chain order of handler
// bodies, (c) identifier pools. Similarity = weighted overlap; the pipeline
// stores a dispatch fingerprint per build in the manifest for comparison.

export interface BuildFingerprint {
  /** perm[logical] = physical */
  perm: number[];
  /** order in which physical ops appear in the emitted dispatch chain */
  dispatchOrder: number[];
}

/** cosine similarity over bag-of-ranks vectors; 1.0 = identical layout */
export function layoutSimilarity(a: BuildFingerprint, b: BuildFingerprint): number {
  if (a.perm.length !== b.perm.length) return 1;
  const n = a.perm.length;
  // feature vector: position of each logical op in physical space + chain order
  const va = featureVec(a, n);
  const vb = featureVec(b, n);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < va.length; i++) {
    dot += va[i] * vb[i];
    na += va[i] * va[i];
    nb += vb[i] * vb[i];
  }
  if (na === 0 || nb === 0) return 1;
  return dot / Math.sqrt(na * nb);

  function featureVec(f: BuildFingerprint, size: number): number[] {
    const v = new Array<number>(size * 2).fill(0);
    for (let logical = 0; logical < size; logical++) {
      v[f.perm[logical]] = 1 + 1 / (size + logical + 1); // permutation component
    }
    f.dispatchOrder.forEach((phys, idx) => {
      v[size + phys] = 1 + 1 / (size + idx + 1); // chain-order component
    });
    return v;
  }
}
