"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "gold" | "red" | "green" | "blue";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  active?: boolean;
}

const variantClass: Record<Variant, string> = {
  default: "",
  gold: "pixel-btn-gold",
  red: "pixel-btn-red",
  green: "pixel-btn-green",
  blue: "pixel-btn-blue",
};

export const PixelButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "default", active, className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`pixel-btn ${variantClass[variant]} ${active ? "active" : ""} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
PixelButton.displayName = "PixelButton";
