import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { colors } from "../brand";
import { TearWipe } from "./fx";
import {
  Autoservicio,
  Ciudad,
  Contacto,
  FPS,
  MiFerreteria,
  Recorrido,
  Rubros,
  Solucion,
} from "./scenes";

// Cada escena arranca cuando la voz empieza su frase (tiempos de la transcripción).
// Los cortes quedan tapados por una hoja de papel rasgado que cruza la pantalla.
const at = (sec: number) => Math.round(sec * FPS);
const WIPE = 16;

export const H30_REEL_DURATION = at(48);

export const H30Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.ink }}>
    <Sequence name="Está en tu ciudad" from={0} durationInFrames={at(2.0)}>
      <Ciudad />
    </Sequence>
    <Sequence name="Mi ferretería" from={at(2.0)} durationInFrames={at(6.5) - at(2.0)}>
      <MiFerreteria />
    </Sequence>
    <Sequence name="Autoservicio" from={at(6.5)} durationInFrames={at(12.5) - at(6.5)}>
      <Autoservicio />
    </Sequence>
    <Sequence name="Recorrido" from={at(12.5)} durationInFrames={at(17.9) - at(12.5)}>
      <Recorrido />
    </Sequence>
    <Sequence name="Rubros" from={at(17.9)} durationInFrames={at(28.9) - at(17.9)}>
      <Rubros />
    </Sequence>
    <Sequence name="Solución" from={at(28.9)} durationInFrames={at(32.2) - at(28.9)}>
      <Solucion />
    </Sequence>
    <Sequence name="Contacto" from={at(32.2)} durationInFrames={H30_REEL_DURATION - at(32.2)}>
      <Contacto />
    </Sequence>

    <Sequence name="Corte papel naranja" from={at(6.5) - WIPE / 2} durationInFrames={WIPE}>
      <TearWipe kind="naranja" />
    </Sequence>
    <Sequence name="Corte lateral" from={at(12.5) - WIPE / 2} durationInFrames={WIPE}>
      <TearWipe kind="concreto" dir="left" />
    </Sequence>
    <Sequence name="Corte papel" from={at(17.9) - WIPE / 2} durationInFrames={WIPE}>
      <TearWipe kind="papel" />
    </Sequence>
    <Sequence name="Corte concreto" from={at(28.9) - WIPE / 2} durationInFrames={WIPE}>
      <TearWipe kind="concreto" />
    </Sequence>
    <Sequence name="Corte naranja final" from={at(32.2) - WIPE / 2} durationInFrames={WIPE}>
      <TearWipe kind="naranja" />
    </Sequence>

    <Audio src={staticFile("voz/voz-franquiciado.mp3")} volume={0.75} />
    {/* Música original (scripts/musica.py): baja mientras habla la voz y sube al terminar. */}
    <Audio
      src={staticFile("musica/fondo.mp3")}
      volume={(f) =>
        interpolate(f, [0, 4, at(45.6), at(46.2)], [0.38, 0.105, 0.105, 0.34], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />

    {/* Efectos (Pixabay, uso libre): golpes en los sellos, whoosh en los cortes, pop en los rubros. */}
    <Sequence name="Golpe logo" from={at(0.18)} layout="none">
      <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.25} />
    </Sequence>
    <Sequence name="Golpe autoservicio" from={at(8.28)} layout="none">
      <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.19} />
    </Sequence>
    <Sequence name="Golpe solución" from={at(31.58)} layout="none">
      <Audio src={staticFile("sfx/impact-bass-1.mp3")} volume={0.22} />
    </Sequence>
    {[6.5, 12.5, 17.9, 28.9, 32.2].map((t) => (
      <Sequence key={t} name="Whoosh corte" from={at(t) - WIPE / 2} layout="none">
        <Audio src={staticFile("sfx/whoosh-short.mp3")} volume={0.22} />
      </Sequence>
    ))}
    {[19.76, 20.6, 21.44, 22.22, 23.2, 24.18, 25.02, 26.1, 27.1].map((t) => (
      <Sequence key={t} name="Pop rubro" from={at(t)} layout="none">
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.14} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
