// NEVAHEX-VM — hand-compiled decode program (APEX W1.1)
//
// STATUS: DEFERRED. The program builder needs careful construction (constant
// arithmetic inside the wm cipher fold is the recurring snag — LDI+MUL
// multi-register sequences have tangled each attempt so far). The
// differential fuzz suite that would gate it stays parked with the program.
//
// See APEX plan §A1 implementation notes for the frozen register map and
// compile outline. The interpreter (microvm-exec) is verified end-to-end
// by tests/phase10-microvm.test.ts; a hand-written program that drives
// every opcode proves the execution semantics. The decode program is a
// pure translation of deserializeBlob onto that verified interpreter and
// will land in the next session as a single atomic write.
export {};
