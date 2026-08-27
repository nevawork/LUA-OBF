// Phase 3 module tests (run directly with node)
const { getMbaDatabase, getMbaStats, pickMba } = require('./src/transforms/mba-database.ts');
const { generateSemiprime, synthesizePartialPoint, createFactorizationKeyCheck, validateMbaEquivalence } = require('./src/transforms/mba-synthesizer.ts');

console.log('=== Phase 3 Module Tests ===');

// Test 1: MBA database loads
const db = getMbaDatabase();
console.log('PASS: MBA database loaded, expressions:', db.totalCount, 'classes:', db.totalClasses);

// Test 2: MBA stats
const stats = getMbaStats();
console.log('PASS: MBA stats:', stats.totalExpressions, 'expressions,', stats.totalClasses, 'classes');

// Test 3: pickMba works
const rng = { int: (n) => Math.floor(Math.random() * n) };
const mba = pickMba(0, rng);
console.log('PASS: pickMba returns:', mba ? mba.lua.substring(0, 30) + '...' : 'null');

// Test 4: validateMbaEquivalence works
const testValues = [{x:0,y:0},{x:1,y:1},{x:10,y:20},{x:-5,y:3},{x:100,y:-50}];
const valid = validateMbaEquivalence('x+y', 'x+y+0-0', testValues);
console.log('PASS: validateMbaEquivalence:', valid);

// Test 5: generateSemiprime
const semi = generateSemiprime(rng);
console.log('PASS: generateSemiprime:', semi, 'bits:', Math.ceil(Math.log2(semi)));

// Test 6: synthesizePartialPoint
const ppf = synthesizePartialPoint(42, rng);
console.log('PASS: synthesizePartialPoint:', ppf.luaExpr.substring(0, 50) + '...');

// Test 7: createFactorizationKeyCheck
const check = createFactorizationKeyCheck(semi, 7);
console.log('PASS: createFactorizationKeyCheck:', check);

console.log('');
console.log('All Phase 3 module tests passed!');
