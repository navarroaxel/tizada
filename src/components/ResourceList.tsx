import type { Resource } from "@/content/types";
import { pages } from "@/content/site";

export function ResourceList({ items }: { items: Resource[] }) {
  return (
    <ul className="grid gap-4">
      {items.map((r) => (
        <li key={r.id} className="rounded border border-line p-4">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-semibold" style={{ fontFamily: "var(--font-schibsted)" }}>
            {r.title}
          </a>
          <p className="prose-measure mt-1">{r.note}</p>
          <p className="mt-1 text-sm text-muted">
            {pages.resources.kinds[r.kind]} · {r.cost}
            {r.language === "en" ? ` · ${pages.resources.en}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
