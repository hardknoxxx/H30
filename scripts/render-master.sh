#!/usr/bin/env bash
# Renderiza cualquier composición y masteriza el audio a -14 LUFS (estándar de redes).
# Uso: scripts/render-master.sh <Composicion> <salida.mp4>
set -euo pipefail
cd "$(dirname "$0")/.."
comp=$1; out=$2
npx remotion render "$comp" "out/.premaster-$comp.mp4"
ffmpeg -y -i "out/.premaster-$comp.mp4" -c:v copy -af "loudnorm=I=-14:TP=-1.2:LRA=9" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$out"
rm "out/.premaster-$comp.mp4"
