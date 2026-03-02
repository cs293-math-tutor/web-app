"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-sand-200">
        <div
          className="h-full rounded-full bg-slate-blue-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium tabular-nums text-sand-500">
        {current + 1} / {total}
      </span>
    </div>
  );
}
