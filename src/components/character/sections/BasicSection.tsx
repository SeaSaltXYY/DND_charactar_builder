"use client";
import React from "react";
import { useCharacterStore } from "@/stores/character-store";
import { ALIGNMENTS } from "@/data/constants";

export default function BasicSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div className="col-span-2 md:col-span-1">
        <label className="text-xs font-pixel text-amber-300">角色名</label>
        <input
          className="w-full px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 font-pixel focus:outline-none focus:border-amber-500"
          placeholder="输入角色名..."
          value={draft.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs font-pixel text-amber-300">性别</label>
        <input
          className="w-full px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 font-pixel focus:outline-none focus:border-amber-500"
          placeholder="性别"
          value={draft.gender}
          onChange={(e) => update({ gender: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs font-pixel text-amber-300">年龄</label>
        <input
          className="w-full px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 font-pixel focus:outline-none focus:border-amber-500"
          placeholder="年龄"
          value={draft.age}
          onChange={(e) => update({ age: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs font-pixel text-amber-300">等级</label>
        <input
          type="number"
          min={1}
          max={20}
          className="w-full px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 font-pixel focus:outline-none focus:border-amber-500"
          value={draft.level}
          onChange={(e) => update({ level: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
        />
      </div>
      <div>
        <label className="text-xs font-pixel text-amber-300">阵营</label>
        <select
          className="w-full px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded text-sm text-amber-100 font-pixel focus:outline-none focus:border-amber-500"
          value={draft.alignment ?? ""}
          onChange={(e) => update({ alignment: e.target.value || null })}
        >
          <option value="">—— 选择阵营 ——</option>
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
