"use client";

import { useProgress } from "@/lib/progress";

export function WeekDoneMark({ weekKey }: { weekKey: string }) {
  const { done } = useProgress();
  if (!done[weekKey]) return null;
  return (
    <span className="shrink-0 font-semibold text-notch" style={{ fontFamily: "var(--font-schibsted)" }}>
      <span aria-hidden="true">✓ </span>Terminada
    </span>
  );
}
