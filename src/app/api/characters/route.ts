import { NextRequest, NextResponse } from "next/server";
import { listCharacters, saveCharacter } from "@/lib/db/queries";
import { getUserId, getOrCreateUserId } from "@/lib/user-id";

export const runtime = "nodejs";

export async function GET() {
  const uid = getUserId();
  return NextResponse.json({ characters: listCharacters(uid) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "缺少角色名" }, { status: 400 });
  }
  const uid = getOrCreateUserId();
  const c = saveCharacter(body, uid);
  return NextResponse.json({ character: c });
}
