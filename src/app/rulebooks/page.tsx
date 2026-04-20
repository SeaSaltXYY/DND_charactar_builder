"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Upload, Sparkles, Trash2, CheckCircle2, XCircle, Loader2, Info } from "lucide-react";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { useRulebookStore } from "@/stores/rulebook-store";

export default function RulebooksPage() {
  const { rulebooks, fetch: fetchBooks, remove } = useRulebookStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBooks().finally(() => setInitialized(true));
    const t = setInterval(fetchBooks, 5000);
    return () => clearInterval(t);
  }, [fetchBooks]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);
      const resp = await fetch("/api/rulebooks/upload", {
        method: "POST",
        body: form,
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `上传失败：${resp.status}`);
      }
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleLoadBuiltin() {
    setUploading(true);
    setError(null);
    try {
      const resp = await fetch("/api/rulebooks/load-builtin", { method: "POST" });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "加载失败");
      }
      await fetchBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-pixel-title text-pixel-lg text-pixel-gold text-shadow-pixel">
          📚 规则书管理
        </h1>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.md,.markdown,.docx,.chm"
            className="hidden"
            onChange={handleUpload}
          />
          <PixelButton
            variant="gold"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={14} />
            {uploading ? "上传中..." : "上传规则书"}
          </PixelButton>
          <PixelButton variant="blue" onClick={handleLoadBuiltin} disabled={uploading}>
            <Sparkles size={14} /> 加载内置示例
          </PixelButton>
        </div>
      </div>

      {error && (
        <div className="pixel-border-thin mb-4 bg-[#3a1a1a] p-3 font-silk text-sm text-pixel-red">
          ⚠ {error}
        </div>
      )}

      {/* 5e 不全书导入指引 */}
      <PixelCard
        title={
          <span className="flex items-center gap-2 text-pixel-gold">
            <Info size={14} /> 内置 5E 不全书
          </span>
        }
        className="mb-4"
      >
        <div className="space-y-2 text-sm leading-relaxed">
          <p>
            本系统已内置 <strong>D&D 5E 不全书</strong>（社区维护的中文规则合集）。
          </p>
          <p>
            <strong>首次使用时会自动导入</strong>，进入页面后系统将在后台进行向量化处理（约 3-10 分钟，取决于 embedding API 速度）。
            处理完成后状态会变为"就绪"。
          </p>
          <p className="text-text-muted">
            你也可以上传自己的额外规则书（PDF / TXT / MD / DOCX / CHM）。
            CHM 格式需要安装 p7zip（<code className="text-pixel-gold">brew install p7zip</code>）。
          </p>
        </div>
      </PixelCard>

      {!initialized && (
        <PixelCard>
          <div className="py-8 text-center text-text-muted">
            <Loader2 size={32} className="mx-auto mb-2 opacity-40 animate-spin" />
            <div className="font-silk text-pixel-base">加载中...</div>
          </div>
        </PixelCard>
      )}

      {initialized && rulebooks.length === 0 && (
        <PixelCard>
          <div className="py-8 text-center text-text-muted">
            <BookOpen size={48} className="mx-auto mb-2 opacity-40" />
            <div className="font-silk text-pixel-base">还没有规则书。</div>
            <div className="mt-2 text-sm">
              按照上方指引导入 5E 不全书，或上传你自己的规则书（PDF / TXT / MD / CHM）。
              也可以先加载内置示例试试看。
            </div>
          </div>
        </PixelCard>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rulebooks.map((b) => (
          <PixelCard
            key={b.id}
            variant="parchment"
            title={
              <span className="flex items-center gap-2 text-text-dark">
                <BookOpen size={16} />
                <span className="truncate">{b.name}</span>
              </span>
            }
          >
            <div className="space-y-2 text-text-dark">
              <div className="flex items-center gap-2 text-sm">
                <StatusBadge status={b.status} />
                <PixelBadge color={b.source === "builtin" ? "blue" : "gold"}>
                  {b.source === "builtin" ? "内置" : "上传"}
                </PixelBadge>
              </div>
              {b.status === "processing" && b.progress_info && (
                <div className="text-xs font-silk text-[#6a5200] bg-[#f5e6c8] px-2 py-1 border border-[#c0a060]">
                  ⏳ {b.progress_info}
                </div>
              )}
              {b.status === "error" && b.progress_info && (
                <div className="text-xs font-silk text-pixel-red">
                  {b.progress_info}
                </div>
              )}
              <div className="text-sm">
                <span className="font-silk">分块：</span>
                <span className="font-bold">{b.chunk_count}</span>
              </div>
              <div className="text-xs text-[#4a3020]">
                创建于 {new Date(b.created_at + "Z").toLocaleString()}
              </div>
              <div className="flex justify-end pt-2">
                <PixelButton
                  variant="red"
                  onClick={() => {
                    if (confirm(`确定删除「${b.name}」？`)) remove(b.id);
                  }}
                >
                  <Trash2 size={12} /> 删除
                </PixelButton>
              </div>
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ready")
    return (
      <span className="inline-flex items-center gap-1 border-2 border-[#0f5a0f] bg-pixel-green px-2 py-[1px] font-silk text-pixel-xs text-[#0a2a0a]">
        <CheckCircle2 size={10} /> 就绪
      </span>
    );
  if (status === "error")
    return (
      <span className="inline-flex items-center gap-1 border-2 border-[#7a1818] bg-pixel-red px-2 py-[1px] font-silk text-pixel-xs text-white">
        <XCircle size={10} /> 失败
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 border-2 border-[#6a5200] bg-pixel-gold px-2 py-[1px] font-silk text-pixel-xs text-text-dark">
      <Loader2 size={10} className="animate-spin" /> 处理中
    </span>
  );
}
