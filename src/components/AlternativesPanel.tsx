"use client";

import type { Alternatives } from "@/lib/data";
import { FRAMEWORK_INFO } from "@/lib/data";
import AlternativeCard from "./AlternativeCard";

interface AlternativesPanelProps {
  alternatives: Alternatives;
  scores: Record<keyof Alternatives, number>;
}

const FRAMEWORK_ORDER: (keyof Alternatives)[] = [
  "dialogicTeaching",
  "productiveFailure",
  "uptake",
  "pressingForReasoning",
];

export default function AlternativesPanel({
  alternatives,
  scores,
}: AlternativesPanelProps) {
  const sorted = [...FRAMEWORK_ORDER].sort(
    (a, b) => scores[b] - scores[a]
  );

  return (
    <div className="w-full animate-fade-up">
      <p className="mb-3 text-xs font-medium tracking-wide text-sand-500 uppercase">
        Research-Based Alternatives
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((key, i) => {
          const info = FRAMEWORK_INFO[key];
          return (
            <AlternativeCard
              key={key}
              frameworkLabel={info.label}
              citation={info.citation}
              description={info.description}
              text={alternatives[key]}
              score={scores[key]}
              animationDelay={i * 0.1}
            />
          );
        })}
      </div>
    </div>
  );
}
