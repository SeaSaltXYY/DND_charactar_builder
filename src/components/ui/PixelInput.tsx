"use client";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export const PixelInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...rest }, ref) => {
  return <input ref={ref} className={`pixel-input ${className}`} {...rest} />;
});
PixelInput.displayName = "PixelInput";

export const PixelTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...rest }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`pixel-input resize-y leading-relaxed ${className}`}
      {...rest}
    />
  );
});
PixelTextarea.displayName = "PixelTextarea";
