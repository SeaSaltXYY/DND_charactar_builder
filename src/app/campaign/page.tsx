"use client";
import { useEffect, useState } from "react";
import { Map, Save, Trash2, Edit3, Plus } from "lucide-react";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput, PixelTextarea } from "@/components/ui/PixelInput";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { ImageOCR } from "@/components/campaign/ImageOCR";

interface CampaignRow {
  id: string;
  title: string;
  content: string;
  source_type: "text" | "image_ocr";
  has_embedding: boolean;
  created_at: string;
}

export default function CampaignPage() {
  const [list, setList] = useState<CampaignRow[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/campaigns");
    const d = await r.json();
    setList(d.campaigns || []);
  }
  useEffect(() => {
    load();
  }, []);

  function reset() {
    setEditId(null);
    setTitle("");
    setContent("");
  }

  async function save() {
    if (!content.trim()) {
      setErr("内容不能为空");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const url = editId ? `/api/campaigns/${editId}` : "/api/campaigns";
      const method = editId ? "PUT" : "POST";
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "保存失败");
      }
      reset();
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("确定删除该模组背景？")) return;
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (editId === id) reset();
    await load();
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-pixel-title text-pixel-lg text-pixel-gold text-shadow-pixel">
          🗺 模组背景导入
        </h1>
        {editId && (
          <PixelButton onClick={reset}>
            <Plus size={14} /> 新建背景
          </PixelButton>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PixelCard
          title={
            <span className="flex items-center gap-2 text-pixel-gold">
              <Edit3 size={14} />
              {editId ? "编辑模组背景" : "创建模组背景"}
            </span>
          }
        >
          <div className="space-y-3">
            <div>
              <label className="mb-1 block font-silk text-pixel-sm text-text-muted">
                标题
              </label>
              <PixelInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="如：失落矿坑的黄金"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center justify-between">
                <span className="font-silk text-pixel-sm text-text-muted">
                  内容（支持 Markdown）
                </span>
                <ImageOCR
                  onText={(t) =>
                    setContent((prev) => (prev ? prev + "\n\n" + t : t))
                  }
                />
              </label>
              <PixelTextarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"# 背景\n\n你们的冒险开始于 ...\n\n## NPC\n- ...\n\n## 特殊规则\n- 在本模组中，神术祷言每日只能使用 1 次"}
              />
            </div>
            {err && (
              <div className="font-silk text-sm text-pixel-red">⚠ {err}</div>
            )}
            <div className="flex gap-2">
              <PixelButton variant="gold" onClick={save} disabled={saving}>
                <Save size={12} /> {saving ? "保存中..." : "保存"}
              </PixelButton>
              {editId && (
                <PixelButton onClick={reset}>取消</PixelButton>
              )}
            </div>
          </div>
        </PixelCard>

        <div className="space-y-3">
          <h2 className="font-silk text-pixel-base text-text-muted">
            已保存 ({list.length})
          </h2>
          {list.length === 0 && (
            <PixelCard>
              <div className="py-8 text-center text-text-muted">
                <Map size={40} className="mx-auto mb-2 opacity-40" />
                还没有模组背景
              </div>
            </PixelCard>
          )}
          {list.map((c) => (
            <PixelCard
              key={c.id}
              variant="parchment"
              title={
                <span className="flex items-center gap-2 text-text-dark">
                  <Map size={14} />
                  <span className="truncate">{c.title || "（未命名）"}</span>
                </span>
              }
            >
              <div className="space-y-2 text-text-dark">
                <div className="flex flex-wrap items-center gap-2">
                  <PixelBadge color={c.source_type === "image_ocr" ? "blue" : "gold"}>
                    {c.source_type === "image_ocr" ? "OCR" : "文本"}
                  </PixelBadge>
                  {c.has_embedding && (
                    <PixelBadge color="green">已向量化</PixelBadge>
                  )}
                </div>
                <div className="max-h-28 overflow-hidden text-sm leading-snug">
                  {c.content.slice(0, 180)}
                  {c.content.length > 180 ? "…" : ""}
                </div>
                <div className="flex gap-2 pt-1">
                  <PixelButton
                    onClick={() => {
                      setEditId(c.id);
                      setTitle(c.title);
                      setContent(c.content);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Edit3 size={12} /> 编辑
                  </PixelButton>
                  <PixelButton variant="red" onClick={() => remove(c.id)}>
                    <Trash2 size={12} /> 删除
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </div>
  );
}
