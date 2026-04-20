"use client";
import React from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string | null;
  options: Option[];
  onChange: (val: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CascadeSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "—— 请选择 ——",
  disabled = false,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-pixel text-amber-300">{label}</label>
      <select
        className="px-3 py-2 bg-gray-800/80 border border-amber-900/60 rounded
                   text-sm text-amber-100 font-pixel
                   focus:outline-none focus:border-amber-500
                   disabled:opacity-40 disabled:cursor-not-allowed
                   appearance-none cursor-pointer"
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
