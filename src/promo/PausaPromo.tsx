import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BlurIn,
  Bracket,
  Camera,
  clamp,
  CountUp,
  ease,
  Glass,
  Halo,
  HourlyCard,
  LightDot,
  PixelDissolve,
  Sfx,
  ShimmerButton,
  SoftScene,
  Spotlight,
  sec,
  tone,
  ui,
  WeekChart,
} from "../motion";

/* Comercial de prueba al estilo Opal: app ficticia "Pausa" que reduce el tiempo en pantalla.
 * 1920×1080, 16 s, sin voz: música + efectos. El drop de la música cae a los 3 s. */

export const PAUSA_DURATION = sec(16);
const EDGE = 6;
const span = (a: number, b: number) => ({ from: Math.max(0, sec(a) - EDGE / 2), durationInFrames: sec(b) - sec(a) + EDGE });
const local = (start: number) => (s: number) => Math.round((s - start) * 30) + (start === 0 ? 0 : EDGE / 2);

/* ---------- Íconos ---------- */
const I = {
  moon: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="#fff" /></svg>
  ),
  glass: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" /></svg>
  ),
  cloud: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z" fill="#fff" /></svg>
  ),
  lock: (s: number, c = "#fff") => (
    <svg width={s} height={s} viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.6" fill={c} /><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" stroke={c} strokeWidth={2.2} fill="none" /></svg>
  ),
  rule: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 48 24"><rect x="2" y="3" width="14" height="18" rx="3" stroke="#fff" strokeWidth={2.2} fill="none" /><path d="M20 12h8m-3-3 3 3-3 3" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" /><path d="M38 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" fill="#fff" /></svg>
  ),
};

/** Ícono de la red social ficticia "Scroll". */
const ScrollIcon: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: "linear-gradient(135deg, #ff3d7f 0%, #7d5aff 55%, #00d4ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35)",
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
      <rect x="4" y="2" width="16" height="6" rx="2" fill="rgba(255,255,255,0.55)" />
      <rect x="4" y="9" width="16" height="6" rx="2" fill="rgba(255,255,255,0.8)" />
      <rect x="4" y="16" width="16" height="6" rx="2" fill="#fff" />
    </svg>
  </div>
);

/** Ícono de "Pausa": vidrio oscuro con dos barras de luz. */
const PausaIcon: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: "linear-gradient(160deg, #2b2b30 0%, #0c0c0e 100%)",
      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25), inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 60px rgba(255,255,255,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: size * 0.11,
    }}
  >
    {[0, 1].map((i) => (
      <div key={i} style={{ width: size * 0.12, height: size * 0.42, borderRadius: size * 0.06, background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,0.8)" }} />
    ))}
  </div>
);

/* ---------- 1 · 0–3 s · Panel diario en 3D ---------- */
const Dashboard: React.FC = () => (
  <Camera from={0} to={sec(3.1)} rotateX={[64, 30]} rotateZ={[-10, -3]} zoom={[0.78, 1.12]} y={[160, 10]}>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <BlurIn at={0} dur={20} from={1}>
        <HourlyCard
          at={8}
          date="Viernes, 4 de septiembre"
          total={<CountUp at={6} dur={60} to={555} format={(m) => `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, "0")}m`} />}
        />
      </BlurIn>
    </AbsoluteFill>
  </Camera>
);

/* ---------- 2 · 3.0–4.6 s · La semana: el viernes se pasa del promedio ---------- */
const Week: React.FC = () => {
  const r = local(3.0);
  return (
    <Camera from={0} to={sec(1.8)} zoom={[1, 1.07]} rotateX={[6, 0]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: ui, fontSize: 30, fontWeight: 500, color: tone.muted, marginBottom: 40 }}>Tiempo en pantalla</div>
        <div style={{ position: "relative" }}>
          <Halo color="rgba(255,138,61,0.9)" size={520} at={r(3.7)} x={712} y={260} pulse />
          <WeekChart at={r(3.0)} values={[5.2, 6.1, 4.8, 5.6, 9.25, 6.8, 5.0]} labels={["L", "M", "M", "J", "V", "S", "D"]} hot={4} avg={6} heatAt={r(3.7)} />
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* ---------- 3 · 4.6–8.8 s · Píldoras de bienestar y puntaje ---------- */
const PILLS = [
  { icon: I.moon, to: 67, from: 8, label: "Sueño", x: -340, at: 4.75 },
  { icon: I.glass, to: 43, from: 0, label: "Foco", x: 0, at: 5.9 },
  { icon: I.cloud, to: 33, from: 0, label: "Descanso", x: 340, at: 6.45 },
];

const Wellbeing: React.FC = () => {
  const r = local(4.6);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shift = spring({ frame: frame - r(5.75), fps, config: { damping: 200 }, durationInFrames: 14 });
  const down = spring({ frame: frame - r(7.2), fps, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <Camera from={0} to={sec(4.2)} zoom={[1.08, 1]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <LightDot at={r(4.6)} x={960} y={540} size={34} />
        {PILLS.map((p, i) => {
          // La primera nace en el centro y se corre a la izquierda cuando llegan las otras.
          const x = i === 0 ? interpolate(shift, [0, 1], [0, p.x]) : p.x;
          return (
            <div
              key={p.label}
              style={{
                position: "absolute",
                left: 960 + x,
                top: 540 + down * 150,
                translate: "-50% -50%",
                scale: interpolate(down, [0, 1], [1.25, 1]),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              <BlurIn at={r(p.at)} dur={12} from={0.6} blur={20}>
                <Glass rim={1}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    {p.icon(44)}
                    <CountUp at={r(p.at) + 2} dur={26} from={p.from} to={p.to} style={{ fontSize: 58, fontWeight: 600 }} />
                  </div>
                </Glass>
              </BlurIn>
              <BlurIn at={r(p.at) + 6} dur={10} from={1} blur={10}>
                <div style={{ fontFamily: ui, fontSize: 30, fontWeight: 500, color: tone.muted }}>{p.label}</div>
              </BlurIn>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 960 - 340, top: 540 + 150 - 165 }}>
          <Bracket at={r(7.3)} width={680} height={80} branches={3} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 335, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <BlurIn at={r(7.35)} dur={12} from={1.2}>
            <div style={{ fontFamily: ui, fontSize: 32, fontWeight: 500, color: tone.muted, textAlign: "center" }}>Puntaje</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: ui, fontSize: 120, fontWeight: 700, color: tone.text, letterSpacing: -3 }}>
              <CountUp at={r(7.4)} dur={30} from={18} to={47} />
              <svg width={44} height={44} viewBox="0 0 24 24"><path d="M12 4l9 15H3z" fill="#fff" /></svg>
            </div>
          </BlurIn>
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* ---------- 4 · 8.8–11 s · La app se bloquea ---------- */
const Block: React.FC = () => {
  const r = local(8.8);
  const frame = useCurrentFrame();
  const locked = frame >= r(10.2);
  return (
    <Camera from={0} to={sec(2.2)} zoom={[1.15, 1]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Halo color="rgba(255,59,48,0.95)" size={760} at={r(10.15)} x={960} y={520} pulse />
        <div style={{ position: "relative", width: 280, height: 280, marginTop: -40 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <BlurIn at={r(8.85)} dur={14} from={0.7}>
              <PixelDissolve at={r(9.8)} dur={10} size={280} seed="scroll">
                <ScrollIcon size={280} />
              </PixelDissolve>
            </BlurIn>
          </div>
          <div style={{ position: "absolute", inset: 0 }}>
            <PixelDissolve at={r(9.95)} dur={10} mode="in" size={280} seed="lock">
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: 66,
                  background: "linear-gradient(160deg, #26262a, #0b0b0d)",
                  boxShadow: `inset 0 2px 0 rgba(255,255,255,0.25), 0 0 ${locked ? 90 : 0}px rgba(255,59,48,0.7)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {I.lock(150)}
              </div>
            </PixelDissolve>
          </div>
        </div>
        <div style={{ position: "relative", height: 60, marginTop: 50, width: 600, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "absolute", opacity: interpolate(frame, [r(9.0), r(9.3), r(9.75), r(9.9)], [0, 1, 1, 0], clamp), fontFamily: ui, fontSize: 40, fontWeight: 600, color: tone.text }}>
            Scroll
          </div>
          <BlurIn at={r(10.2)} dur={10} style={{ position: "absolute" }}>
            <div style={{ fontFamily: ui, fontSize: 40, fontWeight: 600, color: tone.danger }}>Bloqueada</div>
          </BlurIn>
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* ---------- 5 · 11–12.6 s · Reglas ---------- */
const Rules: React.FC = () => {
  const r = local(11.0);
  return (
    <Camera from={0} to={sec(1.8)} rotateY={[-16, -6]} rotateX={[10, 4]} zoom={[0.95, 1.05]}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <BlurIn at={r(11.0)} dur={12} from={0.9}>
          <Glass radius={48} rim={0.7} pad="48px 56px">
            <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 26 }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>Apps bloqueadas</div>
              <BlurIn at={r(11.2)} dur={10} from={1} y={20}>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ width: 110, height: 110, borderRadius: 28, background: "#1d1d20", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {I.lock(56)}
                  </div>
                  <div style={{ fontSize: 30, color: tone.muted }}>Scroll · Desbloquear</div>
                </div>
              </BlurIn>
              <BlurIn at={r(11.45)} dur={10} from={1} y={20}>
                <div style={{ fontSize: 32, fontWeight: 600, marginTop: 10 }}>Reglas ›</div>
              </BlurIn>
              <BlurIn at={r(11.65)} dur={10} from={1} y={20}>
                <div style={{ borderRadius: 30, padding: "26px 30px", background: "#18181b", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 26 }}>
                  {I.rule(96)}
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 600 }}>Horario laboral</div>
                    <div style={{ fontSize: 26, color: tone.muted, marginTop: 4 }}>Bloqueo · 9 a 18 h</div>
                  </div>
                </div>
              </BlurIn>
            </div>
          </Glass>
        </BlurIn>
      </AbsoluteFill>
    </Camera>
  );
};

/* ---------- 6 · 12.6–13.8 s · Empezar ---------- */
const Start: React.FC = () => {
  const r = local(12.6);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <ShimmerButton at={r(12.6)} pressAt={r(13.35)} width={640} height={124}>
        ▶&nbsp;&nbsp;Empezar
      </ShimmerButton>
    </AbsoluteFill>
  );
};

/* ---------- 7 · 13.8–16 s · Logo ---------- */
const Logo: React.FC = () => {
  const r = local(13.8);
  const frame = useCurrentFrame();
  const track = interpolate(frame - r(13.8), [0, 24], [24, -4], { ...clamp, easing: ease.out });
  const fade = interpolate(frame, [r(15.35), r(16)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fade }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <BlurIn at={r(13.8)} dur={16} from={0.6}>
          <PausaIcon size={150} />
        </BlurIn>
        <BlurIn at={r(13.9)} dur={18} from={1.3} blur={30}>
          <div style={{ fontFamily: ui, fontSize: 150, fontWeight: 700, color: tone.text, letterSpacing: track }}>Pausa</div>
        </BlurIn>
      </div>
      <BlurIn at={r(14.5)} dur={14} from={1} blur={12} style={{ marginTop: 30 }}>
        <div style={{ fontFamily: ui, fontSize: 40, fontWeight: 500, color: tone.muted }}>Menos pantalla. Más vida.</div>
      </BlurIn>
      <BlurIn at={r(15.0)} dur={12} from={1} blur={8} style={{ position: "absolute", bottom: 80 }}>
        <div style={{ fontFamily: ui, fontSize: 24, color: "#5a5a60", letterSpacing: 2 }}>pausa.app</div>
      </BlurIn>
    </AbsoluteFill>
  );
};

export const PausaPromo: React.FC = () => (
  <AbsoluteFill>
    <Spotlight />
    <Sequence name="Panel 3D" {...span(0, 3.0)}>
      <SoftScene enter={false}>
        <Dashboard />
      </SoftScene>
    </Sequence>
    <Sequence name="Semana" {...span(3.0, 4.6)}>
      <SoftScene>
        <Week />
      </SoftScene>
    </Sequence>
    <Sequence name="Bienestar" {...span(4.6, 8.8)}>
      <SoftScene>
        <Wellbeing />
      </SoftScene>
    </Sequence>
    <Sequence name="Bloqueo" {...span(8.8, 11.0)}>
      <SoftScene>
        <Block />
      </SoftScene>
    </Sequence>
    <Sequence name="Reglas" {...span(11.0, 12.6)}>
      <SoftScene>
        <Rules />
      </SoftScene>
    </Sequence>
    <Sequence name="Empezar" {...span(12.6, 13.8)}>
      <SoftScene>
        <Start />
      </SoftScene>
    </Sequence>
    <Sequence name="Logo" from={sec(13.8) - EDGE / 2} durationInFrames={PAUSA_DURATION - sec(13.8) + EDGE / 2}>
      <SoftScene exit={false}>
        <Logo />
      </SoftScene>
    </Sequence>

    {/* Música: "Trap Electro Vibes" (Mixkit, licencia libre para redes), recortada para que el drop caiga a los 3 s. */}
    <Audio
      src={staticFile("musica/trap-electro-vibes.mp3")}
      volume={(f) => interpolate(f, [0, sec(15), sec(16)], [0.9, 0.9, 0], clamp)}
    />
    <Sfx t={0.1} name="build" volume={0.12} />
    <Sfx t={3.0} name="impact" volume={0.32} />
    <Sfx t={3.7} name="ping" volume={0.18} />
    <Sfx t={4.6} name="sparkle" volume={0.22} />
    <Sfx t={4.78} name="pop" volume={0.2} />
    <Sfx t={5.92} name="pop" volume={0.18} />
    <Sfx t={6.47} name="pop" volume={0.18} />
    <Sfx t={7.2} name="swipe" volume={0.18} />
    <Sfx t={7.4} name="ping" volume={0.16} />
    <Sfx t={8.7} name="whoosh" volume={0.22} />
    <Sfx t={9.8} name="glitch" volume={0.2} />
    <Sfx t={10.18} name="impact" volume={0.24} />
    <Sfx t={10.9} name="swipe" volume={0.18} />
    <Sfx t={11.2} name="tick" volume={0.25} />
    <Sfx t={11.65} name="tick" volume={0.25} />
    <Sfx t={12.5} name="swipe" volume={0.18} />
    <Sfx t={13.35} name="click" volume={0.3} />
    <Sfx t={13.8} name="impact" volume={0.28} />
    <Sfx t={13.9} name="chime" volume={0.22} />
  </AbsoluteFill>
);
