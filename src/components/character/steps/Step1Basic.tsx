"use client";
import { Shuffle } from "lucide-react";
import { PixelCard } from "../../ui/PixelCard";
import { PixelInput } from "../../ui/PixelInput";
import { PixelButton } from "../../ui/PixelButton";
import { useCharacterStore } from "@/stores/character-store";

const NAME_POOL = [
  "Thalion", "Elaria", "Grimsbeard", "Vaelen", "Korrin",
  "Silwyn", "Ulfgar", "Mirelle", "Dain", "Aurelia",
  "Kaelith", "Brom", "Sorrin", "Lyra", "Haldrin",
];

export function Step1Basic() {
  const { draft, update } = useCharacterStore();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <PixelCard title="📜 基础信息">
        <div className="space-y-3">
          <Field label="角色名 *">
            <div className="flex gap-2">
              <PixelInput
                value={draft.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="如：Eleanor Starfall"
              />
              <PixelButton
                onClick={() =>
                  update({
                    name:
                      NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)],
                  })
                }
                title="随机"
              >
                <Shuffle size={12} /> 随机
              </PixelButton>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="性别">
              <PixelInput
                value={draft.gender || ""}
                onChange={(e) => update({ gender: e.target.value })}
              />
            </Field>
            <Field label="年龄">
              <PixelInput
                value={draft.age || ""}
                onChange={(e) => update({ age: e.target.value })}
              />
            </Field>
          </div>
          <Field label="阵营">
            <PixelInput
              value={draft.alignment || ""}
              onChange={(e) => update({ alignment: e.target.value })}
              placeholder="例如：中立善良 / 守序中立"
            />
          </Field>
          <Field label="等级">
            <PixelInput
              type="number"
              min={1}
              max={20}
              value={draft.level}
              onChange={(e) =>
                update({ level: Math.max(1, Math.min(20, Number(e.target.value))) })
              }
            />
          </Field>
        </div>
      </PixelCard>

      <PixelCard title="💡 提示">
        <div className="space-y-2 text-sm leading-relaxed">
          <p>先给你的角色取个名字。之后每一步都可以打开右侧的 AI 助手提问，也可以从已上传的规则书中检索内容。</p>
          <p>本向导会在每一步做基础合法性校验；完全自由定制请在「预览」页手动调整。</p>
        </div>
      </PixelCard>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-silk text-pixel-sm text-text-muted">{label}</div>
      {children}
    </div>
  );
}
