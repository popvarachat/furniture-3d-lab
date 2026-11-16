import * as T from 'three';
import {addBackdrop} from './ad-backdrop.js';
import {resolveScene} from './ad-scenes.js';
export async function captureAdProduct(model,environment,sceneId='studio'){
const preset=resolveScene(sceneId),scene=new T.Scene();scene.background=new T.Color(preset.background);scene.environment=environment;
const root=model.root.clone(true),labels=[],ownedMaterials=[];root.traverse(o=>{if(o.isCSS2DObject)labels.push(o);if(o.isMesh){o.material=o.material.clone();o.material.opacity=1;o.material.transparent=false;o.material.wireframe=false;o.material.depthWrite=true;ownedMaterials.push(o.material);}});
labels.forEach(o=>o.removeFromParent());root.children.forEach((g,i)=>{const p=model.parts[i]?.userData.origin;if(p)g.position.copy(p);});scene.add(root);root.updateMatrixWorld(true);
const box=new T.Box3().setFromObject(root),center=box.getCenter(new T.Vector3()),sphere=box.getBoundingSphere(new T.Sphere()),size=box.getSize(new T.Vector3());
const cleanup=addBackdrop(scene,preset.id,size);
const camera=new T.PerspectiveCamera(35,1.5,.01,100);const distance=sphere.radius/Math.sin(T.MathUtils.degToRad(17.5))*1.02;camera.position.copy(center).addScaledVector(new T.Vector3(.85,.55,1).normalize(),distance);camera.lookAt(center);
scene.add(new T.HemisphereLight('#ffffff','#a7a493',2));const key=new T.DirectionalLight('#fff4e4',3);key.position.set(3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.bias=-.0004;scene.add(key);
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1080,720);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
try{renderer.render(scene,camera);const image=new Image();image.src=renderer.domElement.toDataURL('image/png');await image.decode();return image;}finally{cleanup();ownedMaterials.forEach(m=>m.dispose());key.shadow.dispose();renderer.dispose();}
}
