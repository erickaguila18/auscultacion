/* CUERPO Y LISTA: estado global, dibujo 2D de respaldo, resaltado de focos, lista de sonidos, selección e información.
   Script clásico: comparte el ámbito global con los demás archivos de js/. */
/* ---------- Estado ---------- */
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
let view='f',sys='c',sel=-1,hov=-1,foc=null,train=false,ans=null,mode='d',playing=false,audible=1;
/* ---------- Anatomía SVG ---------- */
const BODY='M150 62C140 62 134 70 134 80L134 92C134 100 118 100 100 106C76 112 62 124 58 150L50 240C48 256 60 258 62 244L72 170L80 250C82 300 86 330 92 360L208 360C214 330 218 300 220 250L228 170L238 244C240 258 252 256 250 240L242 150C238 124 224 112 200 106C182 100 166 100 166 92L166 80C166 70 160 62 150 62Z';
const is3=()=>window.V3&&V3.ok;
function anat(){const t=is3();$('#body').style.display=t?'none':'block';$('#c3').style.display=t?'block':'none';if(t){V3.build(sys);steth();hl();return}

 let h=`<path d="${BODY}" fill="rgba(70,130,225,.16)" stroke="#5aa2ff" stroke-width="1.5"/><circle cx="150" cy="40" r="22" fill="rgba(70,130,225,.16)" stroke="#5aa2ff" stroke-width="1.5"/>`;
 for(let y=128;y<=236;y+=18)h+=`<path d="M92 ${y}Q150 ${y+(view=='f'?16:8)} 208 ${y}" fill="none" stroke="#cfe3ff" stroke-opacity=".25"/>`;
 if(view=='f'){h+=`<path d="M110 112L150 122L190 112" stroke="#cfe3ff" stroke-opacity=".4" fill="none"/><ellipse cx="108" cy="180" rx="30" ry="58" fill="#e89a6a" fill-opacity=".35"/><ellipse cx="192" cy="180" rx="30" ry="58" fill="#e89a6a" fill-opacity=".35"/><path d="M150 160C142 150 140 176 150 218C170 226 190 212 186 190C182 170 166 158 150 160Z" fill="#c0283a" fill-opacity=".6"/><path d="M100 262Q150 250 200 262M150 262V340M104 300H196" stroke="#cfe3ff" stroke-opacity=".25" stroke-dasharray="3 3" fill="none"/>`;}
 else h+=`<ellipse cx="108" cy="180" rx="30" ry="58" fill="#e89a6a" fill-opacity=".3"/><ellipse cx="192" cy="180" rx="30" ry="58" fill="#e89a6a" fill-opacity=".3"/><path d="M150 100V345" stroke="#cfe3ff" stroke-opacity=".5" stroke-dasharray="4 4"/><ellipse cx="118" cy="150" rx="18" ry="30" fill="none" stroke="#cfe3ff" stroke-opacity=".35"/><ellipse cx="182" cy="150" rx="18" ry="30" fill="none" stroke="#cfe3ff" stroke-opacity=".35"/><ellipse cx="124" cy="272" rx="9" ry="16" fill="#a8453a" fill-opacity=".5"/><ellipse cx="176" cy="272" rx="9" ry="16" fill="#a8453a" fill-opacity=".5"/>`;
 $('#anat').innerHTML=h;
 $('#foci').innerHTML=Object.values(F).filter(f=>f.v==view&&f.s==sys).map(f=>`<g class="foc" data-id="${f.id}" transform="translate(${f.x} ${f.y})"><title>${f.n}</title><circle class="halo" r="12"/><circle class="c" r="9"/><text y="2.5">${f.l}</text></g>`).join('');
 $$('.foc').forEach(e=>e.onclick=()=>setFocus(e.dataset.id,true));
 steth();hl();}
function steth(){if(is3()){V3.steth(foc&&F[foc].s==sys?foc:null);return}const g=$('#steth');if(!foc||F[foc].v!=view||F[foc].s!=sys){g.innerHTML='';return}
 const f=F[foc],w=f.n.length*3.7+12,x=Math.min(Math.max(f.x,w/2+4),296-w/2);
 g.innerHTML=`<path d="M${f.x} ${f.y+10}C${f.x} ${f.y+70} ${f.x+70} ${f.y+60} ${f.x+80} 370" fill="none" stroke="#111" stroke-width="3"/><circle cx="${f.x}" cy="${f.y}" r="13" fill="#9aa3ad" stroke="#222" stroke-width="3"/><circle cx="${f.x}" cy="${f.y}" r="7" fill="#d7dde3" stroke="#555"/><rect x="${x-w/2}" y="${f.y-34}" width="${w}" height="14" rx="7" fill="#e3243b"/><text x="${x}" y="${f.y-24}" fill="#fff" font-size="7" font-weight="700" text-anchor="middle">${f.l} · ${f.n}</text>`;}
function hl(){const i=hov>=0?hov:sel,hide=train&&!ans,ids=i>=0&&!hide?S[i].ids:[];
 $$('.foc').forEach(e=>{const on=ids.includes(e.dataset.id);e.classList.toggle('hot',on);e.classList.toggle('dim',ids.length>0&&!on);e.classList.toggle('cur',e.dataset.id==foc)});
 $$('.it').forEach(e=>{const s=S[e.dataset.i];e.classList.toggle('here',!!foc&&s.ids.includes(foc)&&!hide)});}
/* ---------- Lista ---------- */
function list(){const q=$('#q').value.toLowerCase();let last='',h='';
 S.forEach((s,i)=>{if(s.s!=sys||!(s.n+s.t).toLowerCase().includes(q))return;
  if(s.g!=last){h+=`<div class="gh">${s.g}</div>`;last=s.g}
  const hide=train&&!ans;
  h+=`<button class="it ${i==sel&&!hide?'sel':''}" data-i="${i}"><div class="r1"><span>${s.n}</span><span class="tg">${s.t}</span></div>${hide?'':`<div class="chips">${s.ids.map(id=>`<span class="chip ${F[id].v==view?'':'opacity-50'}">${F[id].l}${F[id].v=='b'?'ᵖ':''}</span>`).join('')}</div>`}</button>`;});
 $('#list').innerHTML=h||'<p class="text-muted p-3">Sin resultados. Prueba otro término.</p>';
 $$('.it').forEach(e=>{const i=+e.dataset.i;e.onclick=()=>pick(i);e.onmouseenter=()=>{hov=i;hl()};e.onmouseleave=()=>{hov=-1;hl()}});hl();}
function setView(v){view=v;$$('.tools .btn').forEach(b=>b.classList.toggle('on',b.dataset.v==v));if(is3())V3.view(v);else anat();list();}
function setFocus(id,user){foc=id;const f=F[id];if(f.v!=view&&!user)setView(f.v);else steth();
 if(user&&sel<0){const k=S.findIndex(s=>s.s==sys&&s.ids.includes(id));if(k>=0){sel=k;list()}}
 audible=sel>=0&&S[sel].ids.includes(id)?1:.08;applyVol();hl();
 if(user&&sel>=0&&!playing)play();info();}
function pick(i){
 if(train&&!ans){const ok=i==cur;ans={ok};sel=cur;info();list();setFocus(F[S[cur].ids[0]].id);return}
 sel=i;const s=S[i];if(!foc||!s.ids.includes(foc)||F[foc].s!=sys){const id=s.ids.find(x=>F[x].v==view)||s.ids[0];foc=id;if(F[id].v!=view)setView(F[id].v)}
 audible=1;list();setFocus(foc);play();info();}
function info(){const el=$('#info');
 if(train&&!ans){el.innerHTML='<b>¿Qué estás escuchando?</b> Escucha el sonido y elige tu respuesta en la lista. Puedes cambiar diafragma/campana.';return}
 if(sel<0){el.textContent=foc?F[foc].n+': '+F[foc].o+'. Elige un sonido para oírlo aquí.':'Toca un foco en el cuerpo o elige un sonido de la lista.';return}
 const s=S[sel],f=foc&&F[foc];
 let r=ans?`<span class="${ans.ok?'ok':'ko'}"><b>${ans.ok?'¡Correcto!':'Incorrecto.'}</b></span> `:'';
 el.innerHTML=`${r}<b>${s.n}</b> — ${s.d} ${s.b=='b'?'<b>Mejor con campana.</b>':'Mejor con diafragma.'}<br>${f?`<b>${f.n}</b> (${f.o}). ${S[sel].ids.includes(foc)?'<span class="ok">Se ausculta aquí.</span>':'<span class="ko">Sonido apenas audible en este foco.</span>'}`:''}`;}
