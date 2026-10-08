/* VISOR 3D (módulo ES): Three.js, orientación automática, proyección de focos sobre la piel y estetoscopio.
   Usa F, setFocus, anat, view y sys del ámbito global. */
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {USDLoader} from 'three/addons/loaders/USDLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const host=document.getElementById('c3'),ov=document.getElementById('ov'),ld=document.getElementById('ld'),V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const MODEL_URL='models/Male_Full_Body_Ecorche.usdz'; /* ruta del modelo */
const V3=window.V3={ok:false};
let R,sc,cam,ctl,model,meshes=[],U,Up,W,Bc,y0,H=1,size=1,cache={},marks={},sthG=null,curId=null,lbl=null,lights=[];
/* Coordenadas anatómicas como fracción de la estatura H: [izquierda del paciente (+), altura desde los pies, cara 'b' = espalda] */
const D={A:[-.025,.778],P:[.025,.778],E:[.032,.755],T:[.022,.725],M:[.078,.703],IC:[.065,.795],Ax:[.1,.725],Cd:[-.028,.848],Ci:[.028,.848],Tr:[0,.835],IE:[0,.77,'b'],
 q1:[-.04,.635],q2:[.04,.635],q3:[-.04,.565],q4:[.04,.565],pu:[0,.6],Ao:[0,.665],rD:[-.04,.64,'b'],rI:[.04,.64,'b']};
[[.045,.825],[.07,.77],[.085,.73],[.09,.67]].forEach(([x,y],i)=>{D['fD'+(i+1)]=[-x,y];D['fI'+(i+1)]=[x,y]});
[[.06,.78],[.07,.73],[.07,.66]].forEach(([x,y],i)=>{D['bD'+(i+1)]=[-x,y,'b'];D['bI'+(i+1)]=[x,y,'b']});
function boot(){R=new T.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));host.prepend(R.domElement);
 sc=new T.Scene();cam=new T.PerspectiveCamera(35,1,.01,1000);sc.add(new T.HemisphereLight(0xffffff,0x445577,1.6));
 lights=[new T.DirectionalLight(0xffffff,2.2),new T.DirectionalLight(0xffffff,1.6)];lights.forEach(l=>sc.add(l,l.target));
 new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}).observe(host);
 R.setAnimationLoop(frame)}
/* Orientación automática: vertical = eje mayor (prefiere Y), profundidad = eje menor, frente = hacia donde apuntan los pies */
function setup(o){if(model)sc.remove(model);model=o;sc.add(o);o.updateMatrixWorld(true);meshes=[];cache={};
 o.traverse(m=>{if(m.isMesh){meshes.push(m);[].concat(m.material).forEach(a=>a.side=T.DoubleSide)}});
 const B=new T.Box3().setFromObject(o),s=B.getSize(V()),a=[s.x,s.y,s.z],mx=Math.max(...a);
 const iu=a[1]>=.85*mx?1:a[2]>a[0]?2:0,rest=[0,1,2].filter(i=>i!=iu),ip=a[rest[0]]<=a[rest[1]]?rest[0]:rest[1];
 const ax=i=>i==0?V(1,0,0):i==1?V(0,1,0):V(0,0,1);
 y0=B.min.getComponent(iu);H=a[iu];size=s.length();Bc=B.getCenter(V());Up=ax(iu);
 let sf=0,nf=0,sc2=0,nc=0;const p=V();
 meshes.forEach(m=>{const at=m.geometry.attributes.position,st=Math.ceil(at.count/20000);for(let i=0;i<at.count;i+=st){p.fromBufferAttribute(at,i).applyMatrix4(m.matrixWorld);
  const h=(p.getComponent(iu)-y0)/H,d=p.getComponent(ip);if(h<.04){sf+=d;nf++}else if(h>.2&&h<.3){sc2+=d;nc++}}});
 const sg=nf&&nc&&sf/nf<sc2/nc?-1:1;W=ax(ip).multiplyScalar(sg);U=Up.clone().cross(W);
 lights.forEach((l,i)=>{l.position.copy(Bc).addScaledVector(W,(i?-1:1)*size).addScaledVector(Up,size*.4);l.target.position.copy(Bc)});
 cam.up.copy(Up);cam.near=H/200;cam.far=H*20;cam.updateProjectionMatrix();
 if(ctl)ctl.dispose();ctl=new OrbitControls(cam,R.domElement);Object.assign(ctl,{enableDamping:true,minDistance:H*.2,maxDistance:H*3})}
const rc=new T.Raycaster(),at=(x,y)=>Bc.clone().addScaledVector(Up,y0+y*H-Bc.dot(Up)).addScaledVector(U,x*H);
function place(id){if(cache[id])return cache[id];const[x,y,k]=D[id],dv=k=='b'?W.clone().negate():W.clone(),P=at(x,y);
 rc.set(P.clone().addScaledVector(dv,H),dv.clone().negate());const h=rc.intersectObjects(meshes,false)[0];let pos,n;
 if(h){pos=h.point.clone();n=h.face.normal.clone().transformDirection(h.object.matrixWorld);if(n.dot(dv)<0)n.negate()}else{pos=P;n=dv}
 return cache[id]={pos,n}}
V3.build=s=>{ov.innerHTML='';marks={};Object.values(F).filter(f=>f.s==s&&D[f.id]).forEach(f=>{const e=document.createElement('div');e.className='foc f3';e.dataset.id=f.id;e.textContent=f.l;e.title=f.n;e.onclick=()=>setFocus(f.id,true);ov.appendChild(e);marks[f.id]={e,...place(f.id)}});
 lbl=document.createElement('div');lbl.className='lbl3';ov.appendChild(lbl);V3.view(view)};
V3.view=v=>{if(!model)return;const t=at(0,sys=='a'?.62:.74);cam.position.copy(t).addScaledVector(W,(v=='f'?1:-1)*H*.85);ctl.target.copy(t);ctl.update()};
V3.steth=id=>{curId=id;if(sthG)sc.remove(sthG);sthG=null;if(!id||!marks[id])return;const{pos,n}=marks[id],s=H*.011,g=new T.Group();
 const disc=new T.Mesh(new T.CylinderGeometry(s*1.4,s*1.4,s*.5,32),new T.MeshStandardMaterial({color:0xaab3bd,metalness:.8,roughness:.3}));
 disc.quaternion.setFromUnitVectors(V(0,1,0),n);disc.position.copy(pos).addScaledVector(n,s*.3);g.add(disc);
 const cu=new T.CatmullRomCurve3([pos.clone().addScaledVector(n,s*.6),pos.clone().addScaledVector(n,s*4),pos.clone().addScaledVector(n,s*6).addScaledVector(Up,-s*6),pos.clone().addScaledVector(n,s*5).addScaledVector(Up,-s*20)]);
 g.add(new T.Mesh(new T.TubeGeometry(cu,30,s*.25,8),new T.MeshStandardMaterial({color:0x111111})));sc.add(g);sthG=g};
V3.flip=()=>{if(!model)return;W.negate();U=Up.clone().cross(W);cache={};anat()};
function frame(){if(host.style.display=='none'||!model)return;ctl.update();R.render(sc,cam);const w=host.clientWidth,h=host.clientHeight;
 for(const id in marks){const m=marks[id],p=m.pos.clone().project(cam),vis=p.z<1&&m.n.dot(cam.position.clone().sub(m.pos))>0;
  m.e.style.display=vis?'':'none';if(vis)m.e.style.transform=`translate(${(p.x*.5+.5)*w}px,${(-p.y*.5+.5)*h}px)`}
 const m=marks[curId];if(lbl){const on=m&&m.e.style.display!='none';lbl.style.display=on?'':'none';if(on){lbl.style.transform=m.e.style.transform+' translate(-50%,0)';lbl.textContent=F[curId].l+' · '+F[curId].n}}}
async function show(buf,ext){const o=ext=='glb'?await new Promise((ok,er)=>new GLTFLoader().parse(buf,'',g=>ok(g.scene),er)):await new USDLoader().parse(buf);
 setup(o);V3.ok=true;ld.style.display='none';anat()}
async function rd(buf,ext){try{ld.style.display='';ld.textContent='Cargando modelo 3D…';
 if(!buf){const r=await fetch(MODEL_URL);if(!r.ok)throw new Error(r.status);buf=await r.arrayBuffer()}await show(buf,ext)}
 catch(e){console.error(e);ld.textContent='No se pudo cargar el modelo 3D (se usa el dibujo 2D). Abre la app desde un servidor local (ver README) o usa «Modelo».'}}
boot();
document.getElementById('flip').onclick=()=>V3.flip();
document.getElementById('fi').onchange=async e=>{const f=e.target.files[0];if(f)rd(await f.arrayBuffer(),f.name.split('.').pop().toLowerCase())};
rd(null,'usdz');
