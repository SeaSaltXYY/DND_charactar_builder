"use client";
import { useState } from "react";
import { Dices, RotateCcw } from "lucide-react";
import { PixelCard } from "../../ui/PixelCard";
import { PixelButton } from "../../ui/PixelButton";
import { useCharacterStore } from "@/stores/character-store";
import {
  STANDARD_ARRAY,
  abilityModifier,
  pointBuyCost,
  pointBuyTotal,
  rollAbilityArray,
} from "@/lib/dice";
import type { AbilityKey, AbilityScores } from "@/types/character";

type Method = "standard" | "pointbuy" | "roll";

const ABILITY_KEYS: { key: AbilityKey; zh: string }[] = [
  { key: "str", zh: "力量" },
  { key: "dex", zh: "敏捷" },
  { key: "con", zh: "体质" },
  { key: "int", zh: "智力" },
  { key: "wis", zh: "感知" },
  { key: "cha", zh: "魅力" },
];

export function Step4Ability() {
  const { draft, updateAbility, update } = useCharacterStore();
  const [method, setMethod] = useState<Method>("standard");
  const [pool, setPool] = useState<number[]>([...STANDARD_ARRAY]);
  const [rolling, setRolling] = useState(false);

  function applyStandardArray() {
    const a: AbilityScores = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    update({ ability_scores: a });
    setPool([...STANDARD_ARRAY]);
  }

  function applyPointBuy() {
    update({
      ability_scores: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },
    });
  }

  function doRoll() {
    setRolling(true);
    setTimeout(() => {
      const arr = rollAbilityArray();
      setPool(arr);
      const a: AbilityScores = {
        str: arr[0],
        dex: arr[1],
        con: arr[2],
        int: arr[3],
        wis: arr[4],
        cha: arr[5],
      };
      update({ ability_scores: a });
      setRolling(false);
    }, 600);
  }

  const scores = draft.ability_scores;
  const pointBuySpent = pointBuyTotal(Object.values(scores));
  const pointBuyValid =
    Object.values(scores).every((s) => s >= 8 && s <= 15) &&
    pointBuySpent <= 27;

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
      <PixelCard title="📊 属性值生成方式">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <PixelButton
              variant={method === "standard" ? "gold" : "default"}
              active={method === "standard"}
              onClick={() => {
                setMethod("standard");
                applyStandardArray();
              }}
            >
              标准阵列
            </PixelButton>
            <PixelButton
              variant={method === "pointbuy" ? "gold" : "default"}
              active={method === "pointbuy"}
              onClick={() => {
                setMethod("pointbuy");
                applyPointBuy();
              }}
            >
              点数购买 (27)
            </PixelButton>
            <PixelButton
              variant={method === "roll" ? "gold" : "default"}
              active={method === "roll"}
              onClick={() => {
                setMethod("roll");
                doRoll();
              }}
            >
              <Dices size={12} className={rolling ? "animate-spin" : ""} />
              4d6 取三高
            </PixelButton>
            {method === "roll" && (
              <PixelButton onClick={doRoll} disabled={rolling}>
                <RotateCcw size={12} /> 重投
              </PixelButton>
            )}
          </div>

          {method === "standard" && (
            <div className="font-silk text-sm text-text-muted">
              标准阵列：[15, 14, 13, 12, 10, 8]。你可以在右侧手动分配。
            </div>
          )}
          {method === "pointbuy" && (
            <div className="font-silk text-sm">
              <div>初始全部为 8，共 27 点可以花（最多买到 15）。</div>
              <div>
                已花费:{" "}
                <span
                  className={
                    pointBuyValid ? "text-pixel-green" : "text-pixel-red"
                  }
                >
                  {pointBuySpent}
                </span>
                {" / 27"}
              </div>
            </div>
          )}
          {method === "roll" && (
            <div className="font-silk text-sm text-text-muted">
              投骰结果池：{pool.join(", ")}
            </div>
          )}
        </div>
      </PixelCard>

      <PixelCard title="🎯 分配属性">
        <div className="space-y-2">
          {ABILITY_KEYS.map(({ key, zh }) => {
            const val = scores[key];
            const mod = abilityModifier(val);
            const cost = method === "pointbuy" ? pointBuyCost(val) : null;
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-16 font-silk text-pixel-base">{zh}</div>
                <button
                  className="pixel-btn w-8 text-center"
                  onClick={() => updateAbility({ [key]: Math.max(1, val - 1) } as Partial<AbilityScores>)}
                >
                  −
                </button>
                <div className="pixel-border-thin flex w-16 items-center justify-center bg-[#0a0e18] px-2 py-1 font-silk text-pixel-xl text-pixel-gold">
                  {val}
                </div>
                <button
                  className="pixel-btn w-8 text-center"
                  onClick={() => updateAbility({ [key]: Math.min(30, val + 1) } as Partial<AbilityScores>)}
                >
                  +
                </button>
                <div
                  className={`font-silk text-sm ${
                    mod >= 0 ? "text-pixel-green" : "text-pixel-red"
                  }`}
                >
                  {mod >= 0 ? "+" : ""}
                  {mod}
                </div>
                {cost !== null && !isNaN(cost) && (
                  <div className="ml-auto text-xs text-text-muted">
                    花费 {cost} 点
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-2 text-xs text-text-muted">
            💡 最终值 = 基础值 + 种族加值（请在 features/备注中记下种族加值来源）
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
