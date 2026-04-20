export interface FamiliarStat {
  name: string;
  type: string;
  size: string;
  ac: number;
  hp: number;
  speed: string;
  abilities: { str: number; dex: number; con: number; int: number; wis: number; cha: number };
  senses: string;
  traits: string[];
  source: "standard" | "chain";
  description: string;
}

export const FAMILIARS: FamiliarStat[] = [
  // === 标准魔宠 (寻获魔宠法术) ===
  { name: "猫头鹰", type: "微型野兽", size: "微型", ac: 11, hp: 1, speed: "5尺, 飞行60尺", abilities: { str: 3, dex: 13, con: 8, int: 2, wis: 12, cha: 7 }, senses: "黑暗视觉120尺, 被动察觉13", traits: ["飞掠(不引发借机攻击)", "敏锐听觉与视觉(察觉优势)"], source: "standard", description: "最受欢迎的魔宠选择。飞掠特性允许它在攻击后安全撤离，敏锐感官让它成为绝佳侦察兵。" },
  { name: "猫", type: "微型野兽", size: "微型", ac: 12, hp: 2, speed: "40尺, 攀爬30尺", abilities: { str: 3, dex: 15, con: 10, int: 3, wis: 12, cha: 7 }, senses: "黑暗视觉30尺, 被动察觉13", traits: ["敏锐嗅觉(嗅觉察觉优势)"], source: "standard", description: "低调且不引人注目的选择，适合城市冒险。攀爬速度让它可以到达许多难以到达的地方。" },
  { name: "蝙蝠", type: "微型野兽", size: "微型", ac: 12, hp: 1, speed: "5尺, 飞行30尺", abilities: { str: 2, dex: 15, con: 8, int: 2, wis: 12, cha: 4 }, senses: "盲视60尺, 被动察觉11", traits: ["回声定位(失聪时无法使用盲视)", "敏锐听觉(听觉察觉优势)"], source: "standard", description: "盲视60尺是独特优势，可以在完全黑暗中侦察。适合地下城冒险。" },
  { name: "鹰", type: "微型野兽", size: "微型", ac: 13, hp: 1, speed: "10尺, 飞行60尺", abilities: { str: 6, dex: 15, con: 10, int: 2, wis: 14, cha: 7 }, senses: "被动察觉14", traits: ["敏锐视觉(视觉察觉优势)"], source: "standard", description: "高AC和良好视觉，适合空中侦察。60尺飞行速度令它行动迅速。" },
  { name: "蛙", type: "微型野兽", size: "微型", ac: 11, hp: 1, speed: "20尺, 游泳20尺", abilities: { str: 1, dex: 13, con: 8, int: 1, wis: 8, cha: 3 }, senses: "黑暗视觉30尺, 被动察觉9", traits: ["两栖(水陆呼吸)", "跳远(10尺助跑跳远13尺)"], source: "standard", description: "两栖能力让它能在水中和陆地活动。不太引人注目的选择。" },
  { name: "乌鸦", type: "微型野兽", size: "微型", ac: 12, hp: 1, speed: "10尺, 飞行50尺", abilities: { str: 2, dex: 14, con: 8, int: 2, wis: 12, cha: 6 }, senses: "被动察觉13", traits: ["模仿(模仿简单声音)"], source: "standard", description: "可以模仿声音，在社交和侦察场景中有独特用途。" },
  { name: "蜥蜴", type: "微型野兽", size: "微型", ac: 10, hp: 2, speed: "20尺, 攀爬20尺", abilities: { str: 2, dex: 11, con: 10, int: 1, wis: 8, cha: 3 }, senses: "黑暗视觉30尺, 被动察觉9", traits: [], source: "standard", description: "拥有黑暗视觉和攀爬能力，适合地下侦察。" },
  { name: "毒蛇", type: "微型野兽", size: "微型", ac: 13, hp: 2, speed: "30尺, 游泳30尺", abilities: { str: 2, dex: 16, con: 11, int: 1, wis: 10, cha: 3 }, senses: "盲视10尺, 被动察觉10", traits: [], source: "standard", description: "高AC和盲视。虽然魔宠不能攻击，但其存在本身就有威慑力。" },
  { name: "鼠", type: "微型野兽", size: "微型", ac: 10, hp: 1, speed: "20尺", abilities: { str: 2, dex: 11, con: 9, int: 2, wis: 10, cha: 4 }, senses: "黑暗视觉30尺, 被动察觉10", traits: ["敏锐嗅觉(嗅觉察觉优势)"], source: "standard", description: "最不引人注目的魔宠，可以轻易混入城市环境进行侦察。" },
  { name: "蜘蛛", type: "微型野兽", size: "微型", ac: 12, hp: 1, speed: "20尺, 攀爬20尺", abilities: { str: 2, dex: 14, con: 8, int: 1, wis: 10, cha: 2 }, senses: "黑暗视觉30尺, 被动察觉10", traits: ["蛛行(可在天花板行走)", "蛛网感知(接触蛛网时知晓其中生物位置)"], source: "standard", description: "蛛行让它能在墙壁和天花板上移动，是绝佳的间谍。" },
  { name: "鼬", type: "微型野兽", size: "微型", ac: 13, hp: 1, speed: "30尺", abilities: { str: 3, dex: 16, con: 8, int: 2, wis: 12, cha: 3 }, senses: "被动察觉13", traits: ["敏锐听觉与嗅觉(听觉/嗅觉察觉优势)"], source: "standard", description: "高AC和良好感官。30尺移动速度让它能跟上团队。" },
  { name: "螃蟹", type: "微型野兽", size: "微型", ac: 11, hp: 2, speed: "20尺, 游泳20尺", abilities: { str: 2, dex: 11, con: 10, int: 1, wis: 9, cha: 2 }, senses: "盲视30尺, 被动察觉9", traits: ["两栖(水陆呼吸)"], source: "standard", description: "盲视30尺加两栖，适合水边和地下冒险。" },
  { name: "海马", type: "微型野兽", size: "微型", ac: 11, hp: 1, speed: "0尺, 游泳20尺", abilities: { str: 1, dex: 12, con: 8, int: 1, wis: 10, cha: 2 }, senses: "被动察觉10", traits: ["水中呼吸(只能在水中呼吸)"], source: "standard", description: "只能在水中活动，适合纯水下冒险。" },

  // === 锁链契约魔宠 (邪术师锁链契约) ===
  { name: "小恶魔", type: "微型邪魔", size: "微型", ac: 13, hp: 10, speed: "20尺, 飞行40尺", abilities: { str: 6, dex: 17, con: 13, int: 11, wis: 12, cha: 14 }, senses: "黑暗视觉120尺, 被动察觉11", traits: ["变形术(变为特定野兽形态)", "恶魔视觉(魔法黑暗中的黑暗视觉)", "魔法抗性(对法术豁免优势)", "隐形(自由隐形直到攻击)", "火焰/冷冻/毒素抗性"], source: "chain", description: "最强大的锁链契约选择之一。自由隐形和魔法抗性使其成为顶级侦察兵。" },
  { name: "准龙", type: "微型龙类", size: "微型", ac: 13, hp: 7, speed: "15尺, 飞行60尺", abilities: { str: 6, dex: 15, con: 13, int: 10, wis: 12, cha: 10 }, senses: "盲视10尺, 黑暗视觉60尺, 被动察觉13", traits: ["敏锐感官(察觉优势)", "魔法抗性(对法术豁免优势)", "有限心灵感应(100尺)"], source: "chain", description: "拥有心灵感应和魔法抗性，可与主人在100尺内心灵沟通。60尺飞行速度非常灵活。" },
  { name: "夸赛特", type: "微型邪魔", size: "微型", ac: 13, hp: 7, speed: "40尺", abilities: { str: 5, dex: 17, con: 10, int: 7, wis: 10, cha: 10 }, senses: "黑暗视觉120尺, 被动察觉10", traits: ["变形术(变为蝙蝠/蟾蜍)", "魔法抗性(对法术豁免优势)", "隐形(自由隐形直到攻击)", "毒素/冷冻/火焰/闪电抗性"], source: "chain", description: "类似小恶魔但更快的地面速度。变形能力提供灵活伪装。" },
  { name: "妖精", type: "微型精类", size: "微型", ac: 15, hp: 2, speed: "10尺, 飞行40尺", abilities: { str: 3, dex: 18, con: 10, int: 14, wis: 13, cha: 11 }, senses: "被动察觉13", traits: ["隐形(自由隐形直到攻击/施法)", "心灵之眼(通过触碰知晓生物阵营)"], source: "chain", description: "最高AC的魔宠选择。可以侦测阵营，是社交场景中的隐形顾问。" },
];

export function getStandardFamiliars(): FamiliarStat[] {
  return FAMILIARS.filter((f) => f.source === "standard");
}

export function getChainFamiliars(): FamiliarStat[] {
  return FAMILIARS.filter((f) => f.source === "chain");
}

export function getFamiliar(name: string): FamiliarStat | undefined {
  return FAMILIARS.find((f) => f.name === name);
}

export function canHaveFamiliar(
  knownSpells: string[],
  className: string | null,
  features: string[]
): { eligible: boolean; chainPact: boolean; reason: string } {
  const hasFindFamiliar = knownSpells.includes("寻获魔宠");
  const isChainPact =
    className === "邪术师" && features.some((f) => f.includes("锁链契约"));

  if (isChainPact) {
    return {
      eligible: true,
      chainPact: true,
      reason: "邪术师锁链契约可以召唤增强魔宠（含特殊形态）",
    };
  }
  if (hasFindFamiliar) {
    return {
      eligible: true,
      chainPact: false,
      reason: "已习得「寻获魔宠」法术",
    };
  }

  return { eligible: false, chainPact: false, reason: "" };
}
