"""Transcribe un audio con Whisper (local, gratis) y guarda los tiempos por palabra en JSON.

Uso: python3 scripts/ia/transcribir.py voz.mp3 [salida.json] [modelo]
  modelo: tiny | base | small (por defecto) | medium. Más grande = más preciso y más lento.
"""

import json
import subprocess
import sys

import numpy as np

from faster_whisper import WhisperModel

audio = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else audio.rsplit(".", 1)[0] + ".palabras.json"
size = sys.argv[3] if len(sys.argv) > 3 else "small"

model = WhisperModel(size, device="cpu", compute_type="int8")
# Se decodifica con ffmpeg (evita incompatibilidades de la librería de audio de faster-whisper).
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
segments, info = model.transcribe(samples, language="es", word_timestamps=True)
words = []
for seg in segments:
    for w in seg.words:
        words.append({"text": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)})
with open(out, "w", encoding="utf8") as f:
    json.dump(words, f, ensure_ascii=False, indent=1)
print(" ".join(f"{w['text']}@{w['start']}" for w in words))
print(out)
