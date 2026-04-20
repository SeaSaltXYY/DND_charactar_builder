import { NextRequest, NextResponse } from "next/server";
import { rollDice } from "@/lib/dice";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const expr = body.dice || body.expression;
    if (!expr) {
      return NextResponse.json({ error: "缺少 dice 表达式" }, { status: 400 });
    }
    const result = rollDice(expr);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }
}
