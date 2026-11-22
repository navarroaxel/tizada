import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeekDetail } from "@/components/WeekDetail";
import { weeks } from "@/content/weeks";
import { getWeek, isLevel } from "@/lib/content";

export const dynamicParams = false; // Unknown weeks are 404s, not runtime renders.

export function generateStaticParams() {
  return weeks.map((w) => ({ level: w.level, week: String(w.number) }));
}

export async function generateMetadata({ params }: PageProps<"/[level]/semana/[week]">): Promise<Metadata> {
  const { level, week } = await params;
  if (!isLevel(level)) return {};
  const w = getWeek(level, Number(week));
  return w ? { title: `Semana ${w.number}: ${w.title}` } : {};
}

export default async function WeekPage({ params }: PageProps<"/[level]/semana/[week]">) {
  const { level, week } = await params;
  if (!isLevel(level)) notFound();
  const w = getWeek(level, Number(week));
  if (!w) notFound();
  return <WeekDetail week={w} />;
}
