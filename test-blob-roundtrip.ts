function luaEscape(bytes: Buffer): string {
  let out = '"';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === 34) out += '\\"';
    else if (b === 92) out += "\\\\";
    else if (b >= 40 && b <= 126) out += String.fromCharCode(b);
    else out += "\\" + b.toString(10).padStart(3, "0");
  }
  return out + '"';
}

const original = Buffer.from([0, 1, 2, 127, 128, 255, 34, 92]);
const escaped = luaEscape(original);
console.log('Original:', Array.from(original));
console.log('Escaped:', escaped);

const tmpFile = '/tmp/kilo/blob-roundtrip.lua';
require('fs').writeFileSync(tmpFile, `local s=${escaped}\nprint(string.byte(s,1),string.byte(s,2),string.byte(s,3),string.byte(s,4),string.byte(s,5),string.byte(s,6),string.byte(s,7),string.byte(s,8))`);
console.log('Written test file');
