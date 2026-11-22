import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { glossary } from "@/content/glossary";
import { getSortedGlossary, glossaryLetter, glossarySlug } from "@/lib/content";

describe("glossary", () => {
  it("has unique terms and unique anchors", () => {
    const slugs = glossary.map((g) => glossarySlug(g.term));
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it("has a non-empty definition for every term", () => {
    for (const g of glossary) assert.ok(g.definition.trim().length > 10, g.term);
  });

  it("sorts ignoring accents and case", () => {
    const names = getSortedGlossary().map((g) => g.term);
    const expected = [...names].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
    assert.deepEqual(names, expected);
  });

  it("builds letters and slugs without accents", () => {
    assert.equal(glossaryLetter("Ábaco"), "A");
    assert.equal(glossarySlug("Ley de talles 27.521"), "ley-de-talles-27-521");
    assert.equal(glossarySlug("Línea de hilo"), "linea-de-hilo");
  });
});
