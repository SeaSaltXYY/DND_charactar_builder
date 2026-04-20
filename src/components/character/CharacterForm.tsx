"use client";
import React from "react";
import { useCharacterStore, SECTIONS } from "@/stores/character-store";
import type { CharacterSection } from "@/types/character";
import BasicSection from "./sections/BasicSection";
import RaceSection from "./sections/RaceSection";
import ClassSection from "./sections/ClassSection";
import AbilitySection from "./sections/AbilitySection";
import CombatSection from "./sections/CombatSection";
import SkillsSection from "./sections/SkillsSection";
import BackgroundSection from "./sections/BackgroundSection";
import EquipmentSection from "./sections/EquipmentSection";
import SpellsSection from "./sections/SpellsSection";
import FamiliarSection from "./sections/FamiliarSection";
import RoleplaySection from "./sections/RoleplaySection";

const SECTION_COMPONENTS: Record<CharacterSection, React.ComponentType> = {
  basic: BasicSection,
  race: RaceSection,
  class: ClassSection,
  ability: AbilitySection,
  combat: CombatSection,
  skills: SkillsSection,
  background: BackgroundSection,
  equipment: EquipmentSection,
  spells: SpellsSection,
  familiar: FamiliarSection,
  roleplay: RoleplaySection,
};

export default function CharacterForm() {
  const collapsedSections = useCharacterStore((s) => s.collapsedSections);
  const toggleSection = useCharacterStore((s) => s.toggleSection);

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-2 custom-scrollbar">
      {SECTIONS.map(({ key, label, emoji }) => {
        const collapsed = collapsedSections.has(key);
        const Component = SECTION_COMPONENTS[key];

        return (
          <div
            key={key}
            className="bg-gray-900/60 border border-amber-900/30 rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/40 transition-colors"
              onClick={() => toggleSection(key)}
            >
              <span className="text-sm font-pixel text-amber-200">
                {emoji} {label}
              </span>
              <span
                className={`text-amber-600 text-xs transition-transform duration-200 ${
                  collapsed ? "" : "rotate-90"
                }`}
              >
                ▶
              </span>
            </button>

            {!collapsed && (
              <div className="px-4 pb-4 pt-1 border-t border-amber-900/20">
                <Component />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
