import { NextRequest, NextResponse } from "next/server";
import { retrieveRulebookChunks } from "@/lib/rag/retriever";
import { buildCategoryQuery } from "@/lib/rag/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query =
      body.query ||
      buildCategoryQuery(body.category || "general", body.extra);
    const topK = Number(body.top_k || 4);
    const rulebookIds = Array.isArray(body.rulebook_ids) && body.rulebook_ids.length
      ? body.rulebook_ids
      : undefined;
    const chunks = await retrieveRulebookChunks(query, {
      rulebookIds,
      topK,
      minScore: 0.1,
    });
    return NextResponse.json({ chunks });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
