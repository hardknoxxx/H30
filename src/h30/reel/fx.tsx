import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { body, clamp, colors, display, easeInOut, easeOut } from "../brand";

/* ---------- Texturas ---------- */

export const Texture: React.FC<{
  name: "concreto" | "papel" | "madera" | "manual-gris" | "manual-negro" | "manual-blanco" | "manual-naranja" | "manual-revoque";
  shade?: number;
  drift?: boolean;
}> = ({ name, shade = 0.35, drift = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(`texturas/${name}.jpg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: drift ? 1.06 + frame * 0.0006 : 1,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,${shade}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Malla de metal desplegado sobre un color. */
export const Mesh: React.FC<{ color?: string; opacity?: number }> = ({
  color = "#1d1d1d",
  opacity = 0.9,
}) => {
  const frame = useCurrentFrame();
  const tile = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="40" viewBox="0 0 72 40"><path d="M0 20 L18 2 L36 20 L54 2 L72 20 M0 20 L18 38 L36 20 L54 38 L72 20" fill="none" stroke="${color}" stroke-width="6" stroke-linejoin="round"/><path d="M0 18 L18 0 L36 18 L54 0 L72 18" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/></svg>`,
  );
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,${tile}")`,
        backgroundSize: "72px 40px",
        backgroundPosition: `0px ${frame * 0.6}px`,
      }}
    />
  );
};

/* ---------- Sacudida de cámara ---------- */

/** Desplazamiento que decae después de cada golpe (frames de impacto). */
export const shakeAt = (frame: number, hits: number[], power = 18) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const t = frame - h;
    if (t < 0 || t > 14) continue;
    const decay = Math.exp(-t / 3.5) * power;
    x += Math.sin(t * 2.7 + h) * decay;
    y += Math.cos(t * 3.1 + h) * decay;
  }
  return `${x.toFixed(2)}px ${y.toFixed(2)}px`;
};

export const Shake: React.FC<{ hits: number[]; power?: number; children: React.ReactNode }> = ({
  hits,
  power,
  children,
}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ translate: shakeAt(frame, hits, power) }}>{children}</AbsoluteFill>;
};

/* ---------- Papel rasgado ---------- */

/** clip-path con bordes rasgados (semilla fija para que no tiemble entre fotogramas). */
export const tornClip = (seed: string, jag = 2.2, steps = 22) => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    top.push(`${x}% ${random(`${seed}t${i}`) * jag}%`);
    bottom.push(`${100 - x}% ${100 - random(`${seed}b${i}`) * jag}%`);
  }
  return `polygon(${[...top, ...bottom].join(",")})`;
};

export const Paper: React.FC<{
  children: React.ReactNode;
  seed: string;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
  pad?: string;
  jag?: number;
}> = ({ children, seed, color, rotate = 0, style, pad = "26px 44px", jag = 6 }) => (
  <div style={{ filter: "drop-shadow(8px 12px 0 rgba(0,0,0,0.35))", rotate: `${rotate}deg`, ...style }}>
    <div
      style={{
        position: "relative",
        padding: pad,
        clipPath: tornClip(seed, jag),
        backgroundColor: color ?? "#f3f1ec",
        backgroundImage: color ? undefined : `url(${staticFile("texturas/papel.jpg")})`,
        backgroundSize: "cover",
      }}
    >
      {children}
    </div>
  </div>
);

/** Cinta de enmascarar semitransparente. */
export const MaskingTape: React.FC<{ style?: React.CSSProperties; rotate?: number; width?: number }> = ({
  style,
  rotate = -8,
  width = 170,
}) => (
  <div
    style={{
      position: "absolute",
      width,
      height: 46,
      backgroundColor: "rgba(232, 214, 170, 0.82)",
      rotate: `${rotate}deg`,
      clipPath: tornClip(`tape${rotate}${width}`, 10, 6),
      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
      ...style,
    }}
  />
);

/* ---------- Golpe tipo sello ---------- */

export const Stamp: React.FC<{
  at: number;
  children: React.ReactNode;
  from?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ at, children, from = 2.4, rotate = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 220, mass: 0.8 } });
  return (
    <div
      style={{
        scale: interpolate(p, [0, 1], [from, 1]),
        opacity: interpolate(frame - at, [0, 3], [0, 1], clamp),
        rotate: `${rotate + interpolate(p, [0, 1], [rotate > 0 ? 8 : -8, 0])}deg`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Entra deslizando con rebote desde un lado. */
export const SlideIn: React.FC<{
  at: number;
  from: "left" | "right" | "bottom" | "top";
  children: React.ReactNode;
  distance?: number;
  style?: React.CSSProperties;
}> = ({ at, from, children, distance = 900, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 160 } });
  const d = interpolate(p, [0, 1], [distance, 0]);
  const t = { left: `${-d}px 0px`, right: `${d}px 0px`, bottom: `0px ${d}px`, top: `0px ${-d}px` }[from];
  return (
    <div style={{ translate: t, opacity: frame < at ? 0 : 1, ...style }}>
      {children}
    </div>
  );
};

/* ---------- Garabatos dibujados a mano ---------- */

export const Doodle: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  viewBox: string;
  style?: React.CSSProperties;
  w: number;
  h: number;
}> = ({ d, at, dur = 12, color = colors.electricidad, width = 9, viewBox, style, w, h }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, dur], [0, 1], { ...clamp, easing: easeOut });
  return (
    <svg width={w} height={h} viewBox={viewBox} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        opacity={frame < at ? 0 : 1}
      />
    </svg>
  );
};

export const DOODLES = {
  circle: "M20 60 C 10 20, 120 0, 180 25 C 240 50, 220 110, 120 115 C 40 118, 0 90, 30 40 C 50 15, 110 10, 150 18",
  arrow: "M10 90 C 60 80, 110 60, 150 15 M150 15 L118 22 M150 15 L146 48",
  arrowDown: "M60 10 C 80 50, 40 90, 70 140 M70 140 L45 118 M70 140 L88 112",
  underline: "M5 20 C 60 8, 140 30, 200 14 C 240 4, 280 20, 300 12",
  sparkle: "M50 0 L50 30 M50 70 L50 100 M0 50 L30 50 M70 50 L100 50 M18 18 L32 32 M68 68 L82 82 M82 18 L68 32 M32 68 L18 82",
  scribble: "M0 40 L40 10 L60 50 L100 12 L120 52 L160 14 L180 54 L220 16 L240 56 L280 18 L300 50",
  question: "M20 35 C 20 5, 70 0, 72 30 C 74 55, 45 55, 45 80 M45 105 L45 108",
  burst: "M60 5 L60 30 M60 90 L60 115 M5 60 L30 60 M90 60 L115 60 M20 20 L38 38 M82 82 L100 100 M100 20 L82 38 M38 82 L20 100",
};

/* ---------- Personajes del Squad ---------- */

export const Squad: React.FC<{
  name: "buloneria" | "herramientas" | "plomeria" | "electricidad" | "seguridad";
  at: number;
  height: number;
  from?: "bottom" | "left" | "right";
  wave?: boolean;
  style?: React.CSSProperties;
  flip?: boolean;
}> = ({ name, at, height, from = "bottom", wave = true, style, flip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 140 } });
  const d = interpolate(p, [0, 1], [height * 1.4, 0]);
  const move = { bottom: `0px ${d}px`, left: `${-d}px 0px`, right: `${d}px 0px` }[from];
  const t = frame - at;
  const wobble = wave && t > 10 ? Math.sin(t / 4.5) * 6 : 0;
  const hop = wave && t > 10 ? Math.abs(Math.sin(t / 6)) * -14 : 0;
  return (
    <div
      style={{
        position: "absolute",
        translate: move,
        opacity: frame < at ? 0 : 1,
        filter: "drop-shadow(6px 10px 0 rgba(0,0,0,0.3))",
        ...style,
      }}
    >
      <Img
        src={staticFile(`squad/${name}.png`)}
        style={{
          height,
          rotate: `${wobble}deg`,
          translate: `0px ${hop}px`,
          scale: flip ? "-1 1" : undefined,
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
};

/* ---------- Fotos reales ---------- */

/** Ráfaga: cambia de foto cada `every` fotogramas, con zoom y un destello en cada corte. */
export const PhotoBurst: React.FC<{ photos: number[]; every: number; dim?: number }> = ({
  photos,
  every,
  dim = 0.25,
}) => {
  const frame = useCurrentFrame();
  const i = Math.floor(frame / every);
  const local = frame - i * every;
  const photo = photos[i % photos.length];
  const flash = interpolate(local, [0, 2], [0.55, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: colors.ink }}>
      <Img
        src={staticFile(`fotos/local-${photo}.jpg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(local, [0, every], [1.18, 1.06]),
          rotate: `${(random(`r${i}`) - 0.5) * 3}deg`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(20,20,20,${dim})` }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
    </AbsoluteFill>
  );
};

/** Foto con marco blanco tipo polaroid y cinta. */
export const Polaroid: React.FC<{
  photo: number;
  at: number;
  rotate: number;
  width: number;
  style?: React.CSSProperties;
}> = ({ photo, at, rotate, width, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 150 } });
  return (
    <div
      style={{
        position: "absolute",
        width,
        padding: "14px 14px 50px",
        backgroundColor: "#fbfaf7",
        boxShadow: "10px 14px 0 rgba(0,0,0,0.25)",
        rotate: `${rotate + interpolate(p, [0, 1], [rotate * 2, 0])}deg`,
        scale: interpolate(p, [0, 1], [1.8, 1]),
        opacity: interpolate(frame - at, [0, 3], [0, 1], clamp),
        ...style,
      }}
    >
      <Img
        src={staticFile(`fotos/local-${photo}.jpg`)}
        style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }}
      />
      <MaskingTape style={{ top: -22, left: width / 2 - 85 }} rotate={rotate > 0 ? -6 : 6} />
    </div>
  );
};

/* ---------- Transición de papel rasgado ---------- */

/** Una hoja (textura o color) cruza la pantalla de abajo hacia arriba y tapa el corte en su mitad. */
export const TearWipe: React.FC<{
  kind: "naranja" | "papel" | "concreto";
  dir?: "up" | "left";
}> = ({ kind, dir = "up" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: easeInOut });
  const isUp = dir === "up";
  const size = isUp ? height : width;
  const pos = interpolate(p, [0, 1], [size, -size * 2.2]);
  const bg =
    kind === "naranja"
      ? { backgroundColor: colors.orange }
      : {
          backgroundImage: `url(${staticFile(`texturas/${kind === "papel" ? "papel" : "concreto"}.jpg`)})`,
          backgroundSize: "cover",
        };
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: isUp ? -40 : undefined,
          top: isUp ? undefined : -40,
          width: isUp ? width + 80 : size * 2.2,
          height: isUp ? size * 2.2 : height + 80,
          translate: isUp ? `0px ${pos}px` : `${pos}px 0px`,
          rotate: isUp ? "-4deg" : "3deg",
          clipPath: isUp ? tornClip(`wipe${kind}`, 2.5, 26) : undefined,
          filter: "drop-shadow(0 -14px 0 rgba(0,0,0,0.25))",
          ...bg,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Tipografía ---------- */

export const titleStyle: React.CSSProperties = {
  fontFamily: display,
  fontWeight: 900,
  lineHeight: 1.0,
  letterSpacing: -1,
  textAlign: "center",
};

export const labelStyle: React.CSSProperties = {
  fontFamily: body,
  fontWeight: 900,
  fontStyle: "italic",
  textTransform: "uppercase",
  letterSpacing: 1,
};

export const fadeUp = (frame: number, at: number) => ({
  opacity: interpolate(frame - at, [0, 6], [0, 1], clamp),
  translate: `0px ${interpolate(frame - at, [0, 10], [40, 0], { ...clamp, easing: easeOut })}px`,
});
