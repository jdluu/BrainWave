import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Local embedding model — runs in-process, no external API needed.
// bge-small-en-v1.5 produces 384-dim embeddings.
let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", "Xenova/bge-small-en-v1.5") as Promise<FeatureExtractionPipeline>;
  }
  return extractorPromise;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}
