/**
 * 首次启动自动导入内置 5E 不全书种子。
 * 种子文件为 gzip 压缩的 JSON，包含预解析的文本 chunks（不含 embeddings）。
 * 首次导入时会异步计算 embeddings。
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import {
  listRulebooks,
  createRulebook,
  insertChunks,
  updateRulebookStatus,
  updateRulebookProgress,
} from "./queries";
import { embedTexts } from "@/lib/rag/embeddings";

// standalone build 时 cwd 是 .next/standalone，src/data 被复制到同级
// 普通 dev/build 时 cwd 是项目根
const SEED_FILE = (() => {
  const candidates = [
    path.resolve(process.cwd(), "src/data/rulebook-seed.json.gz"),
    path.resolve(__dirname, "../../../data/rulebook-seed.json.gz"),
    path.resolve(__dirname, "../../../../src/data/rulebook-seed.json.gz"),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? candidates[0];
})();

const BUILTIN_NAME = "D&D 5E 不全书";

let _seeding = false;

interface SeedChunk {
  index: number;
  chapter: string | null;
  content: string;
}

interface SeedData {
  name: string;
  version: string;
  chunkCount: number;
  chunks: SeedChunk[];
}

export function shouldAutoSeed(): boolean {
  if (_seeding) return false;
  if (!fs.existsSync(SEED_FILE)) return false;
  const books = listRulebooks();
  return books.length === 0;
}

export function isSeeding(): boolean {
  return _seeding;
}

export async function autoSeedBuiltinRulebook(): Promise<void> {
  if (_seeding) return;
  _seeding = true;

  console.log("[auto-seed] 开始导入内置规则书...");

  let seed: SeedData;
  try {
    const compressed = fs.readFileSync(SEED_FILE);
    const json = zlib.gunzipSync(compressed).toString("utf-8");
    seed = JSON.parse(json);
  } catch (e) {
    console.error("[auto-seed] 种子文件读取失败:", e);
    _seeding = false;
    return;
  }

  console.log(
    `[auto-seed] 种子: ${seed.name} (${seed.chunkCount} chunks)`
  );

  const book = createRulebook(BUILTIN_NAME, "builtin");
  updateRulebookProgress(book.id, `导入中... 0/${seed.chunks.length} chunks`);

  try {
    const BATCH = 8;
    const DB_FLUSH = 50;
    let embedded = 0;
    let buf: Array<{
      rulebook_id: string;
      content: string;
      chapter: string | null;
      page_number: number | null;
      embedding: number[];
      metadata: Record<string, unknown>;
    }> = [];

    for (let i = 0; i < seed.chunks.length; i += BATCH) {
      const batch = seed.chunks.slice(i, i + BATCH);
      const texts = batch.map((c) => c.content);

      let embeddings: number[][];
      try {
        embeddings = await embedTexts(texts);
      } catch (err) {
        console.error("[auto-seed] embedding 失败, 跳过该批:", err);
        continue;
      }

      for (let j = 0; j < batch.length; j++) {
        buf.push({
          rulebook_id: book.id,
          content: batch[j].content,
          chapter: batch[j].chapter,
          page_number: null,
          embedding: embeddings[j],
          metadata: { source: "builtin-seed" },
        });
      }

      embedded += batch.length;

      if (buf.length >= DB_FLUSH) {
        insertChunks(buf);
        buf = [];
      }

      const pct = Math.min(
        100,
        Math.round((embedded / seed.chunks.length) * 100)
      );
      updateRulebookProgress(
        book.id,
        `向量化 ${pct}% (${embedded}/${seed.chunks.length})`
      );

      if (embedded % 100 === 0) {
        console.log(
          `[auto-seed] 进度: ${pct}% (${embedded}/${seed.chunks.length})`
        );
      }
    }

    if (buf.length > 0) {
      insertChunks(buf);
    }

    updateRulebookStatus(book.id, "ready", embedded);
    updateRulebookProgress(book.id, `完成! ${embedded} chunks`);
    console.log(`[auto-seed] ✅ 导入完成! ${embedded} chunks`);
  } catch (e) {
    console.error("[auto-seed] 导入失败:", e);
    updateRulebookStatus(book.id, "error");
    updateRulebookProgress(
      book.id,
      `错误: ${e instanceof Error ? e.message : String(e)}`
    );
  } finally {
    _seeding = false;
  }
}
