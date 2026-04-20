"use client";
import { ReactNode } from "react";

type Color = "gold" | "green" | "red" | "blue" | "gray";
type Size = "sm" | "md" | "lg";

const colorMap: Record<Color, string> = {
  gold: "bg-pixel-gold text-text-dark border-[#6a5200]",
  green: "bg-pixel-green text-[#0a2a0a] border-[#0f5a0f]",
  red: "bg-pixel-red text-white border-[#7a1818]",
  blue: "bg-pixel-blue text-white border-[#142c66]",
  gray: "bg-pixel-border text-text-primary border-pixel-border-dark",
};

const sizeMap: Record<Size, string> = {
  sm: "px-1.5 py-[1px] text-[10px]",
  md: "px-2 py-[1px] text-pixel-xs",
  lg: "px-3 py-1 text-sm font-bold",
};

export function PixelBadge({
  color = "gold",
  size = "md",
  children,
}: {
  color?: Color;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block border-2 font-silk ${colorMap[color]} ${sizeMap[size]}`}
    >
      {children}
    </span>
  );
}
