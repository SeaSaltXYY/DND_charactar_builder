import { NextRequest, NextResponse } from "next/server";
import { deleteCharacter, getCharacter, saveCharacter } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const c = getCharacter(params.id);
  if (!c) return NextResponse.json({ error: "未找到" }, { status: 404 });
  return NextResponse.json({ character: c });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const c = saveCharacter({ ...body, id: params.id });
  return NextResponse.json({ character: c });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  deleteCharacter(params.id);
  return NextResponse.json({ ok: true });
}
