const fs=require('fs'),cp=require('child_process'),os=require('os'),path=require('path');
const url='http://127.0.0.1:5187/index.html?audit=1';
const chrome=cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--enable-unsafe-swiftshader','--remote-debugging-port=9337','--remote-debugging-address=127.0.0.1','--user-data-dir='+path.join(os.tmpdir(),'furniture-3d-lab-qa'),'--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{let tabs;for(let i=0;i<40;i++){try{tabs=await(await fetch('http://127.0.0.1:9337/json')).json();break;}catch(e){await delay(250);}}
if(!tabs)throw Error('QA chrome unavailable');const t=await(await fetch('http://127.0.0.1:9337/json/new?'+encodeURIComponent(url),{method:'PUT'})).json();
const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0,callbacks=new Map(),runtimeErrors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const c=callbacks.get(m.id);if(c){callbacks.delete(m.id);m.error?c.reject(m.error):c.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown')runtimeErrors.push(m.params.exceptionDetails.text);});
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;callbacks.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1500,height:1000,deviceScaleFactor:1,mobile:false});
for(let i=0;i<100;i++){if(await ev("document.body?.dataset.ready==='true'"))break;await delay(200);}
const report=await ev("document.getElementById('audit-result')?.textContent||JSON.stringify({error:document.body.innerText})");
fs.writeFileSync('QA-REPORT.json',report);console.log(report);
for(const id of ['round950','luggage','daybed','rect1100','side550','window']){await ev("window.furnitureLab.show("+JSON.stringify(id)+")");await delay(500);const image=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa-'+id+'.png',Buffer.from(image.data,'base64'));}
await ev("window.furnitureLab.show('round950');document.getElementById('toggle').click()");await delay(800);
const expl=await ev("({target:document.getElementById('explode').value,parts:window.furnitureLab.getModel().parts.map(g=>({name:g.name,y:g.position.y})),errors:window.furnitureLab.getErrors()})");
console.log('EXPLODE',JSON.stringify(expl));let shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa-exploded.png',Buffer.from(shot.data,'base64'));
await ev("document.querySelector('#parts button').click();document.querySelector('[data-view=top]').click();document.getElementById('wire').click();document.querySelector('[data-finish=dark]').click()");
console.log('INTERACTIONS',await ev("({selected:!!document.querySelector('#parts .selected'),view:document.querySelector('[data-view].active').dataset.view,wire:document.getElementById('wire').checked,finish:document.body.dataset.finish})"));
await ev("document.getElementById('reset').click()");console.log('RESET',await ev("document.getElementById('explode').value"));
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await delay(500);shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa-mobile.png',Buffer.from(shot.data,'base64'));
console.log('MOBILE',await ev("({width:innerWidth,scroll:document.documentElement.scrollWidth})"));console.log('RUNTIME_ERRORS',JSON.stringify(runtimeErrors));
await send('Browser.close').catch(()=>{});process.exit(0);
})().catch(e=>{console.error(e);chrome.kill();process.exit(1)});

