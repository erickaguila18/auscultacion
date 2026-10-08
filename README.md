# Entrenador de auscultación 3D

Aplicación web de una sola página (SPA) para practicar los puntos de auscultación **cardíacos, pulmonares y abdominales**, por delante y por la espalda, sobre un modelo 3D. Incluye lista de sonidos con resaltado de focos, modo **Entrenar** y un módulo de **Práctica** con tarjetas y reto auditivo de **patrones respiratorios**.

> ⚠️ Herramienta **educativa**. Los sonidos son sintetizados y aproximados, no son grabaciones clínicas.

## Cómo ejecutarla

El modelo 3D y el visor se cargan con `fetch` y módulos ES, que los navegadores **bloquean al abrir `index.html` con doble clic** (`file://`). Sírvela con un servidor local desde esta carpeta:

```bash
python3 -m http.server 8000      # luego abre http://localhost:8000
```

Alternativas: la extensión *Live Server* de VS Code o `npx serve`. Necesita internet para los CDN (Bootstrap, Three.js e íconos).

Si el modelo no carga, la app muestra un dibujo 2D de respaldo; el botón **Modelo** permite cargar un `.glb` o `.usdz` desde tu equipo.

## Estructura

```
index.html            Maqueta y carga de scripts
css/styles.css        Todos los estilos
models/               Modelo 3D (.usdz)
js/
  data.js             Focos (F) y catálogo de sonidos (S)
  body.js             Estado global, dibujo 2D, resaltado, lista y selección
  audio.js            Motor de síntesis (corazón, pulmón, intestino) y onda
  events.js           Pestañas, buscador, volumen, diafragma/campana, Entrenar
  practice.js         Patrones respiratorios (PT), tarjetas y reto auditivo
  main.js             Arranque (debe cargarse al final)
  viewer3d.js         Visor Three.js (módulo ES): orientación, focos y estetoscopio
```

Los archivos `data.js` … `main.js` son scripts clásicos que comparten el ámbito global, por eso **el orden de las etiquetas `<script>` en `index.html` importa**. `viewer3d.js` es un módulo y usa `F`, `setFocus`, `anat`, `view` y `sys` de ese ámbito.

## Cómo modificar

- **Agregar un sonido:** añade una entrada a `S` en `js/data.js` (`H(...)` para cardíacos o un objeto para pulmón/abdomen) con sus focos. Si necesita un timbre nuevo, extiéndelo en `heart`, `lung` o `bowel` de `js/audio.js`.
- **Agregar un foco:** añade `add(...)` en `js/data.js` y su posición anatómica (fracción de la estatura) en `D` de `js/viewer3d.js`.
- **Agregar un patrón respiratorio:** añade un objeto a `PT` en `js/practice.js`. Cada respiración es `[inspiración s, espiración s, pausa s, amplitud 0–1, meseta s, rasgo]`; el rasgo (`'kus'`, `'gasp'`, `'whz'`) activa un timbre especial en `bsnd`.
- **Cambiar el modelo:** reemplaza el archivo de `models/` y ajusta `MODEL_URL` en `js/viewer3d.js`. La orientación se detecta sola; usa **Invertir** si queda al revés.
- **Estilos:** todo en `css/styles.css` (variables de color en `:root`).

## Créditos

### Modelo 3D
**[Male Full Body Ecorche](https://sketchfab.com/3d-models/male-full-body-ecorche-ab11ebff89224f03bd75efede1164cf6)** por **[Diego Luján García](https://sketchfab.com/diegoluga)** en [Sketchfab](https://sketchfab.com). Consulta su licencia en la página del modelo y cumple sus condiciones (por ejemplo, atribución en CC-BY) si publicas o redistribuyes esta aplicación.

### Bibliotecas y recursos por CDN
- **[Bootstrap 5.3.3](https://getbootstrap.com)** vía [jsDelivr](https://www.jsdelivr.com). Licencia MIT.
- **[Three.js r184](https://threejs.org)** (`OrbitControls`, `USDLoader`, `GLTFLoader`) vía [jsDelivr](https://www.jsdelivr.com). Licencia MIT.
- **[Flaticon UIcons 2.6.0](https://www.flaticon.com/uicons)** (Regular Rounded) vía `cdn-uicons.flaticon.com`. Revisa sus [términos](https://www.flaticon.com/legal) y da la atribución requerida si usas la versión gratuita.

### Audio
Generado en el navegador con la **Web Audio API**; no se usan archivos de audio de terceros.
