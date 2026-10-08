/* PRÁCTICA: patrones respiratorios (PT), tarjetas, reto auditivo y su audio.
   Script clásico: comparte el ámbito global con los demás archivos de js/. */
/* ---------- Práctica: patrones respiratorios ---------- */
const rp=(n,b)=>Array.from({length:n},()=>b);
/* respiración = [inspiración s, espiración s, pausa s, amplitud 0-1, meseta inspiratoria s, rasgo] */
const PT=[
{n:'Eupnea',d:'Respiración normal en reposo: regular, silenciosa y sin esfuerzo. La inspiración es más corta que la espiración, que es pasiva.',c:'Normal.',fr:'12–20 rpm',pf:'Normal',rt:'Regular',s:rp(4,[1.4,2.2,.15,.5])},
{n:'Taquipnea',d:'Aumento de la frecuencia respiratoria con respiraciones cortas y superficiales, de ritmo regular.',c:'Fiebre, dolor, ansiedad, neumonía, tromboembolia pulmonar, hipoxia, shock.',fr:'> 20 rpm',pf:'Superficial',rt:'Regular',s:rp(8,[.8,1.1,.1,.3])},
{n:'Bradipnea',d:'Frecuencia respiratoria baja, regular y con espiraciones largas. Es una señal de depresión del impulso respiratorio.',c:'Opioides, sedantes, hipotermia, hipertensión intracraneal.',fr:'< 12 rpm',pf:'Normal o baja',rt:'Regular',s:rp(2,[2.5,4.5,.5,.5])},
{n:'Apnea',d:'Cese de la ventilación durante varios segundos: algunas respiraciones y después un silencio prolongado sin flujo de aire.',c:'Obstrucción de la vía aérea, sobredosis, paro respiratorio, apnea del sueño.',fr:'Pausa > 10–20 s',pf:'Ausente',rt:'Interrumpido',s:[[1.4,2.2,.2,.5],[1.4,2.2,11,.4]]},
{n:'Hiperpnea',d:'Respiraciones profundas con aumento del volumen corriente, proporcionales a la demanda del cuerpo y casi sin pausas.',c:'Ejercicio, altitud, fiebre, ansiedad.',fr:'Normal o algo elevada',pf:'Profunda',rt:'Regular',s:rp(4,[1.6,1.8,.1,1])},
{n:'Hipopnea',d:'Respiración muy superficial, con volumen corriente reducido y poco flujo de aire audible.',c:'Sedación, fatiga muscular, debilidad neuromuscular, obesidad, sueño.',fr:'Variable',pf:'Muy superficial',rt:'Regular',s:rp(4,[1.5,2,.4,.18])},
{n:'Kussmaul',d:'Respiraciones profundas, rápidas y continuas, sin pausas, con un sonido intenso de «hambre de aire». Es la compensación respiratoria de una acidosis metabólica.',c:'Cetoacidosis diabética, insuficiencia renal (uremia), intoxicaciones.',fr:'Normal o > 20 rpm',pf:'Profunda',rt:'Regular, sin pausas',s:rp(8,[.9,1,0,1,0,'kus'])},
{n:'Cheyne-Stokes',d:'Ciclos en los que las respiraciones crecen en profundidad (crescendo) y luego disminuyen (decrescendo), seguidos de un periodo de apnea.',c:'Insuficiencia cardíaca, ictus, traumatismo craneal, altitud, opioides.',fr:'Variable; ciclo de 30–120 s',pf:'Creciente y decreciente',rt:'Periódico con apnea',s:[.2,.5,.85,1,.85,.5,.2].map((a,i,r)=>[.9,1.1,i==r.length-1?7:0,a])},
{n:'Biot',d:'Grupos de respiraciones regulares y de igual profundidad, separados por pausas apneicas de duración irregular.',c:'Lesión bulbar o protuberancial, meningitis, aumento de la presión intracraneal.',fr:'Variable',pf:'Constante en cada grupo',rt:'En grupos con apnea',s:[...rp(2,[1,1.2,0,.6]),[1,1.2,5,.6],...rp(3,[1,1.2,0,.6]),[1,1.2,4,.6]]},
{n:'Atáxica',d:'Respiración totalmente caótica: frecuencia, profundidad y pausas cambian de forma impredecible, sin ningún patrón.',c:'Lesión bulbar grave, muerte cerebral inminente.',fr:'Irregular',pf:'Variable',rt:'Caótico',s:[[.9,1.4,.3,.9],[1.8,2.5,1.5,.3],[.6,.8,.1,1],[1.2,1.6,3,.5],[.7,1.1,.2,.7],[2,2.8,.8,.4],[.5,.7,2,.9],[1.1,1.8,.4,.6]]},
{n:'Apnéustica',d:'Inspiración muy prolongada con una pausa al final de la inspiración (meseta), seguida de una espiración corta.',c:'Lesión de la protuberancia (ictus del tronco basilar), meningitis.',fr:'Baja',pf:'Profunda y sostenida',rt:'Con pausa inspiratoria',s:rp(2,[3.5,2,.8,.8,2.5])},
{n:'Agónica (jadeo)',d:'Inspiraciones aisladas, profundas y muy espaciadas, con boqueo y esfuerzo. No es una respiración efectiva.',c:'Paro cardíaco, hipoxia grave, agonía. En RCP no se considera respiración normal.',fr:'Muy baja (< 6 rpm)',pf:'Breve y brusca',rt:'Aislado, espaciado',s:rp(3,[.5,.9,5,.9,0,'gasp'])},
{n:'Espiración prolongada (obstructiva)',d:'La espiración se alarga mucho respecto a la inspiración, con sibilancias al final. Puede haber labios fruncidos y uso de músculos accesorios.',c:'Asma, EPOC, bronquiolitis.',fr:'Normal o elevada',pf:'Normal',rt:'Relación I:E invertida',s:rp(3,[1,3.8,.2,.5,0,'whz'])}
];
const dur=p=>p.s.reduce((a,[i,e,g,,h=0])=>a+i+e+g+h,0);
function tr(p){const T=dur(p),X=t=>(t/T*300).toFixed(1),Y=a=>(66-a*52).toFixed(1);let t=0,d='M0 66';
 p.s.forEach(([ti,te,g,a,hd=0])=>{for(let i=1;i<=10;i++)d+=`L${X(t+ti*i/10)} ${Y(a*Math.sin(Math.PI/2*i/10))}`;t+=ti;if(hd){t+=hd;d+=`L${X(t)} ${Y(a)}`}
  for(let i=1;i<=10;i++)d+=`L${X(t+te*i/10)} ${Y(a*Math.cos(Math.PI/2*i/10))}`;t+=te;if(g){t+=g;d+=`L${X(t)} 66`}});return d}
const tsv=(k,cur,col)=>`<svg class="tsv" viewBox="0 0 300 80" preserveAspectRatio="none" aria-label="Trazo del patrón ${PT[k].n}"><line x1="0" x2="300" y1="66" y2="66" stroke="${col}" stroke-opacity=".3"/><path d="${tr(PT[k])}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke"/>${cur?'<line id="pcur" x1="0" x2="0" y1="4" y2="76" stroke="#ffd23f" stroke-width="2" vector-effect="non-scaling-stroke"/>':''}</svg>`;
/* Audio: cada respiración como ruido filtrado (flujo de aire) con envolvente de inspiración/espiración */
let pPlay=false,pT0=0,pTimer=0,pBus=null,pCur=0,pRaf=false;
function bsnd(t,[ti,te,g,a,hd=0,fl]){const f=380+a*260,pk=.12+.55*a;
 if(fl=='gasp'){nz(t,.35,1000,.8,'dec',.8);tone(t,140,.5,.25,'sawtooth',90);nz(t+.35,.6,500,.7,'dec',.25);return}
 nz(t,ti,f,.6,hd?'holo':'diam',pk);
 if(fl=='kus'){nz(t,ti,170,1,'diam',pk*.8);nz(t+ti,te,170,1,'dec',pk*.5)}
 if(fl=='whz'){nz(t+ti,te,420,.7,'dec',pk*.5);tone(t+ti+.15,640,.22,te*.8,'sine',880);tone(t+ti+.2,980,.1,te*.7,'sine',700)}
 else nz(t+ti+hd,te,f*.8,.6,'dec',pk*.55)}
function pStart(k){init();ctx.resume();if(playing)stop(true);pStop();const p=PT[k];pBus=ctx.createGain();pBus.gain.value=$('#vol').value/100*3;pBus.connect(an);bus=pBus;
 pCur=k;pPlay=true;pT0=ctx.currentTime+.05;let nx=pT0;
 const loop=()=>{if(!pPlay)return;bus=pBus;while(nx<ctx.currentTime+.6){let x=nx;p.s.forEach(b=>{bsnd(x,b);x+=b[0]+(b[4]||0)+b[1]+b[2]});nx=x}pTimer=setTimeout(loop,150)};
 loop();uiPlay();if(!pRaf){pRaf=true;rafCur()}}
function pStop(){if(!pPlay&&!pBus)return;pPlay=false;clearTimeout(pTimer);if(pBus){const b=pBus;b.gain.setTargetAtTime(0,ctx.currentTime,.03);setTimeout(()=>b.disconnect(),300);pBus=null}uiPlay()}
function rafCur(){if(!pPlay){pRaf=false;return}const c=$('#pcur');if(c){const T=dur(PT[pCur]),x=(((ctx.currentTime-pT0)%T+T)%T)/T*300;c.setAttribute('x1',x);c.setAttribute('x2',x)}requestAnimationFrame(rafCur)}
function uiPlay(){$$('.pp').forEach(b=>b.innerHTML=pPlay&&pCur==+b.dataset.k?'<i class="fi fi-rr-pause"></i> Pausar':'<i class="fi fi-rr-play"></i> Reproducir')}
/* Interfaz */
let pm='card',pi=0,pf=false,order=PT.map((_,i)=>i),known=new Set(),q=null,qs={ok:0,n:0};
const rnd=n=>Math.floor(Math.random()*n);
function newQ(){let k;do k=rnd(PT.length);while(q&&k==q.k);const o=[k];while(o.length<4){const r=rnd(PT.length);if(!o.includes(r))o.push(r)}q={k,o:o.sort(()=>Math.random()-.5),a:null}}
function prac(){const N=PT.length;let h=`<div class="pt"><button data-a="m:card" class="${pm=='card'?'on':''}"><i class="fi fi-rr-copy-alt"></i> Tarjetas</button><button data-a="m:quiz" class="${pm=='quiz'?'on':''}"><i class="fi fi-rr-headphones"></i> Reto auditivo</button></div>`;
 if(pm=='card'){const k=order[pi],p=PT[k];
  h+=`<div class="d-flex justify-content-between small"><span>Tarjeta ${pi+1} de ${N}</span><span>Dominadas: ${known.size}/${N}</span></div><div class="prog"><i style="width:${known.size/N*100}%"></i></div>
  <div class="fc ${pf?'flip':''}" data-a="flip"><div class="fci"><div class="face front"><h3>${p.n}</h3>${tsv(k,0,'#0b63b8')}<p>${p.d}</p><small class="text-muted"><i class="fi fi-rr-rotate-right"></i> Toca la tarjeta para voltearla y escuchar</small></div>
  <div class="face back"><h4>${p.n}</h4><button class="pp" data-a="play" data-k="${k}"></button><div class="my-2">${tsv(k,1,'#33d6ff')}</div><div class="dat"><span>FR: ${p.fr}</span><span>Profundidad: ${p.pf}</span><span>Ritmo: ${p.rt}</span></div><p><b>Causas:</b> ${p.c}</p>
  <div class="d-flex gap-2"><button class="btn btn-sm btn-outline-light flex-fill" data-a="review">Repasar</button><button class="btn btn-sm btn-success flex-fill" data-a="know">Lo sé</button></div></div></div></div>
  <div class="nv"><button data-a="prev" aria-label="Anterior"><i class="fi fi-rr-angle-left"></i></button><button data-a="shuffle"><i class="fi fi-rr-shuffle"></i> Barajar</button><button data-a="next" aria-label="Siguiente"><i class="fi fi-rr-angle-right"></i></button></div>`}
 else{if(!q)newQ();const p=PT[q.k],d=q.a!=null;
  h+=`<p class="mb-0"><b>Escucha el patrón y elige su nombre</b></p><button class="pp align-self-start" data-a="play" data-k="${q.k}"></button>
  <div>${q.o.map(o=>`<button class="opt ${d?o==q.k?'ok':o==q.a?'ko':'':''}" data-a="ans:${o}" ${d?'disabled':''}>${PT[o].n}</button>`).join('')}</div>
  ${d?`<div class="fb"><b>${q.a==q.k?'¡Correcto!':'Era: '+p.n}</b>${tsv(q.k,0,'#0b63b8')}<p class="small my-2">${p.d}</p><button class="btn btn-sm btn-primary" data-a="qnext">Siguiente <i class="fi fi-rr-angle-right"></i></button></div>`:''}
  <small>Aciertos: ${qs.ok} de ${qs.n}</small>`}
 $('#prac').innerHTML=h;uiPlay()}
$('#prac').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const[a,v]=b.dataset.a.split(':'),N=PT.length;
 if(a=='flip'){pf=!pf;$('.fc').classList.toggle('flip',pf);return}
 if(a=='play'){const k=+b.dataset.k;pPlay&&pCur==k?pStop():pStart(k);return}
 if(a=='m'){pStop();pm=v;pf=false;q=null;if(v=='quiz')newQ();prac();if(v=='quiz')pStart(q.k);return}
 if(a=='ans'){q.a=+v;qs.n++;if(q.a==q.k)qs.ok++;prac();return}
 if(a=='qnext'){pStop();newQ();prac();pStart(q.k);return}
 if(a=='shuffle'){order.sort(()=>Math.random()-.5);pi=0}
 else{if(a=='know')known.add(order[pi]);if(a=='review')known.delete(order[pi]);pi=(pi+(a=='prev'?-1:1)+N)%N}
 pStop();pf=false;prac()};
function showPrac(on){$('#sys').style.display=$('.srch').style.display=$('#list').style.display=on?'none':'';$('#prac').style.display=on?'flex':'none';$('#mP').classList.toggle('on',on);
 if(on){pStop();train=false;ans=null;$('#mE').classList.remove('on');$('#mT').classList.remove('on');$('#next').classList.add('d-none');stop();$('#info').textContent='Práctica: voltea una tarjeta y pulsa «Reproducir» para escuchar el patrón respiratorio, o prueba el reto auditivo.';prac()}else pStop()}
$('#mP').onclick=()=>showPrac(true);
