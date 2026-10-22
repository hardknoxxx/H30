"""Pista de fondo original para el reel de H30 (sin derechos de terceros).

Pop acústico alegre a 105 BPM en Do mayor: guitarra punteada (Karplus-Strong),
bajo, bombo, palmas, shaker y una marimba que aparece en algunos tramos.
Uso: python3 scripts/musica.py public/musica/fondo.wav 48
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 105
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(30)

out_path = sys.argv[1]
total = float(sys.argv[2]) if len(sys.argv) > 2 else 48.0
N = int(total * SR) + SR * 3
mix = {k: np.zeros(N) for k in ["guit", "bass", "drums", "marimba", "pad"]}


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(track, sig, t):
    i = int(t * SR)
    if i >= N:
        return
    end = min(N, i + len(sig))
    mix[track][i:end] += sig[: end - i]


def env(n, a, d):
    """Ataque lineal y caída exponencial (en segundos)."""
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    na = max(1, int(a * SR))
    e[:na] *= np.linspace(0, 1, na)
    return e


def pluck(freq, dur, bright=0.5):
    """Cuerda punteada Karplus-Strong."""
    n = int(dur * SR)
    p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p)
    # Suaviza el ruido inicial para un tono menos metálico.
    for _ in range(int((1 - bright) * 3)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    decay = 0.996
    for i in range(n):
        j = i % p
        out[i] = buf[j]
        buf[j] = decay * 0.5 * (buf[j] + buf[(j + 1) % p])
    return out * env(n, 0.002, dur * 0.6)


def bass(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
    return np.tanh(1.4 * s) * env(n, 0.005, 0.32)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.001, 0.12) * 1.1


def highpass(x, a=0.95):
    y = np.zeros_like(x)
    prev_x = prev_y = 0.0
    for i, v in enumerate(x):
        prev_y = a * (prev_y + v - prev_x)
        prev_x = v
        y[i] = prev_y
    return y


def lowpass(x, a=0.3):
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


CLAP = None


def clap():
    global CLAP
    if CLAP is None:
        n = int(0.25 * SR)
        noise = highpass(rng.uniform(-1, 1, n), 0.9)
        e = np.zeros(n)
        for k, off in enumerate([0, 0.011, 0.022]):
            i = int(off * SR)
            e[i:] += env(n - i, 0.0005, 0.012 if k < 2 else 0.09)
        CLAP = noise * e * 0.7
    return CLAP


SHAKER = None


def shaker():
    global SHAKER
    if SHAKER is None:
        n = int(0.09 * SR)
        SHAKER = highpass(rng.uniform(-1, 1, n), 0.6) * env(n, 0.01, 0.025) * 0.22
    return SHAKER


def marimba(freq, dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) * env(n, 0.002, 0.25) + 0.25 * np.sin(2 * np.pi * freq * 4 * t) * env(n, 0.001, 0.04)
    return s


def pad(notes, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.08, 0.08):
            f = midi(m + det)
            s += 2 * (t * f % 1) - 1
    s = lowpass(s / (len(notes) * 2), 0.04)
    a = np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.4)
    return s * np.clip(a, 0, 1)


# Do - Sol - Lam - Fa (I - V - vi - IV)
CHORDS = [
    (48, [60, 64, 67, 72]),
    (43, [59, 62, 67, 71]),
    (45, [60, 64, 69, 72]),
    (41, [60, 65, 69, 72]),
]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]  # patrón de punteo en corcheas
MELODY = [  # (beat dentro de 2 compases, nota)
    (0, 76), (1, 79), (1.5, 76), (2.5, 74), (4, 72), (5, 74), (5.5, 76), (6.5, 74),
]

bars = int(np.ceil(total / BAR)) + 1
last_bar = int((total - 1.5) / BAR)  # último compás con acorde final
for b in range(bars):
    t0 = b * BAR
    if t0 > total:
        break
    root, notes = CHORDS[b % 4]
    final = b == last_bar
    # Breaks: un compás sin batería antes de los rubros y antes del cierre.
    drums_on = not final and b not in (8, 14)
    if final:
        for k, m in enumerate(notes):
            place("guit", pluck(midi(m), 3.5, 0.8) * 0.55, t0 + k * 0.03)
        place("bass", bass(midi(root), 2.5) * 1.2, t0)
        place("drums", kick(), t0)
        place("drums", clap() * 0.8, t0)
        place("pad", pad(notes, 3.5) * 0.5, t0)
        break
    for i, idx in enumerate(ARP):
        swing = 0.018 if i % 2 else 0
        place("guit", pluck(midi(notes[idx]), 0.7, 0.6) * (0.5 if i % 2 else 0.62), t0 + i * BEAT / 2 + swing)
    place("pad", pad(notes, BAR) * 0.35, t0)
    for beat, length in [(0, 0.45), (1.5, 0.3), (2, 0.45), (3.5, 0.3)]:
        place("bass", bass(midi(root), length * BEAT * 2), t0 + beat * BEAT)
    if drums_on:
        for beat in (0, 2, 2.5):
            place("drums", kick() * (0.7 if beat == 2.5 else 1), t0 + beat * BEAT)
        for beat in (1, 3):
            place("drums", clap(), t0 + beat * BEAT)
        for k in range(8):
            place("drums", shaker() * (1 if k % 2 else 0.6), t0 + k * BEAT / 2 + (0.02 if k % 2 else 0))
    # Marimba en tramos alternos (cada 4 compases, 2 de melodía).
    if (b // 2) % 2 == 1 and b >= 2:
        half = (b % 2) * 4
        for beat, m in MELODY:
            if half <= beat < half + 4:
                place("marimba", marimba(midi(m)), t0 + (beat - half) * BEAT)

# Mezcla y reverb simple (respuesta de impulso de ruido con caída exponencial).
levels = {"guit": 0.55, "bass": 0.5, "drums": 0.55, "marimba": 0.28, "pad": 0.12}
dry = sum(mix[k] * v for k, v in levels.items())
ir_n = int(1.2 * SR)
ir = rng.uniform(-1, 1, ir_n) * np.exp(-np.arange(ir_n) / SR / 0.35)
ir /= np.sqrt(np.sum(ir**2))
send = mix["guit"] * 0.4 + mix["marimba"] * 0.5 + mix["drums"] * 0.08
size = 1 << int(np.ceil(np.log2(N + ir_n)))
wet = np.fft.irfft(np.fft.rfft(send, size) * np.fft.rfft(ir, size), size)[:N] * 0.18
master = dry + wet

# Estéreo con un leve ensanchamiento por retardo.
d = int(0.012 * SR)
left = master
right = np.concatenate([np.zeros(d), master[:-d]]) * 0.9 + master * 0.1
st = np.stack([left, right], axis=1)
st = st[: int(total * SR)]
fade = int(1.2 * SR)
st[-fade:] *= np.linspace(1, 0, fade)[:, None]
st = np.tanh(st / np.max(np.abs(st)) * 1.3) * 0.89

with wave.open(out_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print(out_path, f"{total:.1f}s")
