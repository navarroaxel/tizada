import Link from "next/link";
import { copy, nav, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <a
        href="#contenido"
        className="absolute left-2 top-2 z-10 -translate-y-20 rounded bg-paper px-3 py-2 focus:translate-y-0"
      >
        {copy.skipLink}
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-graphite no-underline" style={{ fontFamily: "var(--font-schibsted)" }}>
          {site.name}
        </Link>
        <nav aria-label="Principal">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-2 text-graphite">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
