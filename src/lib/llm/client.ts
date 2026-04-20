import OpenAI from "openai";

// ── 聊天客户端（DeepSeek / 任意 OpenAI 兼容供应商）────────────────
let _chatClient: OpenAI | null = null;

export function getLLM(): OpenAI {
  if (_chatClient) return _chatClient;
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  if (!apiKey) {
    throw new Error(
      "[LLM] 未配置 OPENAI_API_KEY。请在 .env.local 中填入 API Key。"
    );
  }
  _chatClient = new OpenAI({ apiKey, baseURL });
  return _chatClient;
}

// ── Embedding 客户端（可单独指定 OpenAI，也可与聊天共用同一供应商）──
let _embedClient: OpenAI | null = null;

export function getEmbedClient(): OpenAI {
  if (_embedClient) return _embedClient;

  // 优先使用专用的 embedding key/url；若未配置则回退到聊天用的 key/url
  const apiKey =
    process.env.EMBED_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL =
    process.env.EMBED_BASE_URL || "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error(
      "[Embed] 未配置 EMBED_API_KEY 或 OPENAI_API_KEY。"
    );
  }
  _embedClient = new OpenAI({ apiKey, baseURL });
  return _embedClient;
}

export const CHAT_MODEL =
  process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

export const EMBEDDING_DIM = Number(
  process.env.OPENAI_EMBEDDING_DIM || 1536
);
