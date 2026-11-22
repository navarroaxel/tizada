/** Course level slug, also used as the first route segment. */
export type LevelSlug = "principiante" | "intermedio" | "avanzado";

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

export type ExampleKind =
  | "geometral"
  | "ficha"
  | "molde"
  | "rapport"
  | "graduacion"
  | "tizada"
  | "mapa-tension"
  | "manga"
  | "manga-sastre"
  | "pinzas"
  | "pantalon";

export interface Week {
  level: LevelSlug;
  /** 1-based number within the level; used in the URL. */
  number: number;
  moduleId: string;
  title: string;
  topics: string[];
  practice: string;
  deliverable: string;
  /** Spanish self-check statements: how the learner knows the week is done. */
  checks: string[];
  /** Optional illustrative figure of the expected result (drawn in components/examples). */
  example?: { kind: ExampleKind; caption: string };
  /** Ids from content/resources.ts. Validated at build time. */
  resourceIds: string[];
  /** Plain search queries; rendered as YouTube search links. */
  youtubeQueries: string[];
  /** Optional LaTeX formulas shown in the week page. */
  formulas?: { label: string; tex: string }[];
}

export interface GlossaryTerm {
  /** Spanish term as shown to the learner. */
  term: string;
  /** One or two sentences in Spanish. */
  definition: string;
  /** English equivalent, useful to search English tutorials. */
  english?: string;
}

export interface Garment {
  name: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  base: string;
  adds: string;
}
