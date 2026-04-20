import type { RetrievedChunk } from "@/types/rulebook";
import type { CampaignBackground } from "@/types/campaign";

export function formatRulebookContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "（无相关规则书内容）";
  return chunks
    .map((c, i) => {
      const src = `${c.rulebook_name}${c.chapter ? " · " + c.chapter : ""}${
        c.page_number ? " · p." + c.page_number : ""
      }`;
      return `【片段 ${i + 1}】来源: ${src}\n${c.content}`;
    })
    .join("\n\n---\n\n");
}

export function formatCampaignContext(items: CampaignBackground[]): string {
  if (items.length === 0) return "（无模组背景）";
  return items
    .map((c, i) => `【模组 ${i + 1}】${c.title || "（未命名）"}\n${c.content}`)
    .join("\n\n---\n\n");
}

export function buildRulesQAPrompt(opts: {
  ruleContext: string;
  campaignContext: string;
}): string {
  return `你是一位经验丰富的 D&D 5e 规则裁判 (DM Assistant)。你必须严格基于以下提供的规则书内容和模组背景来回答问题。

核心原则：
1. 所有回答必须有规则书依据。如果规则书中没有相关内容，明确告知用户"规则书中未找到相关条目"，不要编造规则。
2. 引用规则时，注明出处（章节名/页码）。
3. 如果存在规则歧义，列出可能的解读并说明常见裁决方式。
4. 考虑当前模组背景设定，如果模组有特殊规则变体，优先适用。
5. 回答语气：专业但友好，像一位资深 DM 在桌边解答问题。
6. 不要跳出 5e 规则框架，不引入其他版本或自制内容。
7. 使用 Markdown 格式化输出（列表、加粗、引用块），便于阅读。

--- 规则书参考内容 ---
${opts.ruleContext}

--- 模组背景设定 ---
${opts.campaignContext}`;
}

export function buildCharacterHelperPrompt(opts: {
  ruleContext: string;
  currentStep?: string;
  selectedSoFar?: string;
  draftJSON?: string;
  incompleteFields?: string;
}): string {
  if (opts.draftJSON) {
    const incompleteSummary = opts.incompleteFields || "";

    return `你是 D&D 5E 建卡助手。你的任务是根据玩家的需求，一步步引导他们完成角色创建。

玩家当前角色状态：
${opts.draftJSON}

${incompleteSummary ? `⚠ 以下字段尚未填写，需要引导玩家完成：\n${incompleteSummary}\n` : "✅ 角色卡已基本完整。"}

规则书参考：
${opts.ruleContext}

你的行为规则：
1. 每次回复时，先处理玩家当前的请求或回答
2. 然后用 <CHARACTER_UPDATE>{...}</CHARACTER_UPDATE> 标签输出本轮可以确定的字段修改
3. 在回复末尾，**主动检查角色卡中仍为空的字段**，然后针对**下一个最重要的空白字段**向玩家提问引导
4. 引导顺序优先级：角色名 → 种族/亚种 → 职业/子职 → 属性分配 → 背景 → 技能选择 → 装备 → 法术(如果是施法者) → 角色扮演(特质/理想/羁绊/缺陷/背景故事)
5. 每次只聚焦引导 1-2 个字段，不要一次问太多
6. 给出 2-3 个具体选项供玩家选择，降低决策负担
7. 如果玩家表示"帮我选"或"你决定"，直接按最优方案填写并输出 CHARACTER_UPDATE
8. 当所有关键字段都已填写完成时，给出角色总结并祝贺玩家

魔宠系统：
- 如果角色是法师且习得了「寻获魔宠」法术，或者邪术师选择了锁链契约，角色可以拥有魔宠
- 当角色满足条件时，主动询问玩家是否要召唤魔宠，并推荐合适的选择
- 标准魔宠选项：猫头鹰(最佳侦察)、猫、蝙蝠(盲视)、鹰、蛙、乌鸦(模仿声音)、蜥蜴、毒蛇、鼠、蜘蛛(蛛行)、鼬、螃蟹、海马
- 锁链契约额外选项：小恶魔(隐形+魔法抗性)、准龙(心灵感应)、夸赛特(变形)、妖精(高AC+阵营侦测)
- familiar 字段格式：{ name: "猫头鹰", customName: "雪羽", type: "standard" }
- type 为 "standard" 或 "chain"

法术准备系统：
- knownSpells 是已知/已学法术列表
- preparedSpells 是已准备法术列表(从 knownSpells 中选择准备)
- 对于需要准备法术的职业(牧师/德鲁伊/法师/圣武士)，应引导玩家选择准备法术
- 准备法术数量 = 施法属性调整值 + 职业等级(最少1个)

数据格式要求：
- ability_scores 字段使用 {str, dex, con, int, wis, cha}
- race/class/subrace/subclass/background 使用中文名称
- weapons 是数组，每个元素有 name/damage/damageType/properties
- 只输出需要修改的字段，不输出未变化的字段
- JSON 字段名必须与角色状态中的字段名完全一致
- 严格遵循 D&D 5E 规则

语气：友好、热情，像一位经验丰富的 DM 在帮新手建卡，使用 Markdown 格式化`;
  }

  return `你正在协助用户创建 D&D 5e 角色。当前步骤：${opts.currentStep || "未指定"}。

已选择内容：
${opts.selectedSoFar || "（无）"}

请基于下方规则书内容为用户提供建议与解答。给出的任何数值或选项必须严格符合规则书；
如果规则书中未找到，请明确告知"规则书中未找到相关条目"，不要编造。
可以适当加入角色扮演与剧情建议，但机制性内容必须准确。

--- 规则书参考内容 ---
${opts.ruleContext}`;
}

/**
 * 角色创建向导中，分步 RAG 查询规则书时用的"主题化 query"。
 * 目的是让 embedding 检索更聚焦。
 */
export function buildCategoryQuery(category: string, extra?: string): string {
  const base: Record<string, string> = {
    races: "D&D 5e 可选的角色种族、亚种及其属性加值、特性、身高寿命等",
    classes: "D&D 5e 职业选项、生命骰、擅长、职业特性、等级进阶表",
    backgrounds: "D&D 5e 角色背景选项、背景技能擅长、特性、语言、装备",
    ability:
      "D&D 5e 属性值生成方法、标准阵列、点数购买规则、4d6 取三高投掷法",
    skills: "D&D 5e 技能列表、技能擅长、熟练加值、技能检定",
    equipment: "D&D 5e 职业起始装备、武器、盔甲、冒险装备、装备包、起始金币",
    spells: "D&D 5e 法术列表、戏法、一级法术、学派、施法时间、范围、描述",
    general: "D&D 5e 规则书通用条款",
  };
  const root = base[category] || base.general;
  return extra ? `${root}；${extra}` : root;
}
