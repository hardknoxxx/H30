import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, ease, tone, ui } from "./theme";

/* Estilo "keynote / agencia" (como Waves Studio): degradados vivos, una palabra por golpe,
 * cursor que escribe, mockups de dispositivos. */

/** Degradado animado con manchas de color que se desplazan lentamente. */
export const GradientBg: React.FC<{ colors?: [string, string, string]; light?: boolean }> = ({
  colors = ["#0a6cff", "#5ec8ff", "#e9f6ff"],
  light = false,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: light ? "#f4f6f9" : colors[0], overflow: "hidden" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "90%",
            height: "90%",
            left: `${10 + 30 * Math.sin(t * 0.35 + i * 2.1)}%`,
            top: `${5 + 25 * Math.cos(t * 0.3 + i * 1.7)}%`,
            translate: "-30% -20%",
            borderRadius: "50%",
            background: colors[i],
            filter: "blur(140px)",
            opacity: light ? 0.35 : 0.9,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * Palabras que se reemplazan una a una en el mismo lugar (con desenfoque entre ellas).
 * `words` es una lista de [fotograma, texto].
 */
export const WordSwap: React.FC<{
  words: [number, string][];
  style?: React.CSSProperties;
  out?: number;
}> = ({ words, style, out = 6 }) => {
  const frame = useCurrentFrame();
  let idx = -1;
  for (let i = 0; i < words.length; i++) if (frame >= words[i][0]) idx = i;
  if (idx < 0) return null;
  const [start, text] = words[idx];
  const next = words[idx + 1]?.[0] ?? Infinity;
  const pIn = interpolate(frame - start, [0, 7], [0, 1], { ...clamp, easing: ease.out });
  const pOut = Number.isFinite(next) ? interpolate(frame, [next - out, next], [0, 1], clamp) : 0;
  return (
    <div
      style={{
        fontFamily: ui,
        fontWeight: 600,
        letterSpacing: -1.5,
        opacity: pIn * (1 - pOut),
        filter: `blur(${(1 - pIn) * 18 + pOut * 18}px)`,
        scale: interpolate(pIn, [0, 1], [1.12, 1]) * interpolate(pOut, [0, 1], [1, 0.94]),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Texto que se escribe letra por letra con cursor parpadeante. */
export const TypeOn: React.FC<{ at: number; text: string; cps?: number; style?: React.CSSProperties; caret?: string }> = ({
  at,
  text,
  cps = 18,
  style,
  caret = tone.text,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - at) / 30) * cps)));
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{ fontFamily: ui, whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: "0.08em", height: "1em", background: caret, marginLeft: 4, verticalAlign: "-0.12em", opacity: blink || n < text.length ? 1 : 0 }} />
    </span>
  );
};

/** Puntero de mouse que viaja entre dos puntos y hace clic. */
export const Pointer: React.FC<{ from: [number, number]; to: [number, number]; at: number; dur?: number; clickAt?: number }> = ({
  from,
  to,
  at,
  dur = 18,
  clickAt,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: ease.inOut });
  const click = clickAt === undefined ? 1 : interpolate(frame - clickAt, [0, 3, 8], [1, 0.82, 1], clamp);
  return (
    <svg
      width={44}
      height={56}
      viewBox="0 0 22 28"
      style={{
        position: "absolute",
        left: from[0] + (to[0] - from[0]) * p,
        top: from[1] + (to[1] - from[1]) * p,
        scale: click,
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
        opacity: frame < at ? 0 : 1,
      }}
    >
      <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z" fill="#fff" stroke="#111" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
};

/** Celular simple en CSS: marco, isla y pantalla con el contenido que le pases. */
export const Phone: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, children, style }) => {
  const h = width * 2.05;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.16,
        padding: width * 0.035,
        background: "linear-gradient(145deg, #3a3a3e, #0d0d0f)",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12), 0 40px 80px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: width * 0.13, overflow: "hidden", background: "#000" }}>
        {children}
        <div style={{ position: "absolute", top: width * 0.035, left: "50%", translate: "-50% 0", width: width * 0.3, height: width * 0.085, borderRadius: 999, background: "#000" }} />
      </div>
    </div>
  );
};

/** Laptop simple en CSS. */
export const Laptop: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, children, style }) => {
  const h = width * 0.62;
  return (
    <div style={{ width, ...style }}>
      <div style={{ height: h, borderRadius: width * 0.025, padding: width * 0.018, background: "#111", boxShadow: "inset 0 0 0 2px #2a2a2e, 0 30px 80px rgba(0,0,0,0.35)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: width * 0.01, overflow: "hidden", position: "relative", background: "#000" }}>{children}</div>
      </div>
      <div style={{ height: width * 0.03, margin: `0 -${width * 0.06}px`, borderRadius: `0 0 ${width * 0.03}px ${width * 0.03}px`, background: "linear-gradient(180deg, #d8d8dc, #9a9aa0)" }} />
    </div>
  );
};
