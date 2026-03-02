import type { Alternatives } from "./data";

const STORAGE_KEY = "nope-moments-state";

export interface ResponseRecord {
  text: string;
  bestScore: number;
  scores: Record<keyof Alternatives, number>;
  attempts: number;
  timestamp: number;
}

export interface PersistedState {
  version: 1;
  currentIndex: number;
  responses: Record<string, ResponseRecord>;
}

export function loadState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}
