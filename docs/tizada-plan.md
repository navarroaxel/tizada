# Implementation plan (for Claude Code)

> Commit this file as `docs/tizada-plan.md` and ask Claude Code to execute it phase by phase.
> **Code, comments, commit messages and file names: English. All user-facing page content: Spanish (es-AR).**

## 1. Goal

Build a static study site that hosts a self-paced course on **digital fashion pattern making** (patronaje y digitalización de moldes), split into two levels:

| Level | Weeks | Focus |
| --- | --- | --- |
| Principiante | 10 | Same syllabus as UTN BA "Herramientas Digitales Básicas para Diseño de Indumentaria" (geometral, ficha técnica, rapport, figurín) + base pattern digitization |
| Intermedio | 12 | Parametric pattern making in Seamly2D, grading, DXF-AAMA export, markers, 3D simulation in CLO 3D |

The site must let the learner:

1. See the whole roadmap at a glance.
2. Open a week and find: topics, practice, deliverable, curated free resources, and one-click YouTube searches.
3. Mark weeks as done (progress stored in the browser).
4. Browse all resources and the garment library independently of the weekly plan.

Non-goals (v1): accounts, backend, CMS, comments, payments.

## 2. Stack and decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Same stack as the other educational projects |
| Styling | Tailwind CSS | Same as other projects; tokens defined once in CSS variables |
| Content | Typed TS modules in `content/` | Content is small and structured; type safety catches broken references (e.g. unknown resource id) at build time |
| Rendering | Fully static (SSG via `generateStaticParams`) | Free Vercel tier, instant loads, no server |
| Math | KaTeX (`katex` + `react-katex` or a tiny wrapper) | Renders LaTeX formulas (e.g. circle skirt radius) |
| Progress | `localStorage` via a small client hook | No backend needed |
| Hosting | Vercel, auto-deploy from `main` | Preview deploy per PR |
| Quality | ESLint, `tsc --noEmit`, a link-check script, Playwright smoke test | Resources are external links that rot; check them in CI |

Pin exact dependency versions in `package.json` (no `^`/`~`), and do not install any package version published less than 14 days ago.

## 3. Design direction

Subject: a pattern-maker's workbench. The one memorable element is the **hero: an SVG pattern piece (T-shirt front) drawn on a cutting-mat grid**, with the real vocabulary of a pattern — grain line arrow, notches, dashed seam allowance, fold line. Everything else stays quiet and readable.

Tokens (define as CSS variables in `app/globals.css`, expose to Tailwind):

| Token | Hex | Use |
| --- | --- | --- |
| `--mat` | `#1F4E45` | Cutting-mat green: hero background, primary buttons |
| `--mat-grid` | `#5E9384` | Grid lines on the mat |
| `--paper` | `#FBFBF8` | Page background (pattern paper) |
| `--graphite` | `#22262A` | Body text, pattern lines |
| `--chalk` | `#2F67A8` | Links, focus ring (tailor's chalk blue) |
| `--notch` | `#C23A2E` | Notch marks, "done" state, sparingly |

Dark mode: swap `--paper` → `#14201D`, `--graphite` → `#E8ECEA`, keep `--mat` as surfaces.

Type: **Schibsted Grotesk** (headings, UI) + **Literata** (long-form body). Sentence case everywhere, no all-caps labels, no eyebrow text above headings. Body line length ≤ 72ch.

Numbering is legitimate here because weeks are a real sequence: show week numbers as large numerals in the roadmap; nowhere else.

Quality floor: responsive to 360 px, visible keyboard focus (chalk-blue ring), `prefers-reduced-motion` respected, WCAG AA contrast. Motion: only the hero pattern draws its outline once on load (stroke-dashoffset), skipped under reduced motion.

## 4. Routes

| Route | Content (Spanish) |
| --- | --- |
| `/` | Hero, what the course is, two level cards, overall progress |
| `/principiante` | Level intro, modules 1–2, week roadmap |
| `/intermedio` | Level intro, modules 3–4, week roadmap |
| `/[level]/semana/[week]` | Week detail: topics, practice, deliverable, resources, YouTube searches, done toggle, prev/next |
| `/recursos` | All resources, filterable by type (guía, curso, video, herramienta) and level |
| `/prendas` | Garment library (which base each garment builds on) |
| `/herramientas` | Software + physical materials + setup checklist |
| `/acerca` | Why this course exists, relation to the UTN syllabus, sources |

## 5. Project structure

```
tizada/
  app/
    layout.tsx
    globals.css
    page.tsx
    [level]/page.tsx
    [level]/semana/[week]/page.tsx
    recursos/page.tsx
    prendas/page.tsx
    herramientas/page.tsx
    acerca/page.tsx
    not-found.tsx
  components/
    PatternHero.tsx
    WeekRoadmap.tsx
    WeekDetail.tsx
    ResourceList.tsx
    YouTubeSearchLinks.tsx
    DoneToggle.tsx
    ProgressBar.tsx
    Formula.tsx
    SiteHeader.tsx
    SiteFooter.tsx
  content/
    types.ts
    resources.ts
    weeks.ts
    garments.ts
    tools.ts
    site.ts
  lib/
    progress.ts
    youtube.ts
    content.ts
  scripts/
    check-links.ts
  tests/
    smoke.spec.ts
  docs/
    tizada-plan.md
  CLAUDE.md
```

## 6. Data model

```ts
// content/types.ts

/** Course level slug, also used as the first route segment. */
export type LevelSlug = "principiante" | "intermedio";

export type ResourceKind = "guia" | "curso" | "video" | "herramienta" | "referencia";

export interface Resource {
  /** Stable id referenced from weeks. Never rename once published. */
  id: string;
  title: string; // Spanish
  url: string;
  kind: ResourceKind;
  /** Short Spanish description of what the learner gets from it. */
  note: string;
  /** Spanish, e.g. "Gratis", "Gratis durante la prueba de 30 días". */
  cost: string;
  language: "es" | "en";
}

export interface Module {
  id: string;
  level: LevelSlug;
  title: string; // Spanish
  summary: string; // Spanish
}

export interface Week {
  level: LevelSlug;
  /** 1-based number within the level; used in the URL. */
  number: number;
  moduleId: string;
  title: string;
  topics: string[];
  practice: string;
  deliverable: string;
  /** Ids from content/resources.ts. Validated at build time. */
  resourceIds: string[];
  /** Plain search queries; rendered as YouTube search links. */
  youtubeQueries: string[];
  /** Optional LaTeX formulas shown in the week page. */
  formulas?: { label: string; tex: string }[];
}

export interface Garment {
  name: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  base: string;
  adds: string;
}
```

## 7. Seed content (Spanish)

### 7.1 Resources

```ts
// content/resources.ts
import type { Resource } from "./types";

export const resources: Resource[] = [
  {
    id: "adobe-tshirt",
    title: "Adobe: diseñar una remera en Illustrator",
    url: "https://www.adobe.com/co/learn/illustrator/web/design-a-tshirt",
    kind: "guia",
    note: "Primer flujo vectorial sobre una prenda.",
    cost: "Gratis (requiere Illustrator o su prueba; con Inkscape seguís la misma lógica)",
    language: "en",
  },
  {
    id: "inti-remera",
    title: "INTI: manual de confección de remera manga larga y corta",
    url: "https://www.argentina.gob.ar/normativa/269999_res1162_pdf/archivo",
    kind: "referencia",
    note: "Ficha técnica real: geometral, costuras, máquinas y curva de talles.",
    cost: "Gratis",
    language: "es",
  },
  {
    id: "inti-guardapolvo",
    title: "INTI: manual de confección de guardapolvo unisex",
    url: "https://www.argentina.gob.ar/normativa/270000_disp1172_pdf/archivo",
    kind: "referencia",
    note: "Segundo ejemplo de ficha técnica, con cuello, solapa y ojales.",
    cost: "Gratis",
    language: "es",
  },
  {
    id: "cursa-patronaje-cero",
    title: "Cursa: Patronaje desde cero",
    url: "https://cursa.app/es/curso-gratis/patronaje-desde-cero-cgdg",
    kind: "curso",
    note: "44 h en video sobre medidas y trazado de moldes base, con ejercicios y certificado.",
    cost: "Gratis",
    language: "es",
  },
  {
    id: "cursa-corte-confeccion",
    title: "Cursa: Patronaje, corte y confección",
    url: "https://cursa.app/es/curso-gratis/patronaje-corte-y-confeccion-cgcc",
    kind: "curso",
    note: "18 h: toma de medidas, patrones y costura.",
    cost: "Gratis",
    language: "es",
  },
  {
    id: "adobe-geometric-pattern",
    title: "Adobe: patrón geométrico en Illustrator",
    url: "https://www.adobe.com/ar/learn/illustrator/web/geometric-pattern",
    kind: "guia",
    note: "Motivo repetible aplicado como muestra, base del rapport.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "adobe-create-pattern",
    title: "Adobe: crear un patrón repetible",
    url: "https://www.adobe.com/learn/illustrator/web/create-pattern",
    kind: "guia",
    note: "Guía oficial de la herramienta de motivos de Illustrator.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "creativebloq-pattern",
    title: "Creative Bloq: patrones repetibles en Illustrator",
    url: "https://creativebloq.com/adobe/repeating-pattern-illustrator-71412467",
    kind: "guia",
    note: "Tipos de mosaico de Opciones de motivo: cuadrícula, ladrillo, hexagonal.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "digitalfabrics-halfdrop",
    title: "Digital Fabrics: rapport de medio salto en Illustrator",
    url: "https://www.digitalfabrics.com.au/?p=6508",
    kind: "guia",
    note: "Medio salto pensado para tela, trabajado en centímetros.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "adobe-fashion-illustration",
    title: "Adobe: ilustración de moda",
    url: "https://www.adobe.com/co/learn/illustrator/web/fashion-illustration",
    kind: "guia",
    note: "Figurín con líneas, paletas y estampados.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "seamly-start-to-finish",
    title: "Seamly2D: tutorial de principio a fin",
    url: "https://wiki.seamly.io/wiki/UserManual:StartToFinish?oldid=4466",
    kind: "guia",
    note: "Archivo de medidas, puntos por fórmula, variables y despiece de una prenda simple.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "seamly-blocks",
    title: "Seamly2D: tutoriales de bases",
    url: "https://wiki.seamly.io/wiki/Block_Pattern_tutorials",
    kind: "guia",
    note: "Bases de cuerpo y manga paso a paso con un sistema de trazado.",
    cost: "Gratis",
    language: "en",
  },
  {
    id: "cursa-computarizado",
    title: "Cursa: Patronaje computarizado",
    url: "https://cursa.app/es/curso-gratis/patronaje-computarizado-para-la-creacion-de-ropa-egjh",
    kind: "curso",
    note: "Moldes digitales listos para confección sobre prendas reales.",
    cost: "Gratis",
    language: "es",
  },
  {
    id: "ley-talles",
    title: "Proyecto de informe sobre la ley de talles 27.521",
    url: "https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2024/PDF2024/TP2024/4196-D-2024.pdf",
    kind: "referencia",
    note: "Contexto del sistema único de talles y del estudio antropométrico del INTI.",
    cost: "Gratis",
    language: "es",
  },
  {
    id: "clo-academy",
    title: "CLO Academy",
    url: "https://support.clo3d.com/hc/en-us/articles/40454245087129",
    kind: "curso",
    note: "Cursos oficiales de CLO, incluidos con la prueba gratuita.",
    cost: "Gratis durante la prueba de 30 días",
    language: "en",
  },
  {
    id: "futurelearn-clo",
    title: "FutureLearn: guía de CLO 3D para principiantes",
    url: "https://futurelearn.com/courses/fashion-technology-a-beginners-guide-to-clo-3d",
    kind: "curso",
    note: "Interfaz y fundamentos de CLO 3D.",
    cost: "Acceso gratuito limitado",
    language: "en",
  },
  {
    id: "freesewing",
    title: "FreeSewing",
    url: "https://github.com/freesewing/pattern",
    kind: "herramienta",
    note: "Patrones a medida escritos en JavaScript, con márgenes automáticos y salida SVG.",
    cost: "Gratis, open source",
    language: "en",
  },
  {
    id: "utn-curso",
    title: "UTN BA: Herramientas Digitales Básicas para Diseño de Indumentaria",
    url: "https://sceu.frba.utn.edu.ar/e-learning/detalle/curso/185675/herramientas-digitales-basicas-para-diseno-de-indumentaria-illustrator-y-photoshop",
    kind: "referencia",
    note: "Temario de referencia del nivel principiante.",
    cost: "Referencia (no hace falta cursarlo)",
    language: "es",
  },
];
```

### 7.2 Modules and weeks

```ts
// content/weeks.ts
import type { Module, Week } from "./types";

export const modules: Module[] = [
  { id: "m1", level: "principiante", title: "Lenguaje vectorial", summary: "Illustrator para geometrales, fichas técnicas y el primer molde digital." },
  { id: "m2", level: "principiante", title: "Lenguaje de imágenes", summary: "Photoshop e Illustrator para color, estampados, rapport y figurín." },
  { id: "m3", level: "intermedio", title: "Patronaje paramétrico", summary: "Moldes definidos por fórmulas en Seamly2D: bases, pinzas, mangas y transformaciones." },
  { id: "m4", level: "intermedio", title: "Producción y 3D", summary: "Despiece, graduación, tizada, exportación y simulación en CLO 3D." },
];

export const weeks: Week[] = [
  // --- Principiante · Módulo 1 ---
  {
    level: "principiante", number: 1, moduleId: "m1",
    title: "Entorno digital",
    topics: ["Interfaces de Illustrator y Photoshop", "Mesas de trabajo, unidades y resolución", "Mapa de bits vs vector"],
    practice: "Configurar plantillas A4 y A3 en cm; exportar el mismo dibujo en PNG y SVG y comparar al ampliar.",
    deliverable: "Plantillas propias guardadas.",
    resourceIds: ["adobe-tshirt", "utn-curso"],
    youtubeQueries: ["Illustrator desde cero herramienta pluma", "vector vs mapa de bits explicado"],
  },
  {
    level: "principiante", number: 2, moduleId: "m1",
    title: "Herramientas básicas de Illustrator",
    topics: ["Pluma y curvatura", "Buscatrazos", "Reflejar y desplazar trazado", "Capas y alinear"],
    practice: "Calcar 10 siluetas de prendas desde fotos; armar media prenda y espejarla.",
    deliverable: "Biblioteca de siluetas.",
    resourceIds: ["adobe-tshirt"],
    youtubeQueries: ["geometral remera Illustrator", "fashion flats Illustrator t-shirt"],
  },
  {
    level: "principiante", number: 3, moduleId: "m1",
    title: "Geometral",
    topics: ["Frente y espalda", "Costuras y pespuntes con pinceles discontinuos", "Avíos como símbolos"],
    practice: "Geometral de remera, jean y camisa.",
    deliverable: "3 geometrales limpios.",
    resourceIds: ["adobe-tshirt", "inti-remera"],
    youtubeQueries: ["pespunte pincel Illustrator geometral", "stitch brush Illustrator fashion flats"],
  },
  {
    level: "principiante", number: 4, moduleId: "m1",
    title: "Ficha técnica",
    topics: ["Cabecera y datos de la prenda", "Geometral acotado", "Tabla de medidas", "Materiales, avíos y variantes de color"],
    practice: "Ficha técnica de la remera con su tabla de talles.",
    deliverable: "Plantilla de ficha técnica reutilizable.",
    resourceIds: ["inti-remera", "inti-guardapolvo"],
    youtubeQueries: ["ficha técnica indumentaria Illustrator", "tech pack Illustrator"],
  },
  {
    level: "principiante", number: 5, moduleId: "m1",
    title: "Patronaje 1: medidas y molde base",
    topics: ["Toma de medidas", "Molde base de remera", "Molde base de falda"],
    practice: "Tomar tus medidas o las de un maniquí y trazar los moldes a mano.",
    deliverable: "Moldes base en papel.",
    resourceIds: ["cursa-patronaje-cero", "cursa-corte-confeccion"],
    youtubeQueries: ["molde base remera patronaje", "tomar medidas patronaje"],
  },
  {
    level: "principiante", number: 6, moduleId: "m1",
    title: "Patronaje 2: digitalizar a escala 1:1",
    topics: ["Fotografiar con referencia de escala", "Calibrar y redibujar con pluma", "Margen de costura, piquetes y línea de hilo", "Impresión en mosaico"],
    practice: "Digitalizar los moldes, agregar 1 cm de margen con desplazar trazado, imprimir en mosaico y comparar con el papel.",
    deliverable: "Molde digital 1:1 validado (menos de 2 mm de diferencia).",
    resourceIds: ["cursa-patronaje-cero"],
    youtubeQueries: ["escalar imagen a tamaño real Illustrator", "digitalizar molde con foto"],
  },
  // --- Principiante · Módulo 2 ---
  {
    level: "principiante", number: 7, moduleId: "m2",
    title: "Color y estampados en Photoshop",
    topics: ["Capas y máscaras", "Modos de fusión", "Paletas de color"],
    practice: "Armar una paleta de 6 colores y 3 motivos a partir de una imagen de referencia.",
    deliverable: "Moodboard y paleta.",
    resourceIds: ["adobe-geometric-pattern"],
    youtubeQueries: ["Photoshop estampado textil capas máscaras"],
  },
  {
    level: "principiante", number: 8, moduleId: "m2",
    title: "Rapport en Illustrator",
    topics: ["Motivo de muestra", "Repetición directa", "Medio salto", "Espejado"],
    practice: "Convertir los motivos en muestras continuas y aplicarlas al geometral.",
    deliverable: "2 rapports sin costuras visibles.",
    resourceIds: ["adobe-create-pattern", "creativebloq-pattern", "digitalfabrics-halfdrop"],
    youtubeQueries: ["rapport medio salto Illustrator", "half drop repeat Illustrator"],
  },
  {
    level: "principiante", number: 9, moduleId: "m2",
    title: "Figurín digital",
    topics: ["Base de proporciones", "Línea, color y render", "Estampado con deformación"],
    practice: "Figurín vistiendo la remera estampada.",
    deliverable: "Figurín terminado.",
    resourceIds: ["adobe-fashion-illustration"],
    youtubeQueries: ["figurín digital Photoshop", "fashion illustration Photoshop"],
  },
  {
    level: "principiante", number: 10, moduleId: "m2",
    title: "Proyecto integrador",
    topics: ["Integrar geometral, ficha, molde, rapport y figurín"],
    practice: "Remera completa en una carpeta ordenada.",
    deliverable: "Carpeta de producto.",
    resourceIds: [],
    youtubeQueries: [],
  },
  // --- Intermedio · Módulo 3 ---
  {
    level: "intermedio", number: 1, moduleId: "m3",
    title: "Introducción a Seamly2D",
    topics: ["Archivo de medidas individual y multitalle", "Puntos, líneas y curvas", "Variables e incrementos"],
    practice: "Rehacer en Seamly2D el molde de remera del nivel principiante.",
    deliverable: "Remera paramétrica.",
    resourceIds: ["seamly-start-to-finish", "freesewing"],
    youtubeQueries: ["Seamly2D tutorial"],
  },
  {
    level: "intermedio", number: 2, moduleId: "m3",
    title: "Base de cuerpo",
    topics: ["Sistema de trazado", "Base delantera y espalda con pinzas"],
    practice: "Trazar la base de cuerpo paramétrica.",
    deliverable: "Base de cuerpo.",
    resourceIds: ["seamly-blocks", "cursa-computarizado"],
    youtubeQueries: ["base de cuerpo patronaje", "Seamly2D bodice block"],
  },
  {
    level: "intermedio", number: 3, moduleId: "m3",
    title: "Manipulación de pinzas",
    topics: ["Traslado y cierre de pinzas", "Conversión en cortes y frunces"],
    practice: "4 variantes desde la misma base.",
    deliverable: "Variantes de cuerpo.",
    resourceIds: ["seamly-blocks"],
    youtubeQueries: ["traslado de pinzas patronaje"],
  },
  {
    level: "intermedio", number: 4, moduleId: "m3",
    title: "Manga base",
    topics: ["Altura de copa", "Sisa vs copa", "Embebido"],
    practice: "Manga que calce en la sisa con el embebido controlado por fórmula.",
    deliverable: "Manga base.",
    resourceIds: ["seamly-blocks"],
    youtubeQueries: ["copa de manga embebido patronaje"],
    formulas: [{ label: "Embebido de la manga", tex: "e = L_{\\text{copa}} - L_{\\text{sisa}}" }],
  },
  {
    level: "intermedio", number: 5, moduleId: "m3",
    title: "Falda y pantalón base",
    topics: ["Falda recta", "Pantalón: tiro, pinzas y bolsillo"],
    practice: "Trazar ambas bases paramétricas.",
    deliverable: "2 bases inferiores.",
    resourceIds: ["seamly-blocks", "cursa-computarizado"],
    youtubeQueries: ["molde base pantalón patronaje", "molde falda recta patronaje"],
    formulas: [{ label: "Radio de cintura de la falda circular", tex: "r = \\frac{C}{2\\pi}" }],
  },
  {
    level: "intermedio", number: 6, moduleId: "m3",
    title: "Transformaciones: camisa",
    topics: ["Cuello y pie de cuello", "Cartera", "Puño", "Canesú"],
    practice: "Camisa completa desde la base.",
    deliverable: "Camisa paramétrica.",
    resourceIds: ["cursa-computarizado"],
    youtubeQueries: ["molde camisa cuello pie de cuello patronaje"],
  },
  // --- Intermedio · Módulo 4 ---
  {
    level: "intermedio", number: 7, moduleId: "m4",
    title: "Despiece",
    topics: ["Márgenes, piquetes e hilo", "Vistas y forrería", "Rotulado de piezas"],
    practice: "Despiezar la camisa lista para corte.",
    deliverable: "Despiece rotulado.",
    resourceIds: ["seamly-start-to-finish"],
    youtubeQueries: ["Seamly2D piece mode seam allowance"],
  },
  {
    level: "intermedio", number: 8, moduleId: "m4",
    title: "Graduación de talles",
    topics: ["Tabla multitalle", "Incrementos", "Ley 27.521 de talles"],
    practice: "Graduar la remera y la camisa S–XL.",
    deliverable: "Juegos graduados.",
    resourceIds: ["ley-talles", "cursa-computarizado"],
    youtubeQueries: ["escalado de talles patronaje", "Seamly2D multisize grading"],
  },
  {
    level: "intermedio", number: 9, moduleId: "m4",
    title: "Salida a producción",
    topics: ["PDF en mosaico", "DXF-AAMA para plotter", "Tizada y consumo de tela"],
    practice: "Tizada de la remera en tela de 150 cm.",
    deliverable: "Tizada y consumo por prenda.",
    resourceIds: ["seamly-start-to-finish"],
    youtubeQueries: ["tizada indumentaria consumo de tela", "Seamly2D layout export DXF"],
  },
  {
    level: "intermedio", number: 10, moduleId: "m4",
    title: "CLO 3D: primera simulación",
    topics: ["Importar DXF", "Avatar a medida", "Coser", "Propiedades de tela"],
    practice: "Simular la remera y la camisa.",
    deliverable: "Prendas simuladas.",
    resourceIds: ["clo-academy", "futurelearn-clo"],
    youtubeQueries: ["CLO 3D tutorial principiantes", "CLO 3D import DXF"],
  },
  {
    level: "intermedio", number: 11, moduleId: "m4",
    title: "Ajuste en 3D",
    topics: ["Mapa de tensión", "Corregir en el patrón", "Volver a importar"],
    practice: "Dos iteraciones de corrección sobre la camisa.",
    deliverable: "Registro de cambios.",
    resourceIds: ["clo-academy"],
    youtubeQueries: ["CLO 3D fit map strain"],
  },
  {
    level: "intermedio", number: 12, moduleId: "m4",
    title: "Proyecto final",
    topics: ["Patrón paramétrico", "Graduación S–XL", "Simulación 3D", "Ficha técnica y tizada"],
    practice: "Remera, camisa y pantalón completos.",
    deliverable: "Colección de 3 prendas.",
    resourceIds: [],
    youtubeQueries: [],
  },
];
```

### 7.3 Garments, tools and site copy

```ts
// content/garments.ts
import type { Garment } from "./types";

export const garments: Garment[] = [
  { name: "Remera básica", level: "Principiante", base: "Remera", adds: "Molde 1:1, margen, piquetes, cuello en tira" },
  { name: "Musculosa", level: "Principiante", base: "Remera", adds: "Escotes y sisas con vivo" },
  { name: "Falda recta", level: "Principiante", base: "Falda", adds: "Pinzas, cintura, cierre" },
  { name: "Falda evasé o circular", level: "Principiante", base: "Falda", adds: "Cerrar pinzas para dar vuelo; cálculo de radio" },
  { name: "Buzo con capucha", level: "Intermedio", base: "Remera", adds: "Capucha, bolsillo canguro, puños y cintura de rib" },
  { name: "Jogger", level: "Intermedio", base: "Pantalón", adds: "Bolsillos al bies, cintura elastizada" },
  { name: "Camisa", level: "Intermedio", base: "Cuerpo", adds: "Cuello, pie de cuello, cartera, puño, canesú" },
  { name: "Vestido base", level: "Intermedio", base: "Cuerpo + falda", adds: "Unir bases, cortes princesa" },
  { name: "Pantalón de vestir", level: "Intermedio", base: "Pantalón", adds: "Bragueta, pretina, bolsillo ojal" },
  { name: "Campera simple", level: "Avanzado", base: "Cuerpo", adds: "Holguras de abrigo, forrería completa, entretela" },
];
```

```ts
// content/tools.ts
export const tools = [
  { name: "Adobe Illustrator", use: "Geometrales, fichas técnicas, rapport, moldes simples 1:1", level: "Principiante", free: "Inkscape" },
  { name: "Adobe Photoshop", use: "Color, texturas, figurines, render", level: "Principiante", free: "Krita, GIMP o Photopea" },
  { name: "Seamly2D", use: "Patronaje paramétrico, despiece, graduación, tizada, DXF-AAMA y PDF", level: "Intermedio", free: "Ya es open source" },
  { name: "CLO 3D", use: "Coser moldes sobre un avatar y simular la tela", level: "Intermedio", free: "Blender con simulación de tela (más limitado)" },
] as const;

export const physicalMaterials = [
  "Cinta métrica",
  "Regla de 50 cm y escuadra",
  "Papel madera para validar el primer molde",
  "Impresora A4 para imprimir en mosaico",
  "Celular para fotografiar moldes en papel",
];

export const setupChecklist = [
  "Configurar todos los documentos en centímetros",
  "Imprimir un cuadrado de control de 10 × 10 cm y medirlo",
  "Crear una carpeta por semana para los entregables",
  "Inicializar un repo Git para los archivos de Seamly2D",
];
```

```ts
// content/site.ts
export const site = {
  name: "tizada",
  title: "Patronaje y digitalización de indumentaria",
  description:
    "Curso autodidacta para diseñar moldes y prendas en digital: del geometral al patrón paramétrico y la simulación 3D.",
  heroLead:
    "Dibujá la prenda, construí el molde y probalo en 3D. Dos niveles, 22 semanas, todo con material gratuito.",
  levels: {
    principiante: {
      title: "Principiante",
      summary:
        "Sigue el temario de la UTN (geometral, ficha técnica, rapport y figurín) y suma el primer molde digital a escala real.",
      outcome: "Remera completa: geometral, ficha técnica, molde 1:1, estampado y figurín.",
      passCriteria:
        "Tu molde digital impreso coincide con el de papel con menos de 2 mm de diferencia, y la ficha técnica alcanzaría para que otra persona confeccione la prenda.",
    },
    intermedio: {
      title: "Intermedio",
      summary:
        "Pasás de dibujar moldes a programarlos: cada punto se define con fórmulas sobre las medidas, así un cambio de talle regenera el molde entero.",
      outcome: "Tres prendas con molde paramétrico, graduadas S–XL y probadas en 3D.",
      passCriteria: "La camisa simulada no muestra tensiones fuera de rango después de dos iteraciones de ajuste.",
    },
  },
  studyTips: [
    "Dos sesiones de 2 h para teoría y práctica, y 1 h semanal para cerrar el entregable.",
    "Cada molde nuevo se imprime en mosaico y se compara con el papel, o se simula en CLO 3D, antes de usarlo como base de otro.",
    "Activá la prueba de CLO 3D recién en la semana 10 del intermedio para aprovechar los 30 días.",
  ],
} as const;
```

## 8. Key code

### 8.1 Content access + build-time validation

```ts
// lib/content.ts
import { resources } from "@/content/resources";
import { modules, weeks } from "@/content/weeks";
import type { LevelSlug, Resource, Week } from "@/content/types";

const resourceById = new Map(resources.map((r) => [r.id, r]));

/**
 * Fail the build if a week references an unknown resource id or if
 * week numbers inside a level are not a contiguous 1..n sequence.
 */
function validateContent(): void {
  for (const week of weeks) {
    for (const id of week.resourceIds) {
      if (!resourceById.has(id)) {
        throw new Error(`Unknown resource id "${id}" in ${week.level} week ${week.number}`);
      }
    }
  }
  for (const level of ["principiante", "intermedio"] as const) {
    const numbers = weeks.filter((w) => w.level === level).map((w) => w.number);
    numbers.forEach((n, i) => {
      if (n !== i + 1) throw new Error(`Non-contiguous week numbers in ${level}`);
    });
  }
}
validateContent();

export const isLevel = (value: string): value is LevelSlug =>
  value === "principiante" || value === "intermedio";

export const getWeeks = (level: LevelSlug): Week[] => weeks.filter((w) => w.level === level);

export const getWeek = (level: LevelSlug, n: number): Week | undefined =>
  weeks.find((w) => w.level === level && w.number === n);

export const getModules = (level: LevelSlug) => modules.filter((m) => m.level === level);

export const getResources = (ids: string[]): Resource[] =>
  ids.map((id) => resourceById.get(id)!).filter(Boolean);

/** Stable key used for progress storage, e.g. "principiante-3". */
export const weekKey = (w: Pick<Week, "level" | "number">) => `${w.level}-${w.number}`;
```

### 8.2 YouTube search links

```ts
// lib/youtube.ts

/** Build a YouTube search URL. We link to searches, not videos, because
 *  individual videos could not be verified and they rot quickly. */
export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
```

```tsx
// components/YouTubeSearchLinks.tsx
import { youtubeSearchUrl } from "@/lib/youtube";

export function YouTubeSearchLinks({ queries }: { queries: string[] }) {
  if (queries.length === 0) return null;
  return (
    <section aria-labelledby="yt-heading">
      <h2 id="yt-heading">Buscar en YouTube</h2>
      <p className="text-sm">
        Elegí el video más reciente que use tu versión del programa.
      </p>
      <ul>
        {queries.map((q) => (
          <li key={q}>
            <a href={youtubeSearchUrl(q)} target="_blank" rel="noopener noreferrer">
              {q}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### 8.3 Progress (localStorage)

```ts
// lib/progress.ts
"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "tizada:progress:v1";
const listeners = new Set<() => void>();

function read(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    // Storage blocked or corrupted: behave as if nothing was completed.
    return {};
  }
}

function write(next: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / privacy-mode errors; progress is a convenience only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Snapshot must be referentially stable between changes for useSyncExternalStore.
let cachedRaw: string | null = null;
let cachedValue: Record<string, boolean> = {};
function getSnapshot(): Record<string, boolean> {
  const raw = typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = read();
  }
  return cachedValue;
}
const EMPTY: Record<string, boolean> = {};

export function useProgress() {
  const done = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const toggle = useCallback((key: string) => {
    const current = read();
    write({ ...current, [key]: !current[key] });
  }, []);
  return { done, toggle };
}
```

```tsx
// components/DoneToggle.tsx
"use client";

import { useProgress } from "@/lib/progress";

export function DoneToggle({ weekKey }: { weekKey: string }) {
  const { done, toggle } = useProgress();
  const isDone = Boolean(done[weekKey]);
  return (
    <button type="button" aria-pressed={isDone} onClick={() => toggle(weekKey)}>
      {isDone ? "Semana terminada" : "Marcar como terminada"}
    </button>
  );
}
```

### 8.4 Formula (KaTeX)

```tsx
// components/Formula.tsx
import katex from "katex";
import "katex/dist/katex.min.css";

/** Server-rendered display formula; no client JS needed. */
export function Formula({ tex, label }: { tex: string; label: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
  return (
    <figure aria-label={label}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <figcaption>{label}</figcaption>
    </figure>
  );
}
```

### 8.5 Week page (static params)

```tsx
// app/[level]/semana/[week]/page.tsx
import { notFound } from "next/navigation";
import { weeks } from "@/content/weeks";
import { getWeek, isLevel } from "@/lib/content";
import { WeekDetail } from "@/components/WeekDetail";

export function generateStaticParams() {
  return weeks.map((w) => ({ level: w.level, week: String(w.number) }));
}

export const dynamicParams = false; // Unknown weeks are 404s, not runtime renders.

export async function generateMetadata({ params }: { params: Promise<{ level: string; week: string }> }) {
  const { level, week } = await params;
  if (!isLevel(level)) return {};
  const w = getWeek(level, Number(week));
  return w ? { title: `Semana ${w.number}: ${w.title} · tizada` } : {};
}

export default async function WeekPage({ params }: { params: Promise<{ level: string; week: string }> }) {
  const { level, week } = await params;
  if (!isLevel(level)) notFound();
  const w = getWeek(level, Number(week));
  if (!w) notFound();
  return <WeekDetail week={w} />;
}
```

`WeekDetail` renders, in this order: week number + title, module name, "Temas" (list), "Práctica", "Entregable", formulas (if any), "Material" (`ResourceList`), "Buscar en YouTube", `DoneToggle`, prev/next links ("Semana anterior" / "Semana siguiente").

### 8.6 Hero pattern piece

`components/PatternHero.tsx`: an inline SVG (no images) of a T-shirt front pattern piece over a cutting-mat grid:

- Background: `--mat` with 1 cm grid in `--mat-grid` (use an SVG `<pattern>`), every 5th line slightly thicker.
- Piece outline: solid `--paper` stroke; seam allowance as a dashed offset path.
- Grain line: vertical double-headed arrow with the label "hilo".
- Notches: small `--notch` ticks at shoulder and side seam.
- Fold line on center front with the label "doblez".
- On load, animate the outline once with `stroke-dashoffset` (CSS), disabled under `prefers-reduced-motion`.
- `role="img"` with `aria-label="Molde del delantero de una remera sobre una base de corte"`.

Title and lead sit to the left on desktop, above on mobile:

```
desktop                                   mobile
+-------------------+-------------------+ +-------------------+
| Patronaje y       |   [ SVG pattern   | | Patronaje y       |
| digitalización    |     on mat grid ] | | digitalización    |
| lead              |                   | | lead              |
| [Empezar] [Plan]  |                   | | [Empezar]         |
+-------------------+-------------------+ | [ SVG pattern ]   |
                                          +-------------------+
```

CTA labels: "Empezar por el nivel principiante" and "Ver el plan completo".

## 9. Phases for Claude Code

Work one phase per session. After each phase: `npm run lint && npm run typecheck && npm run build`, commit with a conventional commit message, push, and check the Vercel preview.

### Phase 0 — Scaffold
- `npx create-next-app@<pinned> tizada --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*"`.
- Add scripts: `typecheck` (`tsc --noEmit`), `check-links`, `test:e2e`.
- Set `<html lang="es-AR">`, load fonts with `next/font/google` (Schibsted Grotesk, Literata).
- Add design tokens to `globals.css` (section 3), light and dark.
- Add `CLAUDE.md` (section 10).
- **Done when:** empty home page builds and deploys to a Vercel preview.

### Phase 1 — Content layer
- Create `content/*` exactly as in section 7 and `lib/content.ts` with validation.
- **Done when:** `npm run build` fails if you add a fake resource id to any week (verify, then revert).

### Phase 2 — Pages
- Build all routes from section 4 with `SiteHeader` (links: Principiante, Intermedio, Recursos, Prendas, Herramientas) and `SiteFooter` (source credit to the UTN syllabus, "Contenido de estudio personal, sin afiliación con la UTN").
- `WeekRoadmap`: per module, a vertical list of weeks with large week numerals, title, deliverable, and a done marker.
- `/recursos`: filter chips by type and level, implemented with URL search params so filters are shareable.
- `/prendas` and `/herramientas`: simple tables.
- **Done when:** every week page renders, prev/next works across module boundaries, 404 for `/intermedio/semana/13`.

### Phase 3 — Interactivity
- `DoneToggle` + `ProgressBar` (per level on home and level pages: "4 de 10 semanas").
- `Formula` on weeks with formulas.
- **Done when:** progress survives reload and syncs across two tabs.

### Phase 4 — Visual design
- Implement `PatternHero` (section 8.6) and apply tokens across pages.
- Review screenshots at 360 px, 768 px, 1280 px in light and dark mode; fix contrast and overflow (tables scroll inside their own container).
- **Done when:** Lighthouse accessibility ≥ 95 and no horizontal page scroll on mobile.

### Phase 5 — Quality and deploy
- `scripts/check-links.ts` (section 11) runs in a weekly GitHub Action and on PRs that touch `content/`.
- Playwright smoke test: home loads, navigate to `/principiante/semana/1`, toggle done, reload, still done.
- Add `metadata` (title, description, Open Graph) in Spanish; add `sitemap.ts` and `robots.ts`.
- Connect the repo in Vercel, production branch `main`.
- **Done when:** production URL is live and CI is green.

### Phase 6 — Optional extensions
- Personal notes per week (localStorage, textarea, "Guardar nota").
- Export/import progress as JSON ("Descargar progreso" / "Cargar progreso").
- Embed a FreeSewing demo pattern on intermediate week 1 to show parametric patterns as code.
- `/acerca` page with a changelog of resources added/removed.

## 10. CLAUDE.md (put at repo root)

```md
# tizada

Static Next.js (App Router) + TypeScript + Tailwind site for a self-paced
fashion pattern-making course. Deployed on Vercel.

## Rules
- Code, comments, identifiers, commits: English.
- Every user-facing string: Spanish (es-AR, voseo: "marcá", "empezá").
- Content lives only in `content/*.ts`. Never hardcode course text in components.
- Do not invent resources or URLs. New resources must come from the user.
- YouTube: link to searches via `lib/youtube.ts`, never to individual videos
  unless the user provides the URL.
- Pin exact dependency versions; no versions published in the last 14 days.
- Keep pages fully static (`generateStaticParams`, `dynamicParams = false`).

## Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- `npm run check-links` — validates every resource URL
- `npm run test:e2e` — Playwright smoke test

## Plan
See `docs/tizada-plan.md`. Work one phase at a time and stop for review.
```

## 11. Link checker

```ts
// scripts/check-links.ts
// Run with: npx tsx scripts/check-links.ts
import { resources } from "../content/resources";

const TIMEOUT_MS = 15_000;

async function check(url: string): Promise<number> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // Some servers reject HEAD; fall back to GET.
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return res.status;
  } catch {
    return 0; // Network error or timeout.
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const results = await Promise.all(
    resources.map(async (r) => ({ id: r.id, url: r.url, status: await check(r.url) })),
  );
  const broken = results.filter((r) => r.status === 0 || r.status >= 400);
  for (const r of results) console.log(`${r.status}\t${r.id}\t${r.url}`);
  if (broken.length > 0) {
    console.error(`\n${broken.length} broken link(s).`);
    process.exit(1);
  }
}

main();
```

Note: some sites (e.g. government PDFs) may block bots; if a link is reported broken but works in a browser, add it to an `allowlist` array in the script with a comment explaining why.

## 12. Deploy on Vercel

1. Push the repo to GitHub.
2. In Vercel: New Project → import the repo → framework preset Next.js → no environment variables needed.
3. Production branch: `main`. Every PR gets a preview URL.
4. Optional: add a custom domain.

## 13. Acceptance checklist

- [ ] 22 week pages (10 + 12) render statically.
- [ ] Every resource id referenced by a week exists (build-time check).
- [ ] Every page's visible text is in Spanish; every code comment is in English.
- [ ] Progress persists across reloads and tabs.
- [ ] Formulas render with KaTeX.
- [ ] No horizontal scroll at 360 px; keyboard focus visible; reduced motion respected.
- [ ] Link checker passes (or failures are allowlisted with a reason).
- [ ] Production deploy live on Vercel.
