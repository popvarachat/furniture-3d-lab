import * as T from 'three';
export function addBackdrop(scene,id,size){
const geos=[],mats=[];const width=Math.max(size.x,1),depth=Math.max(size.z,.7),back=-(depth/2+.9),side=width/2+.65,height=Math.max(size.y+1.1,2.2);
function box(w,h,d,x,y,z,color,roughness=.85,metalness=0){const g=new T.BoxGeometry(w,h,d),m=new T.MeshStandardMaterial({color,roughness,metalness});geos.push(g);mats.push(m);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;scene.add(o);return o;}
function sphere(r,x,y,z,color,sx=1,sy=1,sz=1){const g=new T.SphereGeometry(r,14,10),m=new T.MeshStandardMaterial({color,roughness:.9});geos.push(g);mats.push(m);const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);scene.add(o);}
function plant(x,z){box(.24,.32,.24,x,.16,z,'#ac9d80');box(.025,.65,.025,x,.6,z,'#6e7250');for(let i=0;i<6;i++){const a=i*Math.PI/3;sphere(.18,x+Math.cos(a)*.13,.58+i*.06,z+Math.sin(a)*.13,'#778668',.7,1.3,.45);}}
const floorColor={studio:'#e6e4dc',living:'#bba990',hotel:'#b7b0a2',window:'#dddcd1',terrace:'#b9b6a0'}[id]||'#e6e4dc';
box(Math.max(width+7,10),.025,10,0,-.02,0,floorColor);
if(id==='studio')return ()=>{geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());};
if(id==='hotel'){
box(width+6,height,.08,0,height/2,back,'#414944');for(let x=-side-1;x<=side+1;x+=.58)box(.014,height,.015,x,height/2,back+.05,'#b4a077',.35,.55);
box(width+1,.008,depth+.75,0,-.002,.05,'#cdc7b9');plant(-side,back+.35);box(.24,1.02,.24,side,.51,back+.35,'#777366');sphere(.14,side,1.16,back+.35,'#c5b58c');
}else if(id==='living'){
box(width+6,height,.08,0,height/2,back,'#dbcfba');box(width+.55,.012,depth+.45,0,-.001,.02,'#ded4c1');
box(.65,.8,.04,-side*.6,1.3,back+.06,'#a38a6d');box(.53,.68,.045,-side*.6,1.3,back+.09,'#e3d9c5');sphere(.17,-side*.6,1.3,back+.13,'#ad9e85',1,1,.15);
box(.03,1.45,.03,side,.725,back+.4,'#71634f');box(.32,.015,.32,side,.01,back+.4,'#71634f');sphere(.23,side,1.5,back+.4,'#e4d9bf',1,.6,1);plant(-side,back+.45);
}else if(id==='window'){
box(width+6,height,.08,0,height/2,back,'#dfe6df');box(width+2,height*.8,.04,0,height*.55,back+.07,'#b5ccd0');
for(let i=-2;i<=2;i++)box(.035,height*.8,.05,i*(width+2)/4,height*.55,back+.1,'#e9e9dc');
box(width+2,.045,.06,0,height*.22,back+.11,'#e9e9dc');box(width+2,.045,.06,0,height*.74,back+.11,'#e9e9dc');
box(width+.5,.014,depth+.35,0,-.001,.07,'#efeee5');plant(side,back+.5);plant(-side,back+.5);
}else if(id==='terrace'){
box(width+6,height,.05,0,height/2,back,'#cfdfcd');for(let i=0;i<13;i++)box(width+5,.008,.018,0,-.001,-3+i*.45,'#a39e87');
box(width+4,.06,.07,0,.85,back+.2,'#8b9883');for(let i=-4;i<=4;i++)box(.035,.8,.035,i*(width+4)/8,.4,back+.2,'#8b9883');
plant(-side,back+.45);plant(side,back+.45);for(let i=0;i<6;i++)sphere(.35,-side-.5+i*.4,.7+(i%2)*.3,back+.04,'#8caa7a',1,.9,.3);
}
return ()=>{geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());};
}
