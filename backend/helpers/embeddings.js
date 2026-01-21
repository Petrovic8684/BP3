import { pipeline } from "@xenova/transformers";

let embedder;
const TARGET_DIM = parseInt(process.env.EMBEDDING_DIM || "384", 10);

export async function initEmbedder() {
  if (!embedder)
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
}

export async function generateEmbedding(text) {
  if (!embedder) await initEmbedder();

  const result = await embedder(text, { pooling: "mean", normalize: true });

  const tensor = Array.isArray(result) ? result[0] : result;
  const floatArr = tensor?.data ? Array.from(tensor.data) : Array.from(tensor);

  if (!Array.isArray(floatArr) || floatArr.length !== TARGET_DIM)
    throw new Error(
      `[helpers/embeddings.js] Neslaganje dimenzija: očekivano ${TARGET_DIM}, dobijeno ${floatArr.length}`,
    );

  return floatArr;
}
