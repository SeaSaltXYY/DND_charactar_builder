export interface Rulebook {
  id: string;
  name: string;
  source: "upload" | "builtin";
  file_url: string | null;
  status: "processing" | "ready" | "error";
  chunk_count: number;
  progress_info: string | null;
  created_at: string;
}

export interface RulebookChunk {
  id: string;
  rulebook_id: string;
  content: string;
  chapter: string | null;
  page_number: number | null;
  embedding: number[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RetrievedChunk {
  id: string;
  rulebook_id: string;
  rulebook_name: string;
  content: string;
  chapter: string | null;
  page_number: number | null;
  score: number;
}
