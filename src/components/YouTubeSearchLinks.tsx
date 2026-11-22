import { pages } from "@/content/site";
import { youtubeSearchUrl } from "@/lib/youtube";

export function YouTubeSearchLinks({ queries }: { queries: string[] }) {
  if (queries.length === 0) return null;
  return (
    <section aria-labelledby="yt-heading" className="mt-10">
      <h2 id="yt-heading" className="text-2xl">{pages.week.youtube}</h2>
      <p className="mt-2 text-sm text-muted">{pages.week.youtubeHint}</p>
      <ul className="mt-3 list-disc pl-5">
        {queries.map((q) => (
          <li key={q}>
            <a href={youtubeSearchUrl(q)} target="_blank" rel="noopener noreferrer">
              {q}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
