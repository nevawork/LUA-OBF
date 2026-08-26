// NEVAHEX-VM — micro-VM assembler + program masking (APEX W1.1)
// Sibling of microvm.ts (ISA). See that file for design constraints.
//
// Asm emits 4-word instructions and resolves label fixups. Address slots:
//   JMP  → word a (slot 0)      JEQZ/JNEZ → word b (slot 1)
//   JLT  → word c (slot 2)
// All operands are bytes; addresses are instruction indices (<256 for the
// fixed decode program), which is what makes byte-lane masking safe.

type Fixup = { wordIndex: number; label: string };

export class Asm {
  words: number[] = [];
  private labels = new Map<string, number>();
  private fixups: Fixup[] = [];

  emit(op: number, a = 0, b = 0, c = 0): void {
    this.words.push(op & 255, a & 255, b & 255, c & 255);
  }

  mark(label: string): void {
    this.labels.set(label, this.words.length);
  }

  jumpTo(op: number, slot: 0 | 1 | 2, a: number, b: number, label: string): void {
    if (slot < 0 || slot > 3) throw new Error("microvm asm: bad slot");
    this.fixups.push({ wordIndex: this.words.length + slot, label });
    this.emit(op, a, b, 0);
  }

  resolve(): number[] {
    for (const f of this.fixups) {
      const instrIndex = this.labels.get(f.label);
      if (instrIndex === undefined) {
        throw new Error(`microvm asm: unresolved label "${f.label}"`);
      }
      const addr = Math.floor(instrIndex / 4);
      if (addr > 255) throw new Error("microvm asm: program exceeds 256 instructions");
      this.words[f.wordIndex] = addr;
    }
    return this.words.slice();
  }
}

/**
 * Doctrine D2 storage form: additive Lehmer stream, one mask byte per word.
 * seed = 0 ⇒ plaintext passthrough (tests).
 */
export function maskProgram(words: number[], seed: number): number[] {
  if (!seed) return words.slice();
  let s = seed;
  return words.map((w) => {
    s = (s * 48271) % 2147483647;
    return (w + (s % 251)) % 256;
  });
}

export function unmaskProgram(words: number[], seed: number): number[] {
  if (!seed) return words.slice();
  let s = seed;
  return words.map((w) => {
    s = (s * 48271) % 2147483647;
    return (((w - (s % 251)) % 256) + 256) % 256;
  });
}
