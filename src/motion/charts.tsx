import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { clamp, ease, tone, ui } from "./theme";

/**
 * Tarjeta de uso diario con barras por hora (pensada para verse inclinada dentro de <Camera>).
 * Las barras crecen escalonadas; cada barra puede tener dos tramos de color (p. ej. azul + naranja).
 */
export const HourlyCard: React.FC<{
  at: number;
  date: string;
  total: React.ReactNode;
  bars?: number;
  width?: number;
  height?: number;
  seed?: string;
  colors?: [string, string];
}> = ({ at, date, total, bars = 36, width = 1300, height = 560, seed = "h", colors = [tone.good, tone.hot] }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 48,
        padding: "48px 56px",
        background: "linear-gradient(180deg, #151517 0%, #0b0b0d 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 60px 120px rgba(0,0,0,0.8)",
        fontFamily: ui,
        color: tone.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 30, color: tone.muted, fontWeight: 500 }}>{date}</div>
      <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2, marginTop: 6 }}>{total}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, marginTop: 30 }}>
        {Array.from({ length: bars }, (_, i) => {
          const r = random(`${seed}${i}`);
          const day = Math.sin((i / bars) * Math.PI) ** 1.4;
          const h = (0.12 + 0.88 * day * (0.45 + 0.55 * r)) * 100;
          const split = 0.35 + random(`${seed}s${i}`) * 0.5;
          const g = interpolate(frame - at - i * 0.9, [0, 16], [0, 1], { ...clamp, easing: ease.out });
          return (
            <div key={i} style={{ flex: 1, height: `${h * g}%`, display: "flex", flexDirection: "column", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ flex: 1 - split, background: colors[1], boxShadow: `0 0 18px ${colors[1]}` }} />
              <div style={{ flex: split, background: colors[0], boxShadow: `0 0 18px ${colors[0]}` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Semana de barras grises con línea de promedio punteada; la barra `hot` sube con brillo
 * y cambia de color al pasar el promedio (el "exceso").
 */
export const WeekChart: React.FC<{
  at: number;
  values: number[];
  labels: string[];
  hot: number;
  avg: number;
  heatAt?: number;
  width?: number;
  height?: number;
}> = ({ at, values, labels, hot, avg, heatAt, width = 1100, height = 560 }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...values, avg) * 1.08;
  const heat = heatAt === undefined ? 0 : interpolate(frame - heatAt, [0, 10], [0, 1], { ...clamp, easing: ease.out });
  const lineP = interpolate(frame - at, [4, 22], [0, 1], { ...clamp, easing: ease.out });
  return (
    <div style={{ position: "relative", width, height: height + 60, fontFamily: ui }}>
      <div style={{ position: "absolute", inset: `0 0 60px 0`, display: "flex", alignItems: "flex-end", gap: 34 }}>
        {values.map((v, i) => {
          const isHot = i === hot;
          const g = interpolate(frame - at - (isHot ? 10 : i * 1.5), [0, isHot ? 22 : 14], [0, 1], { ...clamp, easing: ease.out });
          const color = isHot ? (heat > 0 ? `linear-gradient(0deg, ${tone.good} 0%, ${tone.good} ${(1 - heat) * 100}%, ${tone.hot} ${(1 - heat) * 100 + 0.01}%, #ffd27a 100%)` : tone.good) : "#2c2c30";
          return (
            <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
              <div
                style={{
                  width: "100%",
                  height: `${(v / max) * 100 * g}%`,
                  borderRadius: 14,
                  background: color,
                  boxShadow: isHot ? `0 0 ${40 + heat * 60}px ${heat > 0 ? tone.hot : tone.good}` : "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 60 + (avg / max) * height,
          width: width * lineP,
          borderTop: "3px dashed rgba(255,255,255,0.45)",
        }}
      />
      <div style={{ position: "absolute", right: -70, bottom: 60 + (avg / max) * height - 18, fontSize: 26, color: tone.muted, opacity: lineP }}>prom.</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", gap: 34 }}>
        {labels.map((l, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 30, fontWeight: 600, color: i === hot ? tone.text : tone.muted }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};
