import { NextResponse } from "next/server";
import { listRulebooks } from "@/lib/db/queries";
import { shouldAutoSeed, autoSeedBuiltinRulebook } from "@/lib/db/auto-seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (shouldAutoSeed()) {
    autoSeedBuiltinRulebook().catch((err) => {
      console.error("[auto-seed] background error:", err);
    });
  }

  const books = listRulebooks();
  return NextResponse.json({ rulebooks: books });
}
