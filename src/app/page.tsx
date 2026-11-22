import Link from "next/link";
import { PatternHero } from "@/components/PatternHero";
import { ProgressBar } from "@/components/ProgressBar";
import { pages, site } from "@/content/site";
import { getWeeks, levelSlugs, weekKey } from "@/lib/content";

export default function Home() {
  const t = pages.home;
  return (
    <>
      <PatternHero />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <section>
          <h2 className="text-2xl">{t.what}</h2>
          <p className="prose-measure mt-2">{t.whatText}</p>
        </section>
        <section className="mt-10" aria-labelledby="levels-heading">
          <h2 id="levels-heading" className="text-2xl">{t.levels}</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {levelSlugs.map((slug) => {
              const level = site.levels[slug];
              const keys = getWeeks(slug).map(weekKey);
              return (
                <article key={slug} className="flex flex-col rounded border border-line p-5">
                  <h3 className="text-xl">{level.title}</h3>
                  <p className="mt-2">{level.summary}</p>
                  <p className="mt-2 text-sm text-muted">{level.outcome}</p>
                  <div className="mt-4"><ProgressBar keys={keys} label={t.progress} /></div>
                  <div className="mt-4">
                    <Link href={`/${slug}`} className="btn btn-primary">{t.open} {level.title.toLowerCase()}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
