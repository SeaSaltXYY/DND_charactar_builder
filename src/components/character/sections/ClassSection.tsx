"use client";
import React from "react";
import { useCharacterStore } from "@/stores/character-store";
import { CLASSES, getSubclasses } from "@/data/classes";
import { autoFillFromClass } from "@/lib/character-calc";
import CascadeSelect from "@/components/ui/CascadeSelect";

export default function ClassSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);

  const classOptions = CLASSES.map((c) => ({ value: c.name, label: c.name }));
  const subclassOptions = getSubclasses(draft.class ?? "").map((s) => ({
    value: s.name,
    label: s.name,
  }));

  const selectedClass = CLASSES.find((c) => c.name === draft.class);

  const handleClassChange = (val: string | null) => {
    const tempDraft = { ...draft, class: val, subclass: null };
    const patch = autoFillFromClass(tempDraft);
    update({ class: val, subclass: null, ...patch });
  };

  const mc1Options = CLASSES.filter((c) => c.name !== draft.class).map((c) => ({
    value: c.name,
    label: c.name,
  }));
  const mc1SubOptions = getSubclasses(draft.multiclass1 ?? "").map((s) => ({
    value: s.name,
    label: s.name,
  }));
  const mc2Options = CLASSES.filter(
    (c) => c.name !== draft.class && c.name !== draft.multiclass1
  ).map((c) => ({ value: c.name, label: c.name }));
  const mc2SubOptions = getSubclasses(draft.multiclass2 ?? "").map((s) => ({
    value: s.name,
    label: s.name,
  }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <CascadeSelect
          label="主职业"
          value={draft.class}
          options={classOptions}
          onChange={handleClassChange}
        />
        <CascadeSelect
          label="子职业"
          value={draft.subclass}
          options={subclassOptions}
          onChange={(v) => update({ subclass: v })}
          disabled={subclassOptions.length === 0}
        />
      </div>

      {selectedClass && (
        <div className="bg-gray-800/50 border border-amber-900/30 rounded p-3 text-xs text-amber-200 space-y-1">
          <div>
            <span className="text-amber-400 font-pixel">生命骰: </span>d{selectedClass.hitDie}
            <span className="ml-3 text-amber-400 font-pixel">主属性: </span>{selectedClass.primaryAbility}
          </div>
          <div>
            <span className="text-amber-400 font-pixel">施法: </span>
            {selectedClass.isCaster ? `✓ (${selectedClass.spellcastingAbility})` : "✗"}
          </div>
        </div>
      )}

      {/* 兼职（可折叠） */}
      <details className="group">
        <summary className="text-xs font-pixel text-amber-400 cursor-pointer hover:text-amber-300">
          ▸ 兼职（可选）
        </summary>
        <div className="mt-2 space-y-2 pl-2 border-l-2 border-amber-900/30">
          <div className="grid grid-cols-2 gap-3">
            <CascadeSelect
              label="兼职 1"
              value={draft.multiclass1}
              options={mc1Options}
              onChange={(v) => update({ multiclass1: v, multiclass1Sub: null })}
            />
            <CascadeSelect
              label="兼职1子职"
              value={draft.multiclass1Sub}
              options={mc1SubOptions}
              onChange={(v) => update({ multiclass1Sub: v })}
              disabled={!draft.multiclass1}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CascadeSelect
              label="兼职 2"
              value={draft.multiclass2}
              options={mc2Options}
              onChange={(v) => update({ multiclass2: v, multiclass2Sub: null })}
            />
            <CascadeSelect
              label="兼职2子职"
              value={draft.multiclass2Sub}
              options={mc2SubOptions}
              onChange={(v) => update({ multiclass2Sub: v })}
              disabled={!draft.multiclass2}
            />
          </div>
        </div>
      </details>
    </div>
  );
}
