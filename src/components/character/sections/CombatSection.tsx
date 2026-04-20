"use client";
import React, { useEffect } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { proficiencyBonusForLevel } from "@/lib/dice";
import {
  computeHP,
  computeAC,
  computeInitiative,
  computeSpeed,
  computeSpellDC,
  computeSpellAttack,
  computePassivePerception,
} from "@/lib/character-calc";

export default function CombatSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  useEffect(() => {
    const maxHp = computeHP(draft);
    const ac = computeAC(draft);
    const initiative = computeInitiative(draft);
    const speed = computeSpeed(draft);
    update({ maxHp, ac, initiative, speed, hp: draft.hp || maxHp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    draft.class,
    draft.level,
    draft.ability_scores,
    draft.ability_racial,
    draft.ability_growth,
    draft.armor,
    draft.shield,
    draft.race,
    draft.subrace,
  ]);

  const profBonus = proficiencyBonusForLevel(draft.level);
  const spellDC = computeSpellDC(draft);
  const spellAtk = computeSpellAttack(draft);
  const passivePerception = computePassivePerception(draft);

  const stat = (label: string, value: string | number) => (
    <div className="bg-gray-800/60 border border-amber-900/40 rounded p-2 text-center">
      <div className="text-[10px] text-amber-400 font-pixel">{label}</div>
      <div className="text-lg font-bold text-amber-100">{value}</div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {stat("HP", `${draft.hp}/${draft.maxHp}`)}
        {stat("AC", draft.ac)}
        {stat("先攻", draft.initiative >= 0 ? `+${draft.initiative}` : draft.initiative)}
        {stat("速度", `${draft.speed}尺`)}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {stat("熟练加值", `+${profBonus}`)}
        {stat("生命骰", draft.hitDice || "—")}
        {stat("被动察觉", passivePerception)}
        {stat("体型", draft.size)}
      </div>

      {draft.spellcastingAbility && (
        <div className="grid grid-cols-2 gap-2">
          {stat("法术DC", spellDC)}
          {stat("法术攻击", spellAtk >= 0 ? `+${spellAtk}` : spellAtk)}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-pixel text-amber-300">临时HP</label>
          <input
            type="number"
            min={0}
            className="w-full px-3 py-1 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 focus:outline-none focus:border-amber-500"
            value={draft.tempHp}
            onChange={(e) => update({ tempHp: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
        <div>
          <label className="text-xs font-pixel text-amber-300">当前HP</label>
          <input
            type="number"
            min={0}
            className="w-full px-3 py-1 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 focus:outline-none focus:border-amber-500"
            value={draft.hp}
            onChange={(e) => update({ hp: Math.max(0, Number(e.target.value) || 0) })}
          />
        </div>
      </div>
    </div>
  );
}
