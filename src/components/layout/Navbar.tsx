"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, MessageSquare, UserPlus, Users, Dices } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "主页", icon: Dices },
  { href: "/rulebooks", label: "规则书", icon: BookOpen },
  { href: "/chat", label: "规则问答", icon: MessageSquare },
  { href: "/create-character", label: "建卡", icon: UserPlus },
  { href: "/characters", label: "角色卡", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="pixel-panel relative z-20 flex items-center justify-between border-b-4 border-pixel-border-dark px-4 py-2">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">🎲</span>
        <span className="font-pixel-title text-pixel-base text-pixel-gold text-shadow-pixel">
          D&amp;D 5e Assistant
        </span>
      </Link>
      <nav className="flex flex-wrap items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pixel-btn ${active ? "pixel-btn-gold active" : ""}`}
            >
              <Icon size={14} />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
