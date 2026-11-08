/* ---------------- Crear peleador ---------------- */
const FLAGS=['ARG','BRA','URU','CHI','PAR','BOL','PER','COL','VEN','ECU','MEX','USA','CAN','ESP','ITA','FRA','IRL','ENG','POL','RUS','KAZ','TUR','NGA','GHA','JPN','CHN','KOR','AUS','NZL'];
// [clave, etiqueta, tipo, opciones]  tipo: sw = colores, swn = colores con "ninguno", txt = texto
// Apariencia: cuerpo dibujado (tu hoja) + peinado + colores
const LOOKOPTS=[
 ['peinado','Peinado','head',null],
 ['skin','Piel','sw',GEN.skins],
 ['shorts','Short','sw',GEN.shorts]
];
const BUDGET=560,SMIN=40,SMAX=95;
let draft=null;
function baseStats(style){
 const b=(ARCH.find(a=>a[0]===style)||ARCH[5])[1],sum=Object.values(b).reduce((a,c)=>a+c,0),s={};
 for(const k in b)s[k]=clamp(Math.round(b[k]*BUDGET/sum),SMIN,SMAX);
 let diff=BUDGET-Object.values(s).reduce((a,c)=>a+c,0);const ks=Object.keys(s);
 for(let i=0;diff!==0&&i<400;i++){const k=ks[i%ks.length];if(diff>0&&s[k]<SMAX){s[k]++;diff--;}else if(diff<0&&s[k]>SMIN){s[k]--;diff++;}}
 return s;
}
function newDraft(){draft={id:null,first:'',last:'',nick:'',flag:'ARG',div:'ligero',style:'Completo',look:randFighter().look,s:baseStats('Completo')};}
function editDraft(f){draft={id:f.id,first:f.first||f.name.split(' ')[0],last:f.last,nick:(f.nick||'').replace(/"/g,''),flag:f.flag,div:f.div||'ligero',style:f.style,look:{...f.look},s:{...f.s}};renderCreate();$('#create').scrollTo({top:0,behavior:'smooth'});}
function openCreate(){if(!draft)newDraft();renderCreate();}
const ptsLeft=()=>BUDGET-Object.values(draft.s).reduce((a,c)=>a+c,0);
function draftFighter(){
 const first=draft.first.trim()||'Tu',last=draft.last.trim()||'Peleador',nick=draft.nick.trim();
 return{id:draft.id,first,name:first+' '+last,last,nick:nick?`"${nick}"`:'',flag:draft.flag,div:draft.div,style:draft.style,s:{...draft.s},look:{...draft.look},custom:1};
}
const esc=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
function optHtml(k,t,opts){
 const v=draft.look[k]??null;
 if(t==='head'){
  // cabezas agrupadas como en tu hoja; se dibujan después en cada botón
  const cur=String(peinadoDe(draftFighter()));let html='',last=null;
  CB.peinados.forEach((p,i)=>{const g=CB.grupos[i];if(g!==last){html+=`<span class="hgrp">${g}</span>`;last=g;}
   html+=`<button class="hb-pein" data-lk="${k}" data-lv="${i}" aria-pressed="${cur===String(i)}" aria-label="${g} ${i+1}"><canvas width="${p[2]}" height="${p[3]}" data-ph="${i}"></canvas></button>`;});
  return html;
 }
 const sw=c=>`<button class="sw" style="background:${c}" data-lk="${k}" data-lv="${c}" aria-pressed="${v===c}" aria-label="Color ${c}"></button>`;
 if(t==='sw')return opts.map(sw).join('');
 if(t==='swn')return`<button class="ob" data-lk="${k}" data-lv="" aria-pressed="${!v}">Sin vincha</button>`+opts.map(sw).join('');
 return opts.map(([val,lab])=>`<button class="ob" data-lk="${k}" data-lv="${val}" aria-pressed="${v===val}">${lab}</button>`).join('');
}
function renderCreate(){
 $('#cFirst').value=draft.first;$('#cLast').value=draft.last;$('#cNick').value=draft.nick;$('#cFlag').value=draft.flag;$('#cDiv').value=draft.div;$('#cStyle').value=draft.style;
 renderLook();
 $('#cSave').textContent=draft.id?'GUARDAR CAMBIOS':'GUARDAR PELEADOR';
 renderStats();renderCList();updPrevName();$('#cMsg').textContent='';
}
function renderStats(){
 const p=ptsLeft();$('#cPts').textContent=p;
 $('#cStats').innerHTML=STATS.map(([k,l])=>`<div class="srow"><span class="ll">${l}</span><button class="stp" data-sk="${k}" data-sd="-1" aria-label="Bajar ${l}" ${draft.s[k]<=SMIN?'disabled':''}>−</button><div class="bar r"><i style="width:${draft.s[k]}%"></i></div><button class="stp" data-sk="${k}" data-sd="1" aria-label="Subir ${l}" ${draft.s[k]>=SMAX||p<=0?'disabled':''}>+</button><b>${draft.s[k]}</b></div>`).join('');
}
function updPrevName(){const f=draftFighter();$('#cpName').textContent=f.name;$('#cpMeta').textContent=`${f.nick?f.nick+' · ':''}${f.flag} · ${divName(f.div)} · ${f.style}`;}
function renderCList(){
 if(!CUSTOM.length){$('#cList').innerHTML='<p class="empty">Todavía no creaste ninguno. Armalo arriba y tocá GUARDAR PELEADOR: después lo elegís en Pelea rápida, Torneo o Carrera.</p>';return;}
 $('#cList').innerHTML=CUSTOM.map(f=>`<div class="fcard"><canvas width="56" height="48"></canvas><div class="nm">${esc(f.name)}</div><div class="meta">${f.flag} · ${divName(fDiv(f))} · ${f.style}</div><div class="gbtns"><button data-ce="${f.id}">EDITAR</button><button data-cd="${f.id}">BORRAR</button></div></div>`).join('');
 $('#cList').querySelectorAll('canvas').forEach((cv,i)=>drawPortrait(cv,CUSTOM[i],1));
}
function cMsg(t){$('#cMsg').textContent=t;}

// Selects
$('#cFlag').innerHTML=FLAGS.map(f=>`<option>${f}</option>`).join('');
$('#cStyle').innerHTML=ARCH.map(a=>`<option>${a[0]}</option>`).join('');
// Eventos
$('#cFirst').oninput=e=>{draft.first=e.target.value;updPrevName();};
$('#cLast').oninput=e=>{draft.last=e.target.value;updPrevName();};
$('#cNick').oninput=e=>{draft.nick=e.target.value;updPrevName();};
$('#cFlag').onchange=e=>{draft.flag=e.target.value;updPrevName();};
$('#cDiv').innerHTML=divOptions('ligero',false);
$('#cDiv').onchange=e=>{draft.div=e.target.value;updPrevName();};
$('#cStyle').onchange=e=>{draft.style=e.target.value;draft.s=baseStats(draft.style);renderStats();updPrevName();};
function renderLook(){
 $('#cLook').innerHTML=LOOKOPTS.map(([k,l,t,o])=>`<div class="lrow${t==='head'?' lhead':''}"><span class="ll">${l}</span><div class="opts" role="group" aria-label="${l}">${optHtml(k,t,o)}</div></div>`).join('');
 drawHeadBtns();
}
// miniaturas de los peinados (con el tono de piel elegido)
function drawHeadBtns(){
 if(typeof cbListo==='undefined'||cbListo<3)return;
 const T=hexRGB(draft.look.skin||'#c58a62');
 $('#cLook').querySelectorAll('canvas[data-ph]').forEach(cv=>{const P=CB.peinados[+cv.dataset.ph],g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);
  g.drawImage(cbImg.pein,P[0],P[1],P[2],P[3],0,0,P[2],P[3]);try{const d=g.getImageData(0,0,P[2],P[3]);for(let i=0;i<d.data.length;i+=4)if(d.data[i+3])recolorPiel(d.data,i,T);g.putImageData(d,0,0);}catch(e){}});
}
$('#cRand').onclick=()=>{draft.look=randFighter().look;renderLook();};
$('#cNew').onclick=()=>{newDraft();renderCreate();$('#cFirst').focus();};
$('#cLook').addEventListener('click',e=>{
 const b=e.target.closest('[data-lk]');if(!b)return;
 draft.look[b.dataset.lk]=b.dataset.lk==='peinado'?+b.dataset.lv:(b.dataset.lv||null);
 b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
 if(b.dataset.lk==='skin')drawHeadBtns();
});
$('#cStats').addEventListener('click',e=>{
 const b=e.target.closest('[data-sk]');if(!b||b.disabled)return;
 const k=b.dataset.sk,dir=+b.dataset.sd,p=ptsLeft();
 let nv=clamp(draft.s[k]+dir*2,SMIN,SMAX);if(nv-draft.s[k]>p)nv=draft.s[k]+p;draft.s[k]=nv;
 renderStats();const nb=$(`#cStats [data-sk="${k}"][data-sd="${b.dataset.sd}"]`);if(nb&&!nb.disabled)nb.focus();
});
$('#cSave').onclick=()=>{
 if(!draft.first.trim()||!draft.last.trim()){cMsg('Poné nombre y apellido para guardarlo.');(draft.first.trim()?$('#cLast'):$('#cFirst')).focus();return;}
 const f=draftFighter();if(!f.id)f.id='c'+Date.now().toString(36);draft.id=f.id;
 const i=CUSTOM.findIndex(x=>x.id===f.id);if(i>=0)CUSTOM[i]=f;else CUSTOM.push(f);
 const ok=store.set('custom',CUSTOM);
 cMsg(ok?`${f.name} quedó guardado. Ya lo podés elegir en Pelea rápida, Torneo y Carrera.`:`${f.name} se puede usar ahora, pero este navegador no deja guardar: se pierde al cerrar la página.`);
 $('#cSave').textContent='GUARDAR CAMBIOS';renderCList();
};
$('#cList').addEventListener('click',e=>{
 const ed=e.target.closest('[data-ce]');if(ed){const f=CUSTOM.find(x=>x.id===ed.dataset.ce);if(f)editDraft(f);return;}
 const del=e.target.closest('[data-cd]');if(!del)return;
 if(!del.dataset.sure){del.dataset.sure='1';del.textContent='¿SEGURO?';del.classList.add('danger');return;}
 CUSTOM=CUSTOM.filter(x=>x.id!==del.dataset.cd);store.set('custom',CUSTOM);
 if(draft&&draft.id===del.dataset.cd)draft.id=null;
 renderCList();cMsg('Peleador borrado.');
});
function drawCreatePrev(t){drawAnimated($('#cPrev').getContext('2d'),draftFighter(),44,108,1,seqPose(t),t,'#10141c');}
