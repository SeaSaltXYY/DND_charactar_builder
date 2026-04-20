export interface Subrace {
  name: string;
  abilityBonus?: Partial<Record<string, number>>;
  traits?: string[];
  skillProficiencies?: string[];
}

export interface Race {
  name: string;
  abilityBonus: Partial<Record<string, number>>;
  size: string;
  speed: number;
  traits: string[];
  languages: string[];
  subraces: Subrace[];
  source: string;
  skillProficiencies?: string[];
}

export const RACES: Race[] = [
  {
    name: "人类",
    abilityBonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    size: "中型",
    speed: 30,
    traits: [],
    languages: ["通用语"],
    source: "PHB",
    subraces: [
      { name: "人类变体", abilityBonus: {}, traits: ["任选两项属性+1", "一项技能擅长", "一个专长"] },
    ],
  },
  {
    name: "精灵",
    abilityBonus: { dex: 2 },
    size: "中型",
    speed: 30,
    traits: ["黑暗视觉 60尺", "敏锐感官(察觉擅长)", "精灵血统", "出神(不需睡眠)"],
    languages: ["通用语", "精灵语"],
    skillProficiencies: ["察觉"],
    source: "PHB",
    subraces: [
      { name: "高等精灵", abilityBonus: { int: 1 }, traits: ["精灵武器训练", "戏法", "额外语言"] },
      { name: "木精灵", abilityBonus: { wis: 1 }, traits: ["精灵武器训练", "疾步(速度35)", "林间隐匿"] },
      { name: "卓尔精灵", abilityBonus: { cha: 1 }, traits: ["高等黑暗视觉 120尺", "阳光敏感", "卓尔魔法"] },
      { name: "苍白精灵", abilityBonus: { int: 1 }, traits: ["精灵武器训练", "戏法"] },
      { name: "雅灵", abilityBonus: { wis: 1 }, traits: ["精灵武器训练"] },
      { name: "影灵", abilityBonus: { cha: 1 }, traits: ["影步"] },
      { name: "海精灵", abilityBonus: { con: 1 }, traits: ["水下呼吸", "游泳速度30"] },
      { name: "星界精灵", abilityBonus: { wis: 1 }, traits: ["星界之火", "星光出神"] },
    ],
  },
  {
    name: "半身人",
    abilityBonus: { dex: 2 },
    size: "小型",
    speed: 25,
    traits: ["幸运(d20投1可重投)", "勇敢(恐惧豁免优势)", "半身人敏捷(穿过大型生物)"],
    languages: ["通用语", "半身人语"],
    source: "PHB",
    subraces: [
      { name: "轻足半身人", abilityBonus: { cha: 1 }, traits: ["天生隐匿"] },
      { name: "敦实半身人", abilityBonus: { con: 1 }, traits: ["强韧恢复(毒素抗性)"] },
      { name: "鬼智半身人", abilityBonus: { wis: 1 }, traits: [] },
      { name: "莲源半身人", abilityBonus: { cha: 1 }, traits: [] },
    ],
  },
  {
    name: "矮人",
    abilityBonus: { con: 2 },
    size: "中型",
    speed: 25,
    traits: ["黑暗视觉 60尺", "矮人韧性(毒素抗性)", "矮人战斗训练", "石工知识"],
    languages: ["通用语", "矮人语"],
    source: "PHB",
    subraces: [
      { name: "丘陵矮人", abilityBonus: { wis: 1 }, traits: ["矮人坚韧(每级+1HP)"] },
      { name: "山地矮人", abilityBonus: { str: 2 }, traits: ["矮人盔甲训练(轻甲/中甲)"] },
      { name: "灰矮人", abilityBonus: { str: 1 }, traits: ["高等黑暗视觉 120尺", "阳光敏感", "灰矮人魔法"] },
    ],
  },
  {
    name: "龙裔",
    abilityBonus: { str: 2, cha: 1 },
    size: "中型",
    speed: 30,
    traits: ["龙族血统(选龙色)", "龙息武器", "伤害抗性"],
    languages: ["通用语", "龙语"],
    source: "PHB",
    subraces: [
      { name: "黑龙", traits: ["强酸龙息(5x30尺线,敏捷豁免)", "强酸抗性"] },
      { name: "蓝龙", traits: ["闪电龙息(5x30尺线,敏捷豁免)", "闪电抗性"] },
      { name: "黄铜龙", traits: ["火焰龙息(5x30尺线,敏捷豁免)", "火焰抗性"] },
      { name: "青铜龙", traits: ["闪电龙息(5x30尺线,敏捷豁免)", "闪电抗性"] },
      { name: "赤铜龙", traits: ["强酸龙息(5x30尺线,敏捷豁免)", "强酸抗性"] },
      { name: "金龙", traits: ["火焰龙息(15尺锥,敏捷豁免)", "火焰抗性"] },
      { name: "绿龙", traits: ["毒素龙息(15尺锥,体质豁免)", "毒素抗性"] },
      { name: "红龙", traits: ["火焰龙息(15尺锥,敏捷豁免)", "火焰抗性"] },
      { name: "银龙", traits: ["冷冻龙息(15尺锥,体质豁免)", "冷冻抗性"] },
      { name: "白龙", traits: ["冷冻龙息(15尺锥,体质豁免)", "冷冻抗性"] },
      { name: "龙裔变体", traits: [] },
    ],
  },
  {
    name: "侏儒",
    abilityBonus: { int: 2 },
    size: "小型",
    speed: 25,
    traits: ["黑暗视觉 60尺", "侏儒狡诈(魔法豁免优势)"],
    languages: ["通用语", "侏儒语"],
    source: "PHB",
    subraces: [
      { name: "森林侏儒", abilityBonus: { dex: 1 }, traits: ["天生幻术师", "与小型野兽交谈"] },
      { name: "岩侏儒", abilityBonus: { con: 1 }, traits: ["匠人学识", "修补匠"] },
      { name: "地底侏儒", abilityBonus: { dex: 1 }, traits: ["高等黑暗视觉 120尺", "石蚀伪装"] },
    ],
  },
  {
    name: "半精灵",
    abilityBonus: { cha: 2 },
    size: "中型",
    speed: 30,
    traits: ["黑暗视觉 60尺", "精灵血统", "技能多才(两项技能擅长)", "任选两项其他属性+1"],
    languages: ["通用语", "精灵语"],
    source: "PHB",
    subraces: [
      { name: "半精灵变体", traits: ["可替换技能多才为精灵亚种特质"] },
    ],
  },
  {
    name: "半兽人",
    abilityBonus: { str: 2, con: 1 },
    size: "中型",
    speed: 30,
    traits: ["黑暗视觉 60尺", "凶残攻击", "坚韧不屈(降至0HP时保留1HP,1次/长休)", "威吓擅长"],
    languages: ["通用语", "兽人语"],
    skillProficiencies: ["威吓"],
    source: "PHB",
    subraces: [],
  },
  {
    name: "提夫林",
    abilityBonus: { cha: 2, int: 1 },
    size: "中型",
    speed: 30,
    traits: ["黑暗视觉 60尺", "炼狱抗性(火焰抗性)", "炼狱传承"],
    languages: ["通用语", "炼狱语"],
    source: "PHB",
    subraces: [
      { name: "阿斯蒙蒂斯", abilityBonus: { int: 1 }, traits: ["默认提夫林"] },
      { name: "巴尔泽布", abilityBonus: { int: 1 }, traits: ["巴尔泽布传承"] },
      { name: "迪斯帕特", abilityBonus: { dex: 1 }, traits: ["迪斯帕特传承"] },
      { name: "菲尔娜", abilityBonus: { wis: 1 }, traits: ["菲尔娜传承"] },
      { name: "格莱西雅", abilityBonus: { dex: 1 }, traits: ["格莱西雅传承"] },
      { name: "莱维斯图斯", abilityBonus: { con: 1 }, traits: ["莱维斯图斯传承"] },
      { name: "马曼", abilityBonus: { int: 1 }, traits: ["马曼传承"] },
      { name: "墨菲斯托菲利斯", abilityBonus: { int: 1 }, traits: ["墨菲斯托菲利斯传承"] },
      { name: "扎瑞尔", abilityBonus: { str: 1 }, traits: ["扎瑞尔传承"] },
      { name: "提夫林变体", traits: [] },
    ],
  },
];

export function getRace(name: string): Race | undefined {
  return RACES.find((r) => r.name === name);
}

export function getSubraces(raceName: string): Subrace[] {
  return getRace(raceName)?.subraces ?? [];
}

export const RACE_NAMES = RACES.map((r) => r.name);
