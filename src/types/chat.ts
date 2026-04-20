import type { RetrievedChunk } from "./rulebook";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: RetrievedChunk[];
  created_at: string;
}

export interface ChatSession {
  id: string;
  session_type: "rules_qa" | "character_creation";
  messages: ChatMessage[];
  character_id: string | null;
  created_at: string;
}

export interface ChatRequestBody {
  message: string;
  session_id?: string | null;
  rulebook_ids?: string[];
  campaign_ids?: string[];
  character_context?: Record<string, unknown>;
  history?: ChatMessage[];
}
