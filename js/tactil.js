/* ---------------- Mando táctil (celular en horizontal) ----------------
   Botones transparentes encima de la pelea, con la misma distribución que un mando:
   stick izquierdo: caminar / agacharse · □ jab · △ recto · L1+□ / L1+△ cross izq. / der.
   L2+□ o △ uppercut · ○ low kick · ✕ high kick · R1 cubrirse · R2 derribo · II pausa
   En el piso: □ △ ○ son las tres acciones de la botonera. */
const VP={l1:false,l2:false,stick:null,vertOK:false};
const touchDev=matchMedia('(pointer:coarse)');
const isPortrait=()=>innerHeight>innerWidth;
const vpActive=()=>touchDev.matches&&!isPortrait()&&!PAD.on;

// Stick: arrastrar desde el centro
(function(){
 const st=$('#vstick'),kn=$('#vknob'),R=40;
 const set=(dx,dy)=>{
  const d=Math.hypot(dx,dy),k=d>R?R/d:1;kn.style.transform=`translate(${dx*k}px,${dy*k}px)`;
  input.left=dx<-16;input.right=dx>16;input.down=dy>22&&Math.abs(dy)>Math.abs(dx)*.6;
 };
 const end=e=>{if(VP.stick!==e.pointerId)return;VP.stick=null;kn.style.transform='';input.left=input.right=input.down=false;st.classList.remove('on');};
 st.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();const r=st.getBoundingClientRect();VP.stick=e.pointerId;VP.cx=r.left+r.width/2;VP.cy=r.top+r.height/2;
  st.setPointerCapture(e.pointerId);st.classList.add('on');set(e.clientX-VP.cx,e.clientY-VP.cy);});
 st.addEventListener('pointermove',e=>{if(VP.stick===e.pointerId)set(e.clientX-VP.cx,e.clientY-VP.cy);});
 st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
})();

// Botones que se mantienen: L1, L2 (modificadores) y R1 (cubrirse)
document.querySelectorAll('[data-vhold]').forEach(b=>{
 const k=b.dataset.vhold,on=v=>{if(k==='r1')input.block=v;else VP[k]=v;b.classList.toggle('on',v);};
 b.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();b.setPointerCapture(e.pointerId);on(true);});
 for(const ev of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>on(false));
});

// Botones de golpe
function vpPress(k){
 if(!G)return;
 if(G.mode==='ground'){
  const i={sq:0,tr:1,ci:2}[k];if(i==null)return;
  const bs=$(G.top==='p'?'#padTop':'#padBot').querySelectorAll('[data-k]');if(bs[i])doG(bs[i].dataset.k);return;
 }
 const m={sq:VP.l1?'hook':VP.l2?'upper':'jab',tr:VP.l1?'hookR':VP.l2?'upper':'cross',ci:'low',x:'high',r2:'td'}[k];
 if(m)doP(m);
}
document.querySelectorAll('[data-vb]').forEach(b=>{
 b.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();b.classList.add('on');vpPress(b.dataset.vb);});
 for(const ev of['pointerup','pointercancel','pointerleave'])b.addEventListener(ev,()=>b.classList.remove('on'));
});
$('#vpause').addEventListener('click',()=>{if(G)pause(!G.paused);});
// Que el mando no haga zoom ni scroll, ni abra el menú del navegador al mantener apretado
$('#vpad').addEventListener('contextmenu',e=>e.preventDefault());

// Textos de los botones según estés parado o en el piso
function vpLabels(m){
 const pad=$('#vpad'),ground=m!=='stand';pad.classList.toggle('ground',ground);
 const lab=(k,t)=>{const s=pad.querySelector(`[data-vb="${k}"] small`);if(s)s.textContent=t;};
 if(!ground){lab('sq','JAB');lab('tr','RECTO');lab('ci','LOW KICK');lab('x','HIGH KICK');return;}
 const bs=[...$(m==='top'?'#padTop':'#padBot').querySelectorAll('[data-k]')].map(b=>b.firstChild.textContent.trim());
 lab('sq',bs[0]||'');lab('tr',bs[1]||'');lab('ci',bs[2]||'');lab('x','');
}

// Al empezar la pelea en el celular: pantalla completa y horizontal si el navegador lo permite
function vpStart(){
 if(!touchDev.matches||PAD.on)return checkRot();
 try{
  const de=document.documentElement,p=!document.fullscreenElement&&de.requestFullscreen?de.requestFullscreen({navigationUI:'hide'}):null;
  const lock=()=>{try{const q=screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape');if(q&&q.catch)q.catch(()=>{});}catch(e){}};
  if(p&&p.then)p.then(lock,()=>{});else lock();
 }catch(e){}
 checkRot();
}
// En vertical, la pelea se frena y pide girar el celular (o seguir en vertical con los botones de abajo)
function checkRot(){
 const need=G&&curScreen==='fight'&&touchDev.matches&&!PAD.on&&isPortrait()&&!VP.vertOK;
 $('#rotHint').hidden=!need;
 if(need&&!G.paused){G.paused=true;G.rotPause=true;clearInput();}
 else if(!need&&G&&G.rotPause){G.rotPause=false;if($('#ov').hidden)G.paused=false;}
 document.body.classList.toggle('vp',vpActive());
}
$('#vertOk').addEventListener('click',()=>{VP.vertOK=true;checkRot();});
window.addEventListener('resize',checkRot);
window.addEventListener('orientationchange',()=>setTimeout(()=>{checkRot();resize();},250));
setInterval(checkRot,500);
