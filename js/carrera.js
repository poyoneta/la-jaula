/* ---------------- Modo carrera ---------------- */
// Arrancás sin ranking (puesto 16). Ganando subís hasta el #1, que te da la pelea por el título.
// Siendo campeón, cada pelea es una defensa. Todo se guarda en este navegador.
let C=store.get('career',null),kPick=null,kDiv='ligero';
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
function startCareer(f,div){
 const d=JSON.parse(JSON.stringify(f));
 C={div,f:d,rec:{w:0,l:0,d:0},rank:16,champ:false,defenses:0,hist:[],step:'offers',offers:null,opp:null,title:false,last:`Arranca la carrera de ${d.name}. Elegí tu primera pelea.`};
 C.offers=makeOffers();saveC();renderCareer();
}
function careerFight(){
 const o=C.opp,n=C.rec.w+C.rec.l+C.rec.d+1;
 startFight(C.f,o,{kind:'career',rounds:C.title?5:3,title:C.title?(C.champ?'DEFENSA DEL TÍTULO':'PELEA POR EL TÍTULO'):`CARRERA · PELEA ${n}`,onDone(res){
  const opp=C.opp,wasChamp=C.champ;let msg;
  if(res.w==='p'){
   C.rec.w++;
   if(wasChamp){C.defenses++;msg=`¡Retuviste el título ante ${opp.last}! Van ${C.defenses} defensa${C.defenses>1?'s':''}.`;}
   else if(opp.rank===0){C.champ=true;C.rank=0;msg=`¡${C.f.last.toUpperCase()} ES EL NUEVO CAMPEÓN! Le ganaste a ${opp.last} por ${res.method.toLowerCase()}.`;}
   else{C.rank=opp.rank<C.rank?opp.rank:Math.max(1,C.rank-1);msg=`Le ganaste a ${opp.last} por ${res.method.toLowerCase()}. Ahora estás ${rankLabel(C).toLowerCase()}.`;}
   const ks=shuffle(STATS.map(s=>s[0])).slice(0,2),g={};ks.forEach(k=>g[k]=1);const up=applyGain(C.f.s,g);if(up.length)msg+=` Experiencia: ${up.join(', ')}.`;
  }else if(res.w==='r'){
   C.rec.l++;
   if(wasChamp){C.champ=false;C.rank=2;msg=`Perdiste el título contra ${opp.last}. Quedás #2: a ganar para la revancha.`;}
   else{C.rank=Math.min(16,C.rank+2);msg=`Perdiste con ${opp.last} por ${res.method.toLowerCase()}. Bajás a ${rankLabel(C).toLowerCase()}.`;}
  }else{C.rec.d++;msg=`Empate con ${opp.last}. El ranking no se mueve.`;}
  C.hist.unshift({n,opp:opp.name,orank:oppRank(opp),res:res.w,method:res.method,round:res.round,title:C.title});
  C.hist=C.hist.slice(0,30);C.last=msg;C.step='offers';C.opp=null;C.title=false;C.offers=makeOffers();saveC();showScreen('career');
 }});
}
function renderCareer(){
 const B=$('#kBody');
 if(!C){
  const list=[...new Set([...CUSTOM,...fightersOf(kDiv)])];if(!list.includes(kPick))kPick=list[0];
  B.innerHTML=`<p class="lead">Elegí con quién arrancar. Empezás sin ranking en la división que elijas: ganá peleas, subí al #1 y peleá por el cinturón contra el campeón de verdad de esa división. Lo mejor es usar un peleador tuyo: <button class="link" data-go="create">crear peleador</button>.</p>
   <label class="dsel" for="kDiv"><span>División donde vas a competir</span><select id="kDiv">${divOptions(kDiv,false)}</select></label>
   ${pickerHtml('kPicker',list,kPick)}
   <div class="stick"><button class="go" id="kStart">EMPEZAR CARRERA CON <span id="kName">${esc(kPick.name).toUpperCase()}</span></button></div>`;
  bindPicker('kPicker',list,f=>{kPick=f;$('#kName').textContent=f.name.toUpperCase();});
  $('#kDiv').onchange=e=>{kDiv=e.target.value;renderCareer();};
  $('#kStart').onclick=()=>startCareer(kPick,kDiv);
  return;
 }
 const f=C.f;
 const left=`<div class="kcard">
   <canvas id="kPrev" width="96" height="112"></canvas>
   <div class="nm big">${esc(f.name)}</div><div class="meta">${f.nick?esc(f.nick)+' · ':''}${f.flag} · ${f.style}</div>
   <div class="rec" aria-label="Récord">${C.rec.w}-${C.rec.l}-${C.rec.d}</div><div class="meta">GANADAS · PERDIDAS · EMPATES</div>
   <div class="rank ${C.champ?'gold':''}">${rankLabel(C)}${C.champ&&C.defenses?` · ${C.defenses} DEF.`:''}</div>
   <div class="kstats">${STATS.map(([k,l])=>`<div class="ks"><span>${l}</span><div class="bar r"><i style="width:${f.s[k]}%"></i></div><b>${f.s[k]}</b></div>`).join('')}</div>
 </div>`;
 let main='';
 if(C.step==='offers'){
  const t=C.offers[0]&&C.offers[0].title;
  main=`<h3 class="sub2">${C.champ?'ELEGÍ TU DEFENSA DEL TÍTULO':t?'PELEA POR EL TÍTULO':'PRÓXIMA PELEA · ELEGÍ RIVAL'}</h3>
   <div class="offers">${C.offers.map((o,i)=>`<div class="offer ${o.title?'title':''}"><canvas width="56" height="48"></canvas><div><div class="nm">${esc(o.f.name)}</div><div class="meta">${o.f.nick?esc(o.f.nick)+' · ':''}${o.f.flag} · ${o.f.style}</div><div class="meta"><b>${oppRank(o.f)}</b> · Nivel ${Math.round(ovr(o.f))}${o.title?' · 5 rounds':''}</div></div><button class="go sm" data-of="${i}">ELEGIR</button></div>`).join('')}</div>`;
 }else if(C.step==='camp'){
  main=`<h3 class="sub2">CAMPAMENTO · VS ${esc(C.opp.name).toUpperCase()}</h3><p class="lead">Elegí en qué enfocar el entrenamiento antes de la pelea. Lo que mejores queda para toda la carrera.</p>
   <div class="camps">${CAMPS.map(([n,d,g],i)=>`<button class="camp" data-camp="${i}"><b>${n.toUpperCase()}</b><span>${d}</span><small>${Object.entries(g).map(([k,v])=>`${statName(k)} +${v}`).join(' · ')}</small></button>`).join('')}</div>`;
 }else{
  const o=C.opp;
  main=`<h3 class="sub2">${C.title?(C.champ?'DEFENSA DEL TÍTULO':'PELEA POR EL TÍTULO'):'NOCHE DE PELEA'}</h3>
   <div class="offer big ${C.title?'title':''}"><canvas width="56" height="48"></canvas><div><div class="nm">${esc(f.last)} vs ${esc(o.name)}</div><div class="meta">${o.flag} · ${o.style} · <b>${oppRank(o)}</b> · Nivel ${Math.round(ovr(o))} · ${C.title?5:3} rounds</div></div></div>
   <button class="go" id="kFight">IR A LA JAULA ▶</button>`;
 }
 const hist=C.hist.length?`<ol class="hist">${C.hist.map(h=>`<li class="${h.res==='p'?'w':h.res==='r'?'l':'d'}"><b>${h.res==='p'?'G':h.res==='r'?'P':'E'}</b><span>${esc(h.opp)} <small>${h.orank}${h.title?' · título':''}</small></span><small>${h.method}${h.method==='Abandono'?'':` · R${h.round}`}</small></li>`).join('')}</ol>`:'<p class="empty">Todavía no peleaste.</p>';
 B.innerHTML=`${C.last?`<div class="banner ${C.champ?'gold':''}"><span>${esc(C.last)}</span></div>`:''}
  <div class="kgrid">${left}<div class="kmain">${main}<h3 class="sub2">HISTORIAL</h3>${hist}<div class="row2"><button class="alt" id="kReset">NUEVA CARRERA</button></div></div></div>`;
 B.querySelectorAll('.offer canvas').forEach((cv,i)=>drawPortrait(cv,C.step==='offers'?C.offers[i].f:C.opp,-1));
 B.querySelectorAll('[data-of]').forEach(b=>b.onclick=()=>{const o=C.offers[+b.dataset.of];C.opp=o.f;C.title=o.title;C.step='camp';C.last='';saveC();renderCareer();});
 B.querySelectorAll('[data-camp]').forEach(b=>b.onclick=()=>{const[n,,g]=CAMPS[+b.dataset.camp];const up=applyGain(C.f.s,g);C.last=`Campamento de ${n.toLowerCase()}: ${up.length?up.join(', '):'ya estás al máximo ahí'}.`;C.step='fight';saveC();renderCareer();});
 const kf=$('#kFight');if(kf){kf.onclick=careerFight;kf.focus({preventScroll:true});}
 $('#kReset').onclick=e=>{const b=e.currentTarget;if(!b.dataset.sure){b.dataset.sure='1';b.textContent='¿SEGURO? SE BORRA ESTA CARRERA';b.classList.add('danger');return;}C=null;store.del('career');renderCareer();};
}
function drawCareerPrev(t){const cv=$('#kPrev');if(cv&&C)drawAnimated(cv.getContext('2d'),C.f,44,108,1,'guard',t,'#10141c');}
