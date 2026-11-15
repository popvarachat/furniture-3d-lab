import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(p=>/\.(md|js|mjs|cjs|json|css|html|yml)$/.test(p));
const decoder=new TextDecoder('utf-8',{fatal:true});
for(const p of paths){const s=decoder.decode(fs.readFileSync(p));assert(!/[\uFFFD]|\u00e0[\u00b8\u00b9]|\u00e2\u2020|\u00ef\u00bb\u00bf/.test(s),'Possible text encoding corruption: '+p);}
assert(fs.readFileSync('README.md','utf8').includes('เริ่มใช้งาน'),'README Thai heading missing');
console.log('UTF-8 and mojibake checks passed: '+paths.length+' tracked text files.');
