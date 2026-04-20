import type { Metadata } from "next";
import "../styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { DiceSidebar } from "@/components/layout/DiceSidebar";

export const metadata: Metadata = {
  title: "D&D 5e Assistant",
  description:
    "像素风的 D&D 5e 规则助手 & 建卡器：规则书 RAG 问答、模组背景导入、8 步向导式角色创建。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6">
            {children}
          </main>
        </div>
        <DiceSidebar />
      </body>
    </html>
  );
}
