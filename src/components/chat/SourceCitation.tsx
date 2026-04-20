"use client";
import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { RetrievedChunk } from "@/types/rulebook";

export function SourceCitation({ citations }: { citations: RetrievedChunk[] }) {
  const [open, setOpen] = useState(false);
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="pixel-btn text-[9px]"
      >
        <BookOpen size={12} />
        引用 {citations.length} 条规则
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {citations.map((c, i) => (
            <div
              key={c.id}
              className="pixel-border-thin bg-[#0a0e18] p-2 text-xs text-text-primary"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2 font-silk text-[10px] text-pixel-gold">
                <span>#{i + 1}</span>
                <span>📘 {c.rulebook_name}</span>
                {c.chapter && (
                  <span className="text-text-muted">· {c.chapter}</span>
                )}
                {c.page_number && (
                  <span className="text-text-muted">· p.{c.page_number}</span>
                )}
                <span className="ml-auto text-pixel-green">
                  相似度 {(c.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="whitespace-pre-wrap text-[13px] leading-relaxed">
                {c.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
