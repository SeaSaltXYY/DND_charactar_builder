"use client";
import { useState } from "react";
import { Dices, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { rollDice, type DiceRollDetail } from "@/lib/dice";

const DICE = [
  { label: "d4", expr: "1d4", color: "#88ff88" },
  { label: "d6", expr: "1d6", color: "#ffd700" },
  { label: "d8", expr: "1d8", color: "#4488ff" },
  { label: "d10", expr: "1d10", color: "#ff8844" },
  { label: "d12", expr: "1d12", color: "#b45cff" },
  { label: "d20", expr: "1d20", color: "#ff4444" },
  { label: "d100", expr: "1d100", color: "#44ffff" },
];

export function DiceSidebar() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<DiceRollDetail[]>([]);
  const [custom, setCustom] = useState("2d6+3");
  const [rolling, setRolling] = useState(false);
  const [lastResult, setLastResult] = useState<DiceRollDetail | null>(null);

  function roll(expr: string) {
    try {
      setRolling(true);
      const res = rollDice(expr);
      setLastResult(res);
      setHistory((h) => [res, ...h].slice(0, 20));
      setTimeout(() => setRolling(false), 600);
    } catch (e) {
      console.error(e);
      setRolling(false);
    }
  }

  return (
    <>
      {/* 折叠状态下的触发按钮 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="打开骰子面板"
          style={{
            position: "fixed",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            padding: "10px 4px",
            width: "24px",
            background: "linear-gradient(180deg, #ffe066 0%, #ffd700 50%, #c8a200 100%)",
            color: "#2c1810",
            border: "3px solid #6a5200",
            borderLeft: "none",
            borderRadius: "0 4px 4px 0",
            boxShadow: "inset -2px -2px 0 0 #8a6a00, inset 2px 2px 0 0 #fff4a8, 3px 0 6px rgba(0,0,0,0.4)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            fontFamily: '"Silkscreen", monospace',
            fontSize: "9px",
            lineHeight: "1",
          }}
        >
          <Dices size={12} className={rolling ? "animate-spin" : ""} />
          <span>骰</span>
          <span>子</span>
          <ChevronRight size={10} />
        </button>
      )}

      {/* 遮罩层：点击主页面任意位置关闭侧边栏 */}
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 侧边栏主体 */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full w-64 flex-col overflow-hidden border-r-4 border-pixel-border bg-bg-secondary">
          {/* 头部 */}
          <div className="flex items-center justify-between border-b-4 border-pixel-border-dark bg-[#0f1a30] px-3 py-2">
            <div className="flex items-center gap-2 font-silk text-pixel-base text-pixel-gold">
              <Dices
                size={16}
                className={rolling ? "animate-spin" : ""}
              />
              骰子工具
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-primary transition-colors"
              title="收起"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* 最近一次结果（大数字展示） */}
          {lastResult && (
            <div className="border-b-4 border-pixel-border-dark bg-[#0a0e18] px-3 py-3 text-center animate-fade-in">
              <div className="font-silk text-pixel-xs text-text-muted">
                {lastResult.expression}
              </div>
              <div
                className="font-pixel-title text-4xl text-pixel-gold text-shadow-pixel"
                style={{
                  animation: rolling ? "dice-roll 0.6s ease" : "none",
                }}
              >
                {lastResult.total}
              </div>
              <div className="mt-1 font-silk text-pixel-xs text-text-muted">
                [{lastResult.rolls
                  .map((r) => r.kept.join(", "))
                  .join(" + ")}]
              </div>
            </div>
          )}

          {/* 快捷骰子按钮 */}
          <div className="border-b-4 border-pixel-border-dark px-3 py-3">
            <div className="grid grid-cols-4 gap-2">
              {DICE.map((d) => (
                <button
                  key={d.label}
                  onClick={() => roll(d.expr)}
                  className="pixel-btn flex flex-col items-center gap-[2px] px-1 py-2 text-center"
                  style={{ fontSize: "10px" }}
                >
                  <span style={{ color: d.color, fontWeight: "bold" }}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 自定义表达式 */}
          <div className="border-b-4 border-pixel-border-dark px-3 py-3">
            <div className="mb-1 font-silk text-pixel-xs text-text-muted">
              自定义表达式
            </div>
            <form
              className="flex gap-1"
              onSubmit={(e) => {
                e.preventDefault();
                roll(custom);
              }}
            >
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="pixel-input flex-1 px-2 py-1 text-sm"
                placeholder="4d6kh3"
              />
              <button
                type="submit"
                className="pixel-btn pixel-btn-gold text-[10px]"
              >
                GO
              </button>
            </form>
            <div className="mt-1 font-silk text-[9px] text-text-muted">
              支持: 2d6+3 · 4d6kh3 · 1d20+1d4
            </div>
          </div>

          {/* 历史记录 */}
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <span className="font-silk text-pixel-xs text-text-muted">
              投骰记录 ({history.length})
            </span>
            {history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  setLastResult(null);
                }}
                className="text-text-muted hover:text-pixel-red transition-colors"
                title="清空"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-auto px-3 pb-3">
            {history.length === 0 ? (
              <div className="py-6 text-center text-text-muted font-silk text-pixel-xs">
                点击上方骰子开始投掷
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className={`pixel-border-thin bg-[#0a0e18] px-2 py-1 ${
                      i === 0 ? "animate-fade-in" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-silk text-pixel-xs text-text-muted">
                        {h.expression}
                      </span>
                      <span className="font-silk text-pixel-sm font-bold text-pixel-gold">
                        {h.total}
                      </span>
                    </div>
                    <div className="font-silk text-[9px] text-text-muted">
                      [{h.rolls
                        .map((r) => r.kept.join(", "))
                        .join(" + ")}]
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
