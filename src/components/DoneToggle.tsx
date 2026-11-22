"use client";

import { pages } from "@/content/site";
import { useProgress } from "@/lib/progress";

export function DoneToggle({ weekKey }: { weekKey: string }) {
  const { done, toggle } = useProgress();
  const isDone = Boolean(done[weekKey]);
  return (
    <button
      type="button"
      aria-pressed={isDone}
      onClick={() => toggle(weekKey)}
      className={`btn ${isDone ? "btn-ghost" : "btn-primary"}`}
    >
      {isDone ? `✓ ${pages.week.done}` : pages.week.markDone}
    </button>
  );
}
