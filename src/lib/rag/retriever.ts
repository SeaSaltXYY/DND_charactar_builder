import { embedOne, cosineSimilarity } from "./embeddings";
import { getAllChunks, listCampaigns } from "../db/queries";
import type { RetrievedChunk } from "@/types/rulebook";
import type { CampaignBackground } from "@/types/campaign";

export interface RetrieveOptions {
  rulebookIds?: string[];
  topK?: number;
  minScore?: number;
}

export async function retrieveRulebookChunks(
  query: string,
  opts: RetrieveOptions = {}
): Promise<RetrievedChunk[]> {
  const topK = opts.topK ?? 5;
  const minScore = opts.minScore ?? 0.2;

  const queryVec = await embedOne(query);
  const all = getAllChunks(opts.rulebookIds);
  if (all.length === 0) return [];

  const scored = all
    .filter((c) => c.embedding.length === queryVec.length)
    .map((c) => ({
      id: c.id,
      rulebook_id: c.rulebook_id,
      rulebook_name: c.rulebook_name,
      content: c.content,
      chapter: c.chapter,
      page_number: c.page_number,
      score: cosineSimilarity(queryVec, c.embedding),
    }));
  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((c) => c.score >= minScore)
    .slice(0, topK);
}

export async function retrieveCampaignChunks(
  query: string,
  campaignIds?: string[],
  topK = 2
): Promise<CampaignBackground[]> {
  const all = listCampaigns();
  const candidates = campaignIds
    ? all.filter((c) => campaignIds.includes(c.id))
    : all;
  if (candidates.length === 0) return [];

  const withEmbedding = candidates.filter((c) => c.embedding);
  if (withEmbedding.length === 0) {
    return candidates.slice(0, topK);
  }

  const queryVec = await embedOne(query);
  const scored = withEmbedding.map((c) => ({
    item: c,
    score: cosineSimilarity(queryVec, c.embedding as number[]),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.item);
}
