import { pipeline, env } from "@huggingface/transformers";

env.allowLocalModels = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: Promise<any> | null = null;

function getInstance(
  progressCallback?: (progress: unknown) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (instance === null) {
    instance = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      progress_callback: progressCallback,
    } as Record<string, unknown>);
  }
  return instance;
}

self.addEventListener("message", async (event: MessageEvent) => {
  const { type, texts, id } = event.data;

  if (type === "load") {
    await getInstance((progress) => {
      self.postMessage({ type: "progress", progress });
    });
    self.postMessage({ type: "ready" });
    return;
  }

  if (type === "embed") {
    const extractor = await getInstance();
    const output = await extractor(texts, {
      pooling: "mean",
      normalize: true,
    });
    const embeddings = output.tolist();
    self.postMessage({ type: "embeddings", embeddings, id });
  }
});
