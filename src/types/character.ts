export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface WeaponSlot {
  name: string;
  damage: string;
  damageType: string;
  properties: string;
  attackBonus?: number;
}

export interface ArmorSlot {
  name: string;
  baseAC: number;
  category: string;
}

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface FamiliarInfo {
  name: string;
  customName: string;
  type: "standard" | "chain";
}

export interface Character {
  id: string;
  name: string;
  race: string | null;
  subrace?: string | null;
  class: string | null;
  subclass?: string | null;
  level: number;
  background: string | null;
  alignment: string | null;
  ability_scores: AbilityScores;
  skills: string[];
  equipment: string[];
  spells: string[];
  features: string[];
  hp: number;
  ac: number;
  full_sheet: Record<string, unknown>;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
}

export type WizardStep =
  | "basic"
  | "race"
  | "class"
  | "ability"
  | "background"
  | "skills"
  | "equipment"
  | "spells"
  | "preview";

export type CharacterSection =
  | "basic"
  | "race"
  | "class"
  | "ability"
  | "combat"
  | "skills"
  | "background"
  | "equipment"
  | "spells"
  | "familiar"
  | "roleplay";

export interface CharacterDraft {
  // --- 基础 ---
  name: string;
  gender: string;
  age: string;
  race: string | null;
  subrace: string | null;
  class: string | null;
  subclass: string | null;
  multiclass1: string | null;
  multiclass1Sub: string | null;
  multiclass2: string | null;
  multiclass2Sub: string | null;
  level: number;
  background: string | null;
  alignment: string | null;

  // --- 属性 (拆分来源) ---
  ability_scores: AbilityScores;
  ability_racial: Partial<AbilityScores>;
  ability_growth: Partial<AbilityScores>;

  // --- 战斗 ---
  hp: number;
  maxHp: number;
  tempHp: number;
  hitDice: string;
  ac: number;
  initiative: number;
  speed: number;
  size: string;

  // --- 技能 & 熟练 ---
  skills: string[];
  savingThrows: string[];
  toolProficiencies: string[];
  languages: string[];
  armorProficiencies: string[];
  weaponProficiencies: string[];

  // --- 装备（结构化） ---
  armor: ArmorSlot | null;
  shield: boolean;
  weapons: WeaponSlot[];
  equipment: string[];
  currency: Currency;

  // --- 法术 ---
  spellcastingAbility: string | null;
  spellSlots: number[];
  knownCantrips: string[];
  knownSpells: string[];
  preparedSpells: string[];

  // --- 背景 & 角色扮演 ---
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  appearance: string;
  features: string[];
  backgroundFeature: string;

  // --- 魔宠 ---
  familiar: FamiliarInfo | null;

  // --- 法术/装备旧字段兼容 ---
  spells: string[];

  // --- 元数据 ---
  campaign_id: string | null;
}
