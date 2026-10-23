"""Analiza una pista: duración, BPM aproximado, energía cada 4 s y golpes de bombo (para ubicar el drop).

Uso: python3 scripts/analizar-audio.py pista.mp3 [desde_seg] [hasta_seg]
Requiere ffmpeg y numpy.
"""

import subprocess
import sys

import numpy as np

path = sys.argv[1]
a = float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
b = float(sys.argv[3]) if len(sys.argv) > 3 else None
SR = 22050


def load(extra):
    cmd = ["ffmpeg", "-v", "error", "-i", path, *extra, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(float) / 32768


x = load([])
hop = int(SR * 0.01)
n = len(x) // hop
e = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1))
d = np.maximum(0, np.diff(np.log(e + 1e-4)))
s = d[:6000] - d[:6000].mean()
ac = np.correlate(s, s, "full")[len(s) - 1 :]
lags = np.arange(len(ac)) * 0.01
m = (lags > 0.3) & (lags < 0.75)
print(f"duración {len(x) / SR:.1f}s · BPM ~{60 / lags[m][np.argmax(ac[m])]:.0f}")
w = 400
print("energía cada 4 s (dB):", [round(float(20 * np.log10(np.mean(e[i : i + w]) + 1e-6)), 1) for i in range(0, len(e) - w, w)])

low = load(["-af", "lowpass=f=120"])
low = low[int(a * SR) : int(b * SR) if b else None]
hop = int(SR * 0.005)
n = len(low) // hop
el = np.sqrt(np.mean(low[: n * hop].reshape(n, hop) ** 2, axis=1))
dl = np.maximum(0, np.diff(el))
thr = dl.max() * 0.3
hits = []
for i in range(1, len(dl) - 1):
    if dl[i] > thr and dl[i] >= dl[i - 1] and dl[i] >= dl[i + 1]:
        t = a + i * 0.005
        if not hits or t - hits[-1] > 0.12:
            hits.append(t)
print("golpes de bombo (s):", [round(float(t), 2) for t in hits[:60]])
print("Un hueco largo entre golpes seguido de golpes fuertes suele ser el drop.")
