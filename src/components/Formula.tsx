import katex from "katex";
import "katex/dist/katex.min.css";

/** Server-rendered display formula; no client JS needed. */
export function Formula({ tex, label }: { tex: string; label: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
  return (
    <figure aria-label={label} className="my-4 rounded border border-line bg-surface p-3">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <figcaption className="text-center text-sm text-muted">{label}</figcaption>
    </figure>
  );
}
