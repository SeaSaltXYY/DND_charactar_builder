export const ALIGNMENTS = [
  "守序善良", "中立善良", "混乱善良",
  "守序中立", "绝对中立", "混乱中立",
  "守序邪恶", "中立邪恶", "混乱邪恶",
] as const;

export const SIZES = ["微型", "小型", "中型", "大型", "巨型", "超巨型"] as const;

export const LANGUAGES = [
  "通用语", "矮人语", "精灵语", "巨人语", "侏儒语", "地精语",
  "半身人语", "兽人语", "深渊语", "天界语", "龙语", "深潜语",
  "炼狱语", "原初语", "木族语", "地底通用语",
  "水族语", "气族语", "刻洛语", "人鱼语", "牛头人语",
  "斯芬克斯语", "吉斯语",
] as const;

export const XP_TABLE: Record<number, number> = {
  1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500,
  6: 14000, 7: 23000, 8: 34000, 9: 48000, 10: 64000,
  11: 85000, 12: 100000, 13: 120000, 14: 140000, 15: 165000,
  16: 195000, 17: 225000, 18: 265000, 19: 305000, 20: 355000,
};

export const SKILLS = [
  { name: "运动", ability: "str" as const },
  { name: "特技", ability: "dex" as const },
  { name: "巧手", ability: "dex" as const },
  { name: "隐匿", ability: "dex" as const },
  { name: "奥秘", ability: "int" as const },
  { name: "历史", ability: "int" as const },
  { name: "调查", ability: "int" as const },
  { name: "自然", ability: "int" as const },
  { name: "宗教", ability: "int" as const },
  { name: "驯兽", ability: "wis" as const },
  { name: "洞悉", ability: "wis" as const },
  { name: "医疗", ability: "wis" as const },
  { name: "察觉", ability: "wis" as const },
  { name: "生存", ability: "wis" as const },
  { name: "欺瞒", ability: "cha" as const },
  { name: "威吓", ability: "cha" as const },
  { name: "表演", ability: "cha" as const },
  { name: "说服", ability: "cha" as const },
] as const;

export const ABILITY_LABELS: Record<string, string> = {
  str: "力量", dex: "敏捷", con: "体质",
  int: "智力", wis: "感知", cha: "魅力",
};

export const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export const DEFAULT_CURRENCY: Currency = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

export function currencyToGP(c: Currency): number {
  return c.cp / 100 + c.sp / 10 + c.ep / 2 + c.gp + c.pp * 10;
}
