import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { weeks } from "@/content/weeks";
import { youtubeSearchUrl } from "@/lib/youtube";

describe("youtubeSearchUrl", () => {
  it("encodes spaces and accents", () => {
    const url = new URL(youtubeSearchUrl("figurín digital Photoshop"));
    assert.equal(url.origin + url.pathname, "https://www.youtube.com/results");
    assert.equal(url.searchParams.get("search_query"), "figurín digital Photoshop");
  });

  it("does not let a query inject extra parameters", () => {
    const url = new URL(youtubeSearchUrl("a&b=c#d"));
    assert.equal(url.searchParams.get("search_query"), "a&b=c#d");
    assert.equal([...url.searchParams.keys()].length, 1);
  });

  it("works for every query in the course", () => {
    for (const w of weeks) {
      for (const q of w.youtubeQueries) {
        assert.equal(new URL(youtubeSearchUrl(q)).searchParams.get("search_query"), q);
      }
    }
  });
});
