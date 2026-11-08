/* Service worker de UFC Pocket Edition: guarda el juego en el celular para abrirlo como app y sin internet.
   Cuando cambies algo y lo subas, aumentá VERSION para que los celulares bajen lo nuevo. */
const VERSION='ufcpe-v6';
const ARCHIVOS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "css/estilos.css",
 "css/menu-imagenes.css",
 "js/app.js",
 "js/carrera.js",
 "js/config.js",
 "js/crear.js",
 "js/dibujo.js",
 "js/fichas.js",
 "js/inicio.js",
 "js/juego.js",
 "js/mando.js",
 "js/menu.js",
 "js/navegacion.js",
 "js/nube-config.js",
 "js/nube.js",
 "js/sonido.js",
 "js/tactil.js",
 "js/torneo.js",
 "data/peleadores-reales.js",
 "data/peleadores.js",
 "data/sprites-reales.js",
 "data/sprites.js",
 "assets/icons/apple-touch-icon.png",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/maskable-512.png",
 "assets/menu/carrera.png",
 "assets/menu/crear.png",
 "assets/menu/pelea.png",
 "assets/menu/torneo.png",
 "assets/sprites/alejandro-zanella.png",
 "assets/sprites/base.png",
 "assets/sprites/base-mascara.png",
 "assets/sprites/peinados.png",
 "data/cuerpo-base.js",
 "js/cuerpos.js",
 "assets/sprites/allen.png",
 "assets/sprites/andrusca.png",
 "assets/sprites/brito.png",
 "assets/sprites/costa.png",
 "assets/sprites/emmers.png",
 "assets/sprites/evloev.png",
 "assets/sprites/garcia.png",
 "assets/sprites/lopes.png",
 "assets/sprites/murphy.png",
 "assets/sprites/pico.png",
 "assets/sprites/sabatini.png",
 "assets/sprites/silva.png",
 "assets/sprites/sterling.png",
 "assets/sprites/vallejos.png",
 "assets/sprites/volkanovski.png",
 "assets/sprites/zalal.png"
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 // Del mismo sitio: primero internet (para tener siempre lo último), si no hay, lo guardado
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));}return res;})
   .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
  return;
 }
 // Fuentes y librería de Supabase: lo guardado primero
 if(/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.hostname)){
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res;})));
 }
});
