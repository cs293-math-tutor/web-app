"use client";

import { useEffect, useState } from "react";

interface SimilarityGaugeProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 0.7) return "var(--color-score-high)";
  if (score >= 0.45) return "var(--color-score-mid)";
  return "var(--color-score-low)";
}

function getScoreLabel(score: number): string {
  if (score >= 0.7) return "Strongly aligned";
  if (score >= 0.55) return "Well aligned";
  if (score >= 0.45) return "Moderately aligned";
  if (score >= 0.3) return "Partially aligned";
  return "Low alignment";
}

export default function SimilarityGauge({ score }: SimilarityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = Math.round(score * 100);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG circle math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-up">
      <p className="text-xs font-medium tracking-wide text-sand-500 uppercase">
        Semantic Similarity
      </p>

      <div className="relative flex items-center justify-center">
        <svg width="148" height="148" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke="var(--color-sand-200)"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s ease-out, stroke 0.3s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="whitespace-nowrap text-3xl font-bold font-display tabular-nums"
            style={{ color }}
          >
            {animatedScore}%
          </span>
        </div>
      </div>

      <p className="text-sm font-medium" style={{ color }}>
        {label}
      </p>
      <p className="max-w-xs text-center text-xs leading-relaxed text-sand-500">
        This score measures how closely your response aligns with
        research-based alternatives across four pedagogical frameworks.
      </p>
    </div>
  );
}
