import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { body, clamp, colors, display, easeInOut, easeOut } from "../brand";
import { H30Logo, H30Wordmark } from "../Logo";
import { Sticker, Tape, Words } from "../ui";
import {
  BagIcon,
  CartIcon,
  HelpIcon,
  InstagramIcon,
  PayIcon,
  PinIcon,
  WhatsAppIcon,
} from "./icons";

/** Segundos de la voz en off -> fotogramas relativos al inicio de la escena. */
export const FPS = 30;
const rel = (sceneStart: number, sec: number) => Math.round((sec - sceneStart) * FPS);

const headline: React.CSSProperties = {
  fontFamily: display,
  fontWeight: 900,
  fontSize: 120,
  lineHeight: 1.05,
  color: colors.text,
  letterSpacing: -1,
  textAlign: "center",
};

const support: React.CSSProperties = {
  fontFamily: body,
  fontWeight: 300,
  fontSize: 56,
  color: colors.muted,
  textAlign: "center",
};

/** Zona segura de Reels/TikTok: deja libres la parte superior, inferior y el lateral derecho. */
const Safe: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      padding: "260px 110px 420px 90px",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Entrada y salida de cada escena: sube con desenfoque y sale hacia arriba. */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  exit?: "up" | "left" | "zoom" | "none";
}> = ({ children, exit = "up" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], {
    ...clamp,
    easing: easeInOut,
  });
  const moves = {
    up: { translate: `0px ${-120 * out}px`, scale: 1 },
    left: { translate: `${-260 * out}px 0px`, scale: 1 },
    zoom: { translate: "0px 0px", scale: 1 + 0.25 * out },
    none: { translate: "0px 0px", scale: 1 },
  }[exit];
  return (
    <AbsoluteFill
      style={{
        opacity: exit === "none" ? 1 : 1 - out,
        filter: `blur(${12 * out}px)`,
        ...moves,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Pop: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: number;
}> = ({ delay, children, style, from = 0.4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 150 } });
  return (
    <div
      style={{
        scale: interpolate(p, [0, 1], [from, 1]),
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Subrayado naranja que se dibuja debajo de una palabra clave. */
const Underline: React.FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: 14,
        width,
        borderRadius: 7,
        backgroundColor: colors.orange,
        marginTop: 10,
        scale: `${interpolate(frame - delay, [0, 14], [0, 1], { ...clamp, easing: easeOut })} 1`,
        transformOrigin: "left",
      }}
    />
  );
};

/* 1 · 0.0–7.4 s · "Hola, soy franquiciado… esta es MI ferretería, acá en Puerto Iguazú" */
const S1 = 0;
export const Saludo: React.FC = () => (
  <>
    <Safe>
      <H30Logo size={360} />
      <Words
        text="¡Hola! Soy *franquiciado de H30"
        delay={rel(S1, 0.8)}
        stagger={4}
        style={{ ...support, color: colors.text, fontWeight: 400, marginTop: 70 }}
      />
      <Words
        text="Esta es"
        delay={rel(S1, 4.2)}
        style={{ ...support, fontSize: 60, marginTop: 80 }}
      />
      <Pop delay={rel(S1, 5.0)} from={1.6}>
        <div style={{ ...headline, fontSize: 150, color: colors.orange, marginTop: 4 }}>MI</div>
      </Pop>
      <Words text="ferretería" delay={rel(S1, 5.26)} style={{ ...headline, fontSize: 120 }} />
      <Pop delay={rel(S1, 6.4)} style={{ marginTop: 60 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "18px 40px 18px 18px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "2px solid rgba(255,255,255,0.12)",
          }}
        >
          <PinIcon size={72} />
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 46, color: colors.text }}>
            Puerto Iguazú
          </span>
        </div>
      </Pop>
    </Safe>
  </>
);

/* 2 · 7.4–12.3 s · "Mi negocio es parte de una cadena con 25 locales en 8 provincias" */
const S2 = 7.4;
const Counter: React.FC<{ value: number; delay: number; label: string }> = ({
  value,
  delay,
  label,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 22], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 30,
        opacity: interpolate(frame - delay, [0, 8], [0, 1], clamp),
        translate: `0px ${interpolate(p, [0, 1], [40, 0])}px`,
      }}
    >
      <span
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 220,
          color: colors.orange,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          minWidth: 300,
          textAlign: "right",
        }}
      >
        {Math.round(value * p)}
      </span>
      <span style={{ fontFamily: display, fontWeight: 600, fontSize: 64, color: colors.text }}>
        {label}
      </span>
    </div>
  );
};

export const Cadena: React.FC = () => (
  <>
    <Safe>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Words text="MI negocio" style={{ ...headline, fontSize: 110 }} />
        <Underline delay={rel(S2, 7.9)} width={330} />
      </div>
      <Words
        text="es parte de una cadena con"
        delay={rel(S2, 8.24)}
        stagger={3}
        style={{ ...support, marginTop: 50 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 40, marginTop: 90 }}>
        <Counter value={25} delay={rel(S2, 9.5)} label="locales" />
        <Counter value={8} delay={rel(S2, 11.0)} label="provincias" />
      </div>
    </Safe>
  </>
);

/* 3 · 12.3–18.3 s · "¿Y cómo funciona? Es autoservicio. Elegís, pagás y te lo llevás." */
const S3 = 12.3;
const StepCard: React.FC<{
  delay: number;
  n: number;
  word: string;
  icon: React.ReactNode;
}> = ({ delay, n, word, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        width: 820,
        padding: "30px 44px",
        borderRadius: 36,
        backgroundColor: "rgba(255,255,255,0.05)",
        border: "2px solid rgba(255,255,255,0.1)",
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        translate: `${interpolate(p, [0, 1], [180, 0])}px 0px`,
      }}
    >
      <span style={{ fontFamily: display, fontSize: 40, color: colors.grayLight, width: 40 }}>{n}</span>
      <div style={{ scale: interpolate(p, [0, 1], [0.3, 1]), rotate: `${interpolate(p, [0, 1], [-30, 0])}deg` }}>
        {icon}
      </div>
      <span style={{ fontFamily: display, fontWeight: 900, fontSize: 92, color: colors.text }}>
        {word}
      </span>
    </div>
  );
};

export const Autoservicio: React.FC = () => (
  <>
    <Safe>
      <Words text="¿Y cómo funciona?" style={{ ...support, color: colors.text, fontSize: 62 }} />
      <Pop delay={rel(S3, 13.9)} from={1.8} style={{ marginTop: 26 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 104,
            color: colors.white,
            backgroundColor: colors.orange,
            padding: "14px 40px 22px",
            rotate: "-3deg",
            boxShadow: "12px 14px 0 rgba(0,0,0,0.35)",
          }}
        >
          AUTOSERVICIO
        </div>
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 110 }}>
        <StepCard delay={rel(S3, 15.2)} n={1} word="Elegís" icon={<CartIcon size={130} />} />
        <StepCard delay={rel(S3, 16.3)} n={2} word="Pagás" icon={<PayIcon size={130} />} />
        <StepCard delay={rel(S3, 17.5)} n={3} word="¡Llevás!" icon={<BagIcon size={130} />} />
      </div>
    </Safe>
  </>
);

/* 4 · 18.3–23.4 s · "Recorrés las góndolas, tenés todo a la vista… te ayudamos." */
const S4 = 18.3;
const SHELF_COLORS = [
  colors.buloneria,
  colors.orange,
  colors.plomeria,
  colors.electricidad,
  colors.herramientas,
  colors.orange,
  colors.grayLight,
];

const Gondola: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shelves = [0, 1, 2];
  return (
    <div
      style={{
        width: 760,
        padding: "34px 34px 0",
        borderRadius: "28px 28px 0 0",
        border: `6px solid ${colors.gray}`,
        borderBottom: "none",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {shelves.map((s) => (
        <div key={s} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 150, padding: "0 10px" }}>
            {SHELF_COLORS.map((c, i) => {
              const k = s * SHELF_COLORS.length + i;
              const p = spring({ frame: frame - delay - k * 1.6, fps, config: { damping: 12 } });
              const h = 70 + ((k * 37) % 60);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: h,
                    borderRadius: 10,
                    backgroundColor: SHELF_COLORS[(i + s * 2) % SHELF_COLORS.length],
                    opacity: 0.92,
                    scale: `1 ${p}`,
                    transformOrigin: "bottom",
                  }}
                />
              );
            })}
          </div>
          <div style={{ height: 12, borderRadius: 6, backgroundColor: colors.gray, marginBottom: 26 }} />
        </div>
      ))}
    </div>
  );
};

export const Gondolas: React.FC = () => (
  <>
    <Safe>
      <Words text="Recorrés las góndolas" style={{ ...support, color: colors.text, fontWeight: 400 }} />
      <Words
        text="todo a la *vista"
        delay={rel(S4, 19.7)}
        style={{ ...headline, fontSize: 104, marginTop: 14 }}
      />
      <div style={{ marginTop: 70 }}>
        <Gondola delay={rel(S4, 18.9)} />
      </div>
      <Pop delay={rel(S4, 21.2)} style={{ marginTop: -60 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "22px 46px 22px 22px",
            borderRadius: 999,
            backgroundColor: colors.white,
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            rotate: "-2deg",
          }}
        >
          <HelpIcon size={96} />
          <span style={{ fontFamily: display, fontWeight: 600, fontSize: 42, color: colors.gray, whiteSpace: "nowrap" }}>
            ¿Una mano? <span style={{ color: colors.orange }}>Te ayudamos</span>
          </span>
        </div>
      </Pop>
    </Safe>
  </>
);

/* 5 · 23.4–35.0 s · "Tenemos TODOS los rubros…" — cada ícono aparece cuando se nombra */
const S5 = 23.4;
const RUBROS: { file: string; label: string; color: string; at: number }[] = [
  { file: "pintureria", label: "Pinturería", color: colors.orange, at: 25.3 },
  { file: "buloneria", label: "Bulonería", color: colors.buloneria, at: 26.2 },
  { file: "plomeria", label: "Plomería", color: colors.plomeria, at: 27.1 },
  { file: "electricidad", label: "Electricidad", color: colors.electricidad, at: 28.0 },
  { file: "iluminacion", label: "Iluminación", color: colors.electricidad, at: 29.0 },
  { file: "libreria", label: "Librería", color: colors.herramientas, at: 30.1 },
  { file: "herramientas", label: "Herramientas manuales", color: colors.herramientas, at: 31.0 },
  { file: "electricas", label: "Herramientas eléctricas", color: colors.herramientas, at: 32.1 },
  { file: "insumos", label: "Insumos de ferretería", color: colors.grayLight, at: 33.0 },
];

const RubroTile: React.FC<{ file: string; label: string; color: string; delay: number }> = ({
  file,
  label,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 140 } });
  const glow = interpolate(frame - delay, [0, 6, 24], [0, 1, 0], clamp);
  return (
    <div
      style={{
        width: 270,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
      }}
    >
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: "50%",
          scale: p,
          rotate: `${interpolate(p, [0, 1], [-30, 0])}deg`,
          boxShadow: `0 0 0 8px ${color}, 0 0 ${60 * glow}px ${20 * glow}px rgba(240,130,36,0.6)`,
        }}
      >
        <Img src={staticFile(`icons/${file}.svg`)} style={{ width: 190, height: 190 }} />
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: 30,
          lineHeight: 1.2,
          color: colors.text,
          textAlign: "center",
          minHeight: 72,
          translate: `0px ${interpolate(p, [0, 1], [16, 0])}px`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Rubros: React.FC = () => (
  <>
    <Safe style={{ justifyContent: "flex-start", paddingTop: 300 }}>
      <Words text="Tenemos" style={{ ...support, color: colors.text, fontSize: 60 }} />
      <Words
        text="*TODOS los rubros"
        delay={rel(S5, 24.0)}
        stagger={5}
        style={{ ...headline, fontSize: 100, marginTop: 6 }}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 24,
          rowGap: 36,
          marginTop: 80,
          width: 880,
        }}
      >
        {RUBROS.map((r) => (
          <RubroTile key={r.file} {...r} delay={rel(S5, r.at)} />
        ))}
      </div>
    </Safe>
  </>
);

/* 6 · 35.0–38.4 s · "Sea cual sea el problema, acá tenemos la solución." */
const S6 = 35.0;
const SolucionInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slap = spring({ frame: frame - rel(S6, 37.0), fps, config: { damping: 11, stiffness: 170 } });
  const tapeIn = (d: number) =>
    interpolate(frame - d, [0, 16], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <>
      <Tape
        offset={-frame * 3}
        style={{
          width: 1800,
          left: -360,
          top: 1180,
          rotate: "-12deg",
          clipPath: `inset(0 ${100 - tapeIn(rel(S6, 36.8)) * 100}% 0 0)`,
        }}
      />
      <Tape
        color={colors.gray}
        offset={frame * 3 - 400}
        style={{
          width: 1800,
          left: -360,
          top: 1330,
          rotate: "8deg",
          clipPath: `inset(0 0 0 ${100 - tapeIn(rel(S6, 37.0)) * 100}%)`,
        }}
      />
      <Safe style={{ justifyContent: "flex-start", paddingTop: 420 }}>
        <Words text="Sea cual sea" style={{ ...support, color: colors.text, fontSize: 66 }} />
        <Words
          text="el *problema,"
          delay={rel(S6, 35.8)}
          style={{ ...headline, fontSize: 112, marginTop: 6 }}
        />
        <Words text="acá tenemos la" delay={rel(S6, 36.8)} style={{ ...support, marginTop: 40 }} />
        <div
          style={{
            marginTop: 50,
            scale: interpolate(slap, [0, 1], [2.6, 1]),
            opacity: interpolate(slap, [0, 0.2], [0, 1], clamp),
          }}
        >
          <Sticker scale={1.05} />
        </div>
      </Safe>
    </>
  );
};

export const Solucion: React.FC = () => (
  <>
    <SolucionInner />
  </>
);

/* 7 · 38.4 s–fin · Dirección, Instagram, WhatsApp y "¡Vení a visitarnos!" */
const S7 = 38.4;
const ContactRow: React.FC<{
  delay: number;
  icon: React.ReactNode;
  label: string;
  value: string;
  valueDelay?: number;
}> = ({ delay, icon, label, value, valueDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 140 } });
  const v = interpolate(frame - delay - valueDelay, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 34,
        width: 860,
        padding: "28px 36px",
        borderRadius: 36,
        backgroundColor: "rgba(255,255,255,0.05)",
        border: "2px solid rgba(255,255,255,0.1)",
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        translate: `0px ${interpolate(p, [0, 1], [60, 0])}px`,
      }}
    >
      <div style={{ scale: p }}>{icon}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: body, fontSize: 34, color: colors.muted }}>{label}</span>
        <span
          style={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: 50,
            color: colors.text,
            opacity: v,
            translate: `${interpolate(v, [0, 1], [-20, 0])}px 0px`,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

const VisitButton: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 160 } });
  const pulse = frame > delay + 20 ? interpolate(Math.sin((frame - delay) / 6), [-1, 1], [1, 1.04]) : 1;
  return (
    <div
      style={{
        marginTop: 70,
        scale: p * pulse,
        fontFamily: display,
        fontWeight: 900,
        fontSize: 64,
        color: colors.white,
        backgroundColor: colors.orange,
        padding: "34px 70px",
        borderRadius: 999,
        boxShadow: `0 0 ${interpolate(pulse, [1, 1.04], [30, 70])}px rgba(240,130,36,0.55)`,
      }}
    >
      ¡Vení a visitarnos!
    </div>
  );
};

export const Contacto: React.FC = () => (
  <>
    <Safe style={{ justifyContent: "flex-start", paddingTop: 250 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        <H30Logo size={190} />
        <Words
          text="¡Te *esperamos!"
          delay={rel(S7, 38.5)}
          style={{ ...headline, fontSize: 84, textAlign: "left", justifyContent: "flex-start", width: 520 }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 70 }}>
        <ContactRow
          delay={rel(S7, 39.1)}
          icon={<PinIcon size={110} />}
          label="Dirección"
          value="Av. República Argentina 95"
          valueDelay={6}
        />
        <ContactRow
          delay={rel(S7, 42.3)}
          icon={<InstagramIcon size={110} />}
          label="Instagram"
          value="@h30puertoiguazu"
          valueDelay={rel(42.3, 43.6)}
        />
        <ContactRow
          delay={rel(S7, 46.0)}
          icon={<WhatsAppIcon size={110} />}
          label="WhatsApp"
          value="3757-200118"
          valueDelay={rel(46.0, 47.0)}
        />
      </div>
      <VisitButton delay={rel(S7, 50.8)} />
      <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 18, opacity: 0.75 }}>
        <H30Wordmark height={34} />
        <span style={{ fontFamily: display, fontSize: 26, letterSpacing: 6, color: colors.muted }}>
          PUERTO IGUAZÚ
        </span>
      </div>
    </Safe>
  </>
);
