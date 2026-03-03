"use client";

import type { Step } from "./StepIndicator";

interface NavigationControlsProps {
  step: Step;
  canGoBack: boolean;
  canCheck: boolean;
  isComputing: boolean;
  isJigsaw: boolean;
  showContext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onWriteStep: () => void;
  onCheck: () => void;
  onRevise: () => void;
  onToggleContext: () => void;
}

export default function NavigationControls({
  step,
  canGoBack,
  canCheck,
  isComputing,
  isJigsaw,
  showContext,
  onPrevious,
  onNext,
  onWriteStep,
  onCheck,
  onRevise,
  onToggleContext,
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
          <>
            <button
              onClick={onNext}
              className="rounded-lg border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-sand-600 transition-all hover:bg-sand-50 hover:border-sand-300"
            >
              Skip
            </button>
            <button
              onClick={onWriteStep}
              className="rounded-lg bg-slate-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98]"
            >
              {isJigsaw ? "Match Alternatives" : "Write Your Response"}
            </button>
          </>
        )}

        {step === "write" && !isJigsaw && (
          <>
            {/* Show Context toggle */}
            <button
              onClick={onToggleContext}
              className="flex items-center gap-1.5 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm font-medium text-sand-600 transition-all hover:bg-sand-50 hover:border-sand-300"
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
                  d={
                    showContext
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  }
                />
              </svg>
              <span className="hidden sm:inline">
                {showContext ? "Hide Context" : "Show Context"}
              </span>
            </button>

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
          </>
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
