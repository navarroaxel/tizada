import Link from "next/link";
import { pages, site } from "@/content/site";

/** Hero: copy on the left, a T-shirt front pattern piece on a cutting mat on the right. */
export function PatternHero() {
  const t = pages.home;
  return (
    <section className="bg-mat text-white">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <h1 className="text-4xl md:text-5xl">{site.title}</h1>
          <p className="prose-measure mt-4 text-lg text-white/90">{site.heroLead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/principiante" className="btn bg-white text-mat hover:bg-white/90" style={{ color: "#1f4e45" }}>
              {t.startCta}
            </Link>
            <Link href="/principiante#plan" className="btn btn-ghost" style={{ color: "#fff" }}>
              {t.planCta}
            </Link>
          </div>
        </div>
        <svg viewBox="0 0 400 440" role="img" aria-label={t.heroAria} className="h-auto w-full rounded">
          <defs>
            <pattern id="grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="var(--mat-grid)" strokeWidth="0.5" opacity="0.6" />
            </pattern>
            <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M100 0H0V100" fill="none" stroke="var(--mat-grid)" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="400" height="440" fill="var(--mat)" />
          <rect width="400" height="440" fill="url(#grid-minor)" />
          <rect width="400" height="440" fill="url(#grid-major)" />

          {/* Seam allowance (dashed offset of the outline) */}
          <path
            d="M300 98 C288 62 258 50 233 50 L84 83 C106 132 106 172 93 206 L83 402 L300 402"
            fill="none" stroke="#fbfbf8" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.8"
          />
          {/* Piece outline: drawn once on load */}
          <path
            className="hero-outline" pathLength={1}
            d="M300 110 C290 75 260 62 235 62 L90 95 C118 140 118 175 105 205 L95 390 L300 390 Z"
            fill="rgba(251,251,248,0.06)" stroke="#fbfbf8" strokeWidth="3" strokeLinejoin="round"
          />
          {/* Fold line */}
          <line x1="300" y1="100" x2="300" y2="400" stroke="#fbfbf8" strokeWidth="1.5" strokeDasharray="14 4 2 4" />
          <text x="312" y="260" fill="#fbfbf8" fontSize="14" transform="rotate(90 312 260)" textAnchor="middle" fontFamily="var(--font-schibsted)">doblez</text>
          {/* Grain line */}
          <g stroke="#fbfbf8" strokeWidth="2" fill="#fbfbf8">
            <line x1="200" y1="165" x2="200" y2="345" />
            <path d="M200 150 L194 168 L206 168 Z" />
            <path d="M200 360 L194 342 L206 342 Z" />
          </g>
          <text x="212" y="260" fill="#fbfbf8" fontSize="14" fontFamily="var(--font-schibsted)">hilo</text>
          {/* Notches */}
          <g stroke="#ef7a6e" strokeWidth="3" strokeLinecap="round">
            <line x1="162" y1="79" x2="160" y2="90" />
            <line x1="100" y1="300" x2="112" y2="301" />
          </g>
        </svg>
      </div>
    </section>
  );
}
