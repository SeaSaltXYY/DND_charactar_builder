"use client";
import { HTMLAttributes, ReactNode } from "react";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "panel" | "parchment";
  title?: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
}

export function PixelCard({
  variant = "panel",
  title,
  icon,
  footer,
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    variant === "parchment" ? "pixel-panel-parchment" : "pixel-panel";
  return (
    <div className={`${base} ${className}`} {...rest}>
      {title && (
        <div
          className={`flex items-center gap-2 px-3 py-2 font-silk text-sm ${
            variant === "parchment"
              ? "border-b-4 border-[#8b6a3e] bg-[#c9a06b]"
              : "border-b-4 border-pixel-border-dark bg-[#0f1a30]"
          }`}
        >
          {icon}
          <span className="font-bold tracking-wide">{title}</span>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div
          className={`px-3 py-2 ${
            variant === "parchment"
              ? "border-t-4 border-[#8b6a3e] bg-[#c9a06b]"
              : "border-t-4 border-pixel-border-dark bg-[#0f1a30]"
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
