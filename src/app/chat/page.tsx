"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Square, BookOpen, Map, Trash2 } from "lucide-react";
import { v4 as uuid } from "uuid";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { PixelTextarea } from "@/components/ui/PixelInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { streamChat } from "@/lib/client/chat-stream";
import type { ChatMessage } from "@/types/chat";
import type { Rulebook } from "@/types/rulebook";

interface CampaignRow {
  id: string;
  title: string;
  content: string;
  has_embedding: boolean;
}

export default function ChatPage() {
  const [books, setBooks] = useState<Rulebook[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [bookIds, setBookIds] = useState<string[]>([]);
  const [campaignIds, setCampaignIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const [br, cr] = await Promise.all([
        fetch("/api/rulebooks").then((r) => r.json()),
        fetch("/api/campaigns").then((r) => r.json()),
      ]);
      const readyBooks: Rulebook[] = (br.rulebooks || []).filter(
        (b: Rulebook) => b.status === "ready"
      );
      setBooks(readyBooks);
      setBookIds(readyBooks.map((b) => b.id));
      setCampaigns(cr.campaigns || []);
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send() {
    const msg = input.trim();
    if (!msg || sending) return;

    const userMsg: ChatMessage = {
      id: uuid(),
      role: "user",
      content: msg,
      created_at: new Date().toISOString(),
    };
    const assistantMsg: ChatMessage = {
      id: uuid(),
      role: "assistant",
      content: "",
      citations: [],
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const history = messages.filter((m) => m.content.trim().length > 0);

    await streamChat(
      {
        message: msg,
        history,
        rulebookIds: bookIds,
        campaignIds,
        mode: "rules_qa",
      },
      {
        onCitations: (c) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, citations: c } : m
            )
          );
        },
        onDelta: (t) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content + t }
                : m
            )
          );
        },
        onDone: () => setSending(false),
        onError: (err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? {
                    ...m,
                    content:
                      m.content +
                      `\n\n⚠ **出错：**${err}\n请检查 .env.local 中的 API Key 与规则书是否已就绪。`,
                  }
                : m
            )
          );
          setSending(false);
        },
      },
      controller.signal
    );
  }

  function stop() {
    abortRef.current?.abort();
    setSending(false);
  }

  function clear() {
    if (sending) stop();
    setMessages([]);
  }

  function toggleBook(id: string) {
    setBookIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function toggleCamp(id: string) {
    setCampaignIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
      {/* 左侧：上下文选择 */}
      <aside className="space-y-3">
        <PixelCard
          title={
            <span className="flex items-center gap-2 text-pixel-gold">
              <BookOpen size={14} /> 激活规则书
            </span>
          }
        >
          {books.length === 0 && (
            <div className="text-sm text-text-muted">
              没有已就绪的规则书。先去{" "}
              <a href="/rulebooks" className="text-pixel-blue underline">
                规则书页面
              </a>{" "}
              上传或加载。
            </div>
          )}
          <div className="space-y-2">
            {books.map((b) => (
              <label
                key={b.id}
                className="flex cursor-pointer items-start gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={bookIds.includes(b.id)}
                  onChange={() => toggleBook(b.id)}
                />
                <div>
                  <div className="font-silk">{b.name}</div>
                  <div className="text-xs text-text-muted">
                    {b.chunk_count} 块 · {b.source}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </PixelCard>

        <PixelCard
          title={
            <span className="flex items-center gap-2 text-pixel-green">
              <Map size={14} /> 模组背景
            </span>
          }
        >
          {campaigns.length === 0 && (
            <div className="text-sm text-text-muted">尚无模组背景</div>
          )}
          <div className="space-y-2">
            {campaigns.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-start gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={campaignIds.includes(c.id)}
                  onChange={() => toggleCamp(c.id)}
                />
                <span className="font-silk truncate">{c.title || "（未命名）"}</span>
              </label>
            ))}
          </div>
        </PixelCard>

        <PixelCard>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">已激活规则书</span>
              <PixelBadge color="gold">{bookIds.length}</PixelBadge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">已激活模组</span>
              <PixelBadge color="green">{campaignIds.length}</PixelBadge>
            </div>
            <PixelButton variant="red" onClick={clear}>
              <Trash2 size={12} /> 清空对话
            </PixelButton>
          </div>
        </PixelCard>
      </aside>

      {/* 主聊天区 */}
      <section className="flex min-h-[60vh] flex-col">
        <div
          ref={scrollRef}
          className="pixel-panel flex-1 space-y-4 overflow-auto p-4"
          style={{ maxHeight: "calc(100vh - 260px)" }}
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-text-muted">
              <div className="text-4xl">🧙</div>
              <div className="mt-2 font-silk text-pixel-base">
                向 AI 裁判提问吧
              </div>
              <div className="mt-3 max-w-md text-sm leading-relaxed">
                例如：
                <br />
                · 战士和圣武士的核心差别是什么？
                <br />
                · 高等级法师施放魔法飞弹有什么加成？
                <br />
                · 我的角色陷入恐惧状态，能怎么摆脱？
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              msg={m}
              streaming={sending && i === messages.length - 1 && m.role === "assistant"}
            />
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <PixelTextarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的规则问题... (Enter 发送，Shift+Enter 换行)"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          {sending ? (
            <PixelButton variant="red" onClick={stop}>
              <Square size={14} /> 停止
            </PixelButton>
          ) : (
            <PixelButton variant="gold" onClick={send}>
              <Send size={14} /> 发送
            </PixelButton>
          )}
        </div>
      </section>
    </div>
  );
}
