import { getEmbedClient, EMBEDDING_MODEL, EMBEDDING_DIM } from "../llm/client";

/**
 * 对一段或多段文本进行 Embedding。
 * 自动批处理（每批 64 条）以避免超出 API 限制。
 */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const client = getEmbedClient();
  const out: number[][] = [];

  // Ollama 不支持批量 input，逐条调用
  const isOllama = (process.env.EMBED_BASE_URL || "").includes("11434");
  if (isOllama) {
    for (const text of texts) {
      const resp = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
      });
      out.push(resp.data[0].embedding as number[]);
    }
    return out;
  }

  // OpenAI 兼容 API 支持批量
  const BATCH = 64;
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const resp = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    for (const item of resp.data) {
      out.push(item.embedding as number[]);
    }
  }
  return out;
}

export async function embedOne(text: string): Promise<number[]> {
  const [v] = await embedTexts([text]);
  return v;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export { EMBEDDING_DIM };
