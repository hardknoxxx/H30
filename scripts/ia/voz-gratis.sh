#!/usr/bin/env bash
# Voz en off gratis y local con Piper (voz argentina "daniela").
# Uso: scripts/ia/voz-gratis.sh "Texto a decir" salida.wav [velocidad]
#   velocidad: 1.0 normal, 0.9 más rápido, 1.1 más lento.
# Licencia de la voz: dataset CC BY-SA 4.0 (uso comercial con atribución).
set -euo pipefail
txt=$1; out=$2; speed=${3:-1.0}
dir="${PIPER_VOICES:-$HOME/.cache/piper}"
voice="es_AR-daniela-high"
mkdir -p "$dir"
base="https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_AR/daniela/high"
[ -f "$dir/$voice.onnx" ] || curl -sSL -o "$dir/$voice.onnx" "$base/$voice.onnx"
[ -f "$dir/$voice.onnx.json" ] || curl -sSL -o "$dir/$voice.onnx.json" "$base/$voice.onnx.json"
echo "$txt" | python3 -m piper -m "$dir/$voice.onnx" --length-scale "$speed" -f "$out"
echo "$out"
