"use client";

import { useEmbeddingWorker } from "@/hooks/useEmbeddingWorker";
import { usePracticeState } from "@/hooks/usePracticeState";
import ContextWindow from "@/components/ContextWindow";
import ResponseInput from "@/components/ResponseInput";
import SimilarityGauge from "@/components/SimilarityGauge";
import AlternativesPanel from "@/components/AlternativesPanel";
import ProgressBar from "@/components/ProgressBar";
import StepIndicator from "@/components/StepIndicator";
import NavigationControls from "@/components/NavigationControls";
import ModelLoadingOverlay from "@/components/ModelLoadingOverlay";
import Link from "next/link";

export default function PracticePage() {
  const { embed, isModelReady, loadingProgress } = useEmbeddingWorker();
  const practice = usePracticeState(embed, isModelReady);

  if (!practice.currentExample) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sand-500">No examples available.</p>
      </div>
    );
  }

  return (
    <>
      <ModelLoadingOverlay progress={loadingProgress} isReady={isModelReady} />

      <div className="min-h-screen bg-sand-50">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/80 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <Link
                href="/"
                className="font-display text-sm font-bold text-sand-700 hover:text-sand-900 transition-colors"
              >
                Nope Moments
              </Link>
              <StepIndicator currentStep={practice.step} />
            </div>
            <ProgressBar
              current={practice.currentIndex}
              total={practice.totalExamples}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-3xl px-4 py-6 pb-28">
          <div className="space-y-6">
            {/* Context Window — always visible */}
            <ContextWindow
              key={practice.currentExample.id}
              turns={practice.currentExample.context}
              collapsed={practice.step === "similarity" || practice.step === "reveal"}
            />

            {/* Write step */}
            {(practice.step === "write" ||
              practice.step === "similarity" ||
              practice.step === "reveal") && (
                <ResponseInput
                  value={practice.userResponse}
                  onChange={practice.setUserResponse}
                  readOnly={practice.step !== "write"}
                />
              )}

            {/* Score display */}
            {practice.bestScore !== null &&
              (practice.step === "similarity" ||
                practice.step === "reveal") && (
                <SimilarityGauge score={practice.bestScore} />
              )}

            {/* Alternatives reveal */}
            {practice.step === "reveal" && practice.scores && (
              <AlternativesPanel
                alternatives={practice.currentExample.alternatives}
                scores={practice.scores}
              />
            )}
          </div>
        </main>

        {/* Fixed bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sand-200 bg-sand-50/90 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-4 py-3">
            <NavigationControls
              step={practice.step}
              canGoBack={practice.currentIndex > 0}
              canCheck={practice.userResponse.trim().length > 0}
              isComputing={practice.isComputing}
              onPrevious={practice.goToPrevious}
              onNext={practice.goToNext}
              onWriteStep={practice.goToWriteStep}
              onCheck={practice.checkSimilarity}
              onRevise={practice.revise}
            />
          </div>
        </div>
      </div>
    </>
  );
}
