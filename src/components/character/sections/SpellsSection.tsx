"use client";
import React, { useMemo, useState } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { getSpellsByClass, SPELLS } from "@/data/spells";

export default function SpellsSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const available = useMemo(() => {
    let list = draft.class ? getSpellsByClass(draft.class) : SPELLS;
    if (filterLevel !== null) list = list.filter((s) => s.level === filterLevel);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    return list;
  }, [draft.class, filterLevel, search]);

  const toggleCantrip = (name: string) => {
    const arr = draft.knownCantrips.includes(name)
      ? draft.knownCantrips.filter((n) => n !== name)
      : [...draft.knownCantrips, name];
    update({ knownCantrips: arr });
  };

  const toggleSpell = (name: string) => {
    const arr = draft.knownSpells.includes(name)
      ? draft.knownSpells.filter((n) => n !== name)
      : [...draft.knownSpells, name];
    update({ knownSpells: arr });
  };

  const togglePrepared = (name: string) => {
    const arr = draft.preparedSpells.includes(name)
      ? draft.preparedSpells.filter((n) => n !== name)
      : [...draft.preparedSpells, name];
    update({ preparedSpells: arr });
  };

  if (!draft.spellcastingAbility) {
    return (
      <div className="text-sm text-amber-500 font-pixel text-center py-4">
        当前职业不具备施法能力
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 已知法术概览 */}
      <div className="flex gap-3 text-xs text-amber-300 font-pixel">
        <span>戏法: {draft.knownCantrips.length}</span>
        <span>已知: {draft.knownSpells.length}</span>
        <span>已准备: {draft.preparedSpells.length}</span>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 px-3 py-1 bg-gray-800/80 border border-amber-900/60 rounded text-xs text-amber-100 focus:outline-none focus:border-amber-500"
          placeholder="搜索法术..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-2 py-1 bg-gray-800/80 border border-amber-900/60 rounded text-xs text-amber-100"
          value={filterLevel ?? "all"}
          onChange={(e) =>
            setFilterLevel(e.target.value === "all" ? null : Number(e.target.value))
          }
        >
          <option value="all">全部环阶</option>
          <option value="0">戏法</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
            <option key={l} value={l}>{l}环</option>
          ))}
        </select>
      </div>

      {/* 法术列表 */}
      <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
        {available.map((spell) => {
          const isCantrip = spell.level === 0;
          const known = isCantrip
            ? draft.knownCantrips.includes(spell.name)
            : draft.knownSpells.includes(spell.name);
          const prepared = draft.preparedSpells.includes(spell.name);

          return (
            <div
              key={spell.name}
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs transition ${
                known
                  ? "bg-amber-900/30 border border-amber-700/50"
                  : "bg-gray-800/40 border border-transparent hover:border-amber-900/30"
              }`}
            >
              <input
                type="checkbox"
                checked={known}
                onChange={() =>
                  isCantrip ? toggleCantrip(spell.name) : toggleSpell(spell.name)
                }
                className="accent-amber-500"
              />
              <div className="flex-1">
                <span className="text-amber-200">{spell.name}</span>
                <span className="ml-2 text-[10px] text-amber-600">
                  {isCantrip ? "戏法" : `${spell.level}环`} · {spell.school}
                  {spell.concentration && " · 专注"}
                </span>
              </div>
              {known && !isCantrip && (
                <label className="flex items-center gap-1 text-[10px] text-amber-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prepared}
                    onChange={() => togglePrepared(spell.name)}
                    className="accent-green-500"
                  />
                  准备
                </label>
              )}
            </div>
          );
        })}
        {available.length === 0 && (
          <div className="text-center text-xs text-amber-600 py-3">无匹配法术</div>
        )}
      </div>
    </div>
  );
}
