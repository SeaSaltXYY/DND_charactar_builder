"use client";
import React from "react";
import { useCharacterStore } from "@/stores/character-store";
import { getBackground } from "@/data/backgrounds";

export default function RoleplaySection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  const bg = getBackground(draft.background ?? "");

  const textArea = (
    label: string,
    field: "traits" | "ideals" | "bonds" | "flaws" | "backstory" | "appearance",
    suggestions?: string[],
    rows = 2
  ) => (
    <div>
      <label className="text-xs font-pixel text-amber-300">{label}</label>
      <textarea
        className="w-full px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-xs text-amber-100 focus:outline-none focus:border-amber-500 resize-none"
        rows={rows}
        value={draft[field]}
        onChange={(e) => update({ [field]: e.target.value })}
        placeholder={`输入${label}...`}
      />
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="px-2 py-0.5 text-[10px] bg-gray-800/60 border border-amber-900/30 rounded text-amber-400 hover:border-amber-600 hover:text-amber-300 transition"
              onClick={() => {
                const current = draft[field];
                update({ [field]: current ? `${current}\n${s}` : s });
              }}
            >
              {s.length > 20 ? s.slice(0, 20) + "…" : s}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {textArea("性格特质", "traits", bg?.suggestedTraits)}
      {textArea("理想", "ideals", bg?.suggestedIdeals)}
      {textArea("羁绊", "bonds", bg?.suggestedBonds)}
      {textArea("缺陷", "flaws", bg?.suggestedFlaws)}
      {textArea("背景故事", "backstory", undefined, 4)}
      {textArea("外貌描述", "appearance")}
    </div>
  );
}
