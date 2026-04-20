"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { PixelCard } from "../../ui/PixelCard";
import { PixelInput } from "../../ui/PixelInput";
import { PixelButton } from "../../ui/PixelButton";
import { useCharacterStore } from "@/stores/character-store";
import { RulesPicker } from "../RulesPicker";

export function Step7Equipment() {
  const { draft, update } = useCharacterStore();
  const [input, setInput] = useState("");

  function add() {
    if (!input.trim()) return;
    update({ equipment: [...draft.equipment, input.trim()] });
    setInput("");
  }
  function remove(idx: number) {
    update({ equipment: draft.equipment.filter((_, i) => i !== idx) });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <PixelCard title="🛡 装备清单">
        <div className="space-y-2">
          <div className="flex gap-2">
            <PixelInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例如：长剑 (1d8 劈砍)"
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
          {draft.equipment.length === 0 ? (
            <div className="pixel-border-thin bg-[#0a0e18] p-3 text-sm text-text-muted">
              尚未添加装备。你可以从规则书中查看职业起始装备后手动添加。
            </div>
          ) : (
            <ul className="space-y-1">
              {draft.equipment.map((e, i) => (
                <li
                  key={i}
                  className="pixel-border-thin flex items-center justify-between bg-[#0a0e18] px-2 py-1 text-sm"
                >
                  <span>{e}</span>
                  <button
                    onClick={() => remove(i)}
                    className="text-pixel-red hover:brightness-125"
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
        category="equipment"
        title="从规则书查阅装备"
        extraQuery={draft.class || undefined}
      />
    </div>
  );
}
