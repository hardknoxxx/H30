# Analizar un video de referencia

```bash
V=referencia.mp4
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "$V"
# Planilla de cuadros: 48 cuadros repartidos en todo el video
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
ffmpeg -y -i "$V" -vf "fps=$(python3 -c "print(48/$dur)"),scale=-2:240,tile=12x4" -frames:v 1 hoja.png
# Detalle de un tramo (4 cuadros por segundo; recortar con crop si el video es una pantalla filmada)
ffmpeg -y -ss 0 -t 12 -i "$V" -vf "fps=4,scale=256:-1,tile=8x6" -frames:v 1 detalle.png
# Audio: espectrograma, volumen y golpes
ffmpeg -y -i "$V" -vn -lavfi "showspectrumpic=s=1400x300:legend=0:scale=log:fscale=log" audio.png
python3 scripts/analizar-audio.py "$V"
```

- Videos de TikTok: `pip install "yt-dlp[default,curl-cffi]"` y `yt-dlp --impersonate chrome <url>`.
- Leer las imágenes y anotar: escenas y su duración, tipo de corte, qué se anima y cómo (desenfoque, escala,
  cámara, trazos), paleta, tipografía y qué suena en cada corte (en el espectrograma, las líneas verticales
  son golpes y los barridos diagonales son whooshes o subidas).
- No reutilizar el audio, logos ni marcas de la referencia: replicar el lenguaje con material propio.
