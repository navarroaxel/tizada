import { pages } from "@/content/site";
import type { ExampleKind } from "@/content/types";
import { SHIRT_BACK, SHIRT_FRONT } from "./shapes";

const INK = "var(--graphite)";
const MUTED = "var(--muted)";
const ACCENT = "var(--chalk)";
const NOTCH = "var(--notch)";
const FONT = { fontFamily: "var(--font-schibsted)" } as const;

function Geometral() {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full">
      {[
        { x: 0, d: SHIRT_FRONT, label: "frente", neck: "M75 40 Q100 62 125 40" },
        { x: 200, d: SHIRT_BACK, label: "espalda", neck: "M75 40 Q100 48 125 40" },
      ].map((s) => (
        <g key={s.label} transform={`translate(${s.x} 0)`}>
          <path d={s.d} fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <g fill="none" stroke={INK} strokeWidth="1" strokeDasharray="4 3">
            <path d="M58 177 H142" />
            <path d="M22 108 L41 118" />
            <path d="M178 108 L159 118" />
            <path d={s.neck.replace(/ Q100 (\d+)/, (_, y) => ` Q100 ${Number(y) + 8}`)} />
          </g>
          <text x="100" y="208" textAnchor="middle" fontSize="14" fill={MUTED} style={FONT}>{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Ficha() {
  const rows = (ys: number[], x2: number) =>
    ys.map((y) => <line key={y} x1="235" y1={y} x2={x2} y2={y} stroke={MUTED} strokeWidth="1" />);
  return (
    <svg viewBox="0 0 400 270" className="h-auto w-full">
      <rect x="5" y="5" width="390" height="260" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="5" y="5" width="390" height="38" fill="none" stroke={INK} strokeWidth="1" />
      <text x="15" y="29" fontSize="14" fill={INK} style={FONT}>Cabecera: prenda, código, talles</text>
      <g transform="translate(15 52) scale(0.65)">
        <path d={SHIRT_FRONT} fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M38 190 H162" stroke={ACCENT} strokeWidth="2" />
        <path d="M30 195 V175 M170 195 V175" stroke={ACCENT} strokeWidth="2" />
      </g>
      <text x="15" y="198" fontSize="13" fill={INK} style={FONT}>Geometral acotado</text>
      <text x="235" y="64" fontSize="13" fill={INK} style={FONT}>Tabla de medidas</text>
      {rows([76, 94, 112, 130, 148], 380)}
      {[290, 320, 350, 380].map((x) => <line key={x} x1={x} y1="76" x2={x} y2="148" stroke={MUTED} strokeWidth="1" />)}
      <text x="235" y="176" fontSize="13" fill={INK} style={FONT}>Materiales y avíos</text>
      {rows([188, 206, 224], 385)}
      <text x="15" y="226" fontSize="13" fill={INK} style={FONT}>Variantes de color</text>
      {[15, 45, 75, 105].map((x, i) => (
        <rect key={x} x={x} y="234" width="24" height="24" fill={MUTED} opacity={0.25 + i * 0.2} stroke={INK} />
      ))}
    </svg>
  );
}

function Molde() {
  return (
    <svg viewBox="0 0 400 270" className="h-auto w-full">
      <defs>
        <pattern id="ex-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={MUTED} strokeWidth="0.4" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="270" fill="url(#ex-grid)" />
      <g transform="translate(-20 -15) scale(0.72)">
        <path d="M300 98 C288 62 258 50 233 50 L84 83 C106 132 106 172 93 206 L83 402 L300 402" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="6 5" />
        <path d="M300 110 C290 75 260 62 235 62 L90 95 C118 140 118 175 105 205 L95 390 L300 390 Z" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <line x1="300" y1="100" x2="300" y2="400" stroke={INK} strokeWidth="1.5" strokeDasharray="14 4 2 4" />
        <g stroke={INK} strokeWidth="2" fill={INK}>
          <line x1="200" y1="165" x2="200" y2="345" />
          <path d="M200 150 L194 168 L206 168 Z" />
          <path d="M200 360 L194 342 L206 342 Z" />
        </g>
        <text x="214" y="262" fontSize="18" fill={INK} style={FONT}>hilo</text>
        <text x="288" y="250" fontSize="18" fill={INK} style={FONT} transform="rotate(-90 288 250)" textAnchor="middle">doblez</text>
        <g stroke={NOTCH} strokeWidth="3.5" strokeLinecap="round">
          <line x1="162" y1="79" x2="160" y2="92" />
          <line x1="100" y1="300" x2="114" y2="301" />
        </g>
      </g>
      <rect x="300" y="40" width="70" height="70" fill="none" stroke={ACCENT} strokeWidth="2" />
      <text x="335" y="80" textAnchor="middle" fontSize="12" fill={ACCENT} style={FONT}>10 × 10 cm</text>
      <text x="335" y="128" textAnchor="middle" fontSize="12" fill={MUTED} style={FONT}>cuadrado de control</text>
    </svg>
  );
}

function Motif({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 7} r="8" fill={ACCENT} />
      <rect x={x - 5} y={y + 3} width="10" height="9" fill={NOTCH} />
    </g>
  );
}

function Rapport() {
  const T = 50;
  const panel = (ox: number, half: boolean, label: string, id: string) => (
    <g transform={`translate(${ox} 10)`}>
      <clipPath id={id}><rect width={T * 3} height={T * 3} /></clipPath>
      <g clipPath={`url(#${id})`}>
        {[0, 1, 2].flatMap((c) =>
          [0, 1, 2, 3].map((r) => {
            const shift = half && c % 2 === 1 ? T / 2 : 0;
            return <Motif key={`${c}-${r}`} x={c * T + T / 2} y={r * T + T / 2 - shift} />;
          }),
        )}
      </g>
      <rect width={T * 3} height={T * 3} fill="none" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
      {[1, 2].map((i) => <line key={i} x1={i * T} y1="0" x2={i * T} y2={T * 3} stroke={MUTED} strokeWidth="0.5" strokeDasharray="3 3" />)}
      <text x={T * 1.5} y={T * 3 + 22} textAnchor="middle" fontSize="13" fill={MUTED} style={FONT}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 200" className="h-auto w-full">
      {panel(20, false, "repetición directa", "ex-rapport-a")}
      {panel(230, true, "medio salto", "ex-rapport-b")}
    </svg>
  );
}

function Graduacion() {
  const sizes = [
    { k: 0.84, label: "S", c: MUTED },
    { k: 0.92, label: "M", c: ACCENT },
    { k: 1, label: "L", c: INK },
    { k: 1.08, label: "XL", c: NOTCH },
  ];
  return (
    <svg viewBox="0 0 400 230" className="h-auto w-full">
      <g transform="translate(60 5)">
        {sizes.map((s) => (
          <path
            key={s.label}
            d={SHIRT_FRONT}
            fill="none"
            stroke={s.c}
            strokeWidth="2"
            strokeLinejoin="round"
            transform={`translate(100 190) scale(${s.k}) translate(-100 -190)`}
          />
        ))}
      </g>
      {sizes.map((s, i) => (
        <g key={s.label} transform={`translate(300 ${60 + i * 26})`}>
          <line x1="0" y1="0" x2="24" y2="0" stroke={s.c} strokeWidth="3" />
          <text x="32" y="5" fontSize="14" fill={INK} style={FONT}>{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Tizada() {
  const piece = (x: number, y: number, w: number, h: number, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={ACCENT} fillOpacity="0.15" stroke={INK} strokeWidth="1.5" />
      <path d={`M${x + w / 2} ${y + 12} V${y + h - 12}`} stroke={INK} strokeWidth="1.5" />
      <path d={`M${x + w / 2} ${y + 8} l-4 8 h8 Z`} fill={INK} />
    </g>
  );
  return (
    <svg viewBox="0 0 400 260" className="h-auto w-full">
      <rect x="40" y="30" width="320" height="210" fill="none" stroke={INK} strokeWidth="2" />
      <line x1="40" y1="18" x2="360" y2="18" stroke={ACCENT} strokeWidth="1.5" />
      <path d="M40 12 V24 M360 12 V24" stroke={ACCENT} strokeWidth="1.5" />
      <text x="200" y="12" textAnchor="middle" fontSize="12" fill={ACCENT} style={FONT}>ancho de la tela: 150 cm</text>
      <line x1="372" y1="30" x2="372" y2="240" stroke={NOTCH} strokeWidth="1.5" />
      <path d="M366 30 H378 M366 240 H378" stroke={NOTCH} strokeWidth="1.5" />
      <text x="386" y="140" fontSize="12" fill={NOTCH} style={FONT} transform="rotate(90 386 140)" textAnchor="middle">largo = consumo</text>
      {[
        [50, 40, 90, 120],
        [150, 40, 90, 120],
        [250, 40, 100, 80],
        [250, 128, 100, 60],
        [50, 170, 70, 62],
        [130, 170, 50, 62],
        [190, 196, 80, 36],
      ].map(([x, y, w, h], i) => piece(x, y, w, h, String(i)))}
    </svg>
  );
}

function MapaTension() {
  return (
    <svg viewBox="0 0 400 230" className="h-auto w-full">
      <defs>
        <clipPath id="ex-shirt"><path d={SHIRT_FRONT} /></clipPath>
        <radialGradient id="ex-hot">
          <stop offset="0" stopColor="#d64545" />
          <stop offset="0.5" stopColor="#e8b830" />
          <stop offset="1" stopColor="#4aa36b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="translate(40 5)">
        <path d={SHIRT_FRONT} fill="#4aa36b" />
        <g clipPath="url(#ex-shirt)">
          <circle cx="60" cy="96" r="28" fill="url(#ex-hot)" />
          <circle cx="140" cy="96" r="28" fill="url(#ex-hot)" />
          <ellipse cx="100" cy="52" rx="26" ry="14" fill="url(#ex-hot)" opacity="0.7" />
        </g>
        <path d={SHIRT_FRONT} fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
      {[
        ["#4aa36b", "sin tensión"],
        ["#e8b830", "tensión moderada"],
        ["#d64545", "tensión alta"],
      ].map(([c, t], i) => (
        <g key={t} transform={`translate(260 ${70 + i * 28})`}>
          <rect width="18" height="18" fill={c} stroke={INK} />
          <text x="26" y="14" fontSize="13" fill={INK} style={FONT}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

function Manga() {
  return (
    <svg viewBox="0 0 400 270" className="h-auto w-full">
      {/* Armhole (sisa) of the body */}
      <path d="M70 20 C20 50 25 115 75 150" fill="none" stroke={INK} strokeWidth="2.5" />
      <text x="20" y="175" fontSize="13" fill={INK} style={FONT}>sisa</text>
      {/* Sleeve cap (copa) */}
      <path d="M180 150 C205 140 215 40 270 22 C325 40 335 140 360 150" fill="none" stroke={INK} strokeWidth="2.5" />
      <path d="M180 150 H360" stroke={MUTED} strokeWidth="1" strokeDasharray="4 3" />
      <text x="270" y="175" textAnchor="middle" fontSize="13" fill={INK} style={FONT}>copa</text>
      <g stroke={NOTCH} strokeWidth="3" strokeLinecap="round">
        <line x1="270" y1="22" x2="270" y2="36" />
        <line x1="42" y1="62" x2="54" y2="68" />
        <line x1="203" y1="136" x2="214" y2="142" />
      </g>
      {/* Length comparison */}
      <g transform="translate(40 205)">
        <rect width="150" height="12" fill={INK} opacity="0.85" />
        <text x="158" y="11" fontSize="13" fill={INK} style={FONT}>largo de la sisa</text>
        <rect y="22" width="150" height="12" fill={ACCENT} />
        <rect x="150" y="22" width="26" height="12" fill={NOTCH} />
        <text x="184" y="33" fontSize="13" fill={INK} style={FONT}>largo de la copa</text>
        <text x="163" y="52" textAnchor="middle" fontSize="13" fill={NOTCH} style={FONT}>embebido</text>
      </g>
    </svg>
  );
}

function MangaSastre() {
  const grain = (x: number) => (
    <g stroke={INK} strokeWidth="1.5" fill={INK}>
      <line x1={x} y1="80" x2={x} y2="190" />
      <path d={`M${x} 70 l-4 10 h8 Z`} />
    </g>
  );
  return (
    <svg viewBox="0 0 400 250" className="h-auto w-full">
      <g transform="translate(10 0)">
        <path d="M40 120 C50 40 110 10 160 30 C170 70 168 150 162 215 L52 215 C48 175 44 150 40 120 Z" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        {grain(105)}
        <g stroke={NOTCH} strokeWidth="3" strokeLinecap="round">
          <line x1="86" y1="23" x2="90" y2="35" />
          <line x1="42" y1="122" x2="54" y2="124" />
        </g>
        <text x="100" y="240" textAnchor="middle" fontSize="13" fill={INK} style={FONT}>pieza mayor (exterior)</text>
      </g>
      <g transform="translate(215 0)">
        <path d="M30 120 C25 80 55 45 90 40 C115 60 120 100 118 135 C118 170 120 195 118 215 L60 215 C52 175 36 150 30 120 Z" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        {grain(75)}
        <g stroke={NOTCH} strokeWidth="3" strokeLinecap="round">
          <line x1="32" y1="118" x2="44" y2="122" />
          <line x1="100" y1="48" x2="110" y2="56" />
        </g>
        <text x="80" y="240" textAnchor="middle" fontSize="13" fill={INK} style={FONT}>pieza menor (interior)</text>
      </g>
    </svg>
  );
}

function Pinzas() {
  const body = "M40 30 L110 20 C125 50 125 80 122 100 L118 200 L40 200 Z";
  const bust = { x: 75, y: 100 };
  const panel = (ox: number, label: string, dart: React.ReactNode) => (
    <g transform={`translate(${ox} 5)`}>
      <path d={body} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {dart}
      <circle cx={bust.x} cy={bust.y} r="4" fill={ACCENT} />
      <text x="81" y="96" fontSize="12" fill={ACCENT} style={FONT}>busto</text>
      <text x="80" y="232" textAnchor="middle" fontSize="13" fill={INK} style={FONT}>{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 250" className="h-auto w-full">
      {panel(20, "pinza de costado",
        <path d="M120 112 L82 102 L119 134" fill={NOTCH} fillOpacity="0.2" stroke={NOTCH} strokeWidth="2" strokeLinejoin="round" />,
      )}
      {panel(230, "pinza de cintura",
        <path d="M66 200 L78 108 L88 200" fill={NOTCH} fillOpacity="0.2" stroke={NOTCH} strokeWidth="2" strokeLinejoin="round" />,
      )}
      <g stroke={INK} fill={INK} strokeWidth="2">
        <line x1="170" y1="110" x2="220" y2="110" />
        <path d="M228 110 l-12 -6 v12 Z" />
      </g>
    </svg>
  );
}

function Pantalon() {
  const arrow = (x: number, y1: number, y2: number) => (
    <g stroke={ACCENT} strokeWidth="1.5" fill={ACCENT}>
      <line x1={x} y1={y1 + 2} x2={x} y2={y2 - 2} />
      <path d={`M${x} ${y1} l-4 9 h8 Z`} />
      <path d={`M${x} ${y2} l-4 -9 h8 Z`} />
    </g>
  );
  const grain = (
    <g stroke={INK} strokeWidth="1.5" fill={INK}>
      <line x1="94" y1="125" x2="94" y2="215" />
      <path d="M94 113 l-4 10 h8 Z" />
      <path d="M94 227 l-4 -10 h8 Z" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 240" className="h-auto w-full">
      {/* Front */}
      <g transform="translate(10 5) scale(0.8)">
        <path d="M60 20 L140 20 L148 90 L134 235 L78 235 L74 145 C72 122 64 112 52 104 L60 20 Z" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M92 20 L97 62 L103 20" fill={NOTCH} fillOpacity="0.2" stroke={NOTCH} strokeWidth="2" strokeLinejoin="round" />
        <path d="M128 20 C122 45 128 62 143 68" fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="5 3" />
        {grain}
        {arrow(34, 20, 104)}
        <g stroke={MUTED} strokeWidth="1.2" strokeDasharray="3 3">
          <line x1="140" y1="20" x2="170" y2="20" />
          <line x1="148" y1="90" x2="170" y2="90" />
          <line x1="134" y1="235" x2="170" y2="235" />
          <line x1="143" y1="68" x2="170" y2="68" />
        </g>
      </g>
      {/* Back: longer rise, slanted centre back, longer dart */}
      <g transform="translate(200 5) scale(0.8)">
        <path d="M60 20 L142 12 L158 112 C140 124 128 140 126 150 L122 235 L66 235 L52 90 Z" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M90 17 L98 90 L108 14" fill={NOTCH} fillOpacity="0.2" stroke={NOTCH} strokeWidth="2" strokeLinejoin="round" />
        {grain}
        {arrow(176, 12, 112)}
      </g>
      <g fontSize="13" fill={INK} style={FONT}>
        <text x="146" y="25">cintura</text>
        <text x="146" y="63">bolsillo</text>
        <text x="146" y="81">cadera</text>
        <text x="146" y="197">bajo</text>
        <text x="88" y="76" textAnchor="middle" fill={NOTCH}>pinza</text>
        <text x="284" y="100" textAnchor="middle" fill={NOTCH}>pinza</text>
        <text x="90" y="222" textAnchor="middle" fill={MUTED}>delantero</text>
        <text x="284" y="222" textAnchor="middle" fill={MUTED}>espalda</text>
        <text x="30" y="52" textAnchor="end" fill={ACCENT}>tiro</text>
        <text x="347" y="52" fill={ACCENT}>tiro</text>
      </g>
    </svg>
  );
}

const FIGURES: Record<ExampleKind, () => React.JSX.Element> = {
  geometral: Geometral,
  ficha: Ficha,
  molde: Molde,
  rapport: Rapport,
  graduacion: Graduacion,
  tizada: Tizada,
  "mapa-tension": MapaTension,
  manga: Manga,
  "manga-sastre": MangaSastre,
  pinzas: Pinzas,
  pantalon: Pantalon,
};

export function ExampleFigure({ kind, caption }: { kind: ExampleKind; caption: string }) {
  const Figure = FIGURES[kind];
  return (
    <figure aria-label={caption} className="mt-8 max-w-xl rounded border border-line bg-surface p-4">
      <div role="img" aria-label={caption}>
        <Figure />
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        <strong>{pages.week.exampleNote}.</strong> {caption}
      </figcaption>
    </figure>
  );
}
