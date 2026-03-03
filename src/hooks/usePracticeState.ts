"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Step } from "@/components/StepIndicator";
import type { Alternatives } from "@/lib/data";
import { examples } from "@/lib/data";
import { computeScores } from "@/lib/similarity";
import {
  loadState,
  saveState,
  type PersistedState,
  type ResponseRecord,
} from "@/lib/storage";

interface PracticeState {
  currentIndex: number;
  step: Step;
  userResponse: string;
  bestScore: number | null;
  scores: Record<keyof Alternatives, number> | null;
  isComputing: boolean;
  responses: Record<string, ResponseRecord>;
  isDone: boolean;
}

export function usePracticeState(
  embed: (texts: string[]) => Promise<number[][]>,
  isModelReady: boolean
) {
  const [state, setState] = useState<PracticeState>(() => {
    const saved = loadState();
    return {
      currentIndex: saved?.currentIndex ?? 0,
      step: "context",
      userResponse: "",
      bestScore: null,
      scores: null,
      isComputing: false,
      responses: saved?.responses ?? {},
      isDone: false,
    };
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist to localStorage on meaningful changes
  useEffect(() => {
    const persisted: PersistedState = {
      version: 2,
      currentIndex: state.currentIndex,
      responses: state.responses,
    };
    saveState(persisted);
  }, [state.currentIndex, state.responses]);

  const currentExample = examples[state.currentIndex];

  const goToWriteStep = useCallback(() => {
    setState((s) => ({ ...s, step: "write" }));
  }, []);

  const setUserResponse = useCallback((text: string) => {
    setState((s) => ({ ...s, userResponse: text }));
  }, []);

  const checkSimilarity = useCallback(async () => {
    if (!isModelReady || !currentExample) return;

    setState((s) => ({ ...s, isComputing: true }));

    try {
      const result = await computeScores(
        embed,
        stateRef.current.userResponse,
        currentExample.alternatives
      );

      setState((s) => {
        const existingRecord = s.responses[currentExample.id];
        const newRecord: ResponseRecord = {
          text: s.userResponse,
          bestScore: result.bestScore,
          scores: result.scores,
          attempts: (existingRecord?.attempts ?? 0) + 1,
          timestamp: Date.now(),
        };

        return {
          ...s,
          bestScore: result.bestScore,
          scores: result.scores,
          isComputing: false,
          step: "reveal",
          responses: {
            ...s.responses,
            [currentExample.id]: newRecord,
          },
        };
      });
    } catch {
      setState((s) => ({ ...s, isComputing: false }));
    }
  }, [embed, isModelReady, currentExample]);

  const revise = useCallback(() => {
    setState((s) => ({
      ...s,
      step: "write",
      bestScore: null,
      scores: null,
    }));
  }, []);

  const goToReveal = useCallback(() => {
    setState((s) => ({ ...s, step: "reveal" }));
  }, []);

  const goToNext = useCallback(() => {
    setState((s) => {
      if (s.currentIndex >= examples.length - 1) {
        return { ...s, isDone: true };
      }
      return {
        ...s,
        currentIndex: s.currentIndex + 1,
        step: "context",
        userResponse: "",
        bestScore: null,
        scores: null,
      };
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setState((s) => ({
      ...s,
      currentIndex: Math.max(s.currentIndex - 1, 0),
      step: "context",
      userResponse: "",
      bestScore: null,
      scores: null,
    }));
  }, []);

  return {
    ...state,
    currentExample,
    totalExamples: examples.length,
    goToWriteStep,
    setUserResponse,
    checkSimilarity,
    revise,
    goToReveal,
    goToNext,
    goToPrevious,
  };
}
