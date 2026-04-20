import { NextRequest } from "next/server";
import { getLLM, CHAT_MODEL } from "@/lib/llm/client";
import {
  retrieveRulebookChunks,
  retrieveCampaignChunks,
} from "@/lib/rag/retriever";
import {
  buildRulesQAPrompt,
  buildCharacterHelperPrompt,
  formatCampaignContext,
  formatRulebookContext,
} from "@/lib/rag/prompts";
import type { ChatMessage } from "@/types/chat";

export const runtime = "nodejs";
export const maxDuration = 120;

interface Body {
  message: string;
  history?: ChatMessage[];
  rulebook_ids?: string[];
  campaign_ids?: string[];
  mode?: "rules_qa" | "character_helper";
  character_context?: {
    current_step?: string;
    selected_so_far?: string;
  };
  draft_json?: string;
  top_k?: number;
}

const CHARACTER_UPDATE_OPEN = "<CHARACTER_UPDATE>";
const CHARACTER_UPDATE_CLOSE = "</CHARACTER_UPDATE>";

function analyzeIncompleteFields(draftJson: string): string {
  try {
    const d = JSON.parse(draftJson);
    const missing: string[] = [];

    if (!d.name) missing.push("- 角色名 (name): 未填写");
    if (!d.race) missing.push("- 种族 (race): 未选择");
    if (!d.subrace && d.race) missing.push("- 亚种 (subrace): 未选择（如果该种族有亚种）");
    if (!d.class) missing.push("- 职业 (class): 未选择");
    if (!d.subclass) missing.push("- 子职业 (subclass): 未选择");
    if (!d.background) missing.push("- 背景 (background): 未选择");
    if (!d.alignment) missing.push("- 阵营 (alignment): 未选择");
    if (!d.gender) missing.push("- 性别 (gender): 未填写");

    const defaultScores = [10, 10, 10, 10, 10, 10];
    const current = d.ability_scores;
    if (current && Object.values(current).join(",") === defaultScores.join(",")) {
      missing.push("- 属性值 (ability_scores): 仍为默认值 10/10/10/10/10/10，需要分配");
    }

    if (!d.weapons || d.weapons.length === 0) missing.push("- 武器 (weapons): 未选择");
    if (!d.armor) missing.push("- 护甲 (armor): 未选择");

    const isCaster = d.spellcastingAbility;
    if (isCaster) {
      if ((!d.knownCantrips || d.knownCantrips.length === 0) && (!d.knownSpells || d.knownSpells.length === 0)) {
        missing.push("- 法术: 施法职业但未选择任何法术");
      }
      if (d.knownSpells && d.knownSpells.length > 0 && (!d.preparedSpells || d.preparedSpells.length === 0)) {
        const prepareClasses = ["法师", "牧师", "德鲁伊", "圣武士"];
        if (prepareClasses.includes(d.class || "")) {
          missing.push("- 已准备法术 (preparedSpells): 已知法术但未选择准备法术");
        }
      }
    }

    const hasFindFamiliar = d.knownSpells?.includes("寻获魔宠");
    const isChainPact = d.class === "邪术师" && d.features?.some((f: string) => f.includes("锁链契约"));
    if ((hasFindFamiliar || isChainPact) && !d.familiar) {
      missing.push("- 魔宠 (familiar): 已具备召唤魔宠条件但未选择魔宠");
    }

    if (!d.traits) missing.push("- 性格特质 (traits): 未填写");
    if (!d.ideals) missing.push("- 理想 (ideals): 未填写");
    if (!d.bonds) missing.push("- 羁绊 (bonds): 未填写");
    if (!d.flaws) missing.push("- 缺陷 (flaws): 未填写");

    return missing.length > 0 ? missing.join("\n") : "";
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body;
  const userMessage = (body.message || "").trim();
  if (!userMessage) {
    return new Response(JSON.stringify({ error: "消息为空" }), { status: 400 });
  }

  const topK = body.top_k ?? 3;
  const MAX_HISTORY = 6;
  const mode = body.mode || "rules_qa";

  let retrievedRules;
  let retrievedCampaigns;
  try {
    retrievedRules = await retrieveRulebookChunks(userMessage, {
      rulebookIds: body.rulebook_ids?.length ? body.rulebook_ids : undefined,
      topK,
    });
    retrievedCampaigns = await retrieveCampaignChunks(
      userMessage,
      body.campaign_ids,
      2
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: `检索失败：${msg}` }), {
      status: 500,
    });
  }

  const ruleCtx = formatRulebookContext(retrievedRules);
  const campaignCtx = formatCampaignContext(retrievedCampaigns);

  const incompleteFields = body.draft_json
    ? analyzeIncompleteFields(body.draft_json)
    : "";

  const systemPrompt =
    mode === "character_helper"
      ? buildCharacterHelperPrompt({
          ruleContext: ruleCtx,
          currentStep: body.character_context?.current_step,
          selectedSoFar: body.character_context?.selected_so_far,
          draftJSON: body.draft_json,
          incompleteFields,
        })
      : buildRulesQAPrompt({
          ruleContext: ruleCtx,
          campaignContext: campaignCtx,
        });

  const history = (body.history || [])
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content })) as Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;

  const citationsPayload = retrievedRules.map((c) => ({
    id: c.id,
    rulebook_id: c.rulebook_id,
    rulebook_name: c.rulebook_name,
    chapter: c.chapter,
    page_number: c.page_number,
    content: c.content,
    score: Number(c.score.toFixed(4)),
  }));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          `event: citations\ndata: ${JSON.stringify(citationsPayload)}\n\n`
        )
      );

      try {
        const llm = getLLM();
        const resp = await llm.chat.completions.create({
          model: CHAT_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: userMessage },
          ],
          temperature: 0.3,
          stream: true,
        });

        let fullResponse = "";

        for await (const chunk of resp) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            fullResponse += delta;
            controller.enqueue(
              encoder.encode(
                `event: delta\ndata: ${JSON.stringify({ text: delta })}\n\n`
              )
            );
          }
        }

        if (mode === "character_helper" && body.draft_json) {
          const openIdx = fullResponse.indexOf(CHARACTER_UPDATE_OPEN);
          const closeIdx = fullResponse.indexOf(CHARACTER_UPDATE_CLOSE);
          if (openIdx !== -1 && closeIdx !== -1) {
            const jsonStr = fullResponse.slice(
              openIdx + CHARACTER_UPDATE_OPEN.length,
              closeIdx
            ).trim();
            try {
              const patch = JSON.parse(jsonStr);
              controller.enqueue(
                encoder.encode(
                  `event: character_update\ndata: ${JSON.stringify(patch)}\n\n`
                )
              );
            } catch {
              // JSON parse failed — ignore the patch
            }
          }
        }

        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({ error: msg })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
