import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { colors } from "../brand";
import { Texture } from "./fx";
import {
  Autoservicio,
  Cierre,
  Contacto,
  FPS,
  Gondolas,
  Hook,
  LEAD,
  Rubros,
  Solucion,
  Sweep,
} from "./scenes";
import { ZoomScene } from "./glow";

// Cada escena arranca cuando la voz empieza su frase (tiempos de la transcripción).
// Las escenas se solapan 2×LEAD fotogramas: la saliente se acerca y desenfoca mientras entra la siguiente,
// y un barrido de luz cruza la pantalla en cada corte.
const at = (sec: number) => Math.round(sec * FPS);
const CUTS = [2.0, 8.1, 13.4, 24.7, 28.2, 38.9];

export const H30_REEL_DURATION = at(42);

const span = (start: number, end: number) => ({
  from: start === 0 ? 0 : at(start) - LEAD,
  durationInFrames: at(end) - at(start) + (start === 0 ? LEAD : 2 * LEAD),
});

/** Un efecto de sonido que arranca en el segundo indicado. */
const Sfx: React.FC<{ t: number; src: string; volume: number }> = ({ t, src, volume }) => (
  <Sequence name={`Sfx ${src}`} from={Math.max(0, at(t))} layout="none">
    <Audio src={staticFile(`sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

export const H30Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.ink }}>
    <Texture name="manual-gris" shade={0.55} />
    <AbsoluteFill style={{ backgroundColor: "rgba(10,10,10,0.35)" }} />

    <Sequence name="Está en tu ciudad" {...span(0, 2.0)}>
      <ZoomScene edge={2 * LEAD} first>
        <Hook />
      </ZoomScene>
    </Sequence>
    <Sequence name="Autoservicio" {...span(2.0, 8.1)}>
      <ZoomScene edge={2 * LEAD}>
        <Autoservicio />
      </ZoomScene>
    </Sequence>
    <Sequence name="Góndolas" {...span(8.1, 13.4)}>
      <ZoomScene edge={2 * LEAD}>
        <Gondolas />
      </ZoomScene>
    </Sequence>
    <Sequence name="Rubros" {...span(13.4, 24.7)}>
      <ZoomScene edge={2 * LEAD}>
        <Rubros />
      </ZoomScene>
    </Sequence>
    <Sequence name="Solución" {...span(24.7, 28.2)}>
      <ZoomScene edge={2 * LEAD}>
        <Solucion />
      </ZoomScene>
    </Sequence>
    <Sequence name="Contacto" {...span(28.2, 38.9)}>
      <ZoomScene edge={2 * LEAD}>
        <Contacto />
      </ZoomScene>
    </Sequence>
    <Sequence name="Cierre" from={at(38.9) - LEAD} durationInFrames={H30_REEL_DURATION - at(38.9) + LEAD}>
      <ZoomScene edge={2 * LEAD} last>
        <Cierre />
      </ZoomScene>
    </Sequence>

    {CUTS.map((t) => (
      <Sequence key={t} name="Barrido de luz" from={at(t) - 5} durationInFrames={14}>
        <Sweep />
      </Sequence>
    ))}

    <Audio src={staticFile("voz/voz-franquiciado.mp3")} volume={0.75} />
    {/* "Minimal Techno 02" (Mixkit, licencia libre para redes): arranca en el drop y baja bajo la voz. */}
    <Audio
      src={staticFile("musica/minimal-techno-02.mp3")}
      volume={(f) =>
        interpolate(f, [0, 8, at(38.7), at(39.2)], [0.32, 0.15, 0.15, 0.42], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />

    {/* Efectos (Pixabay, uso libre) al estilo de la referencia: chispa, golpes, barridos y "pings" de interfaz. */}
    <Sfx t={0} src="sparkle" volume={0.3} />
    <Sfx t={0.18} src="impact-bass-1" volume={0.32} />
    {CUTS.map((t) => (
      <Sfx key={t} t={t - 0.17} src="whoosh" volume={0.22} />
    ))}
    <Sfx t={3.5} src="whoosh-short" volume={0.2} />
    <Sfx t={4.0} src="impact-bass-1" volume={0.18} />
    {[5.08, 6.06, 7.4].map((t) => (
      <Sfx key={t} t={t} src="ping" volume={0.16} />
    ))}
    <Sfx t={9.7} src="glitch-3" volume={0.14} />
    <Sfx t={10.12} src="pop" volume={0.2} />
    <Sfx t={11.1} src="pop" volume={0.16} />
    <Sfx t={14.6} src="impact-bass-1" volume={0.16} />
    {[15.36, 16.26, 17.14, 17.94, 18.94, 19.94, 20.9, 21.98, 22.8].map((t) => (
      <Sfx key={t} t={t} src="click-soft" volume={0.3} />
    ))}
    <Sfx t={23.95} src="sparkle" volume={0.22} />
    <Sfx t={25.66} src="glitch-1" volume={0.13} />
    <Sfx t={27.4} src="impact-bass-1" volume={0.32} />
    {[28.85, 31.68, 33.0].map((t) => (
      <Sfx key={t} t={t} src="whoosh-short" volume={0.14} />
    ))}
    {[33.86, 34.1, 34.42, 34.78, 35.52, 35.72, 36.02, 36.52, 36.8, 37.08].map((t) => (
      <Sfx key={t} t={t} src="key-press" volume={0.12} />
    ))}
    <Sfx t={37.7} src="pop" volume={0.24} />
    <Sfx t={33.4} src="whoosh-cinematic" volume={0.12} />
    <Sfx t={38.9} src="impact-bass-1" volume={0.3} />
    <Sfx t={39.0} src="chime" volume={0.22} />
    <Sfx t={40.95} src="whoosh-short" volume={0.2} />
  </AbsoluteFill>
);
