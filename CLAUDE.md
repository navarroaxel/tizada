# tizada

Static Next.js (App Router) + TypeScript + Tailwind site for a self-paced
fashion pattern-making course. Deployed on Vercel.

## Rules
- Code, comments, identifiers, commits: English.
- Every user-facing string: Spanish (es-AR, voseo: "marcá", "empezá").
- Content lives only in `src/content/*.ts` (course data and page copy). Never hardcode course text in components.
- Never invent resources or URLs. Claude may find and add resources, including
  individual YouTube videos, but only ones it has actually seen in search results
  (title, channel, date), never from memory.
- YouTube: each week keeps its search links via `src/lib/youtube.ts` as a fallback;
  curated videos are `kind: "video"` entries in `src/content/resources.ts`.
- Pin exact dependency versions; no versions published in the last 14 days.
- Keep pages fully static (`generateStaticParams`, `dynamicParams = false`).
  Cache Components is intentionally off: it is incompatible with `dynamicParams`
  and would return 200 instead of 404 for unknown weeks.
- This Next.js version has breaking changes: read `node_modules/next/dist/docs/` first (see AGENTS.md).

## Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- `npm test` — unit tests (`node --test` via tsx, in `tests/unit/`)
- `npm run check-links` — validates every resource URL
- `npm run test:e2e` — Playwright smoke test (`tests/e2e/`)

## Plan
See `docs/tizada-plan.md`.
