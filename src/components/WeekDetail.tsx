import Link from "next/link";
import { pages } from "@/content/site";
import type { Week } from "@/content/types";
import { getModule, getNeighbours, getResources, weekHref, weekKey } from "@/lib/content";
import { ExampleFigure } from "./examples/ExampleFigure";
import { DoneToggle } from "./DoneToggle";
import { Formula } from "./Formula";
import { ResourceList } from "./ResourceList";
import { YouTubeSearchLinks } from "./YouTubeSearchLinks";

export function WeekDetail({ week }: { week: Week }) {
  const mod = getModule(week.moduleId);
  const { prev, next } = getNeighbours(week);
  const items = getResources(week.resourceIds);
  const t = pages.week;
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="flex items-baseline gap-3">
        <span aria-hidden="true" className="text-6xl font-bold text-mat dark:text-mat-grid" style={{ fontFamily: "var(--font-schibsted)" }}>
          {week.number}
        </span>
        <span className="text-sm text-muted">{t.module}: {mod?.title}</span>
      </p>
      <h1 className="mt-2 text-4xl"><span className="sr-only">Semana {week.number}: </span>{week.title}</h1>

      <section className="mt-8">
        <h2 className="text-2xl">{t.topics}</h2>
        <ul className="prose-measure mt-2 list-disc pl-5">
          {week.topics.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl">{t.practice}</h2>
        <p className="prose-measure mt-2">{week.practice}</p>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl">{t.deliverable}</h2>
        <p className="prose-measure mt-2">{week.deliverable}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl">{t.checks}</h2>
        <ul className="prose-measure mt-2 list-disc pl-5">
          {week.checks.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>

      {week.example && <ExampleFigure kind={week.example.kind} caption={week.example.caption} />}

      {week.formulas?.map((f) => <Formula key={f.tex} tex={f.tex} label={f.label} />)}

      <section className="mt-10">
        <h2 className="text-2xl">{t.material}</h2>
        <div className="mt-3">
          {items.length > 0 ? <ResourceList items={items} /> : <p className="text-muted">{t.noMaterial}</p>}
        </div>
      </section>

      <YouTubeSearchLinks queries={week.youtubeQueries} />

      <div className="mt-10"><DoneToggle weekKey={weekKey(week)} /></div>

      <nav aria-label="Semanas" className="mt-10 flex flex-wrap justify-between gap-4 border-t border-line pt-4">
        {prev ? <Link href={weekHref(prev)}>← {t.prev}</Link> : <span />}
        {next ? <Link href={weekHref(next)}>{t.next} →</Link> : <span />}
      </nav>
    </article>
  );
}
