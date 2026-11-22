import { resources } from "@/content/resources";
import { modules, weeks } from "@/content/weeks";
import { glossary } from "@/content/glossary";
import type { GlossaryTerm, LevelSlug, Resource, Week } from "@/content/types";

export const levelSlugs: LevelSlug[] = ["principiante", "intermedio", "avanzado"];

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
  for (const level of levelSlugs) {
    const numbers = weeks.filter((w) => w.level === level).map((w) => w.number);
    numbers.forEach((n, i) => {
      if (n !== i + 1) throw new Error(`Non-contiguous week numbers in ${level}`);
    });
  }
}
validateContent();

export const isLevel = (value: string): value is LevelSlug =>
  levelSlugs.includes(value as LevelSlug);

export const getWeeks = (level: LevelSlug): Week[] => weeks.filter((w) => w.level === level);

export const getWeek = (level: LevelSlug, n: number): Week | undefined =>
  weeks.find((w) => w.level === level && w.number === n);

export const getModules = (level: LevelSlug) => modules.filter((m) => m.level === level);

export const getResources = (ids: string[]): Resource[] =>
  ids.map((id) => resourceById.get(id)!).filter(Boolean);

/** Stable key used for progress storage, e.g. "principiante-3". */
export const weekKey = (w: Pick<Week, "level" | "number">) => `${w.level}-${w.number}`;


export const getModule = (id: string) => modules.find((m) => m.id === id);

/** Previous and next week inside the same level (crosses module boundaries). */
export function getNeighbours(week: Week): { prev?: Week; next?: Week } {
  const all = getWeeks(week.level);
  return { prev: all.find((w) => w.number === week.number - 1), next: all.find((w) => w.number === week.number + 1) };
}

/** Level of each resource, derived from the weeks that reference it. */
export function getResourceLevels(id: string): LevelSlug[] {
  return levelSlugs.filter((l) => weeks.some((w) => w.level === l && w.resourceIds.includes(id)));
}

export const weekHref = (w: Pick<Week, "level" | "number">) => `/${w.level}/semana/${w.number}`;

/** Glossary sorted with Spanish collation, ignoring accents and case. */
export function getSortedGlossary(): GlossaryTerm[] {
  return [...glossary].sort((a, b) => a.term.localeCompare(b.term, "es", { sensitivity: "base" }));
}

/** First letter of a term, uppercased and without accent (for the A–Z index). */
export const glossaryLetter = (term: string): string =>
  term.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();

/** Stable anchor id for a glossary term. */
export const glossarySlug = (term: string): string =>
  term
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
