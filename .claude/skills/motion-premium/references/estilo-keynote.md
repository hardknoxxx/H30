# Estilo keynote / agencia

Referencia: reel de Waves Studio (43 s; hecho en After Effects). Demo: `src/promo/KeynoteDemo.tsx`.

## Estética
- Degradados vivos (`GradientBg`): azul eléctrico → celeste → blanco; alternar con fondos claros
  (`GradientBg light`) y con escenas oscuras puntuales (lamparita que ilumina una palabra).
- Una idea por pantalla, **una palabra por golpe** (`WordSwap`), desenfoque entre palabras.
- Mockups (`Laptop`, `Phone`) con capturas reales o UI armada en CSS; puntero que hace clic (`Pointer`).
- Objetos 3D simples con órbitas de luz (`Orbit3D`), imágenes recortadas (cerebro, mapa) y logos con brillo.

## Ritmo
- Cambios cada 0,4–0,6 s en la parte de palabras; escenas de 2–3 s para mockups y 3D.
- Un `tick` suave por palabra; `swipe`/`whoosh` al cambiar de escena; `click` cuando el puntero hace clic.

## Receta de escena típica
1. Fondo `GradientBg`.
2. Frase partida en `WordSwap` con tiempos cada ~16 fotogramas.
3. Mockup que entra con `BlurIn from={0.85} y={60}`; adentro `TypeOn` o una captura con `CountUp`.
4. Cierre: logo + lema con `BlurIn blur={30}`.
