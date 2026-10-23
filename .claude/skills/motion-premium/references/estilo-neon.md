# Estilo neón / trazos de luz

Referencia: motion de Duolingo (TikTok). Implementación: `src/h30/reel/` (reel vertical de H30 con voz).

## Estética
- Fondo oscuro (o textura de marca oscurecida); un color de marca como "luz".
- Trazos con brillo (`LightPath`) con cabeza de cometa que dejan la línea tenue al terminar.
- Marcos que se dibujan alrededor de fotos/tarjetas (`TraceBox`), nodos apagados que se encienden (`Node`),
  pulsos de luz que viajan por las ramas, chispas en cada aparición (`Sparks`).
- Texto palabra por palabra sincronizado con la voz (`TimedWords`), glitch en una palabra clave.

## Cortes
- Escena saliente: zoom 1→1,22 + desenfoque; entrante: 0,86→1 + desenfoque (`ZoomScene`).
- Un barrido de luz diagonal (`Comet`) cruza la pantalla en cada corte, con `whoosh`.
- Final: el logo se aplasta a una línea y luego a un punto.

## Con voz
1. Generar la voz (ElevenLabs) y transcribirla con tiempos por palabra.
2. Una escena por frase; dentro, `timer(inicioEscena)(segundo)` convierte segundos de la voz en fotogramas.
3. Nodos/ítems que se nombran se encienden en el segundo exacto de la palabra; números que se dictan
   aparecen dígito por dígito.
