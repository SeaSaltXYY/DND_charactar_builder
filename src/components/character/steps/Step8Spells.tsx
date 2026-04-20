"use client";
import { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { PixelCard } from "../../ui/PixelCard";
import { PixelInput } from "../../ui/PixelInput";
import { PixelButton } from "../../ui/PixelButton";
import { useCharacterStore } from "@/stores/character-store";
import { RulesPicker } from "../RulesPicker";

const CASTER_CLASSES = [
  "吟游诗人", "牧师", "德鲁伊", "圣武士", "游侠",
  "术士", "邪术师", "法师",
];

export function Step8Spells() {
  const { draft, update } = useCharacterStore();
  const [input, setInput] = useState("");
  const isCaster = draft.class ? CASTER_CLASSES.includes(draft.class) : false;

  function add() {
    if (!input.trim()) return;
    update({ spells: [...draft.spells, input.trim()] });
    setInput("");
  }
  function remove(idx: number) {
    update({ spells: draft.spells.filter((_, i) => i !== idx) });
  }

  if (!isCaster) {
    return (
      <PixelCard title="✨ 法术">
        <div className="py-8 text-center text-text-muted">
          <Sparkles size={40} className="mx-auto mb-2 opacity-40" />
          <div className="font-silk text-pixel-base">
            你当前的职业「{draft.class || "—"}」不具备施法能力。
          </div>
          <div className="mt-2 text-sm">
            如果你走的是多职业路线，可以手动添加法术。
          </div>
          <div className="mt-4">
            <PixelButton onClick={() => add()} disabled>
              （跳过此步骤）
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <PixelCard title={`✨ ${draft.class} · 法术选择`}>
        <div className="space-y-2">
          <div className="flex gap-2">
            <PixelInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例如：火花 (戏法) / 魔法飞弹 (1 环)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
            />
            <PixelButton variant="gold" onClick={add}>
              <Plus size={12} /> 添加
            </PixelButton>
          </div>
          {draft.spells.length === 0 ? (
            <div className="pixel-border-thin bg-[#0a0e18] p-3 text-sm text-text-muted">
              还没有选择法术。先在右侧查询可学习的戏法/1 环法术，再添加进来。
            </div>
          ) : (
            <ul className="space-y-1">
              {draft.spells.map((s, i) => (
                <li
                  key={i}
                  className="pixel-border-thin flex items-center justify-between bg-[#0a0e18] px-2 py-1 text-sm"
                >
                  <span>{s}</span>
                  <button
                    onClick={() => remove(i)}
                    className="text-pixel-red"
                  >
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PixelCard>

      <RulesPicker
        category="spells"
        title="从规则书查阅法术"
        extraQuery={`${draft.class || ""} 戏法 1 环`}
      />
    </div>
  );
}
