"use client";
import React from "react";
import { useCharacterStore } from "@/stores/character-store";
import { BACKGROUNDS, getBackground } from "@/data/backgrounds";
import CascadeSelect from "@/components/ui/CascadeSelect";

export default function BackgroundSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  const bgOptions = BACKGROUNDS.map((b) => ({ value: b.name, label: b.name }));
  const selected = getBackground(draft.background ?? "");

  const handleChange = (val: string | null) => {
    const bg = getBackground(val ?? "");
    update({
      background: val,
      backgroundFeature: bg?.feature ?? "",
    });
  };

  return (
    <div className="space-y-3">
      <CascadeSelect
        label="背景"
        value={draft.background}
        options={bgOptions}
        onChange={handleChange}
      />

      {selected && (
        <div className="bg-gray-800/50 border border-amber-900/30 rounded p-3 space-y-2 text-xs text-amber-200">
          <div>
            <span className="text-amber-400 font-pixel">技能擅长: </span>
            {selected.skillProficiencies.join(", ") || "无"}
          </div>
          {selected.toolProficiencies.length > 0 && (
            <div>
              <span className="text-amber-400 font-pixel">工具擅长: </span>
              {selected.toolProficiencies.join(", ")}
            </div>
          )}
          {selected.languages > 0 && (
            <div>
              <span className="text-amber-400 font-pixel">语言: </span>
              任选{selected.languages}种
            </div>
          )}
          <div>
            <span className="text-amber-400 font-pixel">背景特性: </span>
            {selected.feature}
          </div>
        </div>
      )}
    </div>
  );
}
