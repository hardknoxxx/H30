import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, ease, tone, ui } from "./theme";

/* =========================================================================
 * Primitivas de motion "premium": luz, vidrio, desenfoques, contadores.
 * Todo se anima con useCurrentFrame(); nada de transiciones CSS.
 * ========================================================================= */

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
)}")`;

/** Fondo negro con un foco de luz suave arriba, viñeta y grano de película. */
export const Spotlight: React.FC<{ y?: string; strength?: number; tint?: string; grain?: number }> = ({
  y = "-10%",
  strength = 0.16,
  tint = "255,255,255",
  grain = 0.06,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: tone.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% ${y}, rgba(${tint},${strength}) 0%, rgba(${tint},0) 70%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          opacity: grain,
          mixBlendMode: "screen",
          backgroundPosition: `${Math.floor(random(`gx${frame}`) * 240)}px ${Math.floor(random(`gy${frame}`) * 240)}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Aparece desde desenfoque + escala (la entrada más característica del estilo). */
export const BlurIn: React.FC<{
  at: number;
  dur?: number;
  from?: number;
  blur?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, dur = 14, from = 1.15, blur = 24, y = 0, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: ease.out });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
        filter: `blur(${(1 - p) * blur}px)`,
        scale: interpolate(p, [0, 1], [from, 1]),
        translate: `0px ${(1 - p) * y}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Sale hacia el desenfoque (para cortes suaves). */
export const BlurOut: React.FC<{ at: number; dur?: number; to?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  dur = 10,
  to = 1.2,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: ease.in });
  return (
    <div style={{ opacity: 1 - p, filter: `blur(${p * 26}px)`, scale: interpolate(p, [0, 1], [1, to]), ...style }}>
      {children}
    </div>
  );
};

/** Número que cuenta de `from` a `to` con desaceleración. */
export const CountUp: React.FC<{
  at: number;
  dur?: number;
  from?: number;
  to: number;
  format?: (n: number) => string;
  style?: React.CSSProperties;
}> = ({ at, dur = 24, from = 0, to, format = (n) => String(Math.round(n)), style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: ease.out });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{format(from + (to - from) * p)}</span>;
};

/**
 * Píldora/tarjeta de vidrio con borde iluminado que gira (como los widgets de Opal).
 * `rim` controla el brillo del borde; `glow` agrega halo exterior.
 */
export const Glass: React.FC<{
  children: React.ReactNode;
  radius?: number;
  rim?: number;
  glow?: string;
  style?: React.CSSProperties;
  pad?: string;
}> = ({ children, radius = 999, rim = 1, glow, style, pad = "18px 30px" }) => {
  const frame = useCurrentFrame();
  const angle = 210 + frame * 1.4;
  return (
    <div
      style={{
        position: "relative",
        padding: 2,
        borderRadius: radius,
        background: `conic-gradient(from ${angle}deg, rgba(255,255,255,${0.9 * rim}) 0deg, rgba(255,255,255,0.12) 70deg, rgba(255,255,255,0.08) 180deg, rgba(255,255,255,${0.5 * rim}) 300deg, rgba(255,255,255,${0.9 * rim}) 360deg)`,
        boxShadow: glow ? `0 0 40px 4px ${glow}` : "0 20px 60px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: radius,
          padding: pad,
          background: "linear-gradient(180deg, #1c1c1f 0%, #0c0c0e 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -10px 30px rgba(0,0,0,0.5)",
          fontFamily: ui,
          color: tone.text,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Punto de luz que aparece, brilla y se expande (transición típica antes de un widget). */
export const LightDot: React.FC<{ at: number; x: number; y: number; dur?: number; size?: number }> = ({
  at,
  x,
  y,
  dur = 12,
  size = 26,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > dur + 6) return null;
  const grow = interpolate(t, [0, dur * 0.5, dur], [0.2, 1, 3], { ...clamp, easing: ease.out });
  const op = interpolate(t, [0, 3, dur, dur + 6], [0, 1, 0.8, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle, #fff 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 72%)",
        boxShadow: "0 0 30px 10px rgba(255,255,255,0.35)",
        scale: grow,
        opacity: op,
      }}
    />
  );
};

/** Halo de color difuso detrás de un elemento (barra caliente, candado rojo…). */
export const Halo: React.FC<{ color: string; size: number; at: number; x: number; y: number; pulse?: boolean }> = ({
  color,
  size,
  at,
  x,
  y,
  pulse,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const k = interpolate(t, [0, 10], [0, 1], { ...clamp, easing: ease.out }) * (pulse ? 0.85 + 0.15 * Math.sin(t / 5) : 1);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 65%)`,
        opacity: k,
        filter: "blur(18px)",
        mixBlendMode: "screen",
      }}
    />
  );
};

/**
 * Disolución en píxeles (sin WebGL): una grilla de celdas que desaparecen en orden aleatorio,
 * con píxeles de colores sueltos alrededor. mode="out" desarma, mode="in" arma.
 */
export const PixelDissolve: React.FC<{
  at: number;
  dur?: number;
  mode?: "in" | "out";
  cells?: number;
  seed?: string;
  children: React.ReactNode;
  size: number;
}> = ({ at, dur = 12, mode = "out", cells = 16, seed = "px", children, size }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], clamp);
  const k = mode === "out" ? p : 1 - p;
  const c = size / cells;
  let rects = "";
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      if (random(`${seed}${i}-${j}`) >= k) rects += `<rect x="${i * c}" y="${j * c}" width="${c + 0.5}" height="${c + 0.5}"/>`;
    }
  }
  const mask = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><g fill="#000">${rects}</g></svg>`,
  )}")`;
  const active = p > 0 && p < 1;
  const colorsPx = ["#ff2d55", "#00e5ff", "#ffffff", "#7d5aff"];
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ width: size, height: size, maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%" }}>{children}</div>
      {active
        ? Array.from({ length: 70 }, (_, n) => {
            const r1 = random(`${seed}p${n}`);
            const r2 = random(`${seed}q${n}`);
            const spread = 0.6 + Math.sin(p * Math.PI) * 0.9;
            const px = size / 2 + (r1 - 0.5) * size * spread * 1.6;
            const py = size / 2 + (r2 - 0.5) * size * spread * 1.6;
            const on = random(`${seed}o${n}${Math.floor(frame / 2)}`) > 0.45;
            return on ? (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: px,
                  top: py,
                  width: c * 0.8,
                  height: c * 0.8,
                  backgroundColor: colorsPx[n % colorsPx.length],
                  opacity: Math.sin(p * Math.PI) * 0.85,
                }}
              />
            ) : null;
          })
        : null}
    </div>
  );
};

/** Botón con barrido de luz (shimmer) y pulsación. */
export const ShimmerButton: React.FC<{
  at: number;
  pressAt?: number;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ at, pressAt, width, height, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const sweep = interpolate(t, [8, 30], [-0.4, 1.4], clamp);
  const press = pressAt === undefined ? 1 : interpolate(frame - pressAt, [0, 3, 9], [1, 0.95, 1], clamp);
  const appear = spring({ frame: t, fps, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: height / 2,
        overflow: "hidden",
        background: "linear-gradient(180deg, #4a4a52 0%, #2a2a30 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 20px 60px rgba(0,0,0,0.6)",
        scale: press,
        opacity: appear,
        filter: `blur(${(1 - appear) * 20}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: ui,
        fontWeight: 600,
        fontSize: height * 0.36,
        color: tone.text,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep * 100 - 25}%, rgba(255,255,255,0.55) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 25}%)`,
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </div>
  );
};

/** Conector tipo "árbol": una línea horizontal con ramas hacia N hijos y un tallo hacia arriba. */
export const Bracket: React.FC<{ at: number; width: number; height: number; branches: number; dur?: number; color?: string }> = ({
  at,
  width,
  height,
  branches,
  dur = 14,
  color = "rgba(255,255,255,0.75)",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: ease.out });
  const xs = Array.from({ length: branches }, (_, i) => (branches === 1 ? width / 2 : (i / (branches - 1)) * width));
  const d = `M ${width / 2} 0 L ${width / 2} ${height / 2} M 0 ${height / 2} L ${width} ${height / 2} ${xs
    .map((x) => `M ${x} ${height / 2} L ${x} ${height}`)
    .join(" ")}`;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/**
 * Cámara: envuelve una escena en perspectiva y anima inclinación, giro y acercamiento.
 * Los valores son [inicio, fin] y se interpolan entre `from` y `to` (fotogramas).
 */
export const Camera: React.FC<{
  from: number;
  to: number;
  rotateX?: [number, number];
  rotateY?: [number, number];
  rotateZ?: [number, number];
  zoom?: [number, number];
  y?: [number, number];
  perspective?: number;
  children: React.ReactNode;
}> = ({ from, to, rotateX = [0, 0], rotateY = [0, 0], rotateZ = [0, 0], zoom = [1, 1], y = [0, 0], perspective = 1600, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, to], [0, 1], { ...clamp, easing: ease.camera });
  const lerp = (r: [number, number]) => r[0] + (r[1] - r[0]) * p;
  return (
    <AbsoluteFill style={{ perspective, perspectiveOrigin: "50% 40%" }}>
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `translateY(${lerp(y)}px) scale(${lerp(zoom)}) rotateX(${lerp(rotateX)}deg) rotateY(${lerp(rotateY)}deg) rotateZ(${lerp(rotateZ)}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Escena con entrada/salida por desenfoque y zoom (corte "suave" estilo keynote). */
export const SoftScene: React.FC<{ children: React.ReactNode; edge?: number; enter?: boolean; exit?: boolean }> = ({
  children,
  edge = 8,
  enter = true,
  exit = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const i = enter ? interpolate(frame, [0, edge], [0, 1], { ...clamp, easing: ease.out }) : 1;
  const o = exit ? interpolate(frame, [durationInFrames - edge, durationInFrames], [0, 1], { ...clamp, easing: ease.in }) : 0;
  return (
    <AbsoluteFill
      style={{
        opacity: i * (1 - o),
        filter: `blur(${(1 - i) * 22 + o * 26}px)`,
        scale: interpolate(i, [0, 1], [0.92, 1]) * interpolate(o, [0, 1], [1, 1.12]),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
