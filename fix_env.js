const fs = require('fs');
let content = fs.readFileSync('src/vm/emitter.ts', 'utf8');

// Replace _ENV in template literals
content = content.replace(/opts\.rootPid,_ENV,/g, 'opts.rootPid,${envGlobal},');
content = content.replace(/,_ENV,{}/g, ',${envGlobal},{}');

// Also fix the comment
content = content.replace(/_ENV bootstrap/g, '${envGlobal} bootstrap');

fs.writeFileSync('src/vm/emitter.ts', content);
console.log('Done');
