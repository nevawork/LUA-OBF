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

// ---------------------------------------------------------------------------
// Phase 7 additions — artifact-level metrics backing the red-team harness.
// ---------------------------------------------------------------------------

/** Shannon entropy of the byte histogram in bits/byte (8.0 = ideal noise) */
export function blobEntropy(bytes: Uint8Array): number {
  if (bytes.length === 0) return 0;
  const hist = new Array<number>(256).fill(0);
  for (let i = 0; i < bytes.length; i++) hist[bytes[i]]++;
  let h = 0;
  for (let b = 0; b < 256; b++) {
    if (hist[b] === 0) continue;
    const p = hist[b] / bytes.length;
    h -= p * Math.log2(p);
  }
  return h;
}

/**
 * Normalize one line for similarity comparison: digits collapse to '#',
 * lowercase, trimmed. Keeps identifier renames from masking structural
 * duplication while still flagging verbatim body reuse across builds.
 */
function normLine(line: string): string {
  return line.replace(/\d+/g, "#").trim().toLowerCase();
}

/**
 * Jaccard similarity over normalized non-trivial lines of two artifacts
 * (lines shorter than 6 chars after normalization are ignored). 1.0 means
 * the two artifacts share their entire line vocabulary — the signature of a
 * static template; healthy cross-build values sit well below 0.15 because
 * only boilerplate keywords (do/end/local/if) are shared.
 */
export function lineJaccard(a: string, b: string): number {
  const setOf = (text: string): Set<string> => {
    const s = new Set<string>();
    for (const raw of text.split("\n")) {
      const n = normLine(raw);
      if (n.length >= 6) s.add(n);
    }
    return s;
  };
  const sa = setOf(a);
  const sb = setOf(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 1 : inter / union;
}
