export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  classes: string[];
  description: string;
}

export const SPELLS: Spell[] = [
  // ============================================================
  // 戏法 (0环)
  // ============================================================
  { name: "火焰箭", level: 0, school: "塑能", castingTime: "1动作", range: "120尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师", "奇械师"], description: "远程法术攻击，命中造成1d10火焰伤害。" },
  { name: "圣火术", level: 0, school: "塑能", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师"], description: "目标敏捷豁免，失败受1d8光耀伤害。" },
  { name: "毒素喷溅", level: 0, school: "咒法", castingTime: "1动作", range: "10尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师", "奇械师"], description: "体质豁免，失败受1d12毒素伤害。" },
  { name: "法师之手", level: 0, school: "咒法", castingTime: "1动作", range: "30尺", duration: "1分钟", concentration: false, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师", "奇械师"], description: "幽灵之手操纵30尺内物体。" },
  { name: "光亮术", level: 0, school: "塑能", castingTime: "1动作", range: "触及", duration: "1小时", concentration: false, ritual: false, classes: ["吟游诗人", "牧师", "术士", "法师", "奇械师"], description: "物体发出20尺明亮光照+20尺微光。" },
  { name: "次级幻影", level: 0, school: "幻术", castingTime: "1动作", range: "10尺", duration: "1分钟", concentration: false, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师"], description: "创造声音或图像的小型幻象。" },
  { name: "维生术", level: 0, school: "死灵", castingTime: "1动作", range: "触及", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师", "德鲁伊", "奇械师"], description: "稳定濒死生物。" },
  { name: "魔法伎俩", level: 0, school: "变化", castingTime: "1动作", range: "10尺", duration: "至多1小时", concentration: false, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师"], description: "小型魔法效果(清洁/调味/点火等)。" },
  { name: "电爪术", level: 0, school: "塑能", castingTime: "1动作", range: "触及", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师", "奇械师"], description: "近战法术攻击，命中造成1d8闪电伤害。" },
  { name: "恶言相加", level: 0, school: "附魔", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人"], description: "感知豁免，失败1d4心灵伤害+下次攻击劣势。" },
  { name: "德鲁伊伎俩", level: 0, school: "变化", castingTime: "1动作", range: "30尺", duration: "瞬间", concentration: false, ritual: false, classes: ["德鲁伊"], description: "操纵自然元素的小型效果。" },
  { name: "魔能爆", level: 0, school: "塑能", castingTime: "1动作", range: "120尺", duration: "瞬间", concentration: false, ritual: false, classes: ["邪术师"], description: "远程法术攻击，1d10力场伤害。" },
  { name: "寒冷之触", level: 0, school: "死灵", castingTime: "1动作", range: "120尺", duration: "1轮", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师"], description: "远程法术攻击，1d8黯蚀伤害+无法回复HP。" },
  { name: "酸液飞溅", level: 0, school: "咒法", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师", "奇械师"], description: "敏捷豁免，失败1d6强酸伤害,可命中2个相邻目标。" },
  { name: "冻触之刃", level: 0, school: "塑能", castingTime: "1动作", range: "自身(5尺)", duration: "瞬间", concentration: false, ritual: false, classes: ["德鲁伊"], description: "近战法术攻击,1d6冷冻伤害,命中后速度降10尺。" },
  { name: "造水/销水", level: 0, school: "变化", castingTime: "1动作", range: "30尺", duration: "瞬间", concentration: false, ritual: false, classes: ["德鲁伊"], description: "创造或销毁少量水。" },
  { name: "指引术", level: 0, school: "预言", castingTime: "1动作", range: "触及", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["牧师", "德鲁伊", "奇械师"], description: "目标下次属性检定+1d4。" },
  { name: "抵抗术", level: 0, school: "防护", castingTime: "1动作", range: "触及", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["牧师", "德鲁伊"], description: "目标下次豁免+1d4。" },
  { name: "修补术", level: 0, school: "变化", castingTime: "1分钟", range: "触及", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "牧师", "德鲁伊", "术士", "法师", "奇械师"], description: "修复一个微小破损。" },
  { name: "橡棍术", level: 0, school: "变化", castingTime: "1附赠动作", range: "触及", duration: "1分钟", concentration: false, ritual: false, classes: ["德鲁伊"], description: "短棒/长棍变为魔法武器,1d8钝击伤害,用施法属性攻击。" },
  { name: "精神鞭笞", level: 0, school: "附魔", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师"], description: "智力豁免，失败1d6心灵伤害+不能用反应。" },
  { name: "剑刃结界", level: 0, school: "防护", castingTime: "1动作", range: "自身", duration: "1轮", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师"], description: "近战武器攻击,命中额外1d8雷鸣伤害,AC+1。" },
  { name: "神圣之焰", level: 0, school: "塑能", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师"], description: "敏捷豁免,失败1d8光耀伤害,无视掩蔽。" },
  { name: "奇术", level: 0, school: "变化", castingTime: "1动作", range: "30尺", duration: "至多1小时", concentration: false, ritual: false, classes: ["奇械师"], description: "创造微型魔法效果。" },

  // ============================================================
  // 1环
  // ============================================================
  { name: "魔法飞弹", level: 1, school: "塑能", castingTime: "1动作", range: "120尺", duration: "瞬间", concentration: false, ritual: false, classes: ["法师"], description: "3发飞弹，每发1d4+1力场伤害，自动命中。" },
  { name: "治疗伤口", level: 1, school: "塑能", castingTime: "1动作", range: "触及", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "牧师", "德鲁伊", "圣武士", "游侠", "奇械师"], description: "恢复1d8+施法调整值HP。" },
  { name: "护盾术", level: 1, school: "防护", castingTime: "1反应", range: "自身", duration: "1轮", concentration: false, ritual: false, classes: ["法师", "术士"], description: "AC+5直到下一回合开始。" },
  { name: "雷鸣波", level: 1, school: "塑能", castingTime: "1动作", range: "自身(15尺)", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "德鲁伊", "术士", "邪术师", "法师"], description: "体质豁免，失败2d8雷鸣伤害+推10尺。" },
  { name: "燃烧之手", level: 1, school: "塑能", castingTime: "1动作", range: "自身(15尺锥)", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师"], description: "敏捷豁免，失败3d6火焰伤害。" },
  { name: "侦测魔法", level: 1, school: "预言", castingTime: "1动作", range: "自身", duration: "专注,至多10分钟", concentration: true, ritual: true, classes: ["吟游诗人", "牧师", "德鲁伊", "圣武士", "游侠", "术士", "邪术师", "法师"], description: "30尺内感知魔法存在。" },
  { name: "法师护甲", level: 1, school: "防护", castingTime: "1动作", range: "触及", duration: "8小时", concentration: false, ritual: false, classes: ["术士", "法师"], description: "基础AC变为13+敏捷调整值。" },
  { name: "祝福术", level: 1, school: "附魔", castingTime: "1动作", range: "30尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["牧师", "圣武士"], description: "至多3个目标攻击骰和豁免+1d4。" },
  { name: "易容术", level: 1, school: "幻术", castingTime: "1动作", range: "自身", duration: "1小时", concentration: false, ritual: false, classes: ["吟游诗人", "术士", "法师"], description: "改变外貌。" },
  { name: "猎人印记", level: 1, school: "预言", castingTime: "1附赠动作", range: "90尺", duration: "专注,至多1小时", concentration: true, ritual: false, classes: ["游侠"], description: "对标记目标额外1d6伤害。" },
  { name: "命令术", level: 1, school: "附魔", castingTime: "1动作", range: "60尺", duration: "1轮", concentration: false, ritual: false, classes: ["牧师", "圣武士"], description: "感知豁免,失败必须执行一个单词命令。" },
  { name: "疗伤之词", level: 1, school: "塑能", castingTime: "1附赠动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "牧师", "德鲁伊"], description: "恢复1d4+施法调整值HP(远距)。" },
  { name: "油脂术", level: 1, school: "咒法", castingTime: "1动作", range: "60尺", duration: "1分钟", concentration: false, ritual: false, classes: ["法师", "奇械师"], description: "10尺范围地面变滑,敏捷豁免否则俯卧。" },
  { name: "纠缠术", level: 1, school: "咒法", castingTime: "1动作", range: "90尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["德鲁伊"], description: "20尺范围困难地形,力量豁免否则被束缚。" },
  { name: "魅惑人类", level: 1, school: "附魔", castingTime: "1动作", range: "30尺", duration: "1小时", concentration: false, ritual: false, classes: ["吟游诗人", "德鲁伊", "术士", "邪术师", "法师"], description: "感知豁免,失败则目标视你为友好。" },
  { name: "沉睡术", level: 1, school: "附魔", castingTime: "1动作", range: "90尺", duration: "1分钟", concentration: false, ritual: false, classes: ["吟游诗人", "术士", "法师"], description: "5d8HP的生物陷入沉睡(从低HP开始)。" },
  { name: "识破善恶", level: 1, school: "预言", castingTime: "1动作", range: "自身", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["牧师", "圣武士"], description: "感知30尺内天界/邪魔/不死/精类/元素。" },
  { name: "灵魂圣武", level: 1, school: "塑能", castingTime: "1附赠动作", range: "自身", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["圣武士"], description: "武器额外造成1d4光耀伤害。" },
  { name: "善恶防护", level: 1, school: "防护", castingTime: "1动作", range: "触及", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["牧师", "圣武士", "邪术师", "法师"], description: "防护特定生物类型的攻击优势和魅惑/恐惧。" },
  { name: "造风术", level: 1, school: "塑能", castingTime: "1动作", range: "60尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["德鲁伊", "游侠"], description: "创造强风区域。" },
  { name: "变色自我", level: 1, school: "幻术", castingTime: "1动作", range: "自身", duration: "专注,至多1小时", concentration: true, ritual: false, classes: ["吟游诗人", "术士", "法师"], description: "隐形,攻击/施法后结束。" },
  { name: "毒雾术", level: 1, school: "咒法", castingTime: "1动作", range: "90尺", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["术士", "法师"], description: "20尺球形毒雾,严重遮蔽。" },
  { name: "妖火", level: 1, school: "塑能", castingTime: "1动作", range: "60尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["吟游诗人", "德鲁伊"], description: "目标发光,对其攻击获得优势。" },
  { name: "神导术", level: 1, school: "预言", castingTime: "1反应", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师"], description: "目标攻击/检定/豁免+2d4或-2d4。" },
  { name: "巫术飞弹", level: 1, school: "塑能", castingTime: "1动作", range: "30尺", duration: "瞬间", concentration: false, ritual: false, classes: ["邪术师"], description: "远程法术攻击,2d6+魅力力场伤害。" },
  { name: "造物术", level: 1, school: "咒法", castingTime: "1分钟", range: "10尺", duration: "瞬间", concentration: false, ritual: true, classes: ["法师"], description: "从虚空中造出一件非魔法物品。" },
  { name: "寻获魔宠", level: 1, school: "咒法", castingTime: "1小时", range: "10尺", duration: "瞬间", concentration: false, ritual: true, classes: ["法师"], description: "召唤一个精类、邪魔或天界灵体作为魔宠。魔宠可以是蝙蝠、猫、螃蟹、蛙、鹰、蜥蜴、章鱼、猫头鹰、毒蛇、鱼、鼠、乌鸦、海马、蜘蛛或鼬。魔宠独立行动但始终服从你的命令，战斗中有自己的先攻。它不能攻击，但可以使用其他动作。你可以通过魔宠的感官感知，并在100尺内与其心灵感应。作为动作你可以暂时解散魔宠到一个口袋维度，再次施法可在30尺内重新召唤。你可以通过魔宠传递触及法术。" },

  // ============================================================
  // 2环
  // ============================================================
  { name: "灼热射线", level: 2, school: "塑能", castingTime: "1动作", range: "120尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师"], description: "3道射线各2d6火焰伤害。" },
  { name: "迷踪步", level: 2, school: "咒法", castingTime: "1附赠动作", range: "自身", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师"], description: "传送30尺到可见空位。" },
  { name: "次级复原术", level: 2, school: "防护", castingTime: "1动作", range: "触及", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "牧师", "德鲁伊", "圣武士", "游侠"], description: "结束一种疾病或状态。" },
  { name: "灵体武器", level: 2, school: "塑能", castingTime: "1附赠动作", range: "60尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["牧师"], description: "浮空武器攻击,1d8+施法属性力场伤害。" },
  { name: "定身术", level: 2, school: "附魔", castingTime: "1动作", range: "60尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["吟游诗人", "牧师", "德鲁伊", "术士", "邪术师", "法师"], description: "感知豁免,失败则类人目标被麻痹。" },
  { name: "隐形术", level: 2, school: "幻术", castingTime: "1动作", range: "触及", duration: "专注,至多1小时", concentration: true, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师", "奇械师"], description: "目标隐形,攻击/施法后结束。" },
  { name: "黑暗术", level: 2, school: "塑能", castingTime: "1动作", range: "60尺", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["术士", "邪术师", "法师"], description: "15尺球体魔法黑暗。" },
  { name: "蛛网术", level: 2, school: "咒法", castingTime: "1动作", range: "60尺", duration: "专注,至多1小时", concentration: true, ritual: false, classes: ["术士", "法师", "奇械师"], description: "20尺立方蛛网，困难地形+被束缚。" },
  { name: "月光术", level: 2, school: "塑能", castingTime: "1动作", range: "120尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["德鲁伊"], description: "5尺圆柱月光,体质豁免,失败2d10光耀伤害。" },
  { name: "援助术", level: 2, school: "防护", castingTime: "1动作", range: "30尺", duration: "8小时", concentration: false, ritual: false, classes: ["牧师", "圣武士", "奇械师"], description: "至多3个目标HP上限和当前HP+5。" },
  { name: "沉默术", level: 2, school: "幻术", castingTime: "1动作", range: "120尺", duration: "专注,至多10分钟", concentration: true, ritual: true, classes: ["吟游诗人", "牧师", "游侠"], description: "20尺球体内无声,无法施放需要言语成分的法术。" },
  { name: "锐耳术/鹰眼术", level: 2, school: "变化", castingTime: "1动作", range: "触及", duration: "专注,至多1小时", concentration: true, ritual: false, classes: ["吟游诗人", "德鲁伊", "游侠", "术士", "法师", "奇械师"], description: "目标获得察觉检定优势。" },
  { name: "击碎术", level: 2, school: "塑能", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师"], description: "10尺球体,体质豁免,失败3d8雷鸣伤害。" },
  { name: "灵魂圣刃", level: 2, school: "塑能", castingTime: "1附赠动作", range: "自身", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["圣武士"], description: "武器额外造成2d8光耀伤害。" },
  { name: "热金属", level: 2, school: "变化", castingTime: "1动作", range: "60尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["吟游诗人", "德鲁伊", "奇械师"], description: "金属物品炽热,持有者受2d8火焰伤害。" },
  { name: "防护毒素", level: 2, school: "防护", castingTime: "1动作", range: "触及", duration: "1小时", concentration: false, ritual: false, classes: ["牧师", "德鲁伊", "圣武士", "游侠", "奇械师"], description: "毒素抗性+毒素豁免优势。" },
  { name: "荆棘丛生", level: 2, school: "变化", castingTime: "1动作", range: "150尺", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["德鲁伊", "游侠"], description: "20尺半径困难地形+穿越受2d4穿刺伤害。" },
  { name: "镜影术", level: 2, school: "幻术", castingTime: "1动作", range: "自身", duration: "1分钟", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师"], description: "创造3个幻影分身,可替你承受攻击。" },
  { name: "魔嘴", level: 2, school: "幻术", castingTime: "1分钟", range: "30尺", duration: "直至解除", concentration: false, ritual: true, classes: ["吟游诗人", "法师"], description: "在物体上嵌入信息,触发条件时播放。" },
  { name: "朦胧术", level: 2, school: "幻术", castingTime: "1动作", range: "自身", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["术士", "邪术师", "法师"], description: "身体模糊,对你的攻击骰劣势。" },

  // ============================================================
  // 3环
  // ============================================================
  { name: "火球术", level: 3, school: "塑能", castingTime: "1动作", range: "150尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师"], description: "20尺球体,敏捷豁免,失败8d6火焰伤害。" },
  { name: "闪电束", level: 3, school: "塑能", castingTime: "1动作", range: "自身(100尺线)", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "法师"], description: "100尺线,敏捷豁免,失败8d6闪电伤害。" },
  { name: "飞行术", level: 3, school: "变化", castingTime: "1动作", range: "触及", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["术士", "邪术师", "法师", "奇械师"], description: "获得60尺飞行速度。" },
  { name: "反制法术", level: 3, school: "防护", castingTime: "1反应", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["术士", "邪术师", "法师"], description: "打断3环及以下法术,高环需检定。" },
  { name: "解除魔法", level: 3, school: "防护", castingTime: "1动作", range: "120尺", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "牧师", "德鲁伊", "圣武士", "术士", "邪术师", "法师", "奇械师"], description: "结束目标上一个3环及以下魔法效果。" },
  { name: "加速术", level: 3, school: "变化", castingTime: "1动作", range: "30尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["术士", "法师", "奇械师"], description: "目标速度翻倍,AC+2,敏捷豁免优势,额外动作。" },
  { name: "缓慢术", level: 3, school: "变化", castingTime: "1动作", range: "120尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["术士", "法师"], description: "至多6个目标速度减半,AC-2,无反应。" },
  { name: "群体治疗伤口", level: 3, school: "塑能", castingTime: "1动作", range: "60尺", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师", "德鲁伊"], description: "至多6个目标各恢复3d8+施法调整值HP。" },
  { name: "复生术", level: 3, school: "死灵", castingTime: "1动作", range: "触及", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师", "圣武士"], description: "死亡不超过1分钟的生物复活,恢复1HP。" },
  { name: "召唤闪电", level: 3, school: "咒法", castingTime: "1动作", range: "120尺", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["德鲁伊"], description: "每轮在一点召唤闪电,敏捷豁免,失败3d10闪电伤害。" },
  { name: "防护能量", level: 3, school: "防护", castingTime: "1动作", range: "触及", duration: "专注,至多1小时", concentration: true, ritual: false, classes: ["牧师", "德鲁伊", "术士", "游侠", "法师", "奇械师"], description: "目标获得一种伤害类型的抗性。" },
  { name: "恐惧术", level: 3, school: "幻术", castingTime: "1动作", range: "自身(30尺锥)", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师"], description: "感知豁免,失败则恐惧并丢弃手持物品。" },
  { name: "臭云术", level: 3, school: "咒法", castingTime: "1动作", range: "90尺", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["术士", "法师"], description: "20尺球体,体质豁免,失败则该轮无法行动。" },
  { name: "高等隐形术", level: 3, school: "幻术", castingTime: "1动作", range: "触及", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["吟游诗人", "术士", "邪术师", "法师"], description: "目标隐形,攻击/施法后不会结束。" },
  { name: "魅惑怪物", level: 3, school: "附魔", castingTime: "1动作", range: "30尺", duration: "1小时", concentration: false, ritual: false, classes: ["吟游诗人", "德鲁伊", "术士", "邪术师", "法师"], description: "感知豁免,失败则目标视你为友好。" },
  { name: "植物滋长", level: 3, school: "变化", castingTime: "1动作/8小时", range: "150尺", duration: "瞬间", concentration: false, ritual: false, classes: ["吟游诗人", "德鲁伊", "游侠"], description: "100尺半径植物疯长,4倍困难地形。" },
  { name: "水下呼吸", level: 3, school: "变化", castingTime: "1动作", range: "30尺", duration: "24小时", concentration: false, ritual: true, classes: ["德鲁伊", "游侠", "术士", "法师"], description: "至多10个目标可水下呼吸。" },
  { name: "灵体守卫", level: 3, school: "咒法", castingTime: "1动作", range: "自身(15尺)", duration: "专注,至多10分钟", concentration: true, ritual: false, classes: ["牧师"], description: "灵体绕身旋转,进入区域的敌人受3d8光耀/黯蚀伤害。" },
  { name: "吸血鬼之触", level: 3, school: "死灵", castingTime: "1动作", range: "自身", duration: "专注,至多1分钟", concentration: true, ritual: false, classes: ["邪术师", "法师"], description: "近战法术攻击,3d6黯蚀伤害,恢复伤害一半的HP。" },
  { name: "通晓语言", level: 3, school: "预言", castingTime: "1动作", range: "自身", duration: "1小时", concentration: false, ritual: true, classes: ["吟游诗人", "术士", "邪术师", "法师"], description: "理解任何口头语言。" },
  { name: "死灵仆从", level: 3, school: "死灵", castingTime: "1分钟", range: "10尺", duration: "瞬间", concentration: false, ritual: false, classes: ["牧师", "邪术师", "法师"], description: "复活骸骨/僵尸作为仆从。" },
];

export function getSpellsByClass(className: string): Spell[] {
  return SPELLS.filter((s) => s.classes.includes(className));
}

export function getSpellsByLevel(level: number): Spell[] {
  return SPELLS.filter((s) => s.level === level);
}

export const SPELL_SCHOOLS = ["防护", "咒法", "预言", "附魔", "塑能", "幻术", "死灵", "变化"] as const;
