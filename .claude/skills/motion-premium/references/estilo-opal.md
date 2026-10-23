# Estilo Opal / producto oscuro

Referencia: comercial de Opal (16 s, 16:9). Implementación: `src/promo/PausaPromo.tsx`.

## Estética
- Fondo casi negro (`tone.bg`) con `Spotlight` (foco blanco arriba, viñeta, grano 5–6 %).
- Paleta neutra; un solo color de acento por escena: azul = bien, naranja = exceso, rojo = bloqueo.
- Tipografía Inter 500–700, tracking negativo en titulares. Etiquetas en gris (`tone.muted`).
- Widgets de vidrio (`Glass`) con borde iluminado que rota despacio.

## Estructura (16 s)
| Seg | Escena | Componentes | Corte / sonido |
|---|---|---|---|
| 0–3 | Panel del día inclinado en 3D; la cámara se levanta mientras crecen las barras y cuenta el total | `Camera` (rotateX 64→30, zoom 0,78→1,12), `HourlyCard`, `CountUp` | Subida de la música; `build` suave |
| 3–4,6 | Semana; una barra sube y se "calienta" pasando el promedio | `WeekChart heatAt`, `Halo` naranja | **Drop** + `impact` en el corte, `ping` al calentarse |
| 4,6–8,8 | Punto de luz → píldoras con contadores; luego bajan y aparece un puntaje con árbol | `LightDot`, `Glass`, `CountUp`, `Bracket` | `sparkle`, `pop` por píldora, `swipe` + `ping` |
| 8,8–11 | Ícono de la app que se desarma en píxeles y se arma un candado con brillo rojo | `PixelDissolve` out/in, `Halo` rojo | `glitch` en la disolución, `impact` en el candado |
| 11–12,6 | Panel de reglas inclinado | `Camera` rotateY −16→−6, `Glass` radio 48, `BlurIn` escalonado | `swipe`, `tick` por fila |
| 12,6–13,8 | Botón "Empezar" con barrido de luz y pulsación | `ShimmerButton pressAt` | `click` en la pulsación |
| 13,8–16 | Ícono + nombre desde desenfoque, el tracking se cierra; lema y URL | `BlurIn`, letterSpacing 24→−4 | `impact` + `chime`; fundido final |

## Detalles que importan
- La primera escena empieza **sin** fundido (`SoftScene enter={false}`); la última termina en negro.
- La píldora que nace primero se corre cuando llegan las otras (spring sin rebote, `damping: 200`).
- Al pasar del dato al puntaje, las píldoras bajan y se achican, y el árbol se dibuja desde el centro.
- En la disolución, la app sale entre 9,8 y 10,1 s y el candado entra 0,15 s después (se superponen).
