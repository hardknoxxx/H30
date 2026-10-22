import React from "react";
import { Video } from "@remotion/media";
import { getLength, getPointAtLength } from "@remotion/paths";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { body, clamp, colors, display, easeInOut } from "../brand";
import { H30Logo } from "../Logo";
import { Sticker } from "../ui";
import { PhotoBurst, Shake, Squad, Stamp, Texture } from "./fx";
import { GLOW, Comet, Glitch, H, LightPath, Node, Sparks, TimedWords, TraceBox } from "./glow";
import { BagIcon, CartIcon, InstagramIcon, PayIcon, PinIcon, WhatsAppIcon } from "./icons";

export const FPS = 30;
/** Fotogramas de solapamiento entre escenas (la mitad antes del corte, la mitad después). */
export const LEAD = 4;

/** Convierte un segundo de la voz en fotograma relativo a la escena que empieza en `start`. */
const timer = (start: number, lead = LEAD) => (sec: number) => Math.round((sec - start) * FPS) + lead;

const kicker: React.CSSProperties = {
  fontFamily: body,
  fontWeight: 900,
  fontStyle: "italic",
  textTransform: "uppercase",
  letterSpacing: 1,
  color: colors.text,
};

/* 1 · 0–2.0 s · "¡H30 está en tu ciudad!" */
export const Hook: React.FC = () => {
  const r = timer(0, 0);
  return (
    <Shake hits={[r(0.18), r(1.24)]} power={14}>
      <Comet d="M -80 1560 C 220 1320, 280 820, 540 720" at={0} dur={6} />
      <Sparks x={540} y={720} at={r(0.15)} count={20} size={300} seed="hook" />
      <div style={{ position: "absolute", left: 340, top: 520 }}>
        <Stamp at={r(0.18)} from={2.2}>
          <H30Logo size={400} delay={r(0.18) - 12} />
        </Stamp>
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1010 }}>
        <TimedWords
          words={[
            { t: r(0.72), text: "ESTÁ" },
            { t: r(0.94), text: "EN" },
          ]}
          style={H(116)}
        />
        <TimedWords
          words={[
            { t: r(1.06), text: "TU" },
            { t: r(1.24), text: "CIUDAD", color: colors.orange },
          ]}
          style={H(140, { marginTop: 6 })}
        />
      </AbsoluteFill>
      <LightPath d="M 150 1330 C 400 1355, 700 1305, 930 1330" at={r(1.3)} dur={10} />
    </Shake>
  );
};

/* 2 · 2.0–8.1 s · "¿Y cómo funciona? Es autoservicio. Elegís, pagás y te lo llevás." */
const StepLabel: React.FC<{ at: number; x: number; y: number; align: "left" | "right"; children: string }> = ({
  at,
  x,
  y,
  align,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [0, 8], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <div
      style={{
        position: "absolute",
        top: y - 56,
        left: align === "left" ? x : undefined,
        right: align === "right" ? 1080 - x : undefined,
        ...H(96),
        opacity: p,
        filter: `blur(${(1 - p) * 12}px)`,
        translate: `${(1 - p) * (align === "left" ? -60 : 60)}px 0px`,
      }}
    >
      {children}
    </div>
  );
};

export const Autoservicio: React.FC = () => {
  const r = timer(2.0);
  const frame = useCurrentFrame();
  const fillAt = r(3.68) + 10;
  const fill = interpolate(frame - fillAt, [0, 3], [0, 1], clamp);
  return (
    <Shake hits={[fillAt, r(5.08), r(6.06), r(7.4)]} power={9}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 285 }}>
        <TimedWords
          words={[
            { t: r(2.18), text: "¿Y" },
            { t: r(2.38), text: "cómo" },
            { t: r(2.68), text: "funciona?" },
          ]}
          style={{ ...kicker, fontSize: 64 }}
        />
      </AbsoluteFill>
      <TraceBox x={90} y={400} w={900} h={170} at={r(3.5)} dur={12} radius={28} contentDelay={4}>
        <AbsoluteFill style={{ backgroundColor: colors.orange, opacity: fill }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={H(82, { color: colors.white })}>AUTOSERVICIO</div>
        </AbsoluteFill>
      </TraceBox>
      <Sparks x={90} y={400} at={fillAt} count={10} size={140} seed="a1" />
      <Sparks x={990} y={570} at={fillAt} count={10} size={140} seed="a2" />

      <LightPath d="M 540 570 C 540 700, 230 690, 230 820" at={r(4.6)} dur={r(5.08) - r(4.6)} />
      <LightPath d="M 310 900 C 650 900, 850 960, 850 1090" at={r(5.4)} dur={r(6.06) - r(5.4)} />
      <LightPath d="M 850 1250 C 850 1400, 520 1440, 310 1440" at={r(6.5)} dur={r(7.4) - r(6.5)} />

      <Node x={230} y={900} at={r(5.08)} size={160}>
        <CartIcon size={160} />
      </Node>
      <Node x={850} y={1170} at={r(6.06)} size={160}>
        <PayIcon size={160} />
      </Node>
      <Node x={230} y={1440} at={r(7.4)} size={160}>
        <BagIcon size={160} />
      </Node>
      <Sparks x={230} y={900} at={r(5.08)} seed="n1" />
      <Sparks x={850} y={1170} at={r(6.06)} seed="n2" />
      <Sparks x={230} y={1440} at={r(7.4)} seed="n3" size={220} count={18} />

      <StepLabel at={r(5.08)} x={340} y={900} align="left">ELEGÍS</StepLabel>
      <StepLabel at={r(6.06)} x={740} y={1170} align="right">PAGÁS</StepLabel>
      <StepLabel at={r(7.4)} x={340} y={1440} align="left">¡LLEVÁS!</StepLabel>
    </Shake>
  );
};

/* 3 · 8.1–13.4 s · "Recorrés las góndolas, tenés todo a la vista… te ayudamos." */
export const Gondolas: React.FC = () => {
  const r = timer(8.1);
  const { fps } = useVideoConfig();
  return (
    <Shake hits={[r(10.12), r(11.2)]} power={8}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 270 }}>
        <TimedWords
          words={[
            { t: r(8.32), text: "RECORRÉS" },
            { t: r(8.72), text: "LAS" },
            { t: r(8.88), text: "GÓNDOLAS", color: colors.orange },
          ]}
          style={H(76, { width: 920 })}
        />
      </AbsoluteFill>
      <TraceBox x={150} y={470} w={780} h={1000} at={r(8.1) - 2} dur={14} radius={44} contentDelay={3}>
        <Sequence from={0} durationInFrames={r(9.7)} layout="none">
          <Video
            src={staticFile("video/recorrido.mp4")}
            trimBefore={3 * fps}
            playbackRate={1.8}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
        <Sequence from={r(9.7)} durationInFrames={r(11.1) - r(9.7)} layout="none">
          <PhotoBurst photos={[7, 1, 8, 3, 6, 2, 4, 5, 9]} every={3} dim={0.05} />
        </Sequence>
        <Sequence from={r(11.1)} layout="none">
          <Video
            src={staticFile("video/recorrido.mp4")}
            trimBefore={17 * fps}
            playbackRate={1.6}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </TraceBox>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center" }}>
        <Stamp at={r(10.12)} from={2.4} rotate={-2}>
          <div
            style={{
              ...H(64, { color: colors.white }),
              backgroundColor: colors.orange,
              padding: "18px 44px 24px",
              borderRadius: 999,
              filter: GLOW,
            }}
          >
            TODO A LA VISTA
          </div>
        </Stamp>
      </div>
      <Sparks x={540} y={1460} at={r(10.12)} count={16} size={260} seed="vista" />
      <TraceBox x={110} y={1170} w={620} h={160} at={r(11.15)} dur={10} radius={30} fill="rgba(250,248,244,0.96)" contentDelay={3}>
        <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 40 }}>
          <span style={{ ...kicker, fontSize: 36, color: colors.gray }}>¿Necesitás una mano?</span>
          <span style={H(56, { color: colors.orange, textAlign: "left" })}>¡TE AYUDAMOS!</span>
        </AbsoluteFill>
      </TraceBox>
      <Squad name="plomeria" at={r(11.1)} height={300} from="right" style={{ left: 740, top: 1090 }} />
    </Shake>
  );
};

/* 4 · 13.4–24.7 s · "Tenemos todos los rubros…" — árbol de nodos que se encienden al nombrarlos */
const ROOT = { x: 540, y: 1520 };
const RUBROS = [
  { file: "pintureria", label: "Pinturería", color: colors.orange, t: 15.36, x: 200, y: 660 },
  { file: "buloneria", label: "Bulonería", color: colors.buloneria, t: 16.26, x: 540, y: 660 },
  { file: "plomeria", label: "Plomería", color: colors.plomeria, t: 17.14, x: 880, y: 660 },
  { file: "electricidad", label: "Electricidad", color: colors.electricidad, t: 17.94, x: 200, y: 920 },
  { file: "iluminacion", label: "Iluminación", color: colors.electricidad, t: 18.94, x: 540, y: 920 },
  { file: "libreria", label: "Librería", color: colors.herramientas, t: 19.94, x: 880, y: 920 },
  { file: "herramientas", label: "Herramientas manuales", color: colors.herramientas, t: 20.9, x: 200, y: 1180 },
  { file: "electricas", label: "Herramientas eléctricas", color: colors.herramientas, t: 21.98, x: 540, y: 1180 },
  { file: "insumos", label: "Insumos de ferretería", color: colors.grayLight, t: 22.8, x: 880, y: 1180 },
];

const branch = (x: number, y: number) => `M ${ROOT.x} ${ROOT.y - 70} C ${ROOT.x} ${ROOT.y - 260}, ${x} ${y + 300}, ${x} ${y + 80}`;

/** Pulso de luz que viaja de la raíz al nodo una y otra vez, como datos fluyendo. */
const Flow: React.FC<{ d: string; from: number; color: string }> = ({ d, from, color }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const len = getLength(d);
  const dots = [0, 0.5].map((o) => {
    const p = (((frame - from) / 26 + o) % 1 + 1) % 1;
    return getPointAtLength(d, len * p);
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: GLOW }}>
      {dots.map((pt, i) => pt && (
        <circle key={i} cx={pt.x} cy={pt.y} r={6} fill={i ? color : "#fff4e6"} />
      ))}
    </svg>
  );
};

const RubroLabel: React.FC<{ at: number; x: number; y: number; children: string }> = ({ at, x, y, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - at, [2, 9], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y + 88,
        width: 300,
        fontFamily: display,
        fontWeight: 600,
        fontSize: 27,
        lineHeight: 1.15,
        color: colors.text,
        textAlign: "center",
        opacity: p,
        filter: `blur(${(1 - p) * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Rubros: React.FC = () => {
  const r = timer(13.4);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const allAt = r(23.95);
  const root = spring({ frame: frame - r(14.6), fps, config: { damping: 11, stiffness: 180 } });
  const allPulse = interpolate(frame - allAt, [0, 5, 18], [1, 1.06, 1], clamp);
  return (
    <Shake hits={[r(14.62), allAt]} power={8}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 262 }}>
        <TimedWords words={[{ t: r(13.56), text: "Tenemos" }]} style={{ ...kicker, fontSize: 58 }} />
        <TimedWords
          words={[
            { t: r(14.12), text: "TODOS", color: colors.orange },
            { t: r(14.44), text: "LOS" },
            { t: r(14.62), text: "RUBROS" },
          ]}
          style={H(88, { marginTop: 8 })}
        />
      </AbsoluteFill>
      {RUBROS.map((n) => (
        <React.Fragment key={n.file}>
          <LightPath d={branch(n.x, n.y)} at={r(n.t) - 9} dur={9} width={4} rest={0.35} />
          <Flow d={branch(n.x, n.y)} from={r(n.t) + 4} color={n.color} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", inset: 0, scale: allPulse }}>
        {RUBROS.map((n) => (
          <React.Fragment key={n.file}>
            <Node x={n.x} y={n.y} at={r(n.t)} size={150} color={n.color}>
              <Img src={staticFile(`icons/${n.file}.svg`)} style={{ width: 150, height: 150 }} />
            </Node>
            <Sparks x={n.x} y={n.y} at={r(n.t)} count={10} size={130} seed={n.file} />
            <RubroLabel at={r(n.t)} x={n.x} y={n.y}>{n.label}</RubroLabel>
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: ROOT.x - 75,
          top: ROOT.y - 75,
          scale: root,
          filter: GLOW,
        }}
      >
        <H30Logo size={150} delay={r(14.6) - 30} />
      </div>
      <Sparks x={ROOT.x} y={ROOT.y} at={r(14.6)} count={16} size={200} seed="root" />
      <Sparks x={ROOT.x} y={ROOT.y} at={allAt} count={22} size={320} seed="all" />
      <Squad name="buloneria" at={r(16.26)} height={210} from="left" style={{ left: 10, top: 1400 }} />
      <Squad name="electricidad" at={r(17.94)} height={230} from="right" style={{ left: 840, top: 1380 }} />
    </Shake>
  );
};

/* 5 · 24.7–28.2 s · "Sea cual sea el problema, acá tenemos la solución." */
export const Solucion: React.FC = () => {
  const r = timer(24.7);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hit = r(27.4);
  const after = frame >= hit;
  const slap = spring({ frame: frame - hit, fps, config: { damping: 15, stiffness: 260 } });
  const flash = interpolate(frame - hit, [0, 4], [0.9, 0], clamp);
  return (
    <Shake hits={[r(25.66), hit]} power={after ? 26 : 12}>
      {!after ? (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 520 }}>
          <TimedWords
            words={[
              { t: r(24.88), text: "SEA" },
              { t: r(25.16), text: "CUAL" },
              { t: r(25.38), text: "SEA" },
            ]}
            style={H(96)}
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 14 }}>
            <TimedWords words={[{ t: r(25.54), text: "EL" }]} style={H(64)} />
            <Glitch at={r(25.66)} style={H(108, { color: colors.orange })}>
              PROBLEMA
            </Glitch>
          </div>
          <TimedWords
            words={[
              { t: r(26.5), text: "acá" },
              { t: r(26.9), text: "tenemos" },
              { t: r(27.26), text: "la" },
            ]}
            style={{ ...kicker, fontSize: 60, marginTop: 70, color: colors.muted }}
          />
          <LightPath d="M 150 900 C 420 925, 660 880, 930 900" at={r(25.9)} dur={10} />
        </AbsoluteFill>
      ) : (
        <>
          <Texture name="manual-naranja" shade={0.3} drift={false} />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
            <div style={{ scale: interpolate(slap, [0, 1], [2.6, 0.95]) }}>
              <Sticker scale={1.05} />
            </div>
          </AbsoluteFill>
          <Sparks x={540} y={760} at={hit} count={26} size={460} seed="sol" />
          <Squad name="seguridad" at={hit + 2} height={330} from="bottom" style={{ left: 380, top: 1130 }} />
          <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
        </>
      )}
    </Shake>
  );
};

/* 6 · 28.2–38.9 s · Dirección hablada; redes y WhatsApp en pantalla. */
const PHONE = [
  { c: "3", t: 33.86 },
  { c: "7", t: 34.1 },
  { c: "5", t: 34.42 },
  { c: "7", t: 34.78 },
  { c: "-", t: 35.3 },
  { c: "2", t: 35.52 },
  { c: "0", t: 35.72 },
  { c: "0", t: 36.02 },
  { c: "1", t: 36.52 },
  { c: "1", t: 36.8 },
  { c: "8", t: 37.08 },
];

const Digits: React.FC<{ r: (s: number) => number }> = ({ r }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", fontFamily: display, fontWeight: 900, fontSize: 60, color: colors.white, fontVariantNumeric: "tabular-nums" }}>
      {PHONE.map((d, i) => {
        const f = frame - r(d.t);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(f, [0, 3], [0.12, 1], clamp),
              color: f >= 0 && f < 8 ? colors.orange : undefined,
              scale: interpolate(f, [0, 3, 8], [1, 1.35, 1], clamp),
              translate: `0px ${interpolate(f, [0, 3, 8], [0, -10, 0], clamp)}px`,
            }}
          >
            {d.c}
          </span>
        );
      })}
    </div>
  );
};

const VisitButton: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 210 } });
  const beat = frame > at + 12 ? 1 + Math.max(0, Math.sin((frame - at) / 3.6)) * 0.035 : 1;
  return (
    <div
      style={{
        scale: p * beat,
        ...H(62, { color: colors.white }),
        backgroundColor: colors.orange,
        padding: "28px 60px 34px",
        borderRadius: 999,
        filter: GLOW,
      }}
    >
      ¡VENÍ A VISITARNOS!
    </div>
  );
};

export const Contacto: React.FC = () => {
  const r = timer(28.2);
  const frame = useCurrentFrame();
  return (
    <Shake hits={[r(37.7)]} power={12}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 262 }}>
        <TimedWords
          words={[
            { t: r(28.26), text: "¡TE" },
            { t: r(28.32), text: "ESPERAMOS!", color: colors.orange },
          ]}
          style={H(86)}
        />
      </AbsoluteFill>
      <TraceBox x={150} y={390} w={780} h={470} at={r(28.2)} dur={12} radius={40} contentDelay={3}>
        <Sequence from={0} durationInFrames={40} layout="none">
          <PhotoBurst photos={[1, 8, 3, 6, 2, 7, 4, 5, 9]} every={3} dim={0.05} />
        </Sequence>
        <Sequence from={40} layout="none">
          <PhotoBurst photos={[7, 1, 8, 3, 6, 2, 4, 5, 9]} every={14} dim={0.05} />
        </Sequence>
      </TraceBox>
      <TraceBox x={90} y={900} w={900} h={190} at={r(28.85)} dur={12} radius={32} contentDelay={3}>
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", gap: 28, paddingLeft: 30 }}>
          <PinIcon size={110} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ ...kicker, fontSize: 28, color: colors.orange }}>Puerto Iguazú</span>
            <TimedWords
              words={[
                { t: r(28.92), text: "Av." },
                { t: r(29.36), text: "República" },
                { t: r(29.86), text: "Argentina" },
                { t: r(30.42), text: "95", color: colors.orange },
              ]}
              style={H(46, { justifyContent: "flex-start", textAlign: "left", width: 700 })}
              gap="0.3em"
            />
          </div>
        </AbsoluteFill>
      </TraceBox>
      <TraceBox x={90} y={1120} w={900} h={140} at={r(31.68)} dur={10} radius={32} contentDelay={3}>
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", gap: 28, paddingLeft: 30 }}>
          <InstagramIcon size={92} />
          <span style={H(48, { textAlign: "left" })}>@h30puertoiguazu</span>
        </AbsoluteFill>
      </TraceBox>
      <TraceBox x={90} y={1290} w={900} h={140} at={r(33.0)} dur={10} radius={32} contentDelay={3}>
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", gap: 28, paddingLeft: 30 }}>
          <WhatsAppIcon size={92} />
          <Digits r={r} />
        </AbsoluteFill>
      </TraceBox>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1465, display: "flex", justifyContent: "center", opacity: frame >= r(37.7) ? 1 : 0 }}>
        <VisitButton at={r(37.7)} />
      </div>
      <Sparks x={540} y={1530} at={r(37.7)} count={22} size={380} seed="visit" />
    </Shake>
  );
};

/* 7 · 38.9–42 s · Cierre con el logo; se cierra en una línea y un punto. */
export const Cierre: React.FC = () => {
  const r = timer(38.9);
  const frame = useCurrentFrame();
  const sy = interpolate(frame, [r(41.0), r(41.3)], [1, 0.012], { ...clamp, easing: easeInOut });
  const sx = interpolate(frame, [r(41.3), r(41.65)], [1, 0], { ...clamp, easing: easeInOut });
  return (
    <AbsoluteFill style={{ scale: `${sx} ${sy}` }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 560 }}>
        <Stamp at={LEAD} from={2.4}>
          <H30Logo size={430} delay={LEAD - 10} />
        </Stamp>
        <TimedWords
          words={[
            { t: LEAD + 12, text: "FERRETERÍAS" },
            { t: LEAD + 16, text: "EXPRESS" },
          ]}
          style={{ fontFamily: display, fontWeight: 400, fontSize: 42, letterSpacing: 10, color: colors.text, marginTop: 50 }}
        />
        <TimedWords
          words={[{ t: LEAD + 24, text: "PUERTO IGUAZÚ", color: colors.orange }]}
          style={{ ...kicker, fontSize: 40, letterSpacing: 8, marginTop: 18 }}
        />
      </AbsoluteFill>
      <Sparks x={540} y={775} at={LEAD} count={24} size={420} seed="end" />
      <LightPath d="M 190 1330 L 890 1330" at={LEAD + 18} dur={12} width={5} />
    </AbsoluteFill>
  );
};

/** Barrido de luz diagonal que acompaña cada corte. */
export const Sweep: React.FC = () => (
  <Comet d="M -200 1700 C 300 1300, 700 700, 1300 150" at={0} dur={10} tail={0.45} width={10} />
);
