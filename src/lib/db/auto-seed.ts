/**
 * 首次启动自动导入内置 5E 不全书。
 * 优先使用预构建数据库（dnd-prebuilt.db.gz），直接解压到 /data/dnd.db，秒级完成。
 * 若不存在预构建库则回退到实时向量化流程（需要 Embedding API）。
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

function findDataFile(filename: string): string | null {
  const candidates = [
    path.resolve(process.cwd(), "src/data", filename),
    path.resolve(__dirname, "../../../data", filename),
    path.resolve(__dirname, "../../../../src/data", filename),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

const PREBUILT_GZ = findDataFile("dnd-prebuilt.db.gz");
const SEED_FILE = findDataFile("rulebook-seed.json.gz");
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
  if (!PREBUILT_GZ && !SEED_FILE) return false;
  const books = listRulebooks();
  return books.length === 0;
}

export function isSeeding(): boolean {
  return _seeding;
}

export async function autoSeedBuiltinRulebook(): Promise<void> {
  if (_seeding) return;
  _seeding = true;

  // ── 方案 A：预构建数据库，直接解压替换当前 DB ──────────────────
  if (PREBUILT_GZ) {
    console.log("[auto-seed] 发现预构建数据库，直接解压...");
    try {
      const dbPath = process.env.DATABASE_PATH || "./data/dnd.db";
      const absDbPath = path.resolve(process.cwd(), dbPath);

      // 确保目录存在
      fs.mkdirSync(path.dirname(absDbPath), { recursive: true });

      const gz = fs.readFileSync(PREBUILT_GZ);
      const db = zlib.gunzipSync(gz);
      fs.writeFileSync(absDbPath, db);

      console.log(`[auto-seed] ✅ 预构建数据库已加载 (${(db.length / 1024 / 1024).toFixed(1)} MB)`);
      // 重置 DB 连接，让下一次请求重新打开新 DB
      const { resetDb } = await import("./index");
      resetDb();
      _seeding = false;
      return;
    } catch (e) {
      console.error("[auto-seed] 预构建数据库加载失败，回退到实时向量化:", e);
    }
  }

  // ── 方案 B：回退 - 实时向量化 ──────────────────────────────────
  if (!SEED_FILE) {
    console.error("[auto-seed] 种子文件不存在，跳过自动导入");
    _seeding = false;
    return;
  }

  console.log("[auto-seed] 开始实时向量化内置规则书...");

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

  console.log(`[auto-seed] 种子: ${seed.name} (${seed.chunkCount} chunks)`);

  const book = createRulebook(BUILTIN_NAME, "builtin");
  updateRulebookProgress(book.id, `向量化中... 0/${seed.chunks.length} chunks`);

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
      const texts = batch.map((c) => c.content.slice(0, 400));

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

      const pct = Math.min(100, Math.round((embedded / seed.chunks.length) * 100));
      updateRulebookProgress(book.id, `向量化 ${pct}% (${embedded}/${seed.chunks.length})`);

      if (embedded % 200 === 0) {
        console.log(`[auto-seed] 进度: ${pct}% (${embedded}/${seed.chunks.length})`);
      }
    }

    if (buf.length > 0) insertChunks(buf);

    updateRulebookStatus(book.id, "ready", embedded);
    updateRulebookProgress(book.id, `完成! ${embedded} chunks`);
    console.log(`[auto-seed] ✅ 导入完成! ${embedded} chunks`);
  } catch (e) {
    console.error("[auto-seed] 导入失败:", e);
    updateRulebookStatus(book.id, "error");
    updateRulebookProgress(book.id, `错误: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    _seeding = false;
  }
}
