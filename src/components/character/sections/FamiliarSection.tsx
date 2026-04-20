"use client";
import React, { useState } from "react";
import { useCharacterStore } from "@/stores/character-store";
import {
  canHaveFamiliar,
  getStandardFamiliars,
  getChainFamiliars,
  getFamiliar,
} from "@/data/familiars";
import type { FamiliarInfo } from "@/types/character";

export default function FamiliarSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { eligible, chainPact, reason } = canHaveFamiliar(
    draft.knownSpells,
    draft.class,
    draft.features
  );

  if (!eligible) {
    return (
      <div className="text-sm text-amber-500 font-pixel text-center py-4 space-y-2">
        <div>当前角色不具备召唤魔宠的能力</div>
        <div className="text-[10px] text-amber-700">
          获取途径：法师习得「寻获魔宠」法术 / 邪术师选择锁链契约
        </div>
      </div>
    );
  }

  const standardList = getStandardFamiliars();
  const chainList = getChainFamiliars();
  const availableList = chainPact
    ? [...standardList, ...chainList]
    : standardList;

  const handleSelect = (familiarName: string) => {
    if (draft.familiar?.name === familiarName) {
      update({ familiar: null });
      return;
    }
    const f = getFamiliar(familiarName);
    if (!f) return;
    const info: FamiliarInfo = {
      name: familiarName,
      customName: draft.familiar?.customName || "",
      type: f.source,
    };
    update({ familiar: info });
  };

  const handleCustomName = (customName: string) => {
    if (!draft.familiar) return;
    update({ familiar: { ...draft.familiar, customName } });
  };

  const selectedData = draft.familiar
    ? getFamiliar(draft.familiar.name)
    : null;

  return (
    <div className="space-y-3">
      <div className="text-xs text-green-400 font-pixel">
        ✓ {reason}
      </div>

      {/* 当前魔宠 */}
      {draft.familiar && selectedData && (
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🐾</span>
            <div className="flex-1">
              <div className="text-sm font-pixel text-amber-200">
                {selectedData.name}
                {draft.familiar.customName && (
                  <span className="text-amber-400 ml-1">
                    「{draft.familiar.customName}」
                  </span>
                )}
              </div>
              <div className="text-[10px] text-amber-500">
                {selectedData.type} · {selectedData.size}
              </div>
            </div>
            <button
              className="text-[10px] text-red-400 hover:text-red-300 px-2 py-0.5 border border-red-800/40 rounded"
              onClick={() => update({ familiar: null })}
            >
              解散
            </button>
          </div>

          <input
            className="w-full px-2 py-1 bg-gray-900 border border-amber-900/40 rounded text-xs text-amber-100 focus:outline-none focus:border-amber-500"
            placeholder="给魔宠取个名字（选填）"
            value={draft.familiar.customName}
            onChange={(e) => handleCustomName(e.target.value)}
          />

          {/* 数据面板 */}
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            <div className="bg-gray-800/60 rounded p-1 text-center">
              <div className="text-amber-500">AC</div>
              <div className="text-amber-200 font-bold">{selectedData.ac}</div>
            </div>
            <div className="bg-gray-800/60 rounded p-1 text-center">
              <div className="text-amber-500">HP</div>
              <div className="text-amber-200 font-bold">{selectedData.hp}</div>
            </div>
            <div className="bg-gray-800/60 rounded p-1 text-center col-span-2">
              <div className="text-amber-500">速度</div>
              <div className="text-amber-200 font-bold">{selectedData.speed}</div>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1 text-[10px]">
            {(["str", "dex", "con", "int", "wis", "cha"] as const).map(
              (k) => (
                <div key={k} className="bg-gray-800/60 rounded p-1 text-center">
                  <div className="text-amber-600 uppercase">{k}</div>
                  <div className="text-amber-200">{selectedData.abilities[k]}</div>
                </div>
              )
            )}
          </div>

          <div className="text-[10px] text-amber-400">
            <span className="text-amber-500">感官: </span>
            {selectedData.senses}
          </div>

          {selectedData.traits.length > 0 && (
            <div className="text-[10px] text-amber-300">
              <span className="text-amber-500">特性: </span>
              {selectedData.traits.join(" · ")}
            </div>
          )}

          <div className="text-[10px] text-amber-600 italic">
            {selectedData.description}
          </div>
        </div>
      )}

      {/* 魔宠选择列表 */}
      <div className="space-y-1">
        <div className="text-[10px] text-amber-500 font-pixel">
          可选魔宠 ({availableList.length})
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {availableList.map((f) => {
            const isSelected = draft.familiar?.name === f.name;
            const isExpanded = expanded === f.name;

            return (
              <div key={f.name}>
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition text-xs ${
                    isSelected
                      ? "bg-amber-900/40 border border-amber-600/60"
                      : "bg-gray-800/40 border border-transparent hover:border-amber-900/30"
                  }`}
                  onClick={() => handleSelect(f.name)}
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    readOnly
                    className="accent-amber-500"
                  />
                  <div className="flex-1">
                    <span className="text-amber-200">{f.name}</span>
                    <span className="ml-1 text-[10px] text-amber-600">
                      {f.type}
                    </span>
                    {f.source === "chain" && (
                      <span className="ml-1 text-[9px] text-purple-400 border border-purple-700/40 rounded px-1">
                        锁链
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-600">
                    AC{f.ac} HP{f.hp}
                  </span>
                  <button
                    className="text-amber-600 hover:text-amber-400 text-[10px] px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(isExpanded ? null : f.name);
                    }}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="ml-6 px-2 py-1.5 text-[10px] text-amber-500 bg-gray-900/40 rounded-b border-x border-b border-amber-900/20">
                    <div>速度: {f.speed} · 感官: {f.senses}</div>
                    {f.traits.length > 0 && (
                      <div className="text-amber-400 mt-0.5">
                        特性: {f.traits.join("; ")}
                      </div>
                    )}
                    <div className="text-amber-600 italic mt-0.5">{f.description}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
