// NEVAHEX-VM — hand-compiled decode program (APEX W1.1)
//
// STATUS: DEFERRED. The atomic-write attempt in the previous session
// re-introduced the exact failure mode the v3 plan flags as R10 (mid-file
// register collision; partial build shipped with a ROLLBACK comment and
// HALT before the main work). Per the plan's R10 doctrine, this file is
// reset to the STATUS-DEFERRED stub rather than ship incomplete.
//
// A correct landing requires a layered compiler where each decode phase
// (framing, proto skeleton, uv loop, const dispatch, code with lrk, wm
// tail) is its own self-contained emit function the main program composes
// from. The first viable path: split per-phase (microvm-program-frames.ts
// / -uv.ts / -consts.ts / -code.ts / -wm.ts), each tested in isolation
// against the verified interpreter, then the top-level assembler glues
// them. That decomposition lands in a fresh session.
//
// The interpreter (microvm-exec), assembler (microvm-asm), and builders
// (microvm-builders) remain verified and ship-ready.
export {};
