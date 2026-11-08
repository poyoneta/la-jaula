/* ---------------- Peleadores creados con tus dibujos ----------------
   Los peleadores inventados, los generados al azar y los que creás usan el CUERPO BASE
   (tu hoja del peleador pelado, con todas las animaciones) + una CABEZA de la hoja de peinados.
   Encima se cambia el color de piel y del short. Se arma una sola vez por peleador y se guarda
   (los últimos 30) para no gastar memoria. */
const CB=CUERPO_BASE;
const cbImg={base:new Image(),mask:new Image(),pein:new Image()};let cbListo=0;
for(const k in cbImg)cbImg[k].onload=()=>{if(++cbListo===3&&typeof onSpriteLoad==='function')onSpriteLoad();};
cbImg.base.src=CB.src;cbImg.mask.src=CB.mascara;cbImg.pein.src=CB.peinadosSrc;

// Peinado según el estilo de pelo elegido (si no se eligió una cabeza puntual)
const GRUPO_DE={short:['Clásico','Corto moderno'],buzz:['Clásico'],mohawk:['Corto moderno'],sidecut:['Corto moderno'],
 long:['Largo'],ponytail:['Largo'],topknot:['Largo'],curly:['Rizado'],afro:['Rizado','Desordenado']};
function hashStr(s){let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;}
function peinadoDe(d){
 const L=d.look||{};if(L.peinado!=null&&CB.peinados[L.peinado])return+L.peinado;
 if(L.hairStyle==='bald')return 0;
 const g=GRUPO_DE[L.hairStyle]||['Clásico','Corto moderno','Desordenado'];
 const idx=CB.grupos.map((x,i)=>g.includes(x)&&i>1?i:-1).filter(i=>i>=0);
 return idx.length?idx[hashStr(d.name||d.last||'x')%idx.length]:2;
}
const hexRGB=h=>{h=String(h||'#16181d').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255];};
function esPiel(r,g,b){const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return r>g&&g>=b*.9&&mx>84&&(mx-mn)/(mx+1)>.18;}
// Cambia la piel: escala cada canal hacia el tono pedido (las sombras y el pelo oscuro casi no cambian)
function recolorPiel(px,i,T){
 const r=px[i],g=px[i+1],b=px[i+2];if(!esPiel(r,g,b))return;
 const L=Math.max(r,g,b)/255,w=Math.min(1,Math.max(0,(L-.3)/.35));   // los oscuros (pelo, contorno) se tocan menos
 // corrimiento suave hacia el tono pedido: mantiene luces y sombras del dibujo
 for(let c=0;c<3;c++){const k=px[i+c]/CB.piel[c],v=px[i+c]+(T[c]-CB.piel[c])*(.55+.35*Math.min(1.4,k));px[i+c]=Math.max(0,Math.min(255,px[i+c]+(v-px[i+c])*w));}
}
const cbCache=new Map();
function cuerpoDe(d){
 if(cbListo<3)return null;
 const L=d.look||{},ph=peinadoDe(d),T=hexRGB(L.skin||'#c58a62'),SH=hexRGB(L.shorts||'#16181d');
 const sig=ph+'|'+T.join()+'|'+SH.join();
 if(cbCache.has(sig)){const S=cbCache.get(sig);cbCache.delete(sig);cbCache.set(sig,S);return S;}
 const PX=14,PT=18;
 // cuadros únicos del cuerpo base
 const uniq=new Map();for(const mv in CB.frames)CB.frames[mv].forEach((f,i)=>{const k=f.slice(0,4).join();if(!uniq.has(k))uniq.set(k,{f,mv,i});});
 const maxH=Math.max(...[...uniq.values()].map(u=>u.f[3])),H=maxH+PT;let W=0;for(const u of uniq.values()){u.cx=W;W+=u.f[2]+PX*2+1;}
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
 const mk=document.createElement('canvas');mk.width=W;mk.height=H;const m=mk.getContext('2d');
 for(const u of uniq.values()){const[x,y,w,h]=u.f;g.drawImage(cbImg.base,x,y,w,h,u.cx+PX,H-h,w,h);m.drawImage(cbImg.mask,x,y,w,h,u.cx+PX,H-h,w,h);}
 // abriendo el index.html con doble clic (file://) el navegador no deja leer pixeles: ahí sale sin cambiar colores
 let id=null;try{id=g.getImageData(0,0,W,H);}catch(e){}
 if(id){const px=id.data,mp=m.getImageData(0,0,W,H).data;
 // borrar la cabeza pelada (solo la piel, así no se pierden los guantes que pasan cerca)
 for(const u of uniq.values()){
  const t=CB.cabeza[u.mv]&&CB.cabeza[u.mv][u.i];if(!t)continue;
  const[hx,hy]=t,ox=u.cx+PX+hx,oy=H-u.f[3]+hy;
  for(let yy=Math.floor(oy-14);yy<=oy+(t[2]?12:4);yy++)for(let xx=Math.floor(ox-15);xx<=ox+15;xx++){
   if(xx<0||yy<0||xx>=W||yy>=H)continue;if(((xx-ox)/15)**2+((yy-oy)/14)**2>1)continue;
   const i=(yy*W+xx)*4;if(px[i+3]&&esPiel(px[i],px[i+1],px[i+2]))px[i+3]=0;
  }
 }
 // short del color elegido (con las sombras del dibujo) y piel
 for(let i=0;i<px.length;i+=4){
  if(!px[i+3])continue;
  if(mp[i]>128){const lum=(px[i]*.3+px[i+1]*.59+px[i+2]*.11)/255,k=.62+.95*lum;for(let c=0;c<3;c++)px[i+c]=Math.min(255,SH[c]*k+lum*22);}
  else recolorPiel(px,i,T);
 }
 g.putImageData(id,0,0);}
 // cabeza con el peinado (misma piel)
 const P=CB.peinados[ph],hc=document.createElement('canvas');hc.width=P[2];hc.height=P[3];const hg=hc.getContext('2d');
 hg.drawImage(cbImg.pein,P[0],P[1],P[2],P[3],0,0,P[2],P[3]);try{const hd=hg.getImageData(0,0,P[2],P[3]);for(let i=0;i<hd.data.length;i+=4)if(hd.data[i+3])recolorPiel(hd.data,i,T);hg.putImageData(hd,0,0);}catch(e){}
 for(const u of uniq.values()){
  const t=CB.cabeza[u.mv]&&CB.cabeza[u.mv][u.i];if(!t)continue;
  const[hx,hy,ang]=t,ox=u.cx+PX+hx,oy=H-u.f[3]+hy;
  if(ang){g.save();g.translate(Math.round(ox),Math.round(oy));g.rotate(-ang*Math.PI/180);g.drawImage(hc,-Math.round(P[2]/2),-Math.round(P[3]/2));g.restore();}
  else g.drawImage(hc,Math.round(ox-P[4]),Math.round(oy+11.5-3-P[5]));
 }
 const frames={};
 for(const mv in CB.frames)frames[mv]=CB.frames[mv].map(f=>{const u=uniq.get(f.slice(0,4).join());return[u.cx,0,f[2]+PX*2,H,f[4]+PX];});
 const S={img:cv,frames,plantilla:true,k:1};
 cbCache.set(sig,S);if(cbCache.size>30)cbCache.delete(cbCache.keys().next().value);
 return S;
}
