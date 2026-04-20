"use client";
import { useState } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";
import { PixelCard } from "../ui/PixelCard";
import { PixelButton } from "../ui/PixelButton";
import { PixelInput } from "../ui/PixelInput";
import { useCharacterStore } from "@/stores/character-store";
import type { RetrievedChunk } from "@/types/rulebook";

interface Props {
  category:
    | "races"
    | "classes"
    | "backgrounds"
    | "ability"
    | "skills"
    | "equipment"
    | "spells"
    | "general";
  title: string;
  extraQuery?: string;
}

/** 在建卡步骤中点击"从规则书加载"，从 RAG 检索相关原文并展示。 */
export function RulesPicker({ category, title, extraQuery }: Props) {
  const { rulebookIds } = useCharacterStore();
  const [q, setQ] = useState("");
  const [chunks, setChunks] = useState<RetrievedChunk[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load(query?: string) {
    setBusy(true);
    setErr(null);
    try {
      const resp = await fetch("/api/rules/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          extra: query || extraQuery,
          rulebook_ids: rulebookIds.length ? rulebookIds : undefined,
          top_k: 6,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "检索失败");
      setChunks(data.chunks || []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PixelCard
      title={
        <span className="flex items-center gap-2 text-pixel-blue">
          <BookOpen size={14} /> {title}
        </span>
      }
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <PixelInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`在规则书里搜索（可留空自动搜"${title}"）`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                load(q);
              }
            }}
          />
          <PixelButton variant="blue" onClick={() => load(q)} disabled={busy}>
            {busy ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Search size={12} />
            )}
            查询
          </PixelButton>
        </div>
        {err && (
          <div className="font-silk text-sm text-pixel-red">⚠ {err}</div>
        )}
        {chunks.length > 0 && (
          <div className="max-h-[320px] space-y-2 overflow-auto">
            {chunks.map((c) => (
              <div
                key={c.id}
                className="pixel-border-thin bg-[#0a0e18] p-2 text-xs"
              >
                <div className="mb-1 flex flex-wrap gap-2 font-silk text-[10px] text-pixel-gold">
                  <span>📘 {c.rulebook_name}</span>
                  {c.chapter && <span className="text-text-muted">· {c.chapter}</span>}
                  <span className="ml-auto text-pixel-green">
                    {(c.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-[13px] leading-relaxed text-text-primary">
                  {c.content}
                </div>
              </div>
            ))}
          </div>
        )}
        {chunks.length === 0 && !busy && (
          <div className="text-sm text-text-muted">
            点击「查询」从已激活的规则书中检索 {title}。
          </div>
        )}
      </div>
    </PixelCard>
  );
}
