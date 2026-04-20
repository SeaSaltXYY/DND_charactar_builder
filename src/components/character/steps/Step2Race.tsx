"use client";
import { PixelCard } from "../../ui/PixelCard";
import { PixelInput } from "../../ui/PixelInput";
import { PixelButton } from "../../ui/PixelButton";
import { useCharacterStore } from "@/stores/character-store";
import { RulesPicker } from "../RulesPicker";

const COMMON_RACES = [
  "人类", "精灵", "矮人", "半身人", "半精灵", "半兽人",
  "侏儒", "龙裔", "提夫林",
];

export function Step2Race() {
  const { draft, update } = useCharacterStore();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PixelCard title="🧝 选择种族">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {COMMON_RACES.map((r) => (
              <PixelButton
                key={r}
                variant={draft.race === r ? "gold" : "default"}
                active={draft.race === r}
                onClick={() => update({ race: r })}
              >
                {r}
              </PixelButton>
            ))}
          </div>
          <div>
            <div className="mb-1 font-silk text-pixel-sm text-text-muted">
              种族（可自定义）
            </div>
            <PixelInput
              value={draft.race || ""}
              onChange={(e) => update({ race: e.target.value })}
              placeholder="种族名"
            />
          </div>
          <div>
            <div className="mb-1 font-silk text-pixel-sm text-text-muted">
              亚种（可选）
            </div>
            <PixelInput
              value={draft.subrace || ""}
              onChange={(e) => update({ subrace: e.target.value })}
              placeholder="如：高等精灵、山地矮人"
            />
          </div>
          <div className="text-sm text-text-muted">
            💡 请在规则书中查阅该种族的属性加值、黑暗视觉、特性等，
            在「预览」页的 features/备注里记下。种族加值会在属性步骤自动体现。
          </div>
        </div>
      </PixelCard>

      <RulesPicker category="races" title="从规则书查阅种族" />
    </div>
  );
}
