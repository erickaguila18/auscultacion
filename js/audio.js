/* AUDIO: motor de síntesis (corazón, pulmón, intestino), reproducción y onda en vivo.
   Script clásico: comparte el ámbito global con los demás archivos de js/. */
/* ---------- Audio sintetizado ---------- */
const AC=window.AudioContext||window.webkitAudioContext;let ctx,an,vol,filt,bus,noise,timer,nextT,cur=-1;
function init(){if(ctx)return;ctx=new AC();an=ctx.createAnalyser();an.fftSize=512;filt=ctx.createBiquadFilter();vol=ctx.createGain();filt.connect(vol);vol.connect(an);an.connect(ctx.destination);
 const n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;noise=b;setMode();}
function applyVol(){if(ctx)vol.gain.setTargetAtTime($('#vol').value/100*audible*(mode=='b'?1.5:1)*3,ctx.currentTime,.05)}
function setMode(){if(!ctx)return;filt.type=mode=='b'?'lowpass':'highpass';filt.frequency.value=mode=='b'?230:80;applyVol()}
function tone(t,f,pk,dur,type,f2){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+.008+dur);o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.05)}
const SH={holo:[[.1,1],[.9,1]],cres:[[.9,1]],dec:[[.04,1]],diam:[[.5,1]],late:[[.5,.2],[.9,1]]};
function nz(t,dur,f,q,sh,pk){const s=ctx.createBufferSource(),b=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;s.loop=true;b.type='bandpass';b.frequency.value=f;b.Q.value=q;
 g.gain.setValueAtTime(0,t);SH[sh].forEach(([a,v])=>g.gain.linearRampToValueAtTime(v*pk,t+a*dur));g.gain.linearRampToValueAtTime(0,t+dur);s.connect(b);b.connect(g);g.connect(bus);s.start(t,Math.random());s.stop(t+dur+.05)}
const R=Math.random;
function heart(t,p){const T=p.irr?.45+R()*.7:60/(p.bpm||75),s2=t+.32;
 tone(t,70,.9,.12,'sine',45);nz(t,.08,120,1,'holo',.2);
 tone(s2,115,.7,.09,'sine',70);if(p.sp)tone(s2+p.sp,135,.5,.08,'sine',80);
 if(p.s3)tone(s2+.15,55,.9,.12,'triangle');if(p.s4)tone(t+T-.13,50,.9,.12,'triangle');
 if(p.clk)tone(t+p.clk,1800,.35,.02,'square');if(p.opn)tone(s2+.08,1500,.3,.02,'square');
 if(p.rub)[.04,.14,.3,.5].forEach(d=>nz(t+d,.09,2200,.8,'holo',.4));
 if(p.m){const[ty,sh,f,g]=p.m;if(ty=='s')nz(t+.06,.26,f,1,sh,g);else if(ty=='d'){const st=s2+.09;nz(st,Math.max(.15,t+T-.05-st),f,1.2,sh,g)}else nz(t+.05,T-.1,f,1,sh,g)}
 return T}
function lung(t,p){const m=p.m;
 const br=(f,pi,pe,q)=>{nz(t+.2,1.4,f,q||.6,'diam',pi);nz(t+2,m=='bro'?1.4:.8,f,q||.6,m=='bro'?'diam':'dec',pe)};
 if(m=='ves')br(450,.55,.2);if(m=='bro')br(1000,.7,.6,.8);if(m=='bv')br(700,.55,.4);if(m=='dim')br(450,.1,.04);
 if(m=='crf'){br(450,.3,.1);for(let i=0;i<14;i++)nz(t+1+R()*.6,.012,2000,.8,'dec',.9)}
 if(m=='crg'){br(450,.3,.12);for(let i=0;i<8;i++)nz(t+.3+R()*2.2,.03,800,.8,'dec',.8)}
 if(m=='wh'){br(450,.3,.1);tone(t+2,720,.3,1.3,'sine',950);tone(t+2.1,1100,.18,1.1,'sine',820)}
 if(m=='ron')for(let i=0;i<22;i++)nz(t+.3+i*.09,.07,170,2.5,'holo',.8);
 if(m=='str'){tone(t+.2,880,.35,1.3,'sawtooth',960);nz(t+.2,1.3,1200,2,'diam',.2)}
 if(m=='rub'){for(let i=0;i<7;i++)nz(t+.3+i*.12,.1,650,.7,'holo',.6);for(let i=0;i<7;i++)nz(t+2+i*.1,.1,650,.7,'holo',.6)}
 return 4}
function bowel(t,p){const m=p.m;
 const gu=(tt,f,d,pk)=>{tone(tt,f,pk,d,'sine',f*.5);nz(tt,d,420,3,'diam',pk*.7)};
 if(m=='nor')for(let i=0;i<3;i++)gu(t+R()*2.4,170+R()*150,.14,.35);
 if(m=='hyp')for(let i=0;i<10;i++)gu(t+R()*2.6,200+R()*250,.1,.4);
 if(m=='hpo')gu(t+R()*2,150,.1,.2);
 if(m=='bor')for(let i=0;i<3;i++)gu(t+i*.9,110+R()*60,.5,.5);
 if(m=='met')for(let i=0;i<6;i++)tone(t+R()*2.7,1300+R()*800,.3,.1,'sine');
 if(m=='ao'||m=='ren'){const T=.85,f=m=='ao'?300:480;nz(t,.3,f,1,'diam',.6);tone(t,60,.5,.1);return T}
 return 3}
function loop(){if(!playing)return;while(nextT<ctx.currentTime+.5){const p=S[cur].p;nextT+=(p.k=='h'?heart:p.k=='l'?lung:bowel)(nextT,p)}timer=setTimeout(loop,100)}
function play(){pStop();if(sel<0&&cur<0)return;if(train&&!ans){} init();ctx.resume();stop(true);cur=train&&!ans?cur:sel;
 bus=ctx.createGain();bus.connect(filt);nextT=ctx.currentTime+.05;playing=true;applyVol();$('#play').innerHTML='<i class="fi fi-rr-pause"></i>';loop()}
function stop(q){playing=false;clearTimeout(timer);if(bus){bus.gain.setTargetAtTime(0,ctx.currentTime,.02);const b=bus;setTimeout(()=>b.disconnect(),300)}if(!q)$('#play').innerHTML='<i class="fi fi-rr-play"></i>'}
/* ---------- Forma de onda ---------- */
const cv=$('#cv'),cx=cv.getContext('2d'),buf=[];
function draw(){const w=cv.width=cv.clientWidth*devicePixelRatio,h=cv.height=70*devicePixelRatio;let v=0;
 if(an&&(playing||pPlay)){const d=new Uint8Array(an.fftSize);an.getByteTimeDomainData(d);for(const x of d)v=Math.max(v,Math.abs(x-128)/128)}
 buf.push(v);if(buf.length>w/3)buf.shift();cx.clearRect(0,0,w,h);cx.strokeStyle='#33d6ff';cx.lineWidth=2*devicePixelRatio;cx.beginPath();
 buf.forEach((b,i)=>{const x=i*3,y=h/2-Math.min(1,b*2.2)*h*.45*(i%2?1:-1);i?cx.lineTo(x,y):cx.moveTo(x,y)});cx.stroke();requestAnimationFrame(draw)}
