"use client";
import { PixelCard } from "../ui/PixelCard";
import { PixelBadge } from "../ui/PixelBadge";
import type { CharacterDraft } from "@/types/character";
import {
  abilityModifier,
  proficiencyBonusForLevel,
} from "@/lib/dice";
import { computeTotalAbilities } from "@/lib/character-calc";
import { ABILITY_LABELS } from "@/data/constants";

interface Props {
  draft: CharacterDraft;
}

export function CharacterSheet({ draft }: Props) {
  const prof = proficiencyBonusForLevel(draft.level);
  const totals = computeTotalAbilities(draft);

  return (
    <PixelCard variant="parchment">
      <div className="space-y-4 text-text-dark">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b-4 border-[#8b6a3e] pb-3">
          <div>
            <div className="font-pixel-title text-pixel-lg">
              {draft.name || "（未命名）"}
            </div>
            <div className="mt-1 text-sm">
              {draft.race || "?"}
              {draft.subrace ? ` · ${draft.subrace}` : ""} ·{" "}
              {draft.class || "?"}
              {draft.subclass ? ` (${draft.subclass})` : ""} · Lv {draft.level}
            </div>
            {(draft.multiclass1 || draft.multiclass2) && (
              <div className="text-xs text-amber-800">
                兼职: {draft.multiclass1}{draft.multiclass1Sub ? ` (${draft.multiclass1Sub})` : ""}
                {draft.multiclass2 && ` / ${draft.multiclass2}${draft.multiclass2Sub ? ` (${draft.multiclass2Sub})` : ""}`}
              </div>
            )}
            <div className="text-sm">
              背景：{draft.background || "—"} · 阵营：{draft.alignment || "—"}
            </div>
            {(draft.gender || draft.age) && (
              <div className="text-xs text-amber-700">
                {draft.gender && `性别: ${draft.gender}`}
                {draft.age && ` · 年龄: ${draft.age}`}
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <PixelBadge color="red">HP {draft.hp}/{draft.maxHp}</PixelBadge>
            <PixelBadge color="blue">AC {draft.ac}</PixelBadge>
            <PixelBadge color="gold">熟练 +{prof}</PixelBadge>
            <PixelBadge color="green">先攻 {draft.initiative >= 0 ? "+" : ""}{draft.initiative}</PixelBadge>
          </div>
        </div>

        {/* Abilities */}
        <div>
          <div className="mb-2 font-silk font-bold">六项属性</div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {(["str", "dex", "con", "int", "wis", "cha"] as const).map((k) => {
              const v = totals[k];
              const m = abilityModifier(v);
              return (
                <div
                  key={k}
                  className="border-4 border-[#8b6a3e] bg-[#e8c89a] p-2 text-center"
                >
                  <div className="font-silk text-xs">{ABILITY_LABELS[k]}</div>
                  <div className="font-pixel-title text-lg">{v}</div>
                  <div className="font-silk text-xs">
                    {m >= 0 ? "+" : ""}{m}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Combat stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-[#e8c89a] border-2 border-[#8b6a3e] p-1">
            <div className="font-silk">速度</div>
            <div className="font-bold">{draft.speed}尺</div>
          </div>
          <div className="bg-[#e8c89a] border-2 border-[#8b6a3e] p-1">
            <div className="font-silk">生命骰</div>
            <div className="font-bold">{draft.hitDice || "—"}</div>
          </div>
          <div className="bg-[#e8c89a] border-2 border-[#8b6a3e] p-1">
            <div className="font-silk">体型</div>
            <div className="font-bold">{draft.size}</div>
          </div>
          <div className="bg-[#e8c89a] border-2 border-[#8b6a3e] p-1">
            <div className="font-silk">临时HP</div>
            <div className="font-bold">{draft.tempHp}</div>
          </div>
        </div>

        {/* Skills */}
        {draft.skills.length > 0 && (
          <div>
            <div className="mb-1 font-silk font-bold">技能擅长</div>
            <div className="flex flex-wrap gap-1">
              {draft.skills.map((s) => (
                <PixelBadge key={s} color="green">{s}</PixelBadge>
              ))}
            </div>
          </div>
        )}

        {/* Saving throws */}
        {draft.savingThrows.length > 0 && (
          <div>
            <div className="mb-1 font-silk font-bold">豁免擅长</div>
            <div className="flex flex-wrap gap-1">
              {draft.savingThrows.map((s) => (
                <PixelBadge key={s} color="blue">
                  {ABILITY_LABELS[s] || s}
                </PixelBadge>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {draft.features.length > 0 && (
          <div>
            <div className="mb-1 font-silk font-bold">种族/职业特性</div>
            <ul className="list-disc pl-5 text-sm">
              {draft.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Equipment */}
        {(draft.weapons.length > 0 || draft.equipment.length > 0 || draft.armor) && (
          <div>
            <div className="mb-1 font-silk font-bold">装备</div>
            {draft.armor && (
              <div className="text-sm mb-1">
                🛡 {draft.armor.name} (AC {draft.armor.baseAC}, {draft.armor.category})
                {draft.shield && " + 盾牌"}
              </div>
            )}
            {draft.weapons.length > 0 && (
              <ul className="list-disc pl-5 text-sm">
                {draft.weapons.map((w, i) => (
                  <li key={i}>{w.name} — {w.damage} {w.damageType}</li>
                ))}
              </ul>
            )}
            {draft.equipment.length > 0 && (
              <ul className="list-disc pl-5 text-sm mt-1">
                {draft.equipment.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Spells */}
        {(draft.knownCantrips.length > 0 || draft.knownSpells.length > 0) && (
          <div>
            <div className="mb-1 font-silk font-bold">法术</div>
            {draft.spellcastingAbility && (
              <div className="text-xs text-amber-600 mb-1">
                施法属性: {ABILITY_LABELS[draft.spellcastingAbility] || draft.spellcastingAbility}
                {" · "}法术DC: {8 + prof + abilityModifier(totals[draft.spellcastingAbility as keyof typeof totals] ?? 10)}
                {" · "}法术攻击: +{prof + abilityModifier(totals[draft.spellcastingAbility as keyof typeof totals] ?? 10)}
              </div>
            )}
            {draft.knownCantrips.length > 0 && (
              <div className="mb-1">
                <span className="text-xs text-amber-700 font-silk">戏法: </span>
                <span className="flex flex-wrap gap-1 inline">
                  {draft.knownCantrips.map((s) => (
                    <PixelBadge key={s} color="blue">{s}</PixelBadge>
                  ))}
                </span>
              </div>
            )}
            {draft.preparedSpells.length > 0 && (
              <div className="mb-1">
                <span className="text-xs text-green-700 font-silk">已准备法术: </span>
                <span className="flex flex-wrap gap-1 inline">
                  {draft.preparedSpells.map((s) => (
                    <PixelBadge key={s} color="green">{s}</PixelBadge>
                  ))}
                </span>
              </div>
            )}
            {draft.knownSpells.length > 0 && (
              <div>
                <span className="text-xs text-amber-700 font-silk">已知法术: </span>
                <span className="flex flex-wrap gap-1 inline">
                  {draft.knownSpells.map((s) => {
                    const isPrepared = draft.preparedSpells.includes(s);
                    return (
                      <PixelBadge key={s} color={isPrepared ? "green" : "blue"}>
                        {s}{isPrepared ? " ✦" : ""}
                      </PixelBadge>
                    );
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Familiar */}
        {draft.familiar && (
          <div>
            <div className="mb-1 font-silk font-bold">🐾 魔宠</div>
            <div className="bg-[#e8c89a] border-2 border-[#8b6a3e] p-2 text-sm">
              <div className="font-bold">
                {draft.familiar.name}
                {draft.familiar.customName && (
                  <span className="text-amber-700 ml-1">
                    「{draft.familiar.customName}」
                  </span>
                )}
              </div>
              <div className="text-xs text-amber-700">
                {draft.familiar.type === "chain" ? "锁链契约增强魔宠" : "标准魔宠"}
              </div>
            </div>
          </div>
        )}

        {/* Roleplay */}
        {(draft.traits || draft.ideals || draft.bonds || draft.flaws) && (
          <div>
            <div className="mb-1 font-silk font-bold">角色扮演</div>
            <div className="space-y-1 text-sm">
              {draft.traits && <div><strong>特质：</strong>{draft.traits}</div>}
              {draft.ideals && <div><strong>理想：</strong>{draft.ideals}</div>}
              {draft.bonds && <div><strong>羁绊：</strong>{draft.bonds}</div>}
              {draft.flaws && <div><strong>缺陷：</strong>{draft.flaws}</div>}
            </div>
          </div>
        )}

        {/* Backstory */}
        {draft.backstory && (
          <div>
            <div className="mb-1 font-silk font-bold">背景故事</div>
            <div className="text-sm whitespace-pre-wrap">{draft.backstory}</div>
          </div>
        )}
      </div>
    </PixelCard>
  );
}
