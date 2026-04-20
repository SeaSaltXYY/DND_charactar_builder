import type { AbilityScores, AbilityKey, CharacterDraft } from "@/types/character";
import { getClass } from "@/data/classes";
import { getRace } from "@/data/races";
import { abilityModifier, proficiencyBonusForLevel } from "./dice";

export function totalAbilityScore(
  base: number,
  racial: number,
  growth: number
): number {
  return base + racial + growth;
}

export function computeTotalAbilities(draft: CharacterDraft): AbilityScores {
  const keys: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];
  const result = { ...draft.ability_scores };
  for (const k of keys) {
    result[k] =
      draft.ability_scores[k] +
      (draft.ability_racial[k] ?? 0) +
      (draft.ability_growth[k] ?? 0);
  }
  return result;
}

export function computeModifiers(scores: AbilityScores): Record<AbilityKey, number> {
  return {
    str: abilityModifier(scores.str),
    dex: abilityModifier(scores.dex),
    con: abilityModifier(scores.con),
    int: abilityModifier(scores.int),
    wis: abilityModifier(scores.wis),
    cha: abilityModifier(scores.cha),
  };
}

export function computeHP(draft: CharacterDraft): number {
  const cls = getClass(draft.class ?? "");
  if (!cls) return 10;
  const total = computeTotalAbilities(draft);
  const conMod = abilityModifier(total.con);
  const firstLevel = cls.hitDie + conMod;
  const avgPerLevel = Math.floor(cls.hitDie / 2) + 1 + conMod;
  return Math.max(1, firstLevel + (draft.level - 1) * avgPerLevel);
}

export function computeAC(draft: CharacterDraft): number {
  const total = computeTotalAbilities(draft);
  const dexMod = abilityModifier(total.dex);
  const shieldBonus = draft.shield ? 2 : 0;

  if (!draft.armor) {
    // 无甲 AC: 特殊计算（蛮子/武僧）
    if (draft.class === "野蛮人") {
      const conMod = abilityModifier(total.con);
      return 10 + dexMod + conMod + shieldBonus;
    }
    if (draft.class === "武僧") {
      const wisMod = abilityModifier(total.wis);
      return 10 + dexMod + wisMod + shieldBonus;
    }
    return 10 + dexMod + shieldBonus;
  }

  const armor = draft.armor;
  let dexBonus = dexMod;
  if (armor.category === "中甲") dexBonus = Math.min(dexMod, 2);
  else if (armor.category === "重甲") dexBonus = 0;
  return armor.baseAC + dexBonus + shieldBonus;
}

export function computeInitiative(draft: CharacterDraft): number {
  const total = computeTotalAbilities(draft);
  return abilityModifier(total.dex);
}

export function computeSpeed(draft: CharacterDraft): number {
  const race = getRace(draft.race ?? "");
  if (!race) return 30;
  let speed = race.speed;
  if (draft.subrace === "木精灵") speed = 35;
  return speed;
}

export function computeSpellDC(draft: CharacterDraft): number {
  if (!draft.spellcastingAbility) return 0;
  const total = computeTotalAbilities(draft);
  const key = draft.spellcastingAbility as AbilityKey;
  const mod = abilityModifier(total[key]);
  const prof = proficiencyBonusForLevel(draft.level);
  return 8 + prof + mod;
}

export function computeSpellAttack(draft: CharacterDraft): number {
  if (!draft.spellcastingAbility) return 0;
  const total = computeTotalAbilities(draft);
  const key = draft.spellcastingAbility as AbilityKey;
  const mod = abilityModifier(total[key]);
  const prof = proficiencyBonusForLevel(draft.level);
  return prof + mod;
}

export function computePassivePerception(draft: CharacterDraft): number {
  const total = computeTotalAbilities(draft);
  const wisMod = abilityModifier(total.wis);
  const prof = draft.skills.includes("察觉") ? proficiencyBonusForLevel(draft.level) : 0;
  return 10 + wisMod + prof;
}

export function computeSkillBonus(
  draft: CharacterDraft,
  skillName: string,
  abilityKey: AbilityKey
): number {
  const total = computeTotalAbilities(draft);
  const mod = abilityModifier(total[abilityKey]);
  const prof = draft.skills.includes(skillName) ? proficiencyBonusForLevel(draft.level) : 0;
  return mod + prof;
}

export function autoFillFromRace(draft: CharacterDraft): Partial<CharacterDraft> {
  const race = getRace(draft.race ?? "");
  if (!race) return {};

  const sub = draft.subrace
    ? race.subraces.find((s) => s.name === draft.subrace)
    : undefined;

  const patch: Partial<CharacterDraft> = {
    size: race.size,
    speed: race.speed,
  };

  // 塔莎规则：种族加值由玩家自定义，不自动设置
  if (!draft.useTashaRules) {
    patch.ability_racial = { ...race.abilityBonus } as Partial<AbilityScores>;
    if (sub?.abilityBonus) {
      patch.ability_racial = {
        ...race.abilityBonus,
        ...sub.abilityBonus,
      } as Partial<AbilityScores>;
    }
  }

  const racialTraits = [...race.traits];
  if (sub?.traits) racialTraits.push(...sub.traits);
  patch.features = racialTraits;

  if (!draft.languages.length) {
    patch.languages = [...race.languages];
  }

  const raceSkills = [...(race.skillProficiencies ?? [])];
  if (sub?.skillProficiencies) raceSkills.push(...sub.skillProficiencies);
  if (raceSkills.length > 0) {
    const merged = new Set([...draft.skills, ...raceSkills]);
    patch.skills = [...merged];
  }

  return patch;
}

export function autoFillFromClass(draft: CharacterDraft): Partial<CharacterDraft> {
  const cls = getClass(draft.class ?? "");
  if (!cls) return {};

  const patch: Partial<CharacterDraft> = {
    hitDice: `${draft.level}d${cls.hitDie}`,
    savingThrows: cls.savingThrows,
    armorProficiencies: cls.armorProficiencies,
    weaponProficiencies: cls.weaponProficiencies,
  };

  if (cls.isCaster && cls.spellcastingAbility) {
    patch.spellcastingAbility = cls.spellcastingAbility;
  } else {
    patch.spellcastingAbility = null;
  }

  return patch;
}

export function recalcDerived(draft: CharacterDraft): Partial<CharacterDraft> {
  return {
    maxHp: computeHP(draft),
    hp: draft.hp || computeHP(draft),
    ac: computeAC(draft),
    initiative: computeInitiative(draft),
    speed: computeSpeed(draft),
  };
}
