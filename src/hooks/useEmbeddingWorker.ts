"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface ProgressEvent {
  status?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

interface WorkerMessage {
  type: "progress" | "ready" | "embeddings";
  progress?: ProgressEvent;
  embeddings?: number[][];
  id?: string;
}

export function useEmbeddingWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const resolversRef = useRef<
    Map<string, (embeddings: number[][]) => void>
  >(new Map());

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/embedding.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    worker.addEventListener("message", (e: MessageEvent<WorkerMessage>) => {
      const { data } = e;

      if (data.type === "progress" && data.progress) {
        if (typeof data.progress.progress === "number") {
          setLoadingProgress(data.progress.progress);
        }
      } else if (data.type === "ready") {
        setIsModelReady(true);
        setLoadingProgress(100);
      } else if (data.type === "embeddings" && data.id) {
        const resolver = resolversRef.current.get(data.id);
        if (resolver && data.embeddings) {
          resolver(data.embeddings);
          resolversRef.current.delete(data.id);
        }
      }
    });

    worker.postMessage({ type: "load" });

    return () => worker.terminate();
  }, []);

  const embed = useCallback((texts: string[]): Promise<number[][]> => {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      resolversRef.current.set(id, resolve);
      workerRef.current?.postMessage({ type: "embed", texts, id });
    });
  }, []);

  return { embed, isModelReady, loadingProgress };
}
