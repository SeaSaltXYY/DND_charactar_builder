"use client";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  canNext?: boolean;
  onFinish?: () => void;
}

/**
 * Legacy step wizard — kept for backward compatibility.
 * The new character creation page uses CharacterForm + AICreator instead.
 */
export function StepWizard({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="animate-fade-in">{children}</div>
    </div>
  );
}
