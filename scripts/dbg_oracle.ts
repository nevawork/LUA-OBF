import { decryptBlob, deserializeBlob } from "../src/vm/serializer";
import { initialRk, stepRk, decodeOp, Op } from "../src/engine/runtime/opencode";
import { parse } from "../src/lang/parser";
import { compileChunk } from "../src/vm/compiler";
import * as fs from "fs";

const dbg = JSON.parse(fs.readFileSync("scripts/_dbg.json", "utf8"));
const perm = dbg.perm as number[];
const oc = dbg.opencode as { rk0: number; astep: number; astep2: number; ainc: number };
const seeds = dbg.seeds as number[];
const blob = Uint8Array.from(dbg.blob);

const chunk = parse("EXPECTED = 42", "lua51");
const root = compileChunk(chunk);

const names: any = {};
for (const k in Op) names[Op[k]] = k;

function dumpProto(p: any, d = 0) {
  console.log(`proto d=${d} code=${p.code.length} protos=${p.protos.length}`);
  for (const ins of p.code) {
    console.log("  logical:", names[ins[0]] ?? "?" + ins[0], ins.slice(1).join(","));
  }
  for (const sub of p.protos) dumpProto(sub, d + 1);
}

console.log("=== COMPILER TREE ===");
dumpProto(root);

const plain = decryptBlob(blob, seeds);
const deser = deserializeBlob(plain, { opencode: oc });

console.log("\n=== DESERIALIZER TREE ===");
for (let pid = 0; pid < deser.flat.length; pid++) {
  const p = deser.flat[pid];
  console.log(`proto pid=${pid + 1} code=${p.code.length} protos=${p.protos.length}`);
  let rk = initialRk(oc, pid + 1);
  for (let i = 0; i < p.code.length; i++) {
    const ins = p.code[i];
    const opE = ins[0];
    const op = decodeOp(opE, rk);
    const logical = perm.findIndex((v) => v === op);
    console.log(
      `  i=${i}: wire opE=${opE} decoded op=${op} logical=${logical} ${names[logical] ?? "?"} A=${ins[1]} B=${ins[2]} C=${ins[3]}`
    );
    rk = stepRk(oc, rk);
  }
}
