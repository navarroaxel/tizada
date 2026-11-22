import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { WeekRoadmap } from "@/components/WeekRoadmap";
import { pages, site } from "@/content/site";
import { getWeeks, isLevel, levelSlugs, weekKey } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return levelSlugs.map((level) => ({ level }));
}

export async function generateMetadata({ params }: PageProps<"/[level]">): Promise<Metadata> {
  const { level } = await params;
  if (!isLevel(level)) return {};
  return { title: site.levels[level].title, description: site.levels[level].summary };
}

export default async function LevelPage({ params }: PageProps<"/[level]">) {
  const { level } = await params;
  if (!isLevel(level)) notFound();
  const info = site.levels[level];
  const t = pages.level;
  const keys = getWeeks(level).map(weekKey);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">{info.title}</h1>
      <p className="prose-measure mt-3 text-lg">{info.summary}</p>
      <div className="mt-4 max-w-md"><ProgressBar keys={keys} /></div>

      <dl className="prose-measure mt-8 grid gap-4">
        <div>
          <dt className="font-bold" style={{ fontFamily: "var(--font-schibsted)" }}>{t.outcome}</dt>
          <dd>{info.outcome}</dd>
        </div>
        <div>
          <dt className="font-bold" style={{ fontFamily: "var(--font-schibsted)" }}>{t.pass}</dt>
          <dd>{info.passCriteria}</dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="text-2xl">{t.tips}</h2>
        <ul className="prose-measure mt-2 list-disc pl-5">
          {site.studyTips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      </section>

      <section id="plan" className="mt-12 scroll-mt-4" aria-labelledby="plan-heading">
        <h2 id="plan-heading" className="text-2xl">{t.modules}</h2>
        <div className="mt-4"><WeekRoadmap level={level} /></div>
      </section>
    </div>
  );
}
