"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CharacterForm from "@/components/character/CharacterForm";
import AICreator from "@/components/character/AICreator";
import { useCharacterStore } from "@/stores/character-store";
import type { Rulebook } from "@/types/rulebook";

export default function CreateCharacterPage() {
  const router = useRouter();
  const draft = useCharacterStore((s) => s.draft);
  const reset = useCharacterStore((s) => s.reset);
  const setRulebookIds = useCharacterStore((s) => s.setRulebookIds);
  const rulebookIds = useCharacterStore((s) => s.rulebookIds);

  const [books, setBooks] = useState<Rulebook[]>([]);
  const [saving, setSaving] = useState(false);
  const [showBooks, setShowBooks] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/rulebooks").then((r) => r.json());
        const ready: Rulebook[] = (r.rulebooks || []).filter(
          (b: Rulebook) => b.status === "ready"
        );
        setBooks(ready);
        setRulebookIds(ready.map((b) => b.id));
      } catch {
        // ignore
      }
    })();
  }, [setRulebookIds]);

  async function handleSave() {
    if (!draft.name.trim()) {
      alert("请先填写角色名");
      return;
    }
    setSaving(true);
    try {
      const resp = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          full_sheet: draft,
        }),
      });
      if (!resp.ok) {
        const d = await resp.json().catch(() => ({}));
        throw new Error(d.error || "保存失败");
      }
      const data = await resp.json();
      router.push(`/characters/${data.character.id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.name || "character"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 top-16 flex flex-col overflow-hidden bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/60 border-b border-amber-900/30">
        <h1 className="font-pixel text-lg text-amber-200">
          ⚔ 角色创建工坊
        </h1>
        <div className="flex items-center gap-2">
          {/* Rulebook selector */}
          <div className="relative">
            <button
              className="px-3 py-1 text-xs font-pixel bg-gray-800/60 border border-amber-900/40 rounded text-amber-400 hover:border-amber-600 transition"
              onClick={() => setShowBooks(!showBooks)}
            >
              📚 规则书 ({rulebookIds.length})
            </button>
            {showBooks && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-gray-900 border border-amber-900/40 rounded-lg shadow-xl z-50 p-3">
                <div className="text-xs font-pixel text-amber-300 mb-2">
                  激活规则书 (用于 AI 建卡)
                </div>
                {books.length === 0 ? (
                  <div className="text-xs text-amber-600">
                    尚未上传规则书。前往{" "}
                    <a href="/rulebooks" className="underline text-amber-400">
                      规则书管理
                    </a>{" "}
                    先上传。
                  </div>
                ) : (
                  <div className="space-y-1">
                    {books.map((b) => (
                      <label
                        key={b.id}
                        className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer hover:text-amber-100"
                      >
                        <input
                          type="checkbox"
                          checked={rulebookIds.includes(b.id)}
                          onChange={() =>
                            setRulebookIds(
                              rulebookIds.includes(b.id)
                                ? rulebookIds.filter((x) => x !== b.id)
                                : [...rulebookIds, b.id]
                            )
                          }
                          className="accent-amber-500"
                        />
                        {b.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Validation />

          <button
            className="px-3 py-1 text-xs font-pixel bg-gray-800/60 border border-amber-900/40 rounded text-amber-400 hover:border-amber-600 transition"
            onClick={handleExportJSON}
          >
            📥 导出角色
          </button>

          <button
            className="px-3 py-1 text-xs font-pixel bg-amber-700 text-white rounded hover:bg-amber-600 transition disabled:opacity-40"
            onClick={handleSave}
            disabled={saving || !draft.name.trim()}
          >
            {saving ? "保存中..." : "💾 保存角色"}
          </button>

          <button
            className="px-3 py-1 text-xs font-pixel bg-red-900/60 border border-red-800/40 rounded text-red-400 hover:border-red-600 transition"
            onClick={() => {
              if (confirm("清空当前草稿？此操作不可撤销。")) {
                reset();
              }
            }}
          >
            🗑 重置
          </button>
        </div>
      </div>

      {/* Dual panel */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Character Form */}
        <div className="w-1/2 border-r border-amber-900/30 p-3 min-h-0 overflow-hidden">
          <CharacterForm />
        </div>

        {/* Right: AI Assistant */}
        <div className="w-1/2 min-h-0 overflow-hidden">
          <AICreator />
        </div>
      </div>
    </div>
  );
}

function Validation() {
  const draft = useCharacterStore((s) => s.draft);
  const issues: string[] = [];
  if (!draft.name.trim()) issues.push("未填名");
  if (!draft.race) issues.push("未选种族");
  if (!draft.class) issues.push("未选职业");

  if (issues.length === 0) {
    return (
      <span className="text-[10px] text-green-400 font-pixel px-2">
        ✔ 就绪
      </span>
    );
  }
  return (
    <span className="text-[10px] text-yellow-500 font-pixel px-2">
      ⚠ {issues.join(", ")}
    </span>
  );
}
