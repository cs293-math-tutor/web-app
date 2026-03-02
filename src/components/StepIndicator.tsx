"use client";

export type Step = "context" | "write" | "similarity" | "reveal";

interface StepIndicatorProps {
  currentStep: Step;
}

const STEPS: { key: Step; label: string }[] = [
  { key: "context", label: "Read" },
  { key: "write", label: "Write" },
  { key: "similarity", label: "Score" },
  { key: "reveal", label: "Compare" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((step, i) => {
        const isActive = i === currentIdx;
        const isCompleted = i < currentIdx;

        return (
          <div key={step.key} className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`
                  flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                  ${isCompleted ? "bg-slate-blue-500 text-white" : ""}
                  ${isActive ? "bg-slate-blue-500 text-white ring-2 ring-slate-blue-200 ring-offset-1" : ""}
                  ${!isActive && !isCompleted ? "bg-sand-200 text-sand-500" : ""}
                `}
              >
                {isCompleted ? (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`
                  hidden text-xs font-medium sm:inline
                  ${isActive ? "text-slate-blue-600" : "text-sand-400"}
                `}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`
                  h-px w-4 sm:w-8 transition-colors duration-300
                  ${i < currentIdx ? "bg-slate-blue-400" : "bg-sand-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
