import { NextRequest, NextResponse } from "next/server";

const FIRST = [
  "Thalion", "Elaria", "Grimsbeard", "Vaelen", "Korrin",
  "Silwyn", "Ulfgar", "Mirelle", "Dain", "Aurelia",
  "Kaelith", "Brom", "Sorrin", "Lyra", "Haldrin",
  "Nym", "Talia", "Rook", "Orin", "Sylas",
];
const LAST = [
  "Starfall", "Ironforge", "Shadowmere", "Brightwood", "Stormhold",
  "Ravencrest", "Silversong", "Blackthorn", "Dawnbringer", "Goldleaf",
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const count = Math.max(1, Math.min(20, Number(body.count || 5)));
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const f = FIRST[Math.floor(Math.random() * FIRST.length)];
    const l = LAST[Math.floor(Math.random() * LAST.length)];
    names.push(`${f} ${l}`);
  }
  return NextResponse.json({ names });
}
