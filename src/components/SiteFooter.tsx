import Link from "next/link";
import { copy, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted">
        <p className="prose-measure">{copy.footer}</p>
        <p>
          {site.name} · <Link href="/acerca">{copy.about}</Link>
        </p>
      </div>
    </footer>
  );
}
