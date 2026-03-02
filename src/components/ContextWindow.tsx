"use client";

import { useState } from "react";
import type { Turn } from "@/lib/data";

interface ContextWindowProps {
  turns: Turn[];
  collapsed?: boolean;
}

const INITIAL_VISIBLE = 6;

export default function ContextWindow({
  turns,
  collapsed = false,
}: ContextWindowProps) {
  const [expanded, setExpanded] = useState(false);

  // Collapsed mode: show only the student-before-shutdown + shutdown pair
  if (collapsed) {
    const shutdownIdx = turns.findIndex((t) => t.isShutdown);
    const collapsedTurns = turns.filter((_, idx) => {
      return idx === shutdownIdx - 1 || idx === shutdownIdx;
    });

    return (
      <div className="w-full">
        <p className="mb-2 text-xs font-medium tracking-wide text-sand-500 uppercase">
          Classroom Exchange
        </p>
        <div className="space-y-0 rounded-xl border border-sand-200 bg-white overflow-hidden shadow-sm">
          {collapsedTurns.map((turn, i) => (
            <TurnRow key={i} turn={turn} turns={turns} index={i} />
          ))}
        </div>
      </div>
    );
  }

  // Normal mode: show last INITIAL_VISIBLE turns, expand to all on "Load More"
  const hasHiddenTurns = turns.length > INITIAL_VISIBLE && !expanded;
  const visibleTurns = hasHiddenTurns
    ? turns.slice(turns.length - INITIAL_VISIBLE)
    : turns;
  const hiddenCount = turns.length - INITIAL_VISIBLE;

  return (
    <div className="w-full">
      <p className="mb-3 text-xs font-medium tracking-wide text-sand-500 uppercase">
        Classroom Context
      </p>

      {hasHiddenTurns && (
        <button
          onClick={() => setExpanded(true)}
          className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-sand-200 bg-white px-4 py-2.5 text-xs font-semibold text-sand-600 shadow-sm transition-all hover:bg-sand-50 hover:text-sand-800 hover:shadow active:scale-[0.99]"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
          Load {hiddenCount} earlier interaction{hiddenCount !== 1 ? "s" : ""}
        </button>
      )}

      <div className="space-y-0 rounded-xl border border-sand-200 bg-white overflow-hidden shadow-sm">
        {visibleTurns.map((turn, i) => {
          // Map back to global index for shutdown detection
          const globalIdx = hasHiddenTurns
            ? i + (turns.length - INITIAL_VISIBLE)
            : i;
          return (
            <TurnRow
              key={globalIdx}
              turn={turn}
              turns={turns}
              index={globalIdx}
              showTopBorder={i > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

function TurnRow({
  turn,
  turns,
  index,
  showTopBorder = true,
}: {
  turn: Turn;
  turns: Turn[];
  index: number;
  showTopBorder?: boolean;
}) {
  const isStudent = turn.speaker === "student";
  const isShutdown = turn.isShutdown;

  const shutdownIdx = turns.findIndex((t) => t.isShutdown);
  const isStudentBeforeShutdown = isStudent && index === shutdownIdx - 1;

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 transition-colors duration-200
        ${isShutdown ? "bg-shutdown-50 border-l-3 border-l-shutdown-500" : ""}
        ${isStudentBeforeShutdown ? "bg-slate-blue-50 border-l-3 border-l-slate-blue-400" : ""}
        ${!isShutdown && !isStudentBeforeShutdown ? "border-l-3 border-l-transparent" : ""}
        ${showTopBorder ? "border-t border-t-sand-100" : ""}
      `}
    >
      <span
        className={`
          mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase
          ${isStudent
            ? "bg-slate-blue-100 text-slate-blue-600"
            : isShutdown
              ? "bg-shutdown-100 text-shutdown-700"
              : "bg-sand-100 text-sand-600"
          }
        `}
      >
        {isStudent ? "Student" : "Teacher"}
      </span>
      <p
        className={`
          text-sm leading-relaxed flex-1
          ${isShutdown ? "text-shutdown-700 font-medium" : "text-sand-800"}
        `}
      >
        {turn.text}
        {isShutdown && (
          <span className="ml-2 inline-flex items-center rounded-md bg-shutdown-100 px-1.5 py-0.5 text-xs font-semibold text-shutdown-600">
            Shutdown
          </span>
        )}
      </p>
    </div>
  );
}
