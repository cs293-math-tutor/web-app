"use client";

import type { Step } from "./StepIndicator";

interface NavigationControlsProps {
  step: Step;
  canGoBack: boolean;
  canCheck: boolean;
  isComputing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onWriteStep: () => void;
  onCheck: () => void;
  onRevise: () => void;
}

export default function NavigationControls({
  step,
  canGoBack,
  canCheck,
  isComputing,
  onPrevious,
  onNext,
  onWriteStep,
  onCheck,
  onRevise,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        onClick={onPrevious}
        disabled={!canGoBack}
        className="flex items-center gap-1.5 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm font-medium text-sand-600 transition-all hover:bg-sand-50 hover:border-sand-300 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-2">
        {step === "context" && (
          <button
            onClick={onWriteStep}
            className="rounded-lg bg-slate-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98]"
          >
            Write Your Response
          </button>
        )}

        {step === "write" && (
          <button
            onClick={onCheck}
            disabled={!canCheck || isComputing}
            className="flex items-center gap-2 rounded-lg bg-slate-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComputing ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Computing...
              </>
            ) : (
              "Check Similarity"
            )}
          </button>
        )}

        {(step === "similarity" || step === "reveal") && (
          <>
            <button
              onClick={onRevise}
              className="rounded-lg border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-sand-600 transition-all hover:bg-sand-50 hover:border-sand-300"
            >
              Try Again
            </button>
            <button
              onClick={onNext}
              className="rounded-lg bg-slate-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98]"
            >
              Next Example
              <svg
                className="ml-1.5 inline h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
