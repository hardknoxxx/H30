#!/usr/bin/env bash
# Renderiza varios fotogramas de una composición y los une en una sola imagen para revisar.
# Uso: scripts/revisar-cuadros.sh <Composicion> <salida.jpg> <frame> [frame...]
set -euo pipefail
cd "$(dirname "$0")/.."
comp=$1; out=$2; shift 2
tmp=$(mktemp -d)
npx remotion bundle --out-dir="$tmp/bundle" >/dev/null
inputs=()
for f in "$@"; do
  npx remotion still "$tmp/bundle" "$comp" "$tmp/$f.jpg" --frame="$f" --image-format=jpeg --scale=0.3 --log=error
  inputs+=(-i "$tmp/$f.jpg")
done
ffmpeg -v error -y "${inputs[@]}" -filter_complex "hstack=inputs=$#" "$out"
rm -rf "$tmp"
echo "$out"
