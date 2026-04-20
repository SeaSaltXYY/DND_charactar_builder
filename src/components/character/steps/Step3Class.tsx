"use client";
import { PixelCard } from "../../ui/PixelCard";
import { PixelInput } from "../../ui/PixelInput";
import { PixelButton } from "../../ui/PixelButton";
import { useCharacterStore } from "@/stores/character-store";
import { RulesPicker } from "../RulesPicker";

const CLASSES = [
  { name: "野蛮人", hd: 12, primary: "力量" },
  { name: "吟游诗人", hd: 8, primary: "魅力" },
  { name: "牧师", hd: 8, primary: "感知" },
  { name: "德鲁伊", hd: 8, primary: "感知" },
  { name: "战士", hd: 10, primary: "力量 / 敏捷" },
  { name: "武僧", hd: 8, primary: "敏捷 / 感知" },
  { name: "圣武士", hd: 10, primary: "力量 / 魅力" },
  { name: "游侠", hd: 10, primary: "敏捷 / 感知" },
  { name: "游荡者", hd: 8, primary: "敏捷" },
  { name: "术士", hd: 6, primary: "魅力" },
  { name: "邪术师", hd: 8, primary: "魅力" },
  { name: "法师", hd: 6, primary: "智力" },
];

export function Step3Class() {
  const { draft, update } = useCharacterStore();

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <PixelCard title="⚔ 选择职业">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CLASSES.map((c) => (
            <button
              key={c.name}
              onClick={() => update({ class: c.name })}
              className={`pixel-border-thin bg-[#0f1624] p-2 text-left transition ${
                draft.class === c.name
                  ? "!border-pixel-gold bg-[#2a2110]"
                  : "hover:bg-[#15223a]"
              }`}
            >
              <div className="font-silk text-pixel-base text-text-primary">
                {c.name}
              </div>
              <div className="text-xs text-text-muted">
                HD d{c.hd} · {c.primary}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 font-silk text-pixel-sm text-text-muted">
              职业（可自定义）
            </div>
            <PixelInput
              value={draft.class || ""}
              onChange={(e) => update({ class: e.target.value })}
            />
          </div>
          <div>
            <div className="mb-1 font-silk text-pixel-sm text-text-muted">
              子职业（可选）
            </div>
            <PixelInput
              value={draft.subclass || ""}
              onChange={(e) => update({ subclass: e.target.value })}
              placeholder="如：奥秘游荡者"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <PixelButton
              key={lvl}
              variant={draft.level === lvl ? "gold" : "default"}
              active={draft.level === lvl}
              onClick={() => update({ level: lvl })}
            >
              Lv{lvl}
            </PixelButton>
          ))}
        </div>
      </PixelCard>

      <RulesPicker
        category="classes"
        title="从规则书查阅职业"
        extraQuery={draft.class || undefined}
      />
    </div>
  );
}
