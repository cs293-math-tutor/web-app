import type { Alternatives } from "./data";

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export async function computeScores(
  embed: (texts: string[]) => Promise<number[][]>,
  userResponse: string,
  alternatives: Alternatives
): Promise<{ scores: Record<keyof Alternatives, number>; bestScore: number }> {
  const texts = [
    userResponse,
    alternatives.dialogicTeaching,
    alternatives.productiveFailure,
    alternatives.uptake,
    alternatives.pressingForReasoning,
  ];

  const embeddings = await embed(texts);
  const userEmb = embeddings[0];

  const scores = {
    dialogicTeaching: cosineSimilarity(userEmb, embeddings[1]),
    productiveFailure: cosineSimilarity(userEmb, embeddings[2]),
    uptake: cosineSimilarity(userEmb, embeddings[3]),
    pressingForReasoning: cosineSimilarity(userEmb, embeddings[4]),
  };

  const bestScore = Math.max(...Object.values(scores));
  return { scores, bestScore };
}
