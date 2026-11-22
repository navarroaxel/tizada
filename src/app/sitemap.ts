import type { MetadataRoute } from "next";
import { weeks } from "@/content/weeks";
import { levelSlugs } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tizada.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...levelSlugs.map((l) => `/${l}`),
    ...weeks.map((w) => `/${w.level}/semana/${w.number}`),
    "/recursos",
    "/prendas",
    "/herramientas",
    "/glosario",
    "/acerca",
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
