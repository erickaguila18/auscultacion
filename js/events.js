/* EVENTOS: pestañas, buscador, volumen, diafragma/campana y modo Entrenar.
   Script clásico: comparte el ámbito global con los demás archivos de js/. */
/* ---------- Eventos ---------- */
$$('.tools .btn[data-v]').forEach(b=>b.onclick=()=>setView(b.dataset.v));
$$('#sys button').forEach(b=>b.onclick=()=>{sys=b.dataset.s;$$('#sys button').forEach(x=>x.classList.toggle('on',x==b));sel=-1;foc=null;ans=null;stop();view='f';if(sys=='c'||sys=='p'||sys=='a')setView('f');anat();if(train)nextCase();info()});
$('#q').oninput=list;
$('#play').onclick=()=>{playing?stop():(sel>=0||cur>=0)&&play()};
$$('#mode button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;$$('#mode button').forEach(x=>x.classList.toggle('on',x==b));setMode()});
$('#vol').oninput=()=>{applyVol();if(pBus)pBus.gain.value=$('#vol').value/100*3};
function nextCase(){const pool=S.map((s,i)=>i).filter(i=>S[i].s==sys);cur=pool[Math.floor(R()*pool.length)];ans=null;sel=-1;foc=S[cur].ids[0];setView(F[foc].v);audible=1;list();init();ctx.resume();sel=-1;play();info()}
function setTrain(on){showPrac(false);train=on;ans=null;$('#mE').classList.toggle('on',!on);$('#mT').classList.toggle('on',on);$('#next').classList.toggle('d-none',!on);stop();sel=-1;if(on)nextCase();else{cur=-1;list();info()}}
$('#mE').onclick=()=>setTrain(false);$('#mT').onclick=()=>setTrain(true);$('#next').onclick=nextCase;
