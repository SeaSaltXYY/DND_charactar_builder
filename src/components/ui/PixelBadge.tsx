"use client";
import { ReactNode } from "react";

type Color = "gold" | "green" | "red" | "blue" | "gray";

const map: Record<Color, string> = {
  gold: "bg-pixel-gold text-text-dark border-[#6a5200]",
  green: "bg-pixel-green text-[#0a2a0a] border-[#0f5a0f]",
  red: "bg-pixel-red text-white border-[#7a1818]",
  blue: "bg-pixel-blue text-white border-[#142c66]",
  gray: "bg-pixel-border text-text-primary border-pixel-border-dark",
};

export function PixelBadge({
  color = "gold",
  children,
}: {
  color?: Color;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block border-2 px-2 py-[1px] font-silk text-pixel-xs ${map[color]}`}
    >
      {children}
    </span>
  );
}
