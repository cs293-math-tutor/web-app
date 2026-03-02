"use client";

import type { Turn } from "@/lib/data";

interface ContextWindowProps {
  turns: Turn[];
  collapsed?: boolean;
}

export default function ContextWindow({
  turns,
  collapsed = false,
}: ContextWindowProps) {
  const visibleTurns = collapsed
    ? turns.filter((t) => {
        const shutdownIdx = turns.findIndex((turn) => turn.isShutdown);
        const idx = turns.indexOf(t);
        return idx === shutdownIdx - 1 || idx === shutdownIdx;
      })
    : turns;

  return (
    <div className="w-full">
      {collapsed && (
        <p className="mb-2 text-xs font-medium tracking-wide text-sand-500 uppercase">
          Classroom Exchange
        </p>
      )}
      {!collapsed && (
        <p className="mb-3 text-xs font-medium tracking-wide text-sand-500 uppercase">
          Classroom Context
        </p>
      )}
      <div className="space-y-0 rounded-xl border border-sand-200 bg-white overflow-hidden shadow-sm">
        {visibleTurns.map((turn, i) => {
          const isStudent = turn.speaker === "student";
          const isShutdown = turn.isShutdown;

          const shutdownIdx = turns.findIndex((t) => t.isShutdown);
          const globalIdx = turns.indexOf(turn);
          const isStudentBeforeShutdown =
            isStudent && globalIdx === shutdownIdx - 1;

          return (
            <div
              key={i}
              className={`
                flex items-start gap-3 px-4 py-3 transition-colors duration-200
                ${isShutdown ? "bg-shutdown-50 border-l-3 border-l-shutdown-500" : ""}
                ${isStudentBeforeShutdown ? "bg-slate-blue-50 border-l-3 border-l-slate-blue-400" : ""}
                ${!isShutdown && !isStudentBeforeShutdown ? "border-l-3 border-l-transparent" : ""}
                ${i > 0 ? "border-t border-t-sand-100" : ""}
              `}
            >
              <span
                className={`
                  mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase
                  ${
                    isStudent
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
        })}
      </div>
    </div>
  );
}
