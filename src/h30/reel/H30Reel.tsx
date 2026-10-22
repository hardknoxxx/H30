import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Backdrop } from "../ui";
import {
  Autoservicio,
  Cadena,
  Contacto,
  FPS,
  Gondolas,
  Rubros,
  Saludo,
  SceneShell,
  Solucion,
} from "./scenes";

// Cada escena arranca cuando la voz empieza su frase (tiempos de la transcripción).
// Las escenas se solapan unos fotogramas para que la salida de una y la entrada de la otra se crucen.
const OVERLAP = 8;
const at = (sec: number) => Math.round(sec * FPS);

export const H30_REEL_DURATION = at(54);

export const H30Reel: React.FC = () => (
  <AbsoluteFill>
    <Backdrop glowY="50%" />
    <Sequence name="Saludo" from={at(0)} durationInFrames={at(7.4) + OVERLAP}>
      <SceneShell exit="up">
        <Saludo />
      </SceneShell>
    </Sequence>
    <Sequence name="Cadena" from={at(7.4)} durationInFrames={at(12.3) - at(7.4) + OVERLAP}>
      <SceneShell exit="left">
        <Cadena />
      </SceneShell>
    </Sequence>
    <Sequence name="Autoservicio" from={at(12.3)} durationInFrames={at(18.3) - at(12.3) + OVERLAP}>
      <SceneShell exit="up">
        <Autoservicio />
      </SceneShell>
    </Sequence>
    <Sequence name="Góndolas" from={at(18.3)} durationInFrames={at(23.4) - at(18.3) + OVERLAP}>
      <SceneShell exit="zoom">
        <Gondolas />
      </SceneShell>
    </Sequence>
    <Sequence name="Rubros" from={at(23.4)} durationInFrames={at(35.0) - at(23.4) + OVERLAP}>
      <SceneShell exit="up">
        <Rubros />
      </SceneShell>
    </Sequence>
    <Sequence name="Solución" from={at(35.0)} durationInFrames={at(38.4) - at(35.0) + OVERLAP}>
      <SceneShell exit="zoom">
        <Solucion />
      </SceneShell>
    </Sequence>
    <Sequence name="Contacto" from={at(38.4)} durationInFrames={H30_REEL_DURATION - at(38.4)}>
      <SceneShell exit="none">
        <Contacto />
      </SceneShell>
    </Sequence>
    <Audio src={staticFile("voz/voz-franquiciado.mp3")} />
  </AbsoluteFill>
);
