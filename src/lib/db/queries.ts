import { v4 as uuid } from "uuid";
import { getDb } from "./index";
import type { Rulebook, RulebookChunk } from "@/types/rulebook";
import type { CampaignBackground } from "@/types/campaign";
import type { Character } from "@/types/character";
import type { ChatSession, ChatMessage } from "@/types/chat";

/* ========== Rulebooks ========== */

export function createRulebook(
  name: string,
  source: "upload" | "builtin",
  fileUrl?: string
): Rulebook {
  const db = getDb();
  const id = uuid();
  db.prepare(
    `INSERT INTO rulebooks (id, name, source, file_url, status) VALUES (?, ?, ?, ?, 'processing')`
  ).run(id, name, source, fileUrl || null);
  return getRulebook(id)!;
}

export function updateRulebookStatus(
  id: string,
  status: "processing" | "ready" | "error",
  chunkCount?: number
) {
  const db = getDb();
  if (typeof chunkCount === "number") {
    db.prepare(
      `UPDATE rulebooks SET status = ?, chunk_count = ? WHERE id = ?`
    ).run(status, chunkCount, id);
  } else {
    db.prepare(`UPDATE rulebooks SET status = ? WHERE id = ?`).run(status, id);
  }
}

export function updateRulebookProgress(id: string, info: string) {
  const db = getDb();
  db.prepare(`UPDATE rulebooks SET progress_info = ? WHERE id = ?`).run(info, id);
}

export function getRulebook(id: string): Rulebook | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM rulebooks WHERE id = ?`)
    .get(id) as Rulebook | undefined;
  return row || null;
}

export function listRulebooks(): Rulebook[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM rulebooks ORDER BY created_at DESC`)
    .all() as Rulebook[];
}

export function deleteRulebook(id: string) {
  const db = getDb();
  db.prepare(`DELETE FROM rulebooks WHERE id = ?`).run(id);
}

/* ========== Rulebook Chunks ========== */

export function insertChunks(
  chunks: Array<Omit<RulebookChunk, "id" | "created_at">>
) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO rulebook_chunks (id, rulebook_id, content, chapter, page_number, embedding, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const tx = db.transaction(
    (items: Array<Omit<RulebookChunk, "id" | "created_at">>) => {
      for (const c of items) {
        stmt.run(
          uuid(),
          c.rulebook_id,
          c.content,
          c.chapter,
          c.page_number,
          JSON.stringify(c.embedding),
          JSON.stringify(c.metadata || {})
        );
      }
    }
  );
  tx(chunks);
}

export function getAllChunks(rulebookIds?: string[]): Array<{
  id: string;
  rulebook_id: string;
  rulebook_name: string;
  content: string;
  chapter: string | null;
  page_number: number | null;
  embedding: number[];
}> {
  const db = getDb();
  let rows: Array<Record<string, unknown>>;
  if (rulebookIds && rulebookIds.length > 0) {
    const placeholders = rulebookIds.map(() => "?").join(",");
    rows = db
      .prepare(
        `SELECT c.id, c.rulebook_id, r.name AS rulebook_name, c.content, c.chapter,
                c.page_number, c.embedding
           FROM rulebook_chunks c
           JOIN rulebooks r ON r.id = c.rulebook_id
          WHERE c.rulebook_id IN (${placeholders})`
      )
      .all(...rulebookIds) as Array<Record<string, unknown>>;
  } else {
    rows = db
      .prepare(
        `SELECT c.id, c.rulebook_id, r.name AS rulebook_name, c.content, c.chapter,
                c.page_number, c.embedding
           FROM rulebook_chunks c
           JOIN rulebooks r ON r.id = c.rulebook_id`
      )
      .all() as Array<Record<string, unknown>>;
  }
  return rows.map((r) => ({
    id: r.id as string,
    rulebook_id: r.rulebook_id as string,
    rulebook_name: r.rulebook_name as string,
    content: r.content as string,
    chapter: (r.chapter as string) || null,
    page_number: (r.page_number as number) || null,
    embedding: JSON.parse(r.embedding as string) as number[],
  }));
}

/* ========== Campaign Backgrounds ========== */

export function createCampaign(
  title: string,
  content: string,
  sourceType: "text" | "image_ocr",
  embedding: number[] | null
): CampaignBackground {
  const db = getDb();
  const id = uuid();
  db.prepare(
    `INSERT INTO campaign_backgrounds (id, title, content, source_type, embedding)
     VALUES (?, ?, ?, ?, ?)`
  ).run(id, title, content, sourceType, embedding ? JSON.stringify(embedding) : null);
  return getCampaign(id)!;
}

export function updateCampaign(
  id: string,
  title: string,
  content: string,
  embedding: number[] | null
) {
  const db = getDb();
  db.prepare(
    `UPDATE campaign_backgrounds SET title = ?, content = ?, embedding = ? WHERE id = ?`
  ).run(title, content, embedding ? JSON.stringify(embedding) : null, id);
}

export function getCampaign(id: string): CampaignBackground | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM campaign_backgrounds WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    ...(row as unknown as CampaignBackground),
    embedding: row.embedding ? JSON.parse(row.embedding as string) : null,
  };
}

export function listCampaigns(): CampaignBackground[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM campaign_backgrounds ORDER BY created_at DESC`)
    .all() as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    ...(row as unknown as CampaignBackground),
    embedding: row.embedding ? JSON.parse(row.embedding as string) : null,
  }));
}

export function deleteCampaign(id: string) {
  const db = getDb();
  db.prepare(`DELETE FROM campaign_backgrounds WHERE id = ?`).run(id);
}

/* ========== Characters ========== */

export function saveCharacter(c: Partial<Character> & { name: string }): Character {
  const db = getDb();
  const id = c.id || uuid();
  const now = new Date().toISOString();
  const full = {
    id,
    name: c.name,
    race: c.race || null,
    subrace: c.subrace || null,
    class: c.class || null,
    subclass: c.subclass || null,
    level: c.level ?? 1,
    background: c.background || null,
    alignment: c.alignment || null,
    ability_scores: c.ability_scores || {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    },
    skills: c.skills || [],
    equipment: c.equipment || [],
    spells: c.spells || [],
    features: c.features || [],
    hp: c.hp ?? 10,
    ac: c.ac ?? 10,
    full_sheet: c.full_sheet || {},
    campaign_id: c.campaign_id || null,
    created_at: c.created_at || now,
    updated_at: now,
  } as Character;

  const exists = db.prepare(`SELECT id FROM characters WHERE id = ?`).get(id);
  if (exists) {
    db.prepare(
      `UPDATE characters SET name=?, race=?, subrace=?, class=?, subclass=?, level=?,
        background=?, alignment=?, ability_scores=?, skills=?, equipment=?, spells=?,
        features=?, hp=?, ac=?, full_sheet=?, campaign_id=?, updated_at=?
        WHERE id=?`
    ).run(
      full.name,
      full.race,
      full.subrace,
      full.class,
      full.subclass,
      full.level,
      full.background,
      full.alignment,
      JSON.stringify(full.ability_scores),
      JSON.stringify(full.skills),
      JSON.stringify(full.equipment),
      JSON.stringify(full.spells),
      JSON.stringify(full.features),
      full.hp,
      full.ac,
      JSON.stringify(full.full_sheet),
      full.campaign_id,
      full.updated_at,
      id
    );
  } else {
    db.prepare(
      `INSERT INTO characters (id, name, race, subrace, class, subclass, level,
        background, alignment, ability_scores, skills, equipment, spells, features,
        hp, ac, full_sheet, campaign_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      full.name,
      full.race,
      full.subrace,
      full.class,
      full.subclass,
      full.level,
      full.background,
      full.alignment,
      JSON.stringify(full.ability_scores),
      JSON.stringify(full.skills),
      JSON.stringify(full.equipment),
      JSON.stringify(full.spells),
      JSON.stringify(full.features),
      full.hp,
      full.ac,
      JSON.stringify(full.full_sheet),
      full.campaign_id,
      full.created_at,
      full.updated_at
    );
  }
  return getCharacter(id)!;
}

export function getCharacter(id: string): Character | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM characters WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return parseCharacterRow(row);
}

export function listCharacters(): Character[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM characters ORDER BY updated_at DESC`)
    .all() as Array<Record<string, unknown>>;
  return rows.map(parseCharacterRow);
}

export function deleteCharacter(id: string) {
  getDb().prepare(`DELETE FROM characters WHERE id = ?`).run(id);
}

function parseCharacterRow(row: Record<string, unknown>): Character {
  return {
    id: row.id as string,
    name: row.name as string,
    race: (row.race as string) || null,
    subrace: (row.subrace as string) || null,
    class: (row.class as string) || null,
    subclass: (row.subclass as string) || null,
    level: (row.level as number) || 1,
    background: (row.background as string) || null,
    alignment: (row.alignment as string) || null,
    ability_scores: JSON.parse((row.ability_scores as string) || "{}"),
    skills: JSON.parse((row.skills as string) || "[]"),
    equipment: JSON.parse((row.equipment as string) || "[]"),
    spells: JSON.parse((row.spells as string) || "[]"),
    features: JSON.parse((row.features as string) || "[]"),
    hp: (row.hp as number) || 10,
    ac: (row.ac as number) || 10,
    full_sheet: JSON.parse((row.full_sheet as string) || "{}"),
    campaign_id: (row.campaign_id as string) || null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/* ========== Chat Sessions ========== */

export function createChatSession(
  sessionType: "rules_qa" | "character_creation",
  characterId?: string | null
): ChatSession {
  const db = getDb();
  const id = uuid();
  db.prepare(
    `INSERT INTO chat_sessions (id, session_type, character_id) VALUES (?, ?, ?)`
  ).run(id, sessionType, characterId || null);
  return getChatSession(id)!;
}

export function getChatSession(id: string): ChatSession | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM chat_sessions WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    id: row.id as string,
    session_type: row.session_type as "rules_qa" | "character_creation",
    messages: JSON.parse((row.messages as string) || "[]"),
    character_id: (row.character_id as string) || null,
    created_at: row.created_at as string,
  };
}

export function appendChatMessages(id: string, messages: ChatMessage[]) {
  const db = getDb();
  const session = getChatSession(id);
  if (!session) return;
  const updated = [...session.messages, ...messages];
  db.prepare(`UPDATE chat_sessions SET messages = ? WHERE id = ?`).run(
    JSON.stringify(updated),
    id
  );
}

export function listChatSessions(): ChatSession[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM chat_sessions ORDER BY created_at DESC`)
    .all() as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    id: row.id as string,
    session_type: row.session_type as "rules_qa" | "character_creation",
    messages: JSON.parse((row.messages as string) || "[]"),
    character_id: (row.character_id as string) || null,
    created_at: row.created_at as string,
  }));
}
