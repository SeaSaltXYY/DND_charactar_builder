"use client";
import { create } from "zustand";
import type {
  AbilityScores,
  CharacterDraft,
  CharacterSection,
} from "@/types/character";
import { autoFillFromClass, autoFillFromRace } from "@/lib/character-calc";

export const SECTIONS: { key: CharacterSection; label: string; emoji: string }[] = [
  { key: "basic", label: "基础信息", emoji: "📜" },
  { key: "race", label: "种族", emoji: "🧝" },
  { key: "class", label: "职业", emoji: "⚔️" },
  { key: "ability", label: "属性值", emoji: "📊" },
  { key: "combat", label: "战斗数据", emoji: "🛡" },
  { key: "skills", label: "技能", emoji: "🎯" },
  { key: "background", label: "背景", emoji: "🎭" },
  { key: "equipment", label: "装备", emoji: "⚒️" },
  { key: "spells", label: "法术", emoji: "✨" },
  { key: "familiar", label: "魔宠", emoji: "🐾" },
  { key: "roleplay", label: "角色扮演", emoji: "📖" },
];

const defaultAbility: AbilityScores = {
  str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
};

export const defaultDraft: CharacterDraft = {
  name: "",
  gender: "",
  age: "",
  race: null,
  subrace: null,
  class: null,
  subclass: null,
  multiclass1: null,
  multiclass1Sub: null,
  multiclass2: null,
  multiclass2Sub: null,
  level: 1,
  background: null,
  alignment: null,
  ability_scores: { ...defaultAbility },
  ability_racial: {},
  ability_growth: {},
  useTashaRules: false,
  hp: 0,
  maxHp: 0,
  tempHp: 0,
  hitDice: "",
  ac: 10,
  initiative: 0,
  speed: 30,
  size: "中型",
  skills: [],
  savingThrows: [],
  toolProficiencies: [],
  languages: [],
  armorProficiencies: [],
  weaponProficiencies: [],
  armor: null,
  shield: false,
  weapons: [],
  equipment: [],
  currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  spellcastingAbility: null,
  spellSlots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  knownCantrips: [],
  knownSpells: [],
  preparedSpells: [],
  traits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  backstory: "",
  appearance: "",
  features: [],
  backgroundFeature: "",
  familiar: null,
  spells: [],
  campaign_id: null,
};

interface State {
  draft: CharacterDraft;
  rulebookIds: string[];
  collapsedSections: Set<CharacterSection>;

  setRulebookIds: (ids: string[]) => void;
  update: (patch: Partial<CharacterDraft>) => void;
  updateAbility: (patch: Partial<AbilityScores>) => void;
  toggleSection: (section: CharacterSection) => void;
  reset: () => void;
  load: (draft: CharacterDraft) => void;
  applyAIPatch: (patch: Partial<CharacterDraft>) => void;
}

export const useCharacterStore = create<State>((set, get) => ({
  draft: { ...defaultDraft },
  rulebookIds: [],
  collapsedSections: new Set<CharacterSection>(),

  setRulebookIds: (ids) => set({ rulebookIds: ids }),

  update: (patch) =>
    set({ draft: { ...get().draft, ...patch } }),

  updateAbility: (patch) =>
    set({
      draft: {
        ...get().draft,
        ability_scores: { ...get().draft.ability_scores, ...patch },
      },
    }),

  toggleSection: (section) => {
    const next = new Set(get().collapsedSections);
    if (next.has(section)) next.delete(section);
    else next.add(section);
    set({ collapsedSections: next });
  },

  reset: () => set({ draft: { ...defaultDraft } }),

  load: (draft) => set({ draft }),

  applyAIPatch: (patch) => {
    const current = get().draft;
    const merged = { ...current };

    for (const [key, value] of Object.entries(patch)) {
      if (value !== undefined) {
        (merged as Record<string, unknown>)[key] = value;
      }
    }

    if (patch.ability_scores) {
      merged.ability_scores = { ...current.ability_scores, ...patch.ability_scores };
    }
    if (patch.ability_racial) {
      merged.ability_racial = { ...current.ability_racial, ...patch.ability_racial };
    }

    // AI 设置了 class → 自动触发职业联动
    if (patch.class !== undefined) {
      const classPatch = autoFillFromClass(merged);
      Object.assign(merged, classPatch);
    }

    // AI 设置了 race → 自动触发种族联动
    if (patch.race !== undefined) {
      const racePatch = autoFillFromRace(merged);
      Object.assign(merged, racePatch);
    }

    set({ draft: merged });
  },
}));

// Backward compatibility exports
export const STEPS = SECTIONS.map((s) => ({
  key: s.key as string,
  label: s.label,
  emoji: s.emoji,
}));
