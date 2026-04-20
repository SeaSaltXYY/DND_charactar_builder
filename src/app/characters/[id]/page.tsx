"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { PixelButton } from "@/components/ui/PixelButton";
import { CharacterSheet } from "@/components/character/CharacterSheet";
import type { Character, CharacterDraft } from "@/types/character";

export default function CharacterDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [c, setC] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/characters/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setC(d.character);
      });
  }, [params.id]);

  async function remove() {
    if (!c) return;
    if (!confirm(`删除「${c.name}」？`)) return;
    await fetch(`/api/characters/${c.id}`, { method: "DELETE" });
    router.push("/characters");
  }

  function exportJSON() {
    if (!c) return;
    const blob = new Blob([JSON.stringify(c, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl text-center text-pixel-red">
        {error}
      </div>
    );
  }
  if (!c) {
    return (
      <div className="text-center font-silk text-text-muted">
        加载中...
      </div>
    );
  }

  const fs = (c.full_sheet || {}) as Partial<CharacterDraft>;

  const draft: CharacterDraft = {
    name: c.name,
    gender: fs.gender || "",
    age: fs.age || "",
    race: c.race,
    subrace: c.subrace || null,
    class: c.class,
    subclass: c.subclass || null,
    multiclass1: fs.multiclass1 || null,
    multiclass1Sub: fs.multiclass1Sub || null,
    multiclass2: fs.multiclass2 || null,
    multiclass2Sub: fs.multiclass2Sub || null,
    level: c.level,
    background: c.background,
    alignment: c.alignment,
    ability_scores: c.ability_scores,
    ability_racial: fs.ability_racial || {},
    ability_growth: fs.ability_growth || {},
    hp: fs.hp ?? c.hp,
    maxHp: fs.maxHp ?? c.hp,
    tempHp: fs.tempHp ?? 0,
    hitDice: fs.hitDice || "",
    ac: fs.ac ?? c.ac,
    initiative: fs.initiative ?? 0,
    speed: fs.speed ?? 30,
    size: fs.size || "中型",
    skills: c.skills,
    savingThrows: fs.savingThrows || [],
    toolProficiencies: fs.toolProficiencies || [],
    languages: fs.languages || [],
    armorProficiencies: fs.armorProficiencies || [],
    weaponProficiencies: fs.weaponProficiencies || [],
    armor: fs.armor || null,
    shield: fs.shield || false,
    weapons: fs.weapons || [],
    equipment: c.equipment,
    currency: fs.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellcastingAbility: fs.spellcastingAbility || null,
    spellSlots: fs.spellSlots || [0, 0, 0, 0, 0, 0, 0, 0, 0],
    knownCantrips: fs.knownCantrips || [],
    knownSpells: fs.knownSpells || [],
    preparedSpells: fs.preparedSpells || [],
    traits: fs.traits || "",
    ideals: fs.ideals || "",
    bonds: fs.bonds || "",
    flaws: fs.flaws || "",
    backstory: fs.backstory || "",
    appearance: fs.appearance || "",
    features: c.features,
    backgroundFeature: fs.backgroundFeature || "",
    familiar: fs.familiar || null,
    spells: c.spells,
    campaign_id: c.campaign_id,
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/characters" className="pixel-btn">
          <ArrowLeft size={14} /> 返回列表
        </Link>
        <div className="flex gap-2">
          <PixelButton onClick={exportJSON}>
            <Download size={14} /> 导出 JSON
          </PixelButton>
          <PixelButton variant="red" onClick={remove}>
            <Trash2 size={14} /> 删除
          </PixelButton>
        </div>
      </div>
      <CharacterSheet draft={draft} />
    </div>
  );
}
