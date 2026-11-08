/* ---------------- Modo carrera ----------------
   Arrancás sin ranking (puesto 16). Ganando subís hasta el #1, que te da la pelea por el título.
   Siendo campeón, cada pelea es una defensa. Todo se guarda en este navegador.
   Pantalla tipo "despacho": barra con tu peleador, pestañas (Inicio, Peleador, Ranking, Bandeja,
   Historial, Mi carrera), lo que sigue, próxima pelea, cómo estás y la tabla de tu división. */
let C=store.get('career',null),kPick=null,kDiv='ligero',kTab='inicio',kMsg=0;
const saveC=()=>store.set('career',C);
const rankLabel=k=>{const d=divName(k.div||'ligero').toUpperCase();return k.champ?`CAMPEÓN · ${d}`:k.rank>=16?`SIN RANKING · ${d}`:`#${k.rank} · ${d}`;};
const oppRank=f=>f.rank===0?'CAMPEÓN':f.rank>=16?'Sin ranking':`#${f.rank}`;
const CAMPS=[
 ['Boxeo','Golpes más precisos y rápidos',{str:2,spd:1}],
 ['Potencia','Pegás más fuerte y aguantás más',{pow:2,chin:1}],
 ['Lucha','Derribos y defensa de derribo',{wre:2,tdd:1}],
 ['Jiu-jitsu','Sumisiones y juego de piso',{bjj:2,wre:1}],
 ['Cardio','Te cansás menos',{car:3}],
 ['Defensa','Frenar derribos y bancar golpes',{tdd:2,chin:1}]
];
const statName=k=>STATS.find(x=>x[0]===k)[1];
const fmtMoney=n=>n>=1e6?`US$ ${(n/1e6).toFixed(n>=1e7?0:1).replace('.',',')}M`:`US$ ${Math.round(n/1e3)}K`;
const fmtDate=ms=>new Date(ms).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
function applyGain(s,g){const out=[];for(const k in g){const add=s[k]>=90?1:g[k],nv=Math.min(99,s[k]+add);if(nv>s[k])out.push(`${statName(k)} +${nv-s[k]}`);s[k]=nv;}return out;}
function genOpp(rank){
 const f=randFighter(),target=rank===0?88:60+(16-rank)*1.7,vals=Object.values(f.s),m=vals.reduce((a,c)=>a+c,0)/vals.length;
 for(const k in f.s)f.s[k]=clamp(Math.round(f.s[k]-m+target+rand(-2,2)),35,98);
 f.rank=rank;f.div=C?C.div:'ligero';return f;
}
// Rival de la división con ese puesto (campeón = 0); si no existe en el plantel, se genera uno
function divOpp(rank){
 const f=ROSTER.find(x=>fDiv(x)===(C.div||'ligero')&&x.rank===rank&&x.name!==C.f.name);
 if(f){const o=JSON.parse(JSON.stringify(f));o.rank=rank;return o;}
 return genOpp(rank);
}
function makeOffers(){
 if(C.champ)return[1,2,3].map(r=>({f:divOpp(r),title:true}));
 if(C.rank===1)return[{f:divOpp(0),title:true}];
 const rs=C.rank>=16?[16,15,14]:[Math.min(16,C.rank+2),C.rank-1,Math.max(1,C.rank-3)];
 return[...new Set(rs)].map(r=>({f:divOpp(r),title:false}));
}
// Bolsa de la pelea: sube con el puesto del rival y si es por el título
const purse=(o,title)=>Math.round(((title?260:0)+12*(17-Math.min(16,o.rank===0?0:o.rank))+20)*1000);
// Mensajes de la bandeja
function msg(de,tipo,titulo,texto){C.inbox.unshift({de,tipo,titulo,texto,f:C.date,leido:false});C.inbox=C.inbox.slice(0,25);}
// Carreras guardadas con la versión anterior: completar lo que falta
function migrar(){
 if(!C)return;
 C.date=C.date||Date.now();C.pop=C.pop??20;C.money=C.money||0;C.streak=C.streak||0;C.titles=C.titles||(C.champ?1:0);C.inbox=C.inbox||[];
 C.best=C.best??C.rank;
}
migrar();
function startCareer(f,div){
 const d=JSON.parse(JSON.stringify(f));
 C={div,f:d,rec:{w:0,l:0,d:0},rank:16,best:16,champ:false,defenses:0,titles:0,hist:[],step:'offers',offers:null,opp:null,title:false,
  date:Date.now(),pop:20,money:0,streak:0,inbox:[],last:`Arranca la carrera de ${d.name}. Elegí tu primera pelea.`};
 msg('Tu mánager','manager','Bienvenido a la '+divName(div).toLowerCase(),`Arrancamos sin ranking. Te consigo peleas contra los de abajo de la tabla: ganá y en cada pelea te ofrecen rivales más arriba. Al llegar al #1 viene la pelea por el cinturón.`);
 C.offers=makeOffers();saveC();kTab='inicio';renderCareer();
}
// Aplica el resultado de una pelea (jugada o simulada)
function applyResult(res){
 const opp=C.opp,wasChamp=C.champ,n=C.rec.w+C.rec.l+C.rec.d+1,bolsa=purse(opp,C.title);let txt;
 const fin=/KO|Sumisión/.test(res.method);
 if(res.w==='p'){
  C.rec.w++;C.streak=Math.max(1,C.streak+1);C.pop=Math.min(100,C.pop+(fin?10:6)+(C.title?8:0));C.money+=bolsa*2;
  if(wasChamp){C.defenses++;txt=`¡Retuviste el título ante ${opp.last}! Van ${C.defenses} defensa${C.defenses>1?'s':''}.`;}
  else if(opp.rank===0){C.champ=true;C.rank=0;C.titles++;txt=`¡${C.f.last.toUpperCase()} ES EL NUEVO CAMPEÓN! Le ganaste a ${opp.last} por ${res.method.toLowerCase()}.`;}
  else{C.rank=opp.rank<C.rank?opp.rank:Math.max(1,C.rank-1);txt=`Le ganaste a ${opp.last} por ${res.method.toLowerCase()}. Ahora estás ${rankLabel(C).toLowerCase()}.`;}
  const ks=shuffle(STATS.map(s=>s[0])).slice(0,2),g={};ks.forEach(k=>g[k]=1);const up=applyGain(C.f.s,g);if(up.length)txt+=` Experiencia: ${up.join(', ')}.`;
 }else if(res.w==='r'){
  C.rec.l++;C.streak=Math.min(-1,C.streak-1);C.pop=Math.max(0,C.pop-5);C.money+=bolsa;
  if(wasChamp){C.champ=false;C.rank=2;txt=`Perdiste el título contra ${opp.last}. Quedás #2: a ganar para la revancha.`;}
  else{C.rank=Math.min(16,C.rank+2);txt=`Perdiste con ${opp.last} por ${res.method.toLowerCase()}. Bajás a ${rankLabel(C).toLowerCase()}.`;}
 }else{C.rec.d++;C.streak=0;C.money+=bolsa;txt=`Empate con ${opp.last}. El ranking no se mueve.`;}
 C.best=Math.min(C.best,C.rank);
 C.hist.unshift({n,opp:opp.name,orank:oppRank(opp),res:res.w,method:res.method,round:res.round,title:C.title,f:C.date,bolsa:res.w==='p'?bolsa*2:bolsa});
 C.hist=C.hist.slice(0,40);
 msg('La empresa','empresa',res.w==='p'?'Ganaste: tu bolsa':'Tu bolsa de la pelea',`${txt} Cobraste ${fmtMoney(res.w==='p'?bolsa*2:bolsa)}${res.w==='p'?' (bolsa más premio por ganar)':''}.`);
 if(fin&&res.w==='p')msg('Prensa','prensa','Bono de la noche',`La prensa habla de tu ${res.method==='Sumisión'?'sumisión':'nocaut'}. Tu popularidad sube.`);
 C.date+=7*864e5*rand(7,11);C.last=txt;C.step='offers';C.opp=null;C.title=false;C.offers=makeOffers();
 msg('Tu mánager','manager',C.offers[0].title?(C.champ?'Defensas disponibles':'¡Te dan la pelea por el título!'):'Nuevas ofertas de pelea',`Tenés ${C.offers.length} rival${C.offers.length>1?'es':''} para elegir. Mirá su nivel antes de aceptar.`);
 saveC();
}
function careerFight(){
 const n=C.rec.w+C.rec.l+C.rec.d+1;
 startFight(C.f,C.opp,{kind:'career',rounds:C.title?5:3,title:C.title?(C.champ?'DEFENSA DEL TÍTULO':'PELEA POR EL TÍTULO'):`CARRERA · PELEA ${n}`,onDone(res){applyResult(res);kTab='inicio';showScreen('career');}});
}
// Simular sin jugar
function careerSim(){
 const r=simFight(C.f,C.opp);applyResult({w:r.w===C.f?'p':'r',method:r.method,round:/Decisión/.test(r.method)?(C.title?5:3):1+Math.floor(rnd()*(C.title?5:3))});
 kTab='inicio';renderCareer();
}
// Tabla de la división con vos adentro
function tablaDivision(){
 const lista=ROSTER.filter(x=>fDiv(x)===C.div&&x.rank!=null&&x.name!==C.f.name).sort((a,b)=>a.rank-b.rank).map(x=>({n:x.name,flag:x.flag,rank:x.rank,lvl:Math.round(ovr(x)),f:x}));
 const out=[];let r=0;
 for(const x of lista){
  let rr=x.rank;
  if(!C.champ&&C.rank<16&&rr>=C.rank)rr++;
  if(C.champ&&rr===0)rr=1;
  out.push({...x,rank:rr});
 }
 out.push({n:C.f.name,flag:C.f.flag,rank:C.champ?0:C.rank,lvl:Math.round(ovr(C.f)),me:1});
 return out.sort((a,b)=>a.rank-b.rank).filter(x=>x.rank<=15||x.me);
}
/* ---------- Pantalla ---------- */
function topbar(){
 const o=C.opp||(C.offers&&C.offers.length===1?C.offers[0].f:null),sinLeer=C.inbox.filter(m=>!m.leido).length;
 const cta=C.step==='offers'?['Elegir rival','offers']:C.step==='camp'?['Ir al campamento','camp']:['¡A pelear!','fight'];
 return`<header class="cr-top">
  <button class="cr-ic" data-go="home" aria-label="Volver al menú">◀</button>
  <canvas class="cr-av" id="kAv" width="56" height="48"></canvas>
  <div class="cr-id"><small>${divName(C.div)} · <span class="flagtxt">${C.f.flag}</span></small><b>${esc(C.f.name)}</b></div>
  <div class="cr-chip">Bolsa <b>${fmtMoney(C.money)}</b></div>
  <div class="cr-sp"></div>
  <div class="cr-date"><small>${C.champ?'Campeón':C.rank>=16?'Sin ranking':'Ranking #'+C.rank}</small><b>${fmtDate(C.date)}</b></div>
  <div class="cr-next"><small>Próxima pelea${C.title?' · Título':''}</small><b>${o?'vs '+esc(o.last)+' · '+(C.title?5:3)+' rounds':'Por definir'}</b></div>
  <button class="cr-cta" data-k="${cta[1]}">${cta[0]}${sinLeer?` <i>+${sinLeer}</i>`:''} ›</button>
 </header>
 <nav class="cr-tabs" role="tablist">${[['inicio','Inicio'],['peleador','Peleador'],['ranking','Ranking'],['bandeja','Bandeja'],['historial','Historial'],['oficina','Mi carrera']].map(([k,l])=>`<button role="tab" data-tab="${k}" aria-selected="${kTab===k}">${l}${k==='bandeja'&&sinLeer?` <i class="cr-badge">${sinLeer}</i>`:''}</button>`).join('')}</nav>`;
}
function barra(label,v,sub,col){return`<div class="cr-bar"><div><span>${label}</span><b>${v}</b></div><i><u style="width:${v}%;background:${col}"></u></i><small>${sub}</small></div>`;}
function tarjetaPelea(){
 if(C.step==='offers'){
  const t=C.offers[0]&&C.offers[0].title;
  return`<section class="cr-card"><h4>${C.champ?'ELEGÍ TU DEFENSA':t?'PELEA POR EL TÍTULO':'OFERTAS DE PELEA'}</h4>
   <div class="cr-offers">${C.offers.map((o,i)=>`<button class="cr-offer ${o.title?'title':''}" data-of="${i}"><canvas width="56" height="48"></canvas><span class="nm">${esc(o.f.name)}</span><span class="meta">${oppRank(o.f)} · Nivel ${Math.round(ovr(o.f))}</span><span class="meta">${o.f.flag} · ${o.f.style}</span><span class="cr-purse">${fmtMoney(purse(o.f,o.title))}</span></button>`).join('')}</div>
   <p class="cr-note">Tu nivel: <b>${Math.round(ovr(C.f))}</b>. Cuanto más arriba el rival, más subís si le ganás.</p></section>`;
 }
 const o=C.opp;
 return`<section class="cr-card cr-vs"><h4>${C.title?(C.champ?'DEFENSA DEL TÍTULO':'PELEA POR EL TÍTULO'):'PRÓXIMA PELEA'} · ${(C.title?5:3)} ROUNDS</h4>
  <div class="cr-vsrow"><div><canvas id="kVsP" width="56" height="48"></canvas><b>${esc(C.f.last)}</b><small>${C.champ?'Campeón':C.rank>=16?'Sin ranking':'#'+C.rank} · ${C.rec.w}-${C.rec.l}-${C.rec.d}</small></div>
  <div class="cr-vsmid"><b>VS</b><small>${fmtDate(C.date)}</small><small>Bolsa ${fmtMoney(purse(o,C.title))}</small></div>
  <div><canvas id="kVsR" width="56" height="48"></canvas><b>${esc(o.last)}</b><small>${oppRank(o)} · Nivel ${Math.round(ovr(o))}</small></div></div>
  <div class="cr-cara"><span>CARA A CARA</span> ${esc(o.name)} · ${o.flag} · ${o.style}</div>
  ${C.step==='camp'?`<div class="cr-btns"><button class="cr-y" data-k="camp">Ir al campamento</button><button class="cr-o" data-k="skipcamp">Saltear campamento</button></div>`
   :`<div class="cr-btns"><button class="cr-y" id="kFight">Pelear ▶</button><button class="cr-o" id="kSim">Directo al resultado</button></div>`}</section>`;
}
function queSigue(){
 const pasos=['Elegir rival','Campamento','Pelea'],i=C.step==='offers'?0:C.step==='camp'?1:2;
 const t=C.step==='offers'?['Elegí tu próximo rival','Tenés ofertas sobre la mesa. Un rival de más arriba te hace subir más en el ranking, pero es más peligroso.','Ver ofertas','offers']
  :C.step==='camp'?['Campamento de entrenamiento',`Elegí en qué enfocar las semanas antes de pelear con ${esc(C.opp.last)}. Lo que mejores queda para toda la carrera.`,'Elegir campamento','camp']
  :['Noche de pelea',`Todo listo contra ${esc(C.opp.name)}. Podés pelearla vos o mirar directo el resultado.`,'Ir al octágono','fight'];
 return`<section class="cr-card"><h4>LO QUE SIGUE</h4><h3>${t[0]}</h3><p>${t[1]}</p>
  <div class="cr-btns"><button class="cr-y" data-k="${t[3]}">${t[2]} ›</button>${C.last?`<span class="cr-last">${esc(C.last)}</span>`:''}</div>
  <div class="cr-steps">${pasos.map((p,j)=>`<i class="${j<i?'ok':j===i?'on':''}"></i>`).join('')}</div>
  <div class="cr-stepl">PASO ${i+1} DE 3 · ${pasos[i].toUpperCase()}</div></section>`;
}
function comoEstas(){
 const forma=clamp(50+C.streak*15,0,100),hist=C.hist.slice(0,5);
 const conf=C.champ?100:clamp(Math.round((17-C.rank)/16*100),5,100);
 return`<section class="cr-card"><h4>CÓMO ESTÁS</h4>
  ${barra('Popularidad',C.pop,C.pop>70?'Te piden en los carteles principales':C.pop>40?'Te conocen':'Todavía nadie te conoce','#3fbf5f')}
  ${barra('Forma',forma,C.streak>1?`${C.streak} victorias seguidas`:C.streak<-1?`${-C.streak} derrotas seguidas`:'Pareja','#f0a030')}
  ${barra('Camino al título',conf,C.champ?'Tenés el cinturón':C.rank===1?'Te toca pelear por el cinturón':`Te faltan ${C.rank>=16?'entrar al ranking y ':''}${Math.max(1,C.rank-1)} puesto${C.rank-1>1?'s':''}`,'#d20a0a')}
  <div class="cr-last5">${hist.length?hist.map(h=>`<i class="${h.res==='p'?'w':h.res==='r'?'l':'d'}">${h.res==='p'?'G':h.res==='r'?'P':'E'}</i>`).join(''):'<small>Sin peleas todavía</small>'}</div></section>`;
}
function rankingHtml(full){
 const t=tablaDivision(),rows=full?t:t.filter(x=>x.rank<=5||x.me||Math.abs(x.rank-C.rank)<=1);
 return`<section class="cr-card"><h4>${divName(C.div).toUpperCase()} <span>RANKING</span></h4><table class="cr-tab"><thead><tr><th>#</th><th>PELEADOR</th><th>NIVEL</th></tr></thead><tbody>
  ${rows.map(x=>`<tr class="${x.me?'me':''}"><td>${x.rank===0?'C':x.rank>=16?'–':x.rank}</td><td>${esc(x.n)} <small>${x.flag}</small></td><td>${x.lvl}</td></tr>`).join('')}</tbody></table></section>`;
}
function bandejaHtml(compacta){
 if(!C.inbox.length)return`<section class="cr-card"><h4>BANDEJA</h4><p class="cr-note">No hay mensajes.</p></section>`;
 kMsg=Math.min(kMsg,C.inbox.length-1);const m=C.inbox[kMsg];
 const lista=(compacta?C.inbox.slice(0,4):C.inbox).map((x,i)=>`<button class="cr-msg ${i===kMsg?'on':''} ${x.leido?'':'new'}" data-msg="${i}"><i class="cr-av2 ${x.tipo}">${x.de.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</i><span><b>${esc(x.titulo)}</b><small>${esc(x.de)}</small></span><small>${new Date(x.f).toLocaleDateString('es-AR',{day:'numeric',month:'short'})}</small></button>`).join('');
 return`<section class="cr-card cr-inbox"><h4>BANDEJA <button class="cr-mini" id="kRead">✓ Marcar todo como leído</button></h4><div class="cr-ibx"><div class="cr-ilist">${lista}</div>
  <article class="cr-idet"><div class="cr-ifrom"><i class="cr-av2 ${m.tipo}">${m.de.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</i><div><b>${esc(m.de)}</b><small>${fmtDate(m.f)}</small></div></div><h3>${esc(m.titulo)}</h3><p>${esc(m.texto)}</p></article></div></section>`;
}
function campHtml(){
 return`<section class="cr-card cr-wide"><h4>CAMPAMENTO · VS ${esc(C.opp.name).toUpperCase()}</h4><p class="cr-note">Elegí en qué enfocar el entrenamiento. Lo que mejores queda para toda la carrera.</p>
  <div class="camps">${CAMPS.map(([n,d,g],i)=>`<button class="camp" data-camp="${i}"><b>${n.toUpperCase()}</b><span>${d}</span><small>${Object.entries(g).map(([k,v])=>`${statName(k)} +${v}`).join(' · ')}</small></button>`).join('')}</div></section>`;
}
function peleadorHtml(){
 const f=C.f;
 return`<section class="cr-card cr-me"><canvas id="kPrev" width="96" height="112"></canvas><div>
  <h3>${esc(f.name)}</h3><p class="cr-note">${f.nick?esc(f.nick)+' · ':''}${f.flag} · ${f.style} · ${divName(C.div)}</p>
  <div class="cr-big">${C.rec.w}-${C.rec.l}-${C.rec.d}</div><small class="cr-note">GANADAS · PERDIDAS · EMPATES</small>
  <div class="rank ${C.champ?'gold':''}">${rankLabel(C)}${C.champ&&C.defenses?` · ${C.defenses} DEF.`:''}</div></div>
  <div class="kstats">${STATS.map(([k,l])=>`<div class="ks"><span>${l}</span><div class="bar r"><i style="width:${f.s[k]}%"></i></div><b>${f.s[k]}</b></div>`).join('')}<div class="ks"><span>Nivel</span><div class="bar r"><i style="width:${ovr(f)}%"></i></div><b>${Math.round(ovr(f))}</b></div></div></section>`;
}
function historialHtml(){
 return`<section class="cr-card cr-wide"><h4>HISTORIAL</h4>${C.hist.length?`<ol class="hist">${C.hist.map(h=>`<li class="${h.res==='p'?'w':h.res==='r'?'l':'d'}"><b>${h.res==='p'?'G':h.res==='r'?'P':'E'}</b><span>${esc(h.opp)} <small>${h.orank}${h.title?' · título':''}${h.f?' · '+new Date(h.f).toLocaleDateString('es-AR',{month:'short',year:'numeric'}):''}</small></span><small>${h.method}${h.method==='Abandono'?'':` · R${h.round}`}${h.bolsa?' · '+fmtMoney(h.bolsa):''}</small></li>`).join('')}</ol>`:'<p class="cr-note">Todavía no peleaste.</p>'}</section>`;
}
function oficinaHtml(){
 const n=C.rec.w+C.rec.l+C.rec.d,ef=n?Math.round(C.rec.w/n*100)+'%':'—',fin=C.hist.filter(h=>h.res==='p'&&/KO|Sumisión/.test(h.method)).length;
 return`<section class="cr-card cr-wide"><h4>TU CARRERA</h4><div class="cr-kpis">
  ${[[n,'Peleas'],[ef,'Efectividad'],[fin,'Por KO o sumisión'],[C.titles,'Títulos'],[C.defenses,'Defensas'],[C.best===0?'C':C.best>=16?'–':'#'+C.best,'Mejor puesto'],[fmtMoney(C.money),'Ganado en bolsas'],[C.pop,'Popularidad']].map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div></section>
  <section class="cr-card cr-wide cr-danger"><div><b>Empezar otra carrera</b><small>Se borra esta carrera y elegís otro peleador o división.</small></div><button class="cr-red" id="kReset">Nueva carrera…</button></section>`;
}
function renderCareer(){
 const B=$('#kBody');
 $('#career').classList.toggle('cr-on',!!C);
 if(!C){
  const list=[...new Set([...CUSTOM,...fightersOf(kDiv)])];if(!list.includes(kPick))kPick=list[0];
  B.innerHTML=`<header class="sh"><button class="back" data-go="home">◀ MENÚ</button><h2>MODO CARRERA</h2></header>
   <p class="lead">Elegí con quién arrancar. Empezás sin ranking en la división que elijas: ganá peleas, subí al #1 y peleá por el cinturón contra el campeón de esa división. Lo mejor es usar un peleador tuyo: <button class="link" data-go="create">crear peleador</button>.</p>
   <label class="dsel" for="kDiv"><span>División donde vas a competir</span><select id="kDiv">${divOptions(kDiv,false)}</select></label>
   ${pickerHtml('kPicker',list,kPick)}
   <div class="stick"><button class="go" id="kStart">EMPEZAR CARRERA CON <span id="kName">${esc(kPick.name).toUpperCase()}</span></button></div>`;
  bindPicker('kPicker',list,f=>{kPick=f;$('#kName').textContent=f.name.toUpperCase();});
  $('#kDiv').onchange=e=>{kDiv=e.target.value;renderCareer();};
  $('#kStart').onclick=()=>startCareer(kPick,kDiv);
  return;
 }
 let body='';
 if(kTab==='inicio')body=`<div class="cr-grid3">${queSigue()}${tarjetaPelea()}${comoEstas()}</div>${C.step==='camp'?campHtml():''}<div class="cr-grid2">${bandejaHtml(true)}${rankingHtml(false)}</div>`;
 else if(kTab==='peleador')body=`<div class="cr-grid2">${peleadorHtml()}${comoEstas()}</div>`;
 else if(kTab==='ranking')body=rankingHtml(true);
 else if(kTab==='bandeja')body=bandejaHtml(false);
 else if(kTab==='historial')body=historialHtml();
 else body=oficinaHtml();
 B.innerHTML=topbar()+`<div class="cr-body">${body}</div>`;
 const port=(id,f,face)=>{const cv=$('#'+id);if(cv)drawPortrait(cv,f,face);};
 port('kAv',C.f,1);if(C.opp){port('kVsP',C.f,1);port('kVsR',C.opp,-1);}
 B.querySelectorAll('.cr-offer canvas').forEach((cv,i)=>drawPortrait(cv,C.offers[i].f,-1));
 // marcar como leído el mensaje abierto
 if((kTab==='inicio'||kTab==='bandeja')&&C.inbox[kMsg]&&!C.inbox[kMsg].leido){C.inbox[kMsg].leido=true;saveC();}
}
// Un solo manejador para toda la pantalla
$('#kBody').addEventListener('click',e=>{
 if(!C)return;const b=e.target.closest('button');if(!b)return;
 if(b.dataset.tab){kTab=b.dataset.tab;renderCareer();return;}
 if(b.dataset.msg!=null){kMsg=+b.dataset.msg;renderCareer();return;}
 if(b.id==='kRead'){C.inbox.forEach(m=>m.leido=true);saveC();renderCareer();return;}
 if(b.dataset.of!=null){const o=C.offers[+b.dataset.of];C.opp=o.f;C.title=o.title;C.step='camp';C.last='';saveC();kTab='inicio';renderCareer();return;}
 if(b.dataset.camp!=null){const[n,,g]=CAMPS[+b.dataset.camp];const up=applyGain(C.f.s,g);C.last=`Campamento de ${n.toLowerCase()}: ${up.length?up.join(', '):'ya estás al máximo ahí'}.`;C.step='fight';saveC();renderCareer();return;}
 const k=b.dataset.k;
 if(k==='offers'||k==='camp'){kTab='inicio';renderCareer();const t=$(k==='offers'?'.cr-offers':'.camps');if(t)t.scrollIntoView({behavior:'smooth',block:'center'});return;}
 if(k==='skipcamp'){C.step='fight';C.last='';saveC();renderCareer();return;}
 if(k==='fight'||b.id==='kFight'){careerFight();return;}
 if(b.id==='kSim'){careerSim();return;}
 if(b.id==='kReset'){if(!b.dataset.sure){b.dataset.sure='1';b.textContent='¿Seguro? Se borra';return;}C=null;store.del('career');kTab='inicio';renderCareer();}
});
function drawCareerPrev(t){const cv=$('#kPrev');if(cv&&C)drawAnimated(cv.getContext('2d'),C.f,44,108,1,'guard',t,'#10141c');}
