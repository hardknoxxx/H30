#!/usr/bin/env bash
# Imagen generada por IA gratis vía Pollinations (sin cuenta: modelo chico, calidad básica y marca de agua).
# Con una cuenta gratuita en https://auth.pollinations.ai se obtiene un token: exportarlo como
# POLLINATIONS_TOKEN mejora el modelo y saca la marca de agua.
# Uso: scripts/ia/imagen-gratis.sh "descripción en inglés" salida.jpg [ancho] [alto] [semilla]
set -euo pipefail
prompt=$1; out=$2; w=${3:-1024}; h=${4:-1024}; seed=${5:-1}
q=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$prompt")
auth=()
[ -n "${POLLINATIONS_TOKEN:-}" ] && auth=(-H "Authorization: Bearer $POLLINATIONS_TOKEN")
curl -fsS --max-time 180 "${auth[@]}" -o "$out" "https://image.pollinations.ai/prompt/$q?width=$w&height=$h&seed=$seed&model=flux&nologo=true"
echo "$out"
