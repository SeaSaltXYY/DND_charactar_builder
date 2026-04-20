/**
 * 管理接口：清空所有 embedding 数据并触发重新向量化。
 * 当切换 embedding 模型（维度改变）时使用。
 * 
 * POST /api/admin/rebuild-embeddings
 * Header: x-admin-key: <ADMIN_KEY env var>
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { autoSeedBuiltinRulebook, isSeeding } from "@/lib/db/auto-seed";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY;
  if (adminKey) {
    const provided = req.headers.get("x-admin-key");
    if (provided !== adminKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (isSeeding()) {
    return NextResponse.json({ error: "向量化正在进行中，请稍后" }, { status: 409 });
  }

  const db = getDb();
  db.exec(`DELETE FROM rulebook_chunks; DELETE FROM rulebooks;`);

  autoSeedBuiltinRulebook().catch((err) => {
    console.error("[rebuild-embeddings] error:", err);
  });

  return NextResponse.json({
    message: "已清空旧数据，重新向量化已在后台启动",
  });
}
