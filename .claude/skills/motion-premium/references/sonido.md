# Sonido

## Música
- **Mixkit** (https://mixkit.co/free-stock-music/): gratis para redes sociales y anuncios online, sin
  atribución obligatoria; no para TV/radio, CD/DVD ni videojuegos. Las pistas se bajan directo de
  `https://assets.mixkit.co/music/<id>/<id>.mp3` (el id está en la página del tag).
- Etiquetas útiles: `minimal`, `techno`, `electronic`, `tech`, `hip-hop`, `dramatic`, `corporate`.
- Ubicar el drop: `python3 scripts/analizar-audio.py pista.mp3 [desde] [hasta]` → un hueco largo entre
  golpes de bombo seguido de golpes fuertes es el drop. Recortar para que caiga en el corte principal:
  `ffmpeg -ss <drop - segundo_del_corte> -t <duración+0,5> -i pista.mp3 public/musica/x.mp3`.
- Registrar la pista y su licencia en `public/musica/CREDITOS.md`.
- Usadas hasta ahora: "Minimal Techno 02" (reel H30), "Trap Electro Vibes" (Pausa).

## Efectos (`public/sfx`, Pixabay, uso comercial libre)
| Evento visual | `name` | Volumen |
|---|---|---|
| Logo / drop / titular que cae | `impact` | 0,25–0,35 |
| Corte de escena | `whoosh` (fuerte) o `swipe` (suave) | 0,18–0,25 |
| Subida hacia un clímax (pico al final, ~5,5 s) | `build` | 0,1–0,15 |
| Widget, píldora, chip que aparece | `pop` | 0,15–0,2 |
| Dato que se ilumina | `ping` | 0,15–0,2 |
| Botón / clic del puntero | `click` | 0,3 |
| Ítems de una lista, nodos | `tick` | 0,25–0,3 |
| Dígitos / tipeo | `key` | 0,1–0,15 |
| Punto de luz, revelado | `sparkle`, `chime` | 0,2–0,25 |
| Transformación, píxeles | `glitch` / `glitchSoft` | 0,13–0,2 |

Más efectos: https://mixkit.co/free-sound-effects/ (licencia libre de Mixkit) o el conector completo de
ElevenLabs, que los genera a medida.

## Mezcla
- Sin voz: música a 0,9 y efectos por encima. Con voz: voz normalizada a −16 LUFS
  (`ffmpeg -af loudnorm=I=-16:TP=-1.5`), música a ~0,15 mientras habla y subida al final.
- Master final a −14 LUFS con `scripts/render-master.sh` (pico ≤ −1 dB).

## Alternativas gratis (sin créditos) — `scripts/ia/`
Instalar con `pip install -r scripts/ia/requirements.txt` (los modelos se bajan solos la primera vez).
- **Voz**: `scripts/ia/voz-gratis.sh "texto" salida.wav [velocidad]` → Piper, voz argentina "daniela"
  (dataset CC BY-SA 4.0: uso comercial con atribución). Más robótica que ElevenLabs, pero gratis e ilimitada.
- **Tiempos por palabra**: `python3 scripts/ia/transcribir.py voz.mp3` → Whisper local; reemplaza la
  transcripción de ElevenLabs para sincronizar animaciones.
- **Recortar fondos**: `python3 scripts/ia/quitar-fondo.py foto.jpg recorte.png` → rembg (~1 min por foto en CPU).
- **Imágenes**: `scripts/ia/imagen-gratis.sh "prompt en inglés" salida.jpg` → Pollinations; sin cuenta la
  calidad es básica y lleva marca de agua; con token gratuito (`POLLINATIONS_TOKEN`) mejora.
- **Video generado por IA**: no hay opción gratis que funcione sin placa de video; animar con Remotion.
