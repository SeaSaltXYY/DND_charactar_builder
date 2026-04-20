"use client";
import { useState } from "react";
import { Dices } from "lucide-react";
import { rollDice, type DiceRollDetail } from "@/lib/dice";

const DICE = [
  { label: "d4", expr: "1d4" },
  { label: "d6", expr: "1d6" },
  { label: "d8", expr: "1d8" },
  { label: "d10", expr: "1d10" },
  { label: "d12", expr: "1d12" },
  { label: "d20", expr: "1d20" },
  { label: "d100", expr: "1d100" },
];

export function DiceBar() {
  const [history, setHistory] = useState<DiceRollDetail[]>([]);
  const [custom, setCustom] = useState("2d6+3");
  const [rolling, setRolling] = useState(false);

  function roll(expr: string) {
    try {
      setRolling(true);
      const res = rollDice(expr);
      setHistory((h) => [res, ...h].slice(0, 6));
      setTimeout(() => setRolling(false), 600);
    } catch (e) {
      console.error(e);
      setRolling(false);
    }
  }

  return (
    <div className="pixel-panel relative z-20 flex flex-wrap items-center gap-2 border-t-4 border-pixel-border-dark px-3 py-2">
      <div className="flex items-center gap-1 font-silk text-pixel-sm text-pixel-gold">
        <Dices size={14} className={rolling ? "animate-spin" : ""} />
        <span>投骰：</span>
      </div>
      {DICE.map((d) => (
        <button
          key={d.label}
          onClick={() => roll(d.expr)}
          className="pixel-btn text-[10px]"
        >
          {d.label}
        </button>
      ))}
      <form
        className="flex items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          roll(custom);
        }}
      >
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="pixel-input w-24 px-2 py-1 text-sm"
          placeholder="2d6+3"
        />
        <button type="submit" className="pixel-btn pixel-btn-blue text-[10px]">
          GO
        </button>
      </form>
      {history.length > 0 && (
        <div className="ml-auto flex items-center gap-2 overflow-x-auto">
          {history.map((h, i) => (
            <div
              key={i}
              className={`pixel-border-thin flex items-center gap-1 bg-[#0a0e18] px-2 py-[2px] font-silk text-pixel-sm ${
                i === 0 ? "animate-fade-in" : ""
              }`}
              title={h.expression}
            >
              <span className="text-text-muted">{h.expression}</span>
              <span className="text-pixel-gold font-bold">= {h.total}</span>
              <span className="text-text-muted">
                [{h.rolls.map((r) => r.kept.join("·")).join(" / ")}]
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
