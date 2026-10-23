import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Tipografía "de producto" (estilo Apple/Opal). Archivos locales para que el render no dependa de la red.
export const ui = "Inter";
for (const weight of ["400", "500", "600", "700", "800"]) {
  loadFont({ family: ui, url: staticFile(`fonts/Inter-${weight}.woff2`), weight });
}

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Curvas de movimiento: salida rápida y suave (la más usada en motion de producto). */
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Movimiento de cámara lento al principio y al final. */
  camera: Easing.bezier(0.45, 0, 0.15, 1),
};

/** Paleta neutra "dark premium" (sobrescribible por proyecto). */
export const tone = {
  bg: "#050506",
  surface: "rgba(255,255,255,0.06)",
  stroke: "rgba(255,255,255,0.16)",
  text: "#F5F5F7",
  muted: "#8E8E93",
  dim: "#3A3A3C",
  good: "#3BA0FF",
  hot: "#FF8A3D",
  danger: "#FF3B30",
};

export const sec = (s: number, fps = 30) => Math.round(s * fps);
