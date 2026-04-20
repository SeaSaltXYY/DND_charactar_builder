import { NextRequest, NextResponse } from "next/server";
import { listCharacters, saveCharacter } from "@/lib/db/queries";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ characters: listCharacters() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "缺少角色名" }, { status: 400 });
  }
  const c = saveCharacter(body);
  return NextResponse.json({ character: c });
}
