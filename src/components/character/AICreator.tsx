"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { streamChat } from "@/lib/client/chat-stream";
import type { CharacterDraft } from "@/types/character";
import { canHaveFamiliar } from "@/data/familiars";

interface SimpleMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function mkMsg(role: SimpleMessage["role"], content: string): SimpleMessage {
  return { role, content };
}

const CHARACTER_UPDATE_RE = /<CHARACTER_UPDATE>[\s\S]*?<\/CHARACTER_UPDATE>/g;

function cleanAIText(text: string): string {
  return text.replace(CHARACTER_UPDATE_RE, "").trim();
}

function computeProgress(draft: CharacterDraft): { pct: number; next: string } {
  const checks = [
    { done: !!draft.name, label: "角色名" },
    { done: !!draft.race, label: "种族" },
    { done: !!draft.class, label: "职业" },
    { done: !!draft.subclass, label: "子职业" },
    { done: !!draft.background, label: "背景" },
    { done: !!draft.alignment, label: "阵营" },
    {
      done: Object.values(draft.ability_scores).some((v) => v !== 10),
      label: "属性分配",
    },
    { done: draft.weapons.length > 0, label: "武器" },
    { done: !!draft.armor, label: "护甲" },
    { done: !!draft.traits, label: "性格特质" },
    { done: !!draft.ideals, label: "理想" },
    { done: !!draft.bonds, label: "羁绊" },
    { done: !!draft.flaws, label: "缺陷" },
  ];

  const familiarStatus = canHaveFamiliar(draft.knownSpells, draft.class, draft.features);
  if (familiarStatus.eligible) {
    checks.push({ done: !!draft.familiar, label: "魔宠" });
  }

  const done = checks.filter((c) => c.done).length;
  const first = checks.find((c) => !c.done);
  return {
    pct: Math.round((done / checks.length) * 100),
    next: first?.label ?? "全部完成！",
  };
}

function useRulebookStatus(rulebookIds: string[]) {
  const [hasReady, setHasReady] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const r = await fetch("/api/rulebooks").then((r) => r.json());
        const books = r.rulebooks || [];
        const ready = books.some((b: { status: string }) => b.status === "ready");
        const proc = books.some((b: { status: string }) => b.status === "processing");
        if (active) {
          setHasReady(ready);
          setProcessing(proc && !ready);
        }
      } catch {
        if (active) setHasReady(false);
      }
    };
    check();
    const t = setInterval(check, 8000);
    return () => { active = false; clearInterval(t); };
  }, [rulebookIds]);

  return { hasReady, processing };
}

export default function AICreator() {
  const draft = useCharacterStore((s) => s.draft);
  const rulebookIds = useCharacterStore((s) => s.rulebookIds);
  const applyAIPatch = useCharacterStore((s) => s.applyAIPatch);

  const [messages, setMessages] = useState<SimpleMessage[]>([
    mkMsg("assistant",
      "你好冒险者！我是你的建卡助手 🎲\n\n" +
      "你可以告诉我你想要什么样的角色，比如：\n" +
      "- \"我想要一个潜行型角色\"\n" +
      "- \"帮我建一个半精灵吟游诗人\"\n" +
      "- \"什么种族适合做法师？\"\n\n" +
      "我会根据 D&D 5E 规则帮你推荐并自动填写角色表。你也可以随时手动修改左边的表单。"
    ),
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamingText]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    setStreamingText("");

    const userMsg = mkMsg("user", text);
    setMessages((prev) => [...prev, userMsg]);

    const abort = new AbortController();
    abortRef.current = abort;
    let accumulated = "";

    const historyForAPI = [...messages, userMsg]
      .filter((m) => m.role !== "system")
      .slice(-8)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    try {
      await streamChat(
        {
          message: text,
          history: historyForAPI,
          rulebookIds,
          mode: "character_helper",
          draftJSON: JSON.stringify(draft, null, 2),
          topK: 3,
        },
        {
          onCitations: () => {},
          onDelta: (delta) => {
            accumulated += delta;
            setStreamingText(cleanAIText(accumulated));
          },
          onDone: () => {
            const cleaned = cleanAIText(accumulated);
            setMessages((prev) => [...prev, mkMsg("assistant", cleaned)]);
            setStreamingText("");
            setLoading(false);
          },
          onError: (err) => {
            setMessages((prev) => [...prev, mkMsg("assistant", `❌ 错误: ${err}`)]);
            setStreamingText("");
            setLoading(false);
          },
          onCharacterUpdate: (patch) => {
            applyAIPatch(patch);
            setMessages((prev) => [
              ...prev,
              mkMsg("system", `✅ 已自动更新角色表: ${Object.keys(patch).join(", ")}`),
            ]);
          },
        },
        abort.signal
      );
    } catch {
      setLoading(false);
    }
  }, [input, loading, messages, draft, rulebookIds, applyAIPatch]);

  const handleStop = () => {
    abortRef.current?.abort();
    if (streamingText) {
      setMessages((prev) => [...prev, mkMsg("assistant", streamingText)]);
      setStreamingText("");
    }
    setLoading(false);
  };

  const progress = computeProgress(draft);
  const { hasReady, processing } = useRulebookStatus(rulebookIds);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-amber-900/30 bg-gray-900/40">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-pixel text-amber-300">🤖 AI 建卡助手</h3>
          <span className="text-[10px] font-pixel text-amber-500">
            {progress.pct}% 完成
          </span>
        </div>
        <div className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        {progress.pct < 100 && (
          <div className="text-[10px] text-amber-600 mt-0.5">
            下一步: {progress.next}
          </div>
        )}

        {/* 规则库状态提示 */}
        {processing && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-yellow-500 bg-yellow-950/30 border border-yellow-800/30 rounded px-2 py-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse flex-shrink-0" />
            规则库向量化中，AI 建卡可正常使用，规则引用精度暂时降低
          </div>
        )}
        {hasReady === false && !processing && (
          <div className="mt-1.5 text-[10px] text-amber-600 bg-amber-950/20 border border-amber-900/30 rounded px-2 py-1">
            ⚠ 未加载规则书，AI 将使用内置知识回答（不影响建卡功能）
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-amber-700/60 text-amber-100"
                  : msg.role === "system"
                  ? "bg-green-900/40 text-green-300 border border-green-800/40 text-[11px]"
                  : "bg-gray-800/60 text-amber-200 border border-amber-900/30"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed bg-gray-800/60 text-amber-200 border border-amber-900/30 whitespace-pre-wrap">
              {streamingText}
              <span className="inline-block w-1.5 h-3 bg-amber-400 ml-0.5 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-amber-900/30 bg-gray-900/40">
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 placeholder-amber-800 focus:outline-none focus:border-amber-500"
            placeholder="描述你想要的角色..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
          />
          {loading ? (
            <button
              className="px-4 py-2 bg-red-700 text-white text-xs font-pixel rounded hover:bg-red-600 transition"
              onClick={handleStop}
            >
              停止
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-amber-700 text-white text-xs font-pixel rounded hover:bg-amber-600 transition disabled:opacity-40"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              发送
            </button>
          )}
        </div>
        {/* Quick prompts */}
        <div className="flex flex-wrap gap-1 mt-2">
          {[
            "我想建一个潜行型角色",
            "推荐一个适合新手的角色",
            "帮我选择属性分配",
            "推荐法术搭配",
          ].map((q) => (
            <button
              key={q}
              className="px-2 py-0.5 text-[10px] bg-gray-800/60 border border-amber-900/30 rounded text-amber-500 hover:text-amber-300 hover:border-amber-600 transition"
              onClick={() => {
                setInput(q);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
