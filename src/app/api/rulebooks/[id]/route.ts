import { NextRequest, NextResponse } from "next/server";
import { deleteRulebook, getRulebook } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const book = getRulebook(params.id);
  if (!book) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json({ rulebook: book });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  deleteRulebook(params.id);
  return NextResponse.json({ ok: true });
}
