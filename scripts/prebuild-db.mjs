/**
 * 预生成内置规则书的 embedding 数据库。
 * 运行: node scripts/prebuild-db.mjs
 * 输出: src/data/dnd-prebuilt.db.gz
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ── 配置 ─────────────────────────────────────────────────────────────
const EMBED_API_KEY = process.env.EMBED_API_KEY;
const EMBED_BASE_URL = process.env.EMBED_BASE_URL || "https://api.siliconflow.cn/v1";
const EMBED_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "BAAI/bge-large-zh-v1.5";
const EMBED_DIM = parseInt(process.env.OPENAI_EMBEDDING_DIM || "1024");
const BATCH_SIZE = 8; // 硅基流动支持批量
// BAAI/bge-large-zh-v1.5 限制 512 tokens，中文约 400 字符安全
const MAX_CHARS = 400;

if (!EMBED_API_KEY) {
  console.error("❌ 请设置 EMBED_API_KEY 环境变量");
  process.exit(1);
}

const SEED_FILE = path.resolve(__dirname, "../src/data/rulebook-seed.json.gz");
const OUT_DB = path.resolve(__dirname, "../src/data/dnd-prebuilt.db");
const OUT_GZ = OUT_DB + ".gz";

// ── 读取种子文件 ─────────────────────────────────────────────────────
console.log("📖 读取种子文件...");
const compressed = fs.readFileSync(SEED_FILE);
const seed = JSON.parse(zlib.gunzipSync(compressed).toString("utf-8"));
const chunks = seed.chunks;
console.log(`✅ ${chunks.length} chunks 待向量化`);

// ── 初始化 SQLite ────────────────────────────────────────────────────
const Database = require("better-sqlite3");
if (fs.existsSync(OUT_DB)) fs.unlinkSync(OUT_DB);
const db = new Database(OUT_DB);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS rulebooks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    file_url TEXT,
    status TEXT NOT NULL DEFAULT 'ready',
    chunk_count INTEGER NOT NULL DEFAULT 0,
    progress_info TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS rulebook_chunks (
    id TEXT PRIMARY KEY,
    rulebook_id TEXT NOT NULL REFERENCES rulebooks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    chapter TEXT,
    page_number INTEGER,
    embedding TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_chunks_rulebook ON rulebook_chunks(rulebook_id);
  CREATE TABLE IF NOT EXISTS campaign_backgrounds (
    id TEXT PRIMARY KEY, title TEXT, content TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'text', embedding TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, race TEXT, subrace TEXT,
    class TEXT, subclass TEXT, level INTEGER DEFAULT 1, background TEXT,
    alignment TEXT, ability_scores TEXT, skills TEXT, equipment TEXT,
    spells TEXT, features TEXT, hp INTEGER, ac INTEGER, full_sheet TEXT,
    campaign_id TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY, session_type TEXT NOT NULL,
    messages TEXT NOT NULL DEFAULT '[]', character_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// 插入规则书记录
const BOOK_ID = "builtin-prebuilt";
db.prepare(`
  INSERT INTO rulebooks (id, name, source, status, chunk_count, progress_info)
  VALUES (?, ?, 'builtin', 'ready', ?, '预构建完成')
`).run(BOOK_ID, "D&D 5E 不全书", chunks.length);

// ── Embedding API ────────────────────────────────────────────────────
async function embedBatch(texts) {
  const resp = await fetch(`${EMBED_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EMBED_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Embedding API ${resp.status}: ${err}`);
  }
  const data = await resp.json();
  return data.data.map((d) => d.embedding);
}

// ── 插入 chunk ────────────────────────────────────────────────────────
const insertChunk = db.prepare(`
  INSERT INTO rulebook_chunks (id, rulebook_id, content, chapter, page_number, embedding, metadata)
  VALUES (?, ?, ?, ?, NULL, ?, ?)
`);
const insertMany = db.transaction((rows) => {
  for (const r of rows) insertChunk.run(...r);
});

// ── 主循环 ────────────────────────────────────────────────────────────
const start = Date.now();
let done = 0;
let errors = 0;

for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
  const batch = chunks.slice(i, i + BATCH_SIZE);
  const texts = batch.map((c) => c.content.slice(0, MAX_CHARS));

  let embeddings;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      embeddings = await embedBatch(texts);
      break;
    } catch (err) {
      if (attempt === 2) {
        console.error(`  ⚠ 批次 ${i}-${i + batch.length} 失败:`, err.message);
        errors++;
        embeddings = null;
        break;
      }
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }

  if (!embeddings) continue;

  // 维度检查
  if (embeddings[0].length !== EMBED_DIM) {
    console.warn(`  ⚠ 维度不匹配: 期望 ${EMBED_DIM}, 实际 ${embeddings[0].length}`);
  }

  const rows = batch.map((c, j) => [
    `chunk-${BOOK_ID}-${i + j}`,
    BOOK_ID,
    c.content,
    c.chapter ?? null,
    JSON.stringify(embeddings[j]),
    JSON.stringify({ source: "prebuilt" }),
  ]);
  insertMany(rows);
  done += batch.length;

  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  const pct = Math.round((done / chunks.length) * 100);
  const eta = done > 0
    ? Math.round(((chunks.length - done) / done) * (Date.now() - start) / 1000)
    : "?";
  process.stdout.write(
    `\r⚡ ${pct}% (${done}/${chunks.length}) | 用时 ${elapsed}s | 剩余约 ${eta}s   `
  );
}

console.log(`\n\n✅ 向量化完成: ${done} chunks, ${errors} 批次失败`);

// 更新实际 chunk 数
db.prepare("UPDATE rulebooks SET chunk_count = ? WHERE id = ?").run(done, BOOK_ID);
db.close();

// ── 压缩输出 ─────────────────────────────────────────────────────────
console.log("📦 压缩数据库...");
const dbBuf = fs.readFileSync(OUT_DB);
const gzBuf = zlib.gzipSync(dbBuf, { level: 6 });
fs.writeFileSync(OUT_GZ, gzBuf);
fs.unlinkSync(OUT_DB); // 删除未压缩版本

const sizeMB = (gzBuf.length / 1024 / 1024).toFixed(1);
console.log(`✅ 输出: src/data/dnd-prebuilt.db.gz (${sizeMB} MB)`);
console.log("🚀 现在可以运行 git add + push 将预构建数据库上传到仓库");
