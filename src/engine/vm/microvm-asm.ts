// NEVAHEX-VM — runtime module: assembler with label resolution
//
// Emits 4-word instructions: [op, a, b, c] where:
//   word 0 = opcode
//   word 1 = a (register or immediate)
//   word 2 = b (register or address for JEQZ/JNEZ)
//   word 3 = c (register or address for JLT)
//
// The `addrSlot` parameter in jumpTo indicates which word (1, 2, or 3)
// receives the resolved address:
//   JMP  → slot 1 (word 1, a-field)
//   JEQZ/JNEZ → slot 2 (word 2, b-field)
//   JLT → slot 3 (word 3, c-field)
//
// All operands are bytes; addresses are instruction indices (<256 for the
// fixed decode program), which is what makes byte-lane masking safe.
import { OP } from "./microvm";

export class Asm {
  words: number[] = [];
  private labels = new Map<string, number>();
  private fixups: { wordIndex: number; label: string }[] = [];

  emit(op: number, a = 0, b = 0, c = 0): void {
    this.words.push(op & 255, a & 255, b & 255, c & 255);
  }

  mark(label: string): void {
    this.labels.set(label, this.words.length);
  }

  /**
   * Emit a jump/branch instruction with a label reference.
   * @param op - the jump opcode (JMP, JEQZ, JNEZ, JLT)
   * @param addrSlot - which word receives the address (1=a, 2=b, 3=c)
   * @param regA - register for a-field (or 0 for JMP)
   * @param regB - register for b-field (for JLT, the second compare register)
   * @param label - label to resolve
   */
  jumpTo(
    op: number,
    addrSlot: 1 | 2 | 3,
    regA: number,
    regB: number,
    label: string,
  ): void {
    if (op === OP.JMP) {
      // JMP: address in slot 1 (a-field), no registers used
      this.fixups.push({ wordIndex: this.words.length + 1, label });
      this.emit(OP.JMP, 0, 0, 0);
    } else if (op === OP.JEQZ || op === OP.JNEZ) {
      // JEQZ/JNEZ: [op, reg, addr, 0] - address in word 2 (b-field)
      this.fixups.push({ wordIndex: this.words.length + 2, label });
      this.emit(OP.JEQZ, 1, 0, 0); // placeholder reg, addr patched later
    } else if (op === OP.JLT) {
      // JLT: [op, regA, regB, addr] - address in word 3 (c-field)
      this.fixups.push({ wordIndex: this.words.length + 3, label });
      this.emit(OP.JLT, 0, 0, 0);
    } else {
      throw new Error("microvm asm: unsupported jump opcode");
    }
  }

  // Convenience helpers for common jump patterns
  jumpIfZero(reg: number, label: string): void {
    this.jumpTo(OP.JEQZ, 2, reg, 0, label);
  }
  jumpIfNotZero(reg: number, label: string): void {
    this.jumpTo(OP.JNEZ, 2, reg, 0, label);
  }
  jumpLess(regA: number, regB: number, label: string): void {
    this.jumpTo(OP.JLT, 3, regA, regB, label);
  }
  jumpAlways(label: string): void {
    this.jumpTo(OP.JMP, 1, 0, 0, label);
  }

  resolve(): number[] {
    for (const f of this.fixups) {
      const instrIndex = this.labels.get(f.label);
      if (instrIndex === undefined) throw new Error(`microvm asm: unresolved label ${f.label}`);
      const addr = Math.floor(instrIndex / 4);
      if (addr > 255) throw new Error("microvm asm: program exceeds 256 instructions");
      this.words[f.wordIndex] = addr;
    }
    return this.words.slice();
  }
}