/**
 * 文件解析器：根据文件扩展名选择合适的解析方式，返回纯文本。
 */
import { execFile } from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  readdirSync,
  readFileSync,
  existsSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, extname } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function parseFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const ext = filename.toLowerCase().split(".").pop() || "";

  switch (ext) {
    case "pdf":
      return await parsePdf(buffer);
    case "docx":
      return await parseDocx(buffer);
    case "chm":
      return await parseChm(buffer, filename);
    case "txt":
    case "md":
    case "markdown":
      return buffer.toString("utf-8");
    default:
      try {
        return buffer.toString("utf-8");
      } catch {
        throw new Error(`不支持的文件类型: .${ext}`);
      }
  }
}

async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = (
    pdfParseModule as unknown as {
      default: (b: Buffer) => Promise<{ text: string }>;
    }
  ).default || (pdfParseModule as unknown as (b: Buffer) => Promise<{ text: string }>);
  const res = await pdfParse(buffer);
  return res.text || "";
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const res = await mammoth.extractRawText({ buffer });
  return res.value || "";
}

/**
 * CHM 解析：用 7z 解压后提取所有 HTML 的纯文本。
 * 前提：已安装 p7zip（brew install p7zip）
 */
async function parseChm(buffer: Buffer, filename: string): Promise<string> {
  const tmpDir = mkdtempSync(join(tmpdir(), "chm-"));
  const safeName = filename.replace(/[^\w.-]/g, "_");
  const chmPath = join(tmpDir, safeName);
  const outDir = join(tmpDir, "out");

  try {
    writeFileSync(chmPath, buffer);

    const sevenZip = await find7z();
    if (!sevenZip) {
      throw new Error(
        "未找到 7z 命令。请先安装 p7zip：\n  brew install p7zip\n然后重新上传。"
      );
    }

    console.log("[CHM] 开始解压...", { size: buffer.length, tmpDir });
    await execFileAsync(sevenZip, ["x", chmPath, `-o${outDir}`, "-y"], {
      timeout: 120_000,
    });

    console.log("[CHM] 解压完成，开始提取 HTML 文本...");
    const texts = collectHtmlTexts(outDir);
    console.log("[CHM] 提取完成，共", texts.length, "个有效文本块");

    if (texts.length === 0) {
      throw new Error("CHM 解压后未找到 HTML 内容，请确认文件完整。");
    }
    return texts.join("\n\n");
  } finally {
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // 清理失败不阻断
    }
  }
}

async function find7z(): Promise<string | null> {
  const candidates = [
    "/opt/homebrew/bin/7z",
    "/opt/homebrew/bin/7zz",
    "/usr/local/bin/7z",
    "/usr/local/bin/7zz",
    "7z",
    "7zz",
    "/usr/bin/7z",
  ];
  for (const cmd of candidates) {
    try {
      await execFileAsync(cmd, ["--help"], { timeout: 5000 });
      return cmd;
    } catch {
      continue;
    }
  }
  return null;
}

/** 递归遍历目录，提取所有 HTML 文件的纯文本 */
function collectHtmlTexts(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  walk(dir, results);
  return results.filter((t) => t.trim().length > 30);
}

function walk(current: string, results: string[]) {
  let entries;
  try {
    entries = readdirSync(current, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(current, entry.name);
    try {
      if (entry.isDirectory()) {
        walk(full, results);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (ext === ".html" || ext === ".htm") {
          const buf = readFileSync(full);
          const raw = decodeHtml(buf);
          const text = stripHtml(raw);
          if (text.length > 30) {
            results.push(text);
          }
        }
      }
    } catch {
      // 跳过无法处理的文件
    }
  }
}

function decodeHtml(buf: Buffer): string {
  const head = buf.subarray(0, Math.min(buf.length, 1024)).toString("ascii");
  const charsetMatch = head.match(/charset\s*=\s*["']?\s*([\w-]+)/i);
  const declared = charsetMatch?.[1]?.toLowerCase() ?? "";

  if (declared.includes("gb") || declared.includes("gbk") || declared === "big5") {
    try {
      const decoder = new TextDecoder(declared === "gb2312" ? "gbk" : declared);
      return decoder.decode(buf);
    } catch {
      // fallback
    }
  }

  const utf8 = buf.toString("utf-8");
  if (/\ufffd/.test(utf8.substring(0, 500))) {
    try {
      return new TextDecoder("gbk").decode(buf);
    } catch {
      // fallback
    }
  }
  return utf8;
}

/** 去除 HTML 标签，保留有意义的文本 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#\d+;/g, " ")
    .replace(/\s{3,}/g, "\n\n")
    .trim();
}
