import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { sec } from "./theme";

/**
 * Mapa de efectos de sonido por tipo de evento visual (archivos en public/sfx, Pixabay, uso libre).
 * Regla: un sonido por evento importante, nunca dos en el mismo fotograma, volumen bajo (0.1–0.35).
 */
export const SFX = {
  /** Golpe grave: aparición del logo, drop de la música, titular que cae. */
  impact: "impact-bass-1",
  /** Barrido corto: cortes, desplazamientos rápidos de cámara. */
  whoosh: "whoosh",
  swipe: "whoosh-short",
  /** Subida larga hacia un clímax (el pico está al final del archivo). */
  build: "whoosh-cinematic",
  /** Aparición de un widget, píldora o chip. */
  pop: "pop",
  /** Punto de dato que se ilumina, número clave. */
  ping: "ping",
  /** Toques de interfaz: botón, selección, cada nodo. */
  click: "click",
  tick: "click-soft",
  key: "key-press",
  /** Brillo mágico: punto de luz, revelado del logo. */
  sparkle: "sparkle",
  chime: "chime",
  /** Cortes digitales: transformación, disolución en píxeles. */
  glitch: "glitch-1",
  glitchSoft: "glitch-3",
} as const;

export type SfxName = keyof typeof SFX;

/** Coloca un efecto en el segundo `t` de la composición. */
export const Sfx: React.FC<{ t: number; name: SfxName; volume?: number }> = ({ t, name, volume = 0.25 }) => (
  <Sequence name={`sfx ${name}`} from={Math.max(0, sec(t))} layout="none">
    <Audio src={staticFile(`sfx/${SFX[name]}.mp3`)} volume={volume} />
  </Sequence>
);
