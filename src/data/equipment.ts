export interface Weapon {
  name: string;
  category: "简单近战" | "简单远程" | "军用近战" | "军用远程";
  damage: string;
  damageType: string;
  properties: string[];
  weight: number;
  cost: string;
}

export interface Armor {
  name: string;
  category: "轻甲" | "中甲" | "重甲" | "盾牌";
  baseAC: number;
  maxDexBonus: number | null;
  stealthDisadvantage: boolean;
  strengthReq: number;
  weight: number;
  cost: string;
}

export interface GearItem {
  name: string;
  description: string;
  cost: string;
  weight: number;
}

export const WEAPONS: Weapon[] = [
  // 简单近战
  { name: "短棒", category: "简单近战", damage: "1d4", damageType: "钝击", properties: ["轻型"], weight: 2, cost: "1sp" },
  { name: "匕首", category: "简单近战", damage: "1d4", damageType: "穿刺", properties: ["灵巧", "轻型", "投掷(20/60)"], weight: 1, cost: "2gp" },
  { name: "巨棒", category: "简单近战", damage: "1d8", damageType: "钝击", properties: ["双手"], weight: 10, cost: "2sp" },
  { name: "手斧", category: "简单近战", damage: "1d6", damageType: "挥砍", properties: ["轻型", "投掷(20/60)"], weight: 2, cost: "5gp" },
  { name: "标枪", category: "简单近战", damage: "1d6", damageType: "穿刺", properties: ["投掷(30/120)"], weight: 2, cost: "5sp" },
  { name: "轻锤", category: "简单近战", damage: "1d4", damageType: "钝击", properties: ["轻型", "投掷(20/60)"], weight: 2, cost: "2gp" },
  { name: "硬头锤", category: "简单近战", damage: "1d6", damageType: "钝击", properties: [], weight: 4, cost: "5gp" },
  { name: "长棍", category: "简单近战", damage: "1d6", damageType: "钝击", properties: ["两用(1d8)"], weight: 4, cost: "2sp" },
  { name: "镰刀", category: "简单近战", damage: "1d4", damageType: "挥砍", properties: ["轻型"], weight: 2, cost: "1gp" },
  { name: "矛", category: "简单近战", damage: "1d6", damageType: "穿刺", properties: ["投掷(20/60)", "两用(1d8)"], weight: 3, cost: "1gp" },
  // 简单远程
  { name: "轻弩", category: "简单远程", damage: "1d8", damageType: "穿刺", properties: ["弹药(80/320)", "装填", "双手"], weight: 5, cost: "25gp" },
  { name: "飞镖", category: "简单远程", damage: "1d4", damageType: "穿刺", properties: ["灵巧", "投掷(20/60)"], weight: 0.25, cost: "5cp" },
  { name: "短弓", category: "简单远程", damage: "1d6", damageType: "穿刺", properties: ["弹药(80/320)", "双手"], weight: 2, cost: "25gp" },
  { name: "投石索", category: "简单远程", damage: "1d4", damageType: "钝击", properties: ["弹药(30/120)"], weight: 0, cost: "1sp" },
  // 军用近战
  { name: "战斧", category: "军用近战", damage: "1d8", damageType: "挥砍", properties: ["两用(1d10)"], weight: 4, cost: "10gp" },
  { name: "链枷", category: "军用近战", damage: "1d8", damageType: "钝击", properties: [], weight: 2, cost: "10gp" },
  { name: "长柄刀", category: "军用近战", damage: "1d10", damageType: "挥砍", properties: ["重型", "触及", "双手"], weight: 6, cost: "20gp" },
  { name: "巨斧", category: "军用近战", damage: "1d12", damageType: "挥砍", properties: ["重型", "双手"], weight: 7, cost: "30gp" },
  { name: "巨剑", category: "军用近战", damage: "2d6", damageType: "挥砍", properties: ["重型", "双手"], weight: 6, cost: "50gp" },
  { name: "戟", category: "军用近战", damage: "1d10", damageType: "挥砍", properties: ["重型", "触及", "双手"], weight: 6, cost: "20gp" },
  { name: "骑枪", category: "军用近战", damage: "1d12", damageType: "穿刺", properties: ["触及", "特殊"], weight: 6, cost: "10gp" },
  { name: "长剑", category: "军用近战", damage: "1d8", damageType: "挥砍", properties: ["两用(1d10)"], weight: 3, cost: "15gp" },
  { name: "巨锤", category: "军用近战", damage: "2d6", damageType: "钝击", properties: ["重型", "双手"], weight: 10, cost: "10gp" },
  { name: "钉头锤", category: "军用近战", damage: "1d8", damageType: "穿刺", properties: [], weight: 4, cost: "15gp" },
  { name: "长矛", category: "军用近战", damage: "1d10", damageType: "穿刺", properties: ["重型", "触及", "双手"], weight: 18, cost: "5gp" },
  { name: "刺剑", category: "军用近战", damage: "1d8", damageType: "穿刺", properties: ["灵巧"], weight: 2, cost: "25gp" },
  { name: "弯刀", category: "军用近战", damage: "1d6", damageType: "挥砍", properties: ["灵巧", "轻型"], weight: 3, cost: "25gp" },
  { name: "短剑", category: "军用近战", damage: "1d6", damageType: "穿刺", properties: ["灵巧", "轻型"], weight: 2, cost: "10gp" },
  { name: "三叉戟", category: "军用近战", damage: "1d6", damageType: "穿刺", properties: ["投掷(20/60)", "两用(1d8)"], weight: 4, cost: "5gp" },
  { name: "战镐", category: "军用近战", damage: "1d8", damageType: "穿刺", properties: [], weight: 2, cost: "5gp" },
  { name: "战锤", category: "军用近战", damage: "1d8", damageType: "钝击", properties: ["两用(1d10)"], weight: 2, cost: "15gp" },
  { name: "鞭", category: "军用近战", damage: "1d4", damageType: "挥砍", properties: ["灵巧", "触及"], weight: 3, cost: "2gp" },
  // 军用远程
  { name: "吹箭筒", category: "军用远程", damage: "1", damageType: "穿刺", properties: ["弹药(25/100)", "装填"], weight: 1, cost: "10gp" },
  { name: "手弩", category: "军用远程", damage: "1d6", damageType: "穿刺", properties: ["弹药(30/120)", "轻型", "装填"], weight: 3, cost: "75gp" },
  { name: "重弩", category: "军用远程", damage: "1d10", damageType: "穿刺", properties: ["弹药(100/400)", "重型", "装填", "双手"], weight: 18, cost: "50gp" },
  { name: "长弓", category: "军用远程", damage: "1d8", damageType: "穿刺", properties: ["弹药(150/600)", "重型", "双手"], weight: 2, cost: "50gp" },
  { name: "捕网", category: "军用远程", damage: "-", damageType: "-", properties: ["特殊", "投掷(5/15)"], weight: 3, cost: "1gp" },
];

export const ARMORS: Armor[] = [
  // 轻甲
  { name: "布甲", category: "轻甲", baseAC: 11, maxDexBonus: null, stealthDisadvantage: true, strengthReq: 0, weight: 8, cost: "5gp" },
  { name: "皮甲", category: "轻甲", baseAC: 11, maxDexBonus: null, stealthDisadvantage: false, strengthReq: 0, weight: 10, cost: "10gp" },
  { name: "镶钉皮甲", category: "轻甲", baseAC: 12, maxDexBonus: null, stealthDisadvantage: false, strengthReq: 0, weight: 13, cost: "45gp" },
  // 中甲
  { name: "兽皮甲", category: "中甲", baseAC: 12, maxDexBonus: 2, stealthDisadvantage: false, strengthReq: 0, weight: 12, cost: "10gp" },
  { name: "链甲衫", category: "中甲", baseAC: 13, maxDexBonus: 2, stealthDisadvantage: false, strengthReq: 0, weight: 20, cost: "50gp" },
  { name: "鳞甲", category: "中甲", baseAC: 14, maxDexBonus: 2, stealthDisadvantage: true, strengthReq: 0, weight: 45, cost: "50gp" },
  { name: "胸甲", category: "中甲", baseAC: 14, maxDexBonus: 2, stealthDisadvantage: false, strengthReq: 0, weight: 20, cost: "400gp" },
  { name: "半身板甲", category: "中甲", baseAC: 15, maxDexBonus: 2, stealthDisadvantage: true, strengthReq: 0, weight: 40, cost: "750gp" },
  // 重甲
  { name: "环甲", category: "重甲", baseAC: 14, maxDexBonus: 0, stealthDisadvantage: true, strengthReq: 0, weight: 40, cost: "30gp" },
  { name: "链甲", category: "重甲", baseAC: 16, maxDexBonus: 0, stealthDisadvantage: true, strengthReq: 13, weight: 55, cost: "75gp" },
  { name: "板条甲", category: "重甲", baseAC: 17, maxDexBonus: 0, stealthDisadvantage: true, strengthReq: 15, weight: 60, cost: "200gp" },
  { name: "板甲", category: "重甲", baseAC: 18, maxDexBonus: 0, stealthDisadvantage: true, strengthReq: 15, weight: 65, cost: "1500gp" },
  // 盾牌
  { name: "盾牌", category: "盾牌", baseAC: 2, maxDexBonus: null, stealthDisadvantage: false, strengthReq: 0, weight: 6, cost: "10gp" },
];

export function calculateAC(
  armor: Armor | null,
  shield: boolean,
  dexMod: number,
  specialAC?: { name: string; formula: (dex: number) => number }
): number {
  if (specialAC) return specialAC.formula(dexMod) + (shield ? 2 : 0);
  if (!armor) return 10 + dexMod + (shield ? 2 : 0);
  const dexBonus = armor.maxDexBonus !== null ? Math.min(dexMod, armor.maxDexBonus) : dexMod;
  return armor.baseAC + dexBonus + (shield ? 2 : 0);
}

export const WEAPON_CATEGORIES = ["简单近战", "简单远程", "军用近战", "军用远程"] as const;
export const ARMOR_CATEGORIES = ["轻甲", "中甲", "重甲", "盾牌"] as const;
