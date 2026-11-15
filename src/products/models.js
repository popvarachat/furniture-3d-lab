import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
export const catalog=[
{id:'round950',code:'DEMO-01',name:'โต๊ะกลม Coffee Table',dims:'Ø950 × H720 mm',w:.95,d:.95,h:.72,known:'Ø950 / H720 / ฐาน Ø600 / ขา Ø200–280 / หิน 12 mm + MDF 19 mm',approx:'สีหิน ลายวีเนียร์ รายละเอียดขอบ และชั้นรองใต้ท็อปที่แบบไม่ได้ระบุครบ เป็นภาพจำลอง',type:'round'},
{id:'luggage',code:'DEMO-02',name:'Luggage Rack',dims:'W1500 × D575 × H750 mm',w:1.5,d:.575,h:.75,known:'กว้าง 1500 / ช่วงใน 1400 / ลึกโดยรวม 575 / สูงรวม 750 / R75 ตามแบบ',approx:'ความหนาโครงและความโค้งขาขึ้นรูปประมาณจากรูป ไม่มีรายละเอียดรูเจาะ/จุดยึด',type:'luggage'},
{id:'daybed',code:'DEMO-03',name:'Daybed',dims:'W1975 × D975 × H775 mm',w:1.975,d:.975,h:.775,known:'ยาว 1975 / ลึก 975 / สูงรวม 775 / พนักช่วงยาว 1325 / หมอน 650×650 และ 500×500 mm',approx:'ความนุ่มเบาะ โค้งพนัก มุมเอนหมอน และความหนาชิ้นย่อยประมาณจากภาพ',type:'daybed'},
{id:'rect1100',code:'DEMO-04',name:'โต๊ะ Coffee Table',dims:'W1100 × D750 × H400 mm',w:1.1,d:.75,h:.4,known:'1100 × 750 / สูงรวม 400 / ระดับใต้ท็อป 350 / ขอบ 19 mm / แผ่นล่าง 16 mm',approx:'ขนาดหน้าตัดขา การสอบขา รอยต่อ และระดับแผ่นล่างบางส่วนประมาณจากภาพ',type:'rect'},
{id:'side550',code:'DEMO-05',name:'Side Table',dims:'Ø550 × H450 mm',w:.55,d:.55,h:.45,known:'Ø550 / H450 / ฐาน Ø350 / คอ Ø100 / หินควอตซ์ 12 mm / ฐานล่างสูง 300 mm',approx:'รอยต่อฐาน/คอ ความหนารองท็อป และผิว stainless dark brown เป็นการจำลอง',type:'side'},
{id:'window',code:'DEMO-06',name:'Window Seat',dims:'W3900 × D700 × H695 mm',w:3.9,d:.7,h:.695,known:'ยาว 3900 แบ่ง 1950+1950 / ลึก 700 / สูงรวม 695 / ขา Ø120 / หมอนหลายขนาดตามแบบ',approx:'ตำแหน่งขาตรงกลาง ความโค้งพนัก/หมอน จุดยึด และความหนาโครงบางส่วนประมาณจากภาพ',type:'window'}
];
function texture(kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');let s=37;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647;};x.fillStyle=kind==='wood'?'#b49671':kind==='fabric'?'#e4dfd3':'#eee9dd';x.fillRect(0,0,256,256);if(kind==='wood'){for(let i=0;i<190;i++){x.strokeStyle='rgba(66,41,22,'+(rnd()*.12)+')';x.beginPath();const y=rnd()*256;x.moveTo(0,y);x.bezierCurveTo(70,y+rnd()*9,170,y-rnd()*9,256,y+rnd()*5);x.stroke();}}else if(kind==='fabric'){for(let i=0;i<256;i+=2){x.strokeStyle='rgba(97,88,70,.12)';x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.moveTo(0,i);x.lineTo(256,i);x.stroke();}}else{for(let i=0;i<18;i++){x.strokeStyle='rgba(142,132,113,.18)';x.beginPath();let y=rnd()*256;x.moveTo(0,y);for(let j=0;j<9;j++)x.lineTo(j*33,y+=(rnd()-.5)*35);x.stroke();}}const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.repeat.set(kind==='fabric'?3:1,kind==='fabric'?3:1);return tx;}
const maps={wood:texture('wood'),fabric:texture('fabric'),stone:texture('stone')};
function material(kind){const pal={wood:'#9f7a55',fabric:'#d4d0c2',stone:'#f5f0e5',metal:'#55433b'};const m=new T.MeshStandardMaterial({color:pal[kind]||pal.wood,map:maps[kind],roughness:kind==='metal'?.33:kind==='stone'?.28:.74,metalness:kind==='metal'?.75:0});m.userData.kind=kind;return m;}
export function buildFurniture(item){
const root=new T.Group();root.name=item.id;const parts=[];
function part(name,mat,description,offset){const g=new T.Group();g.name=name;g.userData={description,mat,offset:new T.Vector3(...offset)};root.add(g);parts.push(g);return g;}
function add(g,geo,p,kind='wood',rotation){const m=new T.Mesh(geo,material(kind));m.position.set(...p);if(rotation)m.rotation.set(...rotation);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
const box=(g,w,h,d,p,kind='wood',r=.008)=>add(g,new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),p,kind);
const cyl=(g,rt,rb,h,p,kind='wood',n=64)=>add(g,new T.CylinderGeometry(rt,rb,h,n),p,kind);
function bar(g,a,b,r=.015,kind='wood'){const A=new T.Vector3(...a),B=new T.Vector3(...b);const m=add(g,new T.CylinderGeometry(r,r,A.distanceTo(B),16),A.clone().add(B).multiplyScalar(.5).toArray(),kind);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),B.sub(A).normalize());return m;}
function curve(g,points,r=.02,kind='wood'){const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return add(g,new T.TubeGeometry(path,48,r,12,false),[0,0,0],kind);}
function legs(g,w,d,top,foot,r=.025){for(const x of [-1,1])for(const z of [-1,1]){const m=add(g,new T.CylinderGeometry(r,r*.68,top-foot,4),[x*w/2,(top+foot)/2,z*d/2]);m.rotation.y=Math.PI/4;m.rotation.z=-x*.08;m.rotation.x=z*.07;}}
function pillow(g,w,h,x,y,z,tilt=-.18){const m=box(g,w,h,.115,[x,y,z],'fabric',.045);m.rotation.x=tilt;const edge=new T.LineSegments(new T.EdgesGeometry(m.geometry,35),new T.LineBasicMaterial({color:'#a9a394',transparent:true,opacity:.35}));m.add(edge);return m;}
if(item.type==='round'){
const base=part('03 ฐานกลม','MDF ปิดผิววีเนียร์','ฐาน Ø600 mm; ความหนาจำลอง 25 mm',[0,0,0]);cyl(base,.3,.3,.025,[0,.0125,0]);
const stem=part('02 ขาทรงกรวย','โครงไม้ / MDF ปิดวีเนียร์','คอบน Ø200 ฐานขา Ø280 mm',[0,.23,0]);cyl(stem,.1,.14,.645,[0,.3475,0]);
const sub=part('01b แผ่นรองท็อป','MDF BOARD 19 mm','ชั้นรองท็อป MDF 19 mm ตามข้อความวัสดุ',[0,.49,0]);cyl(sub,.465,.465,.019,[0,.6985,0]);cyl(sub,.425,.425,.019,[0,.6795,0]);
const top=part('01a ผิวท็อป','หินควอตซ์ 12 mm','ท็อป Ø950 mm; ระดับสูงสุด 720 mm',[0,.69,0]);cyl(top,.475,.475,.012,[0,.714,0],'stone');
}else if(item.type==='side'){
const base=part('03 ฐานล่าง','MDF ขึ้นรูป ปิดวีเนียร์','สูง 300 mm ฐาน Ø350 mm คอ Ø100 mm',[0,0,0]);cyl(base,.05,.175,.3,[0,.15,0]);
const neck=part('02 ฐานบน','MDF / stainless dark brown','ทรงกรวยกลับตามภาพแบบ; รายละเอียดชั้นรองประมาณ',[0,.22,0]);cyl(neck,.268,.05,.125,[0,.3625,0],'metal');cyl(neck,.268,.268,.013,[0,.4315,0],'metal');
const top=part('01 ท็อปควอตซ์','หินควอตซ์ 12 mm','Ø550 mm / สูงรวม 450 mm',[0,.43,0]);cyl(top,.275,.275,.012,[0,.444,0],'stone');
}else if(item.type==='rect'){
const frame=part('01 โครงโต๊ะ','ไม้จริง ปิดวีเนียร์','โครงไม้จริง; หน้าตัดและรอยต่อประมาณจากภาพ',[0,0,0]);legs(frame,.97,.59,.35,0,.027);box(frame,1.05,.075,.022,[0,.3125,-.34]);box(frame,1.05,.075,.022,[0,.3125,.34]);box(frame,.022,.075,.68,[-.515,.3125,0]);box(frame,.022,.075,.68,[.515,.3125,0]);
const shelf=part('03 แผ่นล่าง','MDF BOARD ปิดวีเนียร์','แผ่นล่างหนา 16 mm; ตำแหน่ง y ประมาณจากภาพ',[0,.18,.25]);box(shelf,1.03,.016,.682,[0,.116,0]);
const top=part('02 ท็อปและขอบ','MDF BOARD ปิดวีเนียร์','1100 × 750 mm / สูงรวม 400 mm / ขอบตามแบบ',[0,.48,0]);box(top,1.1,.019,.75,[0,.3905,0]);box(top,1.07,.031,.72,[0,.3655,0]);
}else if(item.type==='luggage'){
const frame=part('01 โครงขา','ไม้ยางพาราขึ้นรูป + MDF / HPL','กว้างรวม 1500 ลึก 575 mm; โค้งโครงเป็นการประมาณ',[0,0,0]);for(const s of [-1,1]){const x=s*.723;curve(frame,[[x,0,.25],[x,.23,.19],[x,.40,.15],[x,.475,.19],[x,.5,.26]],.027);curve(frame,[[x,0,-.25],[x,.23,-.19],[x,.40,-.15],[x,.475,-.19],[x,.5,-.26]],.027);box(frame,.045,.04,.54,[x,.48,0]);}box(frame,1.43,.045,.035,[0,.454,.22]);box(frame,1.43,.045,.035,[0,.454,-.22]);
const rail=part('02 แผงหลัง','กรอบไม้ / MDF ปิด HPL','ยอดพนักสูง 750 mm; มุมโค้งตามภาพ',[0,.28,-.22]);curve(rail,[[-.72,.49,-.26],[-.72,.68,-.26],[-.69,.73,-.26],[-.64,.737,-.26],[.64,.737,-.26],[.69,.73,-.26],[.72,.68,-.26],[.72,.49,-.26]],.013);box(rail,1.38,.206,.018,[0,.62,-.26],'wood',.01);
const seat=part('03 ที่วางกระเป๋า','MDF BOARD ปิด HPL','ผิวบน 1400 × 475 mm; ระดับและความหนาประมาณ',[0,.48,.18]);box(seat,1.4,.025,.475,[0,.4875,.0125],'wood',.035);
const low=part('04 ขากลาง / คาน','MDF BOARD ปิด HPL','ชิ้นส่วนค้ำช่วงกลางตามภาพด้านหน้า',[0,.18,.4]);box(low,.495,.04,.035,[0,.32,-.18]);
}else if(item.type==='daybed'){
const frame=part('01 ฐานและขา','ไม้ยางพารา ปิดวีเนียร์','1975 × 975 mm; ขาและหน้าตัดบางส่วนประมาณ',[0,0,0]);legs(frame,1.81,.81,.22,0,.035);box(frame,1.975,.06,.975,[0,.25,0],'wood',.04);box(frame,1.89,.06,.035,[0,.19,.43]);box(frame,1.89,.06,.035,[0,.19,-.43]);
const back=part('02 พนักพิง','โครงไม้ MDF / ฟองน้ำหุ้มผ้า','ช่วงพนัก 1325 mm; โค้งและความหนาประมาณ',[0,.28,-.26]);box(back,1.325,.275,.075,[-.325,.4175,-.45],'fabric',.035);box(back,.075,.275,.81,[-.95,.4175,-.02],'fabric',.035);curve(back,[[-.95,.555,-.42],[-.75,.57,-.43],[-.4,.57,-.43],[.12,.54,-.43],[.30,.43,-.43]],.038,'fabric');
const seat=part('03 เบาะนั่ง','ฟองน้ำหุ้มผ้า','ผิวเบาะตามทรงแบบ; ความโค้งประมาณ',[0,.5,.14]);box(seat,1.95,.105,.94,[0,.3325,0],'fabric',.045);
const cushions=part('04 หมอนอิง','650×650 / 500×500 mm','หมอนเป็นวัตถุอ่อนตัว พับและเอียงให้สอดคล้องภาพ ไม่ใช่รูปทรง CAD',[0,.65,.45]);const a=pillow(cushions,.65,.65,-.60,.42,-.23,-.36);a.rotation.z=.10;pillow(cushions,.5,.5,-.10,.48,-.22,-.24);pillow(cushions,.5,.5,-.60,.47,.12,-.20).rotation.y=.7;
}else{
const legsG=part('02 ขาเตียง','MDF ขึ้นรูป ปิดวีเนียร์','ขา Ø120 mm; ตำแหน่งขากลางอ้างอิงภาพ',[0,0,0]);for(const x of [-1.81,0,1.81])for(const z of [-.22,.22])cyl(legsG,.06,.06,.2,[x,.1,z]);
const frame=part('01 โครงเตียง','MDF ขึ้นรูป ปิดวีเนียร์','3900 × 700 mm แบ่ง 2 โมดูล 1950 mm',[0,.15,0]);box(frame,3.9,.09,.7,[0,.245,0],'wood',.025);box(frame,3.9,.03,.035,[0,.305,.33]);box(frame,3.9,.03,.035,[0,.305,-.33]);
const seat=part('03 เบาะนั่ง','ฟองน้ำหุ้มผ้า','แยกเบาะ 2 โมดูลตามภาพ',[0,.48,.15]);for(const s of [-1,1])box(seat,1.94,.10,.60,[s*.975,.36,.025],'fabric',.035);
const back=part('04 เบาะพิง / หมอน','ฟองน้ำหุ้มผ้า','หมอน 150×600 / 450×450 / 360×360 / 300×300 mm; รูปทรงและตำแหน่งประมาณ',[0,.7,-.26]);for(const s of [-1,1]){box(back,1.9,.1,.1,[s*.975,.645,-.30],'fabric',.035);for(let i=0;i<3;i++){const w=[.45,.36,.30][i];pillow(back,w,w,s*(1.62-i*.37), .43+w*.04,-.15,-.38).rotation.z=s*.1;}const roll=cyl(back,.075,.075,.6,[s*1.87,.49,0],'fabric',32);roll.rotation.x=Math.PI/2;}
}
root.updateMatrixWorld(true);
// Reconstructed overall envelope follows the dimension callouts; small component profiles remain approximate.
const envelope=new T.Box3().setFromObject(root),extent=envelope.getSize(new T.Vector3());root.scale.set(item.w/extent.x,item.h/extent.y,item.d/extent.z);root.position.y=-envelope.min.y*root.scale.y;root.updateMatrixWorld(true);
parts.forEach((g,i)=>{const b=new T.Box3().setFromObject(g);g.userData.anchor=b.getCenter(new T.Vector3());g.userData.anchor.y=(b.max.y+b.min.y)/2+.03;g.userData.anchor.x+=(i%2?1:-1)*item.w*.12;g.userData.anchor.sub(root.position).divide(root.scale);g.userData.origin=g.position.clone();g.userData.number=i+1;});
return {root,parts};
}