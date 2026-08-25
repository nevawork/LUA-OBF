// debug: verify keystream seeds embedded in output match manifest
const { protect } = require("../dist/pipeline.js");
const fs = require("fs");

const r = protect({ source: "return 42", tier: "off", seed: "ab".repeat(32) });
console.log("manifest seeds:", r.manifest.seeds);

// pull the two obf'd seed lines out of generated lua
const m0 = r.lua.match(/ local sa=(\S+) sb=(\S+) MM=/);
console.log("emitted sa expr:", m0[1]);
console.log("emitted sb expr:", m0[2]);

// evaluate them safely
const ev = (s) => Function(`"use strict"; return (${s});`)();
console.log("evaluated sa:", ev(m0[1]), "expected:", ((r.manifest.seeds[0] % 2147483646) + 2147483646) % 2147483646 + 1);
console.log("evaluated sb:", ev(m0[2]), "expected:", ((r.manifest.seeds[1] % 2147483646) + 2147483646) % 2147483646 + 1);
