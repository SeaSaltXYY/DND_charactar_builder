"use client";
import React, { useState } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { ABILITY_KEYS, ABILITY_LABELS } from "@/data/constants";
import { abilityModifier } from "@/lib/dice";
import { computeTotalAbilities } from "@/lib/character-calc";
import type { AbilityKey } from "@/types/character";

type Mode = "manual" | "standard" | "pointbuy";

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

function pointBuyCost(score: number) {
  if (score <= 8) return 0;
  if (score <= 13) return score - 8;
  if (score === 14) return 7;
  if (score === 15) return 9;
  return Infinity;
}

export default function AbilitySection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);
  const updateAbility = useCharacterStore((s) => s.updateAbility);
  const [mode, setMode] = useState<Mode>("manual");

  const totals = computeTotalAbilities(draft);

  const totalPointsCost = ABILITY_KEYS.reduce(
    (sum, k) => sum + pointBuyCost(draft.ability_scores[k]),
    0
  );

  const handleStandardAssign = (key: AbilityKey, val: number) => {
    const current = { ...draft.ability_scores };
    const prevVal = current[key];
    const other = ABILITY_KEYS.find(
      (k) => k !== key && current[k] === val
    );
    if (val !== prevVal && other) {
      current[other] = prevVal;
    }
    current[key] = val;
    update({ ability_scores: current });
  };

  const updateGrowth = (key: AbilityKey, val: number) => {
    update({
      ability_growth: {
        ...draft.ability_growth,
        [key]: Math.max(0, val),
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* 模式选择 */}
      <div className="flex gap-2">
        {(["manual", "standard", "pointbuy"] as Mode[]).map((m) => (
          <button
            key={m}
            className={`px-3 py-1 text-xs font-pixel rounded border transition ${
              mode === m
                ? "bg-amber-700 border-amber-500 text-white"
                : "bg-gray-800/60 border-amber-900/40 text-amber-400 hover:border-amber-600"
            }`}
            onClick={() => setMode(m)}
          >
            {m === "manual" ? "手动输入" : m === "standard" ? "标准阵列" : "点购法"}
          </button>
        ))}
      </div>

      {mode === "pointbuy" && (
        <div className="text-xs text-amber-300 font-pixel">
          已用点数: <span className={totalPointsCost > 27 ? "text-red-400" : "text-green-400"}>
            {totalPointsCost}
          </span> / 27
        </div>
      )}

      {/* 六项属性 */}
      <div className="grid grid-cols-3 gap-2">
        {ABILITY_KEYS.map((key) => {
          const base = draft.ability_scores[key];
          const racial = draft.ability_racial[key] ?? 0;
          const growth = draft.ability_growth[key] ?? 0;
          const total = totals[key];
          const mod = abilityModifier(total);

          return (
            <div
              key={key}
              className="bg-gray-800/60 border border-amber-900/40 rounded p-2 text-center"
            >
              {/* 属性名 */}
              <div className="text-xs text-amber-400 font-pixel mb-1">
                {ABILITY_LABELS[key]}
              </div>

              {/* 总值 + 修正值 */}
              <div className="text-xl font-bold text-amber-100">{total}</div>
              <div className={`text-sm font-bold ${mod >= 0 ? "text-green-400" : "text-red-400"}`}>
                {mod >= 0 ? "+" : ""}{mod}
              </div>

              {/* 基础值输入 */}
              <div className="mt-1.5 border-t border-amber-900/20 pt-1.5">
                <div className="text-[9px] text-amber-600 mb-0.5">基础值</div>
                {mode === "manual" && (
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="w-full px-1 py-0.5 bg-gray-900 border border-amber-900/40 rounded text-xs text-center text-amber-100 focus:outline-none focus:border-amber-500"
                    value={base}
                    onChange={(e) =>
                      updateAbility({ [key]: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })
                    }
                  />
                )}
                {mode === "standard" && (
                  <select
                    className="w-full px-1 py-0.5 bg-gray-900 border border-amber-900/40 rounded text-xs text-center text-amber-100"
                    value={base}
                    onChange={(e) =>
                      handleStandardAssign(key, Number(e.target.value))
                    }
                  >
                    {STANDARD_ARRAY.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                )}
                {mode === "pointbuy" && (
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="px-1 text-amber-400 hover:text-amber-200 disabled:opacity-30"
                      disabled={base <= 8}
                      onClick={() => updateAbility({ [key]: base - 1 })}
                    >−</button>
                    <span className="text-xs text-amber-100 w-4 text-center">{base}</span>
                    <button
                      className="px-1 text-amber-400 hover:text-amber-200 disabled:opacity-30"
                      disabled={base >= 15}
                      onClick={() => updateAbility({ [key]: base + 1 })}
                    >+</button>
                  </div>
                )}
              </div>

              {/* 种族加值 (只读) */}
              {racial !== 0 && (
                <div className="text-[10px] text-cyan-400 mt-1">
                  种族 {racial > 0 ? "+" : ""}{racial}
                </div>
              )}

              {/* 成长加值 (可编辑) */}
              <div className="mt-1">
                <div className="text-[9px] text-amber-600">成长</div>
                <div className="flex items-center justify-center gap-1">
                  <button
                    className="px-0.5 text-[10px] text-amber-400 hover:text-amber-200 disabled:opacity-30"
                    disabled={growth <= 0}
                    onClick={() => updateGrowth(key, growth - 1)}
                  >−</button>
                  <span className="text-[10px] text-amber-300 w-3 text-center">
                    {growth > 0 ? `+${growth}` : "0"}
                  </span>
                  <button
                    className="px-0.5 text-[10px] text-amber-400 hover:text-amber-200"
                    onClick={() => updateGrowth(key, growth + 1)}
                  >+</button>
                </div>
              </div>

              {/* 分项汇总 */}
              <div className="text-[9px] text-amber-700 mt-1 border-t border-amber-900/20 pt-0.5">
                {base}{racial ? ` +${racial}族` : ""}{growth ? ` +${growth}长` : ""} = {total}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
