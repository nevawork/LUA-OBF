const fs = require('fs');
const content = fs.readFileSync('samples/test_debug.lua', 'utf8');
const fullContent = content;

const localTableRegex = /local\s+([a-zA-Z0-9_]+)\s*=\s*\{/g;
let match;
const tables = [];
while ((match = localTableRegex.exec(fullContent)) !== null) {
  tables.push({ name: match[1], pos: match.index });
}

console.log('Found', tables.length, 'table assignments');

tables.forEach(t => {
  const escapedName = t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const usageRegex = new RegExp(escapedName + '\\s*[+\\-*/^]');
  const usageMatch = fullContent.match(usageRegex);
  if (usageMatch) {
    console.log('TABLE USED IN ARITHMETIC:', t.name, 'at', usageMatch.index);
    const idx = usageMatch.index;
    console.log('Context:', JSON.stringify(fullContent.substring(Math.max(0, idx-100), idx+100)));
  }
});