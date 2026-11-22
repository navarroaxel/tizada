import Link from "next/link";
import type { LevelSlug } from "@/content/types";
import { getModules, getWeeks, weekHref, weekKey } from "@/lib/content";
import { WeekDoneMark } from "./WeekDoneMark";

export function WeekRoadmap({ level }: { level: LevelSlug }) {
  const weeks = getWeeks(level);
  return (
    <div className="grid gap-10">
      {getModules(level).map((m) => (
        <section key={m.id} aria-labelledby={`mod-${m.id}`}>
          <h3 id={`mod-${m.id}`} className="text-xl">{m.title}</h3>
          <p className="prose-measure mt-1 text-muted">{m.summary}</p>
          <ol className="mt-4 divide-y divide-line border-y border-line">
            {weeks
              .filter((w) => w.moduleId === m.id)
              .map((w) => (
                <li key={w.number}>
                  <Link href={weekHref(w)} className="flex items-baseline gap-4 py-3 text-graphite no-underline hover:bg-surface">
                    <span
                      aria-hidden="true"
                      className="w-12 shrink-0 text-right text-4xl font-bold text-mat dark:text-mat-grid"
                      style={{ fontFamily: "var(--font-schibsted)" }}
                    >
                      {w.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold" style={{ fontFamily: "var(--font-schibsted)" }}>
                        <span className="sr-only">Semana {w.number}: </span>
                        {w.title}
                      </span>
                      <span className="block text-sm text-muted">{w.deliverable}</span>
                    </span>
                    <WeekDoneMark weekKey={weekKey(w)} />
                  </Link>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
