const {protect} = require('./dist/pipeline.js');
const { LuaFactory } = require('wasmoon');

async function main() {
  const r = protect({source:'return 1', tier:'silent', seedHex:'11'.repeat(32)});
  
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  
  const blobMatch = r.lua.match(/local bAsFYQK="([^"]*)"/);
  if (!blobMatch) {
    console.log('No blob match');
    return;
  }
  
  const raw = blobMatch[1];
  const extractScript = `
    local raw = "${raw.replace(/"/g, '\\"')}"
    local result = {}
    for i = 1, #raw do
      local c = raw:byte(i)
      if c == 92 then
        local next = raw:byte(i+1)
        if next == 110 then
          result[#result+1] = string.byte("\\n")
          i = i + 1
        elseif next == 116 then
          result[#result+1] = string.byte("\\t")
          i = i + 1
        elseif next == 114 then
          result[#result+1] = string.byte("\\r")
          i = i + 1
        elseif next == 34 then
          result[#result+1] = string.byte('"')
          i = i + 1
        elseif next == 92 then
          result[#result+1] = string.byte("\\\\")
          i = i + 1
        elseif next == 48 then
          result[#result+1] = 0
          i = i + 1
        else
          result[#result+1] = c
        end
      else
        result[#result+1] = c
      end
    end
    return result
  `;
  
  const result = await lua.doString(extractScript);
  console.log('Blob bytes:', result.length);
  
  const {deserializeBlob} = require('./dist/engine/vm/serializer.js');
  const buf = Buffer.from(result);
  try {
    const decoded = deserializeBlob(buf);
    console.log('Protos:', decoded.flat.length);
    if (decoded.flat[0]) {
      console.log('Root code:', JSON.stringify(decoded.flat[0].code));
    }
  } catch (e) {
    console.log('Deserialize error:', e.message);
  }
  
  lua.global.close();
}

main().catch(console.error);
