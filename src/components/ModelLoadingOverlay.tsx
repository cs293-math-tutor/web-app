"use client";

interface ModelLoadingOverlayProps {
  progress: number;
  isReady: boolean;
}

export default function ModelLoadingOverlay({
  progress,
  isReady,
}: ModelLoadingOverlayProps) {
  if (isReady) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sand-50/95 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse-subtle">
            <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="var(--color-sand-300)"
                strokeWidth="2"
              />
              <path
                d="M16 24c0-4.418 3.582-8 8-8s8 3.582 8 8"
                stroke="var(--color-slate-blue-500)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="24" cy="24" r="3" fill="var(--color-slate-blue-500)" />
            </svg>
          </div>

          <h2 className="mb-1 font-display text-lg font-bold text-sand-800">
            Preparing Similarity Engine
          </h2>
          <p className="text-sm text-sand-500">
            Loading the language model for response comparison.
            <br />
            This happens once and is cached for future visits.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-sand-200">
            <div
              className="h-full rounded-full bg-slate-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs tabular-nums text-sand-400">
            {Math.round(progress)}% loaded
          </p>
        </div>
      </div>
    </div>
  );
}
