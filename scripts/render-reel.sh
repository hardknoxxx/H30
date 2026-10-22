#!/usr/bin/env bash
# Renderiza el reel y masteriza el audio a -14 LUFS (volumen estándar de Reels/TikTok).
set -euo pipefail
cd "$(dirname "$0")/.."
npx remotion render H30Reel out/reel-premaster.mp4
ffmpeg -y -i out/reel-premaster.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.2:LRA=9" -ar 48000 -c:a aac -b:a 192k -movflags +faststart out/H30-reel-puerto-iguazu.mp4
rm out/reel-premaster.mp4
