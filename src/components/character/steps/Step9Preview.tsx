"use client";
import { Download, Save } from "lucide-react";
import { PixelButton } from "../../ui/PixelButton";
import { CharacterSheet } from "../CharacterSheet";
import { useCharacterStore } from "@/stores/character-store";

interface Props {
  onSave: () => void;
  saving: boolean;
}

export function Step9Preview({ onSave, saving }: Props) {
  const { draft } = useCharacterStore();

  function exportJSON() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.name || "character"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <PixelButton variant="green" onClick={onSave} disabled={saving || !draft.name}>
          <Save size={14} /> {saving ? "保存中..." : "保存到角色库"}
        </PixelButton>
        <PixelButton onClick={exportJSON}>
          <Download size={14} /> 导出角色
        </PixelButton>
      </div>
      <CharacterSheet draft={draft} />
    </div>
  );
}
