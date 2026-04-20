"use client";
import React, { useState } from "react";
import { useCharacterStore } from "@/stores/character-store";
import { ARMORS, WEAPONS } from "@/data/equipment";
import CascadeSelect from "@/components/ui/CascadeSelect";
import type { WeaponSlot } from "@/types/character";

export default function EquipmentSection() {
  const draft = useCharacterStore((s) => s.draft);
  const update = useCharacterStore((s) => s.update);
  const [newItem, setNewItem] = useState("");

  const armorOptions = ARMORS.filter((a) => a.category !== "盾牌").map((a) => ({
    value: a.name,
    label: `${a.name} (AC ${a.baseAC}, ${a.category})`,
  }));

  const weaponOptions = WEAPONS.map((w) => ({
    value: w.name,
    label: `${w.name} (${w.damage} ${w.damageType})`,
  }));

  const handleArmorChange = (val: string | null) => {
    if (!val) {
      update({ armor: null });
      return;
    }
    const a = ARMORS.find((ar) => ar.name === val);
    if (a) {
      update({
        armor: { name: a.name, baseAC: a.baseAC, category: a.category },
      });
    }
  };

  const addWeapon = (val: string | null) => {
    if (!val) return;
    const w = WEAPONS.find((wp) => wp.name === val);
    if (!w) return;
    const slot: WeaponSlot = {
      name: w.name,
      damage: w.damage,
      damageType: w.damageType,
      properties: w.properties.join(", "),
    };
    update({ weapons: [...draft.weapons, slot] });
  };

  const removeWeapon = (idx: number) => {
    update({ weapons: draft.weapons.filter((_, i) => i !== idx) });
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    update({ equipment: [...draft.equipment, newItem.trim()] });
    setNewItem("");
  };

  const removeItem = (idx: number) => {
    update({ equipment: draft.equipment.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      {/* 护甲 & 盾牌 */}
      <div className="grid grid-cols-2 gap-3">
        <CascadeSelect
          label="护甲"
          value={draft.armor?.name ?? null}
          options={armorOptions}
          onChange={handleArmorChange}
        />
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={draft.shield}
              onChange={(e) => update({ shield: e.target.checked })}
              className="accent-amber-500"
            />
            <span className="font-pixel text-amber-300">盾牌 (+2 AC)</span>
          </label>
        </div>
      </div>

      {/* 武器 */}
      <div>
        <div className="text-xs font-pixel text-amber-300 mb-1">武器</div>
        {draft.weapons.map((w, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs text-amber-200 bg-gray-800/40 rounded px-2 py-1 mb-1"
          >
            <span>{w.name} — {w.damage} {w.damageType}</span>
            <button
              className="text-red-400 hover:text-red-300 text-xs"
              onClick={() => removeWeapon(i)}
            >✕</button>
          </div>
        ))}
        <CascadeSelect
          label=""
          value={null}
          options={weaponOptions}
          onChange={addWeapon}
          placeholder="+ 添加武器..."
        />
      </div>

      {/* 杂项装备 */}
      <div>
        <div className="text-xs font-pixel text-amber-300 mb-1">其他装备</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {draft.equipment.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/60 border border-amber-900/30 rounded text-xs text-amber-200"
            >
              {item}
              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => removeItem(i)}
              >✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-1 bg-gray-800/80 border border-amber-900/60 rounded text-xs text-amber-100 focus:outline-none focus:border-amber-500"
            placeholder="输入物品名..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <button
            className="px-3 py-1 bg-amber-700 text-white text-xs font-pixel rounded hover:bg-amber-600"
            onClick={addItem}
          >添加</button>
        </div>
      </div>

      {/* 货币 */}
      <div>
        <div className="text-xs font-pixel text-amber-300 mb-1">货币</div>
        <div className="grid grid-cols-5 gap-1">
          {(["cp", "sp", "ep", "gp", "pp"] as const).map((k) => (
            <div key={k}>
              <label className="text-[10px] text-amber-500 font-pixel uppercase">{k}</label>
              <input
                type="number"
                min={0}
                className="w-full px-1 py-0.5 bg-gray-900 border border-amber-900/40 rounded text-xs text-center text-amber-100 focus:outline-none focus:border-amber-500"
                value={draft.currency[k]}
                onChange={(e) =>
                  update({
                    currency: { ...draft.currency, [k]: Math.max(0, Number(e.target.value) || 0) },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
