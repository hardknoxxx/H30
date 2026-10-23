---
name: motion-premium
description: Hacer videos de producto/marketing con motion "premium" en Remotion — estilo Opal (oscuro, vidrio, 3D, contadores), estilo keynote/agencia (degradados, palabra por palabra, mockups, 3D) y estilo neón (trazos de luz, nodos, chispas) — con diseño de sonido, música libre y voz. Usar cuando pidan un comercial, promo de app, reel/TikTok animado, "un video como el de Opal/Waves/Duolingo", o replicar un video de referencia.
---

# Motion premium en Remotion

Librería: `src/motion/` (importar desde `../motion`; el 3D desde `../motion/three`).
Ejemplos completos: `src/promo/PausaPromo.tsx` (Opal), `src/promo/KeynoteDemo.tsx` (keynote),
`src/h30/reel/` (neón + texturas de marca, con voz).

Antes de escribir código, cargar `remotion-best-practices` → `remotion-markup` (reglas de animación).

## Flujo de trabajo

1. **Analizar la referencia** (si hay una). Ver [references/analizar-referencia.md](references/analizar-referencia.md):
   planilla de cuadros cada 0,2–0,5 s, espectrograma del audio, golpes y tempo. Anotar escenas, duración de cada
   una, tipo de corte y qué suena en cada corte.
2. **Guion por tiempos**. Si hay voz: generarla primero (ElevenLabs), transcribirla con tiempos por palabra y
   colgar cada animación de esos tiempos. Si no hay voz: colgar los eventos de los golpes de la música.
3. **Música**: elegir pista y ubicar el drop con `python3 scripts/analizar-audio.py pista.mp3`; recortarla con
   ffmpeg para que el drop caiga en el corte más importante. Ver [references/sonido.md](references/sonido.md).
4. **Escenas** como componentes, cada una en `<Sequence>` con solapamiento de 6–8 fotogramas y `<SoftScene>`
   (desenfoque + zoom) o un barrido de luz en el corte.
5. **Efectos de sonido** con `<Sfx t={seg} name="…"/>` en cada evento visual importante.
6. **Revisar** con `scripts/revisar-cuadros.sh Comp salida.jpg 30 90 150 …` (mirar la imagen) y
   **renderizar** con `scripts/render-master.sh Comp out/archivo.mp4` (audio a −14 LUFS).

## Estilos

| Estilo | Cuándo | Receta |
|---|---|---|
| Opal / producto oscuro | Apps, SaaS, fintech, salud digital | [references/estilo-opal.md](references/estilo-opal.md) |
| Keynote / agencia | Agencias, lanzamientos, explicar un servicio | [references/estilo-keynote.md](references/estilo-keynote.md) |
| Neón / trazos de luz | Marcas con color fuerte, reels con voz, listas de rubros | [references/estilo-neon.md](references/estilo-neon.md) |

## Catálogo de componentes (`src/motion`)

| Componente | Qué hace |
|---|---|
| `Spotlight` | Fondo negro con foco de luz arriba, viñeta y grano |
| `GradientBg` | Degradado vivo con manchas que se mueven (claro u oscuro) |
| `Camera` | Perspectiva 3D: inclina, gira y acerca una escena entre dos fotogramas |
| `SoftScene` | Entrada/salida de escena por desenfoque + zoom |
| `BlurIn` / `BlurOut` | Aparecer/desaparecer desde desenfoque y escala |
| `CountUp` | Número que cuenta con desaceleración (`format` para horas, $, %) |
| `Glass` | Píldora/tarjeta de vidrio con borde iluminado que gira |
| `LightDot` | Punto de luz que nace antes de un widget |
| `Halo` | Brillo difuso de color detrás de algo (barra caliente, candado rojo) |
| `PixelDissolve` | Arma o desarma algo en píxeles con píxeles de colores sueltos (sin WebGL) |
| `ShimmerButton` | Botón con barrido de luz y pulsación |
| `Bracket` | Conector en árbol (un dato que se abre en N) |
| `HourlyCard` | Tarjeta con barras por hora de dos colores (para inclinar con `Camera`) |
| `WeekChart` | Barras semanales + promedio punteado; una barra se "calienta" |
| `WordSwap` | Una palabra por golpe en el mismo lugar |
| `TypeOn` / `Pointer` | Texto que se escribe con cursor / puntero que viaja y hace clic |
| `Phone` / `Laptop` | Mockups en CSS con cualquier contenido adentro |
| `Orbit3D` (`motion/three`) | Caja 3D con anillos de órbita (React Three Fiber) |
| `Sfx` + `SFX` | Efecto de sonido en un segundo dado, por nombre de evento |

Neón (en `src/h30/reel/glow.tsx`): `LightPath` (trazo con cometa), `Comet` (estela de transición), `Sparks`,
`TraceBox` (marco que se dibuja), `Node` (nodo que se enciende), `TimedWords` (palabras a tiempos de voz),
`Glitch`. Para usarlos en otro proyecto, copiar ese archivo y cambiar los colores.

## Reglas que hacen que se vea "pro"

- **Un solo foco por escena.** Una cosa importante en pantalla; lo demás oscuro o desenfocado.
- **Todo entra con desenfoque + escala**, nunca solo con opacidad. Curva `ease.out` (rápida y suave).
- **La cámara nunca está quieta**: zoom lento de 1 → 1,08 o inclinación leve durante toda la escena.
- **Escenas cortas**: 1,2–2,5 s. Un comercial de 15 s tiene 6–8 escenas.
- **Cortes en el golpe** de la música o en la palabra de la voz, con un sonido en cada corte.
- **Brillo solo en lo que importa** (la barra caliente, el candado, el botón), nunca detrás de todos los textos.
- **Contadores**: 20–30 fotogramas, siempre desacelerando; números con `tabular-nums`.
- **Tipografía**: Inter 600–700 para producto; tamaños grandes (titulares ≥ 100 px en 1080p).

## Render

- 3D y efectos WebGL: `remotion.config.ts` usa `setChromiumOpenGlRenderer("swangle")` (por software, anda
  en la nube). En una PC con placa de video, `"angle"` es más rápido.
- `<HtmlInCanvas>` necesita un flag experimental de Chrome: evitarlo; usar `PixelDissolve` y CSS.
- Fuentes locales en `public/fonts` (no depender de Google Fonts al renderizar).
