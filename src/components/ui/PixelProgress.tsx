"use client";

interface Props {
  value: number; // 0-100
  label?: string;
  variant?: "gold" | "green" | "red" | "blue";
}

const colors: Record<string, string> = {
  gold: "bg-pixel-gold",
  green: "bg-pixel-green",
  red: "bg-pixel-red",
  blue: "bg-pixel-blue",
};

export function PixelProgress({ value, label, variant = "gold" }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="font-silk text-pixel-base mb-1 text-text-primary">
          {label}
        </div>
      )}
      <div className="pixel-border-thin relative h-5 overflow-hidden bg-[#0a0e18]">
        <div
          className={`h-full ${colors[variant]} transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-silk text-pixel-xs text-text-dark mix-blend-difference">
          {Math.round(clamped)}%
        </div>
      </div>
    </div>
  );
}
