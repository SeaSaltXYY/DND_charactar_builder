import Link from "next/link";
import { BookOpen, MessageSquare, UserPlus, Sparkles, Dices } from "lucide-react";
import { PixelCard } from "@/components/ui/PixelCard";

const FEATURES = [
  {
    href: "/rulebooks",
    title: "规则书管理",
    desc: "上传 PDF / TXT / MD 规则书，自动分块+向量化，打造你的私人 5e 图书馆。",
    icon: BookOpen,
    color: "#ffd700",
  },
  {
    href: "/chat",
    title: "规则问答",
    desc: "严格基于规则书裁决问题，答案附引用来源，支持流式打字机效果。",
    icon: MessageSquare,
    color: "#4488ff",
  },
  {
    href: "/create-character",
    title: "角色创建向导",
    desc: "8 步引导式建卡：种族 → 职业 → 属性 → 背景 → 技能 → 装备 → 法术 → 预览。",
    icon: UserPlus,
    color: "#b45cff",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <section className="pixel-panel mb-6 overflow-hidden">
        <div className="relative border-b-4 border-pixel-border-dark bg-[#0f1a30] px-4 py-8 text-center md:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-30"
               style={{
                 backgroundImage:
                   "radial-gradient(circle, rgba(255,215,0,0.2) 1px, transparent 1px)",
                 backgroundSize: "12px 12px",
               }}
          />
          <h1 className="relative font-pixel-title text-pixel-xl md:text-2xl text-pixel-gold text-shadow-pixel">
            🎲 D&amp;D 5e Rulebook Assistant
          </h1>
          <p className="relative mx-auto mt-4 max-w-2xl font-silk text-pixel-base text-text-primary">
            规则书问答 · 建卡向导 · 骰子工具
          </p>
          <p className="relative mx-auto mt-2 max-w-2xl text-base text-text-muted">
            由规则书驱动的 DM 助手 · 所有回答均可溯源
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/rulebooks" className="pixel-btn pixel-btn-gold">
              <Sparkles size={14} /> 开始 · 上传规则书
            </Link>
            <Link href="/create-character" className="pixel-btn pixel-btn-blue">
              <UserPlus size={14} /> 立即建卡
            </Link>
            <Link href="/chat" className="pixel-btn">
              <MessageSquare size={14} /> 进入问答
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.href} href={f.href} className="block group">
              <PixelCard
                title={
                  <span className="flex items-center gap-2" style={{ color: f.color }}>
                    <Icon size={16} />
                    {f.title}
                  </span>
                }
                className="h-full transition-transform group-hover:-translate-y-1"
              >
                <p className="text-base text-text-primary">{f.desc}</p>
              </PixelCard>
            </Link>
          );
        })}
      </section>

      <section className="mt-6">
        <PixelCard
          title={
            <span className="flex items-center gap-2 text-pixel-gold">
              <Dices size={16} /> 快速上手
            </span>
          }
        >
          <ol className="list-decimal space-y-2 pl-6 text-base">
            <li>
              前往 <Link href="/rulebooks" className="text-pixel-blue underline">规则书</Link>
              页面上传 5e 规则书（PDF / TXT / MD / CHM）。
            </li>
            <li>
              进入 <Link href="/chat" className="text-pixel-blue underline">规则问答</Link> 向 AI 提问，
              或前往 <Link href="/create-character" className="text-pixel-blue underline">建卡</Link>
              生成你的第一张角色卡。
            </li>
          </ol>
        </PixelCard>
      </section>
    </div>
  );
}
