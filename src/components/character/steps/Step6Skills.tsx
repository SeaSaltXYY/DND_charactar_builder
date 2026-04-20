"use client";
import { PixelCard } from "../../ui/PixelCard";
import { PixelBadge } from "../../ui/PixelBadge";
import { useCharacterStore } from "@/stores/character-store";
import { RulesPicker } from "../RulesPicker";
import {
  abilityModifier,
  proficiencyBonusForLevel,
} from "@/lib/dice";
import type { AbilityKey } from "@/types/character";

const SKILLS: { name: string; ability: AbilityKey }[] = [
  { name: "运动", ability: "str" },
  { name: "特技", ability: "dex" },
  { name: "巧手", ability: "dex" },
  { name: "隐匿", ability: "dex" },
  { name: "奥秘", ability: "int" },
  { name: "历史", ability: "int" },
  { name: "调查", ability: "int" },
  { name: "自然", ability: "int" },
  { name: "宗教", ability: "int" },
  { name: "驯兽", ability: "wis" },
  { name: "洞悉", ability: "wis" },
  { name: "医疗", ability: "wis" },
  { name: "察觉", ability: "wis" },
  { name: "生存", ability: "wis" },
  { name: "欺瞒", ability: "cha" },
  { name: "威吓", ability: "cha" },
  { name: "表演", ability: "cha" },
  { name: "说服", ability: "cha" },
];

const ABILITY_ZH: Record<AbilityKey, string> = {
  str: "力",
  dex: "敏",
  con: "体",
  int: "智",
  wis: "感",
  cha: "魅",
};

export function Step6Skills() {
  const { draft, update } = useCharacterStore();
  const prof = proficiencyBonusForLevel(draft.level);

  function toggle(name: string) {
    const has = draft.skills.includes(name);
    update({
      skills: has ? draft.skills.filter((s) => s !== name) : [...draft.skills, name],
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <PixelCard
        title={
          <div className="flex items-center gap-2 text-pixel-gold">
            🎯 技能擅长
            <PixelBadge color="green">熟练 +{prof}</PixelBadge>
          </div>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS.map((s) => {
            const mod = abilityModifier(draft.ability_scores[s.ability]);
            const checked = draft.skills.includes(s.name);
            const value = mod + (checked ? prof : 0);
            return (
              <label
                key={s.name}
                className={`flex cursor-pointer items-center gap-2 border-2 px-2 py-1 text-sm ${
                  checked
                    ? "border-pixel-green bg-[#0a2418]"
                    : "border-pixel-border bg-[#0f1624]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(s.name)}
                />
                <span className="font-silk">{s.name}</span>
                <span className="text-xs text-text-muted">
                  ({ABILITY_ZH[s.ability]})
                </span>
                <span
                  className={`ml-auto font-bold ${
                    value >= 0 ? "text-pixel-gold" : "text-pixel-red"
                  }`}
                >
                  {value >= 0 ? "+" : ""}
                  {value}
                </span>
              </label>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-text-muted">
          💡 勾选后自动加上熟练加值。请确认数量不超过你职业/背景允许的上限。
        </div>
      </PixelCard>

      <RulesPicker category="skills" title="从规则书查阅技能规则" />
    </div>
  );
}
