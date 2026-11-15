import './check-encoding.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
for(const p of ['index.html','src/app.js','src/viewer.js','src/products/models.js','LICENSE'])assert(fs.existsSync(p),p+' missing');
const s=fs.readFileSync('src/products/models.js','utf8'),ids=[...s.matchAll(/id:'([^']+)'/g)].map(m=>m[1]);assert.equal(ids.length,6);assert.equal(new Set(ids).size,6);
for(const p of ['index.html','src/app.js','src/products/models.js'])assert(!/HYATT|PST-F-|SPT-F-|DEC-F-|src\/modules\/SceneSetup/.test(fs.readFileSync(p,'utf8')),'Unexpected source identifier/import in '+p);
console.log('Source checks passed: six unique models; no original client identifiers or PRISM module import.');
