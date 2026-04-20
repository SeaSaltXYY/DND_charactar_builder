import { NextResponse } from "next/server";
import {
  createRulebook,
  insertChunks,
  updateRulebookStatus,
} from "@/lib/db/queries";
import { chunkDocument } from "@/lib/rag/chunker";
import { embedTexts } from "@/lib/rag/embeddings";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * 载入"内置 5e 全书"的占位实现：
 *
 *   - 理想情况下抓取 https://chm.kagangtuya.top 的 5e 全书
 *   - 但抓取需要处理站点结构/反爬/CHM 解码，属于 P1/P2 任务
 *   - 这里提供一个"示例规则片段"样本，确保系统可用；
 *     用户可以先用这个示例验证 RAG 管线，再手动上传完整规则书。
 */
export async function POST() {
  const sample = `# 第1章 人物创建

D&D 的每个角色都是一个独一无二的组合：种族、职业、背景、属性值，再加上你的创意。
创建角色时遵循以下步骤：

1. 选择一个种族
2. 选择一个职业
3. 决定属性值
4. 描述你的角色（背景、理想、牵绊、缺陷）
5. 选择你的装备
6. 成为你的小队的一员

# 第2章 种族

## 人类
**属性加值**：所有属性 +1
**体型**：中型
**速度**：30 尺
**语言**：通用语和一种额外语言

## 精灵
**属性加值**：敏捷 +2
**体型**：中型
**速度**：30 尺
**黑暗视觉**：60 尺
**敏锐感官**：察觉技能擅长

## 矮人
**属性加值**：体质 +2
**体型**：中型
**速度**：25 尺
**黑暗视觉**：60 尺
**矮人韧性**：豁免检定对抗毒素有优势，且对毒素伤害有抗性

# 第3章 职业

## 战士 (Fighter)
**生命骰**：每战士等级 d10
**擅长**：所有盔甲、盾牌、简单/军用武器
**豁免**：力量、体质
**技能**：从战士列表中选两项
**1 级特性**：
- **战斗风格**：选一个战斗风格
- **二度进发**：短休后回复一次用所有生命骰的数量

## 法师 (Wizard)
**生命骰**：每法师等级 d6
**擅长**：匕首、飞镖、弹弓、短杖、轻弩
**豁免**：智力、感知
**技能**：从法师列表中选两项
**1 级特性**：
- **施法**：使用法术书施法，智力为关键属性
- **奥术回复**：短休时恢复等于法师等级一半（向上取整）的法术位

# 第4章 属性值

## 属性生成方法

### 标准阵列
直接分配以下六个数值到六项属性：**15, 14, 13, 12, 10, 8**

### 点数购买（27 点）
所有属性初始为 8，用 27 点购买提升：
- 8 → 0 点
- 9 → 1 点
- 10 → 2 点
- 11 → 3 点
- 12 → 4 点
- 13 → 5 点
- 14 → 7 点
- 15 → 9 点
最高买到 15，种族加值另算。

### 投骰（4d6 取三高）
投 4d6 取三个最大的相加，得到 6 个数值，按任意顺序分配到六项属性。

## 属性调整值
属性值 10/11 = 0； 每 2 点变化 1 调整值。
例如：14 = +2, 16 = +3, 18 = +4, 20 = +5；8 = -1，6 = -2。

# 第5章 背景

## 侍僧 (Acolyte)
**技能擅长**：洞悉、宗教
**语言**：两种额外
**装备**：圣徽、祷告书、5 支熏香、法衣、普通服装、15 gp
**特性：圣殿庇护**：你可以在同信仰圣殿获得免费住宿与照料。

## 罪犯 (Criminal)
**技能擅长**：欺瞒、隐匿
**工具擅长**：一种游戏组、盗贼工具
**装备**：撬棍、深色普通服装（带兜帽）、15 gp
**特性：罪犯关系网**：你在犯罪界有一个可靠的联络人。

# 第6章 装备

## 武器
- **长剑**：1d8 劈砍，多用 1d10，15 gp，3 磅，多用
- **短弓**：1d6 穿刺，25 gp，2 磅，弹药（80/320），双手
- **战斧**：1d8 劈砍，多用 1d10，10 gp，4 磅，多用

## 盔甲
- **皮甲**：AC 11+敏捷，10 gp，10 磅
- **链甲**：AC 16，隐匿劣势，力量 13，75 gp，55 磅
- **板甲**：AC 18，隐匿劣势，力量 15，1500 gp，65 磅

# 第7章 法术

## 戏法（0 级）
### 火花 (Fire Bolt)
法师戏法 · 施法时间：1 动作 · 距离：120 尺 · 持续：瞬间
对目标进行远程法术攻击，命中造成 1d10 火焰伤害。

### 魔法飞弹 (Magic Missile) — 1 级塑能
法师 1 级 · 施法时间：1 动作 · 距离：120 尺
创造 3 发飞弹，每发对目标造成 1d4+1 力场伤害。

### 治疗伤口 (Cure Wounds) — 1 级塑能
牧师 1 级 · 施法时间：1 动作 · 距离：触及
目标生物恢复 1d8+施法属性调整值 的生命值。

# 第8章 技能与擅长

5e 共 18 项技能，分别基于六项属性：
- **力量**：运动
- **敏捷**：特技、巧手、隐匿
- **智力**：奥秘、历史、调查、自然、宗教
- **感知**：驯兽、洞悉、医疗、察觉、生存
- **魅力**：欺瞒、威吓、表演、说服

技能检定 = d20 + 属性调整值 + 擅长加值（如果擅长）

# 第9章 裁决与常见规则

## 优势与劣势
投两颗 d20 取高（优势）或取低（劣势）。
优势+劣势互相抵消，无论触发几次都只当作普通投骰。

## 暴击
在攻击骰上掷出自然 20 时，伤害骰翻倍投（不包括调整值）。

## 死亡豁免
生命值归 0 但未即死时，每回合开始投 d20：
- 10+：成功
- 9-：失败
- 自然 20：立即恢复 1 HP
- 自然 1：2 次失败

3 次成功 → 稳定；3 次失败 → 死亡。
`;

  const book = createRulebook("内置示例 · 5e 规则速查", "builtin");
  try {
    const chunks = chunkDocument(sample, { chunkSize: 1000, overlap: 120 });
    const embeddings = await embedTexts(chunks.map((c) => c.content));
    insertChunks(
      chunks.map((c, i) => ({
        rulebook_id: book.id,
        content: c.content,
        chapter: c.chapter,
        page_number: c.page_number,
        embedding: embeddings[i],
        metadata: { source: "builtin-sample" },
      }))
    );
    updateRulebookStatus(book.id, "ready", chunks.length);
    return NextResponse.json({ rulebook: book, chunk_count: chunks.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    updateRulebookStatus(book.id, "error");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
