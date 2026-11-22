import { resources } from "../src/content/resources";

const TIMEOUT_MS = 15_000;

async function check(url: string): Promise<number> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // Some servers reject HEAD; fall back to GET.
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return res.status;
  } catch {
    return 0; // Network error or timeout.
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const results = await Promise.all(
    resources.map(async (r) => ({ id: r.id, url: r.url, status: await check(r.url) })),
  );
  const broken = results.filter((r) => r.status === 0 || r.status >= 400);
  for (const r of results) console.log(`${r.status}\t${r.id}\t${r.url}`);
  if (broken.length > 0) {
    console.error(`\n${broken.length} broken link(s).`);
    process.exit(1);
  }
}

main();
