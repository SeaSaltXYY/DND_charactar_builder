import { NextRequest, NextResponse } from "next/server";
import { deleteCharacter, getCharacter, saveCharacter } from "@/lib/db/queries";
import { getUserId, getOrCreateUserId } from "@/lib/user-id";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = getUserId();
  const c = getCharacter(params.id, uid);
  if (!c) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json({ character: c });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const uid = getOrCreateUserId();
  const c = saveCharacter({ ...body, id: params.id }, uid);
  return NextResponse.json({ character: c });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = getUserId();
  deleteCharacter(params.id, uid);
  return NextResponse.json({ ok: true });
}
