import type { Metadata } from "next";
import { pages } from "@/content/site";
import { getSortedGlossary, glossaryLetter, glossarySlug } from "@/lib/content";

export const metadata: Metadata = { title: pages.glossary.title, description: pages.glossary.lead };

export default function GlossaryPage() {
  const t = pages.glossary;
  const terms = getSortedGlossary();
  const letters = [...new Set(terms.map((x) => glossaryLetter(x.term)))];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl">{t.title}</h1>
      <p className="prose-measure mt-3">{t.lead}</p>

      <nav aria-label={t.jump} className="mt-6 flex flex-wrap gap-2">
        {letters.map((l) => (
          <a key={l} href={`#letra-${l}`} className="inline-flex size-11 items-center justify-center rounded border border-line font-semibold no-underline">
            {l}
          </a>
        ))}
      </nav>

      <dl className="mt-8">
        {terms.map((x, i) => {
          const letter = glossaryLetter(x.term);
          const startsLetter = i === 0 || glossaryLetter(terms[i - 1].term) !== letter;
          return (
            <div key={x.term} id={glossarySlug(x.term)} className="scroll-mt-4 border-t border-line py-4">
              {startsLetter && <span id={`letra-${letter}`} className="sr-only scroll-mt-4">{letter}</span>}
              <dt className="text-lg font-bold" style={{ fontFamily: "var(--font-schibsted)" }}>
                {x.term}
                {x.english && <span className="ml-2 text-sm font-normal text-muted">{t.english}: {x.english}</span>}
              </dt>
              <dd className="prose-measure mt-1">{x.definition}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
