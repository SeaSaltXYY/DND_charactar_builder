"use client";
import { PixelCard } from "../../ui/PixelCard";
import { PixelInput, PixelTextarea } from "../../ui/PixelInput";
import { PixelButton } from "../../ui/PixelButton";
import { Shuffle } from "lucide-react";
import { useCharacterStore } from "@/stores/character-store";
import { RulesPicker } from "../RulesPicker";

const BACKGROUNDS = [
  "侍僧", "罪犯", "民间英雄", "贵族", "学者",
  "水手", "士兵", "江湖艺人", "隐士", "工匠",
];

const SAMPLE = {
  traits: [
    "我总是随身带着一枚幸运硬币",
    "我会在笔记本里记下每一件稀奇事",
    "我喜欢引用古老箴言",
  ],
  ideals: [
    "荣耀高于一切",
    "知识是驱散黑暗的光",
    "自由的灵魂不可被束缚",
  ],
  bonds: [
    "我要为倒下的同伴复仇",
    "我欠一位恩人永远还不清的债",
    "我的家乡正在受难",
  ],
  flaws: [
    "贪杯是我最大的弱点",
    "我永远无法原谅某个背叛我的人",
    "在女性面前我总是笨嘴拙舌",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function Step5Background() {
  const { draft, update } = useCharacterStore();

  function randomRoleplay() {
    update({
      traits: pick(SAMPLE.traits),
      ideals: pick(SAMPLE.ideals),
      bonds: pick(SAMPLE.bonds),
      flaws: pick(SAMPLE.flaws),
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <PixelCard title="🎭 角色背景">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map((b) => (
              <PixelButton
                key={b}
                variant={draft.background === b ? "gold" : "default"}
                active={draft.background === b}
                onClick={() => update({ background: b })}
              >
                {b}
              </PixelButton>
            ))}
          </div>
          <div>
            <div className="mb-1 font-silk text-pixel-sm text-text-muted">
              背景（可自定义）
            </div>
            <PixelInput
              value={draft.background || ""}
              onChange={(e) => update({ background: e.target.value })}
            />
          </div>
          <div className="divider-pixel" />
          <div className="flex items-center justify-between">
            <span className="font-silk text-pixel-base text-text-muted">
              角色扮演要素
            </span>
            <PixelButton onClick={randomRoleplay}>
              <Shuffle size={12} /> 随机
            </PixelButton>
          </div>
          <Field label="特质 (Traits)">
            <PixelTextarea
              rows={2}
              value={draft.traits || ""}
              onChange={(e) => update({ traits: e.target.value })}
            />
          </Field>
          <Field label="理想 (Ideals)">
            <PixelTextarea
              rows={2}
              value={draft.ideals || ""}
              onChange={(e) => update({ ideals: e.target.value })}
            />
          </Field>
          <Field label="牵绊 (Bonds)">
            <PixelTextarea
              rows={2}
              value={draft.bonds || ""}
              onChange={(e) => update({ bonds: e.target.value })}
            />
          </Field>
          <Field label="缺陷 (Flaws)">
            <PixelTextarea
              rows={2}
              value={draft.flaws || ""}
              onChange={(e) => update({ flaws: e.target.value })}
            />
          </Field>
        </div>
      </PixelCard>

      <RulesPicker
        category="backgrounds"
        title="从规则书查阅背景"
        extraQuery={draft.background || undefined}
      />
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
