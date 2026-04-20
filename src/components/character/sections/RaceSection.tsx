"use client";
import React from "react";
import { useCharacterStore } from "@/stores/character-store";
import { RACES, getSubraces } from "@/data/races";
import { ABILITY_LABELS } from "@/data/constants";
import { autoFillFromRace } from "@/lib/character-calc";
import CascadeSelect from "@/components/ui/CascadeSelect";

export default function RaceSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  const raceOptions = RACES.map((r) => ({ value: r.name, label: r.name }));
  const subraceOptions = getSubraces(draft.race ?? "").map((s) => ({
    value: s.name,
    label: s.name,
  }));

  const selectedRace = RACES.find((r) => r.name === draft.race);

  const handleRaceChange = (val: string | null) => {
    const patch = autoFillFromRace({ ...draft, race: val, subrace: null });
    update({ race: val, subrace: null, ...patch });
  };

  const handleSubraceChange = (val: string | null) => {
    const patch = autoFillFromRace({ ...draft, subrace: val });
    update({ subrace: val, ...patch });
  };

  const racialBonuses = Object.entries(draft.ability_racial)
    .filter(([, v]) => v && v !== 0)
    .map(([k, v]) => `${ABILITY_LABELS[k] ?? k} +${v}`)
    .join(", ");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <CascadeSelect
          label="种族"
          value={draft.race}
          options={raceOptions}
          onChange={handleRaceChange}
        />
        <CascadeSelect
          label="亚种"
          value={draft.subrace}
          options={subraceOptions}
          onChange={handleSubraceChange}
          disabled={subraceOptions.length === 0}
        />
      </div>

      {selectedRace && (
        <div className="bg-gray-800/50 border border-amber-900/30 rounded p-3 space-y-2 text-xs">
          {racialBonuses && (
            <div className="text-amber-200">
              <span className="text-amber-400 font-pixel">属性加值: </span>{racialBonuses}
            </div>
          )}
          <div className="text-amber-200">
            <span className="text-amber-400 font-pixel">速度: </span>{selectedRace.speed}尺
            <span className="ml-3 text-amber-400 font-pixel">体型: </span>{selectedRace.size}
          </div>
          {selectedRace.skillProficiencies && selectedRace.skillProficiencies.length > 0 && (
            <div className="text-amber-200">
              <span className="text-cyan-400 font-pixel">种族技能擅长: </span>
              {selectedRace.skillProficiencies.join("、")}
            </div>
          )}
          {selectedRace.name === "半精灵" && (
            <div className="text-yellow-300 text-[10px]">
              ⚠ 半精灵可自选两项技能擅长，请在技能区域手动勾选
            </div>
          )}
          {draft.features.length > 0 && (
            <div className="text-amber-200">
              <span className="text-amber-400 font-pixel">种族特性: </span>
              {draft.features.join(" · ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
