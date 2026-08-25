// NEVAHEX-VM — runtime module: per-build identifier scrambler
export class IdAllocator {
  private used: Set<string>;

  constructor(reserved: string[] = [], private rng: { ident(len?: number): string; int(n: number): number }) {
    this.used = new Set(reserved);
  }

  alloc(): string {
    for (;;) {
      const n = this.rng.ident(6 + this.rng.int(6));
      if (!this.used.has(n)) {
        this.used.add(n);
        return n;
      }
    }
  }

  /** allocate a group of names at once */
  allocGroup(count: number): string[] {
    return Array.from({ length: count }, () => this.alloc());
  }
}
