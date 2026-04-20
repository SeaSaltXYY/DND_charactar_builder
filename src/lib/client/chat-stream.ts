import type { RetrievedChunk } from "@/types/rulebook";
import type { CharacterDraft } from "@/types/character";

interface HistoryItem {
  role: string;
  content: string;
}

export interface ChatStreamHandlers {
  onCitations: (c: RetrievedChunk[]) => void;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
  onCharacterUpdate?: (patch: Partial<CharacterDraft>) => void;
}

export interface ChatStreamOptions {
  message: string;
  history?: HistoryItem[];
  rulebookIds?: string[];
  campaignIds?: string[];
  mode?: "rules_qa" | "character_helper";
  characterContext?: {
    current_step?: string;
    selected_so_far?: string;
  };
  draftJSON?: string;
  topK?: number;
}

export async function streamChat(
  opts: ChatStreamOptions,
  handlers: ChatStreamHandlers,
  signal?: AbortSignal
) {
  const resp = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: opts.message,
      history: opts.history,
      rulebook_ids: opts.rulebookIds,
      campaign_ids: opts.campaignIds,
      mode: opts.mode || "rules_qa",
      character_context: opts.characterContext,
      draft_json: opts.draftJSON,
      top_k: opts.topK,
    }),
    signal,
  });

  if (!resp.ok || !resp.body) {
    const text = await resp.text();
    handlers.onError(`HTTP ${resp.status}: ${text}`);
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const part of parts) {
        handleEvent(part, handlers);
      }
    }
    if (buffer.trim()) handleEvent(buffer, handlers);
  } catch (e) {
    if ((e as Error).name !== "AbortError") {
      handlers.onError(e instanceof Error ? e.message : String(e));
    }
  }
}

function handleEvent(raw: string, h: ChatStreamHandlers) {
  const lines = raw.split("\n");
  let event = "message";
  let data = "";
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return;
  try {
    const payload = JSON.parse(data);
    if (event === "citations") h.onCitations(payload);
    else if (event === "delta") h.onDelta(payload.text || "");
    else if (event === "done") h.onDone();
    else if (event === "error") h.onError(payload.error || "unknown");
    else if (event === "character_update" && h.onCharacterUpdate) {
      h.onCharacterUpdate(payload);
    }
  } catch {
    // ignore malformed
  }
}
