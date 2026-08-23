import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/embeddings";

const EMBEDDING_DIM = 384;

function bytesToFloat32(buf: Uint8Array): number[] {
  const floats = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  return Array.from(floats);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function findRelevantNotes(
  userId: string,
  query: string,
  topK = 4,
) {
  const queryEmbedding = await getEmbedding(query);

  const userNotes = await prisma.note.findMany({
    where: { userId, embedding: { not: null } },
    select: { id: true, embedding: true },
  });

  const scored: { id: string; score: number }[] = userNotes
    .map((note) => ({
      id: note.id,
      score: note.embedding ? cosineSimilarity(queryEmbedding, bytesToFloat32(note.embedding)) : -1,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const relevantNotes = await prisma.note.findMany({
    where: { id: { in: scored.map((s) => s.id) } },
  });

  // Preserve relevance order
  const scoreById = new Map(scored.map((s) => [s.id, s.score]));
  return relevantNotes.sort((a, b) => (scoreById.get(b.id) ?? 0) - (scoreById.get(a.id) ?? 0));
}

export async function embedNote(title: string, content: string | undefined) {
  const embedding = await getEmbedding(title + "\n\n" + (content ?? ""));
  if (embedding.length !== EMBEDDING_DIM) {
    throw new Error(`Unexpected embedding dimension: ${embedding.length}`);
  }
  return new Uint8Array(new Float32Array(embedding).buffer);
}
