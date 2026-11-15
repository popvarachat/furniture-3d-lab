import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// Independent adapter using public Three.js APIs.
export function createSceneSetup({canvas,css2dLayer,viewportEl}){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.02,80);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const labelRenderer=new CSS2DRenderer({element:css2dLayer});
 const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.075;
 const grid=new THREE.GridHelper(12,120,0x8c9a84,0xaab4a5);grid.position.y=.001;grid.material.transparent=true;scene.add(grid);
 function onResize(){const w=Math.max(1,viewportEl.clientWidth),h=Math.max(1,viewportEl.clientHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(w,h,false);labelRenderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 window.addEventListener('resize',onResize);onResize();
 return {scene,camera,renderer,labelRenderer,controls,grid,onResize};
}
