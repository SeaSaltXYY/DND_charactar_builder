"use client";
import { useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { streamChat } from "@/lib/client/chat-stream";
import { useCharacterStore } from "@/stores/character-store";
import type { RetrievedChunk } from "@/types/rulebook";
import { PixelCard } from "../ui/PixelCard";
import { PixelButton } from "../ui/PixelButton";
import { PixelInput } from "../ui/PixelInput";
import { SourceCitation } from "../chat/SourceCitation";

interface Props {
  stepLabel: string;
}

export function MiniAssistant({ stepLabel }: Props) {
  const { draft, rulebookIds } = useCharacterStore();
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<RetrievedChunk[]>([]);
  const [busy, setBusy] = useState(false);

  async function ask() {
    const msg = q.trim();
    if (!msg || busy) return;
    setBusy(true);
    setAnswer("");
    setCitations([]);
    const selected = JSON.stringify(
      {
        name: draft.name,
        race: draft.race,
        class: draft.class,
        level: draft.level,
        background: draft.background,
        ability_scores: draft.ability_scores,
      },
      null,
      2
    );
    await streamChat(
      {
        message: msg,
        mode: "character_helper",
        rulebookIds,
        characterContext: {
          current_step: stepLabel,
          selected_so_far: selected,
        },
        topK: 4,
      },
      {
        onCitations: (c) => setCitations(c),
        onDelta: (t) => setAnswer((prev) => prev + t),
        onDone: () => setBusy(false),
        onError: (err) => {
          setAnswer((prev) => prev + `\n\n⚠ ${err}`);
          setBusy(false);
        },
      }
    );
  }

  return (
    <PixelCard
      title={
        <span className="flex items-center gap-2 text-pixel-gold">
          <Bot size={14} /> AI 建卡助手
        </span>
      }
    >
      <div className="space-y-2">
        <div className="flex gap-2">
          <PixelInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`关于"${stepLabel}"你想问什么？`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                ask();
              }
            }}
          />
          <PixelButton variant="gold" onClick={ask} disabled={busy}>
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          </PixelButton>
        </div>
        {(answer || busy) && (
          <div className="pixel-border-thin bg-[#0a0e18] p-2 text-sm leading-relaxed">
            {answer || (
              <span className="text-text-muted font-silk">思考中...</span>
            )}
          </div>
        )}
        {citations.length > 0 && <SourceCitation citations={citations} />}
      </div>
    </PixelCard>
  );
}
