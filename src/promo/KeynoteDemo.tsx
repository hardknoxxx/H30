import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BlurIn, GradientBg, Laptop, Phone, Pointer, Sfx, SoftScene, TypeOn, WordSwap, sec, ui } from "../motion";
import { Orbit3D } from "../motion/three";

/* Demo del estilo "keynote / agencia" (referencia: Waves Studio): degradado vivo, una palabra
 * por golpe, cursor que escribe una URL, objeto 3D con órbitas y mockups. 1920×1080, 10 s. */

export const KEYNOTE_DURATION = sec(10);

const words: [number, string][] = [
  [sec(0.2), "Hoy"],
  [sec(0.7), "las ideas"],
  [sec(1.25), "necesitan"],
  [sec(1.8), "moverse."],
];

export const KeynoteDemo: React.FC = () => (
  <AbsoluteFill>
    <Sequence name="Palabras" durationInFrames={sec(2.6)}>
      <SoftScene enter={false}>
        <GradientBg />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <WordSwap words={words} style={{ fontSize: 150, color: "#fff" }} />
        </AbsoluteFill>
      </SoftScene>
    </Sequence>
    <Sequence name="URL" from={sec(2.4)} durationInFrames={sec(2.8)}>
      <SoftScene>
        <GradientBg colors={["#e8eef6", "#ffffff", "#cfe3ff"]} light />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Laptop width={1100}>
            <GradientBg />
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <div style={{ padding: "26px 44px", borderRadius: 999, background: "rgba(255,255,255,0.22)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.4)" }}>
                <TypeOn at={8} text="https://tumarca.com" style={{ fontSize: 58, fontWeight: 600, color: "#fff" }} caret="#fff" />
              </div>
            </AbsoluteFill>
          </Laptop>
          <Pointer from={[1500, 900]} to={[1080, 560]} at={40} dur={20} clickAt={62} />
        </AbsoluteFill>
      </SoftScene>
    </Sequence>
    <Sequence name="3D" from={sec(5.0)} durationInFrames={sec(2.7)}>
      <SoftScene>
        <GradientBg />
        <Orbit3D at={4} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120 }}>
          <BlurIn at={20}>
            <div style={{ fontFamily: ui, fontSize: 70, fontWeight: 600, color: "#fff" }}>Entregamos producto.</div>
          </BlurIn>
        </AbsoluteFill>
      </SoftScene>
    </Sequence>
    <Sequence name="Cierre" from={sec(7.5)} durationInFrames={sec(2.5)}>
      <SoftScene exit={false}>
        <GradientBg />
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 90 }}>
          <BlurIn at={4} from={0.85} y={60}>
            <Phone width={300}>
              <GradientBg colors={["#ff6a3d", "#ffb36b", "#ffe2c7"]} />
            </Phone>
          </BlurIn>
          <BlurIn at={12} from={1.2} blur={30}>
            <div style={{ fontFamily: ui, fontSize: 110, fontWeight: 700, color: "#fff", letterSpacing: -3 }}>Hacemos olas.</div>
          </BlurIn>
        </AbsoluteFill>
      </SoftScene>
    </Sequence>
    {[0.2, 0.7, 1.25, 1.8].map((t) => (
      <Sfx key={t} t={t} name="tick" volume={0.25} />
    ))}
    <Sfx t={2.35} name="swipe" volume={0.2} />
    <Sfx t={2.7} name="key" volume={0.15} />
    <Sfx t={4.47} name="click" volume={0.3} />
    <Sfx t={4.95} name="whoosh" volume={0.22} />
    <Sfx t={7.45} name="swipe" volume={0.2} />
    <Sfx t={7.9} name="impact" volume={0.25} />
  </AbsoluteFill>
);
