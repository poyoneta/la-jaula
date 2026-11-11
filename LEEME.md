# Pocket MMA

Juego de peleas de MMA en pixel art, vista de costado. Corre en el navegador (compu y celular), sin instalar nada.

## 1. Abrirlo en VS Code

1. Descomprimí el ZIP donde quieras (por ejemplo en `Documentos`).
2. En VS Code: **Archivo → Abrir carpeta…** y elegí la carpeta `la-jaula`.
3. VS Code te va a sugerir la extensión **Live Server**. Instalala (o buscala en Extensiones: `Live Server`, de Ritwick Dey).
4. Abrí `index.html` y tocá **Go Live** abajo a la derecha. Se abre el juego en el navegador.
5. Cada vez que guardás un archivo, el juego se recarga solo.

> También funciona con doble clic en `index.html`, pero con Live Server es más cómodo.

### Probarlo en el celular mientras programás
Con Live Server corriendo, conectá el celular al mismo Wi‑Fi y abrí `http://IP-DE-TU-COMPU:5500`.
La IP la ves en Windows con `ipconfig` (la que dice "Dirección IPv4").

## 2. Cómo está organizado

```
la-jaula/
├─ index.html            Todas las pantallas: menú, modos, pelea y botones
├─ css/estilos.css       Colores, diseño, versión PC y versión celular
├─ data/
│  ├─ peleadores.js      Divisiones, peleadores y sus estadísticas  ← empezá por acá
│  └─ sprites.js         Hojas de sprites de cada peleador y la plantilla
├─ assets/sprites/       Hojas de sprites en PNG y la plantilla para dibujar nuevas
└─ js/
   ├─ config.js          Tamaño de pantalla, duración de rounds, golpes (daño, alcance, velocidad)
   ├─ dibujo.js          Todo lo que se dibuja: peleadores, fondo, piso
   ├─ sonido.js          Efectos de sonido
   ├─ juego.js           La pelea: golpes, IA del rival, derribos, piso, rounds, controles
   ├─ menu.js            Pelea rápida y generador de peleadores al azar
   ├─ navegacion.js      Menú principal, cambio de pantallas, guardado y pantalla completa
   ├─ crear.js           Crear peleador (look y atributos)
   ├─ torneo.js          Modo torneo (llave de 8)
   ├─ carrera.js         Modo carrera (récord, ranking, campamento, título)
   ├─ fichas.js          Pantalla de elección estilo VS, fichas de peleadores y banderas
   ├─ mando.js           Soporte de mando y dibujo del mando para los tutoriales
   ├─ tactil.js          Mando táctil transparente para celular en horizontal
   ├─ nube-config.js     Datos de tu proyecto de Supabase (URL y clave anon)
   ├─ nube.js            Guardado en la nube: entrar con email y sincronizar
   ├─ app.js             Instalar como app, pantalla completa y horizontal
   ├─ cuerpos.js         Arma los peleadores creados: cuerpo base + peinado + colores
   └─ inicio.js          Arranca todo
```

### Dónde se guarda lo que hacés
Los peleadores que creás y tu carrera se guardan en el navegador (localStorage).
Si abrís el juego en otro navegador o en el celular, empieza de cero. Más adelante se puede pasar a Supabase para tenerlo en la nube.

Los scripts se cargan en ese orden desde `index.html`; cada uno usa cosas de los anteriores.

## Divisiones y peleadores

Están en `data/peleadores.js`: 13 divisiones con 16 peleadores cada una (campeón + #1 a #15), todos inventados.
- Masculinas: mosca (57 kg), gallo (61), pluma (66), ligero (70), wélter (77), mediano (84), semipesado (93) y pesado (120).
- Femeninas: paja (52 kg), mosca (57), gallo (61), pluma (66) y ligero (70).
Cada peleador tiene altura y alcance acordes a su peso, y atributos coherentes: los pesados pegan
más fuerte y son más lentos; los livianos son más rápidos y tienen más aire.
Las peleadoras usan el mismo cuerpo base con top deportivo y sin barba.
El plantel se generó con un script: si querés cambiarlo, editá el archivo o pedime que lo regenere.

- **Pelea rápida:** elegís la división arriba (o "Todas").
- **Torneo:** la llave se arma con los 7 mejores de la división que elijas.
- **Carrera:** competís en una división; los rivales del ranking son los de esa división y el título lo peleás contra su campeón.

## Sumar un peleador con su propio sprite

1. Dibujá la hoja siguiendo `assets/sprites/plantilla-48.png` (usala como capa de fondo).
   En `assets/sprites/plantilla-guia.png` está la misma grilla con el nombre de cada fila.
   - Celdas de 48×48, el peleador mirando a la derecha.
   - Los pies apoyados en la línea verde (abajo de la celda) y la cabeza sobre la línea roja (centro).
   - Una fila por movimiento: guardia, caminar, jab, recto, cross izquierdo, cross derecho, uppercut,
     low kick, high kick, derribo, cubrirse/agacharse, recibir golpe, KO y festejo.
   - PNG con fondo transparente. Antes de exportar, borrá la capa de la plantilla.
2. Guardala en `assets/sprites/`, por ejemplo `assets/sprites/lopez.png`.
3. En `data/sprites.js` agregá: `SPRITES.lopez={src:'assets/sprites/lopez.png',plantilla:true};`
4. En `data/peleadores.js`, al peleador ponele `sprite:'lopez'`.

Para hojas que no siguen la plantilla (como la de Alejandro Zanella) hay que indicar cada cuadro a mano: está explicado en `data/sprites.js`.

## 3. Cosas fáciles para tocar primero

- **Agregar un peleador:** copiá un bloque en `data/peleadores.js` y cambiá nombre, estadísticas y look.
  Las estadísticas van de 0 a 100: `str` golpeo, `pow` poder, `spd` velocidad, `wre` lucha,
  `tdd` defensa de derribo, `bjj` sumisión, `car` cardio, `chin` mentón.
- **Duración del round:** `ROUND_LEN` en `js/config.js` (en segundos).
- **Daño de los golpes:** `DMG` (multiplicador general) y la tabla `MOVES` en `js/config.js`
  (`dmg` daño, `reach` alcance, `pw` velocidad del golpe tuyo, `rw` aviso del rival, `cost` cansancio).
- **Cambiar los cuadros del sprite:** `data/sprites.js`. Cada cuadro es `[x, y, ancho, alto, centroCabeza]` dentro del PNG.

## 4. Controles

En la pelea, los básicos aparecen al costado y con **Esc** / **Options** (o el botón II PAUSA) ves todos, con el dibujo del mando.

| Básicos | Teclado | Mando | Celular |
|---|---|---|---|
| Jab | Q | □ (X en Xbox) | JAB |
| Recto | W | △ (Y) | RECTO |
| Cross izquierdo | E | L1 + □ | CROSS IZQ |
| Cross derecho | R | L1 + △ | CROSS DER |
| Low kick | A | ○ (B) | LOW KICK |
| High kick | S | ✕ (A) | HIGH KICK |

| Avanzados | Teclado | Mando | Celular |
|---|---|---|---|
| Caminar | ← → | cruz o stick izquierdo | ◀ ▶ |
| Agacharse | ↓ | abajo | ▼ |
| Cubrirse / sprawl | Espacio | R1 | CUBRIRSE |
| Uppercut | F | L2 + □ o △ | UPPER |
| Derribo | D | R2 | DERRIBO |
| Piso (3 acciones) | Q / W / E | □ / △ / ○ | botones |
| Pausa | Esc o P | Options | II PAUSA |

**Mando:** conectalo por USB o Bluetooth y apretá cualquier botón; el juego lo detecta solo (PlayStation o Xbox).

**Celular:** la pelea se juega con el celular acostado. Aparece un mando transparente encima: stick a la izquierda para caminar y agacharte, □ jab, △ recto, ○ low kick, ✕ high kick, L1 + □/△ para los cross, L2 + □/△ uppercut, R1 cubrirse y R2 derribo. El botón II del medio pausa. Si lo tenés en vertical te pide girarlo; con "Jugar en vertical" seguís con los botones de abajo.
En los menús: cruz o stick para moverte, ✕ para elegir y ○ para volver. En la elección de peleadores:
cruz ◀ ▶ cambia tu peleador, ▲ ▼ el rival, L1/R1 la pestaña y ✕ arranca la pelea.

Cubrirse gasta la barra **BLOQUEO**: si se vacía, te rompen la guardia.

## 5. Subirlo a GitHub

1. Instalá **Git** (git-scm.com) si no lo tenés.
2. En VS Code, panel **Control de código fuente** (Ctrl+Shift+G) → **Inicializar repositorio**.
3. Escribí un mensaje (por ejemplo "Primera versión") y tocá **Confirmar**.
4. Tocá **Publicar rama** → elegí repositorio público o privado en tu GitHub.

## 6. Publicarlo en Render (link para tus amigos)

1. Entrá a render.com con tu cuenta → **New → Static Site**.
2. Elegí el repositorio `la-jaula`.
3. Build Command: dejalo vacío. Publish Directory: `.`
4. **Create Static Site**. En un minuto te da un link tipo `la-jaula.onrender.com`.
5. Cada vez que subís cambios a GitHub, Render actualiza el juego solo.

## 7. Próximos pasos posibles

- Mecánicas tipo Sifu: barra de postura y parada perfecta.
- Parches de la comunidad para cargar peleadores y organizaciones reales sin que vengan en el juego.
- Una hoja de cuerpo base femenino (como la del peleador pelado) para que las peleadoras tengan su propio cuerpo.
- Supabase para cuentas, guardar partidas y ranking entre amigos.
- Sprites dibujados con las poses que faltan (recibir golpe, cubrirse, agacharse, KO, piso).

## Publicarlo (GitHub + Render) y guardar en la nube (Supabase)

### 1. GitHub
El proyecto ya tiene todo para subirse tal cual (no hay que compilar nada).

### 2. Render (la página para jugar desde el celular)
1. Entrá a [render.com](https://render.com) con tu cuenta de GitHub.
2. **New → Static Site** y elegí el repo `la-jaula`.
3. Build Command: dejalo **vacío**. Publish Directory: **`.`** (un punto).
4. **Create Static Site**. En un minuto te da un link tipo `https://la-jaula.onrender.com`.
5. Cada vez que subas cambios a GitHub, Render actualiza la página solo.

(También podés usar **New → Blueprint**: lee el archivo `render.yaml` y lo configura solo.)

### 3. Supabase (guardar la carrera y tus peleadores en la nube)
1. En [supabase.com](https://supabase.com) creá un proyecto nuevo.
2. **SQL Editor → New query**, pegá todo `supabase/tabla.sql` y tocá **Run**.
3. **Authentication → URL Configuration**: en *Site URL* poné el link de Render
   (y en *Redirect URLs* agregá también `http://127.0.0.1:5500/**` para probar con Live Server).
4. **Project Settings → API**: copiá el *Project URL* y la clave *anon / publishable*
   y pegalos en `js/nube-config.js`. Subí el cambio a GitHub.
5. En el menú aparece **☁ GUARDAR EN LA NUBE**: ponés tu email, te llega un link, lo abrís
   y listo. Hacelo en la compu y en el celular con el mismo email y comparten la partida.

La clave *anon* se puede publicar sin problema: la tabla está protegida para que cada uno vea solo lo suyo.
Nunca pongas la clave *service_role* / *secret* en el juego.

## Instalarlo como app en el celular

El juego es una **app web instalable** (PWA): no hace falta Play Store ni App Store.

- **Android (Chrome):** abrí el link de Render y tocá **⬇ INSTALAR APP** en el menú
  (o en el menú de Chrome, ⋮ → *Instalar app*). Queda un ícono en el celular, se abre a
  pantalla completa, siempre acostado, y anda sin internet.
- **iPhone (Safari):** botón *Compartir* → *Agregar a inicio*. El iPhone no deja trabar la
  pantalla acostada: si lo ponés vertical, el juego te pide girarlo.
- **PC (Chrome o Edge):** el ícono de instalar aparece en la barra de direcciones.

Archivos de la app: `manifest.webmanifest` (nombre, ícono, horizontal), `sw.js` (guarda el juego
para usarlo sin internet) y `assets/icons/`. **Cada vez que subas cambios, aumentá `VERSION` en
`sw.js`** (ufcpe-v1 → ufcpe-v2…) para que los celulares que ya la instalaron bajen lo nuevo.
La instalación solo funciona en https (Render) o en localhost (Live Server).

## Peleadores creados con tus dibujos

Los peleadores inventados, los generados al azar y los que creás se arman con:
- `assets/sprites/base.png`: el cuerpo base (tu hoja del peleador pelado), con todas las animaciones.
- `assets/sprites/pelos.png`: las capas de pelo (tu carpeta capas_pelo_cuerpo), sin repetidos.
- `assets/sprites/base-mascara.png`: marca dónde está el short, para cambiarle el color.
- `data/cuerpo-base.js`: dónde va la cabeza en cada cuadro (posición y giro) y dónde va cada pelo.
- `js/cuerpos.js`: arma cada peleador (cuerpo + pelo) y le cambia la piel, el pelo y el short.

En **Crear peleador** elegís peinado (o pelado), color de pelo, color de piel y color de short. Los guantes quedan negros.
Para que los colores cambien, abrí el juego con **Live Server** (o desde Render): abriendo
`index.html` con doble clic el navegador no deja tocar los pixeles y salen con los colores del dibujo.

## Imagen del juego y menú

- `assets/portada.png`: imagen del juego (peleador genérico con dos cinturones y el escudo de Pocket MMA).
  Se usa en la pantalla de carga y, recortada, en los íconos de `assets/icons/`.
- `assets/menu/`: escenas del menú hechas con los peleadores genéricos (cuerpo base + peinados).
- Los scripts que generaron estas imágenes no van en el juego: si querés otras, pedímelas.

## Modo carrera

1. Empezás en la **liga regional**: con 3 victorias, Pocket MMA te ofrece contrato.
2. Ofertas → **campamento** de 2 a 6 semanas (entrenar, sparring, redes, invitar, estudiar, descansar) → **pesaje** (corte tranquilo o agresivo) → pelea.
3. **Rivales**: el que te gana (o al que le hiciste mucho trash talk) vuelve como **revancha**, con bolsa ×1,5.
4. **Mi carrera**: legado, edad y desgaste, **gimnasio** (más puntos por entrenar), **patrocinadores**
   (se desbloquean con fans), **cambiar de división** (siendo campeón te dan el otro título: doble campeón) y **retiro**.
5. Después de los 34 años se pierde velocidad y mentón.

## Controles táctiles

En el celular acostado: stick a la izquierda con **CUBRIRSE** y **ESQUIVAR** arriba (se mantienen apretados).
A la derecha, un botón por golpe con su dibujo: JAB, RECTO, LOW KICK y HIGH KICK grandes; CROSS IZQ., UPPERCUT,
CROSS DER. y DERRIBO más chicos. En el piso, los tres botones grandes cambian de dibujo (golpear, sumisión, pararse…).
Los dibujos están en `js/iconos.js`.
