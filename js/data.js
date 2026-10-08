/* DATOS: focos de auscultación (F) y catálogo de sonidos (S). Aquí se agregan focos o sonidos nuevos.
   Script clásico: comparte el ámbito global con los demás archivos de js/. */
/* ---------- Focos ---------- */
const F={},add=(id,v,s,x,y,l,n,o,z)=>F[id]={id,v,s,x,y,l,n,o,z};
add('A','f','c',130,150,'A','Foco aórtico','2.º EIC, borde esternal derecho');
add('P','f','c',170,150,'P','Foco pulmonar','2.º EIC, borde esternal izquierdo');
add('E','f','c',170,172,'E','Foco de Erb (aórtico accesorio)','3.er EIC izquierdo, paraesternal');
add('T','f','c',160,196,'T','Foco tricuspídeo','4.º–5.º EIC, borde esternal izquierdo');
add('M','f','c',184,216,'M','Foco mitral (ápex)','5.º EIC, línea medioclavicular izquierda');
add('IC','f','c',176,126,'IC','Infraclavicular izquierdo','1.º–2.º EIC izquierdo, bajo la clavícula');
add('Ax','f','c',232,200,'Ax','Axilar','Línea axilar anterior/media izquierda');
add('Cd','f','c',132,98,'Cd','Carótida derecha','Borde anterior del esternocleidomastoideo derecho');
add('Ci','f','c',168,98,'Ci','Carótida izquierda','Borde anterior del esternocleidomastoideo izquierdo');
add('IE','b','c',150,150,'IE','Interescapular','Entre las escápulas, T4–T6 (coartación)');
add('Tr','f','p',150,110,'Tr','Tráquea / manubrio','Línea media del cuello, sobre la tráquea');
[[102,114,'a','ápex'],[92,148,'s','campo superior'],[88,186,'m','campo medio'],[86,226,'b','base']].forEach((c,i)=>{
 add('fD'+(i+1),'f','p',c[0],c[1],'D'+(i+1),'Pulmón derecho · '+c[3],'Cara anterior derecha',c[2]);
 add('fI'+(i+1),'f','p',300-c[0],c[1],'I'+(i+1),'Pulmón izquierdo · '+c[3],'Cara anterior izquierda',c[2]);});
[[140,'s','campo superior'],[180,'m','campo medio'],[222,'b','base']].forEach((c,i)=>{
 add('bD'+(i+1),'b','p',190,c[0],'D'+(i+1),'Pulmón derecho posterior · '+c[2],'Cara posterior derecha',c[1]);
 add('bI'+(i+1),'b','p',110,c[0],'I'+(i+1),'Pulmón izquierdo posterior · '+c[2],'Cara posterior izquierda',c[1]);});
add('q1','f','a',128,280,'CSD','Cuadrante superior derecho','Hipocondrio derecho');
add('q2','f','a',172,280,'CSI','Cuadrante superior izquierdo','Hipocondrio izquierdo');
add('q3','f','a',128,320,'CID','Cuadrante inferior derecho','Fosa ilíaca derecha');
add('q4','f','a',172,320,'CII','Cuadrante inferior izquierdo','Fosa ilíaca izquierda');
add('pu','f','a',150,300,'Pu','Periumbilical','Alrededor del ombligo');
add('Ao','f','a',150,262,'Ao','Aorta abdominal','Línea media, epigastrio');
add('rD','b','a',176,272,'RD','Ángulo costovertebral derecho','Región renal derecha');
add('rI','b','a',124,272,'RI','Ángulo costovertebral izquierdo','Región renal izquierda');
const ex=s=>s.split(' ').flatMap(t=>{const L=Object.values(F).filter(f=>f.s=='p'&&f.id!='Tr');
 return t=='@lung'?L.map(f=>f.id):t=='@base'?L.filter(f=>f.z=='b').map(f=>f.id):t=='@mid'?L.filter(f=>f.z=='m'||f.z=='s').map(f=>f.id):t=='@abd'?['q1','q2','q3','q4','pu']:[t]});
/* ---------- Sonidos: [grupo, nombre, tag, focos, params, descripción, mejor] ---------- */
const g1='RUIDOS NORMALES Y AGREGADOS',g2='SOPLOS SISTÓLICOS',g3='SOPLOS DIASTÓLICOS Y CONTINUOS',L1='RUIDOS RESPIRATORIOS NORMALES',L2='RUIDOS ADVENTICIOS',B1='RUIDOS INTESTINALES',B2='SOPLOS VASCULARES';
const H=(g,n,t,f,p,d,b)=>({g,n,t,f,s:'c',p:{k:'h',...p},d,b});
const S=[
H(g1,'Ruidos cardíacos normales','Normal','A P E T M',{},'R1 y R2 nítidos con silencios sistólico y diastólico libres.','d'),
H(g1,'Desdoblamiento fisiológico de R2','Inspiración','P E',{sp:.04},'R2 se desdobla en inspiración y se une en espiración.','d'),
H(g1,'Desdoblamiento amplio de R2','BRDHH / EP','P',{sp:.09},'Separación aumentada entre A2 y P2.','d'),
H(g1,'Desdoblamiento fijo de R2 (CIA)','Fijo','P',{sp:.07},'No varía con la respiración: típico de comunicación interauricular.','d'),
H(g1,'Desdoblamiento paradójico de R2','Inverso','A P',{sp:.06},'P2 precede a A2; se acentúa en espiración (BRIHH, EAo).','d'),
H(g1,'Tercer ruido (R3): galope ventricular','Protodiástole','M',{s3:1},'Tono grave tras R2. Normal en jóvenes; patológico en IC.','b'),
H(g1,'Cuarto ruido (R4): galope auricular','Telediástole','M',{s4:1},'Tono grave previo a R1: ventrículo rígido (HVI, isquemia).','b'),
H(g1,'Clic de eyección aórtico','Sistólico precoz','A E',{clk:.1,m:['s','diam',380,.18]},'Chasquido agudo tras R1: válvula aórtica bicúspide o estenótica.','d'),
H(g1,'Fibrilación auricular','Irregular','A P E T M',{irr:1},'Ritmo irregularmente irregular, R1 de intensidad variable.','d'),
H(g1,'Roce pericárdico','Tri-fásico','E T',{rub:1},'Sonido rasposo, «cuero nuevo»; mejor sentado e inclinado al frente.','d'),
H(g2,'Insuficiencia mitral','Holosistólico','M Ax',{m:['s','holo',650,.45]},'Soplo soplante en ápex que irradia a axila.','d'),
H(g2,'Prolapso de la válvula mitral','Clic + telesistólico','M',{clk:.17,m:['s','late',600,.35]},'Clic mesosistólico seguido de soplo tardío.','d'),
H(g2,'Insuficiencia tricuspídea','Holosistólico','T',{m:['s','holo',550,.35]},'Aumenta con la inspiración (signo de Rivero-Carvallo).','d'),
H(g2,'Comunicación interventricular (CIV)','Holosistólico','E T',{m:['s','holo',520,.6]},'Soplo áspero en borde esternal izquierdo bajo.','d'),
H(g2,'Miocardiopatía hipertrófica obstructiva','Mesosistólico','E A',{m:['s','cres',420,.5]},'Aumenta con Valsalva y de pie; disminuye en cuclillas.','d'),
H(g2,'Estenosis aórtica','Mesosistólico','A E Cd Ci',{m:['s','diam',320,.65]},'Romboidal, áspero, irradia a carótidas.','d'),
H(g2,'Estenosis pulmonar','Mesosistólico','P',{m:['s','diam',400,.5]},'Romboidal en foco pulmonar, con R2 desdoblado.','d'),
H(g2,'Soplo inocente (de Still)','Mesosistólico suave','P E',{m:['s','diam',260,.22]},'Vibratorio, suave, que cambia con la posición. Sin patología.','d'),
H(g2,'Soplo carotídeo','Sistólico','Cd Ci',{m:['s','diam',500,.4]},'Estenosis de la arteria carótida; auscultar en apnea.','d'),
H(g2,'Coartación de aorta','Sistólico posterior','IE',{m:['s','cres',450,.4]},'Soplo interescapular, pulsos femorales retrasados.','d'),
H(g3,'Insuficiencia aórtica','Protodiastólico','E A',{m:['d','dec',700,.35]},'Soplo aspirativo decreciente; mejor sentado e inclinado al frente.','d'),
H(g3,'Insuficiencia pulmonar','Protodiastólico','P E',{m:['d','dec',600,.28]},'Soplo de Graham Steell si hay hipertensión pulmonar.','d'),
H(g3,'Estenosis mitral','Diastólico + chasquido','M',{opn:1,m:['d','cres',110,.9]},'Chasquido de apertura y retumbo diastólico; decúbito lateral izq.','b'),
H(g3,'Estenosis tricuspídea','Diastólico','T',{opn:1,m:['d','cres',130,.5]},'Retumbo borde esternal izquierdo, aumenta con inspiración.','b'),
H(g3,'Ductus arterioso persistente','Continuo («maquinaria»)','IC P',{m:['c','diam',300,.55]},'Soplo continuo infraclavicular izquierdo.','d'),
{g:L1,n:'Murmullo vesicular',t:'Inspiración > espiración',f:'@lung',s:'p',p:{k:'l',m:'ves'},d:'Suave, ruido de hojas; se oye en casi todo el campo pulmonar.',b:'d'},
{g:L1,n:'Soplo traqueal / bronquial',t:'Insp. = espiración',f:'Tr',s:'p',p:{k:'l',m:'bro'},d:'Fuerte y tubular sobre tráquea; en parénquima sugiere condensación.',b:'d'},
{g:L1,n:'Broncovesicular',t:'Mixto',f:'fD1 fI1 fD2 fI2 bD1 bI1',s:'p',p:{k:'l',m:'bv'},d:'Normal en regiones paraesternal alta e interescapular.',b:'d'},
{g:L2,n:'Crepitantes finos',t:'Final de inspiración',f:'@base',s:'p',p:{k:'l',m:'crf'},d:'Velcro: fibrosis, edema pulmonar, insuficiencia cardíaca.',b:'d'},
{g:L2,n:'Crepitantes gruesos',t:'Insp. y espiración',f:'@base @mid',s:'p',p:{k:'l',m:'crg'},d:'Burbujeo: secreciones, neumonía, bronquiectasias.',b:'d'},
{g:L2,n:'Sibilancias',t:'Espiratorias',f:'@lung',s:'p',p:{k:'l',m:'wh'},d:'Musicales agudos: asma, EPOC, obstrucción de vía aérea.',b:'d'},
{g:L2,n:'Roncus',t:'Insp. y espiración',f:'@mid',s:'p',p:{k:'l',m:'ron'},d:'Graves, como ronquido; se modifican con la tos.',b:'d'},
{g:L2,n:'Estridor',t:'Inspiratorio',f:'Tr Cd Ci',s:'p',p:{k:'l',m:'str'},d:'Agudo, fuerte, en cuello: obstrucción de vía aérea superior.',b:'d'},
{g:L2,n:'Roce pleural',t:'Bifásico',f:'fD4 fI4 bD3 bI3',s:'p',p:{k:'l',m:'rub'},d:'Rasposo, coincide con el movimiento respiratorio; dolor pleurítico.',b:'d'},
{g:L2,n:'Murmullo disminuido (derrame)',t:'Hipoventilación',f:'@base',s:'p',p:{k:'l',m:'dim'},d:'Derrame pleural, neumotórax o atelectasia.',b:'d'},
{g:B1,n:'Ruidos intestinales normales',t:'5–30 / min',f:'@abd',s:'a',p:{k:'b',m:'nor'},d:'Gorgoteos irregulares y breves en los cuatro cuadrantes.',b:'d'},
{g:B1,n:'Hiperperistaltismo',t:'Aumentados',f:'@abd',s:'a',p:{k:'b',m:'hyp'},d:'Gastroenteritis, obstrucción precoz, hemorragia digestiva.',b:'d'},
{g:B1,n:'Hipoperistaltismo',t:'Disminuidos',f:'@abd',s:'a',p:{k:'b',m:'hpo'},d:'Íleo, peritonitis, postoperatorio.',b:'d'},
{g:B1,n:'Ruidos ausentes',t:'Silencio ≥ 2 min',f:'@abd',s:'a',p:{k:'b',m:'abs'},d:'Escuchar al menos 2 min por cuadrante antes de concluir.',b:'d'},
{g:B1,n:'Borborigmos',t:'Prolongados',f:'q3 q4 pu',s:'a',p:{k:'b',m:'bor'},d:'Gorgoteos largos y graves, frecuentes con hambre.',b:'d'},
{g:B1,n:'Ruidos metálicos (obstrucción)',t:'Timbre agudo',f:'@abd',s:'a',p:{k:'b',m:'met'},d:'Tintineo agudo sobre asas dilatadas.',b:'d'},
{g:B2,n:'Soplo aórtico abdominal',t:'Sistólico',f:'Ao',s:'a',p:{k:'b',m:'ao'},d:'Aneurisma o estenosis de aorta abdominal.',b:'d'},
{g:B2,n:'Soplo de arteria renal',t:'Sistólico–diastólico',f:'Ao rD rI',s:'a',p:{k:'b',m:'ren'},d:'Sospecha de estenosis de la arteria renal / HTA secundaria.',b:'d'}
];
S.forEach(s=>s.ids=ex(s.f));
