import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resources } from "@/content/resources";
import { site } from "@/content/site";
import { garments } from "@/content/garments";
import { modules, weeks } from "@/content/weeks";
import {
  getModule,
  getNeighbours,
  getResourceLevels,
  getResources,
  getWeek,
  getWeeks,
  isLevel,
  levelSlugs,
  weekHref,
  weekKey,
} from "@/lib/content";

describe("content integrity", () => {
  it("has unique resource ids", () => {
    const ids = resources.map((r) => r.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("uses https urls for every resource", () => {
    for (const r of resources) assert.match(r.url, /^https:\/\//, r.id);
  });

  it("has unique youtube video ids", () => {
    const ids = resources
      .filter((r) => r.kind === "video")
      .map((r) => new URL(r.url).searchParams.get("v"));
    assert.ok(ids.every(Boolean));
    assert.equal(new Set(ids).size, ids.length);
  });

  it("references only existing resources and modules, without duplicates", () => {
    const resourceIds = new Set(resources.map((r) => r.id));
    for (const w of weeks) {
      for (const id of w.resourceIds) assert.ok(resourceIds.has(id), `${weekKey(w)}: ${id}`);
      assert.equal(new Set(w.resourceIds).size, w.resourceIds.length, weekKey(w));
      assert.ok(getModule(w.moduleId), `${weekKey(w)} module`);
    }
  });

  it("keeps each module inside the level of its weeks", () => {
    for (const w of weeks) assert.equal(getModule(w.moduleId)?.level, w.level);
    for (const m of modules) assert.ok(weeks.some((w) => w.moduleId === m.id), m.id);
  });

  it("has the expected number of weeks per level", () => {
    assert.deepEqual(
      levelSlugs.map((l) => getWeeks(l).length),
      [10, 12, 12],
    );
  });

  it("gives every week at least two distinct self-check statements", () => {
    for (const w of weeks) {
      assert.ok(w.checks.length >= 2, weekKey(w));
      assert.equal(new Set(w.checks).size, w.checks.length, weekKey(w));
      for (const c of w.checks) assert.ok(c.trim().length > 15, `${weekKey(w)}: ${c}`);
    }
  });

  it("only uses known example kinds and gives each a caption", () => {
    const kinds = ["geometral", "ficha", "molde", "rapport", "graduacion", "tizada", "mapa-tension", "manga", "manga-sastre", "pinzas", "pantalon"];
    for (const w of weeks) {
      if (!w.example) continue;
      assert.ok(kinds.includes(w.example.kind), `${weekKey(w)}: ${w.example.kind}`);
      assert.ok(w.example.caption.trim().length > 20, weekKey(w));
    }
    assert.ok(weeks.filter((w) => w.example).length >= 16);
  });

  it("has copy for every level", () => {
    for (const l of levelSlugs) assert.ok(site.levels[l].title, l);
  });

  it("only uses known garment levels", () => {
    for (const g of garments) assert.ok(["Principiante", "Intermedio", "Avanzado"].includes(g.level));
  });
});

describe("content helpers", () => {
  it("isLevel accepts only known slugs", () => {
    assert.ok(isLevel("avanzado"));
    assert.ok(!isLevel("experto"));
    assert.ok(!isLevel(""));
  });

  it("getWeek finds a week and rejects out-of-range numbers", () => {
    assert.equal(getWeek("intermedio", 12)?.title, "Proyecto final");
    assert.equal(getWeek("intermedio", 13), undefined);
    assert.equal(getWeek("principiante", 0), undefined);
    assert.equal(getWeek("principiante", Number.NaN), undefined);
  });

  it("getNeighbours crosses module boundaries but not level boundaries", () => {
    const first = getWeek("principiante", 1)!;
    assert.equal(getNeighbours(first).prev, undefined);
    assert.equal(getNeighbours(first).next?.number, 2);

    const lastOfModule = getWeek("principiante", 6)!;
    assert.equal(getNeighbours(lastOfModule).next?.moduleId, "m2");

    const last = getWeek("avanzado", 12)!;
    assert.equal(getNeighbours(last).next, undefined);
  });

  it("getResources preserves order and returns full resources", () => {
    const items = getResources(["inti-remera", "adobe-tshirt"]);
    assert.deepEqual(items.map((r) => r.id), ["inti-remera", "adobe-tshirt"]);
  });

  it("getResourceLevels derives levels from week references", () => {
    assert.deepEqual(getResourceLevels("adobe-tshirt"), ["principiante"]);
    assert.deepEqual(getResourceLevels("seamly-blocks"), ["intermedio", "avanzado"]);
    assert.deepEqual(getResourceLevels("not-a-resource"), []);
  });

  it("builds stable keys and hrefs", () => {
    assert.equal(weekKey({ level: "principiante", number: 3 }), "principiante-3");
    assert.equal(weekHref({ level: "intermedio", number: 4 }), "/intermedio/semana/4");
  });
});
