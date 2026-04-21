"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Trash2, UserPlus, Users, Download, Upload } from "lucide-react";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelBadge } from "@/components/ui/PixelBadge";
import type { Character } from "@/types/character";

export default function CharactersPage() {
  const [list, setList] = useState<Character[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const r = await fetch("/api/characters").then((r) => r.json());
    setList(r.characters || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("删除该角色？")) return;
    await fetch(`/api/characters/${id}`, { method: "DELETE" });
    await load();
  }

  function exportChar(c: Character) {
    const blob = new Blob([JSON.stringify(c, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.name) {
        alert("导入失败：JSON 中缺少角色名（name 字段）");
        return;
      }
      const { id: _removed, created_at: _ca, updated_at: _ua, ...rest } = data;
      const resp = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      if (!resp.ok) {
        alert("导入失败：服务器错误");
        return;
      }
      await load();
      alert(`成功导入角色「${data.name}」`);
    } catch {
      alert("导入失败：请确保文件是有效的角色 JSON");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-pixel-title text-pixel-lg text-pixel-gold text-shadow-pixel">
          👥 角色卡
        </h1>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            className="pixel-btn"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={14} /> 导入角色
          </button>
          <Link href="/create-character" className="pixel-btn pixel-btn-gold">
            <UserPlus size={14} /> 新建角色
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <PixelCard>
          <div className="py-10 text-center text-text-muted">
            <Users size={48} className="mx-auto mb-2 opacity-40" />
            还没有角色。前往{" "}
            <Link href="/create-character" className="text-pixel-gold underline">
              建卡向导
            </Link>{" "}
            创建你的第一张角色卡吧！
          </div>
        </PixelCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <PixelCard
              key={c.id}
              variant="parchment"
              title={
                <span className="truncate text-text-dark">{c.name}</span>
              }
            >
              <div className="space-y-2 text-text-dark">
                <div className="flex flex-wrap gap-1">
                  <PixelBadge color="blue">{c.race || "?"}</PixelBadge>
                  <PixelBadge color="red">{c.class || "?"}</PixelBadge>
                  <PixelBadge color="gold">Lv {c.level}</PixelBadge>
                </div>
                <div className="text-sm">
                  HP {c.hp} · AC {c.ac}
                </div>
                <div className="text-xs text-[#4a3020]">
                  {new Date(c.updated_at + "Z").toLocaleString()}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    href={`/characters/${c.id}`}
                    className="pixel-btn pixel-btn-gold"
                  >
                    查看
                  </Link>
                  <PixelButton onClick={() => exportChar(c)}>
                    <Download size={12} />
                  </PixelButton>
                  <PixelButton variant="red" onClick={() => remove(c.id)}>
                    <Trash2 size={12} />
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      )}
    </div>
  );
}
