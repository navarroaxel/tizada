"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResourceList } from "@/components/ResourceList";
import { pages } from "@/content/site";
import type { LevelSlug, Resource, ResourceKind } from "@/content/types";

interface Item extends Resource {
  levels: LevelSlug[];
}

/** Filters live in the URL (?tipo=&nivel=) so they are shareable. */
export function ResourceFilter({ items }: { items: Item[] }) {
  const sp = useSearchParams();
  const t = pages.resources;
  const kind = sp.get("tipo") ?? "";
  const level = sp.get("nivel") ?? "";

  const href = (next: { tipo?: string; nivel?: string }) => {
    const q = new URLSearchParams();
    const tipo = next.tipo ?? kind;
    const nivel = next.nivel ?? level;
    if (tipo) q.set("tipo", tipo);
    if (nivel) q.set("nivel", nivel);
    const s = q.toString();
    return s ? `/recursos?${s}` : "/recursos";
  };

  const filtered = items.filter(
    (r) => (!kind || r.kind === kind) && (!level || r.levels.includes(level as LevelSlug)),
  );

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-4 no-underline ${
      active ? "border-mat bg-mat text-white" : "border-line text-graphite"
    }`;

  const kinds = Object.keys(t.kinds) as ResourceKind[];
  const levels = Object.keys(t.levels) as LevelSlug[];
  const label = { fontFamily: "var(--font-schibsted)" };

  return (
    <div>
      <div className="grid gap-4">
        <div role="group" aria-label={t.kind} className="flex flex-wrap items-center gap-2">
          <span className="font-semibold" style={label}>{t.kind}:</span>
          <Link href={href({ tipo: "" })} aria-current={!kind ? "true" : undefined} className={chip(!kind)}>{t.all}</Link>
          {kinds.map((k) => (
            <Link key={k} href={href({ tipo: k })} aria-current={kind === k ? "true" : undefined} className={chip(kind === k)}>
              {t.kinds[k]}
            </Link>
          ))}
        </div>
        <div role="group" aria-label={t.level} className="flex flex-wrap items-center gap-2">
          <span className="font-semibold" style={label}>{t.level}:</span>
          <Link href={href({ nivel: "" })} aria-current={!level ? "true" : undefined} className={chip(!level)}>{t.all}</Link>
          {levels.map((l) => (
            <Link key={l} href={href({ nivel: l })} aria-current={level === l ? "true" : undefined} className={chip(level === l)}>
              {t.levels[l]}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6" aria-live="polite">
        {filtered.length > 0 ? <ResourceList items={filtered} /> : <p className="text-muted">{t.empty}</p>}
      </div>
    </div>
  );
}
