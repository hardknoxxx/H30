import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, colors, display } from "../brand";
import { H30Logo } from "../Logo";
import { Sticker, Tape } from "../ui";
import {
  DOODLES,
  Doodle,
  MaskingTape,
  Mesh,
  Paper,
  PhotoBurst,
  Polaroid,
  Shake,
  SlideIn,
  Squad,
  Stamp,
  Texture,
  fadeUp,
  labelStyle,
  titleStyle,
} from "./fx";
import { BagIcon, CartIcon, InstagramIcon, PayIcon, PinIcon, WhatsAppIcon } from "./icons";

/** Segundos de la voz (transcripción) -> fotograma relativo al inicio de la escena. */
export const FPS = 30;
const rel = (start: number, sec: number) => Math.round((sec - start) * FPS);

/* 1 · 0–2.0 s · "¡H30 está en tu ciudad!" */
const A = 0;
export const Ciudad: React.FC = () => {
  const frame = useCurrentFrame();
  const hits = [rel(A, 0.2), rel(A, 0.7), rel(A, 1.24)];
  return (
    <>
      <Texture name="concreto" />
      {frame < 6 ? <PhotoBurst photos={[7, 1, 8]} every={2} dim={0.1} /> : null}
      <Shake hits={hits} power={22}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
          <Stamp at={hits[0]} from={3}>
            <H30Logo size={400} delay={hits[0] - 8} />
          </Stamp>
          <Doodle d={DOODLES.sparkle} viewBox="0 0 100 100" w={130} h={130} at={hits[0] + 6} style={{ left: 150, top: 330 }} />
          <Doodle d={DOODLES.sparkle} viewBox="0 0 100 100" w={90} h={90} at={hits[0] + 9} color={colors.white} style={{ right: 170, top: 640 }} />
          <div style={{ marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Stamp at={hits[1]} rotate={-3}>
              <Paper seed="esta" pad="18px 50px 22px">
                <div style={{ ...titleStyle, fontSize: 96, color: colors.gray }}>ESTÁ EN</div>
              </Paper>
            </Stamp>
            <Stamp at={hits[2]} rotate={2} from={3}>
              <Paper seed="ciudad" color={colors.orange} pad="24px 50px 30px">
                <div style={{ ...titleStyle, fontSize: 118, color: colors.white }}>TU CIUDAD</div>
              </Paper>
            </Stamp>
          </div>
        </AbsoluteFill>
      </Shake>
    </>
  );
};

/* 2 · 2.0–6.5 s · "Soy franquiciado y esta es MI ferretería, acá en Puerto Iguazú" */
const B = 2.0;
export const MiFerreteria: React.FC = () => {
  const frame = useCurrentFrame();
  const hitMi = rel(B, 4.32);
  return (
    <>
      <PhotoBurst photos={[7, 1, 8, 3, 6, 2, 4, 5, 9]} every={8} dim={0.2} />
      <Shake hits={[hitMi]} power={16}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
          <SlideIn at={rel(B, 2.14)} from="left">
            <Paper seed="soy" pad="18px 40px 22px" rotate={-4}>
              <div style={{ ...labelStyle, fontSize: 58, color: colors.gray }}>Soy franquiciado</div>
            </Paper>
          </SlideIn>
          <div style={{ height: 260 }} />
          <div style={{ ...fadeUp(frame, rel(B, 3.5)), ...labelStyle, fontSize: 64, color: colors.white, textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}>
            y esta es
          </div>
          <Stamp at={hitMi} rotate={-3} from={3.2} style={{ marginTop: 18, position: "relative" }}>
            <Paper seed="mi" color={colors.orange} pad="22px 46px 34px">
              <div style={{ ...titleStyle, fontSize: 200, color: colors.white }}>MI</div>
              <div style={{ ...titleStyle, fontSize: 104, color: colors.white, marginTop: -6 }}>FERRETERÍA</div>
            </Paper>
            <Doodle d={DOODLES.underline} viewBox="0 0 300 30" w={520} h={52} at={hitMi + 8} color={colors.white} width={10} style={{ left: 120, bottom: -60 }} />
          </Stamp>
          <SlideIn at={rel(B, 5.74)} from="bottom" style={{ marginTop: 110 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "16px 40px 16px 16px",
                borderRadius: 999,
                backgroundColor: colors.white,
                boxShadow: "8px 10px 0 rgba(0,0,0,0.35)",
                rotate: "2deg",
              }}
            >
              <PinIcon size={84} />
              <span style={{ fontFamily: display, fontWeight: 900, fontSize: 50, color: colors.gray }}>
                Puerto Iguazú
              </span>
            </div>
          </SlideIn>
        </AbsoluteFill>
        <Squad name="electricidad" at={rel(B, 2.6)} height={300} from="right" style={{ right: -10, top: 520 }} />
      </Shake>
    </>
  );
};

/* 3 · 6.5–12.5 s · "¿Y cómo funciona? Es autoservicio. Elegís, pagás y te lo llevás." */
const C = 6.5;
const StepCard: React.FC<{ at: number; n: number; word: string; icon: React.ReactNode; from: "left" | "right"; rotate: number }> = ({
  at,
  n,
  word,
  icon,
  from,
  rotate,
}) => (
  <SlideIn at={at} from={from} distance={1100}>
    <Paper seed={`step${n}`} pad="22px 50px 26px 28px" rotate={rotate}>
      <div style={{ display: "flex", alignItems: "center", gap: 34, width: 640 }}>
        {icon}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ ...labelStyle, fontSize: 30, color: colors.orange }}>Paso {n}</span>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 96, color: colors.gray, lineHeight: 1 }}>{word}</span>
        </div>
      </div>
    </Paper>
  </SlideIn>
);

export const Autoservicio: React.FC = () => {
  const hitBanner = rel(C, 8.28);
  const steps = [rel(C, 9.54), rel(C, 10.54), rel(C, 11.88)];
  return (
    <>
      <Texture name="madera" shade={0.5} />
      <AbsoluteFill style={{ backgroundColor: "rgba(30,20,10,0.25)" }} />
      <Shake hits={[hitBanner, ...steps]} power={14}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 280 }}>
          <Stamp at={rel(C, 6.66)} rotate={3} from={1.6}>
            <Paper seed="como" pad="18px 44px 22px">
              <div style={{ ...labelStyle, fontSize: 62, color: colors.gray }}>¿Y cómo funciona?</div>
            </Paper>
          </Stamp>
          <Doodle d={DOODLES.question} viewBox="0 0 100 110" w={90} h={100} at={rel(C, 7.0)} color={colors.white} style={{ right: 110, top: 230 }} />
          <Stamp at={hitBanner} rotate={-4} from={3} style={{ marginTop: 50 }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 900,
                fontSize: 108,
                color: colors.white,
                backgroundColor: colors.orange,
                padding: "16px 44px 24px",
                boxShadow: "12px 14px 0 rgba(0,0,0,0.4)",
              }}
            >
              AUTOSERVICIO
            </div>
          </Stamp>
          <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 80, alignItems: "center" }}>
            <StepCard at={steps[0]} n={1} word="Elegís" icon={<CartIcon size={140} />} from="left" rotate={-2} />
            <StepCard at={steps[1]} n={2} word="Pagás" icon={<PayIcon size={140} />} from="right" rotate={2} />
            <StepCard at={steps[2]} n={3} word="¡Llevás!" icon={<BagIcon size={140} />} from="left" rotate={-1.5} />
          </div>
          <Doodle d={DOODLES.burst} viewBox="0 0 120 120" w={150} h={150} at={steps[2] + 6} color={colors.electricidad} style={{ right: 60, top: 1290 }} />
        </AbsoluteFill>
        <Squad name="herramientas" at={steps[2] + 2} height={360} from="bottom" style={{ right: 40, top: 1350 }} />
      </Shake>
    </>
  );
};

/* 4 · 12.5–17.9 s · "Recorrés las góndolas, tenés todo a la vista, y si necesitás una mano, te ayudamos." */
const D = 12.5;
export const Recorrido: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hitVista = rel(D, 14.02);
  const bubble = spring({ frame: frame - rel(D, 15.6), fps, config: { damping: 10, stiffness: 170 } });
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: colors.ink }}>
        <Video
          src={staticFile("video/recorrido.mp4")}
          trimBefore={2 * fps}
          playbackRate={1.6}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.08 }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </AbsoluteFill>
      <Shake hits={[hitVista]} power={12}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
          <SlideIn at={rel(D, 12.72)} from="right">
            <Paper seed="recorres" pad="18px 44px 22px" rotate={-3}>
              <div style={{ ...labelStyle, fontSize: 58, color: colors.gray }}>Recorrés las góndolas</div>
            </Paper>
          </SlideIn>
          <Stamp at={hitVista} rotate={2} from={2.8} style={{ marginTop: 40, position: "relative" }}>
            <Paper seed="vista" color={colors.orange} pad="18px 44px 26px">
              <div style={{ ...titleStyle, fontSize: 92, color: colors.white }}>TODO A LA VISTA</div>
            </Paper>
            <MaskingTape style={{ top: -18, left: -30 }} rotate={-30} width={140} />
            <MaskingTape style={{ bottom: -10, right: -36 }} rotate={-24} width={140} />
          </Stamp>
        </AbsoluteFill>
        <Squad name="plomeria" at={rel(D, 15.4)} height={330} from="left" style={{ left: 30, top: 1130 }} />
        <div
          style={{
            position: "absolute",
            left: 340,
            top: 1060,
            scale: bubble,
            transformOrigin: "left bottom",
            opacity: frame < rel(D, 15.6) ? 0 : 1,
          }}
        >
          <svg width="640" height="300" viewBox="0 0 640 300" style={{ position: "absolute", overflow: "visible" }}>
            <path
              d="M40 30 C 20 32, 12 50, 14 80 L 18 200 C 20 228, 36 240, 64 240 L 120 240 L 60 296 L 170 240 L 590 236 C 618 234, 630 220, 628 192 L 624 60 C 622 34, 606 22, 580 22 Z"
              fill={colors.white}
              stroke={colors.gray}
              strokeWidth={8}
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ position: "relative", width: 640, height: 240, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 56 }}>
            <span style={{ ...labelStyle, fontSize: 42, color: colors.gray, whiteSpace: "nowrap" }}>¿Necesitás una mano?</span>
            <span style={{ fontFamily: display, fontWeight: 900, fontSize: 56, color: colors.orange, whiteSpace: "nowrap" }}>¡Te ayudamos!</span>
          </div>
        </div>
      </Shake>
    </>
  );
};

/* 5 · 17.9–28.9 s · "Tenemos TODOS los rubros…" */
const E = 17.9;
const RUBROS: { file: string; label: string; color: string; at: number; rot: number }[] = [
  { file: "pintureria", label: "Pinturería", color: colors.orange, at: 19.76, rot: -4 },
  { file: "buloneria", label: "Bulonería", color: colors.buloneria, at: 20.6, rot: 3 },
  { file: "plomeria", label: "Plomería", color: colors.plomeria, at: 21.44, rot: -2 },
  { file: "electricidad", label: "Electricidad", color: colors.electricidad, at: 22.22, rot: 4 },
  { file: "iluminacion", label: "Iluminación", color: colors.electricidad, at: 23.2, rot: -3 },
  { file: "libreria", label: "Librería", color: colors.herramientas, at: 24.18, rot: 2 },
  { file: "herramientas", label: "Herramientas manuales", color: colors.herramientas, at: 25.02, rot: -2 },
  { file: "electricas", label: "Herramientas eléctricas", color: colors.herramientas, at: 26.1, rot: 3 },
  { file: "insumos", label: "Insumos de ferretería", color: colors.grayLight, at: 27.1, rot: -3 },
];

const RubroCard: React.FC<{ file: string; label: string; color: string; at: number; rot: number }> = ({
  file,
  label,
  color,
  at,
  rot,
}) => (
  <Stamp at={at} rotate={rot} from={2.2}>
    <Paper seed={file} pad="22px 14px 18px" jag={3}>
      <div style={{ width: 236, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 150, height: 150, borderRadius: "50%", boxShadow: `0 0 0 7px ${color}` }}>
          <Img src={staticFile(`icons/${file}.svg`)} style={{ width: 150, height: 150 }} />
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: 27,
            lineHeight: 1.15,
            color: colors.gray,
            textAlign: "center",
            minHeight: 62,
            display: "flex",
            alignItems: "center",
          }}
        >
          {label}
        </div>
      </div>
    </Paper>
  </Stamp>
);

export const Rubros: React.FC = () => {
  const hitTodos = rel(E, 18.58);
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: colors.orange }} />
      <Mesh />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)" }} />
      <Shake hits={[hitTodos, ...RUBROS.map((r) => rel(E, r.at))]} power={7}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Stamp at={rel(E, 17.96)} rotate={-3} from={1.8}>
              <Paper seed="tenemos" pad="12px 30px 16px">
                <div style={{ ...labelStyle, fontSize: 50, color: colors.gray }}>Tenemos</div>
              </Paper>
            </Stamp>
            <Stamp at={hitTodos} rotate={3} from={3}>
              <div style={{ ...titleStyle, fontSize: 96, color: colors.white, backgroundColor: colors.ink, padding: "10px 30px 18px" }}>
                TODOS
              </div>
            </Stamp>
          </div>
          <Stamp at={rel(E, 19.04)} rotate={-1} from={2} style={{ marginTop: 14 }}>
            <div style={{ ...titleStyle, fontSize: 84, color: colors.ink }}>los rubros</div>
          </Stamp>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              columnGap: 20,
              rowGap: 26,
              width: 880,
              marginTop: 50,
            }}
          >
            {RUBROS.map((r) => (
              <RubroCard key={r.file} {...r} at={rel(E, r.at)} />
            ))}
          </div>
        </AbsoluteFill>
        <Squad name="buloneria" at={rel(E, 20.6)} height={250} from="left" style={{ left: -20, top: 1500 }} />
        <Squad name="electricidad" at={rel(E, 22.22)} height={270} from="right" style={{ right: -10, top: 1480 }} />
      </Shake>
    </>
  );
};

/* 6 · 28.9–32.2 s · "Sea cual sea el problema, acá tenemos la solución." */
const F = 28.9;
export const Solucion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hitSol = rel(F, 31.58);
  const slap = spring({ frame: frame - hitSol, fps, config: { damping: 9, stiffness: 220 } });
  const tapeIn = (d: number) => interpolate(frame - d, [0, 10], [0, 100], clamp);
  return (
    <>
      <Texture name="concreto" />
      <Shake hits={[rel(F, 29.86), hitSol]} power={24}>
        <Tape
          offset={-frame * 4}
          style={{ width: 1800, left: -360, top: 1250, rotate: "-12deg", clipPath: `inset(0 ${100 - tapeIn(hitSol - 4)}% 0 0)` }}
        />
        <Tape
          color={colors.ink}
          offset={frame * 4 - 400}
          style={{ width: 1800, left: -360, top: 1400, rotate: "8deg", clipPath: `inset(0 0 0 ${100 - tapeIn(hitSol - 2)}%)` }}
        />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
          <div style={{ ...fadeUp(frame, rel(F, 29.08)), ...labelStyle, fontSize: 66, color: colors.white }}>
            Sea cual sea el
          </div>
          <Stamp at={rel(F, 29.86)} rotate={-2} from={2.6} style={{ position: "relative", marginTop: 16 }}>
            <div style={{ ...titleStyle, fontSize: 140, color: colors.white }}>PROBLEMA</div>
            <Doodle d={DOODLES.scribble} viewBox="0 0 300 60" w={760} h={150} at={rel(F, 30.5)} dur={10} color="#E5412D" width={9} style={{ left: -20, top: -10 }} />
          </Stamp>
          <div style={{ ...fadeUp(frame, rel(F, 30.66)), ...labelStyle, fontSize: 58, color: colors.muted, marginTop: 50 }}>
            acá tenemos la
          </div>
          <div
            style={{
              marginTop: 50,
              scale: interpolate(slap, [0, 1], [3, 1]),
              opacity: frame < hitSol ? 0 : 1,
            }}
          >
            <Sticker scale={1.05} />
          </div>
        </AbsoluteFill>
        <Squad name="seguridad" at={hitSol + 3} height={330} from="bottom" style={{ left: 60, top: 1180 }} />
      </Shake>
    </>
  );
};

/* 7 · 32.2 s–fin · Dirección, Instagram, WhatsApp, "¡Vení a visitarnos!" */
const G = 32.2;
const ContactRow: React.FC<{ at: number; valueAt: number; icon: React.ReactNode; label: string; value: string; rot: number; from: "left" | "right" }> = ({
  at,
  valueAt,
  icon,
  label,
  value,
  rot,
  from,
}) => {
  const frame = useCurrentFrame();
  return (
    <SlideIn at={at} from={from} distance={1100}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          width: 880,
          padding: "22px 32px",
          backgroundColor: colors.gray,
          rotate: `${rot}deg`,
          boxShadow: "10px 12px 0 rgba(0,0,0,0.25)",
        }}
      >
        {icon}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ ...labelStyle, fontSize: 30, color: colors.orange }}>{label}</span>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: 50, color: colors.white, ...fadeUp(frame, valueAt) }}>
            {value}
          </span>
        </div>
      </div>
    </SlideIn>
  );
};

const VisitButton: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 8, stiffness: 200 } });
  const bounce = frame > at + 15 ? 1 + Math.max(0, Math.sin((frame - at) / 5)) * 0.04 : 1;
  return (
    <div
      style={{
        scale: p * bounce,
        rotate: "-2deg",
        fontFamily: display,
        fontWeight: 900,
        fontSize: 66,
        color: colors.white,
        backgroundColor: colors.orange,
        padding: "30px 66px 36px",
        border: `6px solid ${colors.ink}`,
        boxShadow: `12px 14px 0 ${colors.ink}`,
      }}
    >
      ¡Vení a visitarnos!
    </div>
  );
};

export const Contacto: React.FC = () => {
  const btn = rel(G, 44.58);
  return (
    <>
      <Texture name="papel" shade={0.18} />
      <Shake hits={[rel(G, 32.36), btn]} power={12}>
        <Polaroid photo={1} at={rel(G, 32.3)} rotate={-8} width={300} style={{ left: 70, top: 250 }} />
        <Polaroid photo={8} at={rel(G, 32.45)} rotate={6} width={300} style={{ right: 80, top: 230 }} />
        <Polaroid photo={6} at={rel(G, 32.6)} rotate={-2} width={280} style={{ left: 400, top: 300 }} />
        <div style={{ position: "absolute", left: 450, top: 500 }}>
          <Stamp at={rel(G, 32.7)} from={3}>
            <H30Logo size={180} delay={rel(G, 32.7) - 8} />
          </Stamp>
        </div>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 720 }}>
          <Stamp at={rel(G, 32.36)} rotate={-3} from={2.6}>
            <div style={{ ...titleStyle, fontSize: 104, color: colors.ink }}>
              ¡Te <span style={{ color: colors.orange }}>esperamos!</span>
            </div>
          </Stamp>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 50 }}>
            <ContactRow at={rel(G, 33.0)} valueAt={rel(G, 33.3)} icon={<PinIcon size={104} />} label="Dirección" value="Av. República Argentina 95" rot={-1.5} from="left" />
            <ContactRow at={rel(G, 36.2)} valueAt={rel(G, 37.42)} icon={<InstagramIcon size={104} />} label="Instagram" value="@h30puertoiguazu" rot={1.2} from="right" />
            <ContactRow at={rel(G, 39.8)} valueAt={rel(G, 40.74)} icon={<WhatsAppIcon size={104} />} label="WhatsApp" value="3757-200118" rot={-1} from="left" />
          </div>
          <div style={{ marginTop: 60, position: "relative" }}>
            <VisitButton at={btn} />
            <Doodle d={DOODLES.arrow} viewBox="0 0 160 100" w={150} h={100} at={btn + 8} color={colors.ink} width={8} style={{ left: -150, top: -40, scale: "-1 1" }} />
            <Doodle d={DOODLES.sparkle} viewBox="0 0 100 100" w={90} h={90} at={btn + 12} color={colors.orange} width={8} style={{ right: -90, top: -60 }} />
          </div>
        </AbsoluteFill>
        <Squad name="buloneria" at={btn + 4} height={210} style={{ left: 40, top: 1640 }} />
        <Squad name="plomeria" at={btn + 7} height={200} style={{ left: 250, top: 1660 }} />
        <Squad name="electricidad" at={btn + 10} height={220} style={{ left: 450, top: 1640 }} />
        <Squad name="herramientas" at={btn + 13} height={250} style={{ left: 640, top: 1610 }} />
        <Squad name="seguridad" at={btn + 16} height={240} style={{ left: 830, top: 1620 }} />
      </Shake>
    </>
  );
};
