import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  createRulebook,
  insertChunks,
  updateRulebookStatus,
  updateRulebookProgress,
} from "@/lib/db/queries";
import { parseFile } from "@/lib/parsers";
import { chunkDocument } from "@/lib/rag/chunker";
import { embedTexts } from "@/lib/rag/embeddings";

export const runtime = "nodejs";
export const maxDuration = 600;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "未收到文件" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const name = (formData.get("name") as string) || file.name;

    const uploadDir = path.resolve(process.cwd(), "data/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const safeName = `${Date.now()}-${name.replace(/[^\w.-]/g, "_")}`;
    const savePath = path.join(uploadDir, safeName);
    fs.writeFileSync(savePath, buffer);

    const rulebook = createRulebook(name, "upload", `/uploads/${safeName}`);

    processRulebook(rulebook.id, buffer, name).catch((err) => {
      console.error("[rulebook] processing failed:", err);
      updateRulebookStatus(rulebook.id, "error");
      updateRulebookProgress(rulebook.id, `错误: ${err instanceof Error ? err.message : String(err)}`);
    });

    return NextResponse.json({ rulebook });
  } catch (e: unknown) {
    const err = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

async function processRulebook(
  id: string,
  buffer: Buffer,
  filename: string
) {
  const t0 = Date.now();
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  console.log(`[rulebook] 开始处理: ${filename} (${sizeMB} MB)`);
  updateRulebookProgress(id, `解析文件中... (${sizeMB} MB)`);

  // 1. 解析文件
  const text = await parseFile(buffer, filename);
  if (!text.trim()) {
    updateRulebookStatus(id, "error");
    updateRulebookProgress(id, "错误: 文件解析结果为空");
    throw new Error("文件解析结果为空");
  }
  const elapsed1 = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[rulebook] 解析完成，文本长度: ${text.length} 字符 (${elapsed1}s)`);
  updateRulebookProgress(id, `解析完成 (${text.length} 字符)，分块中...`);

  // 2. 分块 — 大文件用更大的 chunk
  const isLarge = text.length > 200_000;
  const chunkSize = isLarge ? 2500 : 1500;
  const overlap = isLarge ? 200 : 150;
  const chunks = chunkDocument(text, { chunkSize, overlap });
  if (chunks.length === 0) {
    updateRulebookStatus(id, "error");
    updateRulebookProgress(id, "错误: 分块结果为空");
    throw new Error("分块结果为空");
  }
  const elapsed2 = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[rulebook] 分块完成: ${chunks.length} 个 chunks (${elapsed2}s)`);
  updateRulebookProgress(id, `分块完成 (${chunks.length} 块)，向量化 0%...`);

  // 3. 分批向量化 + 写入数据库（每批完成立即写入，避免内存过大）
  const EMBED_BATCH = 8;
  let embeddedCount = 0;
  let chunkBuf: Array<{
    rulebook_id: string;
    content: string;
    chapter: string | null;
    page_number: number | null;
    embedding: number[];
    metadata: Record<string, unknown>;
  }> = [];
  const DB_FLUSH = 50;

  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const batch = chunks.slice(i, i + EMBED_BATCH);
    const embs = await embedTexts(batch.map((c) => c.content));

    for (let j = 0; j < batch.length; j++) {
      chunkBuf.push({
        rulebook_id: id,
        content: batch[j].content,
        chapter: batch[j].chapter,
        page_number: batch[j].page_number,
        embedding: embs[j],
        metadata: batch[j].metadata || {},
      });
    }

    embeddedCount += batch.length;

    if (chunkBuf.length >= DB_FLUSH) {
      insertChunks(chunkBuf);
      chunkBuf = [];
    }

    const pct = Math.min(100, Math.round((embeddedCount / chunks.length) * 100));
    const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
    updateRulebookProgress(id, `向量化 ${pct}% (${embeddedCount}/${chunks.length})，已用 ${elapsed}s`);

    if (embeddedCount % 50 === 0 || pct === 100) {
      console.log(`[rulebook] 向量化进度: ${pct}% (${embeddedCount}/${chunks.length}) - ${elapsed}s`);
    }
  }

  if (chunkBuf.length > 0) {
    insertChunks(chunkBuf);
  }

  updateRulebookStatus(id, "ready", embeddedCount);
  const totalSec = ((Date.now() - t0) / 1000).toFixed(1);
  updateRulebookProgress(id, `完成! ${embeddedCount} 块, 耗时 ${totalSec}s`);
  console.log(`[rulebook] ✅ 处理完成! ${embeddedCount} chunks, 耗时 ${totalSec}s`);
}
