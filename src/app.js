import * as T from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {createSceneSetup} from './viewer.js';
import {catalog,buildFurniture} from './products/models.js';
const $=s=>document.querySelector(s);const viewport=$('#viewport');
const {scene,camera,renderer,labelRenderer,controls,grid}=createSceneSetup({canvas:$('#canvas'),css2dLayer:$('#labels'),viewportEl:viewport});
scene.background=new T.Color('#e6e9e2');scene.fog=new T.Fog('#e6e9e2',9,22);grid.material.opacity=.13;grid.material.color.set('#7c9276');
controls.maxDistance=15;controls.minDistance=.25;controls.maxPolarAngle=Math.PI*.495;camera.far=60;camera.updateProjectionMatrix();
const pm=new T.PMREMGenerator(renderer);const env=new RoomEnvironment();scene.environment=pm.fromScene(env,.04).texture;env.dispose();pm.dispose();
scene.add(new T.HemisphereLight('#ffffff','#8f9a81',2));const sun=new T.DirectionalLight('#fff1db',3);sun.position.set(3,6,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.bias=-.0003;scene.add(sun);
const floor=new T.Mesh(new T.PlaneGeometry(50,50),new T.ShadowMaterial({color:'#50604c',opacity:.14}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-.004;scene.add(floor);
let active=null,model=null,selected=null,current=0,target=0,frameCount=0,errors=[];const ray=new T.Raycaster();const pointer=new T.Vector2();
window.addEventListener('error',e=>{errors.push(e.message);$('#error').hidden=false;$('#error').textContent=e.message;});
function dispose(root){root.traverse(o=>{if(o.isMesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}if(o.isCSS2DObject)o.element.remove();});scene.remove(root);}
function fit(view='iso'){
model.root.updateMatrixWorld(true);const bounds=new T.Box3();model.parts.forEach(g=>{const b=new T.Box3().setFromObject(g);b.translate(g.userData.offset.clone().multiplyScalar(target-current).multiply(model.root.scale));bounds.union(b);});const size=bounds.getSize(new T.Vector3()),height=size.y,span=Math.max(size.x,size.z,height);const center=bounds.getCenter(new T.Vector3());
const aspect=viewport.clientWidth/viewport.clientHeight;const dist=Math.max(span/(2*Math.tan(T.MathUtils.degToRad(22.5))*Math.min(aspect,1)),height*1.4)*(viewport.clientWidth<500?1.85:1.52);
const vectors={iso:[.85,.65,1],front:[0,.16,1],side:[1,.13,0],top:[0,1,.001]};const dir=new T.Vector3(...vectors[view]).normalize();
controls.target.copy(center);camera.position.copy(center).addScaledVector(dir,dist);camera.lookAt(center);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
}
function select(part){
selected=selected===part?null:part;
model.parts.forEach(g=>g.traverse(o=>{if(!o.isMesh)return;o.material.transparent=!!selected&&g!==selected;o.material.opacity=selected&&g!==selected?.18:1;o.material.depthWrite=!selected||g===selected;}));
$('#detail').textContent=selected?selected.name+' — '+selected.userData.description:'คลิกชื่อชิ้นส่วนเพื่อเน้นเฉพาะส่วนที่ต้องการ';
document.querySelectorAll('#parts button').forEach((b,i)=>b.classList.toggle('selected',model.parts[i]===selected));model.parts.forEach(g=>g.userData.label.element.classList.toggle('focus',g===selected));
}
function show(id){
if(model)dispose(model.root);active=catalog.find(c=>c.id===id)||catalog[0];model=buildFurniture(active);scene.add(model.root);selected=null;current=target=0;$('#explode').value=0;$('#pct').textContent='0%';$('#toggle').textContent='แยกชิ้นส่วนทั้งหมด ↗';$('#detail').textContent='คลิกชื่อชิ้นส่วนเพื่อเน้นเฉพาะส่วนที่ต้องการ';$('#code').textContent=active.code;$('#title').textContent=active.name;$('#dims').textContent=active.dims;
$('#assumptions').innerHTML='<b>อ่านได้จากแบบ</b><p>'+active.known+'</p><b>ส่วนที่ประมาณ</b><p>'+active.approx+'</p><p>ไม่สร้างรูเจาะ/อุปกรณ์ยึดที่ไม่มีข้อมูล • ไม่ใช้เป็นแบบผลิต</p>';
$('#parts').replaceChildren();
model.parts.forEach(g=>{const el=document.createElement('div');el.className='label';el.textContent=g.name;const label=new CSS2DObject(el);label.position.copy(g.userData.anchor);g.add(label);g.userData.label=label;label.visible=$('#labelsToggle').checked;
const b=document.createElement('button');b.textContent=g.name;const sm=document.createElement('small');sm.textContent=g.userData.mat;b.append(sm);b.onclick=()=>select(g);$('#parts').append(b);});
document.querySelectorAll('#products button').forEach(b=>b.classList.toggle('active',b.dataset.id===active.id));$('#wire').checked=false;applyFinish(document.body.dataset.finish||'warm');fit();updateStatus();
}
function applyFinish(finish){document.body.dataset.finish=finish;const pal={warm:'#9f7a55',dark:'#69534a',light:'#e0cbab'};model.root.traverse(o=>{if(o.isMesh&&o.material.userData.kind==='wood')o.material.color.set(pal[finish]);});}
function updateStatus(){$('#renderState').textContent=model.parts.length+' ASSEMBLIES · '+active.dims;document.body.dataset.ready='true';document.body.dataset.model=active.id;}
catalog.forEach((c,i)=>{const b=document.createElement('button');b.dataset.id=c.id;b.innerHTML='<i>0'+(i+1)+'</i><div><b>'+c.name+'</b><small>'+c.dims+'</small></div>';b.onclick=()=>show(c.id);$('#products').append(b);});
$('#explode').oninput=e=>{target=Number(e.target.value)/100;$('#pct').textContent=Math.round(target*100)+'%';$('#toggle').textContent=target>0?'ประกอบกลับ ↙':'แยกชิ้นส่วนทั้งหมด ↗';fit(document.querySelector('[data-view].active')?.dataset.view||'iso');};
$('#toggle').onclick=()=>{target=target>.1?0:1;$('#explode').value=target*100;$('#explode').dispatchEvent(new Event('input'));};
$('#labelsToggle').onchange=e=>model.parts.forEach(g=>g.userData.label.visible=e.target.checked);
$('#wire').onchange=e=>model.root.traverse(o=>{if(o.isMesh)o.material.wireframe=e.target.checked;});
$('#spin').onchange=e=>controls.autoRotate=e.target.checked;
document.querySelectorAll('[data-finish]').forEach(b=>b.onclick=()=>applyFinish(b.dataset.finish));
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>fit(b.dataset.view));
$('#reset').onclick=()=>show(active.id);
$('#snapshot').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='FurnitureLab-'+active.id+'-PROTOTYPE.png';a.href=renderer.domElement.toDataURL('image/png');a.click();};
let down=null;renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObject(model.root,true).find(h=>h.object.isMesh);if(hit){let g=hit.object;while(g.parent!==model.root)g=g.parent;select(g);}});
window.addEventListener('resize',()=>fit(document.querySelector('[data-view].active')?.dataset.view||'iso'));
const clock=new T.Clock();
function tick(){requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.04);current=T.MathUtils.damp(current,target,7,dt);model.parts.forEach(g=>g.position.copy(g.userData.origin).addScaledVector(g.userData.offset,current));controls.update();renderer.render(scene,camera);labelRenderer.render(scene,camera);frameCount++;}
const params=new URLSearchParams(location.search);show(params.get('model'));tick();
window.furnitureLab={catalog,show,fit,setExplode:v=>{target=v;},getModel:()=>model,getErrors:()=>errors};
if(params.has('audit')){
const report=[];for(const c of catalog){show(c.id);renderer.render(scene,camera);let finite=true,meshes=0;model.root.traverse(o=>{if(o.isMesh){meshes++;if(!Number.isFinite(o.geometry.attributes.position.array[0]))finite=false;}});
const b=new T.Box3().setFromObject(model.root);const size=b.getSize(new T.Vector3());report.push({id:c.id,groups:model.parts.length,meshes,finite,boundsMM:size.toArray().map(v=>Math.round(v*1000)),renderCalls:renderer.info.render.calls,dimensionMatch:Math.abs(size.x-c.w)<.001&&Math.abs(size.y-c.h)<.001&&Math.abs(size.z-c.d)<.001});}
show(params.get('model'));const pre=document.createElement('pre');pre.id='audit-result';pre.hidden=true;pre.textContent=JSON.stringify({models:report,errors,pass:report.every(r=>r.finite&&r.meshes>0&&r.groups>=3&&r.renderCalls>0&&r.dimensionMatch)});document.body.append(pre);}
if(params.has('exploded')){target=current=1;$('#explode').value=100;$('#pct').textContent='100%';}
