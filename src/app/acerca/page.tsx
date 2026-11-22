import type { Metadata } from "next";
import Link from "next/link";
import { pages } from "@/content/site";

export const metadata: Metadata = { title: pages.about.title };

export default function AboutPage() {
  const t = pages.about;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl">{t.title}</h1>
      <h2 className="mt-8 text-2xl">{t.why}</h2>
      <p className="prose-measure mt-2">{t.whyText}</p>
      <h2 className="mt-8 text-2xl">{t.utn}</h2>
      <p className="prose-measure mt-2">{t.utnText}</p>
      <h2 className="mt-8 text-2xl">{t.sources}</h2>
      <p className="prose-measure mt-2">
        <Link href="/recursos">{t.sourcesText}</Link>
      </p>
    </div>
  );
}
