/**
 * 骰子解析与投掷工具。
 * 支持表达式：
 *   d20         → 1d20
 *   2d6+3       → 2d6 基础再加 3
 *   4d6kh3      → 4d6 取最高 3（keep highest） → 用于属性生成
 *   2d20kl1     → 2d20 取最低 1（劣势）
 *   1d20+1d4+2  → 组合
 */

export interface DiceRollDetail {
  expression: string;
  rolls: Array<{ notation: string; results: number[]; kept: number[]; value: number }>;
  modifier: number;
  total: number;
}

export function rollDice(expression: string): DiceRollDetail {
  const expr = expression.replace(/\s+/g, "").toLowerCase();
  if (!expr) throw new Error("空骰子表达式");

  const terms = expr.split(/(?=[+-])/);
  const rolls: DiceRollDetail["rolls"] = [];
  let modifier = 0;
  let total = 0;

  for (const term of terms) {
    const sign = term.startsWith("-") ? -1 : 1;
    const clean = term.replace(/^[+-]/, "");

    if (/^\d+$/.test(clean)) {
      const val = parseInt(clean, 10) * sign;
      modifier += val;
      total += val;
      continue;
    }

    const match = clean.match(/^(\d*)d(\d+)(?:(kh|kl|dh|dl)(\d+))?$/);
    if (!match) {
      throw new Error(`无法解析骰子表达式片段: ${term}`);
    }
    const count = parseInt(match[1] || "1", 10);
    const sides = parseInt(match[2], 10);
    const modType = match[3] as "kh" | "kl" | "dh" | "dl" | undefined;
    const modCount = match[4] ? parseInt(match[4], 10) : undefined;

    if (count <= 0 || count > 100) throw new Error("骰子数量必须在 1-100");
    if (sides <= 1 || sides > 1000) throw new Error("骰子面数必须在 2-1000");

    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(1 + Math.floor(Math.random() * sides));
    }

    let kept = [...results];
    if (modType && modCount) {
      const sorted = [...results].sort((a, b) => b - a);
      if (modType === "kh") kept = sorted.slice(0, modCount);
      else if (modType === "kl") kept = sorted.slice(-modCount);
      else if (modType === "dh") kept = sorted.slice(modCount);
      else if (modType === "dl") kept = sorted.slice(0, sorted.length - modCount);
    }

    const value = kept.reduce((a, b) => a + b, 0) * sign;
    rolls.push({
      notation: `${sign < 0 ? "-" : ""}${count}d${sides}${modType ? modType + modCount : ""}`,
      results,
      kept,
      value,
    });
    total += value;
  }

  return { expression, rolls, modifier, total };
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonusForLevel(level: number): number {
  return 2 + Math.floor((Math.max(1, Math.min(20, level)) - 1) / 4);
}

/** 4d6 取高 3，生成 6 个属性 */
export function rollAbilityArray(): number[] {
  const out: number[] = [];
  for (let i = 0; i < 6; i++) {
    out.push(rollDice("4d6kh3").total);
  }
  return out;
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export function pointBuyCost(score: number): number {
  if (score < 8 || score > 15) return NaN;
  const table: Record<number, number> = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
  };
  return table[score];
}

export function pointBuyTotal(scores: number[]): number {
  return scores.reduce((acc, s) => acc + (pointBuyCost(s) || 0), 0);
}
