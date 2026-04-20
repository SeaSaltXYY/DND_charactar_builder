"use client";
import { ReactNode } from "react";
import { User, Sparkles } from "lucide-react";
import { SourceCitation } from "./SourceCitation";
import type { ChatMessage } from "@/types/chat";

export function MessageBubble({
  msg,
  streaming,
}: {
  msg: ChatMessage;
  streaming?: boolean;
}) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border-4 ${
          isUser
            ? "border-[#142c66] bg-pixel-blue text-white"
            : "border-[#6a5200] bg-pixel-gold text-text-dark"
        }`}
        style={{
          boxShadow: isUser
            ? "inset -2px -2px 0 0 #142c66, inset 2px 2px 0 0 #b0c8ff"
            : "inset -2px -2px 0 0 #6a5200, inset 2px 2px 0 0 #fff4a8",
        }}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      <div className={`max-w-[82%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`${
            isUser ? "pixel-panel" : "pixel-panel-parchment"
          } inline-block whitespace-pre-wrap p-3 text-left text-[15px] leading-relaxed ${
            streaming ? "cursor-typing" : ""
          }`}
        >
          <MarkdownLite text={msg.content} />
        </div>
        {!isUser && msg.citations && msg.citations.length > 0 && (
          <SourceCitation citations={msg.citations} />
        )}
      </div>
    </div>
  );
}

/** 极简 markdown：加粗 / 行内代码 / 列表，够聊天显示用。 */
function MarkdownLite({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        // headings
        const h = line.match(/^(#{1,3})\s+(.*)$/);
        if (h) {
          const level = h[1].length;
          const cls =
            level === 1
              ? "text-lg font-bold"
              : level === 2
              ? "text-base font-bold"
              : "text-sm font-bold";
          return (
            <div key={i} className={cls}>
              {renderInline(h[2])}
            </div>
          );
        }
        // bullets
        if (/^\s*[-*]\s+/.test(line)) {
          return (
            <div key={i} className="pl-3">
              • {renderInline(line.replace(/^\s*[-*]\s+/, ""))}
            </div>
          );
        }
        return (
          <div key={i}>
            {line.length ? renderInline(line) : <>&nbsp;</>}
          </div>
        );
      })}
    </>
  );
}

function renderInline(text: string): ReactNode {
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <strong key={i} className="text-[#5a2818]">
          {p.slice(2, -2)}
        </strong>
      );
    }
    if (/^`[^`]+`$/.test(p)) {
      return (
        <code
          key={i}
          className="rounded bg-black/15 px-1 py-[1px] font-mono text-[13px]"
        >
          {p.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
