import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, colors, display, easeInOut, easeOut } from "../brand";

/* Estilo "trazo de luz": línea naranja con brillo, cabeza de cometa blanca y estela. */

export const GLOW = `drop-shadow(0 0 5px rgba(255,170,90,0.95)) drop-shadow(0 0 16px rgba(240,130,36,0.75))`;

/** Dibuja un recorrido con un cometa en la punta; al terminar queda la línea tenue. */
export const LightPath: React.FC<{
  d: string;
  at: number;
  dur: number;
  width?: number;
  rest?: number;
  color?: string;
  head?: boolean;
}> = ({ d, at, dur, width = 6, rest = 0.55, color = colors.orange, head = true }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: easeInOut });
  if (frame < at) return null;
  const len = getLength(d);
  const pt = getPointAtLength(d, len * p);
  const settle = interpolate(frame - at - dur, [0, 10], [1, rest], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: GLOW }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - p)}
        opacity={settle}
      />
      {head && pt && p < 1 ? (
        <>
          <circle cx={pt.x} cy={pt.y} r={width * 2.6} fill="#fff4e6" />
          <circle cx={pt.x} cy={pt.y} r={width * 5} fill="rgba(240,130,36,0.35)" />
        </>
      ) : null}
    </svg>
  );
};

/** Solo la estela que viaja (sin dejar línea), para barridos de transición. */
export const Comet: React.FC<{ d: string; at: number; dur: number; tail?: number; width?: number }> = ({
  d,
  at,
  dur,
  tail = 0.35,
  width = 8,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur + 2) return null;
  const len = getLength(d);
  const p = interpolate(frame - at, [0, dur], [0, 1 + tail], { ...clamp, easing: easeInOut });
  const headLen = Math.min(1, p) * len;
  const tailStart = Math.max(0, p - tail) * len;
  const seg = Math.max(1, headLen - tailStart);
  const pt = getPointAtLength(d, headLen);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: GLOW }}>
      <path
        d={d}
        fill="none"
        stroke={colors.orange}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`0 ${tailStart} ${seg} ${len * 3}`}
      />
      {pt && p < 1 ? <circle cx={pt.x} cy={pt.y} r={width * 2.2} fill="#fff4e6" /> : null}
    </svg>
  );
};

/** Chispas radiales que salen de un punto. */
export const Sparks: React.FC<{ x: number; y: number; at: number; count?: number; size?: number; seed?: string }> = ({
  x,
  y,
  at,
  count = 14,
  size = 160,
  seed = "s",
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 22) return null;
  const p = interpolate(t, [0, 16], [0, 1], { ...clamp, easing: easeOut });
  const fade = interpolate(t, [8, 22], [1, 0], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: GLOW }}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + random(`${seed}a${i}`) * 0.5;
        const L = size * (0.5 + random(`${seed}l${i}`) * 0.7);
        const r1 = L * p;
        const r0 = Math.max(0, r1 - L * 0.45);
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0}
            y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * r1}
            y2={y + Math.sin(a) * r1}
            stroke={i % 3 === 0 ? "#fff4e6" : colors.orange}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={fade}
          />
        );
      })}
    </svg>
  );
};

/** Marco redondeado que se dibuja con un trazo de luz alrededor; el contenido aparece al cerrarse. */
export const TraceBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  dur?: number;
  radius?: number;
  fill?: string;
  children?: React.ReactNode;
  contentDelay?: number;
}> = ({ x, y, w, h, at, dur = 14, radius = 36, fill = "rgba(20,20,20,0.72)", children, contentDelay = 6 }) => {
  const frame = useCurrentFrame();
  const r = radius;
  // Empieza arriba al centro y recorre el marco en sentido horario.
  const d = `M ${x + w / 2} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
  const show = interpolate(frame - at - contentDelay, [0, 8], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: r,
          overflow: "hidden",
          backgroundColor: fill,
          opacity: show,
          scale: interpolate(show, [0, 1], [0.97, 1]),
        }}
      >
        {children}
      </div>
      <LightPath d={d} at={at} dur={dur} width={5} rest={0.9} />
    </>
  );
};

/** Nodo circular apagado que se enciende con su color al llegar el trazo. */
export const Node: React.FC<{
  x: number;
  y: number;
  at: number;
  size: number;
  color?: string;
  children: React.ReactNode;
}> = ({ x, y, at, size, color = colors.orange, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 190 } });
  const lit = frame >= at;
  const pulse = lit ? interpolate(frame - at, [0, 6, 20], [0, 1, 0.35], clamp) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: lit ? "none" : `4px solid rgba(255,255,255,0.18)`,
        boxShadow: lit ? `0 0 0 6px ${color}, 0 0 ${40 * pulse}px ${12 * pulse}px ${color}` : undefined,
        backgroundColor: lit ? undefined : "rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ scale: lit ? interpolate(on, [0, 1], [0.3, 1]) : 0, opacity: lit ? 1 : 0 }}>{children}</div>
    </div>
  );
};

/** Palabras que entran con desenfoque, cada una en su tiempo (fotogramas relativos). */
export const TimedWords: React.FC<{
  words: { t: number; text: string; color?: string }[];
  style?: React.CSSProperties;
  gap?: string;
}> = ({ words, style, gap = "0.25em" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gap, ...style }}>
      {words.map((w, i) => {
        const f = frame - w.t;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: w.color,
              opacity: interpolate(f, [0, 5], [0, 1], clamp),
              filter: `blur(${interpolate(f, [0, 6], [14, 0], clamp)}px)`,
              scale: interpolate(f, [0, 8], [1.25, 1], { ...clamp, easing: easeOut }),
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** Entrada y salida de cada escena: acercamiento con desenfoque (como un movimiento de cámara rápido). */
export const ZoomScene: React.FC<{ children: React.ReactNode; edge: number; first?: boolean; last?: boolean }> = ({
  children,
  edge,
  first,
  last,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = first ? 1 : interpolate(frame, [0, edge], [0, 1], { ...clamp, easing: easeOut });
  const outP = last ? 0 : interpolate(frame, [durationInFrames - edge, durationInFrames], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        scale: interpolate(inP, [0, 1], [0.86, 1]) * interpolate(outP, [0, 1], [1, 1.22]),
        filter: `blur(${(1 - inP) * 16 + outP * 18}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Efecto glitch con separación de color para una palabra. */
export const Glitch: React.FC<{ at: number; children: string; style: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const on = t >= 0 && t < 10;
  const j = on ? (random(`g${frame}`) - 0.5) * 22 : 0;
  const show = t >= 0;
  return (
    <div style={{ position: "relative", opacity: show ? 1 : 0, ...style }}>
      {on ? (
        <>
          <span style={{ position: "absolute", left: j, top: 0, color: "#00e5ff", mixBlendMode: "screen", opacity: 0.8 }}>{children}</span>
          <span style={{ position: "absolute", left: -j, top: 0, color: "#ff2d55", mixBlendMode: "screen", opacity: 0.8 }}>{children}</span>
        </>
      ) : null}
      <span style={{ position: "relative", clipPath: on ? `inset(${random(`c${frame}`) * 40}% 0 ${random(`d${frame}`) * 40}% 0)` : undefined }}>
        {children}
      </span>
      {on ? <span style={{ position: "absolute", left: 0, top: 0, translate: `${j * 1.5}px 0px`, clipPath: "inset(45% 0 35% 0)" }}>{children}</span> : null}
    </div>
  );
};

export const H = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: display,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: -1,
  color: colors.text,
  textAlign: "center",
  ...extra,
});
