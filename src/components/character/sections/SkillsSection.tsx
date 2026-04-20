"use client";
import React from "react";
import { useCharacterStore } from "@/stores/character-store";
import { SKILLS, ABILITY_LABELS } from "@/data/constants";
import { abilityModifier, proficiencyBonusForLevel } from "@/lib/dice";
import { computeTotalAbilities } from "@/lib/character-calc";

export default function SkillsSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  const totals = computeTotalAbilities(draft);
  const profBonus = proficiencyBonusForLevel(draft.level);

  const toggleSkill = (skillName: string) => {
    const skills = draft.skills.includes(skillName)
      ? draft.skills.filter((s) => s !== skillName)
      : [...draft.skills, skillName];
    update({ skills });
  };

  const toggleSave = (key: string) => {
    const savingThrows = draft.savingThrows.includes(key)
      ? draft.savingThrows.filter((s) => s !== key)
      : [...draft.savingThrows, key];
    update({ savingThrows });
  };

  return (
    <div className="space-y-4">
      {/* 豁免投骰 */}
      <div>
        <div className="text-xs font-pixel text-amber-400 mb-2">豁免投骰</div>
        <div className="grid grid-cols-3 gap-1">
          {(["str", "dex", "con", "int", "wis", "cha"] as const).map((key) => {
            const mod = abilityModifier(totals[key]);
            const prof = draft.savingThrows.includes(key);
            const total = mod + (prof ? profBonus : 0);
            return (
              <label
                key={key}
                className="flex items-center gap-1 text-xs text-amber-200 cursor-pointer hover:text-amber-100"
              >
                <input
                  type="checkbox"
                  checked={prof}
                  onChange={() => toggleSave(key)}
                  className="accent-amber-500"
                />
                <span className="font-pixel">{ABILITY_LABELS[key]}</span>
                <span className="ml-auto text-amber-400">
                  {total >= 0 ? "+" : ""}{total}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 技能 */}
      <div>
        <div className="text-xs font-pixel text-amber-400 mb-2">
          技能 <span className="text-amber-600">({draft.skills.length}项擅长)</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {SKILLS.map((skill) => {
            const mod = abilityModifier(totals[skill.ability]);
            const prof = draft.skills.includes(skill.name);
            const total = mod + (prof ? profBonus : 0);
            return (
              <label
                key={skill.name}
                className="flex items-center gap-1 text-xs text-amber-200 cursor-pointer hover:text-amber-100 py-0.5"
              >
                <input
                  type="checkbox"
                  checked={prof}
                  onChange={() => toggleSkill(skill.name)}
                  className="accent-amber-500"
                />
                <span>{skill.name}</span>
                <span className="text-[10px] text-amber-600">
                  ({ABILITY_LABELS[skill.ability]})
                </span>
                <span className="ml-auto text-amber-400 font-pixel">
                  {total >= 0 ? "+" : ""}{total}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
