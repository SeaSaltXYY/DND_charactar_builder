import { NextRequest, NextResponse } from "next/server";
import {
  deleteCampaign,
  getCampaign,
  updateCampaign,
} from "@/lib/db/queries";
import { embedOne } from "@/lib/rag/embeddings";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const item = getCampaign(params.id);
  if (!item) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json({ campaign: item });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const title = String(body.title || "").slice(0, 255);
  const content = String(body.content || "").trim();
  if (!content) {
    return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
  }

  let embedding: number[] | null = null;
  try {
    embedding = await embedOne(content.slice(0, 4000));
  } catch (e) {
    console.warn("[campaigns] embed failed:", e);
  }

  updateCampaign(params.id, title || "（未命名）", content, embedding);
  const item = getCampaign(params.id);
  return NextResponse.json({ campaign: item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  deleteCampaign(params.id);
  return NextResponse.json({ ok: true });
}
