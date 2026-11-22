"use client";

import { useProgress } from "@/lib/progress";

/** Shows "n de total semanas" for the given week keys. */
export function ProgressBar({ keys, label }: { keys: string[]; label?: string }) {
  const { done } = useProgress();
  const count = keys.filter((k) => done[k]).length;
  const total = keys.length;
  return (
    <div>
      <p className="text-sm">
        {label ? `${label}: ` : ""}
        <strong>{count} de {total} semanas</strong>
      </p>
      <div
        role="progressbar"
        aria-label={label ?? "Progreso"}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        aria-valuetext={`${count} de ${total} semanas`}
        className="mt-1 h-2 w-full overflow-hidden rounded bg-line"
      >
        <div className="h-full bg-mat" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
      </div>
    </div>
  );
}
