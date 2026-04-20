import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = process.env.DATABASE_PATH || "./data/dnd.db";
  const absPath = path.resolve(process.cwd(), dbPath);
  const dir = path.dirname(absPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  _db = new Database(absPath);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rulebooks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('upload','builtin')),
      file_url TEXT,
      status TEXT NOT NULL DEFAULT 'processing',
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
      embedding TEXT NOT NULL,     -- JSON 数组
      metadata TEXT,                -- JSON 对象
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_chunks_rulebook ON rulebook_chunks(rulebook_id);

    CREATE TABLE IF NOT EXISTS campaign_backgrounds (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT NOT NULL,
      source_type TEXT NOT NULL DEFAULT 'text',
      embedding TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      race TEXT,
      subrace TEXT,
      class TEXT,
      subclass TEXT,
      level INTEGER DEFAULT 1,
      background TEXT,
      alignment TEXT,
      ability_scores TEXT,  -- JSON
      skills TEXT,
      equipment TEXT,
      spells TEXT,
      features TEXT,
      hp INTEGER,
      ac INTEGER,
      full_sheet TEXT,
      campaign_id TEXT REFERENCES campaign_backgrounds(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      session_type TEXT NOT NULL,
      messages TEXT NOT NULL DEFAULT '[]',
      character_id TEXT REFERENCES characters(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function resetDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}
