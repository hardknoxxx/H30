"""Quita el fondo de una imagen (local, gratis) y la guarda como PNG transparente.

Uso: python3 scripts/ia/quitar-fondo.py entrada.jpg salida.png
"""

import sys

from rembg import remove

with open(sys.argv[1], "rb") as f:
    data = remove(f.read())
with open(sys.argv[2], "wb") as f:
    f.write(data)
print(sys.argv[2])
