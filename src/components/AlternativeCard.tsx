"use client";

import FrameworkTooltip from "./FrameworkTooltip";

interface AlternativeCardProps {
  frameworkLabel: string;
  citation: string;
  description: string;
  text: string;
  score: number;
  animationDelay?: number;
}

function getScoreColor(score: number): string {
  if (score >= 0.7) return "var(--color-score-high)";
  if (score >= 0.45) return "var(--color-score-mid)";
  return "var(--color-score-low)";
}

export default function AlternativeCard({
  frameworkLabel,
  citation,
  description,
  text,
  score,
  animationDelay = 0,
}: AlternativeCardProps) {
  const percentage = Math.round(score * 100);
  const color = getScoreColor(score);

  return (
    <div
      className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{
        animation: `fade-up 0.5s ease-out ${animationDelay}s both`,
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <FrameworkTooltip description={description} citation={citation}>
          <h3 className="text-sm font-bold text-sand-800">{frameworkLabel}</h3>
        </FrameworkTooltip>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
          style={{
            color,
            backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          {percentage}%
        </span>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-sand-700">
        &ldquo;{text}&rdquo;
      </p>

      {/* Score bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-100">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
