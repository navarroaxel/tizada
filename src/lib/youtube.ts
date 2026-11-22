
/** Build a YouTube search URL. We link to searches, not videos, because
 *  individual videos could not be verified and they rot quickly. */
export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
