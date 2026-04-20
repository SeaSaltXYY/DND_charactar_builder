import { NextRequest, NextResponse } from "next/server";
import { createCampaign, listCampaigns } from "@/lib/db/queries";
import { embedOne } from "@/lib/rag/embeddings";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  const list = listCampaigns().map((c) => ({
    id: c.id,
    title: c.title,
    content: c.content,
    source_type: c.source_type,
    has_embedding: !!c.embedding,
    created_at: c.created_at,
  }));
  return NextResponse.json({ campaigns: list });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const title = String(body.title || "").slice(0, 255);
  const content = String(body.content || "").trim();
  const sourceType = body.source_type === "image_ocr" ? "image_ocr" : "text";

  if (!content) {
    return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
  }

  let embedding: number[] | null = null;
  try {
    embedding = await embedOne(content.slice(0, 4000));
  } catch (e) {
    console.warn("[campaigns] embedding failed:", e);
  }

  const item = createCampaign(title || "（未命名）", content, sourceType, embedding);
  return NextResponse.json({ campaign: item });
}
