export interface Subclass {
  name: string;
  source?: string;
}

export interface ClassDef {
  name: string;
  hitDie: number;
  primaryAbility: string;
  savingThrows: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  skillChoices: { from: string[]; count: number };
  isCaster: boolean;
  spellcastingAbility?: string;
  subclasses: Subclass[];
  source: string;
}

export const CLASSES: ClassDef[] = [
  {
    name: "野蛮人",
    hitDie: 12,
    primaryAbility: "力量",
    savingThrows: ["str", "con"],
    armorProficiencies: ["轻甲", "中甲", "盾牌"],
    weaponProficiencies: ["简单武器", "军用武器"],
    skillChoices: { from: ["驯兽", "运动", "威吓", "自然", "察觉", "生存"], count: 2 },
    isCaster: false,
    subclasses: [
      { name: "狂战士", source: "PHB" }, { name: "图腾武者", source: "PHB" },
      { name: "狂热者", source: "XGE" }, { name: "先祖守卫", source: "XGE" },
      { name: "风暴先驱", source: "XGE" }, { name: "战狂", source: "TCE" },
      { name: "狂野魔法道途", source: "TCE" }, { name: "野兽道途", source: "TCE" },
      { name: "巨人道途", source: "BGG" },
    ],
    source: "PHB",
  },
  {
    name: "吟游诗人",
    hitDie: 8,
    primaryAbility: "魅力",
    savingThrows: ["dex", "cha"],
    armorProficiencies: ["轻甲"],
    weaponProficiencies: ["简单武器", "手弩", "长剑", "刺剑", "短剑"],
    skillChoices: { from: ["运动","特技","巧手","隐匿","奥秘","历史","调查","自然","宗教","驯兽","洞悉","医疗","察觉","生存","欺瞒","威吓","表演","说服"], count: 3 },
    isCaster: true,
    spellcastingAbility: "cha",
    subclasses: [
      { name: "逸闻学院", source: "PHB" }, { name: "勇气学院", source: "PHB" },
      { name: "迷惑学院", source: "XGE" }, { name: "剑舞学院", source: "XGE" },
      { name: "低语学院", source: "XGE" }, { name: "创造学院", source: "TCE" },
      { name: "雄辩学院", source: "TCE" }, { name: "精魂学院", source: "VGR" },
    ],
    source: "PHB",
  },
  {
    name: "牧师",
    hitDie: 8,
    primaryAbility: "感知",
    savingThrows: ["wis", "cha"],
    armorProficiencies: ["轻甲", "中甲", "盾牌"],
    weaponProficiencies: ["简单武器"],
    skillChoices: { from: ["历史", "洞悉", "医疗", "说服", "宗教"], count: 2 },
    isCaster: true,
    spellcastingAbility: "wis",
    subclasses: [
      { name: "知识领域", source: "PHB" }, { name: "生命领域", source: "PHB" },
      { name: "光明领域", source: "PHB" }, { name: "自然领域", source: "PHB" },
      { name: "风暴领域", source: "PHB" }, { name: "诡术领域", source: "PHB" },
      { name: "战争领域", source: "PHB" }, { name: "锻造领域", source: "XGE" },
      { name: "坟墓领域", source: "XGE" }, { name: "奥秘领域", source: "SCAG" },
      { name: "秩序领域", source: "TCE" }, { name: "和平领域", source: "TCE" },
      { name: "暮光领域", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "德鲁伊",
    hitDie: 8,
    primaryAbility: "感知",
    savingThrows: ["int", "wis"],
    armorProficiencies: ["轻甲", "中甲", "盾牌"],
    weaponProficiencies: ["短棒", "匕首", "飞镖", "标枪", "硬头锤", "长棍", "弯刀", "镰刀", "投石索", "矛"],
    skillChoices: { from: ["奥秘", "驯兽", "洞悉", "医疗", "自然", "察觉", "宗教", "生存"], count: 2 },
    isCaster: true,
    spellcastingAbility: "wis",
    subclasses: [
      { name: "大地结社", source: "PHB" }, { name: "月亮结社", source: "PHB" },
      { name: "梦境结社", source: "XGE" }, { name: "牧人结社", source: "XGE" },
      { name: "孢子结社", source: "TCE" }, { name: "星辰结社", source: "TCE" },
      { name: "野火结社", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "战士",
    hitDie: 10,
    primaryAbility: "力量 / 敏捷",
    savingThrows: ["str", "con"],
    armorProficiencies: ["全部盔甲", "盾牌"],
    weaponProficiencies: ["简单武器", "军用武器"],
    skillChoices: { from: ["特技", "驯兽", "运动", "历史", "洞悉", "威吓", "察觉", "生存"], count: 2 },
    isCaster: false,
    subclasses: [
      { name: "勇士", source: "PHB" }, { name: "战斗大师", source: "PHB" },
      { name: "奥法骑士", source: "PHB" }, { name: "魔射手", source: "XGE" },
      { name: "骑兵", source: "XGE" }, { name: "武士", source: "XGE" },
      { name: "紫龙骑士", source: "EGtW" }, { name: "回音骑士", source: "EGtW" },
      { name: "符文骑士", source: "TCE" }, { name: "灵能武士", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "武僧",
    hitDie: 8,
    primaryAbility: "敏捷 / 感知",
    savingThrows: ["str", "dex"],
    armorProficiencies: [],
    weaponProficiencies: ["简单武器", "短剑"],
    skillChoices: { from: ["特技", "运动", "历史", "洞悉", "宗教", "隐匿"], count: 2 },
    isCaster: false,
    subclasses: [
      { name: "散打宗", source: "PHB" }, { name: "暗影宗", source: "PHB" },
      { name: "四象宗", source: "PHB" }, { name: "醉拳宗", source: "XGE" },
      { name: "剑圣宗", source: "XGE" }, { name: "日魂宗", source: "XGE" },
      { name: "永亡宗", source: "XGE" }, { name: "命流宗", source: "TCE" },
      { name: "星我宗", source: "TCE" }, { name: "神龙宗", source: "FTD" },
    ],
    source: "PHB",
  },
  {
    name: "圣武士",
    hitDie: 10,
    primaryAbility: "力量 / 魅力",
    savingThrows: ["wis", "cha"],
    armorProficiencies: ["全部盔甲", "盾牌"],
    weaponProficiencies: ["简单武器", "军用武器"],
    skillChoices: { from: ["运动", "洞悉", "威吓", "医疗", "说服", "宗教"], count: 2 },
    isCaster: true,
    spellcastingAbility: "cha",
    subclasses: [
      { name: "奉献之誓", source: "PHB" }, { name: "古贤之誓", source: "PHB" },
      { name: "复仇之誓", source: "PHB" }, { name: "征服之誓", source: "XGE" },
      { name: "救赎之誓", source: "XGE" }, { name: "王冠之誓", source: "SCAG" },
      { name: "荣耀之誓", source: "TCE" }, { name: "守望之誓", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "游侠",
    hitDie: 10,
    primaryAbility: "敏捷 / 感知",
    savingThrows: ["str", "dex"],
    armorProficiencies: ["轻甲", "中甲", "盾牌"],
    weaponProficiencies: ["简单武器", "军用武器"],
    skillChoices: { from: ["驯兽", "运动", "洞悉", "调查", "自然", "察觉", "隐匿", "生存"], count: 3 },
    isCaster: true,
    spellcastingAbility: "wis",
    subclasses: [
      { name: "猎人", source: "PHB" }, { name: "驯兽师", source: "PHB" },
      { name: "幽域追踪者", source: "XGE" }, { name: "边界行者", source: "XGE" },
      { name: "怪物杀手", source: "XGE" }, { name: "集群守卫", source: "TCE" },
      { name: "妖精漫游者", source: "TCE" }, { name: "龙兽守卫", source: "FTD" },
    ],
    source: "PHB",
  },
  {
    name: "游荡者",
    hitDie: 8,
    primaryAbility: "敏捷",
    savingThrows: ["dex", "int"],
    armorProficiencies: ["轻甲"],
    weaponProficiencies: ["简单武器", "手弩", "长剑", "刺剑", "短剑"],
    skillChoices: { from: ["特技", "运动", "欺瞒", "洞悉", "威吓", "调查", "察觉", "表演", "说服", "巧手", "隐匿"], count: 4 },
    isCaster: false,
    subclasses: [
      { name: "盗贼", source: "PHB" }, { name: "刺客", source: "PHB" },
      { name: "诡术师", source: "PHB" }, { name: "调查员", source: "XGE" },
      { name: "策士", source: "XGE" }, { name: "斥候", source: "XGE" },
      { name: "游荡剑客", source: "XGE" }, { name: "鬼魅", source: "TCE" },
      { name: "魂刃", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "术士",
    hitDie: 6,
    primaryAbility: "魅力",
    savingThrows: ["con", "cha"],
    armorProficiencies: [],
    weaponProficiencies: ["匕首", "飞镖", "投石索", "长棍", "轻弩"],
    skillChoices: { from: ["奥秘", "欺瞒", "洞悉", "威吓", "说服", "宗教"], count: 2 },
    isCaster: true,
    spellcastingAbility: "cha",
    subclasses: [
      { name: "龙族血脉", source: "PHB" }, { name: "狂野魔法", source: "PHB" },
      { name: "神圣之魂", source: "XGE" }, { name: "幽影魔法", source: "XGE" },
      { name: "风暴术法", source: "XGE" }, { name: "畸变心智", source: "TCE" },
      { name: "时械之魂", source: "TCE" }, { name: "月之术法", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "邪术师",
    hitDie: 8,
    primaryAbility: "魅力",
    savingThrows: ["wis", "cha"],
    armorProficiencies: ["轻甲"],
    weaponProficiencies: ["简单武器"],
    skillChoices: { from: ["奥秘", "欺瞒", "历史", "威吓", "调查", "自然", "宗教"], count: 2 },
    isCaster: true,
    spellcastingAbility: "cha",
    subclasses: [
      { name: "至高妖精", source: "PHB" }, { name: "邪魔宗主", source: "PHB" },
      { name: "旧日支配者", source: "PHB" }, { name: "天界宗主", source: "XGE" },
      { name: "咒剑士", source: "XGE" }, { name: "不朽者", source: "SCAG" },
      { name: "巨灵宗主", source: "TCE" }, { name: "深海契约", source: "TCE" },
      { name: "死灵宗主", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "法师",
    hitDie: 6,
    primaryAbility: "智力",
    savingThrows: ["int", "wis"],
    armorProficiencies: [],
    weaponProficiencies: ["匕首", "飞镖", "投石索", "长棍", "轻弩"],
    skillChoices: { from: ["奥秘", "历史", "洞悉", "调查", "医疗", "宗教"], count: 2 },
    isCaster: true,
    spellcastingAbility: "int",
    subclasses: [
      { name: "防护学派", source: "PHB" }, { name: "咒法学派", source: "PHB" },
      { name: "预言学派", source: "PHB" }, { name: "附魔学派", source: "PHB" },
      { name: "塑能学派", source: "PHB" }, { name: "幻术学派", source: "PHB" },
      { name: "死灵学派", source: "PHB" }, { name: "变化学派", source: "PHB" },
      { name: "战法师", source: "XGE" }, { name: "剑咏者", source: "SCAG" },
      { name: "时间魔法", source: "EGtW" }, { name: "重力魔法", source: "EGtW" },
      { name: "书士会", source: "TCE" },
    ],
    source: "PHB",
  },
  {
    name: "奇械师",
    hitDie: 8,
    primaryAbility: "智力",
    savingThrows: ["con", "int"],
    armorProficiencies: ["轻甲", "中甲", "盾牌"],
    weaponProficiencies: ["简单武器"],
    skillChoices: { from: ["奥秘", "历史", "调查", "医疗", "自然", "察觉", "巧手"], count: 2 },
    isCaster: true,
    spellcastingAbility: "int",
    subclasses: [
      { name: "炼金师", source: "TCE" }, { name: "魔炮师", source: "TCE" },
      { name: "战地匠师", source: "TCE" }, { name: "装甲师", source: "TCE" },
    ],
    source: "TCE",
  },
];

export function getClass(name: string): ClassDef | undefined {
  return CLASSES.find((c) => c.name === name);
}

export function getSubclasses(className: string): Subclass[] {
  return getClass(className)?.subclasses ?? [];
}

export const CLASS_NAMES = CLASSES.map((c) => c.name);
