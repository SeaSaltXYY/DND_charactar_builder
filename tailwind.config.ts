import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#1a1a2e",
        "bg-secondary": "#16213e",
        "bg-tertiary": "#0f1624",
        parchment: {
          DEFAULT: "#d4a574",
          dark: "#b8864e",
          light: "#e8c89a",
        },
        pixel: {
          gold: "#ffd700",
          red: "#ff4444",
          green: "#44ff44",
          blue: "#4488ff",
          purple: "#b45cff",
          border: "#8b7355",
          "border-dark": "#5c4a32",
          "border-light": "#b8964e",
        },
        "text-primary": "#e8d5b7",
        "text-dark": "#2c1810",
        "text-muted": "#8a7a5c",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        silk: ['"Silkscreen"', "monospace"],
        vt: ['"VT323"', "monospace"],
      },
      fontSize: {
        "pixel-xs": ["8px", { lineHeight: "14px" }],
        "pixel-sm": ["10px", { lineHeight: "16px" }],
        "pixel-base": ["12px", { lineHeight: "20px" }],
        "pixel-lg": ["14px", { lineHeight: "24px" }],
        "pixel-xl": ["16px", { lineHeight: "28px" }],
      },
      animation: {
        "dice-roll": "dice-roll 0.6s cubic-bezier(.2,.8,.2,1)",
        blink: "blink 1s step-start infinite",
        "fade-in": "fade-in 0.25s ease-out",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        "dice-roll": {
          "0%": { transform: "rotate(0deg) scale(0.8)" },
          "50%": { transform: "rotate(720deg) scale(1.2)" },
          "100%": { transform: "rotate(1080deg) scale(1)" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scanline: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100px" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
