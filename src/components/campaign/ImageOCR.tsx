"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { PixelButton } from "../ui/PixelButton";

interface Props {
  onText: (text: string) => void;
}

export function ImageOCR({ onText }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handle(file: File) {
    setBusy(true);
    setProgress(0);
    try {
      // 懒加载 tesseract.js 以减小初始 bundle
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(["chi_sim", "eng"], 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      onText(data.text || "");
    } catch (e) {
      console.error(e);
      alert("OCR 失败: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
          if (ref.current) ref.current.value = "";
        }}
      />
      <PixelButton
        variant="blue"
        onClick={() => ref.current?.click()}
        disabled={busy}
      >
        {busy ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            OCR {progress}%
          </>
        ) : (
          <>
            <ImagePlus size={12} /> 截图 OCR
          </>
        )}
      </PixelButton>
    </div>
  );
}
